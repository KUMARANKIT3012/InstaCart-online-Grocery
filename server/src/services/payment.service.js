import { getStripeClient, getStripeWebhookSecret } from '../config/stripe.js'

export async function createOrderPaymentIntent({ orderId, userId, total }) {
  const amount = Math.round(Number(total) * 100)
  if (amount < 50) {
    const error = new Error('Order total must be at least $0.50')
    error.statusCode = 400
    throw error
  }

  const stripe = getStripeClient()
  return stripe.paymentIntents.create(
    {
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: String(orderId), userId: String(userId) },
    },
    { idempotencyKey: `instacart-order-${orderId}` },
  )
}

export function constructStripeEvent(payload, signature) {
  return getStripeClient().webhooks.constructEvent(
    payload,
    signature,
    getStripeWebhookSecret(),
  )
}