import { useEffect, useState } from "react";
import { chicksSlide, eggsImage, logo, signSlide } from "../../assets";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./login";
import Register from "./register";
import ScreenOne from "./forgot-password/screenOne";
import ScreenThree from "./forgot-password/screenThree";
import { useAuthContext } from "../../utils/authContext";

function Sign() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [signSlide, eggsImage, chicksSlide];
  const { user } = useAuthContext();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isLogged) navigate("/admin");
     console.log(user)

    const route = pathname.split("/")[2];

    if (route === "") {
      return navigate("/login");
    } else if (route === "forgot-password-1") {
      return setCurrentImage(1);
    } else if (route.includes("forgot-password")) {
      return setCurrentImage(2);
    }

    setCurrentImage(0);
  }, [navigate, pathname, user]);

  return (
    <div className="flex flex-1 sm:min-h-screen">
      <div className="w-1/2 max-md:hidden">
        <img className="h-full w-full" src={images[currentImage]} alt="Sign" />
      </div>
      <div className="flex-1 px-8 lg:px-12 pt-8 pb-16">
        <div className="max-w-md mx-auto">
          <img src={logo} alt="Awenix" className="w-32 mx-0" />
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password-1" element={<ScreenOne />} />
          <Route path="/forgot-password-2" element={<ScreenThree />} />
          <Route path="*" element={<Navigate to="/account/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Sign;
