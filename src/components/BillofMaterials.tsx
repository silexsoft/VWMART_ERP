"use client";
//

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

interface BillofMaterial {
  Id: string;
  Sku: string;
  ProductName: string;
  BatchNo: string;
  MaterialCreationNo: string;
  Description: string;
  QtyTaken: number;
  MrpTaken: number;
  UnitCostTaken: number;
  LandingPriceTaken: number;
  SalesRateTaken: number;
  TaxRateTaken: number;
  TotalTaken: number;
  QtyReceived: number;
  MrpReceived: number;
  UnitCostReceived: number;
  LandingPriceReceived: number;
  SalesRateReceived: number;
  TaxRateReceived: number;
  TotalReceived: number;
  Created_at: Date;
  Updated_at: Date;
}

interface BillofMaterialProps {
  BillofMaterial: BillofMaterial[];
  totalMaterials: number;
  currentPage: number;
}

const BillofMaterialTable: React.FC<BillofMaterialProps> = ({
  BillofMaterial,
  totalMaterials,
  currentPage,
}) => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [visibleDropdownId, setVisibleDropdownId] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  const handleOpenInventoryModal = () => setShowInventoryModal(true);
  const closeModal = () => setShowInventoryModal(false);

  const handleSelectAll = () => {
    if (selectedItems.length === BillofMaterial.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(BillofMaterial.map((item) => item.Id)); // Select all
    }
  };

  const toggleDropdown = (id: any) => {
    setVisibleDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleDeleteClick = (id: string) => {
    DeleteMaterialApi(id);
  };

  const DeleteMaterialApi = async (deleteItem: string) => {
    handleOpenInventoryModal();

    try {
      console.log(`Deleting item: ${deleteItem}`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/DeleteMaterialCreationDetailsById?Id=${deleteItem}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to delete the item:", response);
        alert("Failed to delete the item. Check the console for details.");
      } else {
        console.log("Item deleted successfully.");
        alert("Item deleted successfully.");
        location.reload(); // Use this only if necessary
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert(
        "An error occurred while deleting the item. Check the console for details.",
      );
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-4.5 md:px-6 2xl:px-7.5">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-t border-stroke dark:border-strokedark">
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Sr.No.
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Bill OF Materials No.
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Bill OF Materials Date
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Location
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Created By
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {BillofMaterial.length > 0 ? (
              BillofMaterial.map((item, key) => (
                <tr
                  key={key}
                  className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                >
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {Number(currentPage) * 25 + key + 1}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-meta-3"
                    style={{ width: "10%" }}
                  >
                    <button
                      onClick={() =>
                        router.push(`/MaterialCreation/${item.Id}`)
                      }
                      className="text-blue-500 hover:underline"
                    >
                      {item.MaterialCreationNo}
                    </button>
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {"VWMart"}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {item.Created_at instanceof Date
                      ? item.Created_at.toLocaleDateString()
                      : "Invalid Date"}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {"VWMart"}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    <span className="dtr-data">
                      <a
                        href={`/BillofMaterials/${item.Id}`}
                        className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
                        title="Edit"
                      >
                        <i className="fa fa-edit"></i>
                      </a>
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="dtr-data">
                      <a
                        onClick={() => handleDeleteClick(item.Id)}
                        className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
                        title="Delete"
                      >
                        <i className="fa fa-trash"></i>
                      </a>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6} // Adjust the colspan to match the number of columns in your table
                  className="px-4 py-2 text-center text-sm text-black dark:text-white"
                >
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillofMaterialTable;
