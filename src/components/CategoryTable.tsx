"use client";
import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import CategoryEditModal from "../components/CategoryEditModal";

interface Category {
  id: string;
  name: string;
  image_url: string;
  description: string;
  parent_category_name: string;
}

interface CategoryTableProps {
  category: Category[];
  currentPage: number;
  totalCategories: number;
  pagesize: number;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  category,
  totalCategories,
  currentPage,
  pagesize,
}) => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleOpenInventoryModal = () => setShowInventoryModal(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  if (!category) {
    return <div>Loading...</div>; // Change "wait" to a more descriptive message
  }
  const DeleteCategory = async () => {
    try {
      const response = await DeleteCategoryApi(selectedItems);
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

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const DeleteCategoryApi = async (selectedItems: any[]) => {
    handleOpenInventoryModal();

    console.log("Delete ids" + JSON.stringify(selectedItems));
    try {
      for (const deleteitem of selectedItems) {
        try {
          const responses = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/Delete/${deleteitem}`,
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
    if (selectedItems.length === category.length) {
      setSelectedItems([]); // Deselect all

      alert(selectedItems.length);
    } else {
      //setSelectedItems(products.map((product) => product.id)); // Select all
    }
  };
  //const handleCloseModal = () => setShowModal(false);
  //   const handleShowModal = (categoryData:any) => {
  //     setSelectedCategory(categoryData);
  //     setShowModal(true);
  //  };
  const handleShowModal = (categoryData: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedCategory(categoryData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedCategory(null); // Clear the selected category
  };

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
                  onClick={DeleteCategory}
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
                    checked={selectedItems.length === category.length}
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
              {category.map((categry, key) => (
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
                          expandedRows.includes(categry.id)
                            ? "fa-minus"
                            : "fa-plus"
                        } cursor-pointer`}
                        onClick={() => toggleRowExpand(categry.id)}
                      ></i>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(categry.id)}
                        onChange={() => toggleSelect(categry.id)}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {/* {(Number(currentPage)) * 25 + key + 1} */}
                      {Number(currentPage) * Number(pagesize) + key + 1}
                    </td>
                    <td className="px-4 py-2 text-sm text-meta-3">
                      <button className="text-blue-500 hover:underline">
                        <img
                          src={categry.image_url || "/default-image.jpg"}
                          alt={`Product ${categry.image_url}`}
                          style={{ width: "100px" }}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {categry.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {categry.description}
                    </td>
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      {categry.parent_category_name}
                    </td>
                  </tr>

                  {expandedRows.includes(categry.id) && (
                    <tr className="child">
                      <td className="child" colSpan={7}>
                        <ul data-dtr-index="0" className="dtr-details">
                          <li>
                            <span className="dtr-title">Actions</span>
                            <span className="dtr-data">
                              <a
                                key={categry.id}
                                data-toggle="modal"
                                data-id={categry.id}
                                onClick={(e) =>
                                  handleShowModal(
                                    {
                                      id: String(categry.id),
                                      name: categry.name,
                                      description: categry.description,
                                      image_url: categry.image_url,
                                      parent_category_name:
                                        categry.parent_category_name,
                                    },
                                    e,
                                  )
                                }
                                //  onClick={() =>
                                //  handleShowModal({
                                //  id: String(categry.id), // Convert id to string
                                //  name: categry.name,
                                //  description: categry.description,
                                //  image_url: categry.image_url,
                                //  parent_category_name: categry.parent_category_name,
                                //    })
                                //   }
                                data-target="#m_modal_7"
                                className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
                                title="Edit"
                              >
                                <i className="fa fa-edit"></i>
                              </a>
                              <a
                                onClick={() => DeleteCategoryApi([categry.id])}
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

          {showModal && selectedCategory && (
            <CategoryEditModal
              show={showModal}
              handleClose={handleCloseModal}
              categoryData={selectedCategory} // Pass the selected category data
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default CategoryTable;
