<!-- Exclusive E-Commerce

Core System Features

<<<<<<< HEAD
Dynamic Hero Banner : Automates promotional shifts every 5 seconds. Supports independent background glows, custom image sizing.
Reactive Inventory Search: Intercepts input field entry and handles routing redirect rules.
Contextual Account Menu: Uses an absolute floating overlay panel triggered by user avatar interaction.
Layout Seperate layouts designs for with auth and without auth and for login Restricts layout dimensions to eliminate inner header scrollbars.
Offline Storage Persistence: Synchronizes current system arrays into browser localStorage. Keeps item counts and user session data intact across page refreshes.
MOngoDB used for cart and inventory handeling.
The Tech Stack

Framework: Nuxt 3 (Vue 3 with Composition API)
Styling: Custom Vanilla CSS (Organized externally in assets/css/)
Icons Library: Font Awesome 6 (Solid & Regular sets)
State Management: Native Nuxt useState combined with browser localStorage for offline session persistence.
Structural Code Blueprint Plaintext ├── app/ │ ├── assets/ │ │ └── css/ # Decoupled design systems (header.css, account.css) │ ├── composables/ │ │ ├── useHomepage.js # Manages loop cycles, sliders, and page timers │ │ └── useProductActions.js # Centralizes separated cart and wishlist logic │ └── pages/ │ ├── index.vue # Main homepage layout template │ ├── about.vue # Text-driven company overview profile │ ├── contact.vue # Support form interface and submission tracking │ ├── wishlist.vue # Dynamic grid for items saved for later │ └── account/ │ └── index.vue # User detail editor and session tracker

Deployment and Installation

Clone this project repository to your local operating system directory.
Open your system terminal inside the root project directory folder.
Execute npm install to download build dependencies and package modules.
Execute npm run dev to boot up the local Node server framework tracking instance.
Launch your machine web browser and open http://localhost:3000 to preview.
=======
1. Dynamic Hero Banner : Automates promotional shifts every 5 seconds. Supports independent background glows, custom image sizing.
2. Reactive Inventory Search: Intercepts input field entry and handles routing redirect rules.
3. Contextual Account Menu: Uses an absolute floating overlay panel triggered by user avatar interaction.
4. Layout Seperate layouts designs for with auth and without auth and for login Restricts layout dimensions to eliminate inner header scrollbars.
5. Offline Storage Persistence: Synchronizes current system arrays into browser localStorage. Keeps item counts and user session data intact across page refreshes.
6. MOngoDB used for cart and inventory handeling.

The Tech Stack
1. Framework: Nuxt 3 (Vue 3 with Composition API)
2. Styling: Custom Vanilla CSS (Organized externally in assets/css/)
3. Icons Library: Font Awesome 6 (Solid & Regular sets)
4. State Management: Native Nuxt useState combined with browser localStorage for offline session persistence.

Structural Code Blueprint
Plaintext
├── app/
│   ├── assets/
│   │   └── css/           # Decoupled design systems (header.css, account.css)
│   ├── composables/
│   │   ├── useHomepage.js       # Manages loop cycles, sliders, and page timers
│   │   └── useProductActions.js # Centralizes separated cart and wishlist logic
│   └── pages/
│       ├── index.vue      # Main homepage layout template
│       ├── about.vue      # Text-driven company overview profile
│       ├── contact.vue    # Support form interface and submission tracking
│       ├── wishlist.vue   # Dynamic grid for items saved for later
│       └── account/
│           └── index.vue  # User detail editor and session tracker


Deployment and Installation
1. Clone this project repository to your local operating system directory.
2. Open your system terminal inside the root project directory folder.
3. Execute npm install to download build dependencies and package modules.
4. Execute npm run dev to boot up the local Node server framework tracking instance.
5. Launch your machine web browser and open http://localhost:3000 to preview.
>>>>>>> a40dcf98352c54e452a6b68b01ec81aa4f0a4422 -->

<div align="center">

# Exclusive

A modern e-commerce storefront built with Nuxt 3 and Vue 3.

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## Overview

Exclusive is a responsive e-commerce storefront built with Nuxt 3 and Vue 3. It covers the essentials of a modern shopping experience — a dynamic hero banner, reactive product search, persistent cart and session data, and a clean layout system that handles both authenticated and guest states.

---

## Core Features

**Dynamic Hero Banner**
Rotates promotional content automatically every 5 seconds. Each slide supports independent background glow effects and custom image sizing.

**Reactive Inventory Search**
Intercepts user input from the header search field and handles routing redirects to the product catalog, passing the query as a URL parameter.

**Contextual Account Menu**
A floating overlay panel anchored to the user avatar. Appears on click and closes when the user interacts outside of it.

**Layout System**
Separate layout designs for authenticated users, guests, and the login screen. Layout dimensions are constrained to prevent inner header scrollbars across all states.

**Offline Storage Persistence**
Cart contents and user session data are synchronized to `localStorage`, keeping item counts and login state intact across page refreshes.

**MongoDB Integration**
Cart data and product inventory are managed through MongoDB, handling persistence and data operations on the backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 — Vue 3 Composition API |
| Styling | Vanilla CSS, organized in `assets/css/` |
| Icons | Font Awesome 6 — Solid and Regular sets |
| State | Nuxt `useState` combined with `localStorage` |
| Database | MongoDB — cart and inventory handling |

---

## Project Structure

```
├── app/
│   ├── assets/
│   │   └── css/                     # Decoupled stylesheets per module
│   │       ├── header.css
│   │       └── account.css
│   │
│   ├── composables/
│   │   ├── useHomepage.js           # Slider cycles, auto-scroll, and page timers
│   │   └── useProductActions.js     # Cart and wishlist logic
│   │
│   └── pages/
│       ├── index.vue                # Main homepage layout
│       ├── about.vue                # Company overview
│       ├── contact.vue              # Support form and submission tracking
│       ├── wishlist.vue             # Saved items grid
│       └── account/
│           └── index.vue            # User profile editor and session tracker
```

---

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/your-username/exclusive.git
cd exclusive
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

**4. Open in your browser**

```
http://localhost:3000
```

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `pages/index.vue` | Homepage with flash sale, best sellers, and explore sections |
| `/products` | `pages/products/index.vue` | Full catalog with keyword search and category filtering |
| `/products/:id` | `pages/products/[id].vue` | Single product detail page |
| `/account` | `pages/account/index.vue` | User profile editor and session manager |
| `/about` | `pages/about.vue` | Company story and brand overview |
| `/contact` | `pages/contact.vue` | Support form with submission tracking |

---

### State Management

Cart state is global and reactive using Nuxt's `useState`. No external library is needed — any page or component that calls `useState('cart')` gets the same reactive reference.

```js
const cart = useState('cart', () => [])
```

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


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

