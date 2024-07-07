import { useEffect, useState } from "react";

import { orderProps } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";
import { months } from "../utils/data";

function SalesDetails({ allOrders }: { allOrders: orderProps[] }) {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<orderProps[]>(allOrders);
  const [filter, setFilter] = useState({
    month: `${new Date().getMonth() + 1}`,
    year: `${new Date().getFullYear()}`,
  });

  useEffect(() => {
    const filteredOrders = allOrders.filter((order) => {
      const date = new Date(order.created_at);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return month === parseInt(filter.month) && year === parseInt(filter.year);
    });

    setOrders(filteredOrders);
  }, [user, filter.month, filter.year, allOrders]);

  return (
    <div className="bg-white rounded-xl px-4 py-4 space-y-3">
      <div className="flex items-center text-xs">
        <h4 className="font-semibold text-lg">Sales Details</h4>
        <select
          onChange={(e) =>
            setFilter((currentFilter) => ({
              ...currentFilter,
              month: e.target.value,
            }))
          }
          defaultValue=""
          value={filter.month}
          className="outline-0 border py-1 px-2 ml-auto"
        >
          <option value="" hidden>
            Month
          </option>
          {months.map((month, id) => (
            <option key={`Deals ${month}`} value={id + 1}>
              {month}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setFilter((currentFilter) => ({
              ...currentFilter,
              year: e.target.value,
            }))
          }
          defaultValue=""
          value={filter.year}
          className="outline-0 border py-1 px-2"
        >
          <option value="" hidden>
            Year
          </option>
          {Array.from(
            { length: 2024 - new Date().getFullYear() + 1 },
            (_, index) => `${2024 + index}`
          ).map((year) => (
            <option key={`Deals ${year}`} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SalesDetails;
