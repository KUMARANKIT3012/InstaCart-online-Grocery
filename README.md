# INSTACART

> A full-stack grocery marketplace for browsing, saving, buying, tracking, and managing the everyday essentials that keep a kitchen moving.

INSTACART is a PERN monorepo with a React storefront, an Express API, PostgreSQL persistence, Stripe test payments, Cloudinary product media, and an admin operations console.

## What is included

- Product catalog with search, category filters, price ranges, sorting, pagination, and cached reads
- Product details with responsive UI and lazy-loaded routes
- JWT authentication with bcrypt password hashing and role-based access (`user`, `admin`)
- Persistent carts with quantity controls and stock-aware transactional checkout
- Stripe PaymentIntents, Stripe Elements, and signed webhook handling
- Favorites/wishlist persistence
- Order history, payment state, and delivery status timeline
- Admin product/category CRUD, inventory management, image uploads, and order status controls
- Toast feedback, skeleton loading states, and persistent dark mode
- Security middleware with Helmet, CORS allowlisting, Zod validation, and auth rate limiting

## Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, TanStack React Query, Axios, Stripe Elements |
| Backend | Node.js, Express, Zod, Helmet, Multer, Cloudinary, Stripe |
| Database | PostgreSQL with parameterized `pg` queries and transaction-safe checkout |

## Repository layout

```text
client/
	src/api/          Axios API modules
	src/components/   Navbar, cards, guards, skeletons
	src/context/      Auth, cart, wishlist, theme, toast providers
	src/pages/        Storefront, checkout, orders, admin pages
server/
	config/           PostgreSQL, Stripe, Cloudinary, security config
	db/               Schema and development seed data
	scripts/          Database setup helper
	src/routes/       HTTP route registration
	src/controllers/  Request/response orchestration
	src/services/     Business logic and database access
	src/middleware/   Auth, admin, validation, uploads, errors
```

## Quick start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Optional: Stripe CLI for local payment webhooks
- Optional: Cloudinary account for admin image uploads

### 1. Install dependencies

From the repository root:

```powershell
cd client
npm install

cd ..\server
npm install
```

### 2. Configure environment variables

Copy the examples and fill in your local values:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Never commit `.env` files. They are ignored by Git; only `.env.example` files belong in the repository.

### 3. Create and seed PostgreSQL

Create a database named `instacart` using pgAdmin or PostgreSQL's command line tools:

```powershell
createdb -U postgres instacart
```

Then apply the complete schema and development catalog:

```powershell
cd server
npm run db:setup
```

The seed creates 8 categories and 40 grocery products. Carts, orders, favorites, and users are intentionally user-specific and begin empty.

### 4. Start the app

Terminal 1, API:

```powershell
cd server
npm run dev
```

Terminal 2, frontend:

```powershell
cd client
npm run dev
```

Open `http://localhost:5173`.

## Stripe test mode

Set these values in the environment files:

- `STRIPE_SECRET_KEY` in `server/.env`
- `STRIPE_WEBHOOK_SECRET` in `server/.env`
- `VITE_STRIPE_PUBLISHABLE_KEY` in `client/.env`

Forward webhook events locally:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

Use Stripe's test card `4242 4242 4242 4242`, any future expiry date, and any CVC.

## Admin access

Register normally, then promote the account directly in PostgreSQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Sign in again and open `http://localhost:5173/admin`.

## Useful commands

Client checks:

```powershell
cd client
npm run lint
npm run build
```

Server syntax check:

```powershell
cd server
Get-ChildItem src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

API health check:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

## API highlights

```text
GET    /api/products
GET    /api/products/:id
GET    /api/categories
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/cart
POST   /api/cart/items
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
GET    /api/wishlist
POST   /api/webhooks/stripe
```

Admin endpoints are mounted under `/api/admin` and require an authenticated admin role.

## Security notes

- SQL values use parameterized PostgreSQL queries.
- Auth routes are rate-limited.
- JWTs use configured issuer, audience, and secret values.
- Product uploads are limited to images up to 5 MB.
- CORS origins are explicitly configured through `CLIENT_URL`.
- Secrets belong only in local environment files or deployment secret managers.