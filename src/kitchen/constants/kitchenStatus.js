/**
 * Kitchen Status Constants for Rasoi Kitchen Platform.
 * Kitchen operations: Open, Busy, Closed
 */

export const KITCHEN_STATUS = {
  OPEN: 'Open',
  BUSY: 'Busy',
  CLOSED: 'Closed',
}

export const KITCHEN_STATUS_CONFIG = {
  [KITCHEN_STATUS.OPEN]: {
    label: 'Kitchen Open',
    badgeText: 'Accepting Orders',
    desc: 'Normal kitchen operations. Est. prep time 15-20 mins.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dotColor: 'bg-emerald-500',
    headerBg: 'bg-emerald-500',
  },
  [KITCHEN_STATUS.BUSY]: {
    label: 'Kitchen Busy',
    badgeText: 'High Rush',
    desc: 'High ticket volume. Orders may take 30-40 mins prep.',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    dotColor: 'bg-amber-500',
    headerBg: 'bg-amber-500',
  },
  [KITCHEN_STATUS.CLOSED]: {
    label: 'Kitchen Closed',
    badgeText: 'Service Paused',
    desc: 'Kitchen is currently not accepting new online orders.',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    dotColor: 'bg-rose-500',
    headerBg: 'bg-rose-500',
  },
}
