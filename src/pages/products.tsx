import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import { useAuthContext } from "../utils/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { productProps } from "../utils/interface";
import AddProduct from "../components/addProduct";

function Product() {
  const { user } = useAuthContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [newlyAdded, setNewlyAdded] = useState(false);
  const [products, setProducts] = useState<productProps[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
    const params = new URLSearchParams(location.search).get("q");

    if (params) {
      setQuery(params);
    } else {
      setQuery("");
    }

    setLoading(true);

    axios
      .get(`${endpoint}/products?search=${params ? params : ""}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [user, location, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 400, behavior: "smooth" });
  }, [query]);

  return (
    <section className="py-2 space-y-4 relative" id="products">
      <h4 className="font-semibold text-xl">
        {query
          ? `Showing all results for ${query}`
          : "Explore all our products"}
      </h4>

      {!query && (
        <>
          <div
            onClick={() => setNewlyAdded(true)}
            className="cursor-pointer px-4 py-3 bg-default-600 bg-opacity-80 text-white w-fit rounded"
          >
            Add new product
          </div>
          {newlyAdded && (
            <AddProduct
              updateList={(newProd) => {
                setNewlyAdded(false);
                setProducts((prods) => ({ ...prods, newProd }));
              }}
              closeFn={() => setNewlyAdded(false)}
            />
          )}
        </>
      )}

      {loading ? (
        <p>Loading... </p>
      ) : products.length >= 1 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
          {products.map((product, id) => (
            <ProductCard
              key={id}
              product={product}
              updateList={(updatedProd) =>
                setProducts((prev) =>
                  prev.map((prod, _id) =>
                    _id === id ? { ...prod, ...updatedProd } : prod
                  )
                )
              }
              deleteProduct={() =>
                setProducts((prods) =>
                  prods.filter((prod) => prod.name !== product.name)
                )
              }
            />
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </section>
  );
}

export default Product;
