"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import "../css/custom.css";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

interface Product {
  id: string;
  name: string;
  sku: string;
  published: boolean;
  deleted: boolean;
  old_price: string;
  price: string;
  image_url: string;
  category_names: string;
  sub_category_names: string;
  manufacturer_names: string;
  totalProducts: number;
  order_minimum_quantity: number;
  stock_quantity: string;
}

interface ProductsTableProps {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  pagesize: number;
}

const StockTable: React.FC<ProductsTableProps> = ({
  products,
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

  useEffect(() => {}, [pagesize]);

  const closeModal = () => {
    setShowInventoryModal(false); // Close the modal
  };
  const handleSelectAll = () => {
    if (selectedItems.length === products.length) {
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

  if (!products) {
    return <div>Loading...</div>; // Change "wait" to a more descriptive message
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                  Sr.No.
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Item Code
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Product Name
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Department Name
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Category Name
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Sub Category Name
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Brand Name
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Sub Brand Name
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Avaliable Qty
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  MRP
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Stock Value
                </th>
                <th
                  className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                  style={{ width: "10%" }}
                >
                  Landing Stock Value
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, key) => (
                <tr
                  key={key}
                  className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                >
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {/* {key + 1} */}
                    {Number(currentPage) * Number(pagesize) + key + 1}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-meta-3"
                    style={{ width: "10%" }}
                  >
                    {/* <button 
                   onClick={() => router.push(`/products/${product.id}`)} 
                  className="text-blue-500 hover:underline"
                >
                  <img
                  src={product.image_url || '/default-image.jpg'}
                  alt={`Product ${product.name}`}
                  style={{ width: '100px' }}
                />
            </button>             */}
                    {product.sku}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    <button
                      onClick={() =>
                        router.push(`/products/ProductDetails/${product.id}`)
                      }
                      className="text-blue-500 hover:underline"
                    >
                      {product.name}
                    </button>
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  ></td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {product.category_names ? product.category_names : ""}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {product.sub_category_names
                      ? product.sub_category_names
                      : ""}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {product.manufacturer_names
                      ? product.manufacturer_names
                      : ""}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  ></td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {product.stock_quantity}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {Number(product.old_price).toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {(
                      Number(product.stock_quantity) * Number(product.price)
                    ).toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black dark:text-white"
                    style={{ width: "10%" }}
                  >
                    {Number(product.price).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="tabletotal-footer">
                <th></th>
                <th></th>
                <th>Total</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>
                  {products.reduce(
                    (total, product) => total + Number(product.stock_quantity),
                    0,
                  )}
                </th>
                <th>
                  {products.reduce(
                    (total, product) => total + Number(product.stock_quantity),
                    0,
                  )}
                </th>
                <th>
                  {" "}
                  {products
                    .reduce(
                      (total, product) =>
                        total +
                        Number(product.stock_quantity) * Number(product.price),
                      0,
                    )
                    .toFixed(2)}
                </th>
                <th>
                  {" "}
                  {products.reduce(
                    (total, product) => total + Number(product.price),
                    0,
                  )}
                </th>
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

export default StockTable;
