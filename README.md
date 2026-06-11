Exclusive E-Commerce

Core System Features

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