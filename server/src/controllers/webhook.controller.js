import { constructStripeEvent } from '../services/payment.service.js'
import { markOrderPaymentStatus } from '../services/order.service.js'

export async function stripeWebhook(req, res, next) {
  try {
    const event = constructStripeEvent(req.body, req.headers['stripe-signature'])
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata?.orderId

    if (orderId && ['payment_intent.succeeded', 'payment_intent.payment_failed'].includes(event.type)) {
      await markOrderPaymentStatus(
        orderId,
        event.type === 'payment_intent.succeeded' ? 'paid' : 'failed',
        paymentIntent.id,
      )
    }

    res.json({ received: true })
  } catch (error) {
    if (error.type === 'StripeSignatureVerificationError') {
      error.statusCode = 400
      error.appCode = 'INVALID_STRIPE_SIGNATURE'
    }
    next(error)
  }
}