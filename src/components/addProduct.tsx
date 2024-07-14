import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import { productProps } from "../utils/interface";
import { useRef, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../utils/authContext";
import { toast } from "react-toastify";
import LoadingScreen from "./loadingScreen";

function AddProduct({
  updateList,
  closeFn,
}: {
  updateList: (product: productProps) => void;
  closeFn: () => void;
}) {
  const { user } = useAuthContext();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState<productProps>({
    price: 0,
    name: "",
    description: "",
    image: "",
    size: "kg",
  });

  const imageRef = useRef<HTMLInputElement>(null);

  const addProduct = () => {
    const { name, price, description, size } = product;
    if (name === "") {
      toast.error("Name must be filled");
      return;
    } else if (description.length <= 20) {
      toast.error("Description must be more than 20 words");
      return;
    } else if (price < 200) {
      toast.error("Price must be more than 200");
      return;
    }

    axios
      .post(
        `${endpoint}/products/create_product?product_name=${name}&product_desc=${description}&size=${size}&amount=${price}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(() => {
        setLoading(false);
        toast.success(`${product.name} successfully added`);
        updateList(product);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Cannot add product right now... Try again later");
        console.error(err);
      });
  };

  return (
    <div className="fixed w-full h-screen left-0 top-0 flex items-center justify-center z-50 !mt-0">
      <div
        onClick={closeFn}
        className="absolute w-full h-full left-0 top-0 bg-black bg-opacity-70 cursor-pointer"
      />
      {loading && <LoadingScreen />}
      <div className="relative py-8 px-6 bg-white rounded max-w-sm w-full">
        <MdClose
          size="1.2rem"
          onClick={closeFn}
          className="absolute right-3 top-3 cursor-pointer"
        />

        <form className="space-y-3 w-full">
          <div className="group/image rounded-full overflow-hidden w-20 h-20 mx-auto relative flex items-center justify-center cursor-pointer bg-default-700">
            <img src={product.image} alt={product.name} />
            <div
              className="bg-black bg-opacity-80 absolute w-full h-full top-full group-hover/image:top-1/2 duration-300 flex justify-center text-white"
              onClick={() => imageRef.current && imageRef.current.click()}
            >
              <input
                className="absolute -z-50 -left-96"
                type="file"
                ref={imageRef}
              />
              <MdOutlineCloudUpload size="1.2rem" className="mt-2" />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={product.name}
              placeholder="Name"
              onChange={(event) =>
                setProduct((e) => ({ ...e, name: event.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={product.description}
              placeholder="Description"
              onChange={(event) =>
                setProduct((e) => ({ ...e, description: event.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="price">Price per unit</label>
            <input
              type="number"
              id="price"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={product.price}
              placeholder="Price per unit"
              onChange={(event) =>
                setProduct((e) => ({
                  ...e,
                  price: parseInt(event.target.value),
                }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="size">Size</label>
            <select
              id="size"
              onChange={(event) =>
                setProduct((e) => ({ ...e, size: event.target.value }))
              }
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={product.size}
            >
              <option value="kg">KG</option>
              <option value="bag">BAG</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div
              onClick={addProduct}
              className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded text-xs"
            >
              Add product
            </div>
            <div
              onClick={closeFn}
              className="bg-default-400 text-white py-3 px-4 cursor-pointer rounded text-xs"
            >
              Cancel
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
