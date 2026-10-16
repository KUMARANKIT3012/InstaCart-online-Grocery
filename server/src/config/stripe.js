import Stripe from 'stripe'

let stripeClient

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error('STRIPE_SECRET_KEY is not configured')
    error.statusCode = 503
    throw error
  }

  stripeClient ||= new Stripe(process.env.STRIPE_SECRET_KEY)
  return stripeClient
}

export function getStripeWebhookSecret() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    const error = new Error('STRIPE_WEBHOOK_SECRET is not configured')
    error.statusCode = 503
    throw error
  }

  return process.env.STRIPE_WEBHOOK_SECRET
}