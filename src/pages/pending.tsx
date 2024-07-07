import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { months } from "../utils/data";
import { orderProps } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";

function Pending() {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<orderProps[]>([]);

  useEffect(() => {
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

    axios
      .get(`${endpoint}/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        const responseData = res.data;
        const pendingRequest = responseData.filter(
          (order: orderProps) => order.status === "ordered"
        );
        setOrders(pendingRequest);
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response.status == 400) {
          toast.error(err?.response?.data?.detail);
        }
      });
  }, [user]);

  return (
    <section className="py-2 space-y-4">
      <div className="space-y-2">
        <h4 className="font-semibold text-xl">Pending</h4>
        <p>Items waiting to be confirmed.</p>
      </div>

      <div className="flex items-center lg:justify-center w-full max-lg:overflow-x-auto">
        <table className="text-sm w-full max-xs:min-w-[500px] max-lg:min-w-[700px]">
          <thead className="bg-default-700 bg-opacity-30 rounded">
            <tr>
              <th className="text-start p-4">ID</th>
              <th className="text-start px-4">Name</th>
              <th className="text-start px-4">Email</th>
              <th className="text-start px-4">Date</th>
              <th className="text-start px-4">Total Price</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="border bg-white">
            {orders.map(
              ({
                order_id,
                created_at,
                total_price,
                customer_details,
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
                  <td
                    // onClick={() => setOrderItems(order_items)}
                    className="td-class p-4"
                  >
                    <span className="rounded-md bg-default-500/50 px-4 py-3 text-xs font-semibold uppercase text-white antialiased block mx-auto w-fit cursor-pointer">
                      Confirm
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Pending;
