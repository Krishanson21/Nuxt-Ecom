<div align="center">

# Exclusive

A modern e-commerce storefront built with Nuxt 3 and Vue 3.

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

[Features](#features) · [Project Structure](#project-structure) · [Getting Started](#getting-started) · [Pages](#pages) · [Architecture](#architecture)

</div>

---

## Overview

Exclusive is a responsive e-commerce web application built for a clean and fast shopping experience. It covers the core of what a storefront needs — a searchable product catalog, cart and wishlist management, user session handling, and a modular codebase that stays easy to work with as it grows.

---

## Features

- **Live Search** — The header search bar navigates to a filtered product catalog driven entirely by URL query params, keeping search state shareable and bookmarkable.
- **Persistent Cart** — Cart state is shared reactively across all pages using Nuxt's built-in `useState`, with no external store required.
- **Wishlist** — Users can save products for later, with a dedicated page to review and manage saved items.
- **User Session** — Login and logout flow with session persistence handled through `localStorage`.
- **Product Catalog** — A filterable product grid that supports category filters, sort options, and keyword search simultaneously.
- **Responsive Layout** — Mobile-first grid that scales from four columns on desktop down to a single column on small screens.
- **Decoupled CSS** — Each page and component imports only its own stylesheet, preventing any global style bleed.
- **Accessible Markup** — ARIA labels, screen-reader-only classes, and semantic HTML used consistently throughout.

---

## Project Structure

```
├── app/
│   ├── assets/
│   │   └── css/                     # Decoupled stylesheets, one per module
│   │       ├── header.css           # Navbar, search bar, cart icon, account dropdown
│   │       ├── account.css          # Account page forms and session UI
│   │       └── index.css            # Shared catalog and homepage styles
│   │
│   ├── composables/
│   │   ├── useHomepage.js           # Manages slider cycles, auto-scroll, and page timers
│   │   └── useProductActions.js     # Centralizes cart and wishlist logic
│   │
│   └── pages/
│       ├── index.vue                # Main homepage layout
│       ├── about.vue                # Company overview and brand story
│       ├── contact.vue              # Support contact form with submission tracking
│       ├── wishlist.vue             # Saved items grid
│       │
│       ├── account/
│       │   └── index.vue            # User profile editor and session manager
│       │
│       └── products/
│           ├── index.vue            # Full product catalog with search and filter
│           └── [id].vue             # Individual product detail page
│
├── data/
│   └── products.ts                  # Typed product data — flash sale, best sellers, explore
│
├── components/
│   └── ProductCard.vue              # Reusable product tile component
│
└── public/
    └── images/                      # Product images and static UI assets
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/exclusive.git
cd exclusive

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `pages/index.vue` | Homepage with flash sale, best sellers, and explore sections |
| `/products` | `pages/products/index.vue` | Full catalog with keyword search and category filtering |
| `/products/:id` | `pages/products/[id].vue` | Single product detail page |
| `/wishlist` | `pages/wishlist.vue` | Saved items grid with remove functionality |
| `/account` | `pages/account/index.vue` | User profile editor and session manager |
| `/about` | `pages/about.vue` | Company story and brand overview |
| `/contact` | `pages/contact.vue` | Support form with submission tracking |

---

## Architecture

### Search

The search system is URL-driven from end to end. When a user submits a query in the header, it gets encoded into the URL as a query parameter. The products page watches for URL changes, reads the parameter, and filters the product list reactively through a computed property. Because the search term lives in the URL, results are fully bookmarkable and shareable.

```
User submits query in header
  → URL updates to /products?search=gamepad
  → watch() on products page fires
  → syncURLParameters() reads the query param
  → searchQuery ref updates
  → computedProductFeed re-filters by name, category, and altText
  → Template re-renders with matching results
```

### State Management

Cart state is global and reactive using Nuxt's `useState`. No external library is needed — any page or component that calls `useState('cart')` gets the same reactive reference.

```js
const cart = useState('cart', () => [])
```

### Composables

| File | Responsibility |
|---|---|
| `useHomepage.js` | Handles homepage slider timers, auto-scroll loops, and section lifecycle hooks |
| `useProductActions.js` | Shared `addToCart` and `addToWishlist` logic consumed by any page or component |

### Product Data Model

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  reviews: number;
  image: string;
  altText: string;
  badge: string | null;
  category: string;
}
```

Products are split into three named exports in `data/products.ts`:

- `flashSaleProducts` — Discounted items with a time-limited badge
- `bestSellers` — Highest rated and most purchased products
- `exploreProducts` — New arrivals and curated picks

All three arrays are merged at runtime inside the products catalog computed property.

---

## Responsive Breakpoints

The product grid adapts to screen size without any JavaScript:

| Breakpoint | Columns |
|---|---|
| Above 1024px | 4 |
| 580px to 1024px | 2 |
| Below 580px | 1 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 |
| UI | Vue 3 — Composition API |
| Language | TypeScript |
| Styling | Scoped CSS, decoupled per module |
| Icons | Font Awesome 6 |
| Routing | Nuxt file-based router |
| State | Nuxt useState |

---

## Contributing

Pull requests are welcome. For significant changes, open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
