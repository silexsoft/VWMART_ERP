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

const Payments = () => {
  const [products, setproducts] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProduct, settotalProduct] = useState(0);
  const [productSeries, setproductSeries] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const { token, logout, warehouseId } = useAuth();
  const [open, setOpen] = useState(false);

  const schema = yup.object().shape({
    fromAccount: yup.string().required("From Account is required"),
    toAccount: yup.string().required("To Account is required"),
    amount: yup
      .number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive"),
    transactionDate: yup
      .date()
      .typeError("Date is required")
      .required("Date is required"),
    description: yup.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [showModal, setShowModal] = useState(false);

  const toggle = (from: any) => {
    if (from == "edit") {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
    setShowModal((prev) => !prev);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const ActionsCell = ({ row }:any) => {
   const [action, setAction] = useState(false);
   const handleDelete = () => {
     alert("Inside delte. Id is " + row.id);
   };
   return (
     <>
       <button
         className="actionbtn_payment"
         onClick={() => setAction((prev) => !prev)}
       >
         ...
       </button>
       {action && (
         <div
           className="dropdown-menu dropdown-menu-right show paymentpage"
           style={{
             position: "absolute",
             zIndex: 10,
             backgroundColor: "white",
             border: "1px solid #ddd",
             borderRadius: "4px",
             padding: "10px",
             height: "auto",
           }}
         >
           <span
             className="dropdown-item paymentpage"
             onClick={() => router.push(`/Bank/payment/${row.id}/edit`)}
           >
             <i className="la la-edit"></i> Edit Details
           </span>
           <a
             className="dropdown-item paymentpage"
             href="#"
             onClick={handleDelete}
           >
             <i className="la la-trash"></i> Delete
           </a>
         </div>
       )}
     </>
   );
}
  const columns = [
    {
      width: "20px",
      label: "Payment No",
      field: "paymentNo",
      renderCell: (value: any, row: any) => {
        return (
          <span
            className="font-underline pointer font-semibold text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`/Bank/payment/${row.id}`);
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      width: "20px",
      label: "Party Name",
      field: "partyName",
    },
    {
      width: "20px",
      label: "Payment Mode",
      field: "paymentMode",
    },
    {
      width: "20px",
      label: "Date",
      field: "date",
    },
    {
      width: "20px",
      label: "Amount",
      field: "amount",
    },
    {
      width: "20px",
      label: "Status",
      field: "status",
    },
    {
      width: "20px",
      label: "Created By",
      field: "createdBy",
    },
    {
      width: "20px",
      classNames:
        "px-0 py-2 text-left text-sm font-medium text-black dark:text-white",
      label: "Actions",
      field: "Actions",
        renderCell: (value: any, row: any) => <ActionsCell row={row}/>
      // renderCell: (value: any, row: any) => {
      //   const [action, setAction] = useState(false);
      //   const handleDelete = () => {
      //     alert("Inside delte. Id is " + row.id);
      //   };
      //   return (
      //     <>
      //       <button
      //         className="actionbtn_payment"
      //         onClick={() => setAction((prev) => !prev)}
      //       >
      //         ...
      //       </button>
      //       {action && (
      //         <div
      //           className="dropdown-menu dropdown-menu-right show paymentpage"
      //           style={{
      //             position: "absolute",
      //             zIndex: 10,
      //             backgroundColor: "white",
      //             border: "1px solid #ddd",
      //             borderRadius: "4px",
      //             padding: "10px",
      //             height: "auto",
      //           }}
      //         >
      //           <span
      //             className="dropdown-item paymentpage"
      //             onClick={() => router.push(`/Bank/payment/${row.id}/edit`)}
      //           >
      //             <i className="la la-edit"></i> Edit Details
      //           </span>
      //           <a
      //             className="dropdown-item paymentpage"
      //             href="#"
      //             onClick={handleDelete}
      //           >
      //             <i className="la la-trash"></i> Delete
      //           </a>
      //         </div>
      //       )}
      //     </>
      //   );
      // },
    },
  ];

  const dmyData = [
    {
      id: 1,
      paymentNo: "P12345",
      partyName: "Party A",
      paymentMode: "Credit Card",
      date: "2025-01-16",
      amount: 5000,
      status: "Completed",
      createdBy: "User1",
    },
    {
      id: 2,
      paymentNo: "P67890",
      partyName: "Party B",
      paymentMode: "Bank Transfer",
      date: "2025-01-15",
      amount: 3000,
      status: "Pending",
      createdBy: "User2",
    },
    {
      id: 3,
      paymentNo: "P54321",
      partyName: "Party C",
      paymentMode: "Cash",
      date: "2025-01-14",
      amount: 7000,
      status: "Completed",
      createdBy: "User3",
    },
    {
      id: 4,
      paymentNo: "P98765",
      partyName: "Party D",
      paymentMode: "Cheque",
      date: "2025-01-13",
      amount: 2500,
      status: "Failed",
      createdBy: "User4",
    },
    {
      id: 5,
      paymentNo: "P11223",
      partyName: "Party E",
      paymentMode: "Debit Card",
      date: "2025-01-12",
      amount: 4500,
      status: "Pending",
      createdBy: "User5",
    },
  ];

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
    try {
      setproductSeries(pageIndex);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=${pageIndex}&pageSize=${pageSize}&storeId=0&vendorId=0&
      warehouseId=${warehouseId}&visibleIndividuallyOnly=false&excludeFeaturedProducts=false&productTagId=0&keywords=${searchQuery}&
      searchDescriptions=false&searchManufacturerPartNumber=true&searchSku=true&searchProductTags=false&
      languageId=0&showHidden=false`,
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

      console.log("api product" + JSON.stringify(data));

      setTotalPages(data.total_pages);
      settotalProduct(data.total_count);
      // Ensure data.items is defined and is an array
      setproducts(
        Array.isArray(data.items)
          ? data.items.map((product: any) => ({
              id: product.id,
              name: product.name,
              sku: product.sku,
              published: product.published,
              //deleted: product.deleted,
              old_price: product.old_price,
              price: product.price,
              image_url: product.image_url,
              category_names: product.category_names,
              manufacturer_names: product.manufacturer_names,
              order_minimum_quantity: product.order_minimum_quantity,
            }))
          : [],
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage); // Fetch orders when the page index changes
  }, [currentPage, pageSize, searchQuery]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onSubmit = (data: any) => {
    console.log(data);
    if (data.id) {
      alert("Edit submit");
    } else {
      alert("add submit");
    }
  };

  useEffect(() => {
    if (!showModal) {
      reset();
    }
  }, [showModal]);

  return (
    <DefaultLayout>
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
            <a
              onClick={() => setOpen(!open)}
              aria-controls="filter-collapse"
              aria-expanded={open}
              className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air"
              href="#"
            >
              Filter
            </a>
            <a
              href="#"
              className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air"
              onClick={() => router.push("/Bank/payment/new")}
            >
              Create New
            </a>
          </div>
        </div>

        <Collapse in={open}>
          <div id="filter-collapse" className="my-3">
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
        <TableGeneric columns={columns} data={dmyData} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal show={showModal} onHide={() => toggle("")} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add"} Transaction</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <div className="mb-1">
              <label htmlFor="fromAccount" className="form-label">
                From Account: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.fromAccount ? "is-invalid" : ""}`}
                id="fromAccount"
                {...register("fromAccount")}
              />
              {errors.fromAccount && (
                <div className="invalid-feedback">
                  {errors.fromAccount.message}
                </div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="toAccount" className="form-label">
                To Account: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.toAccount ? "is-invalid" : ""}`}
                id="toAccount"
                {...register("toAccount")}
              />
              {errors.toAccount && (
                <div className="invalid-feedback">
                  {errors.toAccount.message}
                </div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="amount" className="form-label">
                Amount: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                id="amount"
                {...register("amount")}
              />
              {errors.amount && (
                <div className="invalid-feedback">{errors.amount.message}</div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="transactionDate" className="form-label">
                Date: <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control ${errors.transactionDate ? "is-invalid" : ""}`}
                id="transactionDate"
                {...register("transactionDate")}
              />
              {errors.transactionDate && (
                <div className="invalid-feedback">
                  {errors.transactionDate.message}
                </div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <input
                className="form-control"
                id="description"
                {...register("description")}
              ></input>
            </div>
            <button type="submit" className="btn btn-primary mb-1 mb-2">
              Submit
            </button>
          </Container>
        </form>
      </Modal>
    </DefaultLayout>
  );
};

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

export default Payments;
