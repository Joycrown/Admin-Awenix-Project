/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../utils/authContext";
import LoadingScreen from "../components/loadingScreen";
import { useNavigate } from "react-router-dom";
import { months } from "../utils/data";
import { userProps } from "../utils/interface";

function Settings() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({ mail: "", userType: "staff" });
  const navigate = useNavigate();

  useEffect(() => {
    if (user.userType.toLowerCase() !== "super admin") {
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
              <option value="super admin">Super Admin</option>
            </select>
          </div>
        </div>

        <button className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded">
          Send Invite
        </button>
      </form>

      {user.userType === "super admin" && <SuperManagement user={user} />}
    </section>
  );
}

export default Settings;

interface adminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  admin_status: string;
  user_type: string;
  created_at: Date;
  isChanging: boolean;
}

function SuperManagement({ user }: { user: userProps }) {
  const [admins, setAdmins] = useState<adminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`${endpoint}/admin_list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) =>
        setAdmins(
          res.data.map((data: adminUser) => ({ ...data, isChanging: false }))
        )
      )
      .catch((err) =>
        toast.error(err?.response?.data?.detail || "Error loading data")
      )
      .finally(() => setIsLoading(false));
  }, [user, endpoint]);

  const handleAction = (id: string, accessType: string) => {
    setAdmins((prev) =>
      prev.map((data) =>
        data.id === id ? { ...data, isChanging: true } : data
      )
    );

    axios
      .post(`${endpoint}/admin/invoke_access/${id}?access=${accessType}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(() =>
        setAdmins((prev) =>
          prev.map((data) =>
            data.id === id
              ? {
                  ...data,
                  isChanging: false,
                  admin_status: accessType.toLowerCase(),
                }
              : data
          )
        )
      )
      .catch((err) => {
        toast.error(err?.response?.data?.detail || "Error loading data");
        setAdmins((prev) =>
          prev.map((data) =>
            data.id === id ? { ...data, isChanging: false } : data
          )
        );
      });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-semibold text-xl">Manage Admins</h4>
        <p>Revoke or grant access to admins</p>
      </div>
      <div className="flex items-center w-full max-lg:overflow-x-auto h-full">
        {isLoading ? (
          "Getting admins..."
        ) : (
          <table className="border-separate border-spacing-y-0 text-sm w-full max-xs:min-w-[500px] max-lg:min-w-[700px]">
            <thead className="bg-default-500 text-white rounded">
              <tr>
                <th className="text-start p-4">Name</th>
                <th className="text-start px-4">Email</th>
                <th className="text-start px-4">Admin Type</th>
                <th className="text-start px-4">Date Added</th>
                <th className="text-start px-4">Status</th>
                <th className="text-center">Access</th>
              </tr>
            </thead>
            <tbody className="border bg-slate-100 [&>*:nth-child(even)]:bg-slate-300">
              {admins
                .filter((admins) => admins.id !== user.id)
                .map(
                  ({
                    first_name,
                    last_name,
                    email,
                    user_type,
                    admin_status,
                    created_at,
                    id,
                    isChanging,
                  }: adminUser) => (
                    <tr key={id}>
                      <td
                        title={`${first_name} ${last_name}`}
                        className="p-4 capitalize truncate"
                      >
                        {first_name} {last_name}
                      </td>
                      <td title={email} className="p-4 truncate">
                        {email}
                      </td>
                      <td className="p-4 capitalize min-w-[140px]">
                        {user_type}
                      </td>
                      <td className="p-4 min-w-[140px]">
                        {new Date(created_at).getUTCDate()}{" "}
                        {months[new Date(created_at).getMonth()]}{" "}
                        {new Date(created_at).getFullYear()}
                      </td>
                      <td className="p-4 text-center">
                        {admin_status === "ok" ? "Active" : "Suspended"}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`rounded-md ${
                            admin_status !== "ok"
                              ? "bg-green-600/50 text-green-100"
                              : "bg-red-600 text-white"
                          } px-4 py-3 text-xs font-semibold uppercase antialiased block mx-auto w-fit ${
                            isChanging
                              ? "cursor-not-allowed bg-opacity-20"
                              : "cursor-pointer"
                          }`}
                          onClick={() =>
                            !isChanging &&
                            handleAction(
                              id,
                              admin_status !== "ok" ? "Ok" : "Invoked"
                            )
                          }
                        >
                          {admin_status !== "ok" ? "Grant Access" : "Suspend"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
