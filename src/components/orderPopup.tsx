import { MdClose } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";
import { orderProps } from "../utils/interface";

interface OrderPopupProps {
  order: orderProps;
  closeFn: () => void;
  handleConfirm: (
    paymentRef: string,
    orderId: string,
    forceConfirm?: boolean
  ) => void;
  // Optional flag. Defaults to false if not provided.
  forceConfirm?: boolean;
}

function OrderPopup({
  order,
  closeFn,
  handleConfirm,
  forceConfirm = false,
}: OrderPopupProps) {
  const [selectedPaymentRef, setSelectedPaymentRef] = useState("");
  // Predefined payment references
  const PAYMENT_REFERENCE = ["FCMB BANK", "FIRST BANK", "STANBIC BANK"];

  // Extract standard and custom order items from order
  const items = order.order_items;
  const customOrderItems = order.custom_order_items;

  // Calculate the total order price for standard items
  const totalOrderPrice = items.reduce((sum, item) => sum + item.total_price, 0);

  // Calculate miscellaneous fee (if any) from a sample item
  const miscItem = items.find((item) => item.miscellaneous != null);
  const miscellaneousValue = miscItem ? miscItem.miscellaneous : 0;
  const savedMillingPrice = localStorage.getItem("millingPrice");
  const miscellaneousPercentage = savedMillingPrice
    ? parseFloat(savedMillingPrice)
    : 10;
  const miscellaneousQuantity = miscellaneousValue / miscellaneousPercentage;

  // onConfirm validation depends on the context.
  const onConfirm = () => {
    const paymentOption = order.payment?.payment_option;
    if (forceConfirm) {
      // In Orders context, even if payment option is "delivery", require a bank selection.
      if (selectedPaymentRef === "") {
        toast.error("Select Payment Reference");
        return;
      }
    } else {
      // In Pending context: for full payment orders, require bank selection.
      // For delivery orders, no bank selection is needed.
      if (paymentOption !== "delivery" && selectedPaymentRef === "") {
        toast.error("Select a payment reference");
        return;
      }
    }
    // For Pending, if it's a delivery order, pass an empty string; otherwise, pass the selected reference.
    const ref =
      !forceConfirm && paymentOption === "delivery"
        ? ""
        : selectedPaymentRef;
    handleConfirm(ref, order.order_id, forceConfirm);
  };

  // Build the confirmation/rendering section based on the context and order status.
  let renderConfirmationSection = null;

  if (!forceConfirm) {
    // Pending context
    if (order.status !== "Confirmed") {
      if (order.payment?.payment_option === "delivery") {
        // Delivery payment in Pending: no bank selection.
        renderConfirmationSection = (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div
              onClick={onConfirm}
              className="w-full sm:w-auto bg-default-500 text-white py-4 px-4 cursor-pointer rounded text-xs text-center"
            >
              Confirm Order
            </div>
          </div>
        );
      } else {
        // Full payment in Pending: require bank selection.
        renderConfirmationSection = (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="border rounded text-xs w-full sm:w-1/2 bg-white">
              <select
                defaultValue=""
                onChange={(e) => setSelectedPaymentRef(e.target.value)}
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
              onClick={onConfirm}
              className="w-full sm:w-auto bg-default-500 text-white py-4 px-4 cursor-pointer rounded text-xs text-center"
            >
              Confirm Order
            </div>
          </div>
        );
      }
    }
  } else {
    // Orders context (forceConfirm true)
    if (order.status === "Confirmed") {
      renderConfirmationSection = null; // Already confirmed
    } else if (order.status === "ordered") {
      renderConfirmationSection = (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-yellow-700">
        <p className="font-medium">Order has not been initially responded to.</p>
      </div>
      );
    } else if (order.status === "Received") {
      // For Received orders (delivery payment), require bank selection even though the payment option is delivery.
      renderConfirmationSection = (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="border rounded text-xs w-full sm:w-1/2 bg-white">
            <select
              defaultValue=""
              onChange={(e) => setSelectedPaymentRef(e.target.value)}
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
            onClick={onConfirm}
            className="w-full sm:w-auto bg-default-500 text-white py-4 px-4 cursor-pointer rounded text-xs text-center"
          >
            Confirm Order
          </div>
        </div>
      );
    }
  }

  const getPaymentMethodLabel = (option: string): string => {
    switch (option) {
      case "full":
        return "Full Payment";
      case "installment":
        return "Installmental Payment";
      case "delivery":
        return "Cash on Delivery/Carriage";
      default:
        return option;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        onClick={closeFn}
        className="absolute inset-0 bg-black bg-opacity-70 cursor-pointer"
      />
      <div className="relative bg-white rounded p-6 w-[90%] sm:w-[80%] md:w-[60%] max-h-[80vh] overflow-y-auto">
        {/* Close Icon */}
        <div className="absolute right-4 top-4">
          <MdClose size="1.5rem" onClick={closeFn} className="cursor-pointer" />
        </div>
        <h3 className="text-xl font-bold mb-4">Order Details</h3>

        {/* Payment Details Section */}
        {order.payment && (
          <div className="border p-4 rounded mb-4">
            <h5 className="text-lg font-bold mb-2">Payment Details</h5>
            <p>
              <strong>Payment Method:</strong>{" "}
              {getPaymentMethodLabel(order.payment.payment_option)}
            </p>
            {(order.payment.payment_option === "full" ||
              order.payment.payment_option === "installment") && (
              <>
                <p>
                  <strong>Bank Paid To:</strong> {order.payment.bank}
                </p>
                <p>
                  <strong>Payee Name:</strong> {order.payment.payee_name}
                </p>
                <p>
                  <strong>Amount Paid:</strong>{" "}
                  {order.payment.amount_paid
                    ? `₦ ${order.payment.amount_paid.toLocaleString("en-GB")}`
                    : "N/A"}
                </p>
              </>
            )}
            {order.payment.payment_option === "delivery" && (
              <p>
                <strong>Delivery Person:</strong> {order.payment.delivery_person}
              </p>
            )}
          </div>
        )}

        <div className="space-y-6 pt-8">
          {/* Standard Order Items Section */}
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
                  {items.map((item, index) => (
                    <tr key={`${index}-${item.product_id}`}>
                      <td className="px-4 py-2 capitalize">{item.product.name}</td>
                      <td className="px-4 py-2 text-center">₦ {item.price_per_unit}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-center">
                        ₦ {item.total_price.toLocaleString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Order Items Section */}
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
                    {customOrderItems.map((item, index) => (
                      <tr key={index}>
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
                    <td className="px-4 py-2 text-center">
                      ₦ {miscellaneousValue.toLocaleString("en-GB")}
                    </td>
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

          {/* Confirmation / Payment Verification Section */}
          {renderConfirmationSection}
        </div>
      </div>
    </div>
  );
}

export default OrderPopup;
