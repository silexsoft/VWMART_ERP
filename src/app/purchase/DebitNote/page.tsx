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
import {
  Modal,
  Button,
  Alert,
  Container,
  Collapse,
  Tabs,
  Tab,
} from "react-bootstrap";
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
          onClick={() => {
            router.push(`/Bank/expense/${row.id}/edit`);
          }}
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
      label: "Sr. No.",
      field: "srNo",
    },
    {
      width: "140px",
      label: "Status",
      field: "status",
      renderCell: (value: any, row: any) => {
        return (
          <div
            className={`status_cell`}
            style={{
              color: "white",
              backgroundColor: value === "Paid" ? "#28a745" : "red",
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      width: "150px",
      label: "Debit Note No.",
      field: "debitno",
      renderCell: (value: any, row: any) => {
        return (
          <span
            className="cursor-pointer font-semibold text-primary"
            // onClick={() => router.push(`/Bank/expense/${row.id}`)}
          >
            {value}
          </span>
        );
      },
    },
    {
      width: "150px",
      label: "Supplier",
      field: "supplier",
      renderCell: (value: any, row: any) => {
        return (
          <span
            className="cursor-pointer font-semibold text-primary"
            // onClick={() => router.push(`/Bank/expense/${row.id}`)}
          >
            {value}
          </span>
        );
      },
    },
    {
      width: "150px",
      label: "Debit Note Date",
      field: "debit_note_date",
    },
    {
      width: "150px",
      label: "Debit Note Amount",
      field: "debitnote_amount",
    },  
    {
      width: "150px",
      label: "Tax Amount",
      field: "taxAmount",
    },
    {
      width: "150px",
      label: "Created By",
      field: "createdBy",
    },
    {
      width: "150px",
      label: "Location",
      field: "location",
    },
    {
      width: "150px",
      label: "Notes",
      field: "notes",
    },
    {
      width: "100px",
      label: "Actions",
      field: "actions",
      renderCell: (value: any, row: any) => <ActionsCell row={row} />,
    },
  ];

  const columnsUnpaid = [
    {
      width: "150px",
      label: "Sr No.",
      field: "srNo",
    },
    {
      width: "150px",
      label: "Status",
      field: "status",
    },
    {
      width: "150px",
      label: "Bill No.",
      field: "billNo",
    },
    {
      width: "150px",
      label: "Bill Date",
      field: "billDate",
    },
    {
      width: "150px",
      label: "PO No",
      field: "poNo",
    },
    {
      width: "150px",
      label: "Supplier",
      field: "supplier",
    },
    {
      width: "150px",
      label: "Bill Amount",
      field: "billAmount",
    },
    {
      width: "150px",
      label: "Paid Amount",
      field: "paidAmount",
    },
    {
      width: "150px",
      label: "Due Amount",
      field: "dueAmount",
    },
    {
      width: "150px",
      label: "Tax Amount",
      field: "taxAmount",
    },
    {
      width: "150px",
      label: "Due Date",
      field: "dueDate",
    },
    {
      width: "150px",
      label: "Created By",
      field: "createdBy",
    },
    {
      width: "150px",
      label: "Branch",
      field: "branch",
    },
    {
      width: "100px",
      label: "Actions",
      field: "actions",
      renderCell: (value: any, row: any) => <ActionsCell row={row} />,
    },
  ];

  const unpaidData = [
    {
      width: "150px",
      label: "Item Code/Barcode*",
      field: "item_code_barcode",
    },
    {
      width: "150px",
      label: "Product Name",
      field: "product_name",
    },
    {
      width: "100px",
      label: "Batch",
      field: "batch",
    },
    {
      width: "100px",
      label: "Qty*",
      field: "qty",
    },
    {
      width: "100px",
      label: "Unit Cost",
      field: "unit_cost",
    },
    {
      width: "100px",
      label: "Disc1*",
      field: "disc1",
    },
    {
      width: "100px",
      label: "Disc2*",
      field: "disc2",
    },
    {
      width: "100px",
      label: "Taxable",
      field: "taxable",
    },
    {
      width: "100px",
      label: "Tax",
      field: "tax",
    },
    {
      width: "150px",
      label: "Landing Cost",
      field: "landing_cost",
    },
    {
      width: "100px",
      label: "Total*",
      field: "total",
    },
  ];




  const dummyData = [
    {
      status: "Paid",
      billNo: "INV-001",
      supplier: "Supplier A",
      billDate: "2023-01-01",
      poNo: "PO-1234",
      billAmount: 1500,
      paidAmount: 1500,
      dueAmount: 0,
      taxAmount: 150,
      dueDate: "2023-02-01",
      createdBy: "John Doe",
      location: "Office",
      notes: "On time",
    },
    {
      status: "Due",
      billNo: "INV-002",
      supplier: "Supplier B",
      billDate: "2023-01-10",
      poNo: "PO-1235",
      billAmount: 2000,
      paidAmount: 1000,
      dueAmount: 1000,
      taxAmount: 200,
      dueDate: "2023-03-10",
      createdBy: "Jane Smith",
      location: "Warehouse",
      notes: "Partial payment",
    },
    {
      status: "Paid",
      billNo: "INV-003",
      supplier: "Supplier C",
      billDate: "2023-02-15",
      poNo: "PO-1236",
      billAmount: 2500,
      paidAmount: 2500,
      dueAmount: 0,
      taxAmount: 250,
      dueDate: "2023-03-15",
      createdBy: "Alice Johnson",
      location: "Headquarters",
      notes: "Early payment",
    },
    {
      status: "Due",
      billNo: "INV-004",
      supplier: "Supplier D",
      billDate: "2023-03-01",
      poNo: "PO-1237",
      billAmount: 3000,
      paidAmount: 0,
      dueAmount: 3000,
      taxAmount: 300,
      dueDate: "2023-04-01",
      createdBy: "Bob Brown",
      location: "Remote",
      notes: "Pending payment",
    },
  ];

  const customFooter = (
    <>
      <tfoot>
        <tr className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">
            Total
          </td>
          <td className="bold px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">12</td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">12</td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
        </tr>
      </tfoot>
    </>
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Debit Note" links={[]} />
      <div className="product_page debit_note_page">
        <div className="total_expanse d-flex mb-3 mt-3 justify-center gap-10">
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border fill-current p-3 text-center">
              12
            </span>
            Total Amount
          </div>
        </div>
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
              className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air"
              onClick={() => router.push("/purchase/debitnote/new")}
            >
              Create New
            </button>
          </div>
        </div>

        <Collapse in={open}>
          <div id="filter-collapse" className="filter_collapse_inputdata my-3">
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
        <Tabs
          defaultActiveKey="all"
          id="uncontrolled-tab-example"
          // className="mb-3"
        >
          <Tab eventKey="all" title="All">
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
          </Tab>
          <Tab eventKey="unpaid" title="Unpaid">
            <TableGeneric
              columns={columnsUnpaid}
              data={[]}
              footer={customFooter}
            />
          </Tab>
        </Tabs>
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
