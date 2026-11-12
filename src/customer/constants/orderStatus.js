/**
 * Shared order status constants across Rasoi Kitchen platform.
 * These match the kitchen dashboard statuses:
 * Placed -> Accepted -> Preparing -> Ready -> Completed, Cancelled
 */
export const ORDER_STATUS = {
  PLACED: 'Placed',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_LIST = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
]

export const STATUS_DETAILS = {
  [ORDER_STATUS.PLACED]: {
    label: 'Order Placed',
    description: 'We have received your order and transmitted it to the kitchen.',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    dotColor: 'bg-amber-500',
    stepIndex: 0,
    estimatedMinutes: 30,
  },
  [ORDER_STATUS.ACCEPTED]: {
    label: 'Order Accepted',
    description: 'The head chef has accepted your order and ingredients are ready.',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    dotColor: 'bg-blue-500',
    stepIndex: 1,
    estimatedMinutes: 25,
  },
  [ORDER_STATUS.PREPARING]: {
    label: 'Cooking in Progress',
    description: 'Your food is sizzling in the pan, freshly cooked to perfection.',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    dotColor: 'bg-orange-500',
    stepIndex: 2,
    estimatedMinutes: 15,
  },
  [ORDER_STATUS.READY]: {
    label: 'Packed & Ready',
    description: 'Freshly packed in eco-friendly insulated packaging, awaiting rider pickup.',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    dotColor: 'bg-purple-500',
    stepIndex: 3,
    estimatedMinutes: 8,
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'Delivered',
    description: 'Order delivered hot & fresh. Enjoy your homestyle meal!',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dotColor: 'bg-emerald-500',
    stepIndex: 4,
    estimatedMinutes: 0,
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Order Cancelled',
    description: 'This order has been cancelled.',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    dotColor: 'bg-rose-500',
    stepIndex: -1,
    estimatedMinutes: 0,
  },
}
