import axios from "axios";
import { toast } from "react-toastify";
import { CiFilter } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";

import OrderList from "../components/orderList";

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

    console.log(
      `${endpoint}/orders/by-month?month=${parseInt(
        filter.month
      )}&year=${parseInt(filter.year)}`
    );

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
      .then((res) => {
        const responseData = res.data;
        const pendingRequest = responseData.filter(
          (order: orderProps) => order.status === "ordered"
        );
        setOrders(pendingRequest);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response.status == 404) {
          toast.error(err?.response?.data?.detail);
        }

        setLoading(false);
      });
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
            defaultValue=""
            value={filter.month}
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
            defaultValue=""
            value={filter.year}
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
            defaultValue=""
            value={filter.status}
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
