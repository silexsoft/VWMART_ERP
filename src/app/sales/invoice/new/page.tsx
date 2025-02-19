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
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const router = useRouter();
  const { token, logout, warehouseId } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
  }, [token]);

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

  const columns = [
    { label: "#", type: "serial" },
    { label: "Sales Man", type: "input", name: "sales_man" },
    {
      label: "Item Code Total",
      type: "select",
      options: ["Product", "Service"],
      name: "service",
      postScript: '<a href="#">HSN/SAC Code</a>',
    },
    { label: "Product", type: "input", name: "product" },
    { label: "Batch", type: "input", name: "batch" },
    { label: "Qty", type: "input", name: "qty", required: true },
    { label: "Free Qty", type: "input", name: "free_qty", required: true },
    {
      label: "Price",
      type: "select",
      name: "price",
      options: ["0", "5", "10"],
      required: true,
    },
    { label: "Dis1", type: "input", name: "dis1" },
    { label: "Dis2", type: "input", name: "dis2" },
    { label: "Tax", type: "input", name: "tax" },
    { label: "Tax Total", type: "input", name: "tax_total" },
  ];

  const rows = [
    { name: "John", role: "Admin" },
    { name: "Jane", role: "User" },
  ];

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  const onSubmitAdditionalCharges = (data: any) => {
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
        pageName="New Invoice"
        links={[{ label: "Invoice", route: "/sales/invoice" }]}
      />
      <div className="common_page_layout invoice-new-page">
        <div className="invoice_new page_new">
          <div className="row mb-5">
            <div className="col-lg-4 col-md-4 col-sm-12 ">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
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
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="m-section m--margin-bottom-15">
                    <label>Shipping Address</label>
                    {/* <div class="m-divider"><span></span></div> */}
                    <h5 className="mb-0">
                      <small
                        className="text-muted d-block mb-2"
                        data-address-message=""
                      >
                        Shipping Address is Not Provided
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
                      Invoice Date
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
                      Invoice No.
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6 m-form__group-sub">
                      <input
                        type="text"
                        readOnly={true}
                        className="form-control form-control-sm"
                        name="prefix"
                        defaultValue="CRD"
                        data-fv-field="prefix"
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6 m-form__group-sub">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="estimateNo"
                        id="salesNo"
                        defaultValue={1}
                        data-fv-field="salesNo"
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

                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-metal"
                            type="button"
                            onClick={() => toggleModal("newPaymentTerm")}
                          >
                            <i className="fa fa-plus" />
                          </button>
                        </div>
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

                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Create Invoice Form
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="accountCustomId"
                          name="accountCustomId"
                          tabIndex={-1}
                        >
                          <option value="">Select Option</option>
                          <option value="sales_order">Sales Order</option>
                          <option value="delivery_challan">
                            Delivery Challan
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group row">
                    <label className="col-lg-12 col-md-12 col-sm-12">
                      Sales Man
                    </label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <select
                        className="form-control m-select2 select2-hidden-accessible text-left"
                        title="Salesman"
                        style={{
                          width: "auto !important",
                          display: "inline-block",
                          float: "right",
                          marginLeft: 5,
                          maxWidth: 200,
                        }}
                        tabIndex={-1}
                        aria-hidden="true"
                        id="salesManId"
                        data-select2-id="salesManId"
                      >
                        <option value={0} data-select2-id={36}>
                          Select Employee
                        </option>
                        <option value={17833}>RAHUL</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
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

                    <div className="col">
                      <div className="m-checkbox-inline">
                        <label className="m-checkbox m-checkbox--solid m-checkbox--brand">
                          <input
                            type="checkbox"
                            name="paymentReminder"
                            id="paymentReminder"
                            defaultValue={0}
                          />
                          Payment Reminder <span />
                        </label>
                        <i
                          data-toggle="m-tooltip"
                          data-width="auto"
                          className="m-form__heading-help-icon flaticon-info"
                          title=""
                          data-original-title="If you Want to remove Payment Reminder Then uncheck "
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
                          data-select2-id="accountCustomId"
                          tabIndex={-1}
                          aria-hidden="true"
                          data-fv-field="accountCustomId"
                        >
                          <option value="">Select AccountLedger</option>
                          <option value={1688944} data-select2-id={4}>
                            Sales Return
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
                        <TableDynamic
                          columns={columns}
                          rows={rows}
                          onSubmit={onSubmit}
                          schema={schema}
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="terms_and_conditions"
                  title="Terms & Conditions/Note"
                >
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12 p-0">
                        <table
                          className="table-sm table-bordered m-table table-striped table"
                          id="terms_and_condition_table"
                        >
                          <thead>
                            <tr>
                              <th
                                style={{ verticalAlign: "top" }}
                                className="col-lg-1 col-md-1 col-sm-12"
                              >
                                #
                              </th>
                              <th
                                style={{ verticalAlign: "top" }}
                                className="col-lg-11 col-md-11 col-sm-12"
                              >
                                <span>Terms &amp; Condition</span>{" "}
                                <span className="float-right">
                                  <button
                                    className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air"
                                    onClick={() => toggleModal("newTerms")}
                                  >
                                    <span>
                                      <i className="la la-plus" />
                                      <span>New Term And Condition</span>
                                    </span>
                                  </button>
                                  <button
                                    className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
                                    id="terms_condition_button"
                                    title="Edit"
                                    onClick={() => toggleModal("editTerms")}
                                  >
                                    <i className="fa fa-edit" />
                                  </button>
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="m--hide" data-terms-item="template">
                              <td
                                className="col-lg-1 col-md-1 col-sm-12"
                                data-terms-index=""
                              />
                              <td
                                className="col-lg-11 col-md-11 col-sm-12"
                                data-terms-name=""
                              />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 pr-0">
                        <div className="row">
                          <div className="form-group col-lg-12 col-md-12 col-sm-12">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Note
                            </label>
                            <textarea
                              className="form-control form-control-sm"
                              name="note"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="shipping_details" title="Shipping Details">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group row">
                        <label className="col-lg-12 col-md-12 col-sm-12">
                          Additional Information
                        </label>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                          <label className="col-lg-12 col-md-12 col-sm-12">
                            Length :
                          </label>
                          <div className="form-group input-group-append">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="shiprocketLength"
                              name="shiprocketLength"
                              defaultValue={0}
                              data-fv-field="shiprocketLength"
                            />
                            <small
                              style={{ display: "none" }}
                              className="help-block"
                              data-fv-validator="notEmpty"
                              data-fv-for="shiprocketLength"
                              data-fv-result="NOT_VALIDATED"
                            >
                              Please enter a value
                            </small>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                          <label className="col-lg-12 col-md-12 col-sm-12">
                            Width :
                          </label>
                          <div className="form-group input-group-append">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="shiprocketWidth"
                              name="shiprocketWidth"
                              defaultValue={0}
                              data-fv-field="shiprocketWidth"
                            />
                            <small
                              style={{ display: "none" }}
                              className="help-block"
                              data-fv-validator="notEmpty"
                              data-fv-for="shiprocketWidth"
                              data-fv-result="NOT_VALIDATED"
                            >
                              Please enter a value
                            </small>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                          <label className="col-lg-12 col-md-12 col-sm-12">
                            Height :
                          </label>
                          <div className="form-group input-group-append">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="shiprocketHeight"
                              name="shiprocketHeight"
                              defaultValue={0}
                              data-fv-field="shiprocketHeight"
                            />
                            <small
                              style={{ display: "none" }}
                              className="help-block"
                              data-fv-validator="notEmpty"
                              data-fv-for="shiprocketHeight"
                              data-fv-result="NOT_VALIDATED"
                            >
                              Please enter a value
                            </small>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                          <label className="col-lg-12 col-md-12 col-sm-12">
                            Weight :
                          </label>
                          <div className="form-group input-group-append">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="shiprocketWeight"
                              name="shiprocketWeight"
                              defaultValue={0}
                              data-fv-field="shiprocketWeight"
                            />
                            <small
                              style={{ display: "none" }}
                              className="help-block"
                              data-fv-validator="notEmpty"
                              data-fv-for="shiprocketWeight"
                              data-fv-result="NOT_VALIDATED"
                            >
                              Please enter a value
                            </small>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                          <label className="col-lg-12 col-md-12 col-sm-12">
                            Default :
                          </label>
                          <div className="form-group input-group-append">
                            <span className="m-switch m-switch--icon">
                              <label>
                                <input
                                  type="checkbox"
                                  id="shiprocketDefault"
                                  name="shiprocketDefault"
                                />
                                <span />
                              </label>
                            </span>
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
                    onSubmit={onSubmitAdditionalCharges}
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
