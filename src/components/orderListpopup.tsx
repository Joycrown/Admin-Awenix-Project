import { orderProps } from "../utils/interface";
import { months } from "../utils/data";
import ReceiptDownload from "../utils/receiptDownload";
// import { useAuthContext } from "../utils/authContext";

interface OrderListProps {
  orders: orderProps[];
  loading: boolean;
  setSelectedOrder: (order: orderProps) => void;
}

function OrderListPopup({ orders, loading, setSelectedOrder }: OrderListProps) {
  // const { user } = useAuthContext();

  return (
    <div className="h-full overflow-y-auto">
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
              orders.map((order) => {
                const {
                  order_id,
                  created_at,
                  total_price,
                  customer_details,
                  order_verified_by,
                  payment_reference,
                  status,
                  user_receipt_url,
                } = order;
                return (
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
                      <span
                        className={`rounded-md px-4 py-3 text-xs font-semibold uppercase antialiased block mx-auto w-fit ${
                          status.toLowerCase() === "confirmed"
                            ? "bg-green-600/50 text-green-100"
                            : status.toLowerCase() === "received"
                            ? "bg-blue-600/50 text-blue-100"
                            : "bg-orange-600/50 text-orange-100"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="m-4 flex flex-row gap-2">
                      <span
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-md bg-default-500/50 px-4 py-3 text-xs font-semibold uppercase text-white antialiased block mx-auto cursor-pointer"
                      >
                        View
                      </span>
                      <ReceiptDownload
                        receivedFrom="orders"
                        receiptUrl={user_receipt_url}
                        orderId={order_id}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default  OrderListPopup;
