"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import BillofMaterialTable from "@/components/BillofMaterials";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const BillOfMaterialPage = () => {
  const [BillOfMaterial, setBillOfMaterial] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [totalBillOfMaterial, settotalBillOfMaterial] = useState(0);
  const [BillOfMaterialSeries, SetBillOfMaterialSeries] = useState(0);
  const pageSize = 25;

  const router = useRouter();
  const { token, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
  }, [token]);

  useEffect(() => {
    fetchMaterialCreations(currentPage, searchQuery); // Fetch categories whenever pageIndex or pageSize changes
  }, [currentPage, pageSize, searchQuery]); // Depend on pageIndex and pageSize

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
    fetchMaterialCreations(0, query); // Fetch categories with the updated search query and reset to page 0
  };

  const fetchMaterialCreations = async (pageIndex: number, search: string) => {
    try {
      setBillOfMaterial(pageIndex);
      console.log("searchQuery:", search);

      const url = search
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/Billsofmaterial`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/Billsofmaterial`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response}`);
        setBillOfMaterial([]);
        setTotalPages(0);
        settotalBillOfMaterial(0);
        return;
      }

      const data = await response.json();
      console.log("API MaterialCreation Data:", JSON.stringify(data));

      // Ensure that data.items is an array before processing
      const formattedData = Array.isArray(data)
        ? data.map((MaterialCreation: any) => ({
            Id: MaterialCreation.Id,
            Sku: MaterialCreation.Sku,
            ProductName: MaterialCreation.ProductName,
            BatchNo: MaterialCreation.BatchNo,
            MaterialCreationNo: MaterialCreation.MaterialCreationNo,
            Description: MaterialCreation.Description,
            QtyTaken: MaterialCreation.QtyTaken,
            MrpTaken: MaterialCreation.MrpTaken,
            UnitCostTaken: MaterialCreation.UnitCostTaken,
            LandingPriceTaken: MaterialCreation.LandingPriceTaken,
            SalesRateTaken: MaterialCreation.SalesRateTaken,
            TaxRateTaken: MaterialCreation.TaxRateTaken,
            TotalTaken: MaterialCreation.TotalTaken,
            QtyReceived: MaterialCreation.QtyReceived,
            MrpReceived: MaterialCreation.MrpReceived,
            UnitCostReceived: MaterialCreation.UnitCostReceived,
            LandingPriceReceived: MaterialCreation.LandingPriceReceived,
            SalesRateReceived: MaterialCreation.SalesRateReceived,
            TaxRateReceived: MaterialCreation.TaxRateReceived,
            TotalReceived: MaterialCreation.TotalReceived,
            Created_at: new Date(MaterialCreation.Created_at),
            Updated_at: new Date(MaterialCreation.Updated_at),
          }))
        : [];

      setBillOfMaterial(formattedData);
      setTotalPages(data.total_pages || 0);
      settotalBillOfMaterial(data.total_count || 0);
      console.log(
        "Formatted  MaterialCreation Data:",
        JSON.stringify(formattedData),
      );
    } catch (error) {
      console.error("Failed to fetch  Material Creation:", error);
      setBillOfMaterial([]);
      setTotalPages(0);
      settotalBillOfMaterial(0);
    }
  };

  useEffect(() => {
    console.log(BillOfMaterial);
  }, [BillOfMaterial]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Products" /> */}

      <Breadcrumb
        pageName="Bill OF Materials"
        links={[{ label: "", route: "/" }]}
      />

      <div className="common_page_layout billofMaterials-new-page">
        {/* <div  className='product-page-header'>
            <h3 className='product-page-title'>Bill OF Materials</h3>
            <ul className="product-page-header-ul">
                  <li className="product-page-header-li">
                        <a href="/" className="m-nav__link m-nav__link--icon">                      
                        <i className="fa-solid fa-house"></i>
                         </a>
                  </li>
            </ul>

      </div> */}
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
                // value={pageSize}
                // onChange={handlePageSizeChange}
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
                href="/BillofMaterials/New"
                className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air  create-new-btn"
                data-toggle="modal"
                data-target="#category_new_model"
              >
                Create New
              </a>
            </div>
          </div>
          <BillofMaterialTable
            BillofMaterial={BillOfMaterial}
            totalMaterials={totalBillOfMaterial}
            currentPage={BillOfMaterialSeries}
          />
          {/* <Pagination
          currentPage={BankSeries}
          totalPages={totalBanks}
          onPageChange={handlePageChange}
        /> */}
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

export default BillOfMaterialPage;
