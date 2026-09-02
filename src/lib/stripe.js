import { loadStripe } from '@stripe/stripe-js'

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const isPlaceholder = (value) => !value || value.includes('your-key') || value.startsWith('your-') || value === 'placeholder'

export const stripePromise = !isPlaceholder(key) ? loadStripe(key) : null
export const isStripeConfigured = !isPlaceholder(key)
