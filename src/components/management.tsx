import { useEffect, useState } from "react";
import { adminUser, userProps } from "../utils/interface";
import axios from "axios";
import { toast } from "react-toastify";
import { months } from "../utils/data";

function SuperManagement({ user }: { user: userProps }) {
  const [admins, setAdmins] = useState<adminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

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
  }, [user]);

  const handleAction = (id: string, accessType: string, grant: string) => {
    if (grant === accessType) return;
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

    setAdmins((prev) =>
      prev.map((data) =>
        data.id === id ? { ...data, isChanging: true } : data
      )
    );

    axios
      .post(
        `${endpoint}/admin/invoke_access/${id}?access=${grant}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(() => {
        setAdmins((prev) =>
          prev.map((data) =>
            data.id === id
              ? {
                  ...data,
                  isChanging: false,
                  admin_status: grant,
                }
              : data
          )
        );
        toast.success(`Admin access have been ${grant.toLowerCase()}`);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.detail || "Error changing admin access"
        );
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
                      <td className="p-4 text-center capitalize">
                        {admin_status.toLowerCase() === "ok"
                          ? "Active"
                          : admin_status}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`rounded-md bg-red-600 text-white px-4 text-xs font-semibold uppercase antialiased block mx-auto w-fit ${
                            isChanging
                              ? "cursor-not-allowed bg-opacity-20"
                              : "cursor-pointer"
                          }`}
                        >
                          <select
                            value={admin_status}
                            className="bg-transparent outline-none border-none py-3"
                            onChange={(e) =>
                              !isChanging &&
                              handleAction(id, admin_status, e.target.value)
                            }
                          >
                            <option className="text-black" value="Ok">
                              Grant Access
                            </option>
                            <option className="text-black" value="Removed">
                              Remove Access
                            </option>
                            <option className="text-black" value="Invoked">
                              Suspend
                            </option>
                          </select>
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

export default SuperManagement;
