import { HydratedRouter } from "react-router-dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
// You don't even need to import App here in Framework Mode!

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      {/* Remove <App /> from inside here. It must be self-closing. */}
      <HydratedRouter />
    </StrictMode>
  );
});