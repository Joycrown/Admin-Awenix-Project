/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { googleIcon } from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../utils/authContext";
import LoadingScreen from "../../components/loadingScreen";

function Login() {
  const { setUser } = useAuthContext();
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
    const body = {
      username: details.email,
      password: details.password,
      client_id: "",
      client_secret: "",
      scope: "",
      grant_type: "",
    };
    setLoading(true);

    axios
      .post(`${endpoint}/login`, body, {
        data: {
          grant_type: "",
          scope: "",
          username: details.email,
          password: details.password,
          client_id: "",
          client_secret: "",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        const { access_token, refresh_token, current_user, user_type, id } =
          res.data;

        console.log(res.data);

        setUser({
          accessToken: access_token,
          refreshToken: refresh_token,
          name: current_user,
          userType: user_type,
          isLogged: true,
          id: id,
        });

        navigate("/admin/dashboard");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response.status == 400) {
          toast.error(err?.response?.data?.detail.replaceAll(/0-9./g, ""));
        }

        setLoading(false);
      });
  };

  const handleSignIn = () => {
    console.log("Signing up with google");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-4 text-black h-full w-full max-w-sm mx-auto"
    >
      {loading && <LoadingScreen />}
      <h2>Log in to Awenix</h2>
      <p>Enter your details below</p>

      {/* Email address or Phone number */}
      <input
        placeholder="Email address"
        className="border-b px-2 py-3 outline-none"
        value={details.email}
        onChange={(e) =>
          setDetails((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="border-b px-2 py-3 outline-none"
        value={details.password}
        onChange={(e) =>
          setDetails((prev) => ({ ...prev, password: e.target.value }))
        }
        required
      />
      <div>
        <Link
          className="ml-auto block w-fit text-xs hover:underline underline-offset-8 hover:text-default-500"
          to="/account/forgot-password-1"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="py-3 px-6 bg-default-500 text-white rounded outline-none border-none"
      >
        Log in
      </button>

      <div
        onClick={handleSignIn}
        className="w-full py-3 px-4 cursor-pointer bg-transparent flex gap-4 items-center justify-center border-default-100 border rounded-md"
      >
        <img className="w-6 mx-0" src={googleIcon} alt="Sign up with google" />{" "}
        Sign in with Google
      </div>

      <p className="text-center text-sm">
        Don't have account?{" "}
        <Link
          className="hover:underline underline-offset-8 hover:text-default-500"
          to="/account/register"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default Login;
