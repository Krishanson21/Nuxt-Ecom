# Exclusive

Exclusive is a Nuxt/Vue e-commerce storefront with product browsing, cart and wishlist persistence, account profile management, checkout order creation, and a private rewards dashboard.

## Project Docs

- Product requirements: [PRD-rewards-gamification.md](./PRD-rewards-gamification.md)
- Issue backlog: [ISSUES-rewards-gamification.md](./ISSUES-rewards-gamification.md)
- Client brief: [client-brief.md](./client-brief.md)

`README.md` is the canonical project README. Older duplicate README drafts have been removed to avoid stale setup or architecture notes.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Nuxt 4 / Vue 3 |
| Styling | Vanilla CSS in `app/assets/css/` |
| State | Nuxt `useState` plus `localStorage` for current demo auth/cart state |
| Database | MongoDB |
| Tests | Node built-in test runner |

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000` by default.

Required environment variables:

```bash
MONGODB_URI=mongodb+srv://...
```

## Scripts

```bash
npm run dev      # start local development server
npm run build    # production build
npm run preview  # preview production build
npm test         # run reward rule unit tests
```

No lint script is currently configured.

## Rewards And Orders API

All private reward and order calls require a stable user identity header:

```http
x-user-key: user:<id-or-email>
```

Anonymous demo users use a device-scoped key generated in `app/composables/useRewards.js`.

### `POST /api/orders`

Creates a completed order and returns the persisted order ID and total.

Request body:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Product name",
      "price": 99,
      "quantity": 1,
      "image": "/images/example.png"
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "orderId": "...",
  "orderTotal": 99
}
```

Validation rejects missing user identity, empty carts, missing product IDs, non-positive prices, and invalid quantities.

### `GET /api/rewards`

Returns the current customer's private rewards summary.

Response shape:

```json
{
  "totalPoints": 150,
  "tier": "Bronze",
  "nextTier": "Silver",
  "nextTierAt": 1000,
  "progressToNextTier": 15,
  "weeklyStreak": 1,
  "dailyCheckInClaimedToday": false,
  "recentRewards": [],
  "rewardHistory": []
}
```

### `POST /api/rewards`

Awards points for a supported reward action and returns the updated summary.

Supported actions:

| Action | Metadata | Duplicate rule |
| --- | --- | --- |
| `purchase` | `orderId`, `orderTotal` | Once per order ID |
| `profile_completed` | Optional `source` | Once per user |
| `wishlist_add` | `productId`, optional `productName` | Once per user per product ID |
| `daily_check_in` | Optional `claimedAt` | Once per calendar day |

Duplicate reward attempts return:

```json
{
  "skipped": true,
  "summary": {}
}
```

Invalid actions or missing required metadata return a consistent error response:

```json
{
  "error": "Unknown reward action"
}
```

## Project Structure

```text
app/
  assets/css/          Page and component styles
  auth/                Local demo auth composables
  components/          Shared UI components
  composables/         Cart, homepage, and reward state
  data/products.ts     Product data
  layouts/             Nuxt layouts
  pages/               Route pages
  server/api/          Cart, order, and reward API routes
  server/utils/        MongoDB and reward rule utilities
public/images/         Static product and UI assets
tests/                 Node test files
```

## Current Production Caveat

The rewards MVP still uses localStorage-backed demo identity on the frontend. Before production launch, replace that with server-side users or a dedicated auth provider so login, profile, cart, wishlist, orders, and rewards all share a stable backend user ID.
