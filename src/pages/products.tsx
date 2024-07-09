import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import { useAuthContext } from "../utils/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { productProps } from "../utils/interface";

function Product() {
  const { user } = useAuthContext();
  const [products, setProducts] = useState<productProps[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;
    const params = new URLSearchParams(location.search).get("q");

    if (params) {
      setQuery(params);
    }

    setLoading(true);

    axios
      .get(`${endpoint}/products?search=${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
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
    <section className="py-2 space-y-4" id="products">
      <h4 className="font-semibold text-xl">
        {query
          ? `Showing all results for ${query}`
          : "Explore all our products"}
      </h4>
      {loading ? (
        <p>Loading... </p>
      ) : products.length >= 1 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((product, id) => (
            <ProductCard key={id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </section>
  );
}

export default Product;
