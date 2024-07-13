import { months } from "../utils/data";
import { orderProps } from "../utils/interface";

function OrderList({
  orders,
  loading,
}: {
  orders: orderProps[];
  loading: boolean;
}) {
  return (
    <div className="max-h-screen h-full overflow-y-auto">
      <div className="flex items-center lg:justify-center w-full max-lg:overflow-x-auto">
        <table className="text-sm w-full max-xs:min-w-[500px] max-lg:min-w-[700px]">
          <thead className="bg-default-700 bg-opacity-30 rounded">
            <tr>
              <th className="text-start p-4">ID</th>
              <th className="text-start px-4">Name</th>
              <th className="text-start px-4">Email</th>
              <th className="text-start px-4">Date</th>
              <th className="text-start px-4">Total Price</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody className="border bg-white">
            {loading && (
              <tr>
                <td className="p-4 bg-default-700 bg-opacity-20">Loading...</td>
              </tr>
            )}
            {orders.map(
              ({
                order_id,
                created_at,
                total_price,
                customer_details,
                status,
              }: orderProps) => (
                <tr key={order_id} className="border-t">
                  <td className="td-class p-4 suspended-text">{order_id}</td>
                  <td className="td-class p-4 suspended-text">
                    {customer_details.name}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    {customer_details.email}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    {new Date(created_at).getDay()}{" "}
                    {months[new Date(created_at).getMonth()]}{" "}
                    {new Date(created_at).getFullYear()}
                  </td>
                  <td className="td-class p-4 suspended-text">
                    ₦ {total_price.toLocaleString("en-gb")}
                  </td>
                  <td className="td-class p-4">
                    <span className="rounded-md bg-orange-600/50 px-4 py-3 text-xs font-semibold uppercase text-orange-100 antialiased block mx-auto w-fit">
                      {status}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;
