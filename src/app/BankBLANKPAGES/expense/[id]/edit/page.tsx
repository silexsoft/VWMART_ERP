'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableGeneric from "@/components/Tables/TableGeneric";
import TableDynamic from "@/components/Tables/TableDynamic";
import { option } from "framer-motion/m";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Page() {
  // const columns = [
  //   {
  //     width: "20px",
  //     label: "#",
  //     field: "serialNo",
  //   },
  //   {
  //     width: "150px",
  //     label: "Account*",
  //     field: "account",
  //   },
  //   {
  //     width: "200px",
  //     label: "Service/Product",
  //     field: "serviceProduct",
  //   },
  //   {
  //     width: "250px",
  //     label: "Description",
  //     field: "description",
  //   },
  //   {
  //     width: "100px",
  //     label: "Amount*",
  //     field: "amount",
  //   },
  //   {
  //     width: "100px",
  //     label: "Discount*",
  //     field: "discount",
  //   },
  //   {
  //     width: "100px",
  //     label: "Tax*",
  //     field: "tax",
  //   },
  //   {
  //     width: "100px",
  //     label: "Tax Value",
  //     field: "taxValue",
  //   },
  //   {
  //     width: "100px",
  //     label: "Total",
  //     field: "total",
  //   },
  // ];

  const dmyData = [];

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

  
   const columns = [
     { label: "#", type: "serial" },
     {
       label: "Account",
       required: true,
       type: "select",
       options: ["option1", "option2", "option3"],
       name: "account",
     },
     {
       label: "Service/Product",
       required: true,
       type: "select",
       options: ["Product", "Service"],
       name: "service",
       postScript: '<a href="#">HSN/SAC Code</a>'
     },
     { label: "Description", type: "input", name: "description" },
     { label: "Amount", type: "input", name: "amount" },
     { label: "Discount", type: "input", name: "discount" },
     { label: "Tax", type: "select", name: "tax", options : ["0", "5", "10"] },
     { label: "Tax Value", type: "input", name: "tax_value" },
     {
       label: "Total",
       type: "input",
       name: "total",
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
      <div className="m-portlet__body card-body-sm expense-details">
        <div className="row">
          <div className="col-md-3">
            <div className="form-group row has-success">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Expense Date<span className="text-danger">*</span>
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="input-group date">
                  <input
                    type="text"
                    data-date-format="dd/mm/yyyy"
                    className="form-control form-control-sm"
                    data-date-start-date="01/04/2024"
                    data-date-end-date="31/03/2025"
                    id="expenseDate"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group row">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Expense No.
              </label>
              <div className="col-lg-7 col-6 pr-0">
                <input type="text" className="form-control form-control-sm" />
              </div>
              <div className="col-lg-5 col-6">
                <input type="text" className="form-control form-control-sm" />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group row">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Select Party<span className="text-danger">*</span>
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="input-group select-width">
                  <select
                    className="form-control m-select2 select2-hidden-accessible"
                    id="accountCustomId"
                    aria-hidden="true"
                  >
                    <option>Select Party</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group row">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Invoice No.
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group row">
                  <label className="col-lg-12 col-md-12 col-sm-12 d-flex align-items-center">
                    Reverse Charge
                    <i
                      data-toggle="m-tooltip"
                      data-width="auto"
                      className="fa fa-info-circle ml-2 text-warning"
                      title=""
                      data-original-title="Tax amount will not be calculated in the total amount. "
                    ></i>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <select
                      className="form-control m-select2 form-control-sm select2-hidden-accessible"
                      id="reverseCharge"
                      aria-hidden="true"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group row">
                  <label className="col-lg-12 col-md-12 col-sm-12">
                    Applied Tax Type
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <select
                      className="form-control m-select2 select2-hidden-accessible"
                      id="taxType"
                      aria-hidden="true"
                    >
                      <option>CGST/SGST</option>
                      <option>IGST</option>

                      <option>No Tax</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="form-group row">
                  <div className="col-md-12">
                    <label className="col-md-12">&nbsp;</label>
                    <div className="m-checkbox-inline">
                      <label className="">
                        <input type="checkbox" /> &nbsp; &nbsp;Non-GST{" "}
                        <span></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 pr-0">
            <div className="row">
              <div className="form-group col-lg-12 col-md-12 col-sm-12">
                <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                  Note
                </label>
                <textarea className="form-control form-control-sm"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="row"></div>
        <div className="row">
          <div className="col-md-12">
            <TableDynamic
              columns={columns}
              rows={rows}
              onSubmit={onSubmit}
              schema={schema}
            />
          
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="table-responsive">
              <table
                className="table-sm table-bordered table-striped collapse mb-0 table"
                id="tax_summary_table"
              >
                <thead>
                  <tr>
                    <th>Tax</th>
                    <th>Tax Rate</th>
                    <th>Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="m--hide" data-tax-item="template">
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="" data-tax-item="">
                    <td>CGST</td>
                    <td>0 %</td>
                    <td>0</td>
                  </tr>
                  <tr className="" data-tax-item="">
                    <td>SGST</td>
                    <td>0 %</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-6">
            <div className="table-responsive">
              <table className="table-sm table-bordered table-striped table text-right">
                <tbody>
                  <tr>
                    <th>Gross Amount</th>
                    <td>
                      <h6 className="mb-0" id="gross_amount">
                        0.00
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>Discount </th>
                    <td>
                      <h6 className="mb-0" id="total_discount">
                        0.00
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>Taxable Amount</th>
                    <td>
                      <h6 className="mb-0" id="taxable_amount">
                        0.00
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th className="m--font-info">
                      <a
                        id="taxAmountBreakup"
                        href="#tax_summary_table"
                        data-toggle="collapse"
                        className="m-link m-link--info m-link--state"
                      >
                        Tax
                      </a>
                    </th>
                    <td>
                      <h6 className="mb-0" id="tax_amount">
                        0.00
                      </h6>
                    </td>
                  </tr>

                  <tr className="border-bottom m--hide tcsdiv">
                    <th>TCS</th>
                    <td>
                      <div className="d-flex justify-content-end">
                        <input type="hidden" id="tcsAmount" />
                        <input type="hidden" id="tcsType" />
                        <input
                          type="text"
                          id="tcsRate"
                          className="form-control form-control-sm rounded-0 col-3 text-right"
                        />
                        <button className="btn btn-sm btn-secondary tcs_button">
                          %
                        </button>
                        <h6 className="mb-0">
                          TCS Amount :{" "}
                          <span className="mb-0" id="tcs_amount">
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
                        data-original-title="Roundoff"
                      >
                        Roundoff
                      </a>
                    </th>
                    <td>
                      <h6 className="mb-0" id="round_off">
                        0.00
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <h4 className="mb-0">Net Amount</h4>
                    </th>
                    <td>
                      <h4 className="mb-0" id="net_amount">
                        0.00
                      </h4>
                    </td>
                  </tr>
                  <tr className="border-bottom m--hide tdsdiv">
                    <th>
                      <h6 className="mb-0">TDS</h6>
                    </th>
                    <td>
                      <div className="d-flex justify-content-end">
                        <input type="hidden" id="tdsAmount" />
                        <input type="hidden" id="tdsType" />

                        <input
                          type="text"
                          id="tdsRate"
                          className="form-control form-control-sm rounded-0 col-3 text-right"
                        />
                        <button
                          className="btn btn-sm btn-secondary"
                          id="tds_btn_amount_percent"
                          type="button"
                        >
                          <i
                            id="tdsTypeSymbol"
                            className="fa fa-percent currency_style"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <h6 className="mb-0">
                          TDS Amount :{" "}
                          <span className="mb-0" id="tds_amount">
                            0
                          </span>
                        </h6>
                      </div>
                    </td>
                  </tr>
                  <tr className="m--hide tdsdiv">
                    <th>
                      <h4 className="mb-0">Payable Amount</h4>
                    </th>
                    <td>
                      <h4 className="mb-0" id="payable_amount">
                        0.00
                      </h4>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-right">
            <a
              href="/expense"
              id="cancel_expense"
              className="btn btn-sm btn-secondary"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-sm btn-brand"
              id="save_expense"
            >
              Save
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-brand"
              id="save_and_create_new_expense"
            >
              Save &amp; Create New
            </button>
            <button
              type="button"
              className="btn btn-sm btn-brand"
              id="save_expense_to_payment"
            >
              Save &amp; Payment
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
