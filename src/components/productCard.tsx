import { useState } from "react";
import { productProps } from "../utils/interface";
import ProductPopup from "./productPopup";

interface productExtendProps extends Omit<productProps, "quantity"> {}
interface productCardProps {
  product: productExtendProps;
}

function ProductCard({ product }: productCardProps) {
  const [hidden, setHidden] = useState(false);

  return (
    <>
      <div className="space-y-4 relative cursor-pointer">
        <div className="bg-default-700 bg-opacity-50 rounded overflow-hidden">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="space-y-1">
          <h4 className="capitalize">{product.name}</h4>
          <div className="flex flex-wrap gap-1 items-center text-sm">
            <span className="text-default-400">
              ₦ {product.price.toLocaleString("en-gb")}/{product.size}
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full text-xs">
          <div
            onClick={() => setHidden(true)}
            className="py-3 px-4 rounded bg-default-700 w-fit hover:bg-green-600 hover:text-white duration-300 cursor-pointer"
          >
            Edit
          </div>
          <div className="py-3 px-4 rounded bg-default-700 w-fit hover:bg-default-400 hover:text-white duration-300 cursor-pointer">
            Delete
          </div>
        </div>
      </div>

      {hidden && <ProductPopup {...product} closeFn={() => setHidden(false)} />}
    </>
  );
}

export default ProductCard;
