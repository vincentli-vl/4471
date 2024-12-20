"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "../components/table/table";
import SearchBar from "../components/ui/searchbar";
import Button from "../components/ui/button";
import Modal from "../components/ui/modal";

// Example data
const initialMockData = [
  {
    id: 1,
    serviceName: "Service A",
    version: "2.5.1",
    numInstances: "10",
    health: "Healthy",
    url: "https://www.google.com",
    description: "This is a test project",
    requestExample: "This is a test request",
    responseExample: "This is a test response",
  },
  {
    id: 2,
    serviceName: "Service B",
    version: "1.3.6",
    numInstances: "15",
    health: "Healthy",
    url: "https://www.google.com",
    description: "This is a test project",
    requestExample: "This is a test request",
    responseExample: "This is a test response",
  },
  {
    id: 3,
    serviceName: "Service C",
    version: "5.4.2",
    numInstances: "5",
    health: "Unhealthy",
    url: "https://www.google.com",
    description: "This is a test project",
    requestExample: "This is a test request",
    responseExample: "This is a test response",
  },
];

const columns = [
  { key: "id", header: "ID" },
  { key: "serviceName", header: "Service Name" },
  { key: "version", header: "Version" },
  { key: "numInstances", header: "Number of Instances" },
  { key: "health", header: "Health" },];

interface Service {
  id: number;
  serviceName: string;
  version: string;
  numInstances: string;
  health: string;
  url: string;
  description: string;
  requestExample: string;
  responseExample: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mockData, setMockData] = useState(initialMockData); // State for services
  const [newService, setNewService] = useState({
    serviceName: "",
    version: "",
    numInstances: "",
    health: "Healthy",
    url: "",
    description: "",
    requestExample: "",
    responseExample: "",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchServices(); // Fetch services when the component mounts
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchServices(); // Call your fetch function
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Function to fetch services from the API
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error("No token found. Please log in.");
        return; // Exit if no token is found
      }

      const response = await fetch('http://localhost:4471/services', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log(data);
      // Count instances per service
      const instancesCount = data.reduce((acc: Record<string, number>, service: { serviceName: string }) => {
        acc[service.serviceName] = (acc[service.serviceName] || 0) + 1; // Increment count for each service
        return acc;
      }, {} as Record<string, number>);
      // Filter out duplicate services by serviceName and ensure they are of type Service
      const uniqueServices: Service[] = Array.from(new Map(data.map((service: Service) => [service.serviceName, { ...service, numInstances: instancesCount[service.serviceName] }])).values()) as Service[];

      setMockData(uniqueServices); // Update state with unique services
      // Update mockData to include health status
      const updatedData = uniqueServices.map((service: Service) => ({
        ...service,
        health: "Healthy",
      }));
  
      setMockData(updatedData); // Update state with modified data
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewService({
      serviceName: "",
      version: "",
      numInstances: "",
      health: "Healthy",
      url: "",
      description: "",
      requestExample: "",
      responseExample: "",
    }); // Reset new service form
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRow(null);
  };

  const filteredData = mockData.filter((service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateService = () => {
    const newId = mockData.length + 1; // Increment ID based on current length
    const newInstanceCount =
      mockData.reduce(
        (max, service) => Math.max(max, parseInt(service.numInstances)),
        0
      ) + 1; // Increment instance count

    const createdService = {
      id: newId,
      ...newService,
      numInstances: newInstanceCount.toString(), // Set the incremented instance count
    };

    setMockData([...mockData, createdService]); // Add new service to the list
    closeCreateModal(); // Close the modal
  };

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    setIsDetailModalOpen(true); // Open detail modal
  };

  // const handleDeleteService = () => {
  //   setMockData(mockData.filter((service) => service.id !== selectedRow.id)); // Remove the selected service
  //   closeDetailModal(); // Close the modal
  // };

  // const handleUpdateService = () => {
  //   const updatedServices = mockData.map((service) =>
  //     service.id === selectedRow.id
  //       ? { ...selectedRow, ...newService }
  //       : service
  //   );
  //   setMockData(updatedServices); // Update the service in the list
  //   closeDetailModal(); // Close the modal
  // };

  // Calculate the number of active services
  const totalServices = mockData.length;
  const activeServices = mockData.filter(
    (service) => service.health === "Healthy"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <SearchBar
              placeholder="Search services..."
              onSearch={(term) => setSearchTerm(term)}
            />
            {/* <Button
              label="New Service"
              onClick={() => setIsCreateModalOpen(true)} // Open modal for creating new service
            /> */}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Total Services", "Active Services"].map((stat, index) => (
              <div key={stat} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">{stat}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {index === 0 ? totalServices : activeServices}{" "}
                  {/* Display total or active services */}
                </p>
              </div>
            ))}
          </div>

          {/* Modal for creating a new service */}
          {/* {isCreateModalOpen && (
            <Modal onClose={closeCreateModal}>
              <h2 className="text-lg font-semibold">Create New Service</h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newService.serviceName}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      serviceName: e.target.value,
                    })
                  }
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Version"
                  value={newService.version}
                  onChange={(e) =>
                    setNewService({ ...newService, version: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={newService.url}
                  onChange={(e) =>
                    setNewService({ ...newService, url: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <textarea
                  placeholder="Description"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  className="border rounded p-2"
                />
                <Button label="Create Service" onClick={handleCreateService} />
              </div>
            </Modal>
          )} */}

          {/* Modal for displaying selected service details */}
          {isDetailModalOpen && selectedRow && (
            <Modal onClose={closeDetailModal}>
              <h2 className="text-lg font-semibold">
                {selectedRow && 'serviceName' in selectedRow ? selectedRow.serviceName : ''}
              </h2>
              <p>
                <strong>URL:</strong>{" "}
                <a href={selectedRow?.url} className="text-blue-500 underline">
                  {selectedRow?.url}
                </a>
              </p>
              <p>
                <strong>Description:</strong> {selectedRow?.description}
              </p>
              <p>
                <strong>Request Example:</strong> {selectedRow?.requestExample}
              </p>
              <p>
                <strong>Response Example:</strong> {selectedRow?.responseExample}
              </p>
              <Button label="Close" onClick={closeDetailModal} />
            </Modal>
          )}

          {/* Services Table */}
          <div className="rounded-lg bg-white p-6 shadow-sm text-black">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Services Overview
            </h2>
            <Table
              columns={columns}
              data={filteredData}
              onRowClick={handleRowClick}
              emptyMessage="No services found"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
