"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { motion } from "framer-motion";

import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import "@/css/custom.css";

import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const [products, setproducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProduct, settotalProduct] = useState(0);
  const [productSeries, setproductSeries] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const { token, logout, warehouseId } = useAuth();
  const [warehouse, setWarehouses] = useState<any>([]);
  const [fromdate, setfromDate] = useState<Date | null>(new Date());
  const [todate, settoDate] = useState<Date | null>(new Date());

  const [allExpenseTotal, SetAllExpenseTotal] = useState(0);
  const [allExpensePaid, SetAllExpensePaid] = useState(0);
  const [allExpenseUnPaid, SetAllExpenseUnPaid] = useState(0);
  // interface expenses {
  //   Id?: Number | null;
  //   ExpenseNo: string;
  //   ExpenseDate: Date;
  //   PartyName: string;
  //   Total: string;
  //   Paid: string;
  //   UnPaid: string;
  //   Branch: string;
  //   CreatedBy: string;
  //   CreatedFrom: string;
  //   InvoiceNo: string;
  //   ReverseCharge: false;
  //   AppliedTaxType: string;
  //   NonGST: false;
  //   Note: string;
  //   GrossAmount: string;
  //   Discount: string;
  //   TaxableAmount: string;
  //   Tax: string;
  //   NetAmount: string;
  //   CreatedAt: Date;
  //   UpdatedAt: Date;
  // }
  const [allexpenses, setAllexpenses] = useState([]);

  const [expenseSeries, setexpenseSeries] = useState(0);
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(Number(event.target.value)); // Update page size
    setCurrentPage(0); // Reset page index to 0 when page size changes
  };

  // useEffect(() => {
  //   fetchAllExpenses(currentPage, searchQuery); // Fetch orders when the page index changes
  // }, [currentPage, searchQuery]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
    fetchAllExpenses(currentPage, searchQuery);
  }, [token, currentPage, searchQuery]);
  const fetchAllExpenses = async (pageIndex: number, searchquery: any) => {
    try {
      setexpenseSeries(pageIndex);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/GetExpenseByFilteration?name=${searchquery}&pageindex=${pageIndex - 1}&pagesize=${pageSize}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("api expene" + JSON.stringify(data));

      if (Array.isArray(data.Expense) && data.Expense.length > 0) {
        setAllexpenses(
          data.Expense.map((Expense: any) => ({
            Id: Expense.Id,
            //SRNO: Expense.Id,
            ExpenseNo: Expense.ExpenseNo,

            ExpenseDate: new Date(Expense.ExpenseDate).toLocaleDateString(
              "en-US",
            ),
            PartyName: Expense.PartyName,
            Total: Expense.Total,
            Paid: Expense.Paid,
            UnPaid: Expense.UnPaid,
            Branch: Expense.Branch,
            CreatedBy: Expense.CreatedBy,
            CreatedFrom: Expense.CreatedFrom,
          })),
        );
        SetAllExpenseTotal(
          data.Expense.reduce(
            (sum: any, expense: any) => sum + Number(expense?.Total ?? 0),
            0,
          ),
        );
        SetAllExpensePaid(
          data.Expense.reduce(
            (sum: any, expense: any) => sum + Number(expense?.Paid ?? 0),
            0,
          ),
        );
        SetAllExpenseUnPaid(
          data.Expense.reduce(
            (sum: any, expense: any) => sum + Number(expense?.UnPaid ?? 0),
            0,
          ),
        );
        setTotalPages(Math.ceil(data.TotalRecords / pageSize));
        //setTotalPages(data.TotalRecords);
      } else {
        setAllexpenses([]); // Set an empty array to prevent issues
      }

      // setwarehouses(
      //   Array.isArray(data)
      //     ? data.map((warehouse: any) => ({
      //         id: warehouse.id,
      //         admin_comment: warehouse.admin_comment,
      //         Name: warehouse.name,
      //         address_id: warehouse.address_id,
      //       }))
      //     : [],
      // );
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const ActionsCell = ({ row }: any) => {
    const [action, setAction] = useState(false);
    const handleDelete = () => {
      DeleteApi(row.Id);
    };

    const DeleteApi = async (selectedItems: any) => {
      console.log("Delete ids" + JSON.stringify(selectedItems));
      try {
        try {
          const responses = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/ExpenseDelete/${selectedItems}`,
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
            toast.error("Something Went Wrong", {
              position: "top-right",
              autoClose: 5000,
            });
            throw new Error(`Error: ${responses.statusText}`);
          }
          toast.success("Deleted Successfully", {
            position: "top-right",
            autoClose: 5000,
          });
          fetchAllExpenses(currentPage, searchQuery);
        } catch {
          toast.error("Something Went Wrong", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch {
        toast.error("Something Went Wrong", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    return (
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary btn-sm rounded bg-gray-200"
          onClick={() => {
            router.push(`/Bank/expense/${row.Id}/edit`);
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
      field: "SRNO",
      type: "serial",
    },
    {
      width: "10px",
      label: "Expense No.",
      field: "ExpenseNo",
      renderCell: (value: any, row: any) => {
        return (
          <span
            className="cursor-pointer font-semibold text-primary"
            onClick={() => router.push(`/Bank/expense/${row.id}`)}
          >
            {value}
          </span>
        );
      },
    },
    {
      width: "150px",
      label: "Expense Date",
      field: "ExpenseDate",
    },
    {
      width: "200px",
      label: "Party Name",
      field: "PartyName",
    },
    {
      width: "100px",
      label: "Total",
      field: "Total",
    },
    {
      width: "100px",
      label: "Paid",
      field: "Paid",
    },
    {
      width: "100px",
      label: "UnPaid",
      field: "UnPaid",
    },
    {
      width: "150px",
      label: "Branch",
      field: "Branch",
    },
    {
      width: "150px",
      label: "Created By",
      field: "CreatedBy",
    },
    {
      width: "200px",
      label: "Created From",
      field: "CreatedFrom",
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
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="bold px-4 py-2 text-sm text-black dark:text-white">
            Total
          </td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">
            {allExpenseTotal}
          </td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">
            {allExpensePaid}
          </td>
          <td className="px-4 py-2 text-sm text-black dark:text-white">
            {allExpenseUnPaid}
          </td>
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
      <Breadcrumb pageName="Bank Expense" links={[{ label: "", route: "/" }]} />
      <div className="product_page expense_page allpages-box-header">
        <div className="total_expanse d-flex mb-3 mt-3 justify-center gap-10">
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border fill-current p-3 text-center">
              {allExpenseTotal}
            </span>
            Total Expanse
          </div>
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">
              {allExpensePaid}
            </span>
            Paid
          </div>
          <div className="expanse_type d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">
              {allExpenseUnPaid}
            </span>
            Unpaid
          </div>
        </div>
      </div>
      <div className="common_page_layout bankexpense-new-page">
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
                onClick={() => router.push("/Bank/expense/new")}
              >
                Create New
              </button>
            </div>
          </div>
          <motion.div
            className="row product-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={
              open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }} // Prevent layout breaking during collapse
          >
            <div className="row product-filter">
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Location
                </label>
                <select className="form-control product-filter-select">
                  <option value="">All</option>
                  {warehouse.map((wh: any) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Select Party
                </label>
                <select className="form-control product-filter-select">
                  <option>All</option>
                </select>
              </div>
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  From Date
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group date">
                    <ReactDatePicker
                      selected={fromdate}
                      onChange={(selectedDate) => setfromDate(selectedDate)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control form-control-sm todaybtn-datepicker"
                      id="FromDate"
                      name="FromDate"
                      placeholderText="Select Date"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  To Date
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group date">
                    <ReactDatePicker
                      selected={todate}
                      onChange={(selectedDate) => settoDate(selectedDate)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control form-control-sm todaybtn-datepicker"
                      id="ToDate"
                      name="ToDate"
                      placeholderText="Select Date"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <TableGeneric
            columns={columns}
            data={allexpenses}
            footer={customFooter}
            currentPage={currentPage - 1}
            pagesize={pageSize}
          />
        </div>
      </div>
      {/* <Collapse in={open}>
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
      </Collapse> */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />
      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      /> */}
      <ToastContainer />
    </DefaultLayout>
  );
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}) => {
  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if totalPages is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // First Page
      pageNumbers.push(1);

      // Left Ellipsis
      if (currentPage > maxVisiblePages - 1) {
        pageNumbers.push("...");
      }

      // Middle Pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Right Ellipsis
      if (currentPage < totalPages - maxVisiblePages + 2) {
        pageNumbers.push("...");
      }

      // Last Page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      // Prevent navigation if it's out of bounds
      if (page < 1 || page > totalPages) return;
      onPageChange(page);
    }
  };

  return (
    <div className="row">
      <div className="col-sm-12 col-md-5">
        <div className="table-info">
          Showing {pageSize * (Math.max(1, currentPage) - 1) + 1} to
          {Math.min(pageSize * Math.max(1, currentPage), totalPages)} of{" "}
          {totalPages} entries
        </div>
      </div>
      <div className="col-sm-12 col-md-7">
        <div className="table-pagination">
          <ul className="pagination">
            {/* Previous Button */}
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() =>
                currentPage > 1 && handlePageClick(currentPage - 1)
              }
            >
              <button className="page-link"> &lt; </button>
            </li>

            {/* Page Numbers */}
            {renderPageNumbers().map((page, index) => (
              <li
                key={index}
                className={`page-item ${page === currentPage ? "active" : ""}`}
                onClick={() => handlePageClick(page)}
              >
                <button className="page-link">{page}</button>
              </li>
            ))}

            {/* Next Button */}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() =>
                currentPage < totalPages && handlePageClick(currentPage + 1)
              }
            >
              <button className="page-link"> &gt; </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
