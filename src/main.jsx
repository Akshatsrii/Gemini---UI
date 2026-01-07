import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ContextProvider from "./context/Context.jsx";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      
      {/* SIGNED OUT */}
      <SignedOut>
        <App />
      </SignedOut>

      {/* SIGNED IN */}
      <SignedIn>
        <ContextProvider>
          <App />
        </ContextProvider>
      </SignedIn>

    </ClerkProvider>
  </React.StrictMode>
);
