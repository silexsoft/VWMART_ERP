"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import "../css/custom.css";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { p } from "framer-motion/m";

interface PurchaseOrder {
  id: string;
  Status: string;
  PoNo: string;
  Supplier: string;
  PODate: string;
  SupplyDate: string;
  POAmount: string;
  POQty: string;
  ReceivedQty: string;
  CreatedBy: string;
  Location: string;
  Notes: string;
}

interface PurchaseOrderTableProps {
  PurchaseOrders: PurchaseOrder[];
  totalProducts: number;
  currentPage: number;
  pagesize: number;
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  PurchaseOrders,
  totalProducts,
  currentPage,
  pagesize,
}) => {
  const router = useRouter();

  const { token, logout } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const [visibleDropdownId, setVisibleDropdownId] = useState(null);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleOpenInventoryModal = () => setShowInventoryModal(true);

  const closeModal = () => {
    setShowInventoryModal(false); // Close the modal
  };
  const handleSelectAll = () => {
    if (selectedItems.length === PurchaseOrders.length) {
      setSelectedItems([]); // Deselect all
      //alert(selectedItems.length);
    } else {
      //setSelectedItems(products.map((product) => product.id)); // Select all
    }
  };

  const toggleDropdown = (id: any) => {
    setVisibleDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = (productId: any) => {};
  const toggleSelect = (productId: any) => {
    setSelectedItems((prev: any) =>
      prev.includes(productId)
        ? prev.filter((id: any) => id !== productId)
        : [...prev, productId],
    );
  };
  const handleStockAdjustment = (productId: any) => {
    console.log(`Adjust stock for product with ID: ${productId}`);
    // Add your stock adjustment logic here
  };

  const handleDeactivate = (productId: any) => {
    console.log(`Deactivate product with ID: ${productId}`);
    // Add your deactivate logic here
  };
  const DeleteProduct = async () => {
    try {
      const response = await DeleteProductApi(selectedItems);
    } catch (error) {
      console.error("Error updating product inventory:", error);
    }
  };
  const handleDeleteClick = (id: string) => {
    // Call the delete API for a single ID
    DeleteProductApi([id]);
  };
  const DeleteProductApi = async (selectedItems: any[]) => {
    handleOpenInventoryModal();
    console.log("Delete ids" + JSON.stringify(selectedItems));
    try {
      for (const deleteitem of selectedItems) {
        try {
          const responses = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/Delete/${deleteitem}`,
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

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* <div className="allproduct-heading">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Products
        </h4>
        <h4  className="text-xl font-semibold text-black" style={{ marginTop: "-21px",float: "right" }}>
            Total : {totalProducts}
        </h4>
      </div>      */}
      <div className="allproduct_table">
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
                onClick={DeleteProduct}
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
        <div className="products-tablepage">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-t border-stroke dark:border-strokedark">
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  {PurchaseOrders.length > 0 ? (
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedItems.length === PurchaseOrders.length}
                    />
                  ) : (
                    <input type="checkbox" onChange={handleSelectAll} />
                  )}
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  SR.No.
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  PO.No.
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Supplier
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  PO.Date
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Supply Date
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  PO.Amount
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  PO.Qty
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Received Qty
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
                  Location
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Notes
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
              {PurchaseOrders.length > 0 ? (
                PurchaseOrders.map((order, key) => (
                  <tr
                    key={key}
                    className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                  >
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {Number(currentPage) * Number(pagesize) + key + 1}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.PoNo}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.Supplier}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.PODate}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.SupplyDate}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.POAmount}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.POQty}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.ReceivedQty}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    ></td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.CreatedBy}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.Location}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {order.Notes}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      <span className="dtr-data">
                        <a
                          href={`/BillofMaterials/${order.id}`}
                          className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
                          title="Edit"
                        >
                          <i className="fa fa-edit"></i>
                        </a>
                      </span>
                      &nbsp;&nbsp;&nbsp;
                      <span className="dtr-data">
                        <a
                          onClick={() => handleDeleteClick(order.id)}
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
                <tr className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
                  <td
                    colSpan={14}
                    className="px-4 py-2 text-center text-sm text-black dark:text-white"
                  >
                    No data available in table
                  </td>
                </tr>
              )}
              <tr>
                <td className="checkbox border border-gray-300"></td>
                <td className="sr_no border border-gray-300 text-left"></td>
                <td className="status border border-gray-300 text-center"></td>
                <td className="po_no border border-gray-300 text-left"></td>
                <td className="vendor border border-gray-300 text-left">
                  Total
                </td>
                <td className="po_date border border-gray-300 text-left"></td>
                <td className="supply_date border border-gray-300 text-left"></td>
                <td className="po_amount border border-gray-300 text-right">
                  <span className="currency">
                    <i
                      className="fa fa-inr currency_style"
                      aria-hidden="true"
                    ></i>
                  </span>{" "}
                  0.00
                </td>
                <td className="po_qty border border-gray-300 text-right"></td>
                <td className="received_qty border border-gray-300 text-right"></td>
                <td className="created_by border border-gray-300 text-left"></td>
                <td className="created_by border border-gray-300 text-left"></td>
                <td className="created_by cut-text border border-gray-300 text-left"></td>
                <td className="actions border border-gray-300 text-right"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showInventoryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Modal Title</h2>
              <button onClick={closeModal} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>This is the content of the modal.</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderTable;
