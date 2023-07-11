import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StrictMode } from "react";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  throw new Error("No root found");
}
