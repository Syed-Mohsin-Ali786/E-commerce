# E-Commerce Store — Implementation Plan

**Stack:** React Router v7 (SSR), React 19, TypeScript, Tailwind v4, Clerk, Prisma + PostgreSQL, shadcn/ui.

**Goal:** Turn the styled frontend prototype into a working full-stack e-commerce app using loaders/actions (no separate REST layer).

---

## Progress Tracker

| Phase | Status | Notes |
|-------|--------|-------|
| 0 — Security & Repo Hygiene | ✅ Complete | Dead code removed, mongoose dropped |
| 1 — Data Layer & Auth Foundation | ✅ Complete | Schema, server modules, auth helpers, `.env.example` |
| 2 — Products, Cart, Addresses, Orders | ✅ Complete | Loaders, cart sync, checkout, my-orders |
| 3 — Seller Dashboard | ✅ Complete | Guards, become-seller, Cloudinary, real data |
| 4 — Frontend Fixes & Auth Consolidation | ✅ Complete | Navbar, Buy now, cleanup |
| 5 — Polish & Readiness | ✅ Complete | Tests, empty states, build verified |

---

## Architecture Decisions (locked)

| Decision | Choice |
|----------|--------|
| Database | Prisma + PostgreSQL |
| Auth | Clerk only (remove custom SignUp form) |
| API style | Route loaders/actions |
| Seller role | `User.role` in DB + `publicMetadata.role` in Clerk |
| User ID | Clerk user ID as `User.id` (string) |
| Cart | `User.cartItems` JSON `{ [productId]: quantity }` |
| Images | Cloudinary |
| Payment | COD only (MVP) |
| User sync | Lazy upsert on first authenticated request |

---

## Phase 0 — Security & Repo Hygiene

- [ ] Confirm leaked credentials rotated (manual — ask user)
- [x] `.history/` in `.gitignore`
- [x] Delete `app/lib/authSeller.js`
- [x] Delete `app/mainPage/` (unreachable stub)
- [x] Delete `app/routes/test.tsx`
- [x] Delete `commit_message.txt`
- [x] Remove unused `mongoose` from `package.json`

---

## Phase 1 — Data Layer & Auth Foundation

- [x] Extend `prisma/schema.prisma` (User, Product, Address, Order, OrderItem, enums)
- [ ] Run `prisma migrate dev` (requires live `DATABASE_URL` / `DIRECT_URL` in `.env`)
- [x] Run `prisma generate`
- [x] Fix `config/db.server.ts` (Prisma 7 + `@prisma/adapter-pg`)
- [x] Create `app/.server/user.server.ts`
- [x] Create `app/.server/product.server.ts`
- [x] Create `app/.server/address.server.ts`
- [x] Create `app/.server/order.server.ts`
- [x] Create `app/.server/auth.server.ts` (`requireUserId`, `requireSeller`, lazy upsert)
- [x] Create `.env.example`

---

## Phase 2 — Products, Cart, Addresses, Orders

- [x] Replace `productsDummyData` with real loaders
- [x] Wire `AppContext` to loader data + cart sync action
- [x] Add Address page/route
- [x] Implement `createOrder()` in `OrderSummary`
- [x] Fix `/order-placed` redirect to `/my-orders`
- [x] Wire `my-orders.tsx` to real orders

---

## Phase 3 — Seller Dashboard

- [x] `requireSeller` guard on all `seller.*` routes
- [x] "Become a Seller" flow (DB + Clerk metadata)
- [x] Product create with Cloudinary upload
- [x] Real seller product-list and orders

---

## Phase 4 — Frontend Fixes & Auth Consolidation

- [x] Replace custom `/SignUp` with Clerk redirect (become-seller + `openSignIn` when logged out)
- [x] Cart badge in Navbar
- [x] `navigate()` instead of `window.location.href`
- [x] Wire "Buy now" buttons
- [x] Remove placeholder About/Contact links

---

## Phase 5 — Polish & Readiness

- [x] Real footer/newsletter copy
- [ ] Image optimization / CDN (deferred — product images already use remote URLs; hero PNGs remain local)
- [x] Error & empty states
- [x] Vitest for `*.server.ts` modules
- [x] `npm run build` + `typecheck` pass
- [ ] Docker build (Dockerfile updated; verify locally when Docker Desktop is running)

---

## Definition of Done

- Customer: Clerk sign-in → browse DB products → persistent cart → checkout → `/my-orders`
- Seller: role-gated `/seller` → add product with images → see own products/orders
- Server-side seller guard on direct URL access
- Build/typecheck/Docker succeed; `.env.example` documents all vars; no dead files

---

## Implementation Log

### Phase 0 — complete (2026-06-19)
Removed dead Next.js auth stub (`authSeller.js`), unreachable `mainPage/`, placeholder `test.tsx`, and `commit_message.txt`. Dropped unused `mongoose` dependency. `.history/` was already gitignored.

### Phase 1 — complete (2026-06-19)
Extended Prisma schema with full e-commerce models (Prisma 7 config). Generated client to `generated/prisma/`. Added server data modules under `app/.server/` and auth helpers with Clerk lazy-upsert. Added `.env.example`. `npm run typecheck` passes. **Pending:** run `npx prisma migrate dev --name init_ecommerce_models` once `.env` has real Postgres URLs.

### Phase 2 — complete (2026-06-19)
Root loader serves DB products + persisted cart. `AppContext` uses loader data with debounced cart sync to `/cart` action. Added `/add-address`, checkout flow (place order → clear cart → `/order-placed` → `/my-orders`). Product detail page uses its own loader. Added `prisma/seed.ts` to populate products from former dummy data. `npm run typecheck` passes.

### Phase 3 — complete (2026-06-19)
`seller.tsx` layout loader enforces `requireSeller` (server-side, blocks direct URL access). `/SignUp` repurposed as “Become a Seller” — upgrades Prisma `role` + Clerk `publicMetadata.role`. Add-product form uploads images via Cloudinary (`app/.server/cloudinary.server.ts`) then creates DB row. Seller product-list and orders use real loaders. `npm run typecheck` passes.

### Phase 4 — complete (2026-06-19)
Navbar: cart badge with `getCartCount()`, logo/home links, `navigate()` in all `UserButton` actions, Clerk `openSignIn` for guests clicking Become a Seller. ProductCard: click → product page, Buy now → add to cart + `/cart`. FeaturedProduct banners → `/all-products`. Removed dead `signup-form.tsx` and placeholder About/Contact nav links. `npm run typecheck` passes.

### Phase 5 — complete (2026-06-19)
Updated Footer and NewsLetter with real copy. Added `EmptyState` component for empty cart, empty catalog, and DB load failures. Root loader catches product fetch errors gracefully. Added Vitest (`npm test`) with `product-mapper` unit tests. Dockerfile runs `prisma generate` before build and copies `generated/` into the runtime image. `npm run test`, `typecheck`, and `build` all pass. Docker build not verified in this session (Docker Desktop was not running).
