/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getOrders = async (page: number = 1) => {
    setIsLoading(true);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

    try {
      const response = await axios.get(
        `${endpoint}/orders/by-month?year=${currentYear}&month=${currentMonth}&page=${page}&page_size=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      
      const responseData = response.data;
      setOrders(responseData.items);
      setTotalPages(responseData.total_pages);
      setCurrentPage(responseData.current_page);
    } catch (err: any) {
      console.error(err.response);
      if (err.response?.status === 400) {
        toast.error(err?.response?.data?.detail);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(`${endpoint}/all_users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setUsers(response.data.length);
    } catch (err: any) {
      if (err.response) {
        toast.error(err?.response?.data?.detail);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      getOrders(newPage);
    }
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

      <SalesDetails />
      <DealDetails allOrders={orders} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default LandingPage;