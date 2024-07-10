import { MdClose } from "react-icons/md";
import { productProps } from "../utils/interface";
import { useState } from "react";

function ProductPopup({
  product,
  handleEdit,
  closeFn,
}: {
  product: productProps;
  handleEdit: (updatedProd: productProps) => void;
  closeFn: () => void;
}) {
  const { price, name, description, image, size } = product;
  const [edit, setEdit] = useState({
    price,
    name,
    description,
    image,
  });

  const updateProduct = () => {
    handleEdit({ ...edit, size });
  };

  return (
    <div className="fixed w-full h-screen left-0 top-0 flex items-center justify-center z-50">
      <div
        onClick={closeFn}
        className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-70 cursor-pointer"
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
              value={edit.name ? edit.name : ""}
              placeholder="Name"
              onChange={(event) =>
                setEdit((e) => ({ ...e, name: event.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              className="border outline-none p-3 rounded font-normal focus:border-default-100"
              value={edit.description ? edit.description : ""}
              placeholder="Description"
              onChange={(event) =>
                setEdit((e) => ({ ...e, description: event.target.value }))
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
              value={edit.price ? edit.price : 0}
              placeholder="Price per unit"
              onChange={(event) =>
                setEdit((e) => ({ ...e, price: parseInt(event.target.value) }))
              }
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
