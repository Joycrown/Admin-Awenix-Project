import { lazy } from "react";
import { AuthProvider } from "./utils/authProvider";
import ProtectedRoutes from "./layout/protectedRoutes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignPage from "./pages/sign";

const Orders = lazy(() => import("./pages/orders"));
const Pending = lazy(() => import("./pages/pending"));
const Products = lazy(() => import("./pages/products"));
const Services = lazy(() => import("./pages/services"));
const Settings = lazy(() => import("./pages/settings"));
const LandingPage = lazy(() => import("./pages/landing"));
const Customers = lazy(() => import("./pages/customers"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/account/*" element={<SignPage />} />
          <Route path="/admin" element={<ProtectedRoutes />}>
            <Route path="/admin/" element={<LandingPage />}></Route>
            <Route path="/admin/dashboard" element={<LandingPage />}></Route>
            <Route path="/admin/products" element={<Products />}></Route>
            <Route path="/admin/services" element={<Services />}></Route>
            <Route path="/admin/orders" element={<Orders />}></Route>
            <Route path="/admin/pending" element={<Pending />}></Route>
            <Route path="/admin/customers" element={<Customers />}></Route>
            <Route path="/admin/settings" element={<Settings />}></Route>
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
