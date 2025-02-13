import { MdClose } from "react-icons/md";
import { orderCustomItem, orderProduct } from "../utils/interface";
import { useState } from "react";
import { toast } from "react-toastify";

interface OrderPopupProps {
  items: orderProduct[];
  customOrderItems: orderCustomItem[];
  closeFn: () => void;
  handleConfirm: (bank: string) => void;
}

function OrderPopup({ items, customOrderItems, closeFn, handleConfirm }: OrderPopupProps) {
  const [selectedBank, setSelectedBank] = useState("");
  const PAYMENT_REFERENCE = ["FCMB BANK", "FIRST BANK", "STANBIC BANK"];
  console.log(items)
  // Calculate total price of all standard items
  const totalOrderPrice = items.reduce((sum, item) => sum + item.total_price, 0);
  // Calculate total miscellaneous amount from standard items
  const miscItem = items.find(item => item.miscellaneous != null);
  const miscellaneousValue = miscItem ? miscItem.miscellaneous : 0;

  // Assuming miscellaneous is a percentage-based fee (10%)
  const miscellaneousPercentage = 10;
  const miscellaneousQuantity = miscellaneousValue / miscellaneousPercentage;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div onClick={closeFn} className="absolute inset-0 bg-black bg-opacity-70 cursor-pointer" />
      
      <div className="relative bg-white rounded p-6 w-[90%] sm:w-[80%] md:w-[60%] max-h-[80vh] overflow-y-auto">
        {/* Close Icon */}
        <div className="absolute right-4 top-4">
          <MdClose size="1.5rem" onClick={closeFn} className="cursor-pointer" />
        </div>

        <div className="space-y-6 pt-8">
          {/* Standard Order Items */}
          <div>
            <h5 className="text-lg font-bold mb-2">Standard Order Items</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-default-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-center">Price/Unit</th>
                    <th className="px-4 py-2 text-center">Quantity</th>
                    <th className="px-4 py-2 text-center">Total Price</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-100">
                  {items.map(
                    ({ product_id, quantity, total_price, product }, key: number) => (
                      <tr key={`${key}-${product_id}`}>
                        <td className="px-4 py-2 capitalize">{product.name}</td>
                        <td className="px-4 py-2 text-center">₦ {product.price}</td>
                        <td className="px-4 py-2 text-center">{quantity}</td>
                        <td className="px-4 py-2 text-center">₦ {total_price.toLocaleString("en-GB")}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Order Items */}
          {customOrderItems.length > 0 && (
            <div>
              <h5 className="text-lg font-bold mb-2">Custom Order Items</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-default-500 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-100">
                    {customOrderItems.map((item, key: number) => (
                      <tr key={key}>
                        <td className="px-4 py-2 capitalize">{item.product_name}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Section */}
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <tbody>
                  <tr className="font-medium">
                    <td className="px-4 py-2">Miscellaneous</td>
                    <td className="px-4 py-2 text-center">₦ {miscellaneousPercentage}</td>
                    <td className="px-4 py-2 text-center">{miscellaneousQuantity}</td>
                    <td className="px-4 py-2 text-center">₦ {miscellaneousValue.toLocaleString("en-GB")}</td>
                  </tr>
                  <tr className="font-bold bg-default-500 text-white">
                    <td className="px-4 py-2" colSpan={3}>
                      Grand Total
                    </td>
                    <td className="px-4 py-2 text-center">
                      ₦ {(totalOrderPrice + miscellaneousValue).toLocaleString("en-GB")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment and Confirm Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="border rounded text-xs w-full sm:w-1/2 bg-white">
              <select
                defaultValue=""
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full py-3 bg-transparent border-none outline-none"
              >
                <option value="" hidden>
                  Select Payment Reference
                </option>
                {PAYMENT_REFERENCE.map((bank) => (
                  <option key={bank} value={bank} className="capitalize">
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
              className="w-full sm:w-auto bg-default-500 text-white py-4 px-4 cursor-pointer rounded text-xs text-center"
            >
              Confirm Order
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPopup;
