/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/loadingScreen";

function Register() {
  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_no: "",
    password: "",
  });

  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search).get("token");
    if (params) {
      setToken(params);
    } else {
      navigate("/account/login");
    }
  }, [navigate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const { first_name, last_name, username, phone_no, password } = details;

    if (
      first_name === "" ||
      last_name === "" ||
      phone_no === "" ||
      password === "" ||
      username === ""
    ) {
      toast.error("All input fields must be filled");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be more than 8 characters");
      return;
    }

    setLoading(true);

    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
    const body = {
      first_name,
      last_name,
      username,
      phone_no,
      password,
      token,
    };

    axios
      .put(`${endpoint}/admin/signup`, body, {
        data: { ...body },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setLoading(false);
        toast.success("Account Successfully, log in...");
        setTimeout(() => {
          navigate("/account/login");
        }, 1500);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          toast.error(err.response.data.detail.replaceAll(/0-9./g, ""));
        }
        console.log(err);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-4 text-black h-full w-full max-w-md mx-auto"
    >
      {loading && <LoadingScreen />}
      <h2>Admin Signup</h2>
      <p>Enter your details below</p>

      <div className="flex gap-3">
        {/* First Name */}
        <input
          id="first_name"
          placeholder="First Name"
          className="border-b px-2 py-3 outline-none"
          value={details.first_name}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, first_name: e.target.value }))
          }
          required
        />

        {/* Last Name */}
        <input
          id="last_name"
          placeholder="Last Name"
          className="border-b px-2 py-3 outline-none"
          value={details.last_name}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, last_name: e.target.value }))
          }
          required
        />
      </div>

      <div className="flex gap-3">
        <input
          id="username"
          placeholder="Username"
          className="border-b px-2 py-3 outline-none"
          value={details.username}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, username: e.target.value }))
          }
          required
        />

        {/* Phone number */}
        <input
          id="phone_no"
          placeholder="Phone number"
          className="border-b px-2 py-3 outline-none"
          value={details.phone_no}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, phone_no: e.target.value }))
          }
          required
        />
      </div>

      <div className="flex gap-3">
        {/* Password */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border-b px-2 py-3 outline-none"
          value={details.password}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, password: e.target.value }))
          }
          required
        />
      </div>

      <button
        type="submit"
        className="py-3 px-6 bg-default-500 text-white rounded outline-none border-none"
      >
        Create Account
      </button>
    </form>
  );
}

export default Register;
