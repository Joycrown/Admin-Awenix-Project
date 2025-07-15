/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../../../components/loadingScreen";
import PasswordInput from "../../../components/passwordInput";

function ScreenThree() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search).get("token");
    if (params) {
      setToken(params);
    } else {
      navigate("/account/forgot-password-1");
    }
  }, [location, navigate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

    if (confirmPassword !== password) {
      return toast.error("Password doesn't match...");
    }

    setLoading(true);

    axios
      .put(`${endpoint}/set_password`, {
        new_password: password,
        token: token,
      })
      .then(() => {
        setLoading(false);
        navigate("/account/login");
      })
      .catch(() => {
        setLoading(false);
        toast.error("Encountered an error... Try again");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-4 text-black h-full w-full max-w-sm mx-auto"
    >
      {loading && <LoadingScreen />}
      <h2>Set New Password</h2>
      <p>Type in your new password</p>

      <PasswordInput
        value={password}
        setValue={(value: string) => setPassword(value)}
        id="password"
        placeholder="New Password"
      />

      {/* Confirm Password */}
      <PasswordInput
        value={confirmPassword}
        setValue={(value: string) => setConfirmPassword(value)}
        id="confirmPassword"
        placeholder="Confirm Password"
      />

      <button className="py-3 px-6 bg-default-500 text-white rounded outline-none border-none">
        Change Password
      </button>
    </form>
  );
}

export default ScreenThree;
