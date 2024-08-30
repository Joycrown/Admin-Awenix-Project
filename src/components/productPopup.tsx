/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import { productPopProps, productProps } from "../utils/interface";
import { useRef, useState } from "react";

function ProductPopup({
  product,
  handleEdit,
  closeFn,
}: {
  product: productProps;
  handleEdit: (updatedProd: productPopProps) => void;
  closeFn: () => void;
}) {
  const { price, name, description, product_image, size } = product;
  const [edit, setEdit] = useState({
    price,
    name,
    description,
    image: product_image,
  });
  const [isImageInputed, setIsImageInputed] = useState(false);
  const [displayImage, setDisplayImage] = useState(product_image);

  const imageRef = useRef<HTMLInputElement>(null);

  const updateProduct = () => {
    handleEdit({
      ...edit,
      product_image: isImageInputed ? edit.image : "",
      size,
    });
  };

  const setImage = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = window.URL.createObjectURL(file);
      setDisplayImage(url);

      setIsImageInputed(true);
      setEdit((prev) => ({ ...prev, image: file }));
    } else {
      setIsImageInputed(false);
    }
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
