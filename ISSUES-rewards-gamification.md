# Rewards and Gamification Issue Backlog

Source PRD: [PRD-rewards-gamification.md](./PRD-rewards-gamification.md)

## Epic 1: Rewards MVP

### Issue 1: Add Backend Rewards Ledger

Priority: P0  
Status: Done

Create a backend-backed rewards ledger that stores reward events and calculates customer reward summaries.

Acceptance criteria:
- `reward_ledger` collection stores `userKey`, `action`, `label`, `points`, `metadata`, and `createdAt`.
- `GET /api/rewards` returns total points, tier, next tier, progress, weekly streak, and recent rewards.
- `POST /api/rewards` awards points for supported reward actions.
- Duplicate prevention is applied for one-time and once-per-day rewards.

### Issue 2: Add Order Creation Endpoint

Priority: P0  
Status: Done

Create an order endpoint that turns cart items into a completed order record.

Acceptance criteria:
- `POST /api/orders` creates an order document.
- Endpoint requires `x-user-key`.
- Endpoint rejects empty carts.
- Response includes `orderId` and `orderTotal`.

### Issue 3: Award Points After Checkout

Priority: P0  
Status: Done

Award purchase points only after order creation succeeds.

Acceptance criteria:
- Checkout creates an order before awarding points.
- Purchase reward includes `orderId` and `orderTotal`.
- Purchase points are calculated as 1 point per $1 order total.
- Cart clears after successful checkout.
- Checkout success message tells the customer how many points were earned.

### Issue 4: Add Account Rewards Dashboard

Priority: P0  
Status: Done

Add a private rewards dashboard to the account page.

Acceptance criteria:
- Account page displays current tier.
- Account page displays total points.
- Account page displays weekly streak.
- Account page displays next tier.
- Account page displays progress toward next tier.
- Account page displays recent rewards.
- Dashboard is visible only inside account UI.

### Issue 5: Award Profile Completion Reward

Priority: P1  
Status: Done

Award a one-time reward when the customer completes required profile fields.

Acceptance criteria:
- Required fields are first name, last name, email, and phone.
- Reward action is `profile_completed`.
- Customer receives 150 points once.
- Saving profile again does not duplicate the reward.

### Issue 6: Award Wishlist Save Reward

Priority: P1  
Status: Done

Award a small reward when a customer saves a product to wishlist.

Acceptance criteria:
- Reward action is `wishlist_add`.
- Customer receives 10 points.
- Reward is awarded once per product ID per customer.
- Removing and re-adding the same product does not duplicate the reward.

### Issue 7: Add Daily Check-In Reward

Priority: P1  
Status: Done

Allow customers to claim a daily check-in reward from the account dashboard.

Acceptance criteria:
- Account dashboard includes a daily check-in action.
- Reward action is `daily_check_in`.
- Customer receives 25 points.
- Customer can only receive this reward once per calendar day.

## Epic 2: Production Hardening

### Issue 8: Replace localStorage Auth With Server-Side Users

Priority: P0  
Status: Open

Move authentication and user profile data out of localStorage and into a backend user model.

Acceptance criteria:
- Users are stored in MongoDB or a dedicated auth provider.
- Passwords are never stored in plain text.
- Reward `userKey` maps to a stable backend user ID.
- Login, signup, profile, cart, wishlist, orders, and rewards use the same user identity.
- Anonymous reward data has a documented migration path into a user account.

### Issue 9: Add Reward Ledger Indexes

Priority: P1  
Status: Done

Add database indexes to keep reward summary and duplicate checks efficient.

Acceptance criteria:
- Index exists for `{ userKey: 1, createdAt: -1 }`.
- Index exists for one-time action checks by `userKey` and `action`.
- Index supports product-level duplicate checks for wishlist rewards.
- Index supports once-per-day daily check-in lookups.

### Issue 10: Add Reward API Validation

Priority: P1  
Status: Done

Validate reward and order payloads before writing to MongoDB.

Acceptance criteria:
- Unknown reward actions are rejected.
- Invalid or missing metadata is rejected for actions that require it.
- Order item quantity and price are validated.
- Negative, zero, or non-numeric prices are handled safely.
- API returns consistent error responses.

### Issue 11: Add Reward and Checkout Tests

Priority: P1  
Status: Partially Done

Add automated coverage for reward rules and checkout behavior.

Acceptance criteria:
- Tests cover purchase reward calculation.
- Tests cover profile completion duplicate prevention.
- Tests cover wishlist duplicate prevention.
- Tests cover daily check-in duplicate prevention.
- Tests cover checkout order creation and cart clearing.
- `npm run build` still passes.

### Issue 12: Add Loading, Error, and Disabled States

Priority: P2  
Status: Done

Improve dashboard and action states around network requests.

Acceptance criteria:
- Rewards dashboard shows loading state while fetching.
- Daily check-in button disables while request is in flight.
- Daily check-in communicates when today has already been claimed.
- Rewards API errors are visible in a user-friendly way.
- Checkout button cannot double-submit.

### Issue 13: Add Reward History Page or Modal

Priority: P2  
Status: Done

Allow customers to inspect more than the latest few reward events.

Acceptance criteria:
- Customer can view full reward history.
- History includes date, action label, and points.
- History remains private to the customer.
- History supports empty state.

## Epic 3: Trustworthy Engagement Events

### Issue 14: Build Review Submission Flow

Priority: P2  
Status: Open

Create real product review submission instead of static review counts.

Acceptance criteria:
- Product detail page allows eligible customers to submit a review.
- Reviews are stored in backend collection.
- Product review counts are derived from stored reviews.
- Review submission validates rating and text.
- Review can be tied to a user ID.

### Issue 15: Award Verified Review Rewards

Priority: P2  
Status: Open

Award points when a customer submits a valid review.

Acceptance criteria:
- Reward action exists for review submission.
- Review reward is awarded once per user per product.
- Optional verified-purchase gate is supported.
- Duplicate reviews do not generate duplicate points.

### Issue 16: Add Referral Codes and Attribution

Priority: P2  
Status: Open

Create referral mechanics for phase two.

Acceptance criteria:
- Each customer has a referral code or link.
- New signup can be attributed to a referrer.
- Referral reward is awarded only after qualifying action.
- Self-referrals are blocked.
- Duplicate referral claims are blocked.

### Issue 17: Add Refund Reward Reversal

Priority: P2  
Status: Open

Support removing or offsetting points when an order is refunded.

Acceptance criteria:
- Refunded order can be marked in backend.
- Reward ledger records reversal event instead of deleting history.
- Total points calculation includes reversal entries.
- Refund cannot reverse the same reward twice.

## Epic 4: Perks, Redemption, and Admin

### Issue 18: Define Tier Perks

Priority: P2  
Status: Product Needed

Define concrete benefits for Silver, Gold, and Platinum.

Acceptance criteria:
- Each tier has documented perks.
- Perks are visible in account dashboard.
- Perks do not imply automatic discounts until redemption rules exist.
- Copy is approved by product.

### Issue 19: Add Points Redemption

Priority: P3  
Status: Open

Allow customers to redeem points for defined benefits.

Acceptance criteria:
- Redemption catalog exists.
- Customer can redeem available points.
- Redemption creates ledger debit entry.
- Customer cannot redeem more points than available.
- Redemption is reflected in account dashboard.

### Issue 20: Add Admin Reward Rule Management

Priority: P3  
Status: Open

Allow admins to manage reward rules without code changes.

Acceptance criteria:
- Admin can view active reward rules.
- Admin can update point values.
- Admin can enable or disable reward actions.
- Changes are audited.
- Customer-facing rules update without redeploy.

### Issue 21: Add Rewards Analytics

Priority: P3  
Status: Open

Track reward impact and engagement metrics.

Acceptance criteria:
- Track account rewards dashboard views.
- Track daily check-in claims.
- Track reward-earning events by action.
- Track repeat purchase rate after rewards launch.
- Track tier distribution.

## Epic 5: Documentation and Cleanup

### Issue 22: Rename Client Brief File

Priority: P3  
Status: Done

Fix the source brief filename typo.

Acceptance criteria:
- `client-brief.md` exists as the canonical brief filename.
- Any references are updated.

### Issue 23: Resolve README Duplication

Priority: P3  
Status: Done

Decide whether both README files should remain.

Acceptance criteria:
- Canonical README is identified.
- Duplicate or outdated README is removed or renamed clearly.
- Project documentation points to the PRD and issue backlog.

### Issue 24: Document Reward API Usage

Priority: P2  
Status: Done

Add developer-facing notes for reward and order APIs.

Acceptance criteria:
- Document request headers.
- Document request bodies.
- Document response shapes.
- Document duplicate prevention behavior.
- Document required environment variables.


