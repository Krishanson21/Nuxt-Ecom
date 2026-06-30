# Product Requirements Document: Rewards and Gamification

## 1. Overview

Exclusive needs a private rewards experience that encourages repeat purchasing and ongoing customer engagement without public rankings or competition.

The initial product should give customers a clear sense of progress through reward points, membership tiers, weekly streaks, and an account dashboard. The system should reward trustworthy actions first: completed purchases, profile completion, wishlist saves, and daily check-ins.

## 2. Problem Statement

Customers browse products, place a single order, and often do not return. The current storefront gives no persistent recognition for shopping behavior. A repeat customer can buy multiple products and still feel like every visit starts from zero.

## 3. Goals

- Increase repeat purchase behavior by making completed orders contribute to visible progress.
- Give customers a private progress dashboard inside their account.
- Create lightweight non-purchase engagement loops through wishlists, profile completion, and daily check-ins.
- Avoid public comparison mechanics such as leaderboards or customer rankings.
- Build a backend-backed rewards ledger so reward history is auditable and duplicate rewards can be controlled.

## 4. Non-Goals

- Public leaderboards.
- Competitive ranking between customers.
- Redeemable cash-equivalent points in the MVP.
- Full referral program in the MVP.
- Full customer review submission and moderation in the MVP.
- Complex coupon, discount, or perk automation in the MVP.
- Replacing the existing localStorage authentication system in this phase.

## 5. Target Users

- Returning shoppers who have previously purchased from Exclusive.
- Logged-in customers managing account details, cart, wishlist, and rewards.
- Anonymous shoppers may earn device-scoped demo rewards, but long-term production behavior should require stable user accounts.

## 6. Success Metrics

- Increase repeat purchase rate.
- Increase account page visits.
- Increase wishlist save rate.
- Increase profile completion rate.
- Increase weekly active returning customers.
- Track reward dashboard engagement through account page views and daily check-in clicks.

## 7. MVP Scope

### Included

- Reward points ledger.
- Account reward summary.
- Membership tiers: Bronze, Silver, Gold, Platinum.
- Tier progress indicator.
- Weekly streak count.
- Daily check-in reward.
- Purchase reward after successful checkout.
- One-time profile completion reward.
- One-time wishlist reward per saved product.
- Recent rewards history.

### Deferred

- Referral links and attribution.
- Review submission rewards.
- Reward redemption.
- Admin reward rule management.
- Email or push notifications.
- Fraud scoring beyond simple duplicate prevention.

## 8. User Stories

- As a customer, I want to earn points when I complete a purchase so that shopping moves me toward a higher tier.
- As a customer, I want to see my current tier and points in my account so that I understand my progress.
- As a customer, I want to see how close I am to the next tier so that I have a reason to return.
- As a customer, I want to earn a small reward for completing my profile so that my account feels finished.
- As a customer, I want to earn a small reward for saving a product to my wishlist so that browsing feels valuable.
- As a customer, I want to claim a daily check-in reward so that I have a lightweight reason to come back.
- As a customer, I do not want my activity shown on a public leaderboard.

## 9. Reward Rules

| Action | Points | Duplicate Rule | Notes |
| --- | ---: | --- | --- |
| Completed purchase | 1 point per $1 order total | Once per order ID | Award only after order creation succeeds. |
| Profile completed | 150 | Once per user | Requires first name, last name, email, and phone. |
| Wishlist save | 10 | Once per user per product ID | Removing and re-adding the same product should not grant more points. |
| Daily check-in | 25 | Once per calendar day | Used for lightweight engagement. |

## 10. Tier Rules

| Tier | Minimum Points | Next Tier |
| --- | ---: | --- |
| Bronze | 0 | Silver |
| Silver | 1,000 | Gold |
| Gold | 2,500 | Platinum |
| Platinum | 5,000 | None |

Tier status is calculated from total earned points. MVP points do not expire.

## 11. Streak Rules

- A weekly streak is based on meaningful engagement within the current week.
- MVP meaningful actions are completed purchases and daily check-ins.
- A streak increments for consecutive weeks containing at least one meaningful action.
- Missing a week breaks the active streak.

## 12. Functional Requirements

### Rewards Dashboard

- Show current tier.
- Show total points.
- Show weekly streak count.
- Show next tier.
- Show progress toward next tier.
- Show recent rewards.
- Provide a daily check-in action.
- Keep all information private to the current account or device identity.

### Checkout Reward

- Checkout must create an order record.
- Purchase points must be awarded only after order creation succeeds.
- Purchase reward must include order ID and order total.
- Cart should clear after successful checkout.

### Profile Completion Reward

- Saving account details should check whether required profile fields are complete.
- Award profile completion points once.
- Reward summary should update after the reward is awarded.

### Wishlist Reward

- Saving a product to wishlist should award points once per product.
- Reward should be skipped if that product was already rewarded for the same user.

### Daily Check-In Reward

- Account dashboard should expose a daily check-in button.
- Reward should be awarded once per day.
- Repeated clicks on the same day should not create duplicate points.

## 13. Technical Requirements

### Data Collections

`orders`

- `userKey`
- `items`
- `orderTotal`
- `status`
- `createdAt`

`reward_ledger`

- `userKey`
- `action`
- `label`
- `points`
- `metadata`
- `createdAt`

### API Endpoints

`POST /api/orders`

- Creates a completed order from cart items.
- Requires `x-user-key`.
- Returns `orderId` and `orderTotal`.

`GET /api/rewards`

- Returns reward summary for `x-user-key`.
- Includes total points, tier, next tier, progress, weekly streak, and recent rewards.

`POST /api/rewards`

- Awards points for a known reward action.
- Applies duplicate rules.
- Returns updated summary.

## 14. UX Requirements

- Rewards must appear inside the account page, not as a public page.
- Dashboard should be compact and scannable.
- Reward progress should be visible without requiring the user to understand internal rules.
- Empty state should explain how to earn points.
- Checkout success should tell the customer how many points were earned.

## 15. Privacy and Safety

- No public customer comparisons.
- No leaderboard data.
- No public reward profile pages.
- Reward history should be scoped to the current user identity.
- Production version should replace localStorage auth with server-side accounts before launch.

## 16. Acceptance Criteria

- A customer can complete checkout and earn purchase points.
- A customer can open the account page and see total points, tier, streak, next tier, and recent rewards.
- A customer can complete profile fields and earn the profile completion reward once.
- A customer can save a product to wishlist and earn wishlist points once per product.
- A customer can claim a daily check-in reward once per day.
- Repeating the same one-time action does not duplicate rewards.
- No public leaderboard or ranking UI exists.
- Production build succeeds.

## 17. Open Questions

- Should points eventually be redeemable for discounts, shipping perks, or exclusive products?
- What exact benefits should Silver, Gold, and Platinum unlock?
- Should rewards require login, or should anonymous device rewards be merged after signup?
- Should points expire after inactivity?
- Should refunds reverse purchase points?
- How should referrals be attributed and fraud-checked in phase two?
- Should reviews require verified purchase status before awarding points?

## 18. Phase Plan

### Phase 1: Rewards MVP

- Backend reward ledger.
- Checkout order creation.
- Purchase/profile/wishlist/daily check-in rewards.
- Account reward dashboard.
- Basic duplicate prevention.

### Phase 2: Trustworthy Engagement Events

- Real review submission flow.
- Verified-purchase review rewards.
- Referral codes and attribution.
- Reward adjustment for refunds.
- Logged-in user account backend.

### Phase 3: Perks and Redemption

- Tier-specific benefits.
- Point redemption.
- Admin reward controls.
- Customer notifications.
- Analytics dashboards.
