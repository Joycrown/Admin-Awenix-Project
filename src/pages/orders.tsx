import axios from "axios";
import { toast } from "react-toastify";
import { CiFilter } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { months } from "../utils/data";
import { orderProps } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";
import ReceiptDownload from "../utils/receiptDownload";

// Add pagination interface
interface PaginationProps {
  items: orderProps[];
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

function Orders() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [paginatedOrders, setPaginatedOrders] = useState<PaginationProps>({
    items: [],
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
    has_next: false,
    has_previous: false
  });
  const [filter, setFilter] = useState({
    month: `${new Date().getMonth() + 1}`,
    year: `${new Date().getFullYear()}`,
    status: "",
    page: 1,
    pageSize: 10
  });

  useEffect(() => {
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
    setLoading(true);

    axios
      .get(
        `${endpoint}/orders/by-month?month=${parseInt(
          filter.month
        )}&year=${parseInt(filter.year)}&page=${filter.page}&page_size=${filter.pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then((res) => setPaginatedOrders(res.data))
      .catch((err) =>
        toast.error(err?.response?.data?.detail || "Error loading data")
      )
      .finally(() => setLoading(false));
  }, [user, filter.month, filter.year, filter.page, filter.pageSize]);

  const handlePageChange = (newPage: number) => {
    setFilter(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const resetFilters = () => {
    setFilter({
      month: "",
      year: "",
      status: "",
      page: 1,
      pageSize: 10
    });
  };

  const filteredOrders = paginatedOrders.items.filter((order) =>
    filter.status === ""
      ? order
      : order.status.toLowerCase() === filter.status.toLowerCase()
  );

  return (
    <section className="py-2 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-xl">Order Lists</h4>
        <div className="text-sm text-gray-500">
          Total Orders: {paginatedOrders.total_items}
        </div>
      </div>

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
                page: 1
              }))
            }
            value={filter.month ? filter.month : ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>Month</option>
            {months.map((month, id) => (
              <option key={`Sales ${month}`} value={id + 1}>{month}</option>
            ))}
          </select>
        </div>

        <div className="px-6 flex-1 border border-default-700 border-opacity-20">
          <select
            onChange={(e) =>
              setFilter((currentFilter) => ({
                ...currentFilter,
                year: e.target.value,
                page: 1
              }))
            }
            value={filter.year ? filter.year : ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>Year</option>
            {Array.from(
              { length: 2024 - new Date().getFullYear() + 1 },
              (_, index) => `${2024 + index}`
            ).map((year) => (
              <option key={`Sales ${year}`} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="px-6 flex-1 border border-default-700 border-opacity-20">
          <select
            onChange={(e) =>
              setFilter((currentFilter) => ({
                ...currentFilter,
                status: e.target.value
              }))
            }
            value={filter.status ? filter.status : ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>Order Status</option>
            <option value="ordered">Ordered</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </div>

        <div
          onClick={resetFilters}
          className="py-4 px-6 flex-1 min-w-[150px] text-default-400 flex items-center gap-2 cursor-pointer"
        >
          <FaClockRotateLeft />
          Reset Filter
        </div>
      </div>

      <OrderList orders={filteredOrders} loading={loading} />

      {/* Pagination Controls */}
      {!loading && paginatedOrders.total_pages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => handlePageChange(paginatedOrders.current_page - 1)}
            disabled={!paginatedOrders.has_previous}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-default-700 disabled:opacity-50"
          >
            <FaChevronLeft size={12} />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Page {paginatedOrders.current_page} of {paginatedOrders.total_pages}
            </span>
            <select
              value={filter.pageSize}
              onChange={(e) => setFilter(prev => ({
                ...prev,
                pageSize: Number(e.target.value),
                page: 1
              }))}
              className="ml-2 px-2 py-1 bg-default-700 rounded text-sm"
            >
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>

          <button
            onClick={() => handlePageChange(paginatedOrders.current_page + 1)}
            disabled={!paginatedOrders.has_next}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-default-700 disabled:opacity-50"
          >
            Next
            <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
}

function OrderList({ orders, loading }: { orders: orderProps[]; loading: boolean }) {
  return (
    <div className=" h-full overflow-y-auto">
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
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="border bg-white">
            {loading ? (
              <tr>
                <td colSpan={9} className="p-4 text-center bg-default-700 bg-opacity-20">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(({
                order_id,
                created_at,
                total_price,
                customer_details,
                order_verified_by,
                payment_reference,
                status,
                user_receipt_url
              }) => (
                <tr key={order_id} className="border-t">
                  <td title={order_id} className="p-4">
                    {order_id}
                  </td>
                  <td title={customer_details.name} className="p-4 max-w-[20ch] w-full truncate">
                    {customer_details.name}
                  </td>
                  <td title={customer_details.email} className="p-4 max-w-[20ch] w-full truncate">
                    {customer_details.email}
                  </td>
                  <td className="p-4 min-w-[140px]">
                    {new Date(created_at).getUTCDate()}{" "}
                    {months[new Date(created_at).getMonth()]}{" "}
                    {new Date(created_at).getFullYear()}
                  </td>
                  <td className="p-4 min-w-[140px]">
                    {payment_reference || "Null"}
                  </td>
                  <td className="p-4 min-w-[140px] capitalize">
                    {order_verified_by || "Null"}
                  </td>
                  <td className="p-4 min-w-[140px]">
                    ₦ {total_price.toLocaleString("en-gb")}
                  </td>
                  <td className="td-class p-4">
                    <span className={`rounded-md ${
                      status.toLowerCase() === "confirmed"
                        ? "bg-green-600/50 text-green-100"
                        : "bg-orange-600/50 text-orange-100"
                    } px-4 py-3 text-xs font-semibold uppercase antialiased block mx-auto w-fit`}>
                      {status}
                    </span>
                  </td>
                  <td className="m-1">
                    <ReceiptDownload
                      receivedFrom="orders"
                      receiptUrl={user_receipt_url}
                      orderId={order_id}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;