/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { toast } from "react-toastify";
import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { parseJwt } from "../utils/parser";
import { useAuthContext } from "../utils/authContext";
import Header from "./header";
import Sidebar from "./sidebar";
import Preloader from "../components/preloader";

function ProtectedRoutes() {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Scroll to the section when the page mounts
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Scroll to the top of the page if no hash is provided
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    if (user.accessToken === "" || user.accessToken === undefined) {
      setUser({
        name: "",
        accessToken: "",
        refreshToken: "",
        userType: "",
        isLogged: false,
        id: "",
      });
      navigate("/account/login");
      return;
    }

    if (user.userType === "user") {
      toast.error("You are not authorized...");
      window.location.href = `https://awenix.vercel.app/account/login`;
      return;
    }

    const decodedUser = parseJwt(user.accessToken);
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

    if (decodedUser.exp * 1000 < Date.now()) {
      axios
        .post(
          `${endpoint}/token/refresh`,
          { refresh_token: user.refreshToken },
          {
            data: {
              refresh_token: user.refreshToken,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          const { access_token } = res.data;

          setUser({
            ...user,
            accessToken: access_token,
          });
        })
        .catch(() => {
          setUser({
            name: "",
            accessToken: "",
            refreshToken: "",
            userType: "",
            isLogged: false,
            id: "",
          });

          toast.error("Please login again...");
          navigate("/account/login", { replace: true });
        });
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <main className="flex items-stretch">
        <Sidebar />
        <section
          style={{ maxHeight: "calc(100vh - 77px)" }}
          className="max-sm:!min-h-screen max-sm:!max-h-full flex-1 bg-default-700 bg-opacity-20 p-4 md:px-6 sm:overflow-y-auto"
        >
          <Suspense fallback={<Preloader />}>
            <Outlet />
          </Suspense>
        </section>
      </main>
    </>
  );
}

export default ProtectedRoutes;
