import axios from "axios";
import { toast } from "react-toastify";
import { CiFilter } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";

import { months } from "../utils/data";
import { orderProps } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";

function Orders() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<orderProps[]>([]);
  const [filter, setFilter] = useState({
    month: `${new Date().getMonth() + 1}`,
    year: `${new Date().getFullYear()}`,
    status: "",
  });

  useEffect(() => {
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
    setLoading(true);
    setOrders([]);

    axios
      .get(
        `${endpoint}/orders/by-month?month=${parseInt(
          filter.month
        )}&year=${parseInt(filter.year)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then((res) => setOrders(res.data))
      .catch((err) =>
        toast.error(err?.response?.data?.detail || "Error loading data")
      )
      .finally(() => setLoading(false));
  }, [user, filter.month, filter.year]);

  return (
    <section className="py-2 space-y-4">
      <h4 className="font-semibold text-xl">Order Lists</h4>

      <div className="flex flex-wrap items-center border border-default-700 border-opacity-20 text-sm font-medium w-fit rounded bg-default-800 bg-opacity-70">
        <div className="py-4 px-6 border border-default-700 border-opacity-20">
          <CiFilter size="1.3rem" />
        </div>

        <div className="py-4 px-6 flex-1 truncate border border-default-700 border-opacity-20">
          Filter By
        </div>

        <div className="px-6 flex-1 border border-default-700 border-opacity-20">
          <select
            onChange={(e) =>
              setFilter((currentFilter) => ({
                ...currentFilter,
                month: e.target.value,
              }))
            }
            value={filter.month ? filter.month : ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>
              Month
            </option>
            {months.map((month, id) => (
              <option key={`Sales ${month}`} value={id + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="px-6 flex-1 border border-default-700 border-opacity-20">
          <select
            onChange={(e) =>
              setFilter((currentFilter) => ({
                ...currentFilter,
                year: e.target.value,
              }))
            }
            value={filter.year ? filter.year : ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>
              Year
            </option>
            {Array.from(
              { length: 2024 - new Date().getFullYear() + 1 },
              (_, index) => `${2024 + index}`
            ).map((year) => (
              <option key={`Sales ${year}`} value={`${year}`}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="px-6 flex-1 border border-default-700 border-opacity-20">
          <select
            onChange={(e) =>
              setFilter((currentFilter) => ({
                ...currentFilter,
                status: e.target.value,
              }))
            }
            value={filter.status ? filter.status : ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>
              Order Status
            </option>
            <option value="ordered">Ordered</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </div>

        <div
          onClick={() => setFilter({ month: "", year: "", status: "" })}
          className="py-4 px-6 flex-1 min-w-[150px] text-default-400 flex items-center gap-2 cursor-pointer"
        >
          <FaClockRotateLeft />
          Reset Filter
        </div>
      </div>

      <OrderList
        orders={orders.filter((order) =>
          filter.status === ""
            ? order
            : order.status.toLowerCase() === filter.status.toLowerCase()
        )}
        loading={loading}
      />
    </section>
  );
}

export default Orders;

function OrderList({
  orders,
  loading,
}: {
  orders: orderProps[];
  loading: boolean;
}) {
  return (
    <div className="max-h-screen h-full overflow-y-auto">
      <div className="flex items-center w-full max-lg:overflow-x-auto">
        <table className="text-sm w-full max-xs:min-w-[500px] max-lg:min-w-[700px]">
          <thead className="bg-default-700 bg-opacity-30 rounded">
            <tr>
              <th className="text-start p-4">ID</th>
              <th className="text-start px-4">Name</th>
              <th className="text-start px-4">Email</th>
              <th className="text-start px-4">Date</th>
              <th className="text-start px-4">Payment Ref</th>
              <th className="text-start px-4">Confirmed By</th>
              <th className="text-start px-4">Total Price</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody className="border bg-white">
            {loading && (
              <tr>
                <td className="p-4 bg-default-700 bg-opacity-20">Loading...</td>
              </tr>
            )}
            {orders.map(
              ({
                order_id,
                created_at,
                total_price,
                customer_details,
                order_verified_by,
                payment_reference,
                status,
              }: orderProps) => (
                <tr key={order_id} className="border-t">
                  <td title={order_id} className="p-4">
                    {order_id}
                  </td>
                  <td
                    title={customer_details.name}
                    className="p-4 max-w-[20ch] w-full truncate"
                  >
                    {customer_details.name}
                  </td>
                  <td
                    title={customer_details.email}
                    className="p-4 max-w-[20ch] w-full truncate"
                  >
                    {customer_details.email}
                  </td>
                  <td className="p-4 min-w-[140px]">
                    {new Date(created_at).getUTCDate()}{" "}
                    {months[new Date(created_at).getMonth()]}{" "}
                    {new Date(created_at).getFullYear()}
                  </td>
                  <td className="p-4 min-w-[140px]">
                    {payment_reference ? payment_reference : "Null"}
                  </td>
                  <td className="p-4 min-w-[140px] capitalize">
                    {order_verified_by ? order_verified_by : "Null"}
                  </td>
                  <td className="p-4 min-w-[140px]">
                    ₦ {total_price.toLocaleString("en-gb")}
                  </td>
                  <td className="td-class p-4">
                    <span
                      className={`rounded-md ${
                        status.toLowerCase() === "confirmed"
                          ? "bg-green-600/50 text-green-100"
                          : "bg-orange-600/50 text-orange-100"
                      } px-4 py-3 text-xs font-semibold uppercase antialiased block mx-auto w-fit`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
