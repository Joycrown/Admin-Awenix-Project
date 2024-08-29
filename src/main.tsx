import "./index.css";
import React from "react";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <App />
    <ToastContainer limit={2} />
  </React.Fragment>
);
