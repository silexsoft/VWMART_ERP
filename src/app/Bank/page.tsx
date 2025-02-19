"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import BankTable from "@/components/BankTable";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { form } from "framer-motion/m";

export default function BankPage() {
  // const [banks, setBank] = useState([]);
  interface bank {
    Id: number;
    BankName: string;
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
  const [banks, setBanks] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalBanks, setTotalPages] = useState(0);

  const [totalBank, settotalBank] = useState(0);
  const [BankSeries, setbankSeries] = useState(0);
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
    fetchBanks(currentPage, searchQuery); // Fetch categories whenever pageIndex or pageSize changes
  }, [currentPage, pageSize, searchQuery]); // Depend on pageIndex and pageSize

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
    fetchBanks(0, query); // Fetch categories with the updated search query and reset to page 0
  };
  //   const fetchBanks = async (pageIndex: number,search: string) => {
  //   try {
  //     setbankSeries(pageIndex);
  //     console.log("searhqury"+search);
  //     console.log("searhqury"+search);
  //     const url = searchQuery
  //        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment//GetAllBankDetailsByName?name=${searchQuery}`
  //        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetAllBankDetails`;

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
  //       return  setBanks([]);
  //     }
  //     const data = await response.json();
  //     console.log("api Bank "+JSON.stringify(data));

  //     setTotalPages(data.total_pages);
  //     settotalBank(data.total_count);
  //     // Ensure data.items is defined and is an array

  //     // const formattedData = Array.isArray(data)
  //     //         ? data.map((bank: any) => ({
  //     //           Id: bank.Id,
  //     //           BankName: bank.BankName,
  //     //           AccountName: bank.AccountName,
  //     //           Location: bank.Location,
  //     //           AccountNumber: bank.AccountNumber,
  //     //           CreatedBy: bank.CreatedBy,
  //     //           IFSCCode: bank.IFSCCode,
  //     //           SwiftCode: bank.SwiftCode,
  //     //           CreditBalance: bank.CreditBalance,
  //     //           DebitBalance: bank.DebitBalance,
  //     //           AccountGroup: bank.AccountGroup,
  //     //           AddressLine1: bank.AddressLine1,
  //     //           AddressLine2: bank.AddressLine2,
  //     //           Country: bank.Country,
  //     //           State: bank.State,
  //     //           City: bank.City,
  //     //           ZipCode: bank.ZipCode,
  //     //           IsUPIAvialble: bank.IsUPIAvialble,
  //     //           CreatedOn: bank.CreatedOn,
  //     //           }))
  //     //         : [];

  //             setBanks(
  //               Array.isArray(data)
  //                 ? data.map((bank: any) => {
  //                   console.log('here')
  //                   console.log(bank)
  //                   return {
  //                   Id: bank.Id,
  //                   BankName: bank.BankName,
  //                   AccountName: bank.AccountName,
  //                   Location: bank.Location,
  //                   AccountNumber: bank.AccountNumber,
  //                   CreatedBy: bank.CreatedBy,
  //                   IFSCCode: bank.IFSCCode,
  //                   SwiftCode: bank.SwiftCode,
  //                   CreditBalance: bank.CreditBalance,
  //                   DebitBalance: bank.DebitBalance,
  //                   AccountGroup: bank.AccountGroup,
  //                   AddressLine1: bank.AddressLine1,
  //                   AddressLine2: bank.AddressLine2,
  //                   Country: bank.Country,
  //                   State: bank.State,
  //                   City: bank.City,
  //                   ZipCode: bank.ZipCode,
  //                   IsUPIAvialble: bank.IsUPIAvialble,
  //                   CreatedOn: bank.CreatedOn,
  //                   }})
  //                 : []
  //             );
  //      console.log("Bank data heres"+JSON.stringify(banks));

  //   } catch (error) {
  //     console.error("Failed to fetch Banks:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchBanks(currentPage); // Fetch orders when the page index changes
  // }, [currentPage]);
  const fetchBanks = async (pageIndex: number, search: string) => {
    try {
      setbankSeries(pageIndex);
      //console.log("searchQuery:", search);

      const url = search
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetAllBankDetailsByName?name=${search}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetAllBankDetails`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        //console.error(`HTTP error! Status: ${response.status}`);
        setBanks([]);
        setTotalPages(0);
        settotalBank(0);
        return;
      }

      const data = await response.json();
      //console.log("API Bank Data:", JSON.stringify(data));

      // Ensure that data.items is an array before processing
      const formattedData = Array.isArray(data)
        ? data.map((bank: any) => ({
            Id: bank.Id,
            BankName: bank.BankName,
            AccountName: bank.AccountName,
            Location: bank.Location,
            AccountNumber: bank.AccountNumber,
            CreatedBy: bank.CreatedBy,
            IFSCCode: bank.IFSCCode,
            SwiftCode: bank.SwiftCode,
            CreditBalance: bank.CreditBalance,
            DebitBalance: bank.DebitBalance,
            AccountGroup: bank.AccountGroup,
            AddressLine1: bank.AddressLine1,
            AddressLine2: bank.AddressLine2,
            Country: bank.Country,
            State: bank.State,
            City: bank.City,
            ZipCode: bank.ZipCode,
            IsUPIAvialble: bank.IsUPIAvialble,
            CreatedOn: bank.CreatedOn,
            WarehouseId: bank.WarehouseId,
          }))
        : [];

      setBanks(formattedData);
      setTotalPages(data.total_pages || 0);
      settotalBank(data.total_count || 0);
      // console.log("Formatted Bank Data:", JSON.stringify(formattedData));
    } catch (error) {
      //console.error("Failed to fetch Banks:", error);
      setBanks([]);
      setTotalPages(0);
      settotalBank(0);
    }
  };

  useEffect(() => {
    //console.log(banks)
  }, [banks]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Bank" links={[{ label: "", route: "/" }]} />
      <div className="common_page_layout bank-new-page">
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
                  href="/Bank/New"
                  className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air cre create-new-btn"
                  data-toggle="modal"
                  data-target="#category_new_model"
                >
                  Create New
                </a>
              </div>
            </div>
            <BankTable
              banks={banks}
              totalbanks={totalBanks}
              currentPage={BankSeries}
            />
            {/* <Pagination
          currentPage={BankSeries}
          totalPages={totalBanks}
          onPageChange={handlePageChange}
        /> */}
          </div>
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
