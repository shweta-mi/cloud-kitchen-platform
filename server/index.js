import express from 'express'
import { randomInt } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { INITIAL_MOCK_ORDERS } from '../src/customer/data/mockOrders.js'
import { MENU_ITEMS } from '../src/customer/data/menuData.js'
import { INITIAL_INVENTORY } from '../src/kitchen/services/inventoryService.js'

const here = dirname(fileURLToPath(import.meta.url))
const dbPath = resolve(process.env.RASOI_DB_PATH || resolve(here, 'data/rasoi.sqlite'))
mkdirSync(dirname(dbPath), { recursive: true })
const db = new DatabaseSync(dbPath)
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, data TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS menu_items (id TEXT PRIMARY KEY, data TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS inventory_items (id TEXT PRIMARY KEY, data TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`)

const count = (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count
if (!count('orders')) {
  const insert = db.prepare('INSERT INTO orders (id, data) VALUES (?, ?)')
  for (const order of INITIAL_MOCK_ORDERS) insert.run(order.id, JSON.stringify(order))
}
if (!count('menu_items')) {
  const insert = db.prepare('INSERT INTO menu_items (id, data) VALUES (?, ?)')
  for (const item of MENU_ITEMS) insert.run(item.id, JSON.stringify(item))
}
if (!count('inventory_items')) {
  const insert = db.prepare('INSERT INTO inventory_items (id, data) VALUES (?, ?)')
  for (const item of INITIAL_INVENTORY) insert.run(item.id, JSON.stringify(item))
}
db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('kitchenStatus', 'Open')").run()

const rows = (table) => db.prepare(`SELECT data FROM ${table}`).all().map((row) => JSON.parse(row.data))
const getOrder = (id) => {
  const row = db.prepare('SELECT data FROM orders WHERE id = ?').get(id.toLowerCase())
  return row ? JSON.parse(row.data) : null
}
const writeEntity = (table, value) => {
  db.prepare(`INSERT INTO ${table} (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data`)
    .run(value.id, JSON.stringify(value))
  return value
}

const clients = new Set()
function publish(resource, data) {
  const message = `event: ${resource}\ndata: ${JSON.stringify(data)}\n\n`
  for (const response of clients) response.write(message)
}
function publishOrders() { publish('orders', rows('orders')) }
function publishMenu() { publish('menu', rows('menu_items')) }
function publishInventory() { publish('inventory', rows('inventory_items')) }
function publishKitchenStatus() { publish('kitchenStatus', db.prepare("SELECT value FROM settings WHERE key = 'kitchenStatus'").get().value) }

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

app.get('/api/health', (_req, res) => res.json({ ok: true, database: 'sqlite' }))
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  })
  res.write('retry: 3000\n\n')
  clients.add(res)
  const heartbeat = setInterval(() => res.write(': keep-alive\n\n'), 20_000)
  req.on('close', () => { clearInterval(heartbeat); clients.delete(res) })
})

app.get('/api/bootstrap', (_req, res) => res.json({
  orders: rows('orders'),
  menu: rows('menu_items'),
  inventory: rows('inventory_items'),
  kitchenStatus: db.prepare("SELECT value FROM settings WHERE key = 'kitchenStatus'").get().value,
}))

app.get('/api/orders', (_req, res) => res.json(rows('orders').sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
app.get('/api/orders/:id', (req, res) => {
  const order = getOrder(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})
app.post('/api/orders', (req, res) => {
  const { items, customer } = req.body || {}
  if (!Array.isArray(items) || !items.length || items.length > 50) return res.status(400).json({ error: 'Add at least one menu item.' })
  if (items.some((item) => !item.name || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 99 || !Number.isFinite(Number(item.price)) || Number(item.price) < 0)) {
    return res.status(400).json({ error: 'One or more order items are invalid.' })
  }
  if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim()) return res.status(400).json({ error: 'Name, phone, and delivery address are required.' })
  const phone = String(customer.phone).replace(/\D/g, '')
  if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number.' })
  const pricedItems = []
  for (const requested of items) {
    const menuRow = db.prepare('SELECT data FROM menu_items WHERE id = ?').get(String(requested.id || requested.menuItemId || ''))
    const menuItem = menuRow ? JSON.parse(menuRow.data) : null
    if (!menuItem || !menuItem.isAvailable) return res.status(409).json({ error: `${requested.name || 'A selected dish'} is unavailable. Refresh the menu and try again.` })
    pricedItems.push({ menuItemId: menuItem.id, name: menuItem.name, quantity: Number(requested.quantity), price: Number(menuItem.price) })
  }
  const subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal >= 300 ? 0 : 30
  const total = subtotal ? subtotal + deliveryFee + Math.round(subtotal * 0.05) : 0
  let id
  do { id = `order-${randomInt(1000, 10000)}` } while (getOrder(id))
  const now = new Date().toISOString()
  const order = {
    id,
    items: pricedItems,
    total,
    status: 'Placed',
    customer: {
      name: String(customer.name).trim().slice(0, 120),
      phone,
      address: String(customer.address).trim().slice(0, 500),
      instructions: String(customer.instructions || '').trim().slice(0, 500),
    },
    createdAt: now,
    updatedAt: now,
  }
  writeEntity('orders', order)
  publishOrders()
  res.status(201).json(order)
})
app.patch('/api/orders/:id/status', (req, res) => {
  const order = getOrder(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const allowed = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled']
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ error: 'Invalid order status.' })
  const updated = { ...order, status: req.body.status, updatedAt: new Date().toISOString() }
  writeEntity('orders', updated)
  publishOrders()
  res.json(updated)
})

app.get('/api/menu', (_req, res) => res.json(rows('menu_items')))
app.post('/api/menu', (req, res) => {
  const { name, price } = req.body || {}
  if (!name?.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0) return res.status(400).json({ error: 'Dish name and a positive price are required.' })
  const item = { id: `item-${randomInt(10000, 1000000)}`, description: '', category: 'Main Course', isAvailable: true, isVeg: true, spiceLevel: 'Medium', rating: 4.8, ratingCount: 1, badge: 'New', image: '', ...req.body, name: name.trim().slice(0, 120), price: Number(price) }
  writeEntity('menu_items', item)
  publishMenu()
  res.status(201).json(item)
})
app.put('/api/menu/:id', (req, res) => {
  const current = db.prepare('SELECT data FROM menu_items WHERE id = ?').get(req.params.id)
  if (!current) return res.status(404).json({ error: 'Menu item not found' })
  if (req.body.price !== undefined && (!Number.isFinite(Number(req.body.price)) || Number(req.body.price) <= 0)) return res.status(400).json({ error: 'Dish price must be a positive number.' })
  const updated = { ...JSON.parse(current.data), ...req.body, id: req.params.id, price: Number(req.body.price ?? JSON.parse(current.data).price) }
  writeEntity('menu_items', updated)
  publishMenu()
  res.json(updated)
})
app.delete('/api/menu/:id', (req, res) => {
  const result = db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id)
  if (!result.changes) return res.status(404).json({ error: 'Menu item not found' })
  publishMenu()
  res.status(204).end()
})

app.get('/api/kitchen/status', (_req, res) => res.json({ status: db.prepare("SELECT value FROM settings WHERE key = 'kitchenStatus'").get().value }))
app.put('/api/kitchen/status', (req, res) => {
  if (!['Open', 'Busy', 'Closed'].includes(req.body?.status)) return res.status(400).json({ error: 'Invalid kitchen status.' })
  db.prepare("UPDATE settings SET value = ? WHERE key = 'kitchenStatus'").run(req.body.status)
  publishKitchenStatus()
  res.json({ status: req.body.status })
})

app.get('/api/inventory', (_req, res) => res.json(rows('inventory_items')))
app.post('/api/inventory/:id/adjust', (req, res) => {
  const current = db.prepare('SELECT data FROM inventory_items WHERE id = ?').get(req.params.id)
  const delta = Number(req.body?.delta)
  if (!current) return res.status(404).json({ error: 'Inventory item not found' })
  if (!Number.isFinite(delta)) return res.status(400).json({ error: 'Inventory adjustment must be numeric.' })
  const item = JSON.parse(current.data)
  const updated = { ...item, quantity: Number(Math.max(0, item.quantity + delta).toFixed(1)), updatedAt: new Date().toISOString() }
  writeEntity('inventory_items', updated)
  publishInventory()
  res.json(updated)
})
app.post('/api/inventory', (req, res) => {
  if (!req.body?.name?.trim()) return res.status(400).json({ error: 'Inventory item name is required.' })
  const item = { id: `inv-${randomInt(10000, 1000000)}`, category: 'General', quantity: 0, unit: 'units', minThreshold: 5, lastRestocked: new Date().toISOString().slice(0, 10), costPerUnit: 0, ...req.body, name: req.body.name.trim().slice(0, 120) }
  writeEntity('inventory_items', item)
  publishInventory()
  res.status(201).json(item)
})
app.put('/api/inventory/:id', (req, res) => {
  const current = db.prepare('SELECT data FROM inventory_items WHERE id = ?').get(req.params.id)
  if (!current) return res.status(404).json({ error: 'Inventory item not found' })
  const updated = { ...JSON.parse(current.data), ...req.body, id: req.params.id, updatedAt: new Date().toISOString() }
  writeEntity('inventory_items', updated)
  publishInventory()
  res.json(updated)
})
app.delete('/api/inventory/:id', (req, res) => {
  const result = db.prepare('DELETE FROM inventory_items WHERE id = ?').run(req.params.id)
  if (!result.changes) return res.status(404).json({ error: 'Inventory item not found' })
  publishInventory()
  res.status(204).end()
})

const dist = resolve(here, '../dist')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/.*/, (_req, res) => res.sendFile(resolve(dist, 'index.html')))
}

const port = Number(process.env.PORT || 3001)
const host = process.env.HOST || '0.0.0.0'
app.listen(port, host, () => console.log(`Rasoi API ready at http://${host}:${port} (SQLite: ${dbPath})`))
