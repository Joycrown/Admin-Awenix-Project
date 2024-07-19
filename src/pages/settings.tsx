/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../utils/authContext";
import LoadingScreen from "../components/loadingScreen";

function Settings() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({ mail: "", userType: "staff" });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

    if (formInputs.mail === "" || formInputs.userType === "") {
      toast.error("Fill all inputs...");
      return;
    }

    const body = {
      email: formInputs.mail,
      user_type: formInputs.userType,
    };
    setLoading(true);

    axios
      .post(`${endpoint}/admin/invite`, body, {
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(() => {
        toast.success("User successfully invited");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response) {
          toast.error(err?.response?.data?.detail.replaceAll(/0-9./g, ""));
        } else {
          toast.error("Error encountered... Try again later");
        }

        setLoading(false);
      });
  };

  return (
    <section className="py-2 space-y-4">
      {loading && <LoadingScreen />}
      <div className="space-y-2">
        <h4 className="font-semibold text-xl">Settings</h4>
        <p>Invite an admin</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="flex gap-3 items-center">
          <input
            type="email"
            value={formInputs.mail}
            onChange={(e) =>
              setFormInputs((prev) => ({ ...prev, mail: e.target.value }))
            }
            placeholder="Email address of the admin you want to invite"
            className="bg-transparent border border-default-200 w-full outline-none p-3 rounded font-normal focus:border-default-300"
          />
          <div className="pr-4 bg-white">
            <select
              defaultValue="staff"
              onChange={(e) =>
                setFormInputs((prev) => ({ ...prev, userType: e.target.value }))
              }
              value={formInputs.userType}
              className="outline-0 border-0 px-4 py-3"
            >
              <option value="staff">Staff</option>
              <option value="super admin">Super Admin</option>
            </select>
          </div>
        </div>

        <button className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded">
          Send Invite
        </button>
      </form>
    </section>
  );
}

export default Settings;
