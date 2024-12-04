"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "../components/table/table";
import SearchBar from "../components/ui/searchbar";
import Button from "../components/ui/button";
import Modal from "../components/ui/modal";

// Example data
const mockData = [
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
  { key: "health", header: "Health" },
];

export default function Dashboard() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const filteredData = mockData.filter((service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button
              label="New Service"
              onClick={() => console.log("Create new service")}
            />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Total Services",
              "Active Services",
            ].map((stat) => (
              <div key={stat} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">{stat}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">3</p>
              </div>
            ))}
          </div>

          {/* Modal for displaying selected service details */}
          {isModalOpen && (
            <Modal onClose={closeModal}>
              <h2 className="text-lg font-semibold">
                {selectedRow?.serviceName}
              </h2>
              <div className="flex flex-row gap-2">
                <span>URL: </span>
                <a href={selectedRow?.url} className="text-blue-500 underline">
                  {selectedRow?.url}
                </a>
              </div>
              <p>Description: {selectedRow?.description}</p>
              <p>Request Example: {selectedRow?.requestExample}</p>
              <p>Response Example: {selectedRow?.responseExample}</p>
              <Button label="Close" onClick={closeModal} />
            </Modal>
          )}

          {/* Services Table */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
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
