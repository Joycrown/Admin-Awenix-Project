/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Services.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../utils/authContext";
import { toast } from "react-toastify";
import { ServiceFormData, ServiceProps } from "../utils/interface";
import { ServiceTable } from "../components/serviceTable";
import { ServiceForm } from "../components/serviceForms";
import { Modal } from "../components/serviceModal";
import { DeleteConfirmation } from "../components/deleteConfirmatory";


const Services = () => {
  const { user } = useAuthContext();
  const [services, setServices] = useState<ServiceProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProps | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: 0,
  });

  const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${endpoint}/services/`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error fetching services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      fetchServices();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${endpoint}/services/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      toast.success("Service created successfully");
      setIsAddModalOpen(false);
      setFormData({ name: "", description: "", price: 0 });
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error creating service");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      await axios.put(
        `${endpoint}/services/${selectedService.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      toast.success("Service updated successfully");
      setIsEditModalOpen(false);
      setSelectedService(null);
      setFormData({ name: "", description: "", price: 0 });
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error updating service");
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    
    try {
      await axios.delete(`${endpoint}/services/${selectedService.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      toast.success("Service removed successfully");
      setIsDeleteModalOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error removing service");
    }
  };

  const handleEdit = (service: ServiceProps) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-white bg-default-500 hover:bg-blue-400"
        >
          Add New Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : services.length > 0 ? (
        <ServiceTable
          services={services}
          onEdit={handleEdit}
          onDelete={(service) => {
            setSelectedService(service);
            setIsDeleteModalOpen(true);
          }}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">No services available</div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Service</h2>
        <ServiceForm
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Service</h2>
        <ServiceForm
          onSubmit={handleUpdate}
          formData={formData}
          setFormData={setFormData}
          isEdit
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Services;