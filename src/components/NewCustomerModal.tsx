import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ModalFooter,
  Container
} from "react-bootstrap";
export interface Props {
  show: boolean;
  toggle: () => void;
}
export default function NewCustomerModal({ show, toggle }: Props) {
  return (
    <Modal
      show={show}
      onHide={() => toggle()}
      size="lg"
      centered
      style={{ zIndex: 10000 }}
    >
      <ModalHeader closeButton className="border-0">
        <h5>Create New Customer</h5>
      </ModalHeader>
      <ModalBody className="m-0 p-0">
        <form
          id="contact_form"
          method="post"
          action=""
          className="fv-form fv-form-bootstrap"
        >
          <Container>
            <button
              type="submit"
              className="fv-hidden-submit"
              style={{ display: "none", width: 0, height: 0 }}
            />
            <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Company Name
                    <small
                      style={{
                        fontSize: "1.25rem",
                        color: "red",
                        display: "none",
                      }}
                      className="text-danger"
                      id="isCompanyNameMandatory"
                    >
                      *
                    </small>
                  </label>
                  <div className="col-md-9 pr-sm-1">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="companyName"
                      name="companyName"
                      placeholder="Company Name"
                      defaultValue=""
                      onChange={() => {}}
                      data-fv-field="companyName"
                    />
                  </div>
                  <div
                    className="col-md-3 pl-sm-1 suppDiv custDiv"
                    id="codeDiv"
                  >
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="suppilercode"
                      name="supplierCode"
                      placeholder="Code"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group row ">
                  <div className="col-lg-6">
                    <label>
                      First Name
                      <span
                        style={{ fontSize: "1.25rem" }}
                        id="isFirstnameMandatory"
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="firstName"
                      id="firstName"
                      placeholder="First Name"
                      defaultValue=""
                      data-fv-field="firstName"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      defaultValue=""
                      data-fv-field="lastName"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Mobile No.
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-8">
                    <div className="select-box">
                      <input
                        type="hidden"
                        id="countryDialCodePrefix"
                        name="countryDialCodePrefix"
                        className="dial-code-prefix"
                        defaultValue={91}
                      />
                      <div
                        className="selected-option d-flex"
                        id="selected_option"
                      >
                        <div
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => {}}
                        >
                          <span className="d-flex">
                            {/* <img
                    src="https://cdn.vyaparerp.com/assets/images/countries-flag/in.svg"
                    className="img-flag"
                    id="img_flag"
                  /> */}
                            <span className="dial-code" id="dial_code">
                              +91
                            </span>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm phone-input"
                          id="mobNo"
                          name="mobNo"
                          placeholder="Mobile No."
                          defaultValue=""
                          data-fv-field="mobNo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3" id="whatsapp">
                <div className="form-group row">
                  <label className="form-control-label col-lg-12 col-md-12 col-sm-12">
                    WhatsApp No.
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="select-box">
                      <input
                        type="hidden"
                        id="countryDialCodePrefixWhatsapp"
                        name="countryDialCodePrefixWhatsapp"
                        className="dial-code-prefix"
                        defaultValue={91}
                      />
                      <div
                        className="selected-option d-flex"
                        id="selected_option"
                      >
                        <div
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => {}}
                        >
                          <span>
                            {/* <img
                    src="https://cdn.vyaparerp.com/assets/images/countries-flag/in.svg"
                    className="img-flag"
                    id="img_flag"
                  /> */}
                            <span className="dial-code" id="dial_code">
                              +91
                            </span>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm phone-input"
                          name="whatsappNo"
                          id="whatsappNo"
                          placeholder="WhatsApp No."
                          data-fv-field="whatsappNo"
                        />
                      </div>
                    </div>

                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="callback"
                      data-fv-for="whatsappNo"
                      data-fv-result="NOT_VALIDATED"
                    >
                      Mobile number not Valid
                    </small>
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="regexp"
                      data-fv-for="whatsappNo"
                      data-fv-result="NOT_VALIDATED"
                    >
                      The Mobile no. can only consist of number
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row " id="contactdob">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Date Of Birth
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group date">
                      <input
                        type="text"
                        className="form-control form-control-sm clearbtn-datepicker input-mask-contact-modal"
                        data-date-format="dd/mm/yyyy"
                        name="dateOfBirth"
                        placeholder="Date Of Birth"
                        data-fv-field="dateOfBirth"
                      />
                    </div>
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="stringLength"
                      data-fv-for="dateOfBirth"
                      data-fv-result="NOT_VALIDATED"
                    >
                      The Date is not valid
                    </small>
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="regexp"
                      data-fv-for="dateOfBirth"
                      data-fv-result="NOT_VALIDATED"
                    >
                      Date is not valid
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row " id="contactand">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Anniversary Date
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group date">
                      <input
                        type="text"
                        className="form-control form-control-sm clearbtn-datepicker input-mask-contact-modal"
                        data-date-format="dd/mm/yyyy"
                        name="anniversaryDate"
                        placeholder="Anniversary Date"
                        data-fv-field="anniversaryDate"
                      />
                    </div>
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="stringLength"
                      data-fv-for="anniversaryDate"
                      data-fv-result="NOT_VALIDATED"
                    >
                      The Date is not valid
                    </small>
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="regexp"
                      data-fv-for="anniversaryDate"
                      data-fv-result="NOT_VALIDATED"
                    >
                      Date is not valid
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Telephone No.
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="telephone"
                      placeholder="Telephone No."
                      defaultValue=""
                      data-fv-field="telephone"
                    />
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="stringLength"
                      data-fv-for="telephone"
                      data-fv-result="NOT_VALIDATED"
                    >
                      The telephone no. must be 11 digit long
                    </small>
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="regexp"
                      data-fv-for="telephone"
                      data-fv-result="NOT_VALIDATED"
                    >
                      The telephone no. can only consist of number
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Email
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="email"
                      placeholder="Email"
                      defaultValue=""
                      data-fv-field="email"
                    />
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="stringLength"
                      data-fv-for="email"
                      data-fv-result="NOT_VALIDATED"
                    >
                      Email Address Should not be greater than 50
                    </small>
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="regexp"
                      data-fv-for="email"
                      data-fv-result="NOT_VALIDATED"
                    >
                      email address is not a valid
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    GST Type
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <select
                      className="form-control m-select2 select2-hidden-accessible"
                      id="gst_type"
                      name="gstType"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <option value="UnRegistered" data-select2-id={22}>
                        UnRegistered
                      </option>
                      <option value="Registered">Registered Regular</option>
                      <option value="Composition Scheme">
                        Registered Composition
                      </option>
                      <option value="Input Service Distributor">
                        Input Service Distributor
                      </option>
                      <option value="E-Commerce Operator">
                        E-Commerce Operator
                      </option>
                      {/* <option value="Consumer" selected="selected">Consumer</option>
                                  <option value="Overseas">Overseas</option>
                                  <option value="SEZ">SEZ</option>
                                  <option value="Demand Export">Demand Export</option> */}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    GSTIN
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-8">
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="gstin"
                        id="gstin"
                        placeholder="GSTIN"
                        defaultValue=""
                        data-fv-field="gstin"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-info"
                        id="verifyGSTINButton"
                        style={{ display: "none" }}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    PAN No.
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="panNo"
                      placeholder="Pan No."
                      defaultValue=""
                      data-fv-field="panNo"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Remark
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="remark"
                      placeholder="Remark"
                      defaultValue=""
                      data-fv-field="remark"
                    />
                  </div>
                </div>
              </div>
              <input type="hidden" name="brnNo" />
              <div className="col-lg-12 col-md-12 col-sm-12 ">
                <div className="form-group row " id="contacttypediv">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Customer Type:
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <div className="col-lg-3">
                    <label className="m-radio m-radio--solid m-radio--brand">
                      <input
                        type="radio"
                        name="contactType"
                        defaultValue="retailer"
                      />{" "}
                      Retailer
                      <span />
                    </label>
                  </div>
                  <div className="col-lg-3">
                    <label className="m-radio m-radio--solid m-radio--brand">
                      <input
                        type="radio"
                        name="contactType"
                        defaultChecked={true}
                        defaultValue="wholesaler"
                      />{" "}
                      Wholesaler
                      <span />
                    </label>
                  </div>
                  <div className="col-lg-3">
                    <label className="m-radio m-radio--solid m-radio--brand">
                      <input
                        type="radio"
                        name="contactType"
                        defaultValue="other"
                      />{" "}
                      Other
                      <span />
                    </label>
                  </div>
                  <div className="col-lg-3">
                    <label className="m-radio m-radio--solid m-radio--brand">
                      <input
                        type="radio"
                        name="contactType"
                        defaultValue="merchant"
                      />{" "}
                      Merchant
                      <span />
                    </label>
                  </div>
                </div>
                <div className="form-group row m--hide" id="AssociatedMerchant">
                  {/* <label class=" col-lg-12 col-sm-12">Branch Name:</label> */}
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="m-checkbox-inline">
                      <label className="m-checkbox m-checkbox--solid m-checkbox--brand">
                        <input
                          type="checkbox"
                          name="associatedmerchant"
                          defaultValue={0}
                        />{" "}
                        Associated Merchant
                        <span />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Address Line 1
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="contactAddressVos[0].addressLine1"
                      placeholder="Address Line 1"
                      defaultValue=""
                      data-fv-field="contactAddressVos[0].addressLine1"
                    />
                    <small
                      style={{ display: "none" }}
                      className="help-block"
                      data-fv-validator="stringLength"
                      data-fv-for="contactAddressVos[0].addressLine1"
                      data-fv-result="NOT_VALIDATED"
                    >
                      The address must be less than 250 characters long
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 m--hide">
                <div className="form-group row">
                  <label className=" col-lg-12 col-md-12 col-sm-12">
                    Address Line 2
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="contactAddressVos[0].addressLine2"
                      placeholder="Address Line 2"
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group has-success">
                  <label className="">
                    Country
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <select
                    className="form-control m-select2 select2-hidden-accessible"
                    id="countriesCode0"
                    data-default="IN"
                    name="contactAddressVos[0].countriesCode"
                    onChange={() => {}}
                    data-allow-clear="true"
                    data-select2-id="countriesCode0"
                    tabIndex={-1}
                    disabled
                    value={"IN"}
                  >
                    <option value="IN" data-select2-id={2314}>
                      India
                    </option>
                  </select>
                  <span
                    className="select2 select2-container select2-container--default"
                    dir="ltr"
                    data-select2-id={1242}
                    style={{ width: "172.5px" }}
                  >
                    <span className="selection">
                      <span
                        className="select2-selection select2-selection--single"
                        role="combobox"
                        aria-haspopup="true"
                        aria-expanded="false"
                        tabIndex={0}
                        aria-labelledby="select2-countriesCode0-container"
                      >
                        <span
                          className="select2-selection__rendered"
                          id="select2-countriesCode0-container"
                          role="textbox"
                          aria-readonly="true"
                          title="India"
                        >
                          India
                        </span>
                        <span
                          className="select2-selection__arrow"
                          role="presentation"
                        >
                          <b role="presentation" />
                        </span>
                      </span>
                    </span>
                    <span className="dropdown-wrapper" aria-hidden="true" />
                  </span>
                  <small
                    style={{ display: "none" }}
                    className="help-block"
                    data-fv-validator="notEmpty"
                    data-fv-for="contactAddressVos[0].countriesCode"
                    data-fv-result="VALID"
                  >
                    select any countries
                  </small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group has-success">
                  <label className="">
                    Select State
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <select
                    className="form-control m-select2 select2-hidden-accessible"
                    id="stateCode0"
                    data-default={9}
                    name="contactAddressVos[0].stateCode"
                    onChange={() => {}}
                    data-allow-clear="false"
                    data-select2-id="stateCode0"
                    tabIndex={-1}
                    aria-hidden="true"
                    data-fv-field="contactAddressVos[0].stateCode"
                  >
                    <option value={35}>Andaman and Nicobar Islands</option>
                    <option value={12}>Arunachal Pradesh</option>
                    <option value={18}>Assam</option>
                    <option value={10}>Bihar</option>
                    <option value={4}>Chandigarh</option>
                    <option value={22}>Chhattisgarh</option>
                    <option value={7}>Delhi</option>
                    <option value={30}>Goa</option>
                    <option value={24}>Gujarat</option>
                    <option value={2}>Himachal Pradesh</option>
                    <option value={1}>Jammu and Kashmir</option>
                    <option value={20}>Jharkhand</option>
                    <option value={29}>Karnataka</option>
                    <option value={32}>Kerala</option>
                    <option value={31}>Lakshadweep</option>
                    <option value={23}>Madhya Pradesh</option>
                    <option value={27}>Maharashtra</option>
                    <option value={14}>Manipur</option>
                    <option value={17}>Meghalaya</option>
                    <option value={15}>Mizoram</option>
                    <option value={13}>Nagaland</option>
                    <option value={21}>Odisha</option>
                    <option value={34}>Puducherry</option>
                    <option value={3}>Punjab</option>
                    <option value={8}>Rajasthan</option>
                    <option value={11}>Sikkim</option>
                    <option value={33}>Tamil Nadu</option>
                    <option value={16}>Tripura</option>
                    <option value={9} data-select2-id={2315}>
                      Uttar Pradesh
                    </option>
                    <option value={5}>Uttarakhand</option>
                    <option value={19}>West Bengal</option>
                    <option value={36}>Telangana</option>
                    <option value={97}>Other</option>
                    <option value={37}>Andhra Pradesh</option>
                    <option value="JH">JH</option>
                    <option value={26}>
                      Dadra And Nagar Haveli And Daman And Diu
                    </option>
                    <option value="महाराष्ट्र">महाराष्ट्र</option>
                    <option value="DD">DD</option>
                    <option value="LA">LA</option>
                    <option value="UTTAR PRADESH">UTTAR PRADESH</option>
                    <option value="UTL01">Union Territory of Ladakh</option>
                    <option value={6}>Haryana</option>
                  </select>
                  <span
                    className="select2 select2-container select2-container--default"
                    dir="ltr"
                    data-select2-id={1284}
                    style={{ width: "172.5px" }}
                  >
                    <span className="selection">
                      <span
                        className="select2-selection select2-selection--single"
                        role="combobox"
                        aria-haspopup="true"
                        aria-expanded="false"
                        tabIndex={0}
                        aria-labelledby="select2-stateCode0-container"
                      >
                        <span
                          className="select2-selection__rendered"
                          id="select2-stateCode0-container"
                          role="textbox"
                          aria-readonly="true"
                          title="Uttar Pradesh"
                        >
                          Uttar Pradesh
                        </span>
                        <span
                          className="select2-selection__arrow"
                          role="presentation"
                        >
                          <b role="presentation" />
                        </span>
                      </span>
                    </span>
                    <span className="dropdown-wrapper" aria-hidden="true" />
                  </span>
                  <small
                    style={{ display: "none" }}
                    className="help-block"
                    data-fv-validator="notEmpty"
                    data-fv-for="contactAddressVos[0].stateCode"
                    data-fv-result="VALID"
                  >
                    select any State
                  </small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group has-success">
                  <label className="">
                    Select City
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <select
                    className="form-control m-select2 select2-hidden-accessible"
                    id="cityCode0"
                    data-default={5773}
                    name="contactAddressVos[0].cityCode"
                    data-allow-clear="true"
                    data-select2-id="cityCode0"
                    tabIndex={-1}
                    aria-hidden="true"
                    data-fv-field="contactAddressVos[0].cityCode"
                  >
                    <option value="Kanpur Kanpur Nagar">
                      Kanpur Kanpur Nagar
                    </option>
                    <option value="Patti Pratapgarh">Patti Pratapgarh</option>
                    <option value="Kanpur Uttar Pradesh">
                      Kanpur Uttar Pradesh
                    </option>
                    <option value="Itwa">Itwa</option>
                    <option value={5531}>Achhalda</option>
                    <option value={5532}>Achhnera</option>
                    <option value={5533}>Adari</option>
                    <option value={5534}>Afzalgarh</option>
                    <option value={5535}>Agarwal Mandi</option>
                    <option value={5536}>Agra</option>
                    <option value={5537}>Agra</option>
                    <option value={5538}>Ahraura</option>
                    <option value={5539}>Ailum</option>
                    <option value={5540}>Air Force Area</option>
                    <option value={5541}>Ajhuwa</option>
                    <option value={5542}>Akbarpur</option>
                    <option value={5543}>Akbarpur</option>
                    <option value={5544}>Aliganj</option>
                    <option value={5545}>Aligarh</option>
                    <option value={5546}>Allahabad</option>
                    <option value={5547}>Allahabad</option>
                    <option value={5548}>Allahganj</option>
                    <option value={5549}>Allapur</option>
                    <option value={5550}>Amanpur</option>
                    <option value={5551}>Ambehta</option>
                    <option value={5552}>Amethi</option>
                    <option value={5553}>Amethi</option>
                    <option value={5554}>Amila</option>
                    <option value={5555}>Amilo</option>
                    <option value={5556}>Aminagar Sarai</option>
                    <option value={5557}>Aminagar Urf Bhurbaral</option>
                    <option value={5558}>Amraudha</option>
                    <option value={5559}>Amroha</option>
                    <option value={5560}>Anandnagar</option>
                    <option value={5561}>Anpara</option>
                    <option value={5562}>Antu</option>
                    <option value={5563}>Anupshahr</option>
                    <option value={5564}>Aonla</option>
                    <option value={5565}>Armapur Estate</option>
                    <option value={5566}>Ashrafpur Kichhauchha</option>
                    <option value={5567}>Atarra</option>
                    <option value={5568}>Atasu</option>
                    <option value={5569}>Atrauli</option>
                    <option value={5570}>Atraulia</option>
                    <option value={5571}>Auraiya</option>
                    <option value={5572}>Aurangabad</option>
                    <option value={5573}>Aurangabad Bangar</option>
                    <option value={5574}>Auras</option>
                    <option value={5575}>Awagarh</option>
                    <option value={5576}>Ayodhya</option>
                    <option value={5577}>Azamgarh</option>
                    <option value={5578}>Azizpur</option>
                    <option value={5579}>Azmatgarh</option>
                    <option value={5580}>Babarpur Ajitmal</option>
                    <option value={5581}>Baberu</option>
                    <option value={5582}>Babina</option>
                    <option value={5583}>Babrala</option>
                    <option value={5584}>Babugarh</option>
                    <option value={5585}>Bachhraon</option>
                    <option value={5586}>Bachhrawan</option>
                    <option value={5587}>Bad</option>
                    <option value={5588}>Baghpat</option>
                    <option value={5589}>Bah</option>
                    <option value={5590}>Bahadurganj</option>
                    <option value={5591}>Baheri</option>
                    <option value={5592}>Bahjoi</option>
                    <option value={5593}>Bahraich</option>
                    <option value={5594}>Bahsuma</option>
                    <option value={5595}>Bahuwa</option>
                    <option value={5596}>Bajna</option>
                    <option value={5597}>Bakewar</option>
                    <option value={5598}>Bakiabad</option>
                    <option value={5599}>Baldeo</option>
                    <option value={5600}>Ballia</option>
                    <option value={5601}>Balrampur</option>
                    <option value={5602}>Banat</option>
                    <option value={5603}>Banda</option>
                    <option value={5604}>Bangarmau</option>
                    <option value={5605}>Banki</option>
                    <option value={5606}>Bansdih</option>
                    <option value={5607}>Bansgaon</option>
                    <option value={5608}>Bansi</option>
                    <option value={5609}>Baragaon</option>
                    <option value={5610}>Baragaon</option>
                    <option value={5611}>Baraut</option>
                    <option value={5612}>Bareilly</option>
                    <option value={5613}>Bareilly</option>
                    <option value={5614}>Barhalganj</option>
                    <option value={5615}>Barhani Bazar</option>
                    <option value={5616}>Barkhera</option>
                    <option value={5617}>Barsana</option>
                    <option value={5618}>Barua Sagar</option>
                    <option value={5619}>Barwar</option>
                    <option value={5620}>Basti</option>
                    <option value={5621}>Begumabad Budhana</option>
                    <option value={5622}>Behta Hajipur</option>
                    <option value={5623}>Bela Pratapgarh</option>
                    <option value={5624}>Belthara Road</option>
                    <option value={5625}>Beniganj</option>
                    <option value={5626}>Beswan</option>
                    <option value={5627}>Bewar</option>
                    <option value={5628}>Bhadarsa</option>
                    <option value={5629}>Bhadohi</option>
                    <option value={5630}>Bhagwant Nagar</option>
                    <option value={5631}>Bharatganj</option>
                    <option value={5632}>Bhargain</option>
                    <option value={5633}>Bharthana</option>
                    <option value={5634}>Bharuhana</option>
                    <option value={5635}>Bharwari</option>
                    <option value={5636}>Bhatni Bazar</option>
                    <option value={5637}>Bhatpar Rani</option>
                    <option value={5638}>Bhawan Bahadur Nagar</option>
                    <option value={5639}>Bhinga</option>
                    <option value={5640}>Bhogaon</option>
                    <option value={5641}>Bhojpur Dharampur</option>
                    <option value={5642}>Bhokarhedi</option>
                    <option value={5643}>Bhulepur</option>
                    <option value={5644}>Bidhuna</option>
                    <option value={5645}>Bighapur</option>
                    <option value={5646}>Bijnor</option>
                    <option value={5647}>Bijpur</option>
                    <option value={5648}>Bikapur</option>
                    <option value={5649}>Bilari</option>
                    <option value={5650}>Bilariaganj</option>
                    <option value={5651}>Bilaspur</option>
                    <option value={5652}>Bilaspur</option>
                    <option value={5653}>Bilgram</option>
                    <option value={5654}>Bilhaur</option>
                    <option value={5655}>Bilram</option>
                    <option value={5656}>Bilsanda</option>
                    <option value={5657}>Bilsi</option>
                    <option value={5658}>Bindki</option>
                    <option value={5659}>Bisalpur</option>
                    <option value={5660}>Bisanda Buzurg</option>
                    <option value={5661}>Bisauli</option>
                    <option value={5662}>Bisharatganj</option>
                    <option value={5663}>Bisokhar</option>
                    <option value={5664}>Biswan</option>
                    <option value={5665}>Bithoor</option>
                    <option value={5666}>Budaun</option>
                    <option value={5667}>Budhana</option>
                    <option value={5668}>Bugrasi</option>
                    <option value={5669}>Bulandshahr</option>
                    <option value={5670}>Chail</option>
                    <option value={5671}>Chak Imam Ali</option>
                    <option value={5672}>Chakeri</option>
                    <option value={5673}>Chakia</option>
                    <option value={5674}>Chandauli</option>
                    <option value={5675}>Chandausi</option>
                    <option value={5676}>Chandpur</option>
                    <option value={5677}>Charkhari</option>
                    <option value={5678}>Charthaval</option>
                    <option value={5679}>Chaumuhan</option>
                    <option value={5680}>Chhaprauli</option>
                    <option value={5681}>Chharra Rafatpur</option>
                    <option value={5682}>Chhata</option>
                    <option value={5683}>Chhatari</option>
                    <option value={5684}>Chhibramau</option>
                    <option value={5685}>Chhutmalpur</option>
                    <option value={5686}>Chilkana Sultanpur</option>
                    <option value={5687}>Chirgaon</option>
                    <option value={5688}>Chitbara Gaon</option>
                    <option value={5689}>Chitrakoot Dham (Karwi)</option>
                    <option value={5690}>Chopan</option>
                    <option value={5691}>Choubepur Kalan</option>
                    <option value={5692}>Chunar</option>
                    <option value={5693}>Churk Ghurma</option>
                    <option value={5694}>Colonelganj</option>
                    <option value={5695}>Dadri</option>
                    <option value={5696}>Dalmau</option>
                    <option value={5697}>Dankaur</option>
                    <option value={5698}>Dariyabad</option>
                    <option value={5699}>Dasna</option>
                    <option value={5700}>Dataganj</option>
                    <option value={5701}>Daurala</option>
                    <option value={5702}>Dayalbagh</option>
                    <option value={5703}>Deoband</option>
                    <option value={5704}>Deoranian</option>
                    <option value={5705}>Deoria</option>
                    <option value={5706}>Dewa</option>
                    <option value={5707}>Dhampur</option>
                    <option value={5708}>Dhanauha</option>
                    <option value={5709}>Dhanauli</option>
                    <option value={5710}>Dhanaura</option>
                    <option value={5711}>Dharoti Khurd</option>
                    <option value={5712}>Dhaura Tanda</option>
                    <option value={5713}>Dhaurehra</option>
                    <option value={5714}>Dibai</option>
                    <option value={5715}>Dibiyapur</option>
                    <option value={5716}>Dildarnagar Fatehpur Bazar</option>
                    <option value={5717}>Doghat</option>
                    <option value={5718}>Dohrighat</option>
                    <option value={5719}>Dostpur</option>
                    <option value={5720}>Dudhi</option>
                    <option value={5721}>Dulhipur</option>
                    <option value={5722}>Ekdil</option>
                    <option value={5723}>Erich</option>
                    <option value={5724}>Etah</option>
                    <option value={5725}>Etawah</option>
                    <option value={5726}>Etmadpur</option>
                    <option value={5727}>Faizabad</option>
                    <option value={5728}>Faizabad</option>
                    <option value={5729}>Faizganj</option>
                    <option value={5730}>Farah</option>
                    <option value={5731}>Faridnagar</option>
                    <option value={5732}>Faridpur</option>
                    <option value={5733}>Faridpur</option>
                    <option value={5734}>Fariha</option>
                    <option value={5735}>Farrukhabad-cum-Fatehgarh</option>
                    <option value={5736}>Fatehabad</option>
                    <option value={5737}>Fatehganj Pashchimi</option>
                    <option value={5738}>Fatehganj Purvi</option>
                    <option value={5739}>Fatehgarh</option>
                    <option value={5740}>Fatehpur</option>
                    <option value={5741}>Fatehpur</option>
                    <option value={5742}>Fatehpur Chaurasi</option>
                    <option value={5743}>Fatehpur Sikri</option>
                    <option value={5744}>Firozabad</option>
                    <option value={5745}>Gajraula</option>
                    <option value={5746}>Gangaghat</option>
                    <option value={5747}>Gangapur</option>
                    <option value={5748}>Gangoh</option>
                    <option value={5749}>Ganj Dundawara</option>
                    <option value={5750}>Ganj Muradabad</option>
                    <option value={5751}>Garautha</option>
                    <option value={5752}>Garhi Pukhta</option>
                    <option value={5753}>Garhmukteshwar</option>
                    <option value={5754}>Gaura Barhaj</option>
                    <option value={5755}>Gauri Bazar</option>
                    <option value={5756}>Gausganj</option>
                    <option value={5757}>Gawan</option>
                    <option value={5758}>Ghatampur</option>
                    <option value={5759}>Ghaziabad</option>
                    <option value={5760}>Ghazipur</option>
                    <option value={5761}>Ghiraur</option>
                    <option value={5762}>Ghorawal</option>
                    <option value={5763}>Ghosi</option>
                    <option value={5764}>Ghosia Bazar</option>
                    <option value={5765}>Ghughuli</option>
                    <option value={5766}>Gohand</option>
                    <option value={5767}>Gokul</option>
                    <option value={5768}>Gola Bazar</option>
                    <option value={5769}>Gola Gokarannath</option>
                    <option value={5770}>Gonda</option>
                    <option value={5771}>Gopamau</option>
                    <option value={5772}>Gopiganj</option>
                    <option value={5773} data-select2-id={2316}>
                      Gorakhpur
                    </option>
                    <option value={5774}>Gosainganj</option>
                    <option value={5775}>Gosainganj</option>
                    <option value={5776}>Govardhan</option>
                    <option value={5777}>Gulaothi</option>
                    <option value={5778}>Gularia Bhindara</option>
                    <option value={5779}>Gulariya</option>
                    <option value={5780}>Gunnaur</option>
                    <option value={5781}>Gursahaiganj</option>
                    <option value={5782}>Gursarai</option>
                    <option value={5783}>Gyanpur</option>
                    <option value={5784}>Hafizpur</option>
                    <option value={5785}>Haidergarh</option>
                    <option value={5786}>Haldaur</option>
                    <option value={5787}>Hamirpur</option>
                    <option value={5788}>Handia</option>
                    <option value={5789}>Hapur</option>
                    <option value={5790}>Hardoi</option>
                    <option value={5791}>Harduaganj</option>
                    <option value={5792}>Hargaon</option>
                    <option value={5793}>Hariharpur</option>
                    <option value={5794}>Harraiya</option>
                    <option value={5795}>Hasanpur</option>
                    <option value={5796}>Hasayan</option>
                    <option value={5797}>Hastinapur</option>
                    <option value={5798}>Hata</option>
                    <option value={5799}>Hathras</option>
                    <option value={5801}>Ibrahimpur</option>
                    <option value={5802}>Iglas</option>
                    <option value={5803}>Ikauna</option>
                    <option value={5804}>Iltifatganj Bazar</option>
                    <option value={5805}>
                      Indian Telephone Industry, Mankapur (Sp. Village)
                    </option>
                    <option value={5806}>Islamnagar</option>
                    <option value={5807}>Itaunja</option>
                    <option value={5808}>Jafarabad</option>
                    <option value={5809}>Jagner</option>
                    <option value={5810}>Jahanabad</option>
                    <option value={5811}>Jahangirabad</option>
                    <option value={5812}>Jahangirpur</option>
                    <option value={5813}>Jais</option>
                    <option value={5814}>Jaithara</option>
                    <option value={5815}>Jalalabad</option>
                    <option value={5816}>Jalalabad</option>
                    <option value={5817}>Jalalabad</option>
                    <option value={5818}>Jalali</option>
                    <option value={5819}>Jalalpur</option>
                    <option value={5820}>Jalaun</option>
                    <option value={5821}>Jalesar</option>
                    <option value={5822}>Jamshila</option>
                    <option value={5823}>Jangipur</option>
                    <option value={5824}>Jansath</option>
                    <option value={5825}>Jarwal</option>
                    <option value={5826}>Jasrana</option>
                    <option value={5827}>Jaswantnagar</option>
                    <option value={5828}>Jatari</option>
                    <option value={5829}>Jaunpur</option>
                    <option value={5830}>Jewar</option>
                    <option value={5831}>Jhalu</option>
                    <option value={5832}>Jhansi</option>
                    <option value={5833}>Jhansi</option>
                    <option value={5834}>Jhansi Rly. Settlement</option>
                    <option value={5835}>Jhinjhak</option>
                    <option value={5836}>Jhinjhana</option>
                    <option value={5837}>Jhusi</option>
                    <option value={5838}>Jhusi Kohna</option>
                    <option value={5839}>Jiyanpur</option>
                    <option value={5840}>Joya</option>
                    <option value={5841}>Jyoti Khuria</option>
                    <option value={5842}>Kabrai</option>
                    <option value={5843}>Kachhauna Patseni</option>
                    <option value={5844}>Kachhla</option>
                    <option value={5845}>Kachhwa</option>
                    <option value={5846}>Kadaura</option>
                    <option value={5847}>Kadipur</option>
                    <option value={5848}>Kailashpur</option>
                    <option value={5849}>Kaimganj</option>
                    <option value={5850}>Kairana</option>
                    <option value={5851}>Kakgaina</option>
                    <option value={5852}>Kakod</option>
                    <option value={5853}>Kakori</option>
                    <option value={5854}>Kakrala</option>
                    <option value={5855}>Kalinagar</option>
                    <option value={5856}>Kalpi</option>
                    <option value={5857}>Kamalganj</option>
                    <option value={5858}>Kampil</option>
                    <option value={5859}>Kandhla</option>
                    <option value={5860}>Kandwa</option>
                    <option value={5861}>Kannauj</option>
                    <option value={5862}>Kanpur</option>
                    <option value={5863}>Kanpur</option>
                    <option value={5864}>Kanth</option>
                    <option value={5865}>Kanth</option>
                    <option value={5866}>Kaptanganj</option>
                    <option value={5867}>Karari</option>
                    <option value={5868}>Karhal</option>
                    <option value={5869}>Karnawal</option>
                    <option value={5870}>Kasganj</option>
                    <option value={5871}>Katariya</option>
                    <option value={5872}>Katghar Lalganj</option>
                    <option value={5873}>Kathera</option>
                    <option value={5874}>Katra</option>
                    <option value={5875}>Katra</option>
                    <option value={5876}>Katra Medniganj</option>
                    <option value={5877}>Kauriaganj</option>
                    <option value={5878}>Kemri</option>
                    <option value={5879}>Kerakat</option>
                    <option value={5880}>Khadda</option>
                    <option value={5881}>Khaga</option>
                    <option value={5882}>Khailar</option>
                    <option value={5883}>Khair</option>
                    <option value={5884}>Khairabad</option>
                    <option value={5885}>Khairabad</option>
                    <option value={5886}>Khalilabad</option>
                    <option value={5887}>Khamaria</option>
                    <option value={5888}>Khanpur</option>
                    <option value={5889}>Kharela</option>
                    <option value={5890}>Khargupur</option>
                    <option value={5891}>Khariya</option>
                    <option value={5892}>Kharkhoda</option>
                    <option value={5893}>Khatauli</option>
                    <option value={5894}>Khatauli Rural</option>
                    <option value={5895}>Khekada</option>
                    <option value={5896}>Kheragarh</option>
                    <option value={5897}>Kheri</option>
                    <option value={5898}>Kheta Sarai</option>
                    <option value={5899}>Khudaganj</option>
                    <option value={5900}>Khurja</option>
                    <option value={5901}>Khutar</option>
                    <option value={5902}>Kiraoli</option>
                    <option value={5903}>Kiratpur</option>
                    <option value={5904}>Kishni</option>
                    <option value={5905}>Kishunpur</option>
                    <option value={5906}>Kithaur</option>
                    <option value={5907}>Koeripur</option>
                    <option value={5908}>Konch</option>
                    <option value={5909}>Kopaganj</option>
                    <option value={5910}>Kora Jahanabad</option>
                    <option value={5911}>Koraon</option>
                    <option value={5912}>Korwa</option>
                    <option value={5913}>Kosi Kalan</option>
                    <option value={5914}>Kota</option>
                    <option value={5915}>Kotra</option>
                    <option value={5916}>Kotwa</option>
                    <option value={5917}>Kul Pahar</option>
                    <option value={5918}>Kunda</option>
                    <option value={5919}>Kundarki</option>
                    <option value={5920}>Kunwargaon</option>
                    <option value={5921}>Kuraoli</option>
                    <option value={5922}>Kurara</option>
                    <option value={5923}>Kursath</option>
                    <option value={5924}>Kursath</option>
                    <option value={5925}>Kurthi Jafarpur</option>
                    <option value={5926}>Kushinagar</option>
                    <option value={5927}>Kusmara</option>
                    <option value={5928}>Laharpur</option>
                    <option value={5929}>Lakhimpur</option>
                    <option value={5930}>Lakhna</option>
                    <option value={5931}>Lal Gopalganj Nindaura</option>
                    <option value={5932}>Lalganj</option>
                    <option value={5933}>Lalitpur</option>
                    <option value={5934}>Lar</option>
                    <option value={5935}>Lawar NP</option>
                    <option value={5936}>Ledwa Mahua</option>
                    <option value={5937}>Lohta</option>
                    <option value={5938}>Loni</option>
                    <option value={5939}>Lucknow</option>
                    <option value={5940}>Lucknow</option>
                    <option value={5941}>Machhlishahr</option>
                    <option value={5942}>Madhoganj</option>
                    <option value={5943}>Madhogarh</option>
                    <option value={5944}>Maghar</option>
                    <option value={5945}>Mahaban</option>
                    <option value={5946}>Mahmudabad</option>
                    <option value={5947}>Mahoba</option>
                    <option value={5948}>Maholi</option>
                    <option value={5949}>Mahona</option>
                    <option value={5950}>Mahrajganj</option>
                    <option value={5951}>Mahrajganj</option>
                    <option value={5952}>Mahrajganj</option>
                    <option value={5953}>Mahroni</option>
                    <option value={5954}>Mailani</option>
                    <option value={5955}>Mainpuri</option>
                    <option value={5956}>Majhara Pipar Ehatmali</option>
                    <option value={5957}>Majhauli Raj</option>
                    <option value={5958}>Malihabad</option>
                    <option value={5959}>Mallawan</option>
                    <option value={5960}>Mandawar</option>
                    <option value={5961}>Manikpur</option>
                    <option value={5962}>Manikpur Sarhat</option>
                    <option value={5963}>Maniyar</option>
                    <option value={5964}>Manjhanpur</option>
                    <option value={5965}>Mankapur</option>
                    <option value={5966}>Marehra</option>
                    <option value={5967}>Mariahu</option>
                    <option value={5968}>Maruadih Rly. Settlement</option>
                    <option value={5969}>Maswasi</option>
                    <option value={5970}>Mataundh</option>
                    <option value={5971}>Mathura</option>
                    <option value={5972}>Mathura</option>
                    <option value={5973}>Mau Aima</option>
                    <option value={5974}>Maudaha</option>
                    <option value={5975}>Maunath Bhanjan</option>
                    <option value={5976}>Mauranipur</option>
                    <option value={5977}>Maurawan</option>
                    <option value={5978}>Mawana</option>
                    <option value={5979}>Meerut</option>
                    <option value={5980}>Meerut</option>
                    <option value={5981}>Mehdawal</option>
                    <option value={5982}>Mehnagar</option>
                    <option value={5983}>Mendu</option>
                    <option value={5984}>Milak</option>
                    <option value={5985}>Miranpur</option>
                    <option value={5986}>Mirganj</option>
                    <option value={5987}>Mirzapur-cum-Vindhyachal</option>
                    <option value={5988}>Misrikh-cum-Neemsar</option>
                    <option value={5989}>Modinagar</option>
                    <option value={5990}>Mogra Badshahpur</option>
                    <option value={5991}>Mohammadabad</option>
                    <option value={5992}>Mohammadabad</option>
                    <option value={5993}>Mohammadi</option>
                    <option value={5994}>Mohan</option>
                    <option value={5995}>Mohanpur</option>
                    <option value={5996}>Mohiuddinpur</option>
                    <option value={5997}>Moradabad</option>
                    <option value={5998}>Moth</option>
                    <option value={5999}>Mubarakpur</option>
                    <option value={6000}>Mughalsarai</option>
                    <option value={6001}>Mughalsarai Rly. Settlement</option>
                    <option value={6002}>Muhammadabad</option>
                    <option value={6003}>Mukrampur Khema</option>
                    <option value={6004}>Mundera Bazar</option>
                    <option value={6005}>Mundia</option>
                    <option value={6006}>Muradnagar</option>
                    <option value={6007}>Mursan</option>
                    <option value={6008}>Musafirkhana</option>
                    <option value={6009}>Muzaffarnagar</option>
                    <option value={6010}>Nadigaon</option>
                    <option value={6011}>Nagina</option>
                    <option value={6012}>Nagram</option>
                    <option value={6013}>Nai Bazar</option>
                    <option value={6014}>Nainana Jat</option>
                    <option value={6015}>Najibabad</option>
                    <option value={6016}>Nakur</option>
                    <option value={6017}>Nanauta</option>
                    <option value={6018}>Nandgaon</option>
                    <option value={6019}>Nanpara</option>
                    <option value={6020}>Naraini</option>
                    <option value={6021}>Narauli</option>
                    <option value={6022}>Naraura</option>
                    <option value={6023}>Naugawan Sadat</option>
                    <option value={6024}>Nautanwa</option>
                    <option value={6025}>Nawabganj</option>
                    <option value={6026}>Nawabganj</option>
                    <option value={6027}>Nawabganj</option>
                    <option value={6028}>Nawabganj</option>
                    <option value={6029}>Nehtaur</option>
                    <option value={6030}>Nichlaul</option>
                    <option value={6031}>Nidhauli Kalan</option>
                    <option value={6032}>Niwari</option>
                    <option value={6033}>Nizamabad</option>
                    <option value={6034}>Noida</option>
                    <option value={6035}>Noorpur</option>
                    <option value={6036}>Northern Rly. Colony</option>
                    <option value={6037}>Nyoria Husainpur</option>
                    <option value={6038}>Nyotini</option>
                    <option value={6039}>Obra</option>
                    <option value={6040}>Oel Dhakwa</option>
                    <option value={6041}>Orai</option>
                    <option value={6042}>Oran</option>
                    <option value={6043}>Ordnance Factory Muradnagar</option>
                    <option value={6044}>Pachperwa</option>
                    <option value={6045}>Padrauna</option>
                    <option value={6046}>Pahasu</option>
                    <option value={6047}>Paintepur</option>
                    <option value={6048}>Pali</option>
                    <option value={6049}>Pali</option>
                    <option value={6050}>Palia Kalan</option>
                    <option value={6051}>Parasi</option>
                    <option value={6052}>Parichha</option>
                    <option value={6053}>Parikshitgarh</option>
                    <option value={6054}>Parsadepur</option>
                    <option value={6055}>Patala</option>
                    <option value={6056}>Patiyali</option>
                    <option value={6057}>Patti</option>
                    <option value={6058}>Phalauda</option>
                    <option value={6059}>Phaphund</option>
                    <option value={6060}>Phulpur</option>
                    <option value={6061}>Phulpur</option>
                    <option value={6062}>Phulwaria</option>
                    <option value={6063}>Pihani</option>
                    <option value={6064}>Pilibhit</option>
                    <option value={6065}>Pilkhana</option>
                    <option value={6066}>Pilkhuwa</option>
                    <option value={6067}>Pinahat</option>
                    <option value={6068}>Pipalsana Chaudhari</option>
                    <option value={6069}>Pipiganj</option>
                    <option value={6070}>Pipraich</option>
                    <option value={6071}>Pipri</option>
                    <option value={6072}>Powayan</option>
                    <option value={6073}>Pratapgarh City</option>
                    <option value={6074}>Pukhrayan</option>
                    <option value={6075}>Puranpur</option>
                    <option value={6076}>Purdilnagar</option>
                    <option value={6077}>Purquazi</option>
                    <option value={6078}>Purwa</option>
                    <option value={6079}>Qasimpur Power House Colony</option>
                    <option value={6080}>Rabupura</option>
                    <option value={6081}>Radhakund</option>
                    <option value={6082}>Rae Bareli</option>
                    <option value={6083}>Raja Ka Rampur</option>
                    <option value={6084}>Rajapur</option>
                    <option value={6085}>Ramkola</option>
                    <option value={6086}>Ramnagar</option>
                    <option value={6087}>Ramnagar</option>
                    <option value={6088}>Rampur</option>
                    <option value={6089}>Rampur Bhawanipur</option>
                    <option value={6090}>Rampur Karkhana</option>
                    <option value={6091}>Rampur Maniharan</option>
                    <option value={6092}>Rampura</option>
                    <option value={6093}>Ranipur</option>
                    <option value={6094}>Rashidpur Garhi</option>
                    <option value={6095}>Rasra</option>
                    <option value={6096}>Rasulabad</option>
                    <option value={6097}>Rath</option>
                    <option value={6098}>Raya</option>
                    <option value={6099}>Renukoot</option>
                    <option value={6100}>Reoti</option>
                    <option value={6101}>Richha</option>
                    <option value={6102}>Risia Bazar</option>
                    <option value={6103}>Rithora</option>
                    <option value={6104}>Rly. Settlement Roza</option>
                    <option value={6105}>Robertsganj</option>
                    <option value={6106}>Rudauli</option>
                    <option value={6107}>Rudayan</option>
                    <option value={6108}>Rudrapur</option>
                    <option value={6109}>Rura</option>
                    <option value={6110}>Rustamnagar Sahaspur</option>
                    <option value={6111}>Sadabad</option>
                    <option value={6112}>Sadat</option>
                    <option value={6113}>Safipur</option>
                    <option value={6114}>Sahanpur</option>
                    <option value={6115}>Saharanpur</option>
                    <option value={6116}>Sahaspur</option>
                    <option value={6117}>Sahaswan</option>
                    <option value={6118}>Sahatwar</option>
                    <option value={6119}>Sahawar</option>
                    <option value={6120}>Sahjanwa</option>
                    <option value={6121}>Sahpau NP</option>
                    <option value={6122}>Saidpur</option>
                    <option value={6123}>Saidpur</option>
                    <option value={6124}>Sainthal</option>
                    <option value={6125}>Saiyad Raja</option>
                    <option value={6126}>Sakhanu</option>
                    <option value={6127}>Sakit</option>
                    <option value={6128}>Salarpur Khadar</option>
                    <option value={6129}>Salempur</option>
                    <option value={6130}>Salon</option>
                    <option value={6131}>Sambhal</option>
                    <option value={6132}>Samdhan</option>
                    <option value={6133}>Samthar</option>
                    <option value={6134}>Sandi</option>
                    <option value={6135}>Sandila</option>
                    <option value={6136}>Sarai Aquil</option>
                    <option value={6137}>Sarai Mir</option>
                    <option value={6138}>Sardhana</option>
                    <option value={6139}>Sarila</option>
                    <option value={6140}>Sarsawan</option>
                    <option value={6141}>Sasni</option>
                    <option value={6142}>Satrikh</option>
                    <option value={6143}>Saunkh</option>
                    <option value={6144}>Saurikh</option>
                    <option value={6145}>Seohara</option>
                    <option value={6146}>Sewalkhas</option>
                    <option value={6147}>Sewarhi</option>
                    <option value={6148}>Shahabad</option>
                    <option value={6149}>Shahabad</option>
                    <option value={6150}>Shahganj</option>
                    <option value={6151}>Shahi</option>
                    <option value={6152}>Shahjahanpur</option>
                    <option value={6153}>Shahjahanpur</option>
                    <option value={6154}>Shahpur</option>
                    <option value={6155}>Shamli</option>
                    <option value={6156}>Shamsabad</option>
                    <option value={6157}>Shamsabad</option>
                    <option value={6158}>Shankargarh</option>
                    <option value={6159}>Shergarh</option>
                    <option value={6160}>Sherkot</option>
                    <option value={6161}>Shikarpur</option>
                    <option value={6162}>Shikohabad</option>
                    <option value={6163}>Shishgarh</option>
                    <option value={6164}>Shivdaspur</option>
                    <option value={6165}>Shivli</option>
                    <option value={6166}>Shivrajpur</option>
                    <option value={6167}>Shohratgarh</option>
                    <option value={6168}>Siana</option>
                    <option value={6169}>Siddhaur</option>
                    <option value={6170}>Sidhauli</option>
                    <option value={6171}>Sidhpura</option>
                    <option value={6172}>Sikanderpur</option>
                    <option value={6173}>Sikanderpur</option>
                    <option value={6174}>Sikandra</option>
                    <option value={6175}>Sikandra Rao</option>
                    <option value={6176}>Sikandrabad</option>
                    <option value={6177}>Singahi Bhiraura</option>
                    <option value={6178}>Sirathu</option>
                    <option value={6179}>Sirauli</option>
                    <option value={6180}>Sirsa</option>
                    <option value={6181}>Sirsaganj</option>
                    <option value={6182}>Sirsi</option>
                    <option value={6183}>Sisauli</option>
                    <option value={6184}>Siswa Bazar</option>
                    <option value={6185}>Sitapur</option>
                    <option value={6186}>Som</option>
                    <option value={6187}>Soron</option>
                    <option value={6188}>Suar</option>
                    <option value={6189}>Sukhmalpur Nizamabad</option>
                    <option value={6190}>Sultanpur</option>
                    <option value={6191}>Sumerpur</option>
                    <option value={6192}>Suriyawan</option>
                    <option value={6193}>Swamibagh</option>
                    <option value={6194}>Talbehat</option>
                    <option value={6195}>Talgram</option>
                    <option value={6196}>Tambaur-cum-Ahmadabad</option>
                    <option value={6197}>Tanda</option>
                    <option value={6198}>Tanda</option>
                    <option value={6199}>Tatarpur Lallu</option>
                    <option value={6200}>Tetri Bazar</option>
                    <option value={6201}>Thakurdwara</option>
                    <option value={6202}>Thana Bhawan</option>
                    <option value={6203}>Thiriya Nizamat Khan</option>
                    <option value={6204}>Tikait Nagar</option>
                    <option value={6205}>Tikri</option>
                    <option value={6206}>Tilhar</option>
                    <option value={6207}>Tindwari</option>
                    <option value={6208}>Tirwaganj</option>
                    <option value={6209}>Titron</option>
                    <option value={6210}>Tondi Fatehpur</option>
                    <option value={6211}>Tulsipur</option>
                    <option value={6212}>Tundla</option>
                    <option value={6213}>Tundla Kham</option>
                    <option value={6214}>Tundla Rly. Colony</option>
                    <option value={6215}>Ugu</option>
                    <option value={6216}>Ujhani</option>
                    <option value={6217}>Ujhari</option>
                    <option value={6218}>Umri</option>
                    <option value={6219}>Umri Kalan</option>
                    <option value={6220}>Un</option>
                    <option value={6221}>Unchahar</option>
                    <option value={6222}>Unnao</option>
                    <option value={6223}>Usawan</option>
                    <option value={6224}>Usehat</option>
                    <option value={6225}>Utraula</option>
                    <option value={6226}>Varanasi</option>
                    <option value={6227}>Varanasi</option>
                    <option value={6228}>Vijaigarh</option>
                    <option value={6229}>Vrindavan</option>
                    <option value={6230}>Warhapur</option>
                    <option value={6231}>Wazirganj</option>
                    <option value={6232}>Zaidpur</option>
                    <option value={6233}>Zamania</option>
                    <option value={49380}>LALGANJ (UP)</option>
                    <option value={49443}>PURQURBAN AGGLOMERATIONZI</option>
                    <option value="Tilhar shahjahanpur">
                      Tilhar shahjahanpur
                    </option>
                    <option value={49474}>SHAHABAD – HARDOI</option>
                    <option value={49475}>SHAHABAD – RAMPUR</option>
                    <option value={49476}>SHAMSABAD – AGRA</option>
                    <option value={49477}>SHAMSABAD - FARRUKHABAD</option>
                    <option value={49480}>SHIKARPUR – BULANDSHAHR</option>
                    <option value={49490}>SURBAN AGGLOMERATIONR</option>
                    <option value={10025}>Chakanandu</option>
                    <option value={10039}>Gangdhari</option>
                    <option value={10061}>Meerapur Basahi</option>
                    <option value={10084}>Manapur</option>
                    <option value={10100}>Ramgarh Banohi</option>
                    <option value={10118}>Khyokhar</option>
                    <option value={10127}>Birsinghpur</option>
                    <option value={10129}>Pilakhani</option>
                    <option value={10136}>Kheeri</option>
                    <option value={10140}>Pipnar</option>
                    <option value={10151}>Shekhupura</option>
                    <option value={10153}>Kanker Kheera</option>
                    <option value={10164}>Paigu</option>
                    <option value={282005}>AGRA</option>
                    <option value="ATA">ATA</option>
                    <option value="GREATER NOIDA">GREATER NOIDA</option>
                    <option value={8077}>ghaziabad</option>
                    <option value={8079}>indrapuram</option>
                    <option value="Varanasi’s">Varanasi’s</option>
                    <option value="Raya mathura">Raya mathura</option>
                    <option value="Barabanki">Barabanki</option>
                    <option value="Bhaluwahi">Bhaluwahi</option>
                    <option value="VARANSI">VARANSI</option>
                    <option value="Varanasi District">Varanasi District</option>
                    <option value="Raebareli">Raebareli</option>
                    <option value="Mau">Mau</option>
                    <option value="Lakhimpur kheri">Lakhimpur kheri</option>
                    <option value="Sonebhadra">Sonebhadra</option>
                    <option value="Rupaidiha">Rupaidiha</option>
                    <option value="MAUNATHBHANJAN">MAUNATHBHANJAN</option>
                    <option value="Dist Ghazipur">Dist Ghazipur</option>
                    <option value="Varanasi 22">Varanasi 22</option>
                    <option value="CHANDPUR / BIJNOR">CHANDPUR / BIJNOR</option>
                    <option value="Pratapgarh">Pratapgarh</option>
                    <option value="Dafi">Dafi</option>
                    <option value="GAUTAM BUDDHA NAGAR">
                      GAUTAM BUDDHA NAGAR
                    </option>
                    <option value="Prayagraj">Prayagraj</option>
                    <option value="Zamania Ghazipur">Zamania Ghazipur</option>
                    <option value="Hgazipur">Hgazipur</option>
                    <option value="Gaziabad">Gaziabad</option>
                    <option value="Lucknow, India">Lucknow, India</option>
                    <option value="Anand nagar">Anand nagar</option>
                    <option value="Kalanaur">Kalanaur</option>
                    <option value="Nirala Nagar">Nirala Nagar</option>
                    <option value="Pharenda">Pharenda</option>
                    <option value="Mirzapur">Mirzapur</option>
                    <option value="Kanpur Nagar">Kanpur Nagar</option>
                    <option value="Sector 143 Noida">Sector 143 Noida</option>
                    <option value="Domariyaganj">Domariyaganj</option>
                    <option value="Kanpur Cannt">Kanpur Cannt</option>
                    <option value="Greater Noida West">
                      Greater Noida West
                    </option>
                    <option value="Varanasi DLW">Varanasi DLW</option>
                    <option value="Mirzapur City">Mirzapur City</option>
                    <option value="Alpha Greater Noida">
                      Alpha Greater Noida
                    </option>
                    <option value="Village">Village</option>
                    <option value="Chibbramau">Chibbramau</option>
                    <option value="Nodia">Nodia</option>
                    <option value="Raamprstha">Raamprstha</option>
                    <option value="Jaswantnagr etawah">
                      Jaswantnagr etawah
                    </option>
                    <option value="GAUTAM BUDDH NAGAR">
                      GAUTAM BUDDH NAGAR
                    </option>
                    <option value="Jhunsi Prayagraj">Jhunsi Prayagraj</option>
                    <option value="ALIGARH UP 202001">ALIGARH UP 202001</option>
                    <option value="Gr Noida West">Gr Noida West</option>
                    <option value="Jalal Nagar">Jalal Nagar</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Barielly">Barielly</option>
                    <option value="auriya">auriya</option>
                    <option value="Vasundhara">Vasundhara</option>
                    <option value="Noid">Noid</option>
                    <option value="Ithaira">Ithaira</option>
                    <option value="Kasumara">Kasumara</option>
                    <option value="Paryagraj 4b">Paryagraj 4b</option>
                    <option value="Bulandshahar">Bulandshahar</option>
                    <option value="Gola Gokaran Nath">Gola Gokaran Nath</option>
                    <option value="Utter pradesh">Utter pradesh</option>
                    <option value="Chitrakoot">Chitrakoot</option>
                    <option value="ssad">ssad</option>
                    <option value="Farrukhabad">Farrukhabad</option>
                    <option value="Bagpat">Bagpat</option>
                    <option value="Kaushambi">Kaushambi</option>
                    <option value="Ambedkar Nagar">Ambedkar Nagar</option>
                    <option value="Jyotiba Phule Nagar">
                      Jyotiba Phule Nagar
                    </option>
                    <option value="Meerut Division">Meerut Division</option>
                    <option value="Malpura">Malpura</option>
                    <option value="mahrajgang">mahrajgang</option>
                    <option value="Cholapur">Cholapur</option>
                    <option value="Siddharthnagar">Siddharthnagar</option>
                    <option value="G.b nagar">G.b nagar</option>
                    <option value="Shahajhanpur">Shahajhanpur</option>
                    <option value="Gorkhapur">Gorkhapur</option>
                    <option value="Bagheji ">Bagheji </option>
                    <option value="Peppeganj">Peppeganj</option>
                    <option value="Bagadpur">Bagadpur</option>
                    <option value="Kishni, Mainpuri">Kishni, Mainpuri</option>
                    <option value="Phaphamau">Phaphamau</option>
                    <option value="Bijnor District">Bijnor District</option>
                    <option value="Renuloot">Renuloot</option>
                    <option value="Varanasi West">Varanasi West</option>
                    <option value="Ait, bilayan">Ait, bilayan</option>
                    <option value="Sant Kabir Nagar">Sant Kabir Nagar</option>
                    <option value="Allahbad">Allahbad</option>
                    <option value="Raibareli">Raibareli</option>
                    <option value="Deoria Sadar">Deoria Sadar</option>
                    <option value="Muradabad">Muradabad</option>
                    <option value="Gauriganj">Gauriganj</option>
                    <option value="Gahmar">Gahmar</option>
                    <option value="Noida Extension">Noida Extension</option>
                    <option value="Jalalpur Akbarpur">Jalalpur Akbarpur</option>
                    <option value="Sahibabad Ghaziabad">
                      Sahibabad Ghaziabad
                    </option>
                    <option value="Indirapuram">Indirapuram</option>
                    <option value="Bhadohi Nagar Palika">
                      Bhadohi Nagar Palika
                    </option>
                    <option value="Aligash">Aligash</option>
                    <option value="Ghaziabad, Sahibabad">
                      Ghaziabad, Sahibabad
                    </option>
                    <option value="Dhmapur">Dhmapur</option>
                    <option value="Jaswantnagr , etawah">
                      Jaswantnagr , etawah
                    </option>
                    <option value="Dashauli">Dashauli</option>
                    <option value="Kanpur Dehat">Kanpur Dehat</option>
                    <option value="Saha">Saha</option>
                    <option value="Sonbhadra">Sonbhadra</option>
                    <option value="SHASTRI NAGAR">SHASTRI NAGAR</option>
                    <option value="gzb">gzb</option>
                    <option value="Sant Ravidas Nagar">
                      Sant Ravidas Nagar
                    </option>
                    <option value="Sri Vrindavan dham">
                      Sri Vrindavan dham
                    </option>
                    <option value="Colonejganj">Colonejganj</option>
                    <option value="KIRAULI">KIRAULI</option>
                    <option value="Pilkhuwa Hapur">Pilkhuwa Hapur</option>
                    <option value="Chiraiyakot">Chiraiyakot</option>
                    <option value="Lal Gopalganj">Lal Gopalganj</option>
                    <option value="Lucknow Division">Lucknow Division</option>
                    <option value="Kusingar">Kusingar</option>
                    <option value="Chubepur">Chubepur</option>
                    <option value="Noida sec 74">Noida sec 74</option>
                    <option value="Praygraj">Praygraj</option>
                    <option value="Jalalabadup">Jalalabadup</option>
                    <option value="Shivpur. Piprasi">Shivpur. Piprasi</option>
                    <option value="Lahuwar">Lahuwar</option>
                    <option value="Chanduli">Chanduli</option>
                    <option value="Anupshahar">Anupshahar</option>
                    <option value="Bareilly Faridpur">Bareilly Faridpur</option>
                    <option value="Gagalheri,SAHARANPUR">
                      Gagalheri,SAHARANPUR
                    </option>
                    <option value="Pyag raj">Pyag raj</option>
                    <option value="Makhiyaali">Makhiyaali</option>
                    <option value="Sector 121 , Noida">
                      Sector 121 , Noida
                    </option>
                    <option value="Baidpura">Baidpura</option>
                    <option value="Prayagaraj">Prayagaraj</option>
                    <option value="sharnpur">sharnpur</option>
                    <option value="Lambhua">Lambhua</option>
                    <option value="Sonhul">Sonhul</option>
                    <option value="Agra Division">Agra Division</option>
                    <option value="Tulsi pur">Tulsi pur</option>
                    <option value="Enhauna">Enhauna</option>
                    <option value="Kanpur ">Kanpur </option>
                    <option value="Sujroo">Sujroo</option>
                    <option value="Naugad">Naugad</option>
                    <option value="EtahEtah">EtahEtah</option>
                    <option value="Noida ">Noida </option>
                    <option value="Tawakkalpur nagra">Tawakkalpur nagra</option>
                    <option value="Badaun">Badaun</option>
                    <option value="Brijmanganj">Brijmanganj</option>
                    <option value="Panchyam perumbavoor">
                      Panchyam perumbavoor
                    </option>
                    <option value="Faizabad, Ayodhya">Faizabad, Ayodhya</option>
                    <option value="Meerat">Meerat</option>
                    <option value="Palani">Palani</option>
                    <option value="MalihabadUnnao">MalihabadUnnao</option>
                    <option value="Kawal muzaffarnagar">
                      Kawal muzaffarnagar
                    </option>
                    <option value="Shamil">Shamil</option>
                    <option value="Gaziyabad">Gaziyabad</option>
                    <option value="Sanga Reddy">Sanga Reddy</option>
                    <option value="Kauriram">Kauriram</option>
                    <option value="Jattari">Jattari</option>
                    <option value="Fatehpur sikari">Fatehpur sikari</option>
                    <option value="Jawer">Jawer</option>
                    <option value="Pampore">Pampore</option>
                    <option value="Goruvanahalli">Goruvanahalli</option>
                    <option value="tibra road">tibra road</option>
                    <option value="Chhibon">Chhibon</option>
                    <option value="Bimdki">Bimdki</option>
                    <option value="Chunnar">Chunnar</option>
                    <option value="City-Mughalsarai">City-Mughalsarai</option>
                    <option value="Meerapur">Meerapur</option>
                    <option value="MODIMH">MODIMH</option>
                    <option value="Haldharpur">Haldharpur</option>
                    <option value="Padarauna">Padarauna</option>
                    <option value="Dildar Nagar">Dildar Nagar</option>
                    <option value="Machhali Shahar">Machhali Shahar</option>
                    <option value="sukhpura, ballia ">sukhpura, ballia </option>
                    <option value="G.Noida">G.Noida</option>
                    <option value="Aunrihar">Aunrihar</option>
                    <option value="Pilona aligarh">Pilona aligarh</option>
                    <option value="Ambuj Nagar">Ambuj Nagar</option>
                    <option value="Royal hotel">Royal hotel</option>
                    <option value="Dist Moga">Dist Moga</option>
                    <option value="Shahjhanpur">Shahjhanpur</option>
                    <option value="Birbhanpur">Birbhanpur</option>
                    <option value="Nighasan">Nighasan</option>
                    <option value="Meerut city">Meerut city</option>
                    <option value="Pillhuwa">Pillhuwa</option>
                    <option value="Naugarh">Naugarh</option>
                    <option value="buxar">buxar</option>
                    <option value="बलिया ">बलिया </option>
                    <option value="Aayodha">Aayodha</option>
                    <option value="Up">Up</option>
                    <option value="Modinagr">Modinagr</option>
                    <option value="Vasai East">Vasai East</option>
                    <option value="Hazipur Bhatola">Hazipur Bhatola</option>
                    <option value="Kidwai nagar kanpur">
                      Kidwai nagar kanpur
                    </option>
                    <option value="Karula">Karula</option>
                    <option value="baliya">baliya</option>
                    <option value="Shahibabad ghaziabad">
                      Shahibabad ghaziabad
                    </option>
                    <option value="Nohjeel">Nohjeel</option>
                    <option value="Mughalsraye">Mughalsraye</option>
                    <option value="Dudahi">Dudahi</option>
                    <option value="Malipur">Malipur</option>
                    <option value="Amroha didauli">Amroha didauli</option>
                    <option value="Gola Gokarnath">Gola Gokarnath</option>
                    <option value="Vattepally">Vattepally</option>
                    <option value="mannat hospital">mannat hospital</option>
                    <option value="Shivam hospital">Shivam hospital</option>
                    <option value="Kheri Town">Kheri Town</option>
                    <option value="gaon apayal">gaon apayal</option>
                    <option value="Badlapur">Badlapur</option>
                    <option value="Dibai bulandshahar">
                      Dibai bulandshahar
                    </option>
                    <option value="भरथना">भरथना</option>
                    <option value="Modinag">Modinag</option>
                    <option value="ghazipur ">ghazipur </option>
                    <option value="Modi nagar">Modi nagar</option>
                    <option value="Itava">Itava</option>
                    <option value="ghaziabad shahebabad">
                      ghaziabad shahebabad
                    </option>
                    <option value="Siddharth Nagar">Siddharth Nagar</option>
                    <option value="Bhadurganj">Bhadurganj</option>
                    <option value="Ghosi Mau">Ghosi Mau</option>
                    <option value="Ganjdundwara kasganj">
                      Ganjdundwara kasganj
                    </option>
                    <option value="Lucknow ">Lucknow </option>
                    <option value="Fajilnagar">Fajilnagar</option>
                    <option value="Dolas">Dolas</option>
                    <option value="Govandi">Govandi</option>
                    <option value="Moradabad ">Moradabad </option>
                    <option value="Telibagh lucknow">Telibagh lucknow</option>
                    <option value="Sahibabad">Sahibabad</option>
                    <option value="Soraon">Soraon</option>
                    <option value="I ghaziabad">I ghaziabad</option>
                    <option value="Amroha ">Amroha </option>
                    <option value="Madhaugarh">Madhaugarh</option>
                    <option value="Rath ">Rath </option>
                    <option value="Tarkulwa">Tarkulwa</option>
                    <option value="Mavi">Mavi</option>
                    <option value="Khalibad">Khalibad</option>
                    <option value="Yakutpur mavi">Yakutpur mavi</option>
                    <option value="Mahobkanth">Mahobkanth</option>
                    <option value="Nandav">Nandav</option>
                    <option value="azamgarh ">azamgarh </option>
                    <option value="Bulandshahr ">Bulandshahr </option>
                    <option value="Chitbadagaon">Chitbadagaon</option>
                    <option value="Aurai">Aurai</option>
                    <option value="Panipat">Panipat</option>
                    <option value="Kankarbagh, patna">Kankarbagh, patna</option>
                    <option value="Nazibabad">Nazibabad</option>
                    <option value="Kasia">Kasia</option>
                    <option value="Devriya bhatni">Devriya bhatni</option>
                    <option value="Dudhinagar">Dudhinagar</option>
                    <option value="Kulesara">Kulesara</option>
                    <option value="Ballia police line ">
                      Ballia police line{" "}
                    </option>
                    <option value="Loni ghaziabad">Loni ghaziabad</option>
                    <option value="Sikandar Rao hathras">
                      Sikandar Rao hathras
                    </option>
                    <option value="Sambhal up">Sambhal up</option>
                    <option value="Meergganj">Meergganj</option>
                    <option value="Muzaafarnagar">Muzaafarnagar</option>
                    <option value="Noids">Noids</option>
                    <option value="Greater Noida West~">
                      Greater Noida West~
                    </option>
                    <option value="Ballia fefana">Ballia fefana</option>
                    <option value="Diibiyapurna">Diibiyapurna</option>
                    <option value="Modinagrr">Modinagrr</option>
                    <option value="Modinager">Modinager</option>
                    <option value="Shri ganpati store">
                      Shri ganpati store
                    </option>
                    <option value="Gfx">Gfx</option>
                    <option value="Modenghar niwari">Modenghar niwari</option>
                    <option value="Town area">Town area</option>
                    <option value="Rauna khurd">Rauna khurd</option>
                    <option value="Kaithawali">Kaithawali</option>
                    <option value="Govindpuri">Govindpuri</option>
                    <option value="Pur pakadi ">Pur pakadi </option>
                    <option value={62195}>OTHER</option>
                    <option value="ballia ">ballia </option>
                    <option value="Kamalpur">Kamalpur</option>
                    <option value="Sharanpur">Sharanpur</option>
                    <option value="Dharamsingwa">Dharamsingwa</option>
                    <option value="Hodal">Hodal</option>
                    <option value="Baskhari">Baskhari</option>
                    <option value="phaphena ">phaphena </option>
                    <option value="Shahganj bhadi khas">
                      Shahganj bhadi khas
                    </option>
                    <option value="3number market">3number market</option>
                    <option value="Pakbara ,Moradabad">
                      Pakbara ,Moradabad
                    </option>
                    <option value="Paryagraj">Paryagraj</option>
                    <option value="Modi agar">Modi agar</option>
                    <option value="ghaziabaf">ghaziabaf</option>
                    <option value="Bindki , Fatehpur">Bindki , Fatehpur</option>
                    <option value="Modinagat">Modinagat</option>
                    <option value="MAIGALGANJ">MAIGALGANJ</option>
                    <option value="sukhpura">sukhpura</option>
                    <option value="Gautambuddha Nagar">
                      Gautambuddha Nagar
                    </option>
                    <option value="KOSI KALAN MATHURA">
                      KOSI KALAN MATHURA
                    </option>
                    <option value="Maharajgang">Maharajgang</option>
                    <option value={231001}>231001</option>
                    <option value="None">None</option>
                    <option value="Joya , Amroha">Joya , Amroha</option>
                    <option value="Barhalganj gorakhpur">
                      Barhalganj gorakhpur
                    </option>
                    <option value="Varasanasi">Varasanasi</option>
                    <option value="Sona enclave">Sona enclave</option>
                    <option value="Machlisher">Machlisher</option>
                    <option value="Sahwawar">Sahwawar</option>
                    <option value="Village (Naunangli)">
                      Village (Naunangli)
                    </option>
                    <option value="Gadurahi bazar">Gadurahi bazar</option>
                    <option value="Rawana shikarpur">Rawana shikarpur</option>
                    <option value="Gola">Gola</option>
                  </select>
                  <span
                    className="select2 select2-container select2-container--default"
                    dir="ltr"
                    data-select2-id={2313}
                    style={{ width: "172.5px" }}
                  >
                    <span className="selection">
                      <span
                        className="select2-selection select2-selection--single"
                        role="combobox"
                        aria-haspopup="true"
                        aria-expanded="false"
                        tabIndex={0}
                        aria-labelledby="select2-cityCode0-container"
                      >
                        <span
                          className="select2-selection__rendered"
                          id="select2-cityCode0-container"
                          role="textbox"
                          aria-readonly="true"
                          title="Gorakhpur"
                        >
                          Gorakhpur
                        </span>
                        <span
                          className="select2-selection__arrow"
                          role="presentation"
                        >
                          <b role="presentation" />
                        </span>
                      </span>
                    </span>
                    <span className="dropdown-wrapper" aria-hidden="true" />
                  </span>
                  <small
                    style={{ display: "none" }}
                    className="help-block"
                    data-fv-validator="notEmpty"
                    data-fv-for="contactAddressVos[0].cityCode"
                    data-fv-result="VALID"
                  >
                    select any City
                  </small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="">ZIP/Postal Code</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="contactAddressVos[0].pinCode"
                    placeholder="ZIP/Postal code"
                    defaultValue=""
                    data-fv-field="contactAddressVos[0].pinCode"
                  />
                  <small
                    style={{ display: "none" }}
                    className="help-block"
                    data-fv-validator="stringLength"
                    data-fv-for="contactAddressVos[0].pinCode"
                    data-fv-result="NOT_VALIDATED"
                  >
                    The ZIP/Postal code can only consist 6 digit number
                  </small>
                  <small
                    style={{ display: "none" }}
                    className="help-block"
                    data-fv-validator="regexp"
                    data-fv-for="contactAddressVos[0].pinCode"
                    data-fv-result="NOT_VALIDATED"
                  >
                    The ZIP/Postal code can only consist numeric value
                  </small>
                </div>
              </div>
            </div>
          </Container>
          <ModalFooter>
            <button
              type="button"
              id="cancel_contact"
              className="btn btn-sm btn-secondary"
              onClick={toggle}
            >
              Close
            </button>
            <button
              type="submit"
              id="save_contact"
              className="btn btn-sm btn-primary"
            >
              Save
            </button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  );
}