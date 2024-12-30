import { MdClose } from "react-icons/md";
import { orderProduct } from "../utils/interface";
import { useState } from "react";
import { toast } from "react-toastify";

interface orderItemsProps {
  items: orderProduct[];
  closeFn: () => void;
  handleConfirm: (bank: string) => void;
}

function OrderPopup({ items, closeFn, handleConfirm }: orderItemsProps) {
  const [selectedBank, setSelectedBank] = useState("");
  const PAYMENT_REFERENCE = ["FCMB BANK", "FIRST BANK", "STANBIC BANK"];

  // Calculate total price of all items
  const totalOrderPrice = items.reduce((sum, item) => sum + item.total_price, 0);
  const totalMiscellaneousAmount = items.reduce((_sum, item) =>  item.miscellaneous, 0);
  // Calculate miscellaneous amount (10% of total)
  const miscellaneousPercentage = 10;
  const miscellaneousQuantity = totalMiscellaneousAmount/miscellaneousPercentage;

  return (
    <div className="fixed w-full h-screen left-0 top-0 flex items-center justify-center z-50">
      <div
        onClick={closeFn}
        className="absolute w-full h-full bg-black bg-opacity-70 cursor-pointer top-0"
      />
      <div className="relative space-y-4 rounded">
        <div className="absolute right-0 -top-8 bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
          <MdClose size="1.2rem" onClick={closeFn} />
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          <table className="border-separate border-spacing-y-0 text-sm w-full">
            <thead className="bg-default-500 text-white rounded">
              <tr>
                <th className="text-start p-4">Name</th>
                <th className="text-start px-4">Price/Unit</th>
                <th className="text-start px-4">Quantity</th>
                <th className="text-start px-4">Total Price</th>
              </tr>
            </thead>
            <tbody className="border bg-slate-100 [&>*:nth-child(even)]:bg-slate-300">
              {items.map(
                (
                  { product_id, quantity, total_price, product }: orderProduct,
                  key: number
                ) => (
                  <tr key={`${key} ${product_id * key}`}>
                    <td className="p-4 capitalize">{product.name}</td>
                    <td className="p-4 text-center">₦ {product.price}</td>
                    <td className="p-4 text-center">{quantity}</td>
                    <td className="p-4 text-center">
                      ₦ {total_price.toLocaleString("en-GB")}
                    </td>
                  </tr>
                )
              )}
              {/* Miscellaneous Row */}
              <tr className="font-medium">
                <td className="p-4 capitalize">Miscellaneous</td>
                <td className="p-4 text-center">₦ {miscellaneousPercentage}</td>
                <td className="p-4 text-center">{miscellaneousQuantity}</td>
                <td className="p-4 text-center">
                  ₦ {totalMiscellaneousAmount.toLocaleString("en-GB")}
                </td>
              </tr>
              {/* Grand Total Row */}
              <tr className="font-bold bg-default-500 text-white">
                <td className="p-4" colSpan={3}>Grand Total</td>
                <td className="p-4 text-center">
                  ₦ {(totalOrderPrice + totalMiscellaneousAmount).toLocaleString("en-GB")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 items-center">
          <div className="border pl-2 pr-4 cursor-pointer rounded text-xs w-1/2 bg-white">
            <select
              defaultValue=""
              onChange={(e) => setSelectedBank(e.target.value)}
              className="border-none outline-none w-full py-3 bg-transparent"
            >
              <option value="" hidden>
                Select Payment Reference
              </option>
              {PAYMENT_REFERENCE.map((bank) => (
                <option key={bank} className="capitalize" value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          <div
            onClick={() =>
              selectedBank === ""
                ? toast.error("Select a payment reference")
                : handleConfirm(selectedBank)
            }
            className="bg-default-500 text-white py-4 px-4 cursor-pointer rounded text-xs"
          >
            Confirm Order
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPopup;