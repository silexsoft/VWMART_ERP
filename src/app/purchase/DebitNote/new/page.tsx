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
      label: "Product Name*",
      field: "product_name",
    },
    {
      width: "100px",
      label: "Batch*",
      field: "batch",
      required: true,
    },
    {
      width: "100px",
      label: "Qty*",
      field: "quantity",
    },
    {
      width: "100px",
      label: "Unit Cost*",
      field: "unit_cost",
    },
    {
      width: "100px",
      label: "MRP*",
      field: "mrp",
    },
    {
      width: "100px",
      label: "Selling Price*",
      field: "selling_price",
    },
    {
      width: "100px",
      label: "Pur. Disc1*",
      field: "purchase_discount_1",
    },
    {
      width: "100px",
      label: "Pur. Disc2*",
      field: "purchase_discount_2",
    },
    {
      width: "100px",
      label: "Tax",
      field: "tax",
    },
    {
      width: "100px",
      label: "Landing Cost",
      field: "landing_cost",
    },
    {
      width: "100px",
      label: "Margin (%)",
      field: "margin_percent",
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
        pageName="New Debit Note"
        links={[{ label: "Debit Note", route: "/purchase/debitnote" }]}
      />
      <div className="debitnote_new page_new">
        <div className="row mb-5">
          <div className="col-lg-4 col-md-4 col-sm-12 ">
            <div className="row">
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
                    Debit Note Date
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
                    Debit Note No.
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
                    Reference Bill No.
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
                    Select Purchase
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <select
                      className="form-control form-control-sm m-select2 select2-hidden-accessible"
                      id="taxType"
                      name="taxType"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <option value="">Select Purchase</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="form-group">
                  <label className="col-md-12">&nbsp;</label>
                  <button type="button" className="btn btn-sm btn-info">
                    Display All Items
                  </button>
                </div>
              </div>
              <div className="col-lg-8 col-md-8 col-sm-12">
                <div className="form-group row has-success">
                  <label className="col-md-12">Reason</label>
                  <div className="col-md-12">
                    <input
                      className="form-control form-control-sm"
                      name="reasonDescription"
                      placeholder="Enter a Reason"
                    />
                  </div>
                </div>
              </div>

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
              <Tab eventKey="shipping_details" title="Shipping Details">
                <div className="d-flex flex-column gap-3">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12 pr-0">
                        <div className="row">
                          <div className="form-group col-lg-6 col-md-6 col-sm-12">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Shipping Type
                            </label>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-0 p-0">
                              <div className="input-group">
                                <select
                                  className="form-control m-select2 select2-hidden-accessible"
                                  style={{ width: "100%" }}
                                  id="shippingType"
                                  name="shippingType"
                                  data-select2-id="shippingType"
                                  tabIndex={-1}
                                  aria-hidden="true"
                                >
                                  <option value="">Select Shipping Type</option>
                                  <option value={1}>Delivery</option>
                                  <option value={2}>Pickup</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="form-group col-lg-6 col-md-6 col-sm-12 ">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Shipping Date
                            </label>
                            <div className="input-group date">
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                name="shippingDate"
                                id="shippingDate"
                                placeholder="dd/mm/yyyy"
                              />
                            </div>
                          </div>
                          <div className="form-group col-md-6 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Mode of Transport
                            </label>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-0 p-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="transporterMode"
                                name="transporterMode"
                                placeholder="Mode of Transport"
                                defaultValue=""
                              />
                            </div>
                          </div>
                          <div className="form-group col-md-6 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Transporter Name
                            </label>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-0 p-0">
                              <div className="input-group">
                                <select
                                  className="form-control m-select2 select2-hidden-accessible"
                                  style={{ width: "100%" }}
                                  id="transportContactVo"
                                  name="transportContactVo.contactId"
                                  tabIndex={-1}
                                  aria-hidden="true"
                                >
                                  <option value="" data-select2-id={14}>
                                    Select Transport Name
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 pr-0">
                        <div className="row">
                          <div className="form-group col-lg-6 col-md-6 col-sm-12 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Reference No.
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="referenceNo"
                              name="referenceNo"
                              placeholder="Reference No"
                              defaultValue=""
                            />
                          </div>
                          <div className="form-group col-lg-6 col-md-6 col-sm-12 ">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Transport Date
                            </label>
                            <div className="input-group date">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="transportDate"
                                id="transportDate"
                                data-date-format="dd/mm/yyyy"
                                data-date-start-date="01/04/2024"
                                data-date-end-date="31/03/2025"
                                placeholder="dd/mm/yyyy"
                              />
                            </div>
                          </div>
                          <div className="form-group col-lg-6 col-md-6 col-sm-12 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Vehicle No.
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="vehicleNo"
                              name="vehicleNo"
                              placeholder="Vehicle No"
                              defaultValue=""
                            />
                          </div>
                          <div className="form-group col-lg-6 col-md-6 col-sm-12 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Weight
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="weight"
                              name="weight"
                              placeholder="Weight"
                              defaultValue=""
                            />
                          </div>
                        </div>
                      </div>
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
                  onSubmit={(data: any) => {}}
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
                  setTermConditionsNew(e.target.value), setTermsCondtsEr(false);
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
                  <span style={{ fontSize: "1.25rem" }} className="text-danger">
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
                  <span style={{ fontSize: "1.25rem" }} className="text-danger">
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
      {/* Modals end */}
    </DefaultLayout>
  );
}
