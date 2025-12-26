import { HydratedRouter } from "react-router-dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      {/* HydratedRouter MUST be self-closing. No <App /> here. */}
      <HydratedRouter />
    </StrictMode>
  );
});