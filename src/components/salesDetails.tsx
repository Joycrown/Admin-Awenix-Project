import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { months } from "../utils/data";
import { useAuthContext } from "../utils/authContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface dataSet {
  data: number[] | string[];
  borderColor: string;
}

interface lineData {
  labels: string[];
  datasets: dataSet[];
}

function SalesDetails() {
  const { user } = useAuthContext();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const [orders, setOrders] = useState<lineData>({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "",
      },
    ],
  });
  const [filter, setFilter] = useState({
    month: `${new Date().getMonth() + 1}`,
    year: `${new Date().getFullYear()}`,
  });

  useEffect(() => {
    axios
      .get(
        `${endpoint}/orders-range/sales-distribution?month=${parseInt(
          filter.month
        )}&year=${parseInt(filter.year)}&num_ranges=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(
        ({
          data,
        }: {
          data: { price_ranges: string[]; user_percentages: number[] };
        }) => {
          setOrders({
            labels: [...data.price_ranges],
            datasets: [
              {
                data: [...data.user_percentages],
                borderColor: "rgba(0, 146, 223, 1)",
              },
            ],
          });
        }
      )
      .catch((err) => {
        console.log(err.response);

        if (err.response) {
          toast.error(err?.response?.data?.detail);
        }
      });
  }, [user, filter.month, filter.year, endpoint]);

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

      <Line options={options} data={orders} />
      {/* <div>{orders.map((order) => order.customer)}</div>
      <div className="w-full max-w-[calc(100vw-8rem)]">
      </div> */}
    </div>
  );
}

export default SalesDetails;
