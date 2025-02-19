"use client";

import "@/css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from "react-bootstrap";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";

let Token = process.env.BACKEND_TOKEN;
const MaterialCreationDetail = () => {
  const pathname = usePathname();
  const id = pathname.match(/\/MaterialCreation\/(\d+)/)?.[1];

  const router = useRouter();
  const { token, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [isTextboxVisible, setTextboxVisible] = useState(false);
  const [dropdownProduct, SetdropdownProduct] = useState<any[]>([]);

  const handleArrowClick = (event: any) => {
    setTextboxVisible(!isTextboxVisible);
  };

  const [MaterialCreations, setMaterialCreations] = useState<any>({
    Id: "",
    Sku: "",
    ProductName: "",
    BatchNo: "",
    MaterialCreationNo: "",
    Description: "",
    QtyTaken: "",
    MrpTaken: "",
    UnitCostTaken: "",
    LandingPriceTaken: "",
    SalesRateTaken: "",
    TaxRateTaken: "",
    TotalTaken: "",
    QtyReceived: "",
    MrpReceived: "",
    UnitCostReceived: "",
    LandingPriceReceived: "",
    SalesRateReceived: "",
    TaxRateReceived: "",
    TotalReceived: "",
    Created_at: Date,
    Updated_at: Date,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [itemCode, setItemCode] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [productName, setProductName] = useState("");
  const [printName, setPrintName] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  //const handleInputChange = (e:any) => setItemCode(e.target.value);
  const handleCheckboxChange = (e: any) => setAutoGenerate(e.target.checked);

  //  Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMaterialCreations((prevProduct: any) => ({
      ...prevProduct, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
    fetchProducts(query); // Fetch categories with the updated search query and reset to page 0
  };
  // const isQueryLongerThan3 = (query: string): boolean => {
  //   return query.length > 3;
  // };

  const fetchProducts = async (query: string) => {
    try {
      //  SetdropdownProduct([]);
      console.log("Search query product: " + JSON.stringify(query));
      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=0&pageSize=10&storeId=0&vendorId=0
      &warehouseId=0&visibleIndividuallyOnly=false&excludeFeaturedProducts=false&productTagId=0&
      keywords=${query}&searchDescriptions=false&searchManufacturerPartNumber
      =true&searchSku=true&searchProductTags=false&languageId=0&showHidden=false`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        throw new Error(`Error in search product: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Search product data: " + JSON.stringify(data));

      SetdropdownProduct(
        Array.isArray(data.items)
          ? data.items.map((product: any) => ({
              name: product.name,
              sku: product.sku,
            }))
          : [],
      );

      return data;
    } catch (error) {
      console.log("Error in product search: " + error);
    }
  };

  useEffect(() => {
    console.log("dropdownProduct" + JSON.stringify(dropdownProduct));
  }, [dropdownProduct]);

  const updateMaterialCreation = async (materialcreation: any) => {
    try {
      materialcreation.TotalTaken =
        materialcreation.QtyTaken * materialcreation.UnitCostTaken || 0;
      materialcreation.TotalReceived =
        materialcreation.QtyReceived * materialcreation.UnitCostReceived || 0;

      console.log(
        "Before updated material creation Data" +
          JSON.stringify(materialcreation),
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/EditMaterialCreationDetailsById`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(materialcreation),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      handleOpenModal();
      const data = await response.json();
      console.log("updated data material creation" + data);
      return data;
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    const fetchMaterialCreations = async () => {
      setIsLoading(true); // Ensure loading state is set before fetching.
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetMaterialCreationDetailsById?Id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );
        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} - ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log("Fetched Material Creations Data:", data);
        setMaterialCreations(data);
      } catch (error) {
        console.error("Failed to fetch Material Creations:", error || error);
      } finally {
        setIsLoading(false); // Always set loading to false after the fetch is complete.
      }
    };
    fetchMaterialCreations();
  }, [id, token]); // Adding `id` and `token` to the dependency array.

  const handleUpdate = async () => {
    try {
      const response = await updateMaterialCreation(MaterialCreations);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const AddRowblankRaw = () => {
    // Define your function logic here
    console.log("Add row function triggered");
  };

  const getItemCodeDataRaw = (index: any) => {
    console.log(`Get item code data for index ${index}`);
  };

  const getProductDataRaw = (index: any) => {
    console.log(`Get product data for index ${index}`);
  };

  const RawBatchChange = (index: any) => {
    console.log(`Batch changed for index ${index}`);
  };

  const setAmountRaw = (index: any) => {
    console.log(`Set amount for index ${index}`);
  };

  if (isLoading)
    return (
      <DefaultLayout>
        <div>Loading...</div>
      </DefaultLayout>
    );
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Edit Material Creation"
        links={[{ label: "Material Creation", route: "/MaterialCreation" }]}
      />
      {/* <div className='product-details-header'>
      <h3 className='header-font'>Material Creation</h3>
            <ul className="product-page-header-ul">
                  <li className="product-page-header-li">
                        <a href="/" className="m-nav__link m-nav__link--icon">                      
                        <i className="fa-solid fa-house"></i>
                         </a>
                  </li>                  
            </ul>
            <ul className="product-page-header-ul">
                <li className='product-page-header-li'>
                        <a href="/MaterialCreation"> 
                        <span>- Material Creation</span>
                        </a>
                  </li>
            </ul>
            <ul className="product-page-header-ul">
                <li className='product-page-header-li'>                         
                        <span>{MaterialCreations.MaterialCreationNo}</span>                       
                  </li>
            </ul>
     </div>  */}
      <div className="common_page_layout materialcreation-new-page">
        <div className="form-container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="m-portlet">
                <div className="m-portlet__head m-portlet__head__sm">
                  <div className="m-portlet__head-caption">
                    <div className="m-portlet__head-title"></div>
                  </div>
                  <div className="m-portlet__head-tools">
                    {/* Uncomment this block for additional actions if needed */}
                    {/* 
          <ul className="m-portlet__nav">
            <li className="m-portlet__nav-item">
              <span className="badge badge-warning">Pending</span>
            </li>
            <li className="m-portlet__nav-item">
              <a
                id="materialcreation_delete"
                href="javascript:void(0)"
                data-url="/materialcreation/62879/delete"
                className="btn btn-danger m-btn m-btn--icon m-btn--icon-only"
                title="Delete"
              >
                <i className="fa fa-trash"></i>
              </a>
            </li>
            <li className="m-portlet__nav-item">
              <a
                href="/materialcreation"
                id="cancel_sales"
                className="btn btn-primary m-btn m-btn--icon m-btn--icon-only"
                title="Back"
              >
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
          */}
                  </div>
                </div>
                <div className="m-portlet__body card-body-sm">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group row">
                        <label className="col-lg-12 col-md-12 col-sm-12">
                          Material Creation Date
                        </label>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <div className="input-group date">
                            <input
                              type="text"
                              className="form-control form-control-sm todaybtn-datepicker"
                              name="materialCreationDate"
                              readOnly
                              data-date-format="dd/mm/yyyy"
                              data-date-start-date="01/04/2024"
                              data-date-end-date="31/03/2025"
                              value="09/01/2025"
                            />
                          </div>
                          <small
                            className="help-block"
                            style={{ display: "none" }}
                          >
                            The Date is required
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group row">
                        <label className="col-lg-12 col-md-12 col-sm-12">
                          Material Creation No.
                        </label>
                        <div className="col-lg-6 col-6">
                          <input
                            type="text"
                            readOnly
                            className="form-control form-control-sm"
                            name="MaterialCreationNo"
                            value={MaterialCreations.MaterialCreationNo}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group row">
                        <label className="col-lg-12 col-md-12 col-sm-12">
                          Description
                        </label>
                        <div className="col-lg-12 col-12">
                          <textarea
                            className="form-control form-control-sm"
                            name="Description"
                            rows={1}
                            placeholder="Enter Description"
                            value={MaterialCreations.Description}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Portlet */}
              {/* Material Taken */}
              <div
                className="row"
                id="productdetails-portlet"
                data-select2-id="productdetails-portlet"
              >
                <div className="col-md-12" data-select2-id="14">
                  <div className="table-responsive" data-select2-id="13">
                    <table
                      className="table-sm table-striped table-bordered table-hover table"
                      id="raw_product_table"
                      data-select2-id="raw_product_table"
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={12}
                            className="text-center"
                            style={{
                              backgroundColor: "#686868",
                              color: "#fff",
                            }}
                          >
                            Material Taken
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{ width: "60px" }}
                            className="text-center"
                          ></th>
                          <th className="text-center" style={{ width: "50px" }}>
                            Sr. No.
                          </th>
                          <th>Item Code/Barcode</th>
                          <th>Product Name</th>
                          <th>Batch No</th>
                          <th style={{ width: "100px" }}>
                            Qty
                            <span
                              style={{ fontSize: "1.25rem" }}
                              className="text-danger"
                            >
                              *
                            </span>
                          </th>
                          <th className="text-right">MRP</th>
                          <th className="text-right">Unit Cost</th>
                          <th className="text-right">Landing Price</th>
                          <th className="text-right">Sales Rate</th>
                          <th className="text-right">Tax Rate</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody data-raw-list="" data-select2-id="12">
                        <tr data-raw-item="template" className="m--hide">
                          <td className="paction text-center">
                            <button
                              type="button"
                              className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                              onClick={() => console.log("Remove item clicked")}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                            <button
                              type="button"
                              title="Add New"
                              className="btn btn-outline-info m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                              onClick={AddRowblankRaw}
                            >
                              <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                            <input
                              type="hidden"
                              name="materialCreationRawItemVos[{index}].materialCreationRawItemId"
                              id="raw_materialCreationRawItemId{index}"
                              value=""
                            />
                          </td>
                          <td className="text-center">
                            <span data-item-index=""></span>
                          </td>
                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Sku"
                              name="Sku"
                              id="Sku"
                              value={MaterialCreations.Sku}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="ProductName"
                              name="materialCreationRawItemVos[{index}].ProductName"
                              id="raw_ProductName{index}"
                              value={MaterialCreations.ProductName}
                              onChange={handleInputChange}
                            />
                            <span
                              id="dropdown"
                              className="form-control"
                              onClick={handleArrowClick}
                            >
                              {" "}
                              ^
                            </span>
                            {isTextboxVisible && (
                              <div style={{ marginTop: "10px" }}>
                                <input
                                  type="text"
                                  id="textbox"
                                  className="form-control"
                                  placeholder=""
                                  value={searchQuery}
                                  onChange={handleSearchChange}
                                />
                                <select>
                                  {dropdownProduct.length > 0 &&
                                    dropdownProduct.map((prod: any) => (
                                      <option key={prod.sku} value={prod.sku}>
                                        {prod.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            )}
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="BatchNo"
                              name="BatchNo"
                              id="BatchNo"
                              value={MaterialCreations.BatchNo}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="QtyTaken"
                              name="QtyTaken"
                              id="QtyTaken"
                              value={MaterialCreations.QtyTaken}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.MrpTaken}</label>
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.UnitCostTaken}</label>
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.LandingPriceTaken}</label>
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.SalesRateTaken}</label>
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.TaxRateTaken}</label>
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.TotalTaken}</label>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={11} className="text-center">
                            <input
                              type="hidden"
                              name="UnitCostTaken"
                              id="UnitCostTaken"
                              value="0.00"
                            />
                            Total Amount:{" "}
                            <span id="UnitCostTaken">
                              {MaterialCreations.QtyTaken *
                                MaterialCreations.UnitCostTaken || 0}
                            </span>
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Goods Received */}

              <div
                className="row"
                id="productdetails-portlet"
                data-select2-id="productdetails-portlet"
              >
                <div className="col-md-12" data-select2-id="14">
                  <div className="table-responsive" data-select2-id="13">
                    <table>
                      <thead>
                        <tr>
                          <th colSpan={11} className="text-center">
                            <input
                              type="hidden"
                              name="rawTotalAmount"
                              id="rawTotalAmount"
                              value="0.00"
                            />
                            Total Amount:{" "}
                            <span id="totalAmountRaw">
                              {MaterialCreations.QtyReceived *
                                MaterialCreations.UnitCostReceived || 0}
                            </span>
                          </th>
                        </tr>
                      </thead>
                    </table>
                    <table
                      className="table-sm table-striped table-bordered table-hover table"
                      id="raw_product_table"
                      data-select2-id="raw_product_table"
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={12}
                            className="text-center"
                            style={{
                              backgroundColor: "#686868",
                              color: "#fff",
                            }}
                          >
                            Material Taken
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{ width: "60px" }}
                            className="text-center"
                          ></th>
                          <th className="text-center" style={{ width: "50px" }}>
                            Sr. No.
                          </th>
                          <th>Item Code/Barcode</th>
                          <th>Product Name</th>
                          <th>Batch No</th>
                          <th style={{ width: "100px" }}>
                            Qty
                            <span
                              style={{ fontSize: "1.25rem" }}
                              className="text-danger"
                            >
                              *
                            </span>
                          </th>
                          <th className="text-right">MRP</th>
                          <th className="text-right">Unit Cost</th>
                          <th className="text-right">Landing Price</th>
                          <th className="text-right">Sales Rate</th>
                          <th className="text-right">Tax Rate</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody data-raw-list="" data-select2-id="12">
                        <tr data-raw-item="template" className="m--hide">
                          <td className="paction text-center">
                            <button
                              type="button"
                              className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                              onClick={() => console.log("Remove item clicked")}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                            <button
                              type="button"
                              title="Add New"
                              className="btn btn-outline-info m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                              onClick={AddRowblankRaw}
                            >
                              <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                            <input
                              type="hidden"
                              name="materialCreationRawItemVos[{index}].materialCreationRawItemId"
                              id="raw_materialCreationRawItemId{index}"
                              value=""
                            />
                            {/* Add more hidden inputs as needed */}
                          </td>
                          <td className="text-center">
                            <span data-item-index=""></span>
                          </td>
                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Sku"
                              name="Sku"
                              id="Sku"
                              value={MaterialCreations.Sku}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="ProductName"
                              name="ProductName"
                              id="ProductName"
                              value={MaterialCreations.ProductName}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="BatchNo"
                              name="BatchNo"
                              id="BatchNo"
                              value={MaterialCreations.BatchNo}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="QtyReceived"
                              name="QtyReceived"
                              id="QtyReceived"
                              value={MaterialCreations.QtyReceived}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="MrpReceived"
                              name="MrpReceived"
                              id="MrpReceived"
                              value={MaterialCreations.MrpReceived}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="UnitCostReceived"
                              name="UnitCostReceived"
                              id="UnitCostReceived"
                              value={MaterialCreations.UnitCostReceived}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="LandingPriceReceived"
                              name="LandingPriceReceived"
                              id="LandingPriceReceived"
                              value={MaterialCreations.LandingPriceReceived}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="SalesRateReceived"
                              name="SalesRateReceived"
                              id="SalesRateReceived"
                              value={MaterialCreations.SalesRateReceived}
                              onChange={handleInputChange}
                            />
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.TaxRateReceived}</label>
                          </td>

                          <td style={{ width: "150px" }}>
                            <label>{MaterialCreations.TotalReceived}</label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
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
                href="/MaterialCreation"
                id="cancel_consumption"
                className="btn btn-danger"
              >
                Cancel
              </a>
              &nbsp;
              {/* <button type="reset" className="btn btn-info m--hide" id="clear_contact">
      Clear
    </button> */}
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
                onClick={handleUpdate}
              >
                Save
              </button>
              {/* <button
      type="submit"
      className="btn btn-info"
      id="save_and_new_materialcreation"
      style={{ borderRadius: '.25rem' }}
    >
      Save &amp; Create New
    </button> */}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Alert in Modal</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {/* Product Updated Successfully ! */}
            </Alert>
          )}{" "}
          Details Updated Successfully !
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </DefaultLayout>
  );
};
export default MaterialCreationDetail;
