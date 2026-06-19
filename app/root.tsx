import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AppContextProvider } from "./context/AppContext";
import Navbar from "./routes/components/Navbar";
import Footer from "./routes/components/Footer";
import { clerkMiddleware, rootAuthLoader } from "@clerk/react-router/server";
import type { Route } from "./+types/root";
import "./app.css";
import { ClerkProvider } from "@clerk/react-router";
import { getOptionalUser } from "./.server/auth.server";
import { getAllProducts } from "./.server/product.server";
import { toClientProducts } from "./.server/product-mapper";
import { getCartItems } from "./.server/user.server";

export const middleware: Route.MiddlewareFunction[] = [clerkMiddleware()];

export const loader = (args: Route.LoaderArgs) =>
  rootAuthLoader(args, async () => {
    let initialProducts: Awaited<ReturnType<typeof toClientProducts>> = [];
    let initialCartItems: Awaited<ReturnType<typeof getCartItems>> = {};
    let initialIsSeller = false;
    let productsLoadError: string | null = null;

    try {
      const products = await getAllProducts();
      initialProducts = toClientProducts(products);
    } catch {
      productsLoadError =
        "We couldn't load products right now. Please try again shortly.";
    }

    try {
      const user = await getOptionalUser(args);
      if (user) {
        initialCartItems = await getCartItems(user.id);
        initialIsSeller = user.role === "SELLER";
      }
    } catch {
      // Cart/user sync is non-fatal; shop can still render.
    }

    return {
      initialProducts,
      initialCartItems,
      initialIsSeller,
      productsLoadError,
    };
  });

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App({ loaderData }: Route.ComponentProps) {
  const {
    initialProducts,
    initialCartItems,
    initialIsSeller,
    productsLoadError,
    ...clerkData
  } = loaderData;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ClerkProvider loaderData={clerkData}>
          <AppContextProvider
            initialProducts={initialProducts}
            initialCartItems={initialCartItems}
            initialIsSeller={initialIsSeller}
            productsLoadError={productsLoadError}
          >
            <Navbar />
            <Outlet />
            <Footer />
          </AppContextProvider>
        </ClerkProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
