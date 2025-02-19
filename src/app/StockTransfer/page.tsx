"use client";
import "@/css/custom.css";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import StockTransferTable from "@/components/StockTransferTable";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const StockTransferPage = () => {
  const [stocktransfer, setstocktransfer] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [totalProduct, settotalProduct] = useState(0);
  const [productSeries, setproductSeries] = useState(0);
  //const pageSize = 25;
  const [pageSize, setPageSize] = useState<number>(10);
  const router = useRouter();
  const { token, logout, warehouseId } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [warehouse, setWarehouses] = useState<any>([]);
  ////Datepicker
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  ////Datepicker

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

  const getAllStockTransfer = async (pageIndex: number) => {
    try {
      setproductSeries(pageIndex);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAllStockTransferDetails`,
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

      console.log("api stock tranfer" + JSON.stringify(data));

      setTotalPages(data.total_pages);
      settotalProduct(data.total_count);
      // Ensure data.items is defined and is an array
      setstocktransfer(
        Array.isArray(data)
          ? data.map((stocktrnsfr: any) => ({
              Id: stocktrnsfr.Id,
              TransferNo: stocktrnsfr.TransferNo,
              TransferDate: stocktrnsfr.TransferDate,
              FromLocation: stocktrnsfr.FromLocation,
              ToLocation: stocktrnsfr.ToLocation,
              NetAmount: stocktrnsfr.NetAmount,
              Qty: stocktrnsfr.Qty,
              Status: stocktrnsfr.Status,
              CreatedBy: stocktrnsfr.CreatedBy,
              AdditionalCharge: stocktrnsfr.AdditionalCharge,
              AdditionalValue: stocktrnsfr.AdditionalValue,
              AdditionalTax: stocktrnsfr.AdditionalTax,
              AdditionalCurrency: stocktrnsfr.AdditionalCurrency,
              AdditionalTotal: stocktrnsfr.AdditionalTotal,
              ShippingType: stocktrnsfr.ShippingType,
              ShippingDate: stocktrnsfr.ShippingDate,
              ReferenceNo: stocktrnsfr.ReferenceNo,
              TransportDate: stocktrnsfr.TransportDate,
              ModeOfTransport: stocktrnsfr.ModeOfTransport,
              TransporterName: stocktrnsfr.TransporterName,
              VehicleNo: stocktrnsfr.VehicleNo,
              Weight: stocktrnsfr.Weight,
              Note: stocktrnsfr.Note,
            }))
          : [],
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  useEffect(() => {
    getAllStockTransfer(currentPage); // Fetch orders when the page index changes
  }, [currentPage, pageSize, searchQuery]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(Number(event.target.value)); // Update page size
    setCurrentPage(0); // Reset page index to 0 when page size changes
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
  };

  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Products" /> */}
      {/* <div className="flex flex-col gap-10"> */}
      <Breadcrumb
        pageName="Stock Transfer"
        links={[{ label: "", route: "/" }]}
      />
      <div className="common_page_layout stockTransfer-new-page">
        {/* <div className="product-page-header">
          <h3 className="product-page-title">Stock Transfer</h3>
          <ul className="product-page-header-ul">
            <li className="product-page-header-li">
              <a href="/" className="m-nav__link m-nav__link--icon">
                <i className="fa-solid fa-house"></i>
              </a>
            </li>
          </ul>
        </div> */}
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
                href="/StockTransfer/New"
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
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Stock Transfer Date
                </label>

                <select
                  className="form-control product-filter-select"
                  id="parent_category_name"
                  name="parent_category_name"
                  data-fv-field="parent_category_name"
                >
                  <option value="">Select</option>
                </select>
              </div>
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  From Location
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
                  To Location
                </label>
                <select className="form-control product-filter-select">
                  <option>All</option>
                  {warehouse.map((wh: any) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Status
                </label>
                <select className="form-control product-filter-select">
                  <option>All</option>
                  <option value="Hold">Hold</option>
                  <option value="Open">Open</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </motion.div>

          <StockTransferTable
            stocktransfer={stocktransfer}
            totalProducts={totalProduct}
            currentPage={productSeries}
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

export default StockTransferPage;
