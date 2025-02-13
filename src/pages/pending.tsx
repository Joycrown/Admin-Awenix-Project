import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { months } from "../utils/data";
import { orderProduct, orderProps,orderCustomItem } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";
import LoadingScreen from "../components/loadingScreen";
import OrderPopup from "../components/orderPopup";
import ReceiptDownload from "../utils/receiptDownload";

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
  const [orderID, setOrderID] = useState("");
  const [actionLoader, setActionLoader] = useState(false);
  const [orderItems, setOrderItems] = useState<orderProduct[]>([]);
  const [customOrderItems, setCustomOrderItems] = useState<orderCustomItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10
  });
  const [paginatedOrders, setPaginatedOrders] = useState<PaginatedOrdersResponse>({
    items: [],
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
    has_next: false,
    has_previous: false
  });

  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${endpoint}/orders/pending?page=${pagination.page}&page_size=${pagination.pageSize}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        setPaginatedOrders(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err?.response?.data?.detail);
        }
      })
      .finally(() => setLoading(false));
  }, [user, endpoint, pagination.page, pagination.pageSize]);

  const handleConfirm = (reference: string, id: string) => {
    setActionLoader(true);

    axios
      .post(
        `${endpoint}/admin/confirm_order/${id}?payment_reference=${reference}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(() => {
        toast.success(`${id} has been confirmed`);
        // Refresh the current page after confirmation
        setPaginatedOrders(prev => ({
          ...prev,
          items: prev.items.filter(item => item.order_id !== id),
          total_items: prev.total_items - 1
        }));
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.detail || "Error while confirming order"
        );
      })
      .finally(() => setActionLoader(false));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
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
              <th className="text-start px-4">Bank Paid To</th>
              <th className="text-start px-4">Paid by</th>
              <th className="text-start px-4">Date</th>
              <th className="text-start px-4">Total Price</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="border bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center bg-default-700 bg-opacity-20">
                  Loading...
                </td>
              </tr>
            ) : paginatedOrders.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No pending orders found
                </td>
              </tr>
            ) : (
              paginatedOrders.items.map(({
                order_id,
                created_at,
                total_price,
                customer_details,
                order_items,
                user_payment_name,
                user_bank_verification,
                custom_order_items,
                user_receipt_url,
              }) => (
                <tr key={order_id} className="border-t">
                  <td className="td-class p-4 suspended-text">{order_id}</td>
                  <td className="td-class p-4 suspended-text">
                    {customer_details.name}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    {user_bank_verification}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    {user_payment_name}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    {new Date(created_at).getUTCDate()}{" "}
                    {months[new Date(created_at).getMonth()]}{" "}
                    {new Date(created_at).getFullYear()}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    ₦ {total_price.toLocaleString("en-gb")}
                  </td>
                  <td className="td-class p-4 flex">
                    <span 
                      onClick={() => {
                        setOrderItems(order_items);
                        setOrderID(order_id);
                        setCustomOrderItems(custom_order_items)
                      }}
                      className="rounded-md bg-default-500/50 px-4 py-3 text-xs font-semibold uppercase text-white antialiased block mx-auto w-fit cursor-pointer"
                    >
                      View
                    </span>
                    <ReceiptDownload
                      receivedFrom="pending"
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
              value={pagination.pageSize}
              onChange={(e) => setPagination(prev => ({
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

      <div>
        {orderItems.length >= 1 && (
          <OrderPopup
            items={orderItems}
            customOrderItems={customOrderItems}
            closeFn={() => {
              setOrderItems([]);
              setCustomOrderItems([]);
            }}
            handleConfirm={(bankRef) => handleConfirm(bankRef, orderID)}
          />
        )}
      </div>
    </section>
  );
}

export default Pending;