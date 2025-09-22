import { describe, it, expect, beforeEach } from 'vitest'
import { subscriptionService } from '../subscriptionService'

describe('subscriptionService (Mock)', () => {
  beforeEach(() => {
    // Reset any state if needed
  })

  describe('getPlans', () => {
    it('should return mock subscription plans', async () => {
      const result = await subscriptionService.getPlans()

      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThan(0)

      // Check structure of first plan
      const firstPlan = result.data[0]
      expect(firstPlan).toHaveProperty('id')
      expect(firstPlan).toHaveProperty('name')
      expect(firstPlan).toHaveProperty('description')
      expect(firstPlan).toHaveProperty('price_monthly')
      expect(firstPlan).toHaveProperty('price_yearly')
      expect(firstPlan).toHaveProperty('limits')
      expect(firstPlan.limits).toHaveProperty('max_tables')
      expect(firstPlan.limits).toHaveProperty('max_users')
    })
  })

  describe('getPlanById', () => {
    it('should return plan by id', async () => {
      const result = await subscriptionService.getPlanById('plan_pro')

      expect(result.data).toBeDefined()
      expect(result.data.id).toBe('plan_pro')
      expect(result.data.name).toBe('Profissional')
    })

    it('should return first plan for unknown id', async () => {
      const result = await subscriptionService.getPlanById('unknown-plan')

      expect(result.data).toBeDefined()
      expect(result.data.id).toBe('plan_basic')
    })
  })

  describe('getCurrentSubscription', () => {
    it('should return mock current subscription', async () => {
      const result = await subscriptionService.getCurrentSubscription()

      expect(result.data).toBeDefined()
      expect(result.data).toHaveProperty('id')
      expect(result.data).toHaveProperty('organization_id')
      expect(result.data).toHaveProperty('plan_id')
      expect(result.data).toHaveProperty('status')
      expect(result.data).toHaveProperty('billing_cycle')
      expect(result.data.status).toBe('active')
    })
  })

  describe('getUsage', () => {
    it('should return mock usage data', async () => {
      const result = await subscriptionService.getUsage()

      expect(result.data).toBeDefined()
      expect(result.data).toHaveProperty('organization_id')
      expect(result.data).toHaveProperty('tables_count')
      expect(result.data).toHaveProperty('users_count')
      expect(result.data).toHaveProperty('products_count')
      expect(result.data).toHaveProperty('reservations_today')
      expect(typeof result.data.tables_count).toBe('number')
      expect(typeof result.data.users_count).toBe('number')
    })
  })

  describe('getLimits', () => {
    it('should return mock limits data', async () => {
      const result = await subscriptionService.getLimits()

      expect(result.data).toBeDefined()
      expect(result.data).toHaveProperty('max_tables')
      expect(result.data).toHaveProperty('max_users')
      expect(result.data).toHaveProperty('max_products')
      expect(result.data).toHaveProperty('max_reservations_per_day')
      expect(result.data).toHaveProperty('notifications_enabled')
      expect(result.data).toHaveProperty('reports_enabled')
      expect(typeof result.data.max_tables).toBe('number')
    })
  })

  describe('subscribe', () => {
    it('should return subscription with provided plan and billing cycle', async () => {
      const result = await subscriptionService.subscribe('plan_enterprise', 'yearly')

      expect(result.data).toBeDefined()
      expect(result.data.plan_id).toBe('plan_enterprise')
      expect(result.data.billing_cycle).toBe('yearly')
    })
  })

  describe('changePlan', () => {
    it('should return subscription with new plan', async () => {
      const result = await subscriptionService.changePlan('plan_basic', 'monthly')

      expect(result.data).toBeDefined()
      expect(result.data.plan_id).toBe('plan_basic')
      expect(result.data.billing_cycle).toBe('monthly')
    })

    it('should preserve current billing cycle if not provided', async () => {
      const result = await subscriptionService.changePlan('plan_basic')

      expect(result.data).toBeDefined()
      expect(result.data.plan_id).toBe('plan_basic')
      expect(result.data.billing_cycle).toBe('monthly') // default from mock
    })
  })

  describe('cancelSubscription', () => {
    it('should return cancelled subscription', async () => {
      const result = await subscriptionService.cancelSubscription()

      expect(result.data).toBeDefined()
      expect(result.data.status).toBe('cancelled')
      expect(result.data.cancelled_at).toBeDefined()
    })
  })

  describe('reactivateSubscription', () => {
    it('should return active subscription', async () => {
      const result = await subscriptionService.reactivateSubscription()

      expect(result.data).toBeDefined()
      expect(result.data.status).toBe('active')
      expect(result.data.cancelled_at).toBeUndefined()
    })
  })

  describe('getInvoices', () => {
    it('should return empty invoices array', async () => {
      const result = await subscriptionService.getInvoices()

      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBe(0)
    })
  })

  describe('createCheckoutSession', () => {
    it('should return mock checkout URL', async () => {
      const result = await subscriptionService.createCheckoutSession('plan_pro', 'monthly')

      expect(result.data).toBeDefined()
      expect(result.data).toHaveProperty('checkout_url')
      expect(result.data.checkout_url).toBe('#mock-checkout')
    })
  })
})