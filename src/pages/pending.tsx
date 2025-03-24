import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import { months } from "../utils/data";
import { orderProps } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";
import LoadingScreen from "../components/loadingScreen";
import ReceiptDownload from "../utils/receiptDownload";
import OrderPopup from "../components/orderPopup";

interface PaginatedOrdersResponse {
  items: orderProps[];
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

function Pending() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<orderProps | null>(null);
  const [actionLoader, setActionLoader] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [paginatedOrders, setPaginatedOrders] = useState<PaginatedOrdersResponse>({
    items: [],
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
    has_next: false,
    has_previous: false,
  });

  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${endpoint}/orders/pending?page=${pagination.page}&page_size=${pagination.pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then((res) => {
        setPaginatedOrders(res.data);
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err?.response?.data?.detail);
        }
      })
      .finally(() => setLoading(false));
  }, [user, endpoint, pagination.page, pagination.pageSize]);

  const handleConfirm = (paymentRef: string, orderId: string) => {
    setActionLoader(true);
    axios
      .post(
        `${endpoint}/admin/confirm_order/${orderId}?payment_reference=${paymentRef}`,
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
        // Remove confirmed order from the list.
        setPaginatedOrders((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.order_id !== orderId),
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

  const handleDelete = () => {
    if (!orderToDelete) return;

    setActionLoader(true);
    axios
      .delete(
        `${endpoint}/admin/orders/${orderToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(() => {
        toast.success(`Order ${orderToDelete} has been deleted`);
        // Remove deleted order from the list
        setPaginatedOrders((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.order_id !== orderToDelete),
          total_items: prev.total_items - 1,
        }));
        setOrderToDelete(null);
        setDeleteModalOpen(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.detail || "Error while deleting order"
        );
      })
      .finally(() => setActionLoader(false));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const openDeleteModal = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
  };

  return (
    <section className="py-2 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h4 className="font-semibold text-xl">Pending</h4>
          <p>Orders waiting to be confirmed.</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Pending: {paginatedOrders.total_items}
        </div>
      </div>

      <div>{actionLoader && <LoadingScreen />}</div>

      <div className="flex items-center lg:justify-center w-full max-lg:overflow-x-auto">
        <table className="text-sm w-full max-xs:min-w-[500px] max-lg:min-w-[700px]">
          <thead className="bg-default-700 bg-opacity-30 rounded">
            <tr>
              <th className="text-start p-4">ID</th>
              <th className="text-start px-4">Name</th>
              {/* <th className="text-start px-4">Bank Paid To</th>
              <th className="text-start px-4">Paid by</th> */}
              <th className="text-start px-4">Date</th>
              <th className="text-start px-4">Total Price</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="border bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center bg-default-700 bg-opacity-20"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedOrders.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No pending orders found
                </td>
              </tr>
            ) : (
              paginatedOrders.items.map((order) => (
                <tr key={order.order_id} className="border-t">
                  <td className="td-class p-4 suspended-text">
                    {order.order_id}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    {order.customer_details.name}
                  </td>
                  {/* <td className="td-class p-4 suspended-text">
                    {order.user_bank_verification}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    {order.user_payment_name}
                  </td> */}
                  <td className="td-class p-4 suspended-text">
                    {new Date(order.created_at).getUTCDate()}{" "}
                    {months[new Date(order.created_at).getMonth()]}{" "}
                    {new Date(order.created_at).getFullYear()}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    ₦ {order.total_price.toLocaleString("en-gb")}
                  </td>
                  <td className="td-class p-4 flex gap-2">
                    <span
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-md bg-default-500/50 px-4 py-3 text-xs font-semibold uppercase text-white antialiased cursor-pointer"
                    >
                      View
                    </span>
                    <ReceiptDownload
                      receivedFrom="pending"
                      receiptUrl={order.user_receipt_url}
                      orderId={order.order_id}
                    />
                    {user.userType === "admin" && (
                      <span
                        onClick={() => openDeleteModal(order.order_id)}
                        className="rounded-md bg-red-500/70 px-4 py-3 text-xs font-semibold uppercase text-white antialiased cursor-pointer flex items-center"
                      >
                        <FaTrash className="mr-1" size={12} /> Delete
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
              Page {paginatedOrders.current_page} of{" "}
              {paginatedOrders.total_pages}
            </span>
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                setPagination((prev) => ({
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

      {selectedOrder && (
        <OrderPopup
          order={selectedOrder}
          closeFn={() => setSelectedOrder(null)}
          handleConfirm={handleConfirm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete order <span className="font-semibold">{orderToDelete}</span>?
              This action cannot be undone and will permanently remove the order and all associated data.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Pending;
