"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ProductsTable from "@/components/ProductsTable";
import TableGeneric from "@/components/Tables/TableGeneric";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Modal, Button, Alert, Container, Collapse } from "react-bootstrap";
import { Form } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
export default function Page() {
  const [products, setproducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProduct, settotalProduct] = useState(0);
  const [productSeries, setproductSeries] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const { token, logout, warehouseId } = useAuth();

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(Number(event.target.value)); // Update page size
    setCurrentPage(0); // Reset page index to 0 when page size changes
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
  }, [token]);

  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const fetchProducts = async (pageIndex: number) => {
    // try {
    //   setproductSeries(pageIndex);
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=${pageIndex}&pageSize=${pageSize}&storeId=0&vendorId=0&
    //       warehouseId=${warehouseId}&visibleIndividuallyOnly=false&excludeFeaturedProducts=false&productTagId=0&keywords=${searchQuery}&
    //       searchDescriptions=false&searchManufacturerPartNumber=true&searchSku=true&searchProductTags=false&
    //       languageId=0&showHidden=false`,
    //     {
    //       method: "GET",
    //       headers: {
    //         accept: "application/json",
    //         Authorization: token ? `Bearer ${token}` : "",
    //       },
    //     },
    //   );
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   console.log("api product" + JSON.stringify(data));
    //   setTotalPages(data.total_pages);
    //   settotalProduct(data.total_count);
    //   // Ensure data.items is defined and is an array
    //   setproducts(
    //     Array.isArray(data.items)
    //       ? data.items.map((product: any) => ({
    //           id: product.id,
    //           name: product.name,
    //           sku: product.sku,
    //           published: product.published,
    //           //deleted: product.deleted,
    //           old_price: product.old_price,
    //           price: product.price,
    //           image_url: product.image_url,
    //           category_names: product.category_names,
    //           manufacturer_names: product.manufacturer_names,
    //           order_minimum_quantity: product.order_minimum_quantity,
    //         }))
    //       : [],
    //   );
    // } catch (error) {
    //   console.error("Failed to fetch products:", error);
    // }
  };

  useEffect(() => {
    fetchProducts(currentPage); // Fetch orders when the page index changes
  }, [currentPage, pageSize, searchQuery]);

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handles the page change event of the pagination component.
   * @param {number} newPage The new page index.
   */
  /******  2e9a86a0-cdcb-4756-8c8b-726b246f2f4b  *******/
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const ActionsCell = ({ row }: any) => {
    const [action, setAction] = useState(false);
    const handleDelete = () => {
      alert("Inside delte. Id is " + row.id);
    };
    return (
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary btn-sm rounded bg-gray-200"
          onClick={() => {}}
        >
          <i className="fa fa-edit"></i>
        </button>
        <button
          className="btn btn-danger btn-sm rounded"
          onClick={() => {
            handleDelete();
          }}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    );
  };

  const columns = [
    {
      width: "1px !important",
      label: "#",
      field: "srNo",
    },
    {
      width: "10px",
      label: "Estimate No.",
      field: "estimate_no",
    },
    {
      width: "150px",
      label: "Estimate Date",
      field: "estimateDate",
    },
    {
      width: "200px",
      label: "Due Date",
      field: "due_date",
    },
    {
      width: "100px",
      label: "Customer Name",
      field: "customer_name",
    },
    {
      width: "100px",
      label: "Net Amount",
      field: "net_amount",
    },
    {
      width: "100px",
      label: "Status",
      field: "status",
    },
    {
      width: "150px",
      label: "Tax Amount",
      field: "tax_amount",
    },
    {
      width: "150px",
      label: "Created By",
      field: "createdBy",
    },
    {
      width: "200px",
      label: "Location",
      field: "createdFrom",
    },
    {
      width: "100px",
      label: "Actions",
      field: "actions",
      renderCell: (value: any, row: any) => <ActionsCell row={row} />,
      // renderCell: (value: any, row: any) => {
      //   const [action, setAction] = useState(false);
      //   const handleDelete = () => {
      //     alert("Inside delte. Id is " + row.id);
      //   };
      //   return (
      //     <div className="d-flex gap-2">
      //       <button
      //         className="btn btn-primary btn-sm rounded bg-gray-200"
      //         onClick={() => {}}
      //       >
      //         <i className="fa fa-edit"></i>
      //       </button>
      //       <button
      //         className="btn btn-danger btn-sm rounded"
      //         onClick={() => {
      //           handleDelete();
      //         }}
      //       >
      //         <i className="fa fa-trash"></i>
      //       </button>
      //     </div>
      //   );
      // },
    },
  ];

  const dummyData = [
    {
      srNo: "1",
      expenseNo: "EXP001",
      expenseDate: "2025-01-01",
      partyName: "ABC Corp",
      total: "₹5000",
      paid: "₹3000",
      unPaid: "₹2000",
      branch: "Delhi",
      createdBy: "John Doe",
      createdFrom: "Web",
      actions: "Edit/Delete",
    },
    {
      srNo: "2",
      expenseNo: "EXP002",
      expenseDate: "2025-01-02",
      partyName: "XYZ Ltd",
      total: "₹7000",
      paid: "₹7000",
      unPaid: "₹0",
      branch: "Mumbai",
      createdBy: "Jane Smith",
      createdFrom: "App",
      actions: "Edit/Delete",
    },
    {
      srNo: "3",
      expenseNo: "EXP003",
      expenseDate: "2025-01-03",
      partyName: "LMN Pvt Ltd",
      total: "₹8000",
      paid: "₹4000",
      unPaid: "₹4000",
      branch: "Bangalore",
      createdBy: "Alice Brown",
      createdFrom: "Web",
      actions: "Edit/Delete",
    },
    {
      srNo: "4",
      expenseNo: "EXP004",
      expenseDate: "2025-01-04",
      partyName: "OPQ Inc",
      total: "₹6000",
      paid: "₹6000",
      unPaid: "₹0",
      branch: "Chennai",
      createdBy: "Bob Johnson",
      createdFrom: "App",
      actions: "Edit/Delete",
    },
  ];

  const customFooter = (
    <>
      <tfoot>
        <tr className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">
            Total
          </td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="bold px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">12</td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">12</td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
        </tr>
      </tfoot>
    </>
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Estimate" links={[{ label: "", route: "/" }]} />
      <div className="product_page expense_page allpages-box-header">
        <div className="total_expanse d-flex mb-3 mt-3 justify-center gap-10">
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border fill-current p-3 text-center">
              12
            </span>
            All
          </div>
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">12</span>
            Pending
          </div>
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">12</span>
            Order Created
          </div>
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">12</span>
            Invoice Created
          </div>
        </div>
      </div>
      <div className="common_page_layout estimate-new-page">
        <div className="product_page">
          <div className="m-portlet__head m-portlet__head__sm d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center ml-auto gap-2">
              <select
                id="datatableCustomTableLengthSelectBox"
                className="form-control form-control-sm mr-2"
                data-toggle="tooltip"
                title="Show number of record"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="-1">All</option>
              </select>
              <input
                type="text"
                className="form-control form-control-sm mr-2"
                onChange={handleSearchChange}
                value={searchQuery}
              />
              <button
                onClick={() => setOpen(!open)}
                aria-controls="filter-collapse"
                aria-expanded={open}
                className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air"
              >
                Filter
              </button>
              <button
                className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air create-new-btn"
                onClick={() => router.push("/sales/estimate/new")}
              >
                Create New
              </button>
            </div>
          </div>

          <Collapse in={open}>
            <div
              id="filter-collapse"
              className="filter_collapse_inputdata my-3"
            >
              <Form>
                <div className="row">
                  <Form.Group className="col-md-2 mb-3">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                  <Form.Group className="col-md-2 mb-3">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </div>
              </Form>
            </div>
          </Collapse>
          <TableGeneric
            columns={columns}
            data={dummyData}
            footer={customFooter}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div>
      <div className="flex justify-center">
        <button
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="mx-1 px-2 py-2">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
