/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import { productPopProps, productProps } from "../utils/interface";
import { useRef, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../utils/authContext";
import { toast } from "react-toastify";
import LoadingScreen from "./loadingScreen";


function AddProduct({
  existingProduct,
  updateList,
  closeFn,
}: {
  existingProduct?: productProps | null;
  updateList: (product: productProps) => void;
  closeFn: () => void;
}) {
  const { user } = useAuthContext();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(existingProduct?.product_image || "");

  const [product, setProduct] = useState<productPopProps>({
    price: existingProduct?.price || 0,
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    product_image: "",
    size: existingProduct?.size || "kg",
    removed: existingProduct?.removed || false,
  });

  const imageRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const { name, price, description, size, product_image } = product;
    if (name === "") {
      toast.error("Name must be filled");
      return;
    } else if (description.length <= 5) {
      toast.error("Description must be more than 10 words");
      return;
    } else if (price < 1) {
      toast.error("Price must be more than 1");
      return;
    }

    setLoading(true);

    if (existingProduct) {
      // Handle edit
      const productData = {
        name,
        description,
        price,
        size
      };

      const requests = [
        axios.patch(
          `${endpoint}/products/${existingProduct.name}`,
          productData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )
      ];

      if (product_image) {
        const fileData = new FormData();
        fileData.append('file', product_image);
        requests.push(
          axios.patch(
            `${endpoint}/products/${existingProduct.name}/image`,
            fileData,
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          )
        );
      }

      Promise.all(requests)
        .then(([res]) => {
          setLoading(false);
          toast.success(`${name} successfully updated`);
          updateList(res.data);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.detail || "Cannot update product right now");
        });
    } else {
      // Handle create new product
      axios.post(
        `${endpoint}/create_product?product_name=${name}&product_desc=${description}&size=${size}&amount=${price}`,
        { file: product_image },
        {
          data: { file: product_image },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
        .then((res) => {
          setLoading(false);
          toast.success(`${name} successfully added`);
          updateList(res.data);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Cannot add product right now... Try again later");
          console.error(err);
        });
    }
  };

  const setImage = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = window.URL.createObjectURL(file);
      setDisplayImage(url);
      setProduct((prev) => ({ ...prev, product_image: file }));
    }
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
            <img src={displayImage} alt={product.name} />
            <div
              className="bg-black bg-opacity-80 absolute w-full h-full top-full group-hover/image:top-1/2 duration-300 flex justify-center text-white"
              onClick={() => imageRef.current && imageRef.current.click()}
            >
              <input
                type="file"
                ref={imageRef}
                accept="image/*"
                className="absolute -z-50 -left-96"
                onChange={(event) => setImage(event)}
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
              onClick={handleSubmit}
              className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded text-xs"
            >
              {existingProduct ? 'Update product' : 'Add product'}
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