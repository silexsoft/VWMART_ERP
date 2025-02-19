"use client";
import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TableDynamic from "@/components/Tables/TableDynamic";
import * as yup from "yup";
import { Collapse, ModalFooter } from "react-bootstrap";
import { Modal, Button, Alert, Container } from "react-bootstrap";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewCustomerModal from "@/components/NewCustomerModal";
import TableGeneric from "@/components/Tables/TableGeneric";
export default function Page() {
  const [open, setOpen] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showModal, setShowModal] = useState<any>({
    newTerms: false,
    editTerms: false,
    newPaymentTerms: false,
  });
  const [termsAndConditionsNew, setTermConditionsNew] = useState("");
  const [termCondtsEr, setTermsCondtsEr] = useState(false);
  const toggleModal = (type: any) => {
    setShowModal((prev: any) => {
      return { ...prev, [type]: !prev[type] };
    });
  };
  const toggle = () => setOpen(!open);
  const newCustomerToggle = () =>
    setShowNewCustomerModal(!showNewCustomerModal);
  const schema = yup
    .object({
      names: yup
        .array()
        .of(
          yup.object({
            name: yup.string().required("Name is required"),
            account: yup
              .string()
              .required("Account is required")
              .test("required", "Account is required", (value) => value !== ""),
          }),
        )
        .min(1, "At least one row is required"), // To enforce at least one row
    })
    .required();

  const additionalRows = [
    { name: "John", role: "Admin" },
    { name: "Jane", role: "User" },
  ];

  const additonalChargeSchema = yup
    .object({
      names: yup
        .array()
        .of(
          yup.object({
            name: yup.string().required("Name is required"),
            account: yup
              .string()
              .required("Account is required")
              .test("required", "Account is required", (value) => value !== ""),
          }),
        )
        .min(1, "At least one row is required"), // To enforce at least one row
    })
    .required();
  const additionChargesColumns = [
    { label: "#", type: "serial" },
    {
      label: "Additional Charge",
      type: "input",
      name: "additional_charge",
      required: true,
    },
    { label: "Value", type: "input", name: "value", required: true },
    {
      label: "Tax",
      type: "select",
      name: "tax",
      options: ["GST 1", "GST 2"],
    },
    {
      label: "Total",
      type: "input",
      name: "total",
    },
  ];

  const returnProductColumns = [
    {
      width: "150px",
      label: "Item Code/Barcode*",
      field: "item_code_barcode",
    },
    {
      width: "150px",
      label: "Product Name",
      field: "product_name",
    },
    {
      width: "100px",
      label: "Batch",
      field: "batch",
    },
    {
      width: "100px",
      label: "Qty*",
      field: "qty",
    },
    {
      width: "100px",
      label: "Unit Cost",
      field: "unit_cost",
    },
    {
      width: "100px",
      label: "Disc1*",
      field: "disc1",
    },
    {
      width: "100px",
      label: "Disc2*",
      field: "disc2",
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
      field: "landing_cost",
    },
    {
      width: "100px",
      label: "Total*",
      field: "total",
    },
  ];

  const columns = [
    {
      width: "150px",
      label: "Item Code/Barcode*",
      field: "item_code_barcode",
    },
    {
      width: "150px",
      label: "Product Name",
      field: "product_name",
    },
    {
      width: "100px",
      label: "Batch",
      field: "batch",
    },
    {
      width: "100px",
      label: "Qty*",
      field: "qty",
    },
    {
      width: "100px",
      label: "Unit Cost",
      field: "unit_cost",
    },
    {
      width: "100px",
      label: "Disc1*",
      field: "disc1",
    },
    {
      width: "100px",
      label: "Disc2*",
      field: "disc2",
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
      field: "landing_cost",
    },
    {
      width: "100px",
      label: "Total*",
      field: "total",
    },
  ];

  const rows = [
    { name: "John", role: "Admin" },
    { name: "Jane", role: "User" },
  ];

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  const handleTermConditionSubmit = () => {
    if (!termsAndConditionsNew) {
      setTermsCondtsEr(true);
      return;
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="New Supplier Bill"
        links={[{ label: "Supplier Bill", route: "/purchase/bill" }]}
      />
      <div className="common_page_layout SupplierBill-new-page">
        <div className="deliverychallan_new page_new">
          <div className="row mb-5">
            <div className="col-lg-4 col-md-4 col-sm-12 ">
              <div className="row">
                {/* <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="form-group row p-0">
                  <label className="col-lg-12 col-md-12 col-sm-12">
                    Select Customer
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div
                    className="col-lg-12 col-md-12 col-sm-12"
                    data-select2-id={48}
                  >
                    <div className="input-group">
                      <select
                        className="form-control form-control-sm m-100px select2-hidden-accessible"
                        id="contactVo"
                        name="contactVo.contactId"
                        data-select2-id="contactVo"
                        tabIndex={-1}
                        aria-hidden="true"
                        data-fv-field="contactVo.contactId"
                      >
                        <option value="">Select Customer</option>
                      </select>

                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-metal"
                          type="button"
                          onClick={newCustomerToggle}
                        >
                          <i className="fa fa-plus" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
                <div className="col-md-12" data-select2-id={90}>
                  <div className="form-group row" data-select2-id={89}>
                    <label className="col-md-12">
                      Select Supplier
                      <small
                        style={{ fontSize: "1.25rem", color: "red" }}
                        className="text-danger"
                      >
                        *
                      </small>
                    </label>
                    <div className="col-md-12" data-select2-id={88}>
                      <div className="input-group" data-select2-id={87}>
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="contactVo"
                          name="contactVo.contactId"
                          data-select2-id="contactVo"
                        >
                          <option value="">Select Supplier</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12">
                  <label className="col-lg-12 col-md-12 col-sm-12 p-0">
                    Place of Supply: <span id="lblPlaceofSupply">-</span>
                  </label>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="m-section m--margin-bottom-15">
                    <label>Billing Address</label>
                    <h5 className="mb-0">
                      <small
                        className="text-muted d-block mb-2"
                        data-address-message=""
                      >
                        Billing Address is Not Provided
                      </small>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Supplier Bill Date
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group date">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="salesDate"
                          id="salesDate"
                          data-date-format="dd/mm/yyyy"
                          data-date-start-date="01/04/2024"
                          data-date-end-date="31/03/2025"
                          data-fv-field="salesDate"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Reference Bill No.
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 m-form__group-sub">
                      <input
                        type="text"
                        readOnly={true}
                        className="form-control form-control-sm"
                        name="prefix"
                        defaultValue="CRD"
                        data-fv-field="prefix"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Supplier Bill No.
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 m-form__group-sub">
                      <input
                        type="text"
                        readOnly={true}
                        className="form-control form-control-sm"
                        name="prefix"
                        defaultValue="CRD"
                        data-fv-field="prefix"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-4 col-md-4 col-sm-12"
                  data-select2-id={123}
                >
                  <div className="form-group row" data-select2-id={122}>
                    <label className="col-md-12">
                      Select Material Inward No.
                    </label>
                    <div className="col-md-12" data-select2-id={121}>
                      <div className="input-group " data-select2-id={120}>
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="materialInwardIds"
                          name="materialInwardIds"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <option value="" data-select2-id={124}>
                            Select Material Inward
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row p-0">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Payment Term
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <select
                          className="form-control form-control-sm m-select2 select2-hidden-accessible"
                          id="salesId"
                          name="salesVo.salesId"
                          data-select2-id="salesId"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <option value="">Select Payment Term</option>
                          <option value="90">90 Days</option>
                          <option value="60">60 Days</option>
                          <option value="30">30 Days</option>
                          <option value="15">15 days</option>
                          <option value="7">7 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Due Date
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group date">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="dueDate"
                          data-date-format="dd/mm/yyyy"
                          data-date-start-date="01/04/2024"
                          data-date-end-date="31/03/2025"
                          id="dueDate"
                          data-fv-field="dueDate"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Reverse Charge
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <select
                        className="form-control form-control-sm"
                        name="reverseCharge"
                        id="reverseCharge"
                        data-fv-field="reverseCharge"
                      >
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Shipping Date
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group date">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="salesDate"
                          id="salesDate"
                          data-date-format="dd/mm/yyyy"
                          data-date-start-date="01/04/2024"
                          data-date-end-date="31/03/2025"
                          data-fv-field="salesDate"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Tax Type
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <select
                        className="form-control form-control-sm m-select2 select2-hidden-accessible"
                        id="taxType"
                        name="taxType"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <option value="">Select Tax Type</option>
                        <option value="default">Default</option>
                        <option value="inclusive">Tax Inclusive</option>
                        <option value="exclusive">Tax Exclusive</option>
                        <option value="out_of_scope">Out of Scope</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* if parentid is empty so that means this sales is standalone */}
                {/* if parentid is empty so that means this sales is standalone */}

                <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
                  <div className="form-group row">
                    {/* <label class="col-lg-12 col-sm-12">&nbsp;</label> */}
                    <div className="col">
                      <div className="m-checkbox-inline">
                        <label className="m-checkbox m-checkbox--solid m-checkbox--brand">
                          <input
                            type="checkbox"
                            name="sez"
                            id="sez"
                            defaultValue={0}
                          />
                          Export/SEZ
                          <span />
                        </label>
                        <i
                          data-toggle="m-tooltip"
                          data-width="auto"
                          className="m-form__heading-help-icon flaticon-info"
                          title=""
                          data-original-title="If different than the corresponding address"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 ">
                  <div className="form-group row">
                    <label className="col-md-12">Invoice Amount</label>
                    <div className="col-md-12">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="invoiceAmount"
                        name="invoiceAmount"
                        defaultValue={0}
                        data-fv-field="invoiceAmount"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Select Account Ledger
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="accountCustomId"
                          name="accountCustomId"
                          tabIndex={-1}
                        >
                          <option value="">Select AccountLedger</option>
                          <option value={1688945} data-select2-id={11}>
                            Purchase
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <button className="btn btn-primary float-right">
                <i className="fa fa-upload mr-1"></i>Upload Products
              </button>
              <Tabs
                defaultActiveKey="product_details"
                id="uncontrolled-tab-example"
                // className="mb-3"
              >
                <Tab eventKey="product_details" title="Product Details">
                  <div className="row" id="productdetails-portlet">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="table-responsive">
                        <TableGeneric columns={columns} data={[]} />
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="return_product_details"
                  title="Return Product Details"
                >
                  <div className="d-flex flex-column gap-3">
                    <TableGeneric columns={returnProductColumns} data={[]} />
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
                            <tr className="m--hide">
                              <th
                                scope="row"
                                className="col-lg-8 col-md-8 col-sm-12"
                              >
                                <h6 className="mb-0">Total Amount</h6>
                              </th>
                              <td className="col-lg-4 col-md-4 col-sm-12">
                                <h6 className="mb-0" id="return_total_amount">
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
                                  tabIndex={-1}
                                  href="javascript:void(0);"
                                  data-toggle="m-popover"
                                  data-trigger="click"
                                  title=""
                                  data-html="true"
                                  id="roundoff_edit_return"
                                  className="m-link m-link--info m-link--state"
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
                                <h4 className="mb-0" id="return_net_amount">
                                  0
                                </h4>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
          <div className="additional_content mb-5">
            {!open && (
              <button onClick={toggle} className="mb-2">
                <i className="fa fa-circle-plus"></i> Add Additional Charges
              </button>
            )}
            <Collapse in={open}>
              <div style={{ visibility: "visible" }}>
                <div>
                  {open && (
                    <button type="button" onClick={toggle}>
                      <i className="fa fa-times-circle"></i>
                    </button>
                  )}
                  <TableDynamic
                    columns={additionChargesColumns}
                    schema={additonalChargeSchema}
                    rows={additionalRows}
                    onSubmit={onSubmit}
                  />
                </div>
              </div>
            </Collapse>
          </div>
          <div className="row foot_table">
            <div className="col-lg-4 col-md-4 col-sm-12">
              <table className="table-sm table-bordered table-striped mb-0 table text-right">
                <tbody>
                  <tr className="border-bottom">
                    <th>Flat Discount</th>
                    <td className="mb-0">
                      <div className="d-flex justify-content-end input-group">
                        <input
                          type="text"
                          id="flatDiscount"
                          name="flatDiscount"
                          className="form-control form-control-sm rounded-0 col-3 text-right"
                          placeholder="Flat Discount"
                          defaultValue={0}
                          data-fv-field="flatDiscount"
                        />
                        <button
                          id="btn_percentage_flat_discount"
                          className="btn btn-sm btn-primary"
                        >
                          <i className="fa fa-percent" aria-hidden="true" />
                        </button>
                        <button
                          id="btn_amount_flat_discount"
                          className="btn btn-sm btn-primary m--hide"
                        >
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Gross Amount</th>
                    <td>
                      <h6 className="m--hide mb-0" id="total_amount">
                        0
                      </h6>
                      <h6 className="mb-0" id="total_amount1">
                        0
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>Discount</th>
                    <td>
                      <h6 className="mb-0" id="discount_amount">
                        0
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <a>Taxable Amount</a>
                    </th>
                    <td>
                      <h6 className="mb-0" id="gross_amount">
                        0
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <a
                        className="m--font-info"
                        href="#tax_summary_table"
                        data-toggle="collapse"
                      >
                        Tax Amount
                      </a>
                    </th>
                    <td>
                      <h6 className="mb-0" id="tax_amount">
                        0
                      </h6>
                    </td>
                  </tr>
                  <tr className="tcsdiv m--hide">
                    <th>TCS</th>
                    <td className="mb-0">
                      <div className="d-flex justify-content-end">
                        <input
                          type="hidden"
                          id="tcsAmount"
                          name="tcsAmount"
                          defaultValue={0}
                        />
                        <input
                          type="hidden"
                          id="tcsType"
                          name="tcsType"
                          defaultValue="percentage"
                        />
                        <input
                          type="text"
                          id="tcsRate"
                          name="tcsRate"
                          className="form-control form-control-sm rounded-0 col-3 text-right"
                          defaultValue={0}
                          placeholder="TCS Percentage"
                        />
                        <button className="btn btn-sm btn-primary">%</button>
                        <h6
                          className="mb-0"
                          style={{
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            marginTop: 10,
                            marginLeft: 10,
                          }}
                        >
                          TCS Amount :{" "}
                          <span
                            className="mb-0"
                            style={{ fontSize: 12 }}
                            id="tcs_amount"
                          >
                            0
                          </span>
                        </h6>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <a
                        href="javascript:void(0);"
                        data-toggle="m-popover"
                        data-trigger="click"
                        title=""
                        data-html="true"
                        id="roundoff_edit"
                        className="m-link m-link--info m-link--state"
                        data-original-title="Roundoff"
                      >
                        Roundoff
                      </a>
                    </th>
                    <td>
                      <h6 className="mb-0" id="round_off">
                        0.0
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <h4 className="mb-0 ">Net Amount</h4>
                    </th>
                    <td>
                      <h4 className="mb-0 " id="net_amount">
                        0
                      </h4>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Modals start */}
          <Modal
            show={showModal.newTerms}
            onHide={() => toggleModal("newTerms")}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>New Terms & Conditions</Modal.Title>
            </Modal.Header>
            <Container className="d-flex flex-column mt-3 gap-4">
              <label>
                Terms & Conditions <span className="text-danger">*</span>
              </label>
              <div>
                <textarea
                  className="form-control"
                  rows={3}
                  value={termsAndConditionsNew}
                  onChange={(e) => {
                    setTermConditionsNew(e.target.value),
                      setTermsCondtsEr(false);
                  }}
                />
                {termCondtsEr && (
                  <span className="text-danger">
                    Terms and conditions are required.
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary mb-1 mb-2"
                onClick={handleTermConditionSubmit}
              >
                Submit
              </button>
            </Container>
          </Modal>

          {/* Terms and conditions modal */}
          <Modal
            show={showModal.editTerms}
            onHide={() => toggleModal("editTerms")}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Terms & Conditions</Modal.Title>
            </Modal.Header>
            <Container className="d-flex flex-column mt-3 gap-4"></Container>
          </Modal>

          {/* New payment term modal */}
          <Modal
            show={showModal.newPaymentTerm}
            onHide={() => toggleModal("newPaymentTerm")}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>New Payment Term</Modal.Title>
            </Modal.Header>
            <Container className="d-flex flex-column mt-3 gap-4">
              <form id="paymentTermForm" className="fv-form fv-form-bootstrap">
                <div className="form-group">
                  <label htmlFor="recipient-name">
                    Payment Term Name
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="paymentTermName"
                    className="form-control form-control-sm"
                    id="paymentTermName"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message-text">
                    Payment Term Day
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="paymentTermDay"
                    id="paymentTermDay"
                  />
                </div>
                <ModalFooter>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary new-custom-btn"
                    id="canecl_PaymentTermBtn"
                    onClick={() => toggleModal("newPaymentTerm")}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    id="savePaymentTermBtn"
                    className="btn btn-sm btn-primary new-custom-btn"
                  >
                    Save
                  </button>
                </ModalFooter>
              </form>
            </Container>
          </Modal>

          {/* new customer modal */}
          <NewCustomerModal
            show={showNewCustomerModal}
            toggle={newCustomerToggle}
          />
        </div>
      </div>
      {/* Modals end */}
    </DefaultLayout>
  );
}
