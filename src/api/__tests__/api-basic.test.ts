import { describe, it, expect } from 'vitest'
import { subscriptionService } from '../subscriptionService'

describe('API Services - Basic Tests', () => {
  describe('subscriptionService (Mock)', () => {
    it('should return mock subscription plans', async () => {
      const result = await subscriptionService.getPlans()

      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThan(0)
    })

    it('should return mock current subscription', async () => {
      const result = await subscriptionService.getCurrentSubscription()

      expect(result.data).toBeDefined()
      expect(result.data).toHaveProperty('id')
      expect(result.data).toHaveProperty('status')
      expect(result.data.status).toBe('active')
    })

    it('should return mock usage data', async () => {
      const result = await subscriptionService.getUsage()

      expect(result.data).toBeDefined()
      expect(result.data).toHaveProperty('tables_count')
      expect(typeof result.data.tables_count).toBe('number')
    })
  })

  describe('Basic API functionality', () => {
    it('should handle successful responses', () => {
      expect(typeof subscriptionService.getPlans).toBe('function')
      expect(typeof subscriptionService.getCurrentSubscription).toBe('function')
      expect(typeof subscriptionService.getUsage).toBe('function')
    })
  })
})