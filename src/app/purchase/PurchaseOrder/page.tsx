"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { motion } from "framer-motion";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { form } from "framer-motion/m";
import "@/css/custom.css";
import PurchaseOrderTable from "@/components/PurchaseOrderTable";
import ReactDatePicker from "react-datepicker";
const PurchaseOrderPage = () => {
  // const [Orders, setOrder] = useState([]);
  interface Order {
    Id: number;
    OrderName: string;
    AccountName: string;
    Location: string;
    AccountNumber: string;
    CreatedBy: string;
    IFSCCode: string;
    SwiftCode: string;
    CreditBalance: number;
    DebitBalance: number;
    AccountGroup: string;
    AddressLine1: string;
    AddressLine2: string;
    Country: string;
    State: string;
    City: string;
    ZipCode: string;
    IsUPIAvialble: number;
    CreatedOn: string;
  }
  const [Orders, setOrders] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalOrders, setTotalPages] = useState(0);

  const [totalOrder, settotalOrder] = useState(0);
  const [OrderSeries, setOrderSeries] = useState(0);
  const pageSize = 25;
  const [warehouse, setWarehouses] = useState<any>([]);
  const router = useRouter();
  const { token, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [showFilters, setShowFilters] = useState(false);

  const [date, setDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
    const fetchWarehouse = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/GetAll
        `,
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
        // console.log("api product"+JSON.stringify(data));
        setWarehouses(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchWarehouse();
  }, [token]);
  const toggleFilters = () => setShowFilters((prev) => !prev);
  useEffect(() => {
    fetchOrders(currentPage, searchQuery); // Fetch categories whenever pageIndex or pageSize changes
  }, [currentPage, pageSize, searchQuery]); // Depend on pageIndex and pageSize

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
    fetchOrders(0, query); // Fetch categories with the updated search query and reset to page 0
  };
  //   const fetchOrders = async (pageIndex: number,search: string) => {
  //   try {
  //     setOrderSeries(pageIndex);
  //     console.log("searhqury"+search);
  //     console.log("searhqury"+search);
  //     const url = searchQuery
  //        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment//GetAllOrderDetailsByName?name=${searchQuery}`
  //        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetAllOrderDetails`;

  //     const response = await fetch(
  //       url,
  //       {
  //         method: 'GET',
  //         headers: {
  //           accept: 'application/json',
  //           Authorization: token ? `Bearer ${token}` : '',
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //     //  throw new Error(`HTTP error! Status: ${response.status}`);
  //       return  setOrders([]);
  //     }
  //     const data = await response.json();
  //     console.log("api Order "+JSON.stringify(data));

  //     setTotalPages(data.total_pages);
  //     settotalOrder(data.total_count);
  //     // Ensure data.items is defined and is an array

  //     // const formattedData = Array.isArray(data)
  //     //         ? data.map((Order: any) => ({
  //     //           Id: Order.Id,
  //     //           OrderName: Order.OrderName,
  //     //           AccountName: Order.AccountName,
  //     //           Location: Order.Location,
  //     //           AccountNumber: Order.AccountNumber,
  //     //           CreatedBy: Order.CreatedBy,
  //     //           IFSCCode: Order.IFSCCode,
  //     //           SwiftCode: Order.SwiftCode,
  //     //           CreditBalance: Order.CreditBalance,
  //     //           DebitBalance: Order.DebitBalance,
  //     //           AccountGroup: Order.AccountGroup,
  //     //           AddressLine1: Order.AddressLine1,
  //     //           AddressLine2: Order.AddressLine2,
  //     //           Country: Order.Country,
  //     //           State: Order.State,
  //     //           City: Order.City,
  //     //           ZipCode: Order.ZipCode,
  //     //           IsUPIAvialble: Order.IsUPIAvialble,
  //     //           CreatedOn: Order.CreatedOn,
  //     //           }))
  //     //         : [];

  //             setOrders(
  //               Array.isArray(data)
  //                 ? data.map((Order: any) => {
  //                   console.log('here')
  //                   console.log(Order)
  //                   return {
  //                   Id: Order.Id,
  //                   OrderName: Order.OrderName,
  //                   AccountName: Order.AccountName,
  //                   Location: Order.Location,
  //                   AccountNumber: Order.AccountNumber,
  //                   CreatedBy: Order.CreatedBy,
  //                   IFSCCode: Order.IFSCCode,
  //                   SwiftCode: Order.SwiftCode,
  //                   CreditBalance: Order.CreditBalance,
  //                   DebitBalance: Order.DebitBalance,
  //                   AccountGroup: Order.AccountGroup,
  //                   AddressLine1: Order.AddressLine1,
  //                   AddressLine2: Order.AddressLine2,
  //                   Country: Order.Country,
  //                   State: Order.State,
  //                   City: Order.City,
  //                   ZipCode: Order.ZipCode,
  //                   IsUPIAvialble: Order.IsUPIAvialble,
  //                   CreatedOn: Order.CreatedOn,
  //                   }})
  //                 : []
  //             );
  //      console.log("Order data heres"+JSON.stringify(Orders));

  //   } catch (error) {
  //     console.error("Failed to fetch Orders:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchOrders(currentPage); // Fetch orders when the page index changes
  // }, [currentPage]);
  const fetchOrders = async (pageIndex: number, search: string) => {
    try {
      setOrderSeries(pageIndex);
      //console.log("searchQuery:", search);

      const url = search
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/sales/GetAllOrderDetailsByName?name=${search}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/sales/GetAllOrderDetails`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        //console.error(`HTTP error! Status: ${response.status}`);
        setOrders([]);
        setTotalPages(0);
        settotalOrder(0);
        return;
      }

      const data = await response.json();
      //console.log("API Order Data:", JSON.stringify(data));

      // Ensure that data.items is an array before processing
      const formattedData = Array.isArray(data)
        ? data.map((Order: any) => ({
            Id: Order.Id,
            OrderName: Order.OrderName,
            AccountName: Order.AccountName,
            Location: Order.Location,
            AccountNumber: Order.AccountNumber,
            CreatedBy: Order.CreatedBy,
            IFSCCode: Order.IFSCCode,
            SwiftCode: Order.SwiftCode,
            CreditBalance: Order.CreditBalance,
            DebitBalance: Order.DebitBalance,
            AccountGroup: Order.AccountGroup,
            AddressLine1: Order.AddressLine1,
            AddressLine2: Order.AddressLine2,
            Country: Order.Country,
            State: Order.State,
            City: Order.City,
            ZipCode: Order.ZipCode,
            IsUPIAvialble: Order.IsUPIAvialble,
            CreatedOn: Order.CreatedOn,
            WarehouseId: Order.WarehouseId,
          }))
        : [];

      setOrders(formattedData);
      setTotalPages(data.total_pages || 0);
      settotalOrder(data.total_count || 0);
      // console.log("Formatted Order Data:", JSON.stringify(formattedData));
    } catch (error) {
      //console.error("Failed to fetch Orders:", error);
      setOrders([]);
      setTotalPages(0);
      settotalOrder(0);
    }
  };

  useEffect(() => {
    //console.log(Orders)
  }, [Orders]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Purchase Order"
        links={[{ label: "", route: "/" }]}
      />

      <div className="row allpages-box-header">
        <div className="all_header_boxes d-flex mb-3 mt-3 justify-center gap-10">
          <div className="header_box d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border fill-current p-3 text-center">
              0
            </span>
            All Orders
          </div>
          <div className="header_box d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">0</span>
            In Progress
          </div>
          <div className="header_box d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">0</span>
            Delivered
          </div>
          <div className="header_box d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">0</span>
            Partially Delivered
          </div>
          <div className="header_box d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">0</span>
            Exceed
          </div>
          <div className="header_box d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">0</span>
            Completed
          </div>
          <div className="header_box d-flex flex-column align-items-center gap-3">
            <span className="w-30 rounded border p-3 text-center">0</span>
            Cancel
          </div>
        </div>
      </div>

      <div className="common_page_layout PurchaseOrder-new-page">
        <div className="product_page">
          <div className="m-portlet__head m-portlet__head__sm d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center ml-auto">
              <div className="export-icons">
                <a
                  href="#"
                  className="btn btn-sm btn-primary buttons-collection dropdown-toggle buttons-colvis"
                  style={{ borderRadius: "5px" }}
                  onClick={(e) => e.preventDefault()} // Prevent default behavior for href="#"
                  aria-expanded="true"
                >
                  <span>
                    <i className="fas fa-file-export"></i>
                  </span>
                </a>
              </div>
              <select
                id="datatableCustomTableLengthSelectBox"
                className="form-control form-control-sm mr-2"
                data-toggle="tooltip"
                title="Show number of record"
                // value={pageSize}
                //onChange={handlePageSizeChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="-1">All</option>
              </select>
              <span className="headerfilter" onClick={toggleFilters}>
                <i className="fas fa-filter"></i>
                <span>Filter</span>
              </span>
              {/* <span className='headerfilter'><i className="fas fa-filter"></i><span>Filter</span></span> */}
              <div className="input-group input-group-sm mr-2">
                <input
                  type="text"
                  className="form-control form-control-sm m-input search-icons"
                  id="datatableCustomSearchInput"
                  placeholder="Search List..."
                  aria-describedby="basic-addon2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="search-font fa fa-search"></span>
              </div>
              <a
                href="/purchase/PurchaseOrder/New"
                className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air create-new-btn"
                data-toggle="modal"
                data-target="#category_new_model"
              >
                Create New
              </a>
            </div>
          </div>
          <motion.div
            className="row product-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={
              showFilters
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }} // Prevent layout breaking during collapse
          >
            <div className="row product-filter">
              <div className="col-md-3 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Date Of Supply
                </label>
                <ReactDatePicker
                  selected={date}
                  onChange={(selectedDate) => setDate(selectedDate)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control form-control-sm todaybtn-datepicker"
                  id="TransferDate"
                  name="TransferDate"
                  placeholderText="Select Date"
                />
              </div>
              <div className="col-md-3 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Select Supplier
                </label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-md-3 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Select Item Name
                </label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-md-3 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  PO Status
                </label>
                <select className="form-control">
                  <option value="All">All</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="PartiallyDelivered">
                    Partially Delivered
                  </option>
                  <option value="Exceed">Exceed</option>
                </select>
              </div>
              <div className="col-md-3 form-group">
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
            </div>
          </motion.div>

          <PurchaseOrderTable
            PurchaseOrders={Orders}
            totalProducts={totalOrders}
            currentPage={OrderSeries - 1}
            pagesize={pageSize}
          />
        </div>
      </div>
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

export default PurchaseOrderPage;
