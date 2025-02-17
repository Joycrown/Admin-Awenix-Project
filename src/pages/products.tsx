/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../utils/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { productProps } from "../utils/interface";
import AddProduct from "../components/addProduct";
import { toast } from "react-toastify";
import { months } from "../utils/data";
import ConfirmationDialog from "../components/deleteProductConfirmatory";

interface DeleteConfirmation {
  isOpen: boolean;
  product: productProps | null;
}

function Product() {
  const { user } = useAuthContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [newlyAdded, setNewlyAdded] = useState(false);
  const [products, setProducts] = useState<productProps[]>([]);
  const [editingProduct, setEditingProduct] = useState<productProps | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    product: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search).get("q");
    if (params) {
      setQuery(params);
    } else {
      setQuery("");
    }

    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${endpoint}/products?search=${params ? params : ""}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        setProducts(res.data);
      } catch (err: any) {
        toast.error(err.message || "Error fetching products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [user, location, navigate, endpoint]);

  const handleDeleteClick = (product: productProps) => {
    setDeleteConfirmation({
      isOpen: true,
      product,
    });
  };

  const handleDeleteConfirm = async () => {
    const product = deleteConfirmation.product;
    if (!product) return;

    setIsDeleting(true);
    try {
      await axios.put(`${endpoint}/products/${product.name}/remove`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      toast.success(`${product.name} successfully deleted`);
      setProducts(prev => prev.filter(p => p.name !== product.name));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Cannot delete product right now");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({ isOpen: false, product: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, product: null });
  };

  return (
    <section className="py-2 space-y-4 relative">
      <h4 className="font-semibold text-xl">
        {query ? `Showing all results for ${query}` : "Explore all our products"}
      </h4>

      {!query && (
        <div
          onClick={() => setNewlyAdded(true)}
          className="cursor-pointer px-4 py-3 bg-default-600 bg-opacity-80 text-white w-fit rounded mb-4"
        >
          Add new product
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : products.length >= 1 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-default-700 text-white">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Price</th>
                {user.userType !== "staff" && (
                  <>
                    <th className="p-3 text-left">Last Edited By</th>
                    <th className="p-3 text-left">Last Updated</th>
                  </>
                )}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, id) => (
                <tr key={id} className="border-b border-default-200">
                  <td className="p-3">
                    <img
                      src={product.product_image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 capitalize">{product.name}</td>
                  <td className="p-3">
                    ₦ {product.price.toLocaleString("en-gb")}/{product.size}
                  </td>
                  {user.userType !== "staff" && (
                    <>
                      <td className="p-3 capitalize">{product.last_edited_by}</td>
                      <td className="p-3">
                        {new Date(product.updated_at).getUTCDate()}{" "}
                        {months[new Date(product.updated_at).getMonth()]}{" "}
                        {new Date(product.updated_at).getFullYear()}
                      </td>
                    </>
                  )}
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="px-3 py-2 bg-default-700 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        disabled={isDeleting}
                        className={`px-3 py-2 bg-red-400 text-white rounded hover:bg-red-600 text-sm ${
                          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No products available</p>
      )}

      {(newlyAdded || editingProduct) && (
        <AddProduct
          existingProduct={editingProduct}
          updateList={(updatedProd) => {
            if (editingProduct) {
              setProducts(prev => 
                prev.map(p => p.name === editingProduct.name ? updatedProd : p)
              );
              setEditingProduct(null);
            } else {
              setProducts(prev => [...prev, updatedProd]);
              setNewlyAdded(false);
            }
          }}
          closeFn={() => {
            setEditingProduct(null);
            setNewlyAdded(false);
          }}
        />
      )}

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete ${deleteConfirmation.product?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </section>
  );
}

export default Product;