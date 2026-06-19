# Agent Brief: Complete the "E-commerce" Full-Stack Application

**Stack:** React Router v7 (SSR framework mode), React 19, TypeScript, Tailwind CSS v4, Clerk (auth), Prisma + PostgreSQL, shadcn/ui-style components.


---

## 1. Role & Objective

You are a senior full-stack engineer. This repository is a **partial migration** of a Next.js e-commerce tutorial project ("QuickCart" style) to React Router v7. The migration moved the routing and components over, but **never reconnected the backend** — every page currently renders static dummy data, every form submit handler is empty, and the seller dashboard, checkout, and sign-up flows are non-functional stubs.

Your job is to take this from a styled frontend prototype to a working, production-credible full-stack e-commerce app, using the stack that is already in place (do not introduce a new framework, ORM, or auth provider unless a section below tells you to). Work through the phases in order. Do not skip Phase 0.

---

## 2. 🚨 Phase 0 — Do This Before Anything Else (Security)

A directory named `.history/` (VS Code "Local History" extension snapshots) is committed to this repository and is **not** in `.gitignore`. One of those snapshot files, `.history/.env_20260107120559`, contains real-looking values for:

- `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- `MONGODB_URI` (with embedded DB credentials)
- `INNGEST_SIGNING_KEY` and `INNGEST_EVENT_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

These are currently **public on GitHub** if the repo is public. Treat all of them as compromised.

Required actions, in this order:

1. Tell the user to rotate every one of the credentials above at their respective dashboards (Clerk, MongoDB Atlas, Inngest, Cloudinary) — **do this first**, before touching code, since cleaning git history does not un-leak a key that's already been crawled or cached.
2. Add `.history/` to `.gitignore`.
3. Remove `.history/` from version control. Since exposed secrets are involved, prefer rewriting history rather than a single removal commit:
   - If the user confirms no one else depends on the existing commit SHAs, use `git filter-repo` (or BFG Repo-Cleaner) to strip `.history/` from all history, then force-push.
   - If rewriting history isn't acceptable to the user, at minimum delete the directory in a new commit and confirm the secrets have already been rotated, since old commits remain visible on GitHub regardless.
4. **Ask the user for confirmation before force-pushing or rewriting history** — this is destructive and affects anyone else with a clone of the repo.
5. Delete the stray `commit_message.txt` file at the repo root while you're in there; it's an accidental artifact, not project content.

Do not proceed to later phases with placeholder secrets copied from the leaked file. Generate/obtain fresh ones.

---

## 3. Current State Assessment

What already works:
- React Router v7 routing, SSR, and the Clerk middleware/`rootAuthLoader` wiring in `app/root.tsx` are correctly set up.
- Tailwind v4 + shadcn-style UI primitives (`app/components/ui/*`) are in place and usable.
- `prisma/schema.prisma`, `config/db.server.ts`, and `prisma.config.ts` are correctly configured for Prisma 7 + PostgreSQL — but the schema only defines a bare `User` model with no e-commerce data.
- The Dockerfile multi-stage build is correctly structured for this React Router app.

What is broken or stubbed (confirmed by reading the code, not guessed):

- **No backend exists.** There are zero `.server.ts` data modules and zero loaders/actions that touch the database (Prisma's `db.server.ts` is exported but never imported anywhere). Every page imports static fixtures from `app/assets/dummyData.ts` directly into component state.
- **Cart has no persistence.** `AppContext` (`app/context/AppContext.tsx`) keeps `cartItems` in `useState` only — a page refresh wipes the cart.
- **Checkout does nothing.** `createOrder()` in `app/routes/components/OrderSummary.tsx` is an empty function; the address dropdown reads from `addressDummyData`; there is no "Add Address" page even though the UI has a commented-out link to one.
- **Seller flow is non-functional and unguarded.** `isSeller` in `AppContext` is hardcoded `false` and never set by any real check. The "Add Product" form's `handleSubmit` in `app/routes/seller._index.tsx` is empty. `seller.orders.tsx` and `seller.product-list.tsx` both read dummy data. Nothing stops a logged-in (or even logged-out) user from navigating directly to `/seller` — there's no server-side authorization check on that route tree.
- **Sign-up is split into two incompatible systems.** The app uses Clerk (`openSignIn()`, `<UserButton>`) for auth everywhere else, but `app/routes/SignUp.tsx` has its own custom form + `action()` that receives `name/email/password/confirm-password` and explicitly does nothing with them. The "Sign up with Google" button and "Sign in" link are both non-functional placeholders.
- **Dead code from the Next.js version.** `app/lib/authSeller.js` imports `@clerk/nextjs/server` and `next/server`, neither of which is installed in this project — it will throw if anything ever imports it.
- **Orphaned/unused files.** `app/mainPage/` (an `index.tsx` + `navBar.tsx` stub reading "This Is Nav Bar") sits outside the `app/routes/` flat-routing convention and isn't reachable; `app/routes/test.tsx` is a leftover placeholder page.
- **`mongoose` is a listed dependency but is never imported anywhere** — a leftover from before the project switched to Prisma/Postgres. Confusing and dead weight.
- **Minor UX bugs:** the cart badge/count is never rendered in the Navbar despite `getCartCount()` existing; several `UserButton.Action` handlers use `window.location.href = "/cart"` (full page reload) instead of React Router's `navigate()`; `/order-placed` has a commented-out redirect so users never get sent to `/my-orders` after the spinner; "Buy now" buttons on `ProductCard` and `FeaturedProduct` have no click handler at all.
- **No `.env.example`** committed, so there's no documentation of which environment variables the app needs to run.
- **No automated tests** of any kind exist in the repo.

---

## 4. Target Architecture & Decisions

Lock these in before writing code. If you disagree with a default, flag it to the user rather than silently changing direction.

| Decision | Default | Why |
|---|---|---|
| Database / ORM | Keep **Prisma + PostgreSQL** | Already configured (`prisma.config.ts`, `db.server.ts`); more type-safe than the original Mongoose setup. Remove the unused `mongoose` dependency from `package.json`. |
| Auth | **Clerk only**, single source of truth | Already wired into `root.tsx` and `Navbar.tsx`. Delete the custom `/SignUp` route and `signup-form.tsx`, or repurpose `/SignUp` to redirect into Clerk's hosted/embedded sign-up — don't maintain two parallel auth systems. |
| API style | **Colocated loaders/actions** per route (React Router v7's native data model), not a separate REST/Express layer | This is what the framework is designed for and what `CHANGES_AND_REMIX_NEXTJS_DIFF.md` in the repo already describes as the intended pattern — it was just never implemented. |
| Seller role | Store `role` on the Prisma `User` row **and** mirror it into Clerk's `user.publicMetadata.role` | Matches the design already implied by the dead `authSeller.js` file (`publicMetadata.role === 'seller'`); lets you check role cheaply from the Clerk session without an extra DB round trip in middleware. |
| User ↔ Clerk linking | Use the **Clerk user ID (string) as the Prisma `User.id`**, not an autoincrement int | The current schema's `Int @id @default(autoincrement())` doesn't match Clerk's string IDs (`user_xxx`) used everywhere else in the app (see dummy data `userId` fields). Drop the local `password` field entirely — Clerk owns credentials now. |
| Cart persistence | A `cartItems Json` field on `User`, shaped exactly like the existing `{ [productId]: quantity }` | Matches the current `AppContext` shape, avoids a full relational cart table for MVP. Sync on every `addToCart`/`updateCartQuantity` via a debounced action call. |
| Product image upload | Cloudinary (unsigned upload preset from the client, or signed upload via an action) | Matches the credentials that were already provisioned for this project (now rotated per Phase 0). Acceptable alternative: any object storage the user prefers — confirm before switching. |
| Payment method | Cash on Delivery only for MVP | Matches the existing UI ("Method: COD" in `my-orders.tsx`/`seller.orders.tsx`); no Stripe/payment code exists today. Treat real payment gateway integration as a stretch goal, not a requirement. |
| Clerk → DB user sync | Lazily upsert the Prisma `User` row from `getAuth()`/`currentUser()` inside loaders, on first authenticated request | Simpler than standing up a public Clerk webhook endpoint for MVP. Note a webhook-based sync (`user.created`/`user.updated`) as a hardening item for later. |

**Open questions to confirm with the user before/while building** (don't block all progress on these, but raise them early):
1. Keep Postgres/Prisma, or did they specifically want to go back to the original MongoDB design (the leaked env had a `MONGODB_URI`)?
2. Cloudinary for image upload, or a different provider they already have an account with?
3. Is a real payment gateway in scope for v1, or is COD-only acceptable for now?

---

## 5. Target Prisma Schema

Extend `prisma/schema.prisma` along these lines (adjust field names/types as needed, but keep the relations):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  SELLER
}

enum OrderStatus {
  ORDER_PLACED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id        String    @id // Clerk user id, e.g. "user_xxx"
  email     String    @unique
  name      String?
  imageUrl  String?
  role      Role      @default(CUSTOMER)
  cartItems Json      @default("{}")
  products  Product[]
  addresses Address[]
  orders    Order[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Float
  offerPrice  Float
  images      String[]
  category    String
  sellerId    String
  seller      User        @relation(fields: [sellerId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Address {
  id          String  @id @default(cuid())
  userId      String
  user        User    @relation(fields: [userId], references: [id])
  fullName    String
  phoneNumber String
  area        String
  city        String
  state       String
  pincode     String?
  orders      Order[]
  createdAt   DateTime @default(now())
}

model Order {
  id            String        @id @default(cuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  addressId     String
  address       Address       @relation(fields: [addressId], references: [id])
  items         OrderItem[]
  amount        Float
  status        OrderStatus   @default(ORDER_PLACED)
  paymentMethod String        @default("COD")
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float // price snapshot at time of purchase
}
```

After editing the schema: run `npx prisma migrate dev --name init_ecommerce_models` and `npx prisma generate`, and create a `.env.example` documenting every required variable (`DATABASE_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `VITE_PUBLIC_CURRENCY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) with placeholder (non-real) values.

---

## 6. Phased Execution Plan

Work top to bottom. Each phase should leave the app in a runnable state — don't move on with broken builds.

### Phase 0 — Security & Repo Hygiene
- [ ] Confirm with the user that leaked credentials have been rotated (see Section 2).
- [ ] Remove `.history/`, add it to `.gitignore`, remove `commit_message.txt`.
- [ ] Delete dead code: `app/lib/authSeller.js` (broken Next.js import), `app/mainPage/` (unreachable stub), `app/routes/test.tsx` (placeholder route).
- [ ] Remove the unused `mongoose` dependency from `package.json`.

### Phase 1 — Data Layer & Auth Foundation
- [ ] Apply the schema from Section 5; run migrations.
- [ ] Create `app/models/` (or `app/.server/`) data-access modules: `user.server.ts`, `product.server.ts`, `address.server.ts`, `order.server.ts`, each wrapping Prisma calls — keep route files thin.
- [ ] Write `requireUserId(request)` and `requireSeller(request)` server helpers using `@clerk/react-router/ssr.server`'s `getAuth`, with the lazy-upsert-on-first-request logic for syncing a Clerk user into the `User` table.
- [ ] Write `.env.example`.

### Phase 2 — Backend: Products, Cart, Addresses, Orders
- [ ] Replace `productsDummyData` usage everywhere with a real `loader` that calls `getAllProducts()` / `getProductById()`.
- [ ] Wire `AppContext.fetchProductData` to consume loader data (via `useLoaderData` at the route level, passed down, or a `fetcher.load('/api/products')` resource route — pick one pattern and use it consistently).
- [ ] Implement cart sync: `addToCart`/`updateCartQuantity` in `AppContext` should call an action that persists to `User.cartItems`, in addition to updating local state optimistically.
- [ ] Build the missing **Add Address** page/route and wire `OrderSummary`'s address dropdown to real addresses for the logged-in user instead of `addressDummyData`.
- [ ] Implement `createOrder()` in `OrderSummary.tsx`: validate an address and non-empty cart are selected, create an `Order` + `OrderItem` rows from `cartItems`, clear the cart, then navigate to `/order-placed`.
- [ ] Fix `/order-placed` to actually redirect to `/my-orders` after its timer instead of leaving the commented-out `navigate()` call.
- [ ] Wire `my-orders.tsx` to fetch the current user's real orders instead of `orderDummyData`.

### Phase 3 — Backend: Seller Dashboard
- [ ] Add a server-side `requireSeller` guard to every route under `seller.*` (loader-level, not just a client-side `isSeller` check) so non-sellers get redirected/403'd even via direct URL access.
- [ ] Implement the "Become a Seller" flow: an action that sets `role = SELLER` on the Prisma user and updates `publicMetadata.role` via Clerk's backend client, then route the Navbar's `isSeller` flag off this real value instead of the hardcoded `false`.
- [ ] Implement `seller._index.tsx`'s `handleSubmit`: upload selected images (Cloudinary or chosen alternative), then create a `Product` row tied to the current seller.
- [ ] Wire `seller.product-list.tsx` to the seller's real products, and `seller.orders.tsx` to real orders containing that seller's products.

### Phase 4 — Frontend Fixes & Auth Consolidation
- [ ] Remove or fully rebuild `/SignUp`: either redirect it into Clerk's sign-up component, or delete the route and link "Become a Seller" straight to Clerk's `openSignUp()`/the seller-upgrade action from Phase 3. Remove the dead "Sign up with Google" button and `href="#"` "Sign in" link, or make them real.
- [ ] Add a visible cart-count badge in `Navbar.tsx` using `getCartCount()`.
- [ ] Replace every `window.location.href = "..."` navigation inside `UserButton.Action` handlers with React Router's `navigate()`.
- [ ] Wire up the currently-inert "Buy now" buttons on `ProductCard.tsx` and `FeaturedProduct.tsx` to navigate to the relevant product or `/all-products`.
- [ ] Re-point the Navbar's "About Us" and "Contact" links to real routes/sections, or remove them if out of scope for v1.

### Phase 5 — Polish, Performance, and Readiness
- [ ] Replace placeholder/lorem-ipsum copy in `Footer.tsx` and `NewsLetter.tsx` with real content, or confirm with the user that placeholder content is acceptable for now.
- [ ] Compress/optimize the marketing images in `app/assets/` (several are 1MB+ PNGs) or move them to a CDN/image-optimization pipeline — they bloat both the repo and page load.
- [ ] Add basic error/empty states for the now-real async data (empty cart, empty product list, failed fetch) rather than only the synchronous dummy-data loading spinners that exist today.
- [ ] Add at least a minimal test setup (e.g., Vitest for unit tests on the `*.server.ts` data modules) — there is currently no test infrastructure at all.
- [ ] Verify `npm run build` and `npm run typecheck` both pass cleanly, and that the Dockerfile still builds successfully end-to-end.

---

## 7. Definition of Done

Consider the project complete when all of the following are true:

- A new user can sign up/sign in via Clerk, browse real products from the database, add them to a cart that survives a page refresh, check out against a real saved address, and see the resulting order on `/my-orders`.
- A seller-role user can log in, be blocked from nothing they should access and blocked from everything a customer shouldn't, add a new product with real uploaded images, and see their own products/orders on the seller dashboard.
- No route under `/seller` is reachable by a non-seller, even via direct URL, because the check happens in a server-side loader, not just client-side state.
- `npm run build`, `npm run typecheck`, and a fresh `docker build` all succeed.
- No secrets exist in the repository or its history going forward; `.env.example` documents every required variable with placeholder values only.
- No dead/orphaned files remain (`app/lib/authSeller.js`, `app/mainPage/`, `app/routes/test.tsx`, `commit_message.txt`, `.history/`).

---

## 8. Working Agreement for the Agent

- Work in small, reviewable commits, one phase (or sub-task) at a time. Don't attempt every phase in a single giant diff.
- Don't introduce a new framework, state-management library, or ORM in place of what's already configured without checking with the user first.
- Never commit real secret values — only placeholders in `.env.example`.
- If a decision in Section 4 needs to change based on something you discover, say so explicitly and explain why, rather than silently diverging.
- After each phase, run the build/typecheck and report what was verified versus what still needs manual testing (e.g., real Clerk login flows, real Cloudinary uploads) since some of this can't be fully verified without live credentials.
