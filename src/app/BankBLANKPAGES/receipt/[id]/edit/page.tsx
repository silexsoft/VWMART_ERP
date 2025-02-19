"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Page() {
  // *states
  const [transaction, setTransaction] = useState("cash");
  const [bankTransaction, setBankTransaction] = useState("cheque");
  const [paymentType, setPaymentType] = useState("on_account");
  const [bankPaymentType, setBankPaymentType] = useState("cheque");
  const [cashType, setCashType] = useState("");

  // **handler functions
  const handlePaymentTypeChange = (e: any) => {
    setPaymentType(e.target.value);
  };

  const handleBankPaymentType = (e: any) => {
    setBankPaymentType(e.target.value);
  };

  const handleTransactionChange = (e: any) => {
    setTransaction(e.target.value);
  };

  const handleBankTransactionChange = (e: any) => {
    setBankTransaction(e.target.value);
  };

  const handleCashType = (e: any) => {
    setCashType(e.target.value);
  };

  return (
    <DefaultLayout>
      <div className="m-content edit_receitp create_new">
        <form
          className="m-form m-form--state m-form--fit m-form--label-align-left fv-form fv-form-bootstrap"
          id="payment_form"
          action="/payment/save"
          method="post"
        >
          <div className="row">
            <div className="col-md-12">
              <div className="m-portlet mb-0">
                <div className="m-portlet__body card-body-sm">
                  <div className="row mb-3">
                    {/* transaction type radios */}

                    <div className="col-md-12 ">
                      <label className="m-radio m-radio--solid m-radio--brand m-widget4__title mr-2">
                        <input
                          type="radio"
                          name="paymentMode"
                          id="paymentModeCash"
                          value="cash"
                          checked={transaction == "cash" ? true : false}
                          onChange={handleTransactionChange}
                        />{" "}
                        Cash
                      </label>
                      <label className="m-radio m-radio--solid m-radio--brand m-widget4__title">
                        <input
                          type="radio"
                          name="paymentMode"
                          id="paymentModeBank"
                          value="bank"
                          checked={transaction == "bank" ? true : false}
                          onChange={handleTransactionChange}
                        />{" "}
                        Bank
                        <span></span>
                      </label>
                    </div>
                  </div>

                  {/* transaction type options */}

                  <div className="row mb-4">
                    {/* --CASH-- */}
                    {transaction == "cash" && (
                      <div className="col-md-3" id="cashHide">
                        <div className="form-group">
                          {/* for cash */}

                          <select
                            className="form-control m-select2 select2-hidden-accessible"
                            id="cashdropdown"
                            name="cashAccountCustomVo.accountCustomId"
                            value={cashType}
                            onChange={handleCashType}
                          >
                            <option value="">Select Cash Type</option>
                            <option value="1688942">
                              Cash <b>(Cash in Hand)</b>
                            </option>
                          </select>

                          {/* <span
                          className="select2 select2-container select2-container--default"
                          dir="ltr"
                        >
                          <span className="selection">
                            <span
                              className="select2-selection select2-selection--single"
                              role="combobox"
                              aria-haspopup="true"
                              aria-expanded="false"
                              aria-labelledby="select2-cashdropdown-container"
                            >
                              <span
                                className="select2-selection__rendered"
                                id="select2-cashdropdown-container"
                                role="textbox"
                                aria-readonly="true"
                              >
                                <span className="select2-selection__placeholder">
                                  Search Cash Type*
                                </span>
                              </span>
                              <span
                                className="select2-selection__arrow"
                                role="presentation"
                              >
                                <b role="presentation"></b>
                              </span>
                            </span>
                          </span> 
                          <span
                            className="dropdown-wrapper"
                            aria-hidden="true"
                          ></span>
                        </span>
                        */}
                        </div>
                      </div>
                    )}
                    {/* --BANK-- */}
                    {transaction == "bank" && (
                      <div className="col-md-6" id="bankHide">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <select
                                className="form-control m-select2 select2-hidden-accessible"
                                id="bankVo"
                                name="bankVo.bankId"
                                aria-hidden="true"
                              >
                                <option value="">Select Bank</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group d-flex flex-column">
                              <label className="m-radio m-radio--solid m-radio--brand m-widget4__title">
                                <input
                                  type="radio"
                                  name="bankpaymentmode"
                                  id="online"
                                  value="online"
                                  checked={
                                    bankTransaction == "online" ? true : false
                                  }
                                  onChange={handleBankTransactionChange}
                                />{" "}
                                Online
                                <span></span>
                              </label>
                              <label className="m-radio m-radio--solid m-radio--brand m-widget4__title">
                                <input
                                  type="radio"
                                  name="bankpaymentmode"
                                  id="cheque"
                                  value="cheque"
                                  checked={
                                    bankTransaction == "cheque" ? true : false
                                  }
                                  onChange={handleBankTransactionChange}
                                />{" "}
                                Cheque
                                <span></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-12">
                      <div className="form-group row mb-0">
                        <label className="col-md-12">
                          Select Party<span className="text-danger">*</span>
                        </label>
                        <div className="col-md-12">
                          <select
                            className="form-control m-select2 select2-hidden-accessible"
                            id="accountCustomId"
                            name="partyAccountVo.accountCustomId"
                            aria-hidden="true"
                            data-fv-field="partyAccountVo.accountCustomId"
                          >
                            <option value="">Select Party</option>
                          </select>

                          {/* <span
                            className="select2 select2-container select2-container--default select2-container--focus"
                            dir="ltr"
                          >
                            <span className="selection">
                              <span
                                className="select2-selection select2-selection--single"
                                role="combobox"
                                aria-haspopup="true"
                                aria-expanded="false"
                                aria-labelledby="select2-accountCustomId-container"
                              >
                                <span
                                  className="select2-selection__rendered"
                                  id="select2-accountCustomId-container"
                                  role="textbox"
                                  aria-readonly="true"
                                >
                                  <span className="select2-selection__placeholder">
                                    Select Party
                                  </span>
                                </span>
                                <span
                                  className="select2-selection__arrow"
                                  role="presentation"
                                >
                                  <b role="presentation"></b>
                                </span>
                              </span>
                            </span>
                            <span
                              className="dropdown-wrapper"
                              aria-hidden="true"
                            ></span>
                          </span> */}

                          <p className="small mt-1">
                            <i
                              data-toggle="m-tooltip"
                              data-width="auto"
                              className="m-form__heading-help-icon flaticon-info"
                              title=""
                              data-original-title="Income, Sales, Liabilities, Purchase Return => Credit-Debit &amp; Expenses, Assets, Purchase, Sales Return  => Debit-Credit"
                            ></i>
                            Closing Balance:{" "}
                            <i
                              className="fa fa-inr currency_style"
                              aria-hidden="true"
                            ></i>
                            <span id="closing_contact">0</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group row">
                        <label className="col-md-12">
                          Payment Date<span className="text-danger">*</span>
                        </label>
                        <div className="col-md-12">
                          <div className="input-group date">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              name="paymentDate"
                              id="paymentDate"
                              data-date-format="dd/mm/yyyy"
                              data-fv-field="paymentDate"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* when transaction is bank */}

                    {transaction == "bank" && (
                      <>
                        <div className="col-md-2 bankField">
                          <div className="form-group row">
                            {bankTransaction == "online" && (
                              <label id="transactiondate" className="col-md-12">
                                Transaction Date
                              </label>
                            )}
                            {bankTransaction == "cheque" && (
                              <label id="chequedate" className="col-md-12">
                                Cheque Date
                              </label>
                            )}

                            <div className="col-md-12">
                              <div className="input-group date">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  name="chequeDate"
                                  id="chequeDate"
                                  data-date-format="dd/mm/yyyy"
                                  data-fv-field="chequeDate"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2 bankField">
                          <div className="form-group row">
                            {bankTransaction == "cheque" && (
                              <label id="chequeno" className="col-md-12">
                                Cheque No.
                              </label>
                            )}

                            {bankTransaction == "online" && (
                              <label id="transactionno" className="col-md-12">
                                Transaction No.
                              </label>
                            )}
                            <div className="col-md-12">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="accountNo"
                                  name="accountNo"
                                  data-fv-field="accountNo"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-md-10">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-lg-4">
                            <label className="m-option card-body-sm mb-0 mr-0 rounded">
                              <span className="m-option__control">
                                <span className="m-radio m-radio--state-brand">
                                  {/* <input
                                    type="radio"
                                    name="type"
                                    id="onAccount"
                                    value="on_account"
                                    checked={
                                      paymentType == "on_account" ? true : false
                                    }
                                    onChange={handlePaymentTypeChange}
                                  />
                                  */}
                                  <i
                                    className="fa-solid fa-circle-check"
                                    style={
                                      paymentType == "on_account"
                                        ? {
                                            color: "#34bfa3",
                                          }
                                        : {}
                                    }
                                  ></i>
                                </span>
                              </span>
                              <span className="m-option__label">
                                <span className="m-option__head">
                                  <span className="m-option__title m-option__focus">
                                    On Account
                                  </span>
                                </span>
                                <span className="m-option__body font-weight-normal">
                                  Upfront Payment
                                </span>
                              </span>
                            </label>
                          </div>
                          <div className="col-lg-4">
                            <label className="m-option card-body-sm mb-0 mr-0 rounded">
                              <span className="m-option__control">
                                <span className="m-radio m-radio--state-brand">
                                  {/* <input
                                    type="radio"
                                    name="type"
                                    id="advancePayment"
                                    value="AdvancePayment"
                                    checked={
                                      paymentType == "AdvancePayment"
                                        ? true
                                        : false
                                    }
                                    onChange={handlePaymentTypeChange}
                                  /> */}
                                  <i
                                    className="fa-solid fa-circle-check"
                                    style={
                                      paymentType == "advance_payment"
                                        ? { color: "#34bfa3" }
                                        : {}
                                    }
                                  ></i>
                                </span>
                              </span>
                              <span className="m-option__label">
                                <span className="m-option__head">
                                  <span className="m-option__title m-option__focus">
                                    Advance Payment
                                  </span>
                                </span>
                                <span className="m-option__body font-weight-normal">
                                  Will be offset by upcoming bills
                                </span>
                              </span>
                            </label>
                          </div>
                          <div className="col-lg-4" id="against_bill_div">
                            <label className="m-option card-body-sm mb-0 mr-0 rounded">
                              <span className="m-option__control">
                                <span className="m-radio m-radio--state-brand">
                                  <i
                                    className="fa-solid fa-circle-check"
                                    style={
                                      paymentType == "againt_voucher"
                                        ? {
                                            color: "#34bfa3",
                                          }
                                        : {}
                                    }
                                  ></i>
                                </span>
                              </span>
                              <span className="m-option__label">
                                <span className="m-option__head">
                                  <span className="m-option__title m-option__focus">
                                    Against Voucher
                                  </span>
                                </span>
                                <span className="m-option__body font-weight-normal">
                                  Make Payment Against Voucher
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2">
                      <div className="form-group row">
                        <label className="col-md-12">
                          Amount<span className="text-danger">*</span>
                        </label>
                        <div className="col-md-12">
                          <div className="input-group input-group-sm">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                <i
                                  className="fa fa-inr currency_style"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="totalPayment"
                              name="totalPayment"
                              aria-describedby="basic-addon1"
                              data-fv-field="totalPayment"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 tdsdiv m--hide mt-2">
                      {/* <div className="row" id="tds_amount_div">
                        <div className="col-md-4">
                          <label className="col-lg-12 col-md-12 col-sm-12 ">
                            TDS Amount<span></span>
                          </label>
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <span id="tds_amount"></span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="col-lg-12 col-md-12 col-sm-12 ">
                            Net Amount<span></span>
                          </label>
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <span id="total_net_amount"></span>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="col-md-6 mt-2">
                      <div className="form-group row">
                        <label className="col-md-12">Description</label>
                        <div className="col-md-12">
                          <textarea
                            className="form-control form-control-sm"
                            name="description"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  {paymentType == "AgainstBill" && (
                    <>
                      <div className="row" id="bill_table_hide">
                        <div className="col-md-12">
                          <input
                            type="hidden"
                            name="deletebillids"
                            id="deletebillIds"
                            value=""
                          />
                          <div className="row">
                            <div className="col-md-12">
                              <div className="table-responsive">
                                <table
                                  className="table-sm table-bordered table-hover table-striped table"
                                  id="bill_table"
                                >
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>
                                        Bill No.
                                        <span className="text-danger">*</span>
                                      </th>
                                      <th className="text-right">Net Amount</th>
                                      <th className="text-right">
                                        Paid Amount
                                      </th>
                                      <th className="text-right">
                                        Pending Amount
                                      </th>
                                      <th className="text-right">
                                        Kasar Amount
                                        <span className="text-danger">*</span>
                                      </th>
                                      <th className="text-right">
                                        Amount
                                        <span className="text-danger">*</span>
                                      </th>
                                      <th className="text-right">
                                        Payment Amount
                                      </th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody data-bill-list="">
                                    <tr
                                      data-bill-item="template"
                                      className="m--hide"
                                    >
                                      <td className="">
                                        <span data-item-index=""></span>
                                      </td>
                                      <td className="">
                                        <div className="form-group mb-0">
                                          <select
                                            className="form-control"
                                            id="bill{index}"
                                            name="paymentBillVos[{index}].voucherId"
                                          >
                                            <option value="">
                                              Select Bill
                                            </option>
                                          </select>
                                        </div>
                                        {/* <button
                                          type="button"
                                          className="btn btn-sm btn-brand m--hide mt-1"
                                          id="redeem_debit_note_button{index}"
                                        >
                                          Redeem Debit Note
                                        </button> */}
                                      </td>
                                      <td className="">
                                        <div
                                          className="text-right"
                                          data-item-original=""
                                        ></div>
                                      </td>
                                      <td className="">
                                        <div className="tds-paid-amount-flex text-right">
                                          <div
                                            className="text-right"
                                            data-item-paid=""
                                          ></div>
                                          <span
                                            className="fa fa-info-circle m--hide"
                                            id="tdstooltip{index}"
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            title="Inclusive of TDS."
                                            aria-hidden="true"
                                          ></span>
                                        </div>
                                      </td>
                                      <td className="">
                                        <div
                                          className="text-right"
                                          data-item-pending=""
                                          id="pendingAmount{index}"
                                        ></div>
                                      </td>
                                      <td className="">
                                        <div className="form-group mb-0">
                                          <input
                                            type="text"
                                            className="form-control form-control-sm text-right"
                                            data-item-kasar=""
                                            id="kasarAmount{index}"
                                            name="paymentBillVos[{index}].kasar"
                                            value="0"
                                          />
                                        </div>
                                      </td>
                                      <td className="">
                                        <div className="form-group mb-0">
                                          <input
                                            type="text"
                                            className="form-control form-control-sm text-right"
                                            data-item-amount=""
                                            id="paymentAmount{index}"
                                            name="paymentBillVos[{index}].totalPayment"
                                            value="0"
                                          />
                                        </div>
                                      </td>
                                      <td className="">
                                        <div className="form-group mb-0">
                                          <input
                                            type="text"
                                            className="form-control form-control-sm text-right"
                                            data-item-total=""
                                            id="paymentTotal{index}"
                                            name="paymentTotal{index}"
                                            value="0"
                                          />
                                        </div>
                                      </td>
                                      <td className="paction">
                                        <a
                                          href="#"
                                          data-item-remove=""
                                          className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                        >
                                          <i className="fa fa-times"></i>
                                        </a>
                                        <input
                                          type="hidden"
                                          id="voucherType{index}"
                                          name="paymentBillVos[{index}].voucherType"
                                          value=""
                                        />
                                      </td>
                                    </tr>

                                    <tr
                                      data-sales-parent-item="template"
                                      className="m--hide"
                                    >
                                      <td title="Debit Note Details"></td>
                                      {/* <td>
                                        <table
                                          className="table-sm table-bordered table-striped table-hover debit_note_table_class mb-0 table"
                                          id="debit_note_table{index}"
                                        >
                                          <thead>
                                            <tr>
                                              <th>#</th>
                                              <th>
                                                Debit Note No.
                                                <span className="text-danger">
                                                  *
                                                </span>
                                              </th>
                                              <th className="text-right">
                                                Net Amount
                                              </th>
                                              <th className="text-right">
                                                Redeem Amount
                                              </th>
                                              <th className="text-right">
                                                Pending Amount
                                              </th>
                                              <th className="text-right">
                                                Amount
                                                <span className="text-danger">
                                                  *
                                                </span>
                                              </th>
                                              <th></th>
                                            </tr>
                                          </thead>
                                          <tbody data-debitnote-list="">
                                            <tr
                                              data-debitnote-item="template"
                                              className="m--hide"
                                            >
                                              <td className="">
                                                <span data-debitnote-index=""></span>
                                              </td>
                                              <td className="">
                                                <div className="form-group mb-0">
                                                  <select
                                                    className="form-control"
                                                    id="debitNote{index}{debitindex}"
                                                    name="paymentBillVos[{index}].paymentDebitNoteVos[{debitindex}].purchaseVo.purchaseId"
                                                  >
                                                    <option value="">
                                                      Select Debit Note
                                                    </option>
                                                  </select>
                                                </div>
                                              </td>
                                              <td className="">
                                                <div
                                                  className="text-right"
                                                  data-debitnote-original=""
                                                ></div>
                                              </td>
                                              <td className="">
                                                <div
                                                  className="text-right"
                                                  data-debitnote-paid=""
                                                ></div>
                                              </td>
                                              <td className="">
                                                <div
                                                  className="text-right"
                                                  data-debitnote-pending=""
                                                  id="debitNotePending{index}{debitindex}"
                                                ></div>
                                              </td>
                                              <td className="form-group">
                                                <input
                                                  type="text"
                                                  className="form-control form-control-sm text-right"
                                                  data-debitnote-amount=""
                                                  id="debitNoteAmount{index}{debitindex}"
                                                  name="paymentBillVos[{index}].paymentDebitNoteVos[{debitindex}].totalPayment"
                                                  value="0"
                                                />
                                              </td>
                                              <td className="paction">
                                                <a
                                                  href="#"
                                                  data-debitnote-remove=""
                                                  className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                                >
                                                  <i className="fa fa-times"></i>
                                                </a>
                                                <input
                                                  type="hidden"
                                                  id="voucherNo{index}{debitindex}"
                                                  name="paymentBillVos[{index}].paymentDebitNoteVos[{debitindex}].voucherNo"
                                                />
                                                <input
                                                  type="hidden"
                                                  id="voucherType{index}{debitindex}"
                                                  name="paymentBillVos[{index}].paymentDebitNoteVos[{debitindex}].voucherType"
                                                />
                                                <input
                                                  type="hidden"
                                                  id="voucherId{index}{debitindex}"
                                                  name="paymentBillVos[{index}].paymentDebitNoteVos[{debitindex}].voucherId"
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                          <tfoot>
                                            <tr>
                                              <th></th>
                                              <th>
                                                <div className="m-demo-icon mb-0">
                                                  <div className="m-demo-icon__class">
                                                    <a
                                                      href="Javascript:void(0)"
                                                      data-toggel="modal"
                                                      className="m-link m--font-boldest"
                                                      id="add_debit_note"
                                                    >
                                                      <i
                                                        className="fa fa-plus-circle"
                                                        aria-hidden="true"
                                                      ></i>{" "}
                                                      Add More
                                                    </a>
                                                  </div>
                                                </div>
                                              </th>
                                              <th></th>
                                              <th></th>
                                              <th className="text-center">
                                                Total
                                              </th>
                                              <th className="text-right">
                                                <span
                                                  className="m--font-boldest text-right"
                                                  data-debitnote-total="0"
                                                  id="debit_Note_sub_total{index}"
                                                >
                                                  0
                                                </span>
                                              </th>
                                              <th></th>
                                            </tr>
                                          </tfoot>
                                        </table>
                                      </td> */}
                                      <td></td>
                                    </tr>
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <th></th>
                                      <th>
                                        <div className="m-demo-icon mb-0">
                                          <div className="m-demo-icon__class">
                                            <a
                                              href="Javascript:void(0)"
                                              data-toggel="modal"
                                              className="m-link m--font-boldest"
                                              id="add_Bill"
                                            >
                                              <i
                                                className="fa fa-plus-circle"
                                                aria-hidden="true"
                                              ></i>{" "}
                                              Add More
                                            </a>
                                          </div>
                                        </div>
                                      </th>
                                      <th>Total</th>
                                      <th></th>
                                      <th></th>
                                      <th></th>
                                      <th></th>
                                      <th className="text-right">
                                        <span id="payment_sub_total">0</span>
                                      </th>
                                      <th></th>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row" id="bill_table_creditNote">
                        <div className="col-md-12">
                          <input
                            type="hidden"
                            name="deletebillids"
                            id="deletebillIdsCredit"
                            value=""
                          />
                          {/* <div className="row">
                            <div className="col-md-12">
                              <div className="table-responsive">
                                <table
                                  className="table-sm table-bordered table-striped table-hover debit_note_table_class mb-0 table"
                                  id="debit_note_table_credit"
                                >
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>
                                        Voucher No.
                                        <span
                                          style={{ fontSize: "1.25rem" }}
                                          className="text-danger"
                                        >
                                          *
                                        </span>
                                      </th>
                                      <th className="text-right">Net Amount</th>
                                      <th className="text-right">
                                        Used Amount
                                      </th>
                                      <th className="text-right">
                                        Remaining Amount
                                      </th>
                                      <th className="text-right">
                                        Amount
                                        <span className="text-danger">*</span>
                                      </th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody data-debitnote-list-credit="">
                                    <tr
                                      data-debitnote-item-credit="template"
                                      className="m--hide"
                                    >
                                      <td
                                        className=""
                                        style={{ width: "50px" }}
                                      >
                                        <span data-debitnote-index=""></span>
                                      </td>
                                      <td
                                        className=""
                                        style={{ width: "280px" }}
                                      >
                                        <div className="form-group mb-0">
                                          <select
                                            className="form-control"
                                            id="debitNoteCredit{index}"
                                            name="paymentBillVos[{index}].voucherId"
                                          >
                                            <option value="">
                                              Select Bill
                                            </option>
                                          </select>
                                        </div>
                                      </td>
                                      <td
                                        className=""
                                        style={{ width: "180px" }}
                                      >
                                        <div
                                          className="text-right"
                                          data-debitnote-original=""
                                        ></div>
                                      </td>
                                      <td
                                        className=""
                                        style={{ width: "180px" }}
                                      >
                                        <div
                                          className="text-right"
                                          data-debitnote-paid=""
                                        ></div>
                                      </td>
                                      <td
                                        className=""
                                        style={{ width: "180px" }}
                                      >
                                        <div
                                          className="text-right"
                                          data-debitnote-pending=""
                                          id="debitNotePendingCredit{index}"
                                        ></div>
                                      </td>
                                      <td
                                        className="form-group"
                                        style={{ width: "180px" }}
                                      >
                                        <input
                                          type="text"
                                          className="form-control form-control-sm text-right"
                                        />
                                      </td>
                                      <td
                                        className="paction"
                                        style={{ width: "40px" }}
                                      >
                                        <a
                                          href="#"
                                          data-debitnote-remove-credit=""
                                          className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                        >
                                          <i className="fa fa-times"></i>
                                        </a>
                                        <input
                                          type="hidden"
                                          id="voucherNoCredit{index}"
                                          name="paymentBillVos[{index}].voucherNo"
                                        />
                                        <input
                                          type="hidden"
                                          id="voucherTypeCredit{index}"
                                          name="paymentBillVos[{index}].voucherType"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <th></th>
                                      <th>
                                        <div className="m-demo-icon mb-0">
                                          <div className="m-demo-icon__class">
                                            <a
                                              href="Javascript:void(0)"
                                              data-toggel="modal"
                                              className="m-link m--font-boldest"
                                              id="add_debit_note_credit"
                                            >
                                              <i
                                                className="fa fa-plus-circle"
                                                aria-hidden="true"
                                              ></i>{" "}
                                              Add More
                                            </a>
                                          </div>
                                        </div>
                                      </th>
                                      <th></th>
                                      <th></th>
                                      <th className="text-center">Total</th>
                                      <th className="text-right">
                                        <span id="payment_sub_total_credit">
                                          0
                                        </span>
                                      </th>
                                      <th></th>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="row mt-2">
                    <div className="col-md-12 text-right">
                      <a
                        href="/payment"
                        id="cancel_payment"
                        className="btn btn-sm btn-secondary"
                      >
                        Cancel
                      </a>
                      <button
                        type="button"
                        className="btn btn-sm btn-brand"
                        id="save_payment"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-brand"
                        id="save_and_create_payment"
                      >
                        Save &amp; Crete New
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input
            type="hidden"
            name="_csrf"
            value="b3e7ce80-24fc-42a0-986c-45e6ba1ac08a"
          />
        </form>
      </div>
    </DefaultLayout>
  );
}
