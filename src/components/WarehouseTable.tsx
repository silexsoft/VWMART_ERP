"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import "../css/custom.css";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

interface Warehouse {
  id: string;
  admin_comment: string;
  Name: string;
  address_id: string;
}
interface Address {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  country_id: string | number;
  state_province_id: string | number;
  county: string;
  city: string;
  address1: string;
  address2: string;
  zip_postal_code: string;
  phone_number: string;
  fax_number: string;
  custom_attributes: any;
  created_on_utc: string;
  id: string | number;
}

interface WarehouseProps {
  warehouses: Warehouse[];
  address: Address[];
  totalWarehouse: number;
  currentPage: number;
  pagesize: number;
}

const WarehouseTable: React.FC<WarehouseProps> = ({
  warehouses,
  address,
  totalWarehouse,
  currentPage,
  pagesize,
}) => {
  const router = useRouter();

  const { token, logout } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const [visibleDropdownId, setVisibleDropdownId] = useState(null);

  const handleSelectAll = () => {
    if (selectedItems.length === warehouses.length) {
      setSelectedItems([]); // Deselect all
    } else {
    }
  };

  const DeleteWarehouseApi = async (selectedItems: any[]) => {
    try {
      try {
        // Map delete requests into an array of promises
        const deleteRequests = selectedItems.map((deleteItem) => {
          console.log(`Deleting item: ${deleteItem}`); // Debugging log
          return fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/Delete/${deleteItem}`,
            {
              method: "DELETE",
              headers: {
                //  'Content-Type': 'application/json',
                accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            },
          );
        });

        // Execute all requests in parallel
        const responses = await Promise.all(deleteRequests);

        // Check for any failed responses
        const failedResponses = responses.filter((response) => !response.ok);

        if (failedResponses.length > 0) {
          console.error("Some items could not be deleted:", failedResponses);
          // alert(`Failed to delete ${failedResponses.length} items. Check the console for details.`);
        } else {
          // alert('All items deleted successfully.');
        }

        // Refresh data or update state instead of reloading the page
        // Example: refreshData();
        location.reload(); // Use this only if necessary
      } catch (error) {
        console.error("An error occurred:", error);
        //  alert('An error occurred while deleting items. Check the console for details.');
      }
    } catch {}
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
                #
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                OutletType
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Name
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Contact Name
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Contact No
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Year Interval
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white"
                style={{ width: "10%" }}
              >
                Month Interval
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
            {warehouses.length > 0 ? (
              warehouses.map((warehouse, key) => {
                const associatedAddress = Array.isArray(address)
                  ? address.find((addr) => addr.id === warehouse.address_id)
                  : undefined;

                return (
                  <tr
                    key={key}
                    className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                  >
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {Number(currentPage) * Number(pagesize) + key + 1}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-meta-3"
                      style={{ width: "10%" }}
                    >
                      <button
                        onClick={() => router.push(`/Outlet/${warehouse.id}`)}
                        className="text-blue-500 hover:underline"
                      >
                        Branch
                      </button>
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {warehouse.Name}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {associatedAddress?.email || "N/A"}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      {associatedAddress?.phone_number || "N/A"}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    ></td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    ></td>
                    <td
                      className="px-4 py-2 text-sm text-black dark:text-white"
                      style={{ width: "10%" }}
                    >
                      <span className="dtr-data">
                        <a
                          href={`/Outlet/${warehouse.id}`}
                          data-toggle="modal"
                          data-id="104"
                          data-target="#m_modal_7"
                          className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
                          title="Edit"
                        >
                          <i className="fa fa-edit"></i>
                        </a>
                      </span>
                      &nbsp;&nbsp;&nbsp;
                      <span className="dtr-data">
                        <a
                          onClick={() => DeleteWarehouseApi([warehouse.id])}
                          className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </a>
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-2 text-center text-sm text-gray-500"
                  style={{ textAlignLast: "center" }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseTable;
