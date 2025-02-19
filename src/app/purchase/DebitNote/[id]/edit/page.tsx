"use client";
import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TableDynamic from "@/components/Tables/TableDynamic";
import * as yup from "yup";
import { Collapse } from "react-bootstrap";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableGeneric from "@/components/Tables/TableGeneric";

export default function Page() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

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

  //   const columns = [
  //     {
  //       width: "150px",
  //       label: "Item Code/Barcode*",
  //       field: "item_code_barcode",
  //     },
  //     {
  //       width: "150px",
  //       label: "Product Name*",
  //       field: "product_name",
  //     },
  //     {
  //       width: "100px",
  //       label: "Batch*",
  //       field: "batch",
  //       required: true,
  //     },
  //     {
  //       width: "100px",
  //       label: "Qty*",
  //       field: "quantity",
  //     },
  //     {
  //       width: "100px",
  //       label: "Unit Cost*",
  //       field: "unit_cost",
  //     },
  //     {
  //       width: "100px",
  //       label: "MRP*",
  //       field: "mrp",
  //     },
  //     {
  //       width: "100px",
  //       label: "Selling Price*",
  //       field: "selling_price",
  //     },
  //     {
  //       width: "100px",
  //       label: "Pur. Disc1*",
  //       field: "purchase_discount_1",
  //     },
  //     {
  //       width: "100px",
  //       label: "Pur. Disc2*",
  //       field: "purchase_discount_2",
  //     },
  //     {
  //       width: "100px",
  //       label: "Tax",
  //       field: "tax",
  //     },
  //     {
  //       width: "100px",
  //       label: "Landing Cost",
  //       field: "landing_cost",
  //     },
  //     {
  //       width: "100px",
  //       label: "Margin (%)",
  //       field: "margin_percent",
  //     },
  //     {
  //       width: "100px",
  //       label: "Total*",
  //       field: "total",
  //     },
  //   ];
  const columns = [
    { label: "#", type: "serial" },
    {
      label: "Item Code/Barcode",
      required: true,
      type: "input",
      name: "item_code_barcode",
      width: "200px",
    },
    {
      label: "Product Name",
      required: true,
      type: "input",
      name: "product_name",
      width: "150px",
    },
    {
      label: "Batch",
      type: "input",
      name: "batch",
      width: "100px",
      required: true,
    },
    {
      label: "Qty",
      type: "input",
      name: "quantity",
      width: "100px",
      required: true,
    },
    {
      label: "Unit Cost",
      type: "input",
      name: "unit_cost",
      width: "100px",
      required: true,
      inputProps: { disabled: true },
    },
    {
      label: "MRP",
      type: "input",
      name: "mrp",
      width: "100px",
      required: true,
      inputProps: { disabled: true },
    },
    {
      label: "Selling Price",
      type: "input",
      name: "selling_price",
      width: "100px",
      required: true,
    },
    {
      label: "Pur. Disc1",
      type: "input",
      name: "purchase_discount_1",
      width: "100px",
      required: true,
    },
    {
      label: "Pur. Disc2",
      type: "input",
      name: "purchase_discount_2",
      width: "100px",
      required: true,
    },
    {
      label: "Tax",
      type: "select",
      name: "tax",
      options: ["GST 1", "GST 2"],
    },
    {
      label: "Landing Cost",
      type: "input",
      name: "landing_cost",
      width: "100px",
      inputProps: { disabled: true },
    },
    {
      label: "Margin (%)",
      type: "input",
      name: "margin_percent",
      width: "100px",
      required: true,
    },
    {
      label: "Total",
      type: "input",
      name: "total",
      width: "100px",
      required: true,
    },
  ];

  const rows = [
    { name: "John", role: "Admin" },
    { name: "Jane", role: "User" },
  ];

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Edit Debit Note"
        links={[
          { label: "Debit Note", route: "/purchase/debitnote" },
          { label: "Bill No..", route: "/purchase/debitnote/1" },
        ]}
      />
      <div className="debitnote_edit page_new page_edit">
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

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="form-group">
                  <label className="col-lg-12 col-md-12 col-sm-12 p-0">
                    Billing Address
                  </label>
                  <h5 className="">
                    <small
                      className="text-muted m--hide"
                      data-address-message=""
                    >
                      Billing Address is Not Provided
                    </small>
                  </h5>
                  <div
                    className="m-section__content"
                    id="purchase_billing_address"
                  >
                    <input
                      type="hidden"
                      name="billingAddressId"
                      id="billingAddressId"
                      defaultValue={6303958}
                    />
                    <input
                      type="hidden"
                      name="billingfirstname"
                      id="billingfirstname"
                      defaultValue=""
                    />
                    <input
                      type="hidden"
                      name="billinglastname"
                      id="billinglastname"
                      defaultValue=""
                    />
                    <input
                      type="hidden"
                      name="billingpincode"
                      id="billingpincode"
                      defaultValue=""
                    />
                    <input
                      type="hidden"
                      name="billingcityname"
                      id="billingcityname"
                      defaultValue="Gorakhpur"
                    />
                    <input
                      type="hidden"
                      name="billingcitycode"
                      id="billingcitycode"
                      defaultValue={5773}
                    />
                    <input
                      type="hidden"
                      name="billingstatename"
                      id="billingstatename"
                      defaultValue="Uttar Pradesh"
                    />
                    <input
                      type="hidden"
                      name="billingstatecode"
                      id="billingstatecode"
                      defaultValue={9}
                    />
                    <input
                      type="hidden"
                      name="billingcountryname"
                      id="billingcountryname"
                      defaultValue="India"
                    />
                    <input
                      type="hidden"
                      name="billingcountrycode"
                      id="billingcountrycode"
                      defaultValue="IN"
                    />
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <h5 className="">
                          <small className="text-muted" data-address-name="">
                            {" "}
                          </small>
                        </h5>
                        <h5 className="">
                          <small
                            className="text-muted"
                            id="company-name"
                            data-address-company-name=""
                          >
                            SIDDHI VINAYAK TRADERS
                          </small>
                          <input
                            type="hidden"
                            className="form-control form-control-sm"
                            name="billingcompanyname"
                            id="billingcompanyname"
                            defaultValue="SIDDHI VINAYAK TRADERS"
                          />
                        </h5>
                        <p className="mb-0">
                          <span
                            id="billing-address-line-1"
                            data-address-line-1=""
                          >
                            DILEJAKPUR NAYAMAT CHAK NEAR MAYUR CEMENT GORKHPUR
                          </span>
                          <input
                            type="hidden"
                            className="form-control form-control-sm"
                            name="billingaddressline1"
                            id="billingaddressline1"
                            defaultValue="DILEJAKPUR NAYAMAT CHAK NEAR MAYUR CEMENT GORKHPUR"
                          />
                        </p>
                        <p className="mb-0">
                          <span
                            id="billing-address-line-2"
                            data-address-line-2=""
                          />
                          <input
                            type="hidden"
                            className="form-control form-control-sm"
                            name="billingaddressline2"
                            id="billingaddressline2"
                            defaultValue=""
                          />
                        </p>
                        <p className="mb-0">
                          <span data-address-pincode="" />
                          <span data-address-city="">Gorakhpur</span>
                          <span className="m--font-boldest">,&nbsp;</span>
                        </p>
                        <p className="mb-0">
                          <span data-address-state="">Uttar Pradesh</span>
                          <span className="m--font-boldest">,&nbsp;</span>
                          <span data-address-country="">India</span>
                        </p>
                        <p className="mb-0">
                          <span className="">
                            <i className="la la-phone align-middle" />
                            <span
                              className=""
                              id="billing-phoneno"
                              data-address-phoneno=""
                            >
                              9118121159
                            </span>
                            <input
                              type="hidden"
                              className="form-control form-control-sm"
                              name="billingPhoneNo"
                              id="billingPhoneNo"
                              defaultValue={9118121159}
                            />
                          </span>
                        </p>
                        <button
                          type="button"
                          className="btn btn-link pb-0 pl-0"
                          data-toggle="m-popover"
                          data-trigger="click"
                          title=""
                          data-html="true"
                          data-content='
  <div class="m-section__content" data-address-list="">
      <div class="row" data-address-item="6303958">
          
          <div class="col-lg-12 col-md-12 col-sm-12">
              <h4 class=""><small class="text-muted" data-address-name=""></small>
                  <button type="button" data-change-address="billing" class="btn btn-outline-brand btn-sm float-right ml-5">Select
                  </button>
              </h4>
              <h5 class=""><small class="text-muted " data-address-company-name="">SIDDHI VINAYAK TRADERS</small></h5>
              <p class="mb-0">
                  <span class="" data-address-line-1="">DILEJAKPUR NAYAMAT CHAK NEAR MAYUR CEMENT GORKHPUR</span>
              </p>
              <p class="mb-0">
                  <span class="" data-address-line-2=""></span>
              </p>
              <p class="mb-0">
                  <span class="" data-address-pincode=""></span>
                  <span class="" data-address-city="5773">Gorakhpur</span>
              </p>
              <p class="mb-0">
                  <span class="" data-address-state="9">Uttar Pradesh</span>
                  <span class="" data-address-country="IN">India</span>
              </p>
              <p class="mb-0">
                      <span class="m--font-info"><i class="la la-phone align-middle"></i> <span class="" data-address-phoneno="">+91-9118121159</span></span>
              </p>
          </div>
      </div>
  </div>
    '
                          id="billing_address_btn"
                          data-original-title="Billing Address <a href='#' data-popover-close='' class='m--font-bolder m-link m-link--state  m-link--danger float-right'>Cancel</a>"
                        >
                          Change Address
                        </button>
                        <button
                          type="button"
                          className="btn btn-link pb-0 pl-0"
                          title="Edit Billing Address"
                          id="edit_billing_address"
                        >
                          Edit billing Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="m-section mb-0">
                  <label>Shipping Address</label>
                  {/* <div class="m-divider"><span></span></div> */}
                  <h5 className="">
                    <small
                      className="text-muted m--hide"
                      data-address-message=""
                    >
                      Shipping Address is Not Provided
                    </small>
                  </h5>
                  <div
                    className="m-section__content mb-0"
                    id="purchase_shipping_address"
                  >
                    <input
                      type="hidden"
                      name="shippingAddressId"
                      id="shippingAddressId"
                      defaultValue={0}
                    />
                    <input
                      type="hidden"
                      name="shippingfirstname"
                      id="shippingfirstname"
                      defaultValue=""
                    />
                    <input
                      type="hidden"
                      name="shippinglastname"
                      id="shippinglastname"
                      defaultValue=""
                    />
                    <input
                      type="hidden"
                      name="shippingcompanyname"
                      id="shippingcompanyname"
                      defaultValue="SIDDHI VINAYAK TRADERS"
                    />
                    <input
                      type="hidden"
                      name="shippingaddressline1"
                      id="shippingaddressline1"
                      defaultValue="DILEJAKPUR NAYAMAT CHAK NEAR MAYUR CEMENT GORKHPUR"
                    />
                    <input
                      type="hidden"
                      name="shippingaddressline2"
                      id="shippingaddressline2"
                      defaultValue=""
                    />
                    <input
                      type="hidden"
                      name="shippingpincode"
                      id="shippingpincode"
                      defaultValue=""
                    />
                    <input
                      type="hidden"
                      name="shippingcityname"
                      id="shippingcityname"
                      defaultValue="Gorakhpur"
                    />
                    <input
                      type="hidden"
                      name="shippingcitycode"
                      id="shippingcitycode"
                      defaultValue={5773}
                    />
                    <input
                      type="hidden"
                      name="shippingstatename"
                      id="shippingstatename"
                      defaultValue="Uttar Pradesh"
                    />
                    <input
                      type="hidden"
                      name="shippingstatecode"
                      id="shippingstatecode"
                      defaultValue={9}
                    />
                    <input
                      type="hidden"
                      name="shippingcountryname"
                      id="shippingcountryname"
                      defaultValue="India"
                    />
                    <input
                      type="hidden"
                      name="shippingcountrycode"
                      id="shippingcountrycode"
                      defaultValue="IN"
                    />
                    <input
                      type="hidden"
                      name="shippingphone"
                      id="shippingphone"
                      defaultValue={9118121159}
                    />
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <h5 className="">
                          <small className="text-muted" data-address-name="">
                            {" "}
                          </small>
                        </h5>
                        <h5 className="">
                          <small
                            className="text-muted"
                            data-address-company-name=""
                          >
                            SIDDHI VINAYAK TRADERS
                          </small>
                        </h5>
                        <p className="mb-0">
                          <span data-address-line-1="">
                            DILEJAKPUR NAYAMAT CHAK NEAR MAYUR CEMENT GORKHPUR
                          </span>
                        </p>
                        <p className="mb-0">
                          <span data-address-line-2="" />
                        </p>
                        <p className="mb-0">
                          <span data-address-pincode="" />
                          <span data-address-city="">Gorakhpur</span>
                          <span className="m--font-boldest">,&nbsp;</span>
                        </p>
                        <p className="mb-0">
                          <span data-address-state="">Uttar Pradesh</span>
                          <span className="m--font-boldest">,&nbsp;</span>
                          <span data-address-country="">India</span>
                        </p>
                        <p className="mb-0">
                          <span className="">
                            <i className="la la-phone align-middle" />
                            <span className="" data-address-phoneno="">
                              9118121159
                            </span>
                          </span>
                        </p>
                        <p className="mb-0">
                          <span data-address-gstin="09EEJPK8268D1Z2" />
                        </p>
                        <button
                          type="button"
                          className="btn btn-link pl-0 "
                          data-toggle="m-popover"
                          data-trigger="click"
                          title=""
                          data-html="true"
                          data-content='
  <div class="m-section__content" data-address-list="">
      <div class="row" data-address-item="6303958">
          
          <div class="col-lg-12 col-md-12 col-sm-12">
              <h4 class=""><small class="text-muted" data-address-name=""></small>
                  <button type="button" data-change-address="shipping" class="btn btn-outline-brand btn-sm float-right ml-5">Select
                  </button>
              </h4>
              <h5 class=""><small class="text-muted " data-address-company-name="">SIDDHI VINAYAK TRADERS</small></h5>
              <p class="mb-0">
                  <span class="" data-address-line-1="">DILEJAKPUR NAYAMAT CHAK NEAR MAYUR CEMENT GORKHPUR</span>
              </p>
              <p class="mb-0">
                  <span class="" data-address-line-2=""></span>
              </p>
              <p class="mb-0">
                  <span class="" data-address-pincode=""></span>
                  <span class="" data-address-city="5773">Gorakhpur</span>
              </p>
              <p class="mb-0">
                  <span class="" data-address-state="9">Uttar Pradesh</span>
                  <span class="" data-address-country="IN">India</span>
              </p>
              <p class="mb-0">
                      <span class="m--font-info"><i class="la la-phone align-middle"></i> <span class="" data-address-phoneno="">+91-9118121159</span></span>
              </p>
          </div>
      </div>
  </div>
    '
                          id="shipping_address_btn"
                          data-original-title="Shipping Address <a href='#' data-popover-close='' class='m--font-bolder m-link m-link--state  m-link--danger float-right'>Cancel</a>"
                        >
                          Change Address
                        </button>
                        <button
                          type="button"
                          className="btn btn-link pb-0 pl-0"
                          title="Edit Shipping Address"
                          id="edit_shipping_address"
                        >
                          Edit shipping Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="m-widget28">
                  <div className="m-widget28__container">
                    {/* Start:: Content */}
                    <div className="m-widget28__tab tab-content">
                      <div className="m-widget28__tab-container tab-pane active">
                        <div className="m-widget28__tab-items">
                          <div className="m-widget28__tab-item">
                            <span className="m--regular-font-size-">GSTIN</span>
                            <span id="lblContactGSTIN">09EEJPK8268D1Z2</span>
                          </div>
                          {/* <div class="m-widget28__tab-item">
																						<span class="m--regular-font-size-">Place of Supply</span>
																						<span>F Gear</span>
																					</div> */}
                        </div>
                      </div>
                    </div>
                    {/* end:: Content */}
                  </div>
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
                <div className="form-group row has-success">
                  <label className="col-lg-12 col-md-12 col-sm-12">
                    Reason
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <textarea
                      className="form-control form-control-sm"
                      name="reasonDescription"
                      placeholder="Enter a reason"
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
                      <TableDynamic
                        columns={columns}
                        schema={additonalChargeSchema}
                        rows={additionalRows}
                        onSubmit={undefined}
                      />
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
                  onSubmit={undefined}
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
      </div>
    </DefaultLayout>
  );
}
