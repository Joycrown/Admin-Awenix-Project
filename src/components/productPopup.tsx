import { MdClose } from "react-icons/md";
import { productProps } from "../utils/interface";

interface productPopProps extends Omit<productProps, "quantity" | "image"> {}

function ProductPopup(props: productPopProps) {
  const { price, name, description, size, closeFn } = props;

  const updateProduct = () => {};

  return (
    <div className="fixed w-full h-screen left-0 top-0 flex items-center justify-center z-50">
      <div
        onClick={closeFn}
        className="absolute w-full h-full bg-black bg-opacity-70 cursor-pointer"
      />
      <div className="relative py-8 px-6 bg-white rounded max-w-sm w-full">
        <MdClose
          size="1.2rem"
          onClick={closeFn}
          className="absolute right-3 top-3 cursor-pointer"
        />

        <form className="space-y-3 w-full">
          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={name}
              placeholder="Name"
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={description}
              placeholder="Description"
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="price">Price per unit</label>
            <input
              type="number"
              id="price"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={price}
              placeholder="Price per unit"
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="size">Size</label>
            <input
              id="size"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={size}
              placeholder="Size e.g kg, bag"
              required
            />
          </div>

          <div className="flex gap-3">
            <div
              onClick={updateProduct}
              className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded text-xs"
            >
              Complete Edit
            </div>
            <div
              onClick={closeFn}
              className="bg-default-400 text-white py-3 px-4 cursor-pointer rounded text-xs"
            >
              Cancel Edit
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductPopup;
