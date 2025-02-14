import axios from "axios";
import { toast } from "react-toastify";
import { CiFilter } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { months } from "../utils/data";
import { orderProps } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";
import LoadingScreen from "../components/loadingScreen";
import OrderListPopup from "../components/orderListpopup";
import OrderPopup from "../components/orderPopup";

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
    has_previous: false,
  });
  const [filter, setFilter] = useState({
    month: `${new Date().getMonth() + 1}`,
    year: `${new Date().getFullYear()}`,
    status: "",
    page: 1,
    pageSize: 10,
  });
  const [selectedOrder, setSelectedOrder] = useState<orderProps | null>(null);
  const [actionLoader, setActionLoader] = useState(false);

  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  useEffect(() => {
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
  }, [user, filter.month, filter.year, filter.page, filter.pageSize, endpoint]);

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const resetFilters = () => {
    setFilter({
      month: "",
      year: "",
      status: "",
      page: 1,
      pageSize: 10,
    });
  };

  // Filter orders based on status if one is selected.
  const filteredOrders = paginatedOrders.items.filter((order) =>
    filter.status === ""
      ? true
      : order.status.toLowerCase() === filter.status.toLowerCase()
  );

  // Admin confirm handler – calls the admin confirm endpoint.
  const handleConfirm = (
    paymentRef: string,
    orderId: string,
    forceConfirm: boolean = false
  ) => {
    setActionLoader(true);
    axios
      .post(
        `${endpoint}/admin/confirm_order/${orderId}?payment_reference=${paymentRef}&force_confirm=${forceConfirm}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(() => {
        toast.success(`${orderId} has been confirmed`);
        // Remove the confirmed order from the list.
        setPaginatedOrders((prev) => ({
          ...prev,
          items: prev.items.filter((order) => order.order_id !== orderId),
          total_items: prev.total_items - 1,
        }));
        setSelectedOrder(null);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.detail || "Error while confirming order"
        );
      })
      .finally(() => setActionLoader(false));
  };

  return (
    <section className="py-2 space-y-4">
      {/* Header and Filter */}
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
                page: 1,
              }))
            }
            value={filter.month || ""}
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
                page: 1,
              }))
            }
            value={filter.year || ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>
              Year
            </option>
            {Array.from(
              { length: 2024 - new Date().getFullYear() + 1 },
              (_, index) => `${2024 + index}`
            ).map((year) => (
              <option key={`Sales ${year}`} value={year}>
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
            value={filter.status || ""}
            className="outline-0 bg-transparent py-4"
          >
            <option value="" hidden>
              Order Status
            </option>
            <option value="ordered">Ordered</option>
            <option value="confirmed">Confirmed</option>
            <option value="received">Received</option>
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

      {/* Order List */}
      <OrderListPopup
        orders={filteredOrders}
        loading={loading}
        setSelectedOrder={setSelectedOrder}
      />

      {/* Pagination Controls */}
      {!loading && paginatedOrders.total_pages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() =>
              handlePageChange(paginatedOrders.current_page - 1)
            }
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
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  page: 1,
                }))
              }
              className="ml-2 px-2 py-1 bg-default-700 rounded text-sm"
            >
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>
          <button
            onClick={() =>
              handlePageChange(paginatedOrders.current_page + 1)
            }
            disabled={!paginatedOrders.has_next}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-default-700 disabled:opacity-50"
          >
            Next
            <FaChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Render the OrderPopup modal if an order is selected */}
      {selectedOrder && (
        <OrderPopup
          order={selectedOrder}
          closeFn={() => setSelectedOrder(null)}
          handleConfirm={handleConfirm}
          forceConfirm={true} // Force confirm flag for Orders.tsx
        />
      )}

      {actionLoader && (
        <div className="fixed inset-0 z-50">
          <LoadingScreen />
        </div>
      )}
    </section>
  );
}

export default Orders;
