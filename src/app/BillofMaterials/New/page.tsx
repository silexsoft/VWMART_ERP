"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import BankTable from "@/components/BankTable";
import React from "react";
import ReactDatePicker from "react-datepicker";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { form } from "framer-motion/m";

const BillsOfMaterialPage = () => {
  // const [banks, setBank] = useState([]);
  interface BillsOfMaterial {
    Id: number;
    BillsOfMaterialName: string;
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
  const [BillsOfMaterials, setBillsOfMaterials] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalBillsOfMaterials, setTotalPages] = useState(0);

  const [totalBillsOfMaterial, settotalBillsOfMaterial] = useState(0);
  const [BillsOfMaterialSeries, setBillsOfMaterialSeries] = useState(0);
  const pageSize = 25;

  const router = useRouter();
  const { token, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [date, setDate] = useState<Date | null>(new Date());
  const [enabled, setEnabled] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
  }, [token]);

  useEffect(() => {
    fetchBillsOfMaterials(currentPage, searchQuery); // Fetch categories whenever pageIndex or pageSize changes
  }, [currentPage, pageSize, searchQuery]); // Depend on pageIndex and pageSize

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
    fetchBillsOfMaterials(0, query); // Fetch categories with the updated search query and reset to page 0
  };

  const fetchBillsOfMaterials = async (pageIndex: number, search: string) => {
    try {
      setBillsOfMaterialSeries(pageIndex);
      //console.log("searchQuery:", search);

      const url = search
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetAllBillsOfMaterialDetailsByName?name=${search}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetAllBillsOfMaterialDetails`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        //console.error(`HTTP error! Status: ${response.status}`);
        setBillsOfMaterials([]);
        setTotalPages(0);
        settotalBillsOfMaterial(0);
        return;
      }

      const data = await response.json();
      //console.log("API BillsOfMaterial Data:", JSON.stringify(data));

      // Ensure that data.items is an array before processing
      const formattedData = Array.isArray(data)
        ? data.map((BillsOfMaterial: any) => ({
            Id: BillsOfMaterial.Id,
            BillsOfMaterialName: BillsOfMaterial.BillsOfMaterialName,
            AccountName: BillsOfMaterial.AccountName,
            Location: BillsOfMaterial.Location,
            AccountNumber: BillsOfMaterial.AccountNumber,
            CreatedBy: BillsOfMaterial.CreatedBy,
            IFSCCode: BillsOfMaterial.IFSCCode,
            SwiftCode: BillsOfMaterial.SwiftCode,
            CreditBalance: BillsOfMaterial.CreditBalance,
            DebitBalance: BillsOfMaterial.DebitBalance,
            AccountGroup: BillsOfMaterial.AccountGroup,
            AddressLine1: BillsOfMaterial.AddressLine1,
            AddressLine2: BillsOfMaterial.AddressLine2,
            Country: BillsOfMaterial.Country,
            State: BillsOfMaterial.State,
            City: BillsOfMaterial.City,
            ZipCode: BillsOfMaterial.ZipCode,
            IsUPIAvialble: BillsOfMaterial.IsUPIAvialble,
            CreatedOn: BillsOfMaterial.CreatedOn,
            WarehouseId: BillsOfMaterial.WarehouseId,
          }))
        : [];

      setBillsOfMaterials(formattedData);
      setTotalPages(data.total_pages || 0);
      settotalBillsOfMaterial(data.total_count || 0);
      // console.log("Formatted BillsOfMaterial Data:", JSON.stringify(formattedData));
    } catch (error) {
      //console.error("Failed to fetch BillsOfMaterials:", error);
      setBillsOfMaterials([]);
      setTotalPages(0);
      settotalBillsOfMaterial(0);
    }
  };

  useEffect(() => {
    //console.log(BillsOfMaterials)
  }, [BillsOfMaterials]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Products" /> */}
      <Breadcrumb
        pageName="New Bill Of Material"
        links={[{ label: "Bill Of Material", route: "/BillofMaterials" }]}
      />
      <div className="common_page_layout BillsOfMaterial-new-page">
        {/* <div className="product-details-header">
          <h6 className="header-font">New Bill Of Materials</h6>
          <ul className="product-page-header-ul">
            <li className="product-page-header-li">
              <a href="/" className="m-nav__link m-nav__link--icon">
                <i className="fa-solid fa-house" />
              </a>
            </li>
          </ul>
          <ul className="product-page-header-ul">
            <li className="product-page-header-li">
              <a href="/products">
                <span>- Bill Of Materials</span>
              </a>
            </li>
          </ul>
        </div> */}

        <div className="row">
          <div className="col-md-2">
            <div className="form-group row has-success">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Bill Of Materials Date
                <small style={{ color: "red" }} className="text-danger">
                  *
                </small>
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="input-group date">
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
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="form-group row has-success">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Bill Of Materials No
              </label>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="input-group date">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="BIM"
                    name="BillOfMaterialsNo"
                    id="BillOfMaterialsNo"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="input-group date">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="1"
                    name="BillOfMaterialsNo"
                    id="BillOfMaterialsNo"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="form-group row has-success">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Select Recipe
                <small style={{ color: "red" }} className="text-danger">
                  *
                </small>
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="input-group date">
                  <input
                    type="text"
                    placeholder="Select Recipe"
                    className="form-control form-control-sm"
                    id="SelectRecipe"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-group row has-success">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Allow Reverse Calculation
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="input-group date">
                  <button
                    onClick={() => setEnabled(!enabled)}
                    className={`relative flex h-7 w-14 items-center rounded-full p-1 transition-all duration-300 ${
                      enabled ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div></div>
                    <div
                      className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
                        enabled ? "translate-x-7" : "translate-x-0"
                      }`}
                    >
                      {enabled && (
                        <svg
                          className="h-4 w-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="m-portlet">
              <div className="m-portlet__head m-portlet__head__sm">
                <div className="m-portlet__head-tools">
                  <ul
                    className="nav nav-tabs m-tabs-line m-tabs-line--primary m-tabs-line--2x"
                    role="tablist"
                  >
                    <li className="nav-item m-tabs__item">
                      <a
                        className="nav-link m-tabs__link active"
                        data-bs-toggle="tab"
                        href="#m_tabs_7_2"
                        role="tab"
                      >
                        Product Details
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="m-portlet__body card-body-sm">
                <div className="tab-content">
                  <div
                    className="tab-pane active"
                    id="m_tabs_7_2"
                    role="tabpanel"
                  >
                    <table
                      className="table-sm table-bordered mb-0 table"
                      id="main_product_table"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="hidden"
                              name={`billOfMaterialsRecipeVo.recipeVo.recipeId`}
                              id={`recipeId`}
                            />
                            <label
                              className="d-block mb-0 mr-0 p-2"
                              style={{
                                backgroundColor: "#36a3f7",
                                color: "#fff",
                              }}
                            >
                              Recipe
                            </label>
                            <table
                              className="table-sm table-bordered mb-0 table"
                              id={`final_product_table`}
                            >
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Item Code</th>
                                  <th>Product Name</th>
                                  <th className="text-center">Qty</th>
                                  <th className="text-right">Purchase Price</th>
                                  <th className="text-right">Landing Cost</th>
                                  <th className="text-right">MRP</th>
                                  <th className="text-right">Selling Price</th>
                                  <th className="m--hide text-center">
                                    Mfg Date
                                  </th>
                                  <th className="m--hide text-center">
                                    Expiry Days
                                  </th>
                                  <th className="m--hide text-center">
                                    Exp Date
                                  </th>
                                  <th>Batch No</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td>
                                    <a href="#"></a>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm qty"
                                      placeholder="Qty"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm text-right"
                                      placeholder="Purchase Price"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm text-right"
                                      placeholder="Landing Cost"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm text-right"
                                      placeholder="MRP"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm text-right"
                                      placeholder="Selling Price"
                                    />
                                  </td>
                                  <td className="m--hide">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Mfg Date"
                                    />
                                  </td>
                                  <td className="m--hide">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm text-right"
                                      placeholder="Expiry Days"
                                    />
                                  </td>
                                  <td className="m--hide">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Exp Date"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Batch No."
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td></td>
                                  <td colSpan={9}>
                                    <table
                                      className="table-sm table-bordered mb-0 table"
                                      id={`final_product_table`}
                                    >
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          <th>Item Code</th>
                                          <th>Product Name</th>
                                          <th>
                                            Batch
                                            <span
                                              style={{ fontSize: "1.25rem" }}
                                              className="text-danger"
                                            >
                                              *
                                            </span>
                                          </th>
                                          <th>Available Qty</th>
                                          <th>
                                            Use Qty
                                            <span
                                              style={{ fontSize: "1.25rem" }}
                                              className="text-danger"
                                            >
                                              *
                                            </span>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td>
                                            <select
                                              className="form-control"
                                              multiple
                                              aria-placeholder="Select Batch"
                                              id={`raw_product_recipe_batch`}
                                            >
                                              {/* Options should be dynamically added */}
                                            </select>
                                          </td>
                                          <td></td>
                                          <td>
                                            <input
                                              type="text"
                                              className="form-control form-control-sm"
                                              placeholder="Use Qty"
                                            />
                                            <input
                                              type="hidden"
                                              id={`raw_product_recipe_itemCodeinput`}
                                            />
                                            <input
                                              type="hidden"
                                              id={`raw_product_recipe_productVarientIdinput`}
                                            />
                                            <input
                                              type="hidden"
                                              id={`raw_product_recipe_recipeIdinput`}
                                            />
                                            <input
                                              type="hidden"
                                              id={`raw_product_recipe_finalqty`}
                                            />
                                            <input
                                              type="hidden"
                                              id={`raw_product_recipe_batchqty`}
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div
        className="m-container m-container--fluid m-container--full-height m-page__container"
        style={{ display: "flex" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            flex: "1 1 0",
            display: "flex",
            whiteSpace: "nowrap",
          }}
        >
          <a
            href="/BillofMaterials"
            id="cancel_consumption"
            className="btn btn-danger"
          >
            Cancel
          </a>
        </div>
        <div
          style={{
            justifyContent: "flex-end",
            flex: "1 1 0",
            display: "flex",
            whiteSpace: "nowrap",
          }}
        >
          <button
            type="submit"
            className="btn btn-info mr-1"
            id="save_materialcreation"
          >
            Save
          </button>
        </div>
      </div> */}

      <div className="row savecancelfooterbtns">
        <div className="col-md-12">
          <button
            className="btn btn-danger"
            onClick={() => router.push("/BillofMaterials/")}
          >
            Cancel
          </button>
          <button
            style={{ float: "right" }}
            //onClick={handleUpdate}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BillsOfMaterialPage;
