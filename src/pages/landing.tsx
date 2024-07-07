import axios from "axios";
import { toast } from "react-toastify";
import { FiBox } from "react-icons/fi";
import { HiUsers } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { FaClockRotateLeft, FaChartLine } from "react-icons/fa6";

import { orderProps } from "../utils/interface";
import InfoCards from "../components/infoCards";
import DealDetails from "../components/dealDetails";
import SalesDetails from "../components/salesDetails";
import { useAuthContext } from "../utils/authContext";

function LandingPage() {
  const { user } = useAuthContext();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  const [orders, setOrders] = useState<orderProps[]>([]);

  const [users, setUsers] = useState(0);

  const getOrders = async () => {
    axios
      .get(`${endpoint}/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        const responseData = res.data;
        setOrders(responseData);
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response.status == 400) {
          toast.error(err?.response?.data?.detail);
        }
      });
  };

  const getUsers = async () => {
    axios
      .get(`${endpoint}/all_users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        const responseData = res.data;
        setUsers(responseData.length);
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response.status == 400) {
          toast.error(err?.response?.data?.detail);
        }
      });
  };

  useEffect(() => {
    getUsers();
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-2 space-y-4">
      <h4 className="font-semibold text-xl">Dashboard</h4>
      <div className="flex flex-wrap gap-3">
        <InfoCards
          heading="Total Users"
          gradeColor="rgba(0, 46, 223, 0.1)"
          value={users}
          icon={<HiUsers size="1.3rem" color="rgb(51, 89, 241)" />}
        />
        <InfoCards
          heading="Total Order"
          gradeColor="rgba(250, 204, 21, 0.2)"
          value={orders.length}
          icon={<FiBox size="1.4rem" color="rgb(250, 204, 21)" />}
        />
        <InfoCards
          heading="Total Sales"
          gradeColor="rgba(22, 163, 74, 0.3)"
          value={`₦ ${orders
            .reduce(
              (acc: number, currentValue: orderProps) =>
                acc + currentValue.total_price,
              0
            )
            .toLocaleString("en-gb")}`}
          icon={<FaChartLine color="rgb(22, 163, 74)" />}
        />
        <InfoCards
          heading="Total Pending"
          gradeColor="rgba(249, 143, 67, 0.3)"
          value={
            orders.filter(
              (order: orderProps) => order.status.toLowerCase() !== "confirmed"
            ).length
          }
          icon={<FaClockRotateLeft color="rgb(249, 143, 67)" />}
        />
      </div>

      <SalesDetails allOrders={orders} />
      <DealDetails allOrders={orders} />
    </section>
  );
}

export default LandingPage;
