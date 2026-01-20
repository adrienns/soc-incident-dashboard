import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { setupInterceptors } from "./api/client";
import ErrorBoundary from "./components/feedback/ErrorBoundary";
import "@/styles/globals.css";

setupInterceptors(store);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <Provider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Provider>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
);

