"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductsTable from "@/components/WarehouseTable";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import WarehouseTable from "@/components/WarehouseTable";
import { AnyNaptrRecord } from "node:dns";

const WarehousesPage = () => {
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

  const [warehouse, setwarehouses] = useState<any>([]);
  const [address, setAddress] = useState<any>([]);
  const [addressId, setAddressId] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [warehouseSeries, setwarehouseSeries] = useState(0);

  const [pageSize, setPageSize] = useState<number>(10);
  const router = useRouter();
  const { token, logout, warehouseId } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
  }, [token]);

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(Number(event.target.value)); // Update page size
    setCurrentPage(1); // Reset page index to 0 when page size changes
  };
  const fetchWarehouse = async (pageIndex: number, searchquery: any) => {
    try {
      setwarehouseSeries(pageIndex);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/FilterGetByParentWarehouseId/${warehouseId}?name=${searchquery}&pageindex=${pageIndex - 1}&pagesize=${pageSize}`,
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
      console.log("api warehouses" + JSON.stringify(data));

      if (Array.isArray(data.Warehouses) && data.Warehouses.length > 0) {
        setwarehouses(
          data.Warehouses.map((warehouse: any) => ({
            id: warehouse.id,
            admin_comment: warehouse.admin_comment,
            Name: warehouse.name,
            address_id: warehouse.address_id,
          })),
        );

        setTotalPages(data.TotalRecords);
      } else {
        // console.warn("No warehouses found or data is not an array.");
        setwarehouses([]); // Set an empty array to prevent issues
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

  const fetchWarehouseAddress = async (AddressId: number) => {
    try {
      //console.log("AddressId"+AddressId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Address/GetById/${AddressId}
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
      console.log("api warehousae address" + JSON.stringify(data));
      // setAddress((prevAddresses: Address[]) => [
      //   ...prevAddresses,
      //   ...(Array.isArray(data)
      //     ? data.map((address: any) => ({
      //         first_name: address.first_name,
      //         last_name: address.last_name,
      //         email: address.email,
      //         company: address.company,
      //         country_id: address.country_id,
      //         state_province_id: address.state_province_id,
      //         county: address.county,
      //         city: address.city,
      //         address1: address.address1,
      //         address2: address.address2,
      //         zip_postal_code: address.zip_postal_code,
      //         phone_number: address.phone_number,
      //         fax_number: address.fax_number,
      //         custom_attributes: address.custom_attributes,
      //         created_on_utc: address.created_on_utc,
      //         id: address.id,
      //       }))
      //     : [])
      // ]);

      console.log("api warehousae address" + JSON.stringify(data));

      const formattedData = {
        first_name: data.first_name || "N/A",
        last_name: data.last_name || "N/A",
        email: data.email || "N/A",
        company: data.company || "N/A",
        country_id: data.country_id,
        state_province_id: data.state_province_id,
        county: data.county || "N/A",
        city: data.city || "N/A",
        address1: data.address1 || "N/A",
        address2: data.address2 || "N/A",
        zip_postal_code: data.zip_postal_code || "N/A",
        phone_number: data.phone_number || "N/A",
        fax_number: data.fax_number || "N/A",
        custom_attributes: data.custom_attributes || "N/A",
        created_on_utc: data.created_on_utc,
        id: data.id,
      };

      // console.log("formattedData"+JSON.stringify(formattedData));
      // setAddress((prevAddresses:any) => [...prevAddresses, ...formattedData]);

      setAddress((prevAddresses: any) => [...prevAddresses, formattedData]);
    } catch (error) {
      console.error("Failed to fetch warehouse Addressess:", error);
    }
  };

  useEffect(() => {
    if (Array.isArray(warehouse)) {
      for (const warehous of warehouse) {
        fetchWarehouseAddress(warehous.address_id);
      }
    } else {
      console.error("warehouse is not an array");
    }
  }, [warehouse]);

  useEffect(() => {
    console.log(warehouse);
  }, [setwarehouses]);

  useEffect(() => {
    console.log("all addres" + address);
  }, [setAddress]);

  useEffect(() => {
    console.log("all address" + address);
  }, [address]);

  useEffect(() => {
    fetchWarehouse(currentPage, searchQuery); // Fetch orders when the page index changes
  }, [currentPage, searchQuery]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Outlet" links={[{ label: "", route: "/" }]} />

      <div className="common_page_layout outlet-new-page">
        <div className="product_page">
          <div className="flex flex-col gap-10">
            <div className="m-portlet__head m-portlet__head__sm d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="m-portlet__head-icon">
                  <i className="flaticon-cogwheel-2"></i>
                </span>
              </div>
              <div className="d-flex align-items-center ml-auto">
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
                  href="/Outlet/New"
                  className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air create-new-btn"
                  data-toggle="modal"
                  data-target="#category_new_model"
                >
                  Create New
                </a>
              </div>
            </div>

            <WarehouseTable
              warehouses={warehouse}
              address={address}
              totalWarehouse={totalPages}
              currentPage={warehouseSeries - 1}
              pagesize={pageSize}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

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

export default WarehousesPage;
