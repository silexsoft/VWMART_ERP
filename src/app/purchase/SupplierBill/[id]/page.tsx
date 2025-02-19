"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  AccordionButton,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Tab,
  Tabs,
} from "react-bootstrap";
import TableGeneric from "@/components/Tables/TableGeneric";

const productDetailColumns = [
  {
    width: "150px",
    label: "Item Code/Barcode",
    field: "itemCode",
  },
  {
    width: "200px",
    label: "Product",
    field: "product",
    renderCell: (value: any, row: any) => {
      return (
        <span
          className="cursor-pointer font-semibold text-primary"
          // onClick={() => router.push(`/Bank/expense/${row.id}`)}
        >
          {value}
        </span>
      );
    },
  },
  {
    width: "100px",
    label: "Qty",
    field: "quantity",
  },
  {
    width: "100px",
    label: "Free Qty",
    field: "freeQuantity",
  },
  {
    width: "120px",
    label: "Unit Cost",
    field: "unitCost",
  },
  {
    width: "120px",
    label: "MRP",
    field: "mrp",
  },
  {
    width: "150px",
    label: "Selling Price",
    field: "sellingPrice",
  },
  {
    width: "100px",
    label: "Pur. Dis1",
    field: "purchaseDiscount1",
  },
  {
    width: "100px",
    label: "Pur. Dis2",
    field: "purchaseDiscount2",
  },
  {
    width: "100px",
    label: "Taxable",
    field: "taxable",
  },
  {
    width: "100px",
    label: "Tax",
    field: "tax",
  },
  {
    width: "150px",
    label: "Landing Cost",
    field: "landingCost",
  },
  {
    width: "150px",
    label: "Margin(%)",
    field: "marginPercentage",
  },
  {
    width: "150px",
    label: "Total",
    field: "total",
  },
];

const dataPrdtDetails = [
  {
    itemCode: "123456",
    product: "Product A",
    quantity: 10,
    freeQuantity: 2,
    unitCost: 50,
    mrp: 70,
    sellingPrice: 65,
    purchaseDiscount1: 5,
    purchaseDiscount2: 2,
    taxable: "Yes",
    tax: 6,
    landingCost: 54,
    marginPercentage: 20,
    total: 650,
  },
  {
    itemCode: "789012",
    product: "Product B",
    quantity: 5,
    freeQuantity: 1,
    unitCost: 100,
    mrp: 150,
    sellingPrice: 140,
    purchaseDiscount1: 10,
    purchaseDiscount2: 5,
    taxable: "No",
    tax: 0,
    landingCost: 85,
    marginPercentage: 25,
    total: 700,
  },
];

const returnProductColumns = [
  {
    width: "150px",
    label: "Item Code/Barcode",
    field: "itemCode",
  },
  {
    width: "200px",
    label: "Product Name",
    field: "product",
    renderCell: (value: any, row: any) => {
      return (
        <span
          className="cursor-pointer font-semibold text-primary"
          // onClick={() => router.push(`/Bank/expense/${row.id}`)}
        >
          {value}
        </span>
      );
    },
  },
  {
    width: "100px",
    label: "Batch",
    field: "batch",
  },
  {
    width: "100px",
    label: "Qty",
    field: "quantity",
  },
  {
    width: "120px",
    label: "Unit Cost",
    field: "unitCost",
  },
  {
    width: "100px",
    label: "Taxable",
    field: "taxable",
  },
  {
    width: "100px",
    label: "Tax",
    field: "tax",
  },
  {
    width: "150px",
    label: "Landing Cost",
    field: "landingCost",
  },
  {
    width: "150px",
    label: "Total",
    field: "total",
  },
];

const paymentColumns = [
  {
    width: "150px",
    label: "Payment No.",
    field: "payment_no",
    renderCell: (value: any, row: any) => {
      return (
        <span
          className="cursor-pointer font-semibold text-primary"
          onClick={() => {}}
        >
          {value}
        </span>
      );
    },
  },
  {
    width: "150px",
    label: "Date",
    field: "date",
  },
  {
    width: "150px",
    label: "Payment Mode",
    field: "payment_mode",
  },
  {
    width: "150px",
    label: "Amount",
    field: "amount",
  },
  {
    width: "150px",
    label: "Action",
    field: "action",
    renderCell: (value: any, row: any) => {
      return (
        <button className="btn btn-primary">
          <i className="fa fa-edit"></i>
        </button>
      );
    },
  },
];

const additionalChargeColumns = [
  {
    width: "150px",
    label: "#",
    field: "serial",
  },
  {
    width: "150px",
    label: "Additional Charge",
    field: "additional_charge",
  },
  {
    width: "150px",
    label: "Value",
    field: "value",
  },
  {
    width: "150px",
    label: "Tax",
    field: "tax",
  },
  {
    width: "150px",
    label: "Total",
    field: "total",
  },
];

export default function Page() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const customFooter = (
    <>
      <tfoot>
        <tr className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm font-bold text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm font-bold text-black dark:text-white">
            Total
          </td>
          <td className="bold px-4 py-2 text-sm font-bold text-black dark:text-white">
            0
          </td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm font-bold text-black dark:text-white">
            {" "}
            1022.22
          </td>
        </tr>
      </tfoot>
    </>
  );
  const additionalChargeFooter = (
    <>
      <tfoot>
        <tr className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
          <td className="px-4 py-2 text-sm font-bold text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm font-bold text-black dark:text-white"></td>
          <td className="bold px-4 py-2 text-sm font-bold text-black dark:text-white"></td>
          <td className="px-4 py-2 text-sm font-bold text-black dark:text-white">
            Total
          </td>
          <td className="px-4 py-2 text-sm font-bold text-black dark:text-white">
            1022.22
          </td>
        </tr>
      </tfoot>
    </>
  );
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Bill No"
        links={[{ label: "Supplier Bill", route: "/purchase/SupplierBill" }]}
      />
      <div className="bill_detail_page common_page_layout SupplierBill-new-page">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="m-portlet">
              <div className="d-flex justify-content-between">
                <div className="m-portlet__head-caption">
                  <span className="badge badge-lg badge-success">Paid</span>
                </div>
                <div className="m-portlet__head-tools">
                  <ul className="m-portlet__nav d-flex gap-2">
                    <li className="m-portlet__nav-item pr-0 ">
                      {/*begin: Dropdown*/}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-info m-btn m-btn--icon m-btn--icon-only"
                          title="File Upload"
                        >
                          <i className="fa fa-upload" />
                        </button>
                        <button
                          className="btn btn-success m-btn m-btn--icon m-btn--icon-only"
                          title=""
                        >
                          <i className="fa fa-barcode" />
                        </button>
                      </div>
                      {/*end: Dropdown*/}
                    </li>
                    <li className="m-portlet__nav-item pr-0 ">
                      <button className="btn btn-metal m-btn m-btn--icon m-btn--icon-only">
                        <i className="fa fa-print" />
                      </button>
                    </li>
                    <li className="m-portlet__nav-item pr-0">
                      <button className="btn btn-success m-btn m-btn--icon m-btn--icon-only">
                        <i className="fa fa-file-excel" />
                      </button>
                    </li>
                    <li className="m-portlet__nav-item pr-0">
                      <a
                        href="/purchase/bill/1312613/pdf"
                        target="_blank"
                        className="btn btn-danger m-btn m-btn--icon m-btn--icon-only"
                        data-skin="dark"
                        data-toggle="m-tooltip"
                        data-placement="top"
                        title=""
                        data-original-title="PDF"
                      >
                        <i className="fa fa-file-pdf" />
                      </a>
                    </li>
                    <li className="m-portlet__nav-item pr-0">
                      <a
                        href="/purchase/bill/1312613/ackno/pdf"
                        target="_blank"
                        className="btn btn-warning m-btn m-btn--icon m-btn--icon-only"
                        data-skin="dark"
                        data-toggle="m-tooltip"
                        data-placement="top"
                        title=""
                        data-original-title="Acknowledgment PDF"
                      >
                        <i className="fa fa-file-pdf" />
                      </a>
                    </li>
                    <li className="m-portlet__nav-item pr-0">
                      {/*begin: Dropdown*/}
                      {/* <Dropdown
                           isOpen={dropdownOpen}
                           toggle={toggleDropdown}
                           //    direction={'dow'}
                         >
                           <DropdownToggle>Dropdown</DropdownToggle>
                           <DropdownMenu>kkkk</DropdownMenu>
                         </Dropdown> */}
                      <div
                        className="m-dropdown m-dropdown--inline  m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push"
                        m-dropdown-toggle="hover"
                        aria-expanded="true"
                      >
                        <a
                          href="#"
                          className="m-portlet__nav-link m-dropdown__toggle btn btn-primary m-btn m-btn--icon m-btn--icon-only"
                        >
                          <i className="la la-ellipsis-h" />
                        </a>
                        <div className="m-dropdown__wrapper">
                          <span className="m-dropdown__arrow m-dropdown__arrow--left m-dropdown__arrow--adjust" />
                          <div className="m-dropdown__inner">
                            <div className="m-dropdown__body">
                              <div className="m-dropdown__content">
                                <ul className="m-nav">
                                  <li className="m-nav__section m-nav__section--first">
                                    <span className="m-nav__section-text">
                                      Quick Actions
                                    </span>
                                  </li>
                                  <li className="m-nav__item">
                                    <form
                                      action="/stocktransfer/new"
                                      method="post"
                                      id="stocktransfer_form"
                                    >
                                      <input
                                        type="hidden"
                                        name="purchaseId"
                                        defaultValue={1312613}
                                      />
                                      <input
                                        type="hidden"
                                        name="flatDiscountTrasaction"
                                        defaultValue={0.0}
                                      />
                                      <input
                                        type="hidden"
                                        name="_csrf"
                                        defaultValue="df7d8e7e-b895-41d9-9e09-b4d8d7b2705f"
                                      />
                                    </form>{" "}
                                    <a
                                      id="stocktransfer_link"
                                      className="m-nav__link"
                                      href="#"
                                    >
                                      {" "}
                                      <i className="m-nav__link-icon fa fa-credit-card" />{" "}
                                      <span className="m-nav__link-text">
                                        Generate Stock Transfer
                                      </span>
                                    </a>
                                  </li>
                                  {/* type : PURCHASE ORDER */}
                                  {/* type : PURCHASE ORDER */}
                                  <li className="m-nav__item"></li>
                                  <li className="m-nav__separator m-nav__separator--fit"></li>
                                  <li className="m-nav__item"></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      {/*end: Dropdown*/}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="m-portlet__body card-body-sm">
                <div className="row">
                  <div className="col-md-4">
                    <div className="table-responsive">
                      <table className="table-sm m-table table-bordered table">
                        <tbody>
                          <tr>
                            <th>Supplier</th>
                            <td>
                              <a
                                href="/contact/suppliers/6324506"
                                className="m-link m--font-boldest"
                                target="_blank"
                              >
                                VANYA ENTERPRISES 1860
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <th>Billing Address</th>
                            <td>
                              <h5 className="">
                                <small
                                  className="text-muted"
                                  data-address-name=""
                                ></small>
                              </h5>
                              <h5 className="">
                                <small
                                  className="text-muted"
                                  data-address-company-name=""
                                >
                                  VANYA ENTERPRISES 1860
                                </small>
                              </h5>
                              <p className="mb-0">
                                <span data-address-line-1="">
                                  NEAR SHIV MANDIR,00,MIRZAPUR ,MIRZAPUR
                                  PACHPEDWA GORAKHPUR 273015 Gorakhpur Uttar
                                  Pradesh India
                                </span>
                              </p>
                              <p className="mb-0">
                                <span className="">
                                  <i className="la la-phone align-middle" />{" "}
                                  <span className="" data-address-phoneno="">
                                    9140719834
                                  </span>{" "}
                                </span>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <th>GSTIN</th>
                            <td>
                              <span>09ALVPP3885C1ZF</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="table-responsive">
                      <table className="table-sm m-table table-bordered table">
                        <tbody>
                          <tr>
                            <th>Supplier BillDate</th>
                            <td>14/10/2024</td>
                          </tr>
                          <tr>
                            <th>Supplier Bill No</th>
                            <td>BIL369</td>
                          </tr>
                          <tr>
                            <th>Payment Term</th>
                            <td>N/A</td>
                          </tr>
                          <tr>
                            <th>Reverse Charge</th>
                            <td>No</td>
                          </tr>
                          <tr>
                            <th>Tax type</th>
                            <td>taxdefault</td>
                          </tr>
                          <tr>
                            <th>Invoice Amount</th>
                            <td>0.0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="table-responsive">
                      <table className="table-sm m-table table-bordered table">
                        <tbody>
                          <tr>
                            <th className="text-danger">Due Amount</th>
                            <th className="text-danger">0.00</th>
                          </tr>
                          <tr>
                            <th className="text-success">Paid Amount</th>
                            <th className="text-success">
                              1,023.00
                              <i
                                className="fa fa-info-circle tdstooltip m--hide"
                                data-toggle="tooltip"
                                data-placement="right"
                                title=""
                                aria-hidden="true"
                                data-original-title="Inclusive of TDS."
                              />
                            </th>
                          </tr>
                          <tr>
                            <th className="text-primary">Total Amount</th>
                            <th className="text-primary">1,023.00</th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="table-responsive">
                      <table className="table-sm m-table table-bordered table">
                        <tbody>
                          <tr>
                            <th>Reference Bill No</th>
                            <td>BIL369</td>
                          </tr>
                          <tr>
                            <th>Material Inward No</th>
                            <td>MI373</td>
                          </tr>
                          <tr>
                            <th>Due Date</th>
                            <td>15/10/2024</td>
                          </tr>
                          <tr>
                            <th>Shipping Date</th>
                            <td>14/10/2024</td>
                          </tr>
                          <tr>
                            <th>Export/SEZ</th>
                            <td>No </td>
                          </tr>
                          <tr>
                            <th>Account Ledger</th>
                            <td>Purchase</td>
                          </tr>
                          <tr>
                            <th>Created By</th>
                            <td>VW-GOP-1109</td>
                          </tr>
                          <tr>
                            <th>Created Time</th>
                            <td>14-10-2024 15:29:15</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*end::Portlet*/}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12">
            <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
              <Tab eventKey="product_details" title="Product Details">
                <TableGeneric
                  columns={productDetailColumns}
                  data={dataPrdtDetails}
                  footer={customFooter}
                />
              </Tab>
              <Tab
                eventKey="return_product_details"
                title="Return Product Details"
              >
                <div className="table_generic d-flex flex-column gap-3">
                  <TableGeneric
                    columns={returnProductColumns}
                    data={dataPrdtDetails}
                    footer={customFooter}
                  />

                  <div className="row">
                    <div className="col-lg-8 col-md-8 col-sm-12" />
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <table className="table-sm table-bordered m-table mb-0 table text-right">
                        <tbody>
                          <tr>
                            <th
                              scope="row"
                              className="col-lg-8 col-md-8 col-sm-12"
                            >
                              <h6 className="mb-0">Gross</h6>
                            </th>
                            <td className="col-lg-4 col-md-4 col-sm-12">
                              <h6 className="mb-0" id="return_gross_amount">
                                0
                              </h6>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="col-lg-8 col-md-8 col-sm-12 "
                            >
                              <h6 className="mb-0">Tax Amount</h6>
                            </th>
                            <td className="col-lg-4 col-md-4 col-sm-12">
                              <h6 className="mb-0" id="return_tax_amount">
                                0
                              </h6>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="col-lg-8 col-md-8 col-sm-12 "
                            >
                              <a
                                href="javascript:void(0);"
                                data-toggle="m-popover"
                                data-trigger="click"
                                title=""
                                data-html="true"
                                id="roundoff_edit"
                                data-content=""
                                className="m-link m-link--info m-link--state"
                                data-original-title="Roundoff"
                              >
                                Roundoff
                              </a>
                            </th>
                            <td className="col-lg-4 col-md-4 col-sm-12">
                              <h6 className="mb-0" id="return_round_off">
                                0.0
                              </h6>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="col-lg-8 col-md-8 col-sm-12"
                            >
                              <h4 className="mb-0">Net Amount</h4>
                            </th>
                            <td className="col-lg-4 col-md-4 col-sm-12">
                              <h3 className="mb-0" id="return_net_amount">
                                0
                              </h3>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="payment" title="Payment">
                <TableGeneric
                  columns={paymentColumns}
                  data={dataPrdtDetails}
                  //  footer={customFooter}
                />
              </Tab>
            </Tabs>
          </div>
        </div>

        <div className="row mt-3">
          <div
            className="col-lg-12 col-md-12 col-sm-12"
            id="additional_charge_div"
          >
            <div className="m-portlet__head-title">
              <h3 className="">Additional Charge</h3>
            </div>
            <div className="m-portlet__body card-body-sm">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <TableGeneric
                    columns={additionalChargeColumns}
                    data={[]}
                    footer={additionalChargeFooter}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="m-form__actions  card-body-sm">
              <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12 pt-0">
                      Note
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group ">
                        <textarea
                          className="form-control form-control-sm"
                          name="note"
                          placeholder="Enter Note"
                          rows={3}
                          readOnly={true}
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <table
                    className="table-sm table-bordered m-table table-striped collapse mb-0 table"
                    id="tax_summary_table"
                  >
                    <thead>
                      <tr>
                        <th scope="row" className="col-lg-4 col-md-4 col-sm-12">
                          Tax
                        </th>
                        <th scope="row" className="col-lg-4 col-md-4 col-sm-12">
                          Tax Rate
                        </th>
                        <th scope="row" className="col-lg-4 col-md-4 col-sm-12">
                          Tax Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="m--hide" data-tax-item="template">
                        <td className="col-lg-4 col-md-4 col-sm-12">SGST</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">5 %</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">2500</td>
                      </tr>
                      <tr className="" data-tax-item={65605}>
                        <td className="col-lg-4 col-md-4 col-sm-12">CGST</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">9 %</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">30.50</td>
                      </tr>
                      <tr className="" data-tax-item={65605}>
                        <td className="col-lg-4 col-md-4 col-sm-12">SGST</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">9 %</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">30.50</td>
                      </tr>
                      <tr className="" data-tax-item={65602}>
                        <td className="col-lg-4 col-md-4 col-sm-12">CGST</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">0 %</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">0.00</td>
                      </tr>
                      <tr className="" data-tax-item={65602}>
                        <td className="col-lg-4 col-md-4 col-sm-12">SGST</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">0 %</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <table className="table-bordered table-sm m-table mb-0 table text-right">
                    <tbody>
                      <tr>
                        <th scope="row" className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0">Flat Discount</h6>
                        </th>
                        <td className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0">0.0 %</h6>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0">Gross Amount</h6>
                        </th>
                        <td className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0" id="gross_amount">
                            961.70
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="col-lg-8 col-md-8 col-sm-12">
                          <h6 className="mb-0">Discount</h6>
                        </th>
                        <td className="col-lg-4 col-md-4 col-sm-12">
                          <h6 className="mb-0" id="totalDiscount">
                            0.00
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0">Taxable Amount</h6>
                        </th>
                        <td className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0" id="taxable_amount">
                            961.70
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <th
                          scope="row"
                          className="col-lg-6 col-md-6 col-sm-12 m--font-info"
                        >
                          <a
                            href="#tax_summary_table"
                            data-toggle="collapse"
                            className="m-link m-link--info m-link--state"
                          >
                            Tax
                          </a>
                        </th>
                        <td className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0" id="tax_amount">
                            61.00
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0">Roundoff</h6>
                        </th>
                        <td className="col-lg-6 col-md-6 col-sm-12">
                          <h6 className="mb-0" id="round_off">
                            0.30
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="col-lg-6 col-md-6 col-sm-12">
                          <h4 className="mb-0">Net Amount</h4>
                        </th>
                        <td className="col-lg-6 col-md-6 col-sm-12">
                          <h4 className="mb-0" id="net_amount">
                            1023.00
                          </h4>
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
    </DefaultLayout>
  );
}
