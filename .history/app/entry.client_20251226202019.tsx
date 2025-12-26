import { HydratedRouter } from "react-router-dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./root";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter>
        <App />
      </HydratedRouter>
    </StrictMode>
  );
});