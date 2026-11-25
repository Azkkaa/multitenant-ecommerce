# Tenant Storefront (web-tenant)

Tenant Storefront is a lightweight, multi-tenant e-commerce web application engineered for white-label SaaS platforms. It provides single-codebase storefront rendering that dynamically adapts its brand identity, dynamic color palette, product catalog, cart persistence, and checkout workflow based entirely on the inbound host domain (`window.location.hostname`).

---

## Key Features

- **Domain-Driven Multi-Tenancy**: Automatically detects and resolves merchant identity, catalog, brand logo, and store metadata based on the request domain.
- **Dynamic CSS Surface Token Engine**: Injects merchant `--color-primary` into document root and leverages native CSS `color-mix()` to compute cohesive surface, tint, and border tokens (`--surface-page`, `--surface-tint`, `--surface-tint-strong`, `--border-tint`) with zero JavaScript computation.
- **Isolated Cart Persistence**: Scopes shopping cart data strictly per merchant (`cart_${tenant.tenantId}`) in `localStorage`, preventing data crossover between stores.
- **Tamper-Proof Pricing Security**: Stores only `{ productId, quantity }` references in client storage. Item pricing, images, and metadata are dynamically resolved from the authoritative merchant catalog on the client, neutralizing client-side price tampering.
- **Slide-Over Cart Drawer**: Responsive flyout drawer featuring live item counters, formatted Indonesian Rupiah (IDR) currency calculations, inline quantity steppers, and background scroll locking.
- **Full Checkout & Order Confirmation**: Two-column checkout workflow with input sanitization, Indonesian WhatsApp number validation (`08...`, `628...`, `+628...`), courier selection with flat-rate calculation, order placement state, and receipt generation with WhatsApp notification shortcuts.
- **Storefront Search & Categorization**: Real-time keyword filtering and dynamic category pill filters extracted from the merchant's live catalog.
- **Hardened Client Architecture**: Zero cross-tenant data leaks. Merchant resolvers expose strictly active tenant state without distributing the global tenant registry to client consumers.

---

## Tech Stack

- **Runtime & Core**: Standard JavaScript (ES6+), React 18
- **Build Tool**: Vite 6
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS 3, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Architecture**: Monorepo workspace (NPM / PNPM Workspaces)

---

## Prerequisites

Ensure the following tools are installed on your host system:

- **Node.js**: v18.0.0 or higher (v20+ or v22+ recommended)
- **Package Manager**: npm v9+ or pnpm v8+

---

## Installation & How to Run

### 1. Repository Setup & Dependencies

Install dependencies from the monorepo root:

```bash
# Using npm
npm install

# Alternatively, using pnpm
pnpm install
```

### 2. Running the Development Server

You can execute the development server from the repository root or directly within `apps/web-tenant`:

From the monorepo root:

```bash
npm run dev:tenant
```

Or from inside `apps/web-tenant`:

```bash
cd apps/web-tenant
npm run dev
```

The Vite dev server will launch on port `3000` (configured with `host: true` in `vite.config.js`).

### 3. Production Build & Preview

To compile the application for production deployment:

```bash
# Build the tenant package
npm run build:tenant

# Preview the production build locally
cd apps/web-tenant
npm run preview
```

---

## Directory Structure

```text
apps/web-tenant/
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies and script declarations
├── postcss.config.js            # PostCSS configuration for Tailwind CSS
├── tailwind.config.js           # Tailwind utility extensions and theme tokens
├── vite.config.js               # Vite build and server settings
└── src/
    ├── App.jsx                  # Route definitions and provider bootstrapping
    ├── index.css                # Base Tailwind directives and dynamic CSS surface tokens
    ├── main.jsx                 # React DOM mount point
    ├── components/
    │   ├── CartDrawer.jsx       # Slide-over cart drawer with quantity controls
    │   ├── Footer.jsx           # Grounded merchant brand footer
    │   ├── Layout.jsx           # Master layout containing Navbar, Footer, and CartDrawer
    │   ├── Navbar.jsx           # Announcement bar, brand identity, and cart trigger
    │   └── ProductCard.jsx      # Product grid card with IDR formatting and cart actions
    ├── context/
    │   ├── CartContext.jsx      # Multi-tenant cart state, local persistence, and toasts
    │   └── TenantContext.jsx    # Domain resolver, metadata sync, and CSS variable injection
    ├── lib/
    │   ├── format.js            # IDR currency formatting utility (formatIDR)
    │   └── tenant.js            # Tenant data registry and domain resolver
    └── pages/
        ├── Checkout.jsx         # Shipping details form and order receipt view
        ├── HomePage.jsx         # Framed hero, search bar, category pills, product grid
        ├── NotFoundPage.jsx     # Merchant 404 and unavailable storefront handler
        └── ProductDetailPage.jsx# Detailed product view with specifications and stepper
```

---

## Multi-Tenant Testing Guide

The application resolves tenant identity by parsing `window.location.hostname`. Two default mock merchants are configured in `src/lib/tenant.js`:

| Merchant Name | Hostname | Theme Color | Target Specialty |
| :--- | :--- | :--- | :--- |
| **Kopi Senja Artisanal Roastery** | `localhost` | `#854d0e` (Warm Amber) | Specialty coffee & brewing gear |
| **TechGear Store** | `127.0.0.1` | `#2563eb` (Electric Blue) | Workspace peripherals & hardware |

### Local Testing Methods

1. **Domain-Based Resolution**:
   - Access `http://localhost:3000` to view **Kopi Senja**.
   - Access `http://127.0.0.1:3000` to view **TechGear Store**.

2. **Query Parameter Override (Development Mode)**:
   For local environments where custom hostnames are not routed, you can force tenant resolution using the `?tenant=` query parameter:
   - `http://localhost:3000/?tenant=kopi-senja`
   - `http://localhost:3000/?tenant=techgear-store`

3. **Fallback & Store Not Found**:
   Navigating to an unmapped host (e.g. `http://0.0.0.0:3000`) triggers the secure `Storefront Unavailable` view without exposing system diagnostics or other registered tenants.
