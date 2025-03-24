/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../utils/authContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { months } from "../utils/data";
import { FaUserCircle, FaAward, FaCrown } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// Customer interface
interface CustomerProps {
  id: string;
  name: string;
  email: string;
  phone_no?: string;
  user_type: string;
  created_at: string;
  profile_image?: string;
  order_count?: number;
  total_spent?: number;
  last_order_date?: string;
}

// Pagination interface
interface PaginationProps {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

function Customers() {
  const { user } = useAuthContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<CustomerProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    total_items: 0,
    total_pages: 1,
    current_page: 1,
    page_size: 10,
    has_next: false,
    has_previous: false
  });
  const location = useLocation();
  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search).get("q");
    if (params) {
      setQuery(params);
    } else {
      setQuery("");
    }

    // Fetch all customers
    const getAllCustomers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${endpoint}/users/all?page=${pagination.current_page}&page_size=${pagination.page_size}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        
        // Update pagination state
        setPagination({
          total_items: res.data.total_items,
          total_pages: res.data.total_pages,
          current_page: res.data.current_page,
          page_size: res.data.page_size,
          has_next: res.data.has_next,
          has_previous: res.data.has_previous
        });
        
        // Map the response items to match our interface
        const customersData = res.data.items.map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone_no: customer.phone_no,
          user_type: customer.user_type,
          created_at: customer.created_at,
          profile_image: customer.profile_image
        }));
        
        setCustomers(customersData);
      } catch (err: any) {
        toast.error(err.response?.data?.detail || "Error fetching customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch most active customers
    const getMostActiveCustomers = async () => {
      setActiveLoading(true);
      try {
        const res = await axios.get(
          `${endpoint}/most-active-users?limit=5`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        
        // Map the response to match our interface
        const activeCustomersData = res.data.map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          order_count: customer.order_count || 0,
          total_spent: customer.total_spent || 0,
          last_order_date: customer.last_order_date || new Date().toISOString(),
          profile_image: customer.profile_image
        }));
        
        setActiveCustomers(activeCustomersData);
      } catch (err: any) {
        toast.error(err.response?.data?.detail || "Error fetching active customers");
        console.error(err);
      } finally {
        setActiveLoading(false);
      }
    };
    
    getAllCustomers();
    getMostActiveCustomers();
  }, [user, location, endpoint, pagination.current_page, pagination.page_size]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, current_page: newPage }));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getUTCDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <section className="py-2 space-y-4 relative">
      <h4 className="font-semibold text-xl">
        {query ? `Showing customer results for ${query}` : "Customer Management"}
      </h4>

      {/* Most Active Customers Section */}
      <div className="mb-8">
        <h5 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <FaCrown className="text-yellow-500" /> 
          Most Active Customers
        </h5>
        
        {activeLoading ? (
          <p>Loading...</p>
        ) : activeCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCustomers.map((customer, index) => (
              <div key={customer.id} className="bg-white p-4 rounded-lg shadow-md border border-default-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {customer.profile_image ? (
                      <img 
                        src={customer.profile_image} 
                        alt={customer.name} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-16 h-16 text-gray-400" />
                    )}
                    {index < 3 && (
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                      }`}>
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h6 className="font-semibold text-default-700">{customer.name}</h6>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaAward className="text-default-600" />
                      <span className="text-sm font-medium">{customer.order_count} Orders</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-medium">₦ {(customer.total_spent ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Last Order:</span>
                    <span>{formatDate(customer.last_order_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No active customers found</p>
        )}
      </div>

      {/* All Customers Section */}
      <h5 className="font-semibold text-lg">All Customers</h5>
      
      {loading ? (
        <p>Loading...</p>
      ) : customers.length >= 1 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-default-700 text-white">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Customer Since</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {customer.profile_image ? (
                          <img 
                            src={customer.profile_image} 
                            alt={customer.name} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="w-8 h-8 text-gray-400" />
                        )}
                        <span>{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{formatDate(customer.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {customers.length} of {pagination.total_items} customers
            </div>
            <div className="flex gap-2">
              <button 
                className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={!pagination.has_previous}
              >
                <MdChevronLeft />
              </button>
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                // Show pages around current page
                let pageToShow = i + 1;
                if (pagination.total_pages > 5) {
                  if (pagination.current_page > 3 && pagination.current_page < pagination.total_pages - 1) {
                    pageToShow = pagination.current_page + i - 2;
                  } else if (pagination.current_page >= pagination.total_pages - 1) {
                    pageToShow = pagination.total_pages - 4 + i;
                  }
                }
                return (
                  <button 
                    key={pageToShow}
                    className={`w-8 h-8 rounded ${
                      pageToShow === pagination.current_page ? 'bg-default-700 text-white' : 'border'
                    }`}
                    onClick={() => handlePageChange(pageToShow)}
                  >
                    {pageToShow}
                  </button>
                );
              })}
              <button 
                className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={!pagination.has_next}
              >
                <MdChevronRight />
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>No customers found</p>
      )}
    </section>
  );
}

export default Customers;
