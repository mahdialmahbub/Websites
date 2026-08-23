# Tect Store — Backend API

Professional Express.js + MongoDB backend for the Tect e-commerce platform (built to pair with your Next.js frontend).

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (httpOnly cookies + Bearer token support), bcrypt password hashing
- **OTP:** Hashed, time-limited, auto-expiring (MongoDB TTL index) — used for email verification, 2FA login, account deletion, password change, adding a card, and payment confirmation
- **File uploads:** Multer (disk storage, PNG/JPG only, 5MB limit)
- **Email:** Nodemailer (falls back to console logging in dev if SMTP isn't configured)
- **PDF invoices:** PDFKit
- **Security:** Helmet, CORS (locked to your frontend origin), express-rate-limit, express-mongo-sanitize

## 1. Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real MongoDB URI, JWT secrets, SMTP creds, etc.
npm run seed            # creates the first admin account + default 15%/30% discount tags
npm run dev              # starts the server with nodemon on http://localhost:5000
```

Your first admin login will be whatever you set in `.env` as `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` (defaults: `admin@tect.com` / `ChangeMe123!` — **change this immediately**).

## 2. Folder Structure

```
backend/
├── server.js                 # entry point
├── src/
│   ├── app.js                 # Express app: middleware + route mounting
│   ├── config/                # DB connection, shared constants/enums
│   ├── models/                # Mongoose schemas (15 models)
│   ├── controllers/           # Route handlers, grouped by feature
│   ├── routes/                 # Express routers
│   ├── middlewares/            # auth, error handling, upload, rate limiting, validation
│   ├── services/                # reusable business logic (pricing, OTP)
│   ├── utils/                    # helpers (tokens, email, SMS, PDF, card masking...)
│   ├── validators/               # express-validator rule chains
│   └── uploads/                   # uploaded images (products/customers/reviews)
```

## 3. Data Models

| Model | Purpose |
|---|---|
| `Customer` | Registration/profile, embedded primary address, 2FA flag, image |
| `Admin` | Dashboard login |
| `Otp` | Hashed, auto-expiring OTPs for every verification flow |
| `Address` | Multiple saved delivery addresses per customer |
| `Card` | Saved payment cards — **masked number only, never raw PAN/CVV** (see Security Notes) |
| `Device` | Logged-in devices list (tied to each login's JWT `jti`) |
| `Brand`, `Category`, `Badge`, `Discount` | Admin-managed lookup lists used by the Add Product form |
| `Product` | Title, images, variants (with price adjustments), colors, specs, stock, discount, guarantee info |
| `Review` | Verified-purchase reviews (tied to a real Order) |
| `Cart` | One per customer; item prices are always recalculated live, never stored stale |
| `Order` | Full snapshot of items/prices/address at purchase time + status timeline |
| `Message` | Admin dashboard "Messages" (contact form submissions) |

## 4. Key Business Logic

- **Dynamic pricing** (`src/services/pricingService.js`): `finalPrice = (startingPrice + Σ variant.priceAdjustment) × (1 − discount%) × quantity`. Used identically on the Product Details page, the Cart, and Checkout, so the price a customer sees is always the price they're charged.
- **OTP-gated actions**: registration email verification, login 2FA, account deletion, password change, adding a card, and credit-card payment confirmation all go through the same `otpService` — one code path, consistently rate-limited and hashed at rest.
- **Checkout flow**: Cash on Delivery creates the order immediately. Credit Card sends an OTP to the customer's **phone**, and the order is only created after that OTP is verified — the priced draft is held server-side (in the OTP's `meta`), so the client can never tamper with the amount charged.

## 5. Design Decisions Worth Knowing About

A couple of places where the spec's plain-language description would create a contradiction or a security problem if implemented literally — here's what was built instead, and why:

1. **Credit card CVV is never stored — not even temporarily.** PCI-DSS forbids persisting CVV/CVC under any circumstance. The card number is used only in-memory to compute a masked number + network, then discarded. In production, swap this for a real payment gateway (Stripe, SSLCommerz, etc.) that tokenizes the card entirely — don't handle raw card numbers on your own server at all if you can avoid it.
2. **"Cancel Order" is a soft-cancel, not a hard delete.** The spec asks for both "the order will be deleted from the database" *and* a status timeline that displays "Canceled — [date/time]" — a deleted document can't show a timeline. `cancelOrder` sets `status: "Canceled"` and appends a timeline entry instead, which is also just standard practice for e-commerce (you want cancellation history for support/analytics). The **"Delete"** button in the *Delivered Orders* list is a real hard-delete, but it's only ever allowed on orders that are already `Delivered` or `Canceled`, so nothing in-flight can be lost by mistake.

If you'd rather have literal hard-deletes for cancellations, that's a one-line change in `orderController.js` — just flagging the trade-off.

## 6. Full API Reference

All request bodies are JSON unless noted as `multipart/form-data` (image uploads). Protected routes require the customer/admin JWT (sent automatically as an httpOnly cookie after login, or via `Authorization: Bearer <token>`).

### Auth — `/api/auth` (Customer)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` *(multipart)* | Register + send email OTP. Fields: name, email, password, phone, dateOfBirth, gender, address{...}, image |
| POST | `/verify-registration-otp` | Verify email OTP to activate account |
| POST | `/resend-otp` | Resend an OTP (`{ email, purpose }`) |
| POST | `/login` | Email + password. Returns `twoFactorRequired: true` if 2FA is on |
| POST | `/verify-login-otp` | Completes login when 2FA is enabled |
| POST | `/logout` | 🔒 Clears session + removes this device |

### Customer — `/api/customer` 🔒 (all routes require login)
| Method | Endpoint | Description |
|---|---|---|
| GET/PATCH | `/profile` | Get/update profile (PATCH is multipart for image) |
| GET | `/settings/search?q=` | Search Settings/Security options |
| POST | `/account/delete/request` → `/account/delete/confirm` | OTP-gated account deletion |
| POST | `/password/change/request` → `/password/change/confirm` | OTP-gated password change |
| PATCH | `/two-factor` | Enable/disable 2FA (`{ enabled }`) |
| GET | `/devices` / DELETE `/devices/:id` | Logged-in devices list / remote logout |
| GET/POST | `/addresses` , PATCH/DELETE `/addresses/:id` | Saved addresses CRUD |
| GET | `/cards` , POST `/cards/request` → `/cards/confirm` , DELETE `/cards/:id` | Saved cards (OTP-gated add) |

### Products — `/api/products` (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/?search=&category=&badge=&sortBy=&page=&limit=` | Storefront listing |
| GET | `/:id?variantIds=&quantity=` | Full Product Details payload: product, live pricing, reviews, related products |
| GET | `/:productId/reviews` | Public review list |
| POST | `/:productId/reviews` 🔒 *(multipart)* | Add a review — requires a verified purchase (`orderId`) |

### Cart — `/api/cart` 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Current cart with live-calculated prices |
| POST | `/items` | Add item `{ productId, selectedVariantIds, selectedColor, quantity }` |
| PATCH/DELETE | `/items/:cartItemId` | Update / remove a cart item |

### Checkout — `/api/checkout` 🔒
| Method | Endpoint | Description |
|---|---|---|
| POST | `/place-order` | `{ paymentMethod, addressId\|newAddress, savedCardId\|card }` — COD confirms instantly; Credit Card sends phone OTP |
| POST | `/verify-payment-otp` | `{ otp }` — confirms the order after Credit Card OTP |

### Orders — `/api/orders` 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/pending` / `/delivered` | Order lists split by status |
| GET | `/:orderId` | Full Order Details page payload |
| POST | `/:orderId/cancel` | Soft-cancel (blocked once Shipped+) |
| DELETE | `/:orderId` | Hard delete (Delivered/Canceled only) |
| GET | `/:orderId/invoice` | Streams a PDF invoice |
| GET | `/:orderId/seller-contact` | Seller phone number(s) for this order |

### Messages — `/api/messages`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Public contact form submission |

### Admin — `/api/admin` 🔒 (admin JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Admin login (public) |
| POST | `/auth/logout` , GET `/auth/me` | — |
| GET/POST | `/brands` `/categories` `/badges` `/discounts` | Catalog management for the Add Product form |
| POST | `/products` *(multipart)* | Create product (full Add Product Form payload) |
| PUT | `/products/:id` *(multipart)* | Edit product |
| DELETE | `/products/:id` | Delete product |
| GET | `/products?status=&category=&sortBy=&search=` | Admin product table |
| DELETE | `/reviews/:reviewId` | Delete a review (from Edit Product page) |
| GET | `/dashboard/overview` | Pending orders count, today's revenue, total products, total customers |
| GET | `/orders?status=&paymentMethod=&sortByPrice=&search=` | Orders table (also powers the Pending Orders widget) |
| GET/PATCH/DELETE | `/orders/:orderId` | Order details / advance status & set tracking / delete |
| GET | `/orders/:orderId/invoice` | Admin invoice download |
| GET | `/customers?sortBy=&paymentMethod=&search=` | Customers table |
| GET/DELETE | `/customers/:customerId` | Customer details (overview, addresses, cards, order history) / delete |
| GET | `/messages?search=` , GET `/messages/:messageId` | Messages table / mark-as-viewed detail view |

## 7. What You Still Need to Plug In

- **SMTP credentials** (or the app just logs OTP emails to the console in dev — handy for testing without a mail server)
- **An SMS provider** for phone OTPs (`src/utils/sendSms.js` has a clear integration point — Twilio, SSL Wireless, Alpha SMS, etc.)
- **A real payment gateway** if you want actual Credit Card charging — right now, Credit Card orders are OTP-verified and recorded, but no money actually moves (this backend intentionally never touches real card processing, for the PCI reasons above)
- **A GeoIP lookup** if you want real city-level location on the "Logged-in Devices" cards (currently reads an optional `x-geo-location` header, defaulting to "Unknown Location")
