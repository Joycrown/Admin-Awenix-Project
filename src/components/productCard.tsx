import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import ProductPopup from "./productPopup";
import LoadingScreen from "./loadingScreen";
import { productProps } from "../utils/interface";
import { useAuthContext } from "../utils/authContext";

interface productCardProps {
  product: productProps;
  updateList: (product: productProps) => void;
  deleteProduct: () => void;
}

function ProductCard({ product, updateList, deleteProduct }: productCardProps) {
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  const editProduct = (updatedProd: productProps) => {
    setLoading(true);

    axios
      .patch(
        `${endpoint}/products/${product.name}?name=${updatedProd.name}&description=${updatedProd.description}&price=${updatedProd.price}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(() => {
        setLoading(false);
        toast.success(`${product.name} successfully updated`);
        updateList(updatedProd);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Cannot edit product right now... Try again later");
        console.error(err);
      });
  };

  const handleDelete = () => {
    setLoading(true);

    axios
      .put(`${endpoint}/products/${product.name}/remove`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(() => {
        setLoading(false);
        toast.success(`${product.name} successfully deleted`);
        deleteProduct();
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Cannot delete product right now... Try again later");
        console.error(err);
      });
  };

  return (
    <>
      {loading && <LoadingScreen />}
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
          <div
            onClick={handleDelete}
            className="py-3 px-4 rounded bg-default-700 w-fit hover:bg-default-400 hover:text-white duration-300 cursor-pointer"
          >
            Delete
          </div>
        </div>
      </div>

      {hidden && (
        <ProductPopup
          handleEdit={editProduct}
          product={product}
          closeFn={() => setHidden(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
