import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import { useAuthContext } from "../utils/authContext";
import { useLocation, useNavigate } from "react-router-dom";

function Product() {
  const { user } = useAuthContext();
  const [products, setProducts] = useState([
    {
      id: 4,
      name: "maize",
      description: "maize",
      price: 450,
      product_image:
        "https://awenixproject-ivqm5btk.b4a.run/staticfiles/productImages/4088880c9c4e4e806705.jpg",
      created_by: "joycrown",
      size: "kg",
      creator: {
        id: "joycrown",
        first_name: "Joycrown",
        last_name: "joycrown",
        email: "joycrowntech@gmail.com",
        phone_no: "string",
        user_type: "super admin",
        created_at: "2024-06-23T22:16:15.837277Z",
      },
      created_at: "2024-06-23T23:23:34.602571Z",
      last_edited_by: "joycrown",
      editor: {
        id: "joycrown",
        first_name: "Joycrown",
        last_name: "joycrown",
        email: "joycrowntech@gmail.com",
        phone_no: "string",
        user_type: "super admin",
        created_at: "2024-06-23T22:16:15.837277Z",
      },
      updated_at: "2024-06-24T00:09:53.708941Z",
    },
  ]);
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
