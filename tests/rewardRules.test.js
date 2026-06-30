import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateWeeklyStreak,
  resolvePoints,
  resolveTier,
  validateRewardPayload
} from '../app/server/utils/rewardRules.js'

test('validates unknown reward actions', () => {
  const result = validateRewardPayload({ action: 'unknown_action' })

  assert.equal(result.ok, false)
  assert.equal(result.error, 'Unknown reward action')
})

test('validates purchase reward metadata', () => {
  assert.equal(validateRewardPayload({ action: 'purchase', metadata: { orderId: '1' } }).ok, false)
  assert.equal(validateRewardPayload({ action: 'purchase', metadata: { orderId: '1', orderTotal: 0 } }).ok, false)

  const result = validateRewardPayload({
    action: 'purchase',
    metadata: { orderId: 'order-1', orderTotal: 49.99 }
  })

  assert.equal(result.ok, true)
  assert.equal(resolvePoints(result.rule, result.metadata), 49)
})

test('validates wishlist reward metadata', () => {
  assert.equal(validateRewardPayload({ action: 'wishlist_add', metadata: {} }).ok, false)
  assert.equal(validateRewardPayload({ action: 'wishlist_add', metadata: { productId: 10 } }).ok, true)
})

test('resolves reward tiers', () => {
  assert.deepEqual(resolveTier(0), { name: 'Bronze', nextTier: 'Silver', nextTierAt: 1000 })
  assert.deepEqual(resolveTier(1000), { name: 'Silver', nextTier: 'Gold', nextTierAt: 2500 })
  assert.deepEqual(resolveTier(2500), { name: 'Gold', nextTier: 'Platinum', nextTierAt: 5000 })
  assert.deepEqual(resolveTier(5000), { name: 'Platinum', nextTier: null, nextTierAt: null })
})

test('calculates weekly streak from meaningful actions', () => {
  const now = new Date('2026-06-30T12:00:00.000Z')
  const entries = [
    { action: 'daily_check_in', createdAt: new Date('2026-06-30T10:00:00.000Z') },
    { action: 'purchase', createdAt: new Date('2026-06-23T10:00:00.000Z') },
    { action: 'wishlist_add', createdAt: new Date('2026-06-16T10:00:00.000Z') }
  ]

  assert.equal(calculateWeeklyStreak(entries, now), 2)
})
