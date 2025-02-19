"use client";
import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import BrandEditModal from "../components/BrandEditModal";
interface Brand {
  id: string;
  name: string;
  image_url: string;
  description: string;
  parent_manufacturer_name: string;
}

interface BrandTableProps {
  brand: Brand[];
  currentPage: number;
  totalBrands: number;
  pagesize: number;
}

const BrandTable: React.FC<BrandTableProps> = ({
  brand,
  totalBrands,
  currentPage,
  pagesize,
}) => {
  const router = useRouter();

  const { token, logout } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleOpenInventoryModal = () => setShowInventoryModal(true);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const DeleteManufacturer = async () => {
    try {
      const response = await DeleteManufacturerApi(selectedItems);
    } catch (error) {
      console.error("Error updating product inventory:", error);
    }
  };

  const toggleSelect = (productId: any) => {
    setSelectedItems((prev: any) =>
      prev.includes(productId)
        ? prev.filter((id: any) => id !== productId)
        : [...prev, productId],
    );
  };

  const DeleteManufacturerApi = async (selectedItems: any[]) => {
    handleOpenInventoryModal();
    console.log("Delete ids" + JSON.stringify(selectedItems));
    try {
      for (const deleteitem of selectedItems) {
        try {
          const responses = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/manufacturer/Delete/${deleteitem}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            },
          );
          if (!responses.ok) {
            throw new Error(`Error: ${responses.statusText}`);
          }
          location.reload();
        } catch {}
      }
    } catch {}
  };

  const handleSelectAll = () => {
    if (selectedItems.length === brand.length) {
      setSelectedItems([]); // Deselect all

      alert(selectedItems.length);
    } else {
      //setSelectedItems(products.map((product) => product.id)); // Select all
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleShowModal = (BrandData: any) => {
    setSelectedBrand(BrandData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedBrand(null); // Clear the selected category
  };
  if (!brand) {
    return <div>Loading...</div>;
  }
  return (
    <div className="table-responsive">
      <div className="row">
        <div className="col-md-12">
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 bg-gray-100 p-4"
            >
              <div className="flex items-center justify-between">
                <p>{selectedItems.length} items selected</p>
                <button
                  onClick={DeleteManufacturer}
                  className="rounded bg-red-500 px-4 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}

          <table
            className="table-auto border-collapse"
            style={{ width: "40%" }}
          >
            <thead>
              <tr className="border-t border-stroke dark:border-strokedark">
                <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === brand.length}
                  />
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
                  Image
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
                  Code
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
                  Parent Category
                </th>
              </tr>
            </thead>
            <tbody>
              {brand.map((brands, key) => (
                <React.Fragment key={key}>
                  <tr
                    key={key}
                    className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                  >
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      <i
                        className={`fa-solid ${
                          expandedRows.includes(brands.id)
                            ? "fa-minus"
                            : "fa-plus"
                        } cursor-pointer`}
                        onClick={() => toggleRowExpand(brands.id)}
                      ></i>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(brands.id)}
                        onChange={() => toggleSelect(brands.id)}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {/* {(Number(currentPage)) * 25 + key + 1} */}
                      {Number(currentPage) * Number(pagesize) + key + 1}
                    </td>
                    <td className="px-4 py-2 text-sm text-meta-3">
                      <button className="text-blue-500 hover:underline">
                        <img
                          src={brands.image_url || "/default-image.jpg"}
                          alt={`Product ${brands.image_url}`}
                          style={{ width: "100px" }}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {brands.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {brands.description}
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {brands.parent_manufacturer_name}
                    </td>
                  </tr>
                  {expandedRows.includes(brands.id) && (
                    <tr className="child">
                      <td className="child" colSpan={7}>
                        <ul data-dtr-index="0" className="dtr-details">
                          <li>
                            <span className="dtr-title">Actions</span>
                            <span className="dtr-data">
                              <a
                                key={brands.id}
                                data-toggle="modal"
                                data-id={brands.id}
                                onClick={() =>
                                  handleShowModal({
                                    id: String(brands.id), // Convert id to string
                                    name: brands.name,
                                    description: brands.description,
                                    image_url: brands.image_url,
                                    parent_manufacturer_name:
                                      brands.parent_manufacturer_name,
                                  })
                                }
                                data-target="#m_modal_7"
                                className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
                                title="Edit"
                              >
                                <i className="fa fa-edit"></i>
                              </a>
                              <a
                                onClick={() =>
                                  DeleteManufacturerApi([brands.id])
                                }
                                className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
                                title="Delete"
                              >
                                <i className="fa fa-trash"></i>
                              </a>
                            </span>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {showModal && selectedBrand && (
            <BrandEditModal
              show={showModal}
              handleClose={handleCloseModal}
              manufacturerData={selectedBrand} // Pass the selected category data
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default BrandTable;
