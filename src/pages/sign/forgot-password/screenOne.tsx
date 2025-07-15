/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import LoadingScreen from "../../../components/loadingScreen";

function ScreenOne() {
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${endpoint}/forgot_password`, {
        email: mail,
      })
      .then(() => {
        setLoading(false);
        toast.success("Verification mail has been sent to your email");
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
      <h2>Forgot Password</h2>
      <p>Enter your email below</p>

      {/* Email address */}
      <input
        type="email"
        placeholder="Email address"
        className="border-b px-2 py-3 outline-none"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        required
      />

      <div className="flex gap-4 w-full text-center max-w-60 mx-auto">
        <div
          onClick={() => navigate(-1)}
          className="py-2 px-6 text-default-500 rounded outline-none border border-default-500 cursor-pointer flex-1"
        >
          Back
        </div>

        <button className="flex-1 py-2 px-6 bg-default-500 text-white rounded outline-none border-none">
          Next
        </button>
      </div>

      <p className="text-center text-sm">
        Remembered password?{" "}
        <Link
          className="hover:underline underline-offset-8 hover:text-default-500"
          to="/account/login"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

export default ScreenOne;
