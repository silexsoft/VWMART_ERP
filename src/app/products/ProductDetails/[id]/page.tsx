"use client";
import "bootstrap/dist/css/bootstrap.min.css";

import { usePathname } from "next/navigation";
import ProductsTable from "@/components/ProductsTable";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../../../css/custom.css";
import { format, set } from "date-fns";
const ProductDetails = () => {
  const [product, setProduct] = useState<any>({
    id: "",
    name: "",
    sku: "",
    short_description: "",
    full_description: "",
    published: false,
    old_price: Number,
    price: Number,
    product_cost: Number,
    weight: Number,
    order_minimum_quantity: Number,
    created_on_utc: "",
    image_url: "",
    category_names: "",
    sub_category_names: "",
    stock_quantity: "",
    is_tax_exempt: true,
    tax_category_id: Number,

    //deleted:false
  });
  const [warehouses, Setwarehouse] = useState<any>({
    name: "",
    id: "",
  });

  const [inventory, setInventory] = useState<any>({
    product_id: "",
    warehouse_id: "",
    stock_quantity: "",
    reserved_quantity: "",
    id: "",
  });

  const [availableQty, SetavailableQty] = useState(0);

  const pathname = usePathname();
  const id = pathname?.match(/\/products\/ProductDetails\/(\d+)/)?.[1];
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [totalProduct, settotalProduct] = useState(0);
  const [productSeries, setproductSeries] = useState(0);
  const pageSize = 25;
  const [created_on_utc, setcreated_on_utc] = useState("");
  const router = useRouter();

  const { token, logout, warehouseId } = useAuth();
  const [activeTab, setActiveTab] = useState("product_details");
  const [isBatchVisible, setIsBatchVisible] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string[]>([]);
  const [selectedWarehousename, setSelectedWarehousename] = useState<string[]>(
    [],
  );
  const [taxCategory, SettaxCategory] = useState<any>({
    name: "",
    id: "",
  });

  const [matchTax, SetmatchTax] = useState("");

  const toggleBatchVisibility = () => {
    setIsBatchVisible(!isBatchVisible); // Toggle visibility
  };

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetById/${id}?warehouseid=${warehouseId}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "", // Use your actual auth token
            },
          },
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched product:", data);
        setProduct(data);
        setcreated_on_utc(product.created_on_utc);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        //  setIsLoading(false);
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/GetAll`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "", // Use your actual auth token
            },
          },
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched warehouse:", data);
        Setwarehouse(data);
      } catch (error) {
        console.error("Failed to fetch warehouse:", error);
      } finally {
        //  setIsLoading(false);
      }
    };

    const fetchWarehouseInventory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductWarehouse/GetAllProductWarehouseInventoryRecords/${id}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "", // Use your actual auth token
            },
          },
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched Warehouse Inventory:", data);
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch Warehouse Inventory:", error);
      } finally {
        //  setIsLoading(false);
      }
    };

    fetchProduct();
    fetchWarehouses();
    fetchWarehouseInventory();
    //  fetchTaxCategory();
  }, [token]);

  useEffect(() => {
    fetchTaxCategory();
  }, [product]);
  const fetchTaxCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/TaxCategory/GetAll`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "", // Use your actual auth token
          },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched tax category:", data);
      SettaxCategory(data);
      console.log(product.tax_category_id);
      const matchingTax = data.find(
        (tax: any) => tax.id === product.tax_category_id,
      );
      if (matchingTax) {
        SetmatchTax(matchingTax.name);
      } else {
        SetmatchTax("None");
      }
    } catch (error) {
      console.error("Failed to fetch tax category:", error);
    } finally {
      //  setIsLoading(false);
    }
  };
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedWarehouse(selectedOptions);
    //  console.log(warehouses);

    const selectedOptionsName = selectedOptions.map(
      (id) =>
        warehouses.find((warehouse: any) => warehouse.id.toString() === id)
          ?.name || "",
    );
    setSelectedWarehousename(selectedOptionsName);
    const productInventory = selectedOptions.map(
      (id: string) =>
        inventory.find(
          (warehouseinv: any) => warehouseinv.warehouse_id.toString() === id,
        ) || "",
    );
    console.log("productINV" + JSON.stringify(productInventory));

    if (productInventory.length > 0) {
      const updatedProductInventory = productInventory.map((item) => {
        const availableQuantity = Math.max(
          0,
          item.stock_quantity - item.reserved_quantity,
        );
        SetavailableQty(availableQuantity);
        return {
          ...item,
          available_quantity: availableQuantity,
        };
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct: any) => ({
      ...prevProduct, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await updateProduct(product);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      //  setIsLoading(false);
    }
  };

  const updateProduct = async (productData: any) => {
    try {
      //handleOpenModal();
      console.log("productData" + JSON.stringify(productData));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/Update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(productData),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("updated data" + data);
      return data;
    } catch (error) {
    } finally {
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={product.name}
        links={[{ label: "Product", route: "/products" }]}
      />
      <div className="product-detail-page common_page_layout">
        <div className="product-details-headtools row">
          {/* <div className='product-details-header'>
      <h3 className='header-font'>{product.name}</h3>
            <ul className="product-page-header-ul">
                  <li className="product-page-header-li">
                        <a href="/" className="m-nav__link m-nav__link--icon">                      
                        <i className="fa-solid fa-house"></i>
                         </a>
                  </li>                  
            </ul>
            <ul className="product-page-header-ul">
            <li className='product-page-header-li'>
                        <a href="/products"> 
                        <span>- Product</span>
                        </a>
                  </li>
            </ul>
     </div>  */}
          <div className="col-md-12 tab_heading">
            <div
              className="nav nav-tabs product-detail-tabs"
              id="nav-tab"
              role="tablist"
            >
              <a
                className={`nav-link ${activeTab === "product_details" ? "active" : ""}`}
                onClick={() => handleTabClick("product_details")}
              >
                Product Details
              </a>
              <a
                className={`nav-link ${activeTab === "product_ledger" ? "active" : ""}`}
                onClick={() => handleTabClick("product_ledger")}
              >
                Product Ledger
              </a>
              <a
                className={`nav-link ${activeTab === "pricing" ? "active" : ""}`}
                onClick={() => handleTabClick("pricing")}
              >
                Pricing Details
              </a>
              <a
                className={`nav-link ${activeTab === "multi_barcode" ? "active" : ""}`}
                onClick={() => handleTabClick("multi_barcode")}
              >
                Multi Barcode
              </a>
              <a
                className={`nav-link ${activeTab === "stock_details" ? "active" : ""}`}
                onClick={() => handleTabClick("stock_details")}
              >
                Stock Details
              </a>
            </div>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === "product_details" && (
            <div className="product-detail-pages">
              <div className="product-detail-imgdetail">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <div className="media">
                      <div className="img-modl-div">
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#image_modal"
                        >
                          {" "}
                          <span
                            className="img text-mute m--margin-right-10 "
                            id="no_image"
                          >
                            <img
                              src={product.image_url || "/default-image.jpg"}
                              alt={`Product ${product.name}`}
                              style={{ width: "100px" }}
                            />
                          </span>
                          {/* <Image src="" alt="No Image Found" className="border p-2 default_image"  width={20} height={20} />
       <Image className="default_image border p-2 m--margin-right-10 m--hide" src="" alt="No Image Found" title="BELLA VITA UNISEX 4N" id="default_image"  width={20} height={20}/> 
     */}
                        </a>
                      </div>

                      <div className="media-body">
                        <table className="table-sm table-bordered mb-0 table">
                          <tbody>
                            <tr>
                              <td colSpan={2}>
                                <span className="bella-vita-sl">
                                  {product.name}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ width: "135px" }}>
                                Short Description
                              </th>
                              <td style={{ wordBreak: "break-all" }}>
                                {product.short_description}
                              </td>
                            </tr>
                            <tr>
                              <th style={{ width: "135px" }}>Description</th>
                              <td className="productdescription">
                                {product.full_description}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-detail-tabledt">
                <div className="row">
                  <div className="col-md-4">
                    <table className="table-sm table-bordered table">
                      <tbody>
                        {/* <tr className="m--hide">
                          <th>Product Type</th>
                          <td>Simple</td>
                        </tr>
                        <tr>
                          <th>Print Name</th>
                          <td>{product.name}</td>
                        </tr>
                        <tr>
                          <th>Multiple Batch</th>
                          <td>
                            {product.use_multiple_warehouses === true
                              ? "Yes"
                              : "No"}{" "}
                          </td>
                        </tr>
                        <tr>
                          <th>Department</th>
                          <td>Other</td>
                        </tr> */}
                        <tr>
                          <th>Category</th>
                          <td>{product.category_names}</td>
                        </tr>
                        <tr>
                          <th>Sub Category</th>
                          <td>{product.sub_category_names}</td>
                        </tr>
                        {/* <tr>
                          <th>Purchase Tax</th>
                          <td>{product.is_tax_exempt}</td>
                        </tr>
                        <tr>
                          <th>Purchase Tax Including</th>
                          <td>{product.is_tax_exempt}</td>
                        </tr> */}
                        <tr>
                          <th>Net Weight lb(s)</th>
                          {/* <input type="hidden" value=""/> */}
                          <td>{product.weight} </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-4">
                    <table className="table-sm table-bordered table">
                      <tbody>
                        {/* <tr>
                          <th>Unit of Measurement</th>
                          <td>PIECES</td>
                        </tr>
                        <tr>
                          <th>HSN Code</th>
                          <td></td>
                        </tr>*/}
                        <tr>
                          <th>Brand</th>
                          <td>{product.manufacturer_names}</td>
                        </tr>
                        {/* <tr>
                          <th>Sub Brand</th>
                          <td></td>
                        </tr> */}
                        <tr>
                          <th>Sales Tax</th>
                          <td>
                            {/* {product.tax_category_id} */}

                            {product.is_tax_exempt == false ? matchTax : "None"}
                          </td>
                        </tr>
                        <tr>
                          <th>Sales Tax Excluding</th>
                          <td>
                            {product.is_tax_exempt == true ? "Yes" : "No"}
                          </td>
                        </tr>
                        {/* <tr>
                          <th>Ingredients</th>
                          <td style={{ wordBreak: "break-all" }}></td>
                        </tr>
                        <tr>
                          <th>Cess</th>
                          <td> No </td>
                        </tr> */}
                        <tr>
                          <th>Created On</th>
                          <td>
                            {new Date(product.created_on_utc).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              },
                            )}
                          </td>
                        </tr>
                        {/* <tr>
                          <th>Created By</th>
                          <td> VW-Mart </td>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-4">
                    <table
                      className="table-sm table-bordered mb-0 table"
                      style={{ display: "none" }}
                    >
                      <tbody>
                        <tr>
                          <th>Nutrition Name</th>
                          <th>Nutrition Value</th>
                        </tr>
                        <tr>
                          <td colSpan={2} className="text-center">
                            Data Not Available
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table-sm table-bordered mt-2 table">
                      <tbody>
                        <tr>
                          <th>Total Qty</th>
                        </tr>
                        <tr>
                          <td className="text-info font-weight-bold">
                            {product.stock_quantity}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "product_ledger" && (
            <div className="product-ledger-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Voucher Type</th>
                    <th>Invoice No</th>
                    <th>Price</th>
                    <th>In Qty</th>
                    <th>Out Qty</th>
                    <th>Created by</th>
                    <th>Created On</th>
                    <th>Closing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="pricing-table">
              <table
                className="table-sm table-bordered mb-0 table"
                id="pricing-details-table"
              >
                <thead>
                  {/* Main table headers */}
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th colSpan={3} className="price-bg text-center">
                      Selling
                    </th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Item Code/Barcode</th>
                    <th>Purchase Price</th>
                    <th>Landing Cost</th>
                    <th>MRP</th>
                    <th className="price-bgg">Discount</th>
                    <th className="price-bgg">Price</th>
                    <th className="price-bgg">Margin</th>
                    <th>Minimum Qty</th>
                    <th>Batch Price with Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Main product row */}
                  <tr>
                    <td>{product.sku}</td>
                    <td>{product.product_cost}</td>
                    <td>{product.price}</td>
                    <td>{product.old_price}</td>
                    <td className="price-bggg">
                      <i
                        className="fa fa-inr currency_style"
                        aria-hidden="true"
                      ></i>
                    </td>
                    <td className="price-bggg">{product.price}</td>
                    <td className="price-bggg">
                      <i
                        className="fa fa-inr currency_style"
                        aria-hidden="true"
                      ></i>
                    </td>
                    <td>{product.order_minimum_quantity}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={toggleBatchVisibility} // Attach the toggle function
                        aria-expanded={isBatchVisible} // Accessibility
                        aria-controls="batchCollapse"
                      >
                        Batch
                        {/* <i className="fas fa-caret-down ml-1"></i> */}
                      </button>
                    </td>
                  </tr>

                  {/* Batch details row */}

                  <tr>
                    <td colSpan={12}>
                      {isBatchVisible && (
                        <div className="multi-collapse" id="batchCollapse">
                          <table className="table-sm table-bordered mb-0 table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Created Date</th>
                                <th>Batch Details</th>
                                <th>Purchase Price</th>
                                <th>Landing Cost</th>
                                <th>MRP</th>
                                <th>Discount</th>
                                <th>Selling Price</th>
                                <th className="m--hide">Normal Margin</th>
                                <th className="m--hide">
                                  Normal Selling Price
                                </th>
                                <th className="m--hide">Membership Margin</th>
                                <th className="m--hide">
                                  Membership Selling Price
                                </th>
                                <th>Margin</th>
                                <th>Qty</th>
                                <th>Batch Disable</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Batch data */}
                              <tr
                                data-isexpirymanage="0"
                                data-expirationdate=""
                              >
                                <td>1</td>
                                <td>{created_on_utc}</td>
                                <td id="batch_no">Batch No: {product.sku}</td>
                                <td>{product.product_cost}</td>
                                <td>{product.price}</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm text-focus"
                                    id="mrp"
                                    name="mrp"
                                    value={product.old_price}
                                  />
                                </td>
                                <td id="discount">
                                  <i
                                    className="fa fa-inr currency_style"
                                    aria-hidden="true"
                                  ></i>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm text-focus"
                                    id="sellingprice"
                                    placeholder="Price"
                                    value={product.price}
                                  />
                                </td>
                                <td className="m--hide">
                                  <i
                                    className="fa fa-inr currency_style"
                                    aria-hidden="true"
                                  ></i>
                                  0
                                </td>
                                <td className="m--hide">0</td>
                                <td className="m--hide">
                                  0.00
                                  <i
                                    className="fa fa-percent"
                                    aria-hidden="true"
                                  ></i>
                                </td>
                                <td className="m--hide">0.00</td>
                                <td>
                                  <i
                                    className="fa fa-inr currency_style"
                                    aria-hidden="true"
                                  ></i>
                                  {product.stock_quantity}
                                </td>
                                <td>0.00</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                      ;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "multi_barcode" && (
            <div className="multi-barcode">
              <table
                className="table-sm table-bordered mb-0 table"
                id="multibarcode_table"
              >
                <thead>
                  <tr>
                    <th style={{ width: "5px" }}>#</th>
                    <th style={{ width: "170px" }}>Variant</th>
                  </tr>
                </thead>
                <tbody data-barcode-list="">
                  <tr data-barcode-item="21256730">
                    <td style={{ width: "5px" }}>
                      <span data-item-index="">1</span>
                    </td>
                    <td style={{ width: "150px" }} colSpan={2}>
                      {product.name}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ width: "45%" }}>
                      <table
                        id="barcodeListTable"
                        className="table-sm table-bordered mb-0 table"
                      >
                        <thead>
                          <tr>
                            <th>ItemCode</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody id="barcodeListTbody">
                          <tr id={product.sku}>
                            <td>{product.sku}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-10">
                            <div className="m--font-bolder form-group mb-0 text-right">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="sku"
                                name="sku"
                                placeholder="ItemCode"
                                value={product.sku}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="m--font-bolder form-group mb-0 text-center">
                              <button
                                onClick={handleUpdate}
                                className="btn btn-sm btn-primary"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "stock_details" && (
            <div className="Stock-Details">
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Location</label>
                    <div className="input-group">
                      <select
                        className="multiselect"
                        name="branchlist"
                        id="branchlist"
                        value={selectedWarehouse}
                        onChange={handleSelectionChange}
                      >
                        <option value="">Select Warehouse</option>
                        {warehouses.map((warehouse: any) => (
                          <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="locationWiseReport_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
              >
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="table-sm table-striped table-bordered table-hover table-checkable no-footer dataTable dtr-inline mb-0 table"
                      id="locationWiseReport"
                      role="grid"
                      aria-describedby="locationWiseReport_info"
                      style={{ width: "1097px" }}
                    >
                      <thead>
                        <tr role="row">
                          <th
                            className="sorting_asc"
                            tabIndex={0}
                            aria-controls="locationWiseReport"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="#"
                            // style={{ width: '82.1px' }}
                          >
                            #
                          </th>
                          <th
                            className="sorting_disabled"
                            tabIndex={0}
                            aria-controls="locationWiseReport"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Item Code"
                            // style={{ width: '285.1px' }}
                          >
                            Item Code
                          </th>
                          <th
                            className="sorting_disabled"
                            tabIndex={0}
                            aria-controls="locationWiseReport"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Variant Name"
                            // style={{ width: '180.1px' }}
                          >
                            Variant Name
                          </th>
                          <th
                            className="sorting_disabled"
                            tabIndex={0}
                            aria-controls="locationWiseReport"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Location"
                            //style={{ width: '213.1px' }}
                          >
                            Location
                          </th>
                          <th
                            className="sorting_disabled"
                            tabIndex={0}
                            aria-controls="locationWiseReport"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Available Qty"
                            // style={{ width: '217.1px' }}
                          >
                            Available Qty
                            <i
                              data-toggle="m-tooltip"
                              data-width="auto"
                              className="m-form__heading-help-icon flaticon-info"
                              title=""
                              data-original-title="Available Qty excluding negative quantity"
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isNaN(availableQty) || availableQty === null ? (
                          <tr role="row" className="odd">
                            <td colSpan={5}>No Data Found</td>
                          </tr>
                        ) : (
                          <tr role="row" className="odd">
                            <td className="sorting_1" tabIndex={0}>
                              1
                            </td>
                            <td>{product.sku}</td>
                            <td></td>
                            <td>{selectedWarehousename}</td>
                            <td>{availableQty}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-5">
                    <div
                      className="dataTables_info"
                      id="locationWiseReport_info"
                      role="status"
                      aria-live="polite"
                    >
                      Showing 1 to 1 of 1 entries
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProductDetails;
