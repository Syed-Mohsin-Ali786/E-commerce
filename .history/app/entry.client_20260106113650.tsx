import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import routes from "./routes";

startTransition(() => {
  const router = createBrowserRouter(routes);
  hydrateRoot(
    document,
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});