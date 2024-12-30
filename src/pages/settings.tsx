/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../utils/authContext";
import LoadingScreen from "../components/loadingScreen";
import { useNavigate } from "react-router-dom";
import SuperManagement from "../components/management";

function Settings() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({ mail: "", userType: "staff" });
  const [showInviteFields, setShowInviteFields] = useState(false);
  const [showUpgradeFields, setShowUpgradeFields] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.userType.toLowerCase() !== "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

    if (formInputs.mail === "" || formInputs.userType === "") {
      toast.error("Add a valid email address");
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
        setShowInviteFields(false);
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

  const handleUpgradeAdmin = (e: any) => {
    e.preventDefault();

    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

    if (formInputs.mail === "" || formInputs.userType === "") {
      toast.error("Add a valid email address");
      return;
    }

    const body = {
      email: formInputs.mail,
      user_type: formInputs.userType,
    };

    setLoading(true);

    axios
      .post(`${endpoint}/admin/promote`, body, {
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(() => {
        toast.success("User successfully promoted");
        setLoading(false);
        setShowUpgradeFields(false);
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

        <div>
          <button
            onClick={() => setShowInviteFields((prev) => !prev)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Invite an Admin
          </button>
          {showInviteFields && (
            <form onSubmit={handleSubmit} className="w-full space-y-4 mt-4">
              <div className="flex gap-3 items-center">
                <input
                  type="email"
                  value={formInputs.mail}
                  onChange={(e) =>
                    setFormInputs((prev) => ({ ...prev, mail: e.target.value }))
                  }
                  placeholder="Email address of the admin you want to invite"
                  className="bg-white border border-default-200 w-full outline-none p-3 rounded font-normal focus:border-default-300"
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
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded">
                Send Invite
              </button>
            </form>
          )}
        </div>

        <div>
          <button
            onClick={() => setShowUpgradeFields((prev) => !prev)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Upgrade an Admin
          </button>
          {showUpgradeFields && (
            <form onSubmit={handleUpgradeAdmin} className="w-full space-y-4 mt-4">
              <div className="flex gap-3 items-center">
                <input
                  type="email"
                  value={formInputs.mail}
                  onChange={(e) =>
                    setFormInputs((prev) => ({ ...prev, mail: e.target.value }))
                  }
                  placeholder="Email address of the admin you want to upgrade"
                  className="bg-white border border-default-200 w-full outline-none p-3 rounded font-normal focus:border-default-300"
                />
                <div className="pr-4 bg-white">
                  <select
                    defaultValue="admin"
                    onChange={(e) =>
                      setFormInputs((prev) => ({ ...prev, userType: e.target.value }))
                    }
                    value={formInputs.userType}
                    className="outline-0 border-0 px-4 py-3"
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded">
                Upgrade
              </button>
            </form>
          )}
        </div>
      </div>

      {user.userType === "admin" && <SuperManagement user={user} />}
    </section>
  );
}

export default Settings;
