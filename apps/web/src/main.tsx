import { ApolloProvider } from "@apollo/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import client from "./helpers/apollo-client";
import "./index.css";
import AppStateProvider from "./providers/app-state/app-state";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  createRoot(rootElement).render(
    <StrictMode>
      <ApolloProvider client={client}>
        <AppStateProvider>
          <RouterProvider router={router} />
        </AppStateProvider>
      </ApolloProvider>
    </StrictMode>
  );
}
