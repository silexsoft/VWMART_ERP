'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDynamic from "@/components/Tables/TableDynamic";
import TableGeneric from "@/components/Tables/TableGeneric";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function Page() {
      const router = useRouter();
      const pathname = usePathname();
      const id = pathname.match(/\/expense\/(\d+)/)?.[1];
       const columns = [
         {
           width: "1px !important",
           label: "Sr. No.",
           field: "srNo",
         },
         {
           width: "10px",
           label: "Account",
           field: "account",
           renderCell: (value: any, row: any) => (
             <span className="font-bold">{value}</span>
           ),
         },
         {
           width: "150px",
           label: "Service/Good",
           field: "service_good",
         },
         {
           width: "200px",
           label: "Description",
           field: "description",
         },
         {
           width: "100px",
           label: "Amount",
           field: "amount",
           renderCell: (value: any, row: any) => (
             <input className="form-control" readOnly value={value} disabled />
           ),
         },
         {
           width: "200px",
           label: "Discount",
           field: "discount",
           renderCell: (value: any, row: any) => (
             <span className="d-flex gap-2">
               <button className="btn btn-primary" disabled>
                 ₹
               </button>
               <input
                 className="form-control"
                 readOnly
                 value={value}
                 disabled
               />
             </span>
           ),
         },
         {
           width: "150px",
           label: "Tax",
           field: "tax",
           renderCell: (value: any, row: any) => (
            <span className="">
              <input className="form-control" readOnly value={value} disabled />
              <span className="font-bold">Eligible</span>
            </span>
           ),
         },
         {
           width: "100px",
           label: "Tax Value",
           field: "tax_value",
         },
         {
           width: "100px",
           label: "Total",
           field: "total",
           renderCell: (value: any, row: any) => (
             <span className="font-bold">{value}</span>
           )
         },
       ];

       const customFooter = (
         <>
           <tfoot>
             <tr className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
               <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
               <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
               <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
               <td className="bold px-4 py-2 text-sm text-black dark:text-white">
               </td>
               <td className="px-4 py-2 text-sm text-black dark:text-white">
               </td>
               <td className="px-4 py-2 text-sm text-black dark:text-white">
               </td>
               <td className="px-4 py-2 text-sm text-black dark:text-white">
               </td>
               <td className="px-4 py-2 text-sm text-black dark:text-white">Total</td>
               <td className="px-4 py-2 text-sm text-black dark:text-white">1336.2</td>
              
             </tr>
           </tfoot>
         </>
       );

       const dummyData = [
         {
           srNo: "1",
           account: "A12345",
           service_good: "Web Hosting",
           description: "Monthly web hosting plan",
           amount: "₹2000",
           discount: "₹200",
           tax: "18%",
           tax_value: "₹324",
           total: "₹2124",
         },
         {
           srNo: "2",
           account: "B67890",
           service_good: "Software License",
           description: "Annual software license",
           amount: "₹15000",
           discount: "₹1500",
           tax: "18%",
           tax_value: "₹2430",
           total: "₹15930",
         },
         {
           srNo: "3",
           account: "C11223",
           service_good: "IT Support",
           description: "Quarterly IT support",
           amount: "₹5000",
           discount: "₹500",
           tax: "18%",
           tax_value: "₹810",
           total: "₹5310",
         },
         {
           srNo: "4",
           account: "D44556",
           service_good: "Domain Registration",
           description: "Domain registration for 1 year",
           amount: "₹1000",
           discount: "₹100",
           tax: "18%",
           tax_value: "₹162",
           total: "₹1062",
         },
         {
           srNo: "5",
           account: "E77889",
           service_good: "Email Hosting",
           description: "Monthly email hosting plan",
           amount: "₹3000",
           discount: "₹300",
           tax: "18%",
           tax_value: "₹486",
           total: "₹3186",
         },
       ];


       const paymentTableCols = [
         {
           width: "100px",
           label: "#",
           field: "srNo",
         },
         {
           width: "100px",
           label: "Payment No",
           field: "payment_no",
         },
         {
           width: "100px",
           label: "Date",
           field: "date",
         },
         {
           width: "100px",
           label: "Payment Mode",
           field: "Amount",
         },
          {
           width: "100px",
           label: "Action",
           field: "Action",
         },
       ];


  return (
    <DefaultLayout>
      <div className="m-portlet__body card-body-sm expense_details">
        <div className="d-flex justify-content-end align-items-center mb-2 gap-2">
          <button
            className="btn btn-primary"
            onClick={() => router.push(`/Bank/expense/${id}/edit`)}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button className="btn btn-danger">
            <i className="fa fa-trash"></i>
          </button>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table-sm table-bordered m-table table">
                <tbody>
                  <tr>
                    <th>Expense Date</th>
                    <td>18/01/2025</td>
                  </tr>
                  <tr>
                    <th>Expense No.</th>
                    <td>EXP1</td>
                  </tr>
                  <tr>
                    <th>Reverse Charge</th>
                    <td>No</td>
                  </tr>
                  <tr>
                    <th>Party Name</th>
                    <td>Shree Kanha Enterprises</td>
                  </tr>
                  <tr>
                    <th>Invoice No.</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Applied Tax Type</th>
                    <td>
                      <input
                        type="hidden"
                        name="taxType"
                        id="taxType"
                        value="0"
                        data-fv-field="taxType"
                      />
                      CGST/SGST
                    </td>
                  </tr>
                  <tr>
                    <th>GST Type</th>
                    <td>GST</td>
                  </tr>

                  <tr>
                    <th>Remark.</th>
                    <td>Test</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <small
              className="help-block"
              data-fv-validator="notEmpty"
              data-fv-for="taxType"
              data-fv-result="NOT_VALIDATED"
            >
              The Tax Type is Required
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {/* <div className="table-responsive">
              <table
                className="table-sm table-bordered table-hover table-striped table"
                id="product_table"
              >
                <thead>
                  <tr>
                    <th colSpan={9}>Expense Details</th>
                  </tr>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Account</th>
                    <th className="text-center">Service/Good</th>
                    <th className="text-center">Description</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Discount</th>
                    <th className="text-right">Tax</th>
                    <th className="text-right">Tax Value</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody data-expense-list="">
                  <tr data-expense-item="0" className="">
                    <td>
                      <span data-item-index="">1</span>
                    </td>
                    <td className="text-center">
                      <span> Salary</span> <br />
                    </td>
                    <td className="text-center">
                      <span>Product</span>
                    </td>
                    <td className="text-center">
                      <span> </span>
                    </td>
                    <td>
                      <div className="form-group mb-0 p-0" data-item-price="">
                        <input
                          type="text"
                          readOnly={true}
                          className="form-control form-control-sm"
                          name="expenseItemVos[0].price"
                          id="price0"
                          value="900.0"
                        />
                      </div>
                    </td>
                    <td>
                      <div
                        className="form-group mb-0 p-0"
                        data-item-discount=""
                      >
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <button
                              className="btn btn-secondary btn-icon dis-btn-inr"
                              type="button"
                              id="btn_amount{index}"
                            >
                              <i
                                className="fa fa-inr currency_style"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control form-control-sm"
                            name="expenseItemVos[0].discount"
                            id="discount0"
                            value="12.0"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="form-group mb-0">
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="tax0"
                          name="expenseItemVos[0].tax.taxId"
                          aria-hidden="true"
                        >
                          <option value="">No Tax</option>
                        </select>
                        <span
                          className="select2 select2-container select2-container--default select2-container--disabled"
                          dir="ltr"
                          data-select2-id="1"
                        >
                          <span className="selection">
                            <span
                              className="select2-selection select2-selection--single"
                              role="combobox"
                              aria-haspopup="true"
                              aria-expanded="false"
                              aria-labelledby="select2-tax0-container"
                            >
                              <span
                                className="select2-selection__rendered"
                                id="select2-tax0-container"
                                role="textbox"
                                aria-readOnly="true"
                                title="GST 28"
                              >
                                GST 28
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
                        <span>
                          <b>ELIGIBLE</b>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="p-0">
                        <span className="float-right">
                          Rs. <span data-item-tax-amount="">248.64</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        className="m--font-bolder p-0 text-right"
                        data-item-amount=""
                      >
                        1136.64
                      </div>
                    </td>
                    /
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th>
                      <div className="m-demo-icon m--hide">
                        <div className="m-demo-icon__preview ">
                          <span className="">
                            <i className="flaticon-plus m--font-primary"></i>
                          </span>
                        </div>
                        <div className="m-demo-icon__class">
                          <a
                            href="#additional_charge_div"
                            id=""
                            data-toggle="collapse"
                            className="m-link m--font-boldest"
                          >
                            Add New Expense
                          </a>
                        </div>
                      </div>
                    </th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th className="text-right">Total</th>
                    <th className="text-right">
                      <span id="product_sub_total">1136.64</span>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div> */}
            <div>Expense Details</div>
            <TableGeneric
              columns={columns}
              data={dummyData}
              footer={customFooter}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="table-responsive">
              <table
                className="table-sm table-bordered table-striped collapse table"
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
                  <tr className="" data-tax-item="65606">
                    <td>CGST</td>
                    <td>14 %</td>
                    <td>124.32</td>
                  </tr>
                  <tr className="" data-tax-item="65606">
                    <td>SGST</td>
                    <td>14 %</td>
                    <td>124.32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4">
            <div className="table-responsive mt-3">
              <table className="table-bordered table-sm table text-right">
                <tbody>
                  <tr>
                    <th> Gross Amount </th>
                    <td>
                      <h6 className="mb-0" id="gross_amount">
                        900.00
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th> Discount </th>
                    <td>
                      <h6 className="mb-0" id="total_discount">
                        12.00
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th> Taxable Amount </th>
                    <td>
                      <h6 className="mb-0" id="taxable_amount">
                        888.00
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <a
                        href="#tax_summary_table"
                        data-toggle="collapse"
                        className="m-link m-link--info m-link--state"
                      >
                        Tax Amount
                      </a>
                    </th>
                    <td>
                      <h6 className="mb-0" id="tax_amount">
                        248.64
                      </h6>
                    </td>
                  </tr>

                  <tr>
                    <th>
                      <a href="javascript:void(0);" title="Roundoff">
                        Roundoff
                      </a>
                    </th>
                    <td>
                      <h6 className="mb-0" id="round_off">
                        0.36
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <h4 className="mb-0">Net Amount</h4>
                    </th>
                    <td>
                      <h4 className="mb-0" id="net_amount">
                        1137.00
                      </h4>
                    </td>
                  </tr>

                  <tr>
                    <th>
                      <h4 className="mb-0">
                        {" "}
                        Paid Amount{" "}
                        <i
                          className="fa fa-info-circle m--hide"
                          id="tdstooltip"
                          data-toggle="tooltip"
                          data-placement="right"
                          title=""
                          aria-hidden="true"
                          data-original-title="Inclusive of TDS."
                        ></i>
                      </h4>
                    </th>
                    <td>
                      <h4 className="mb-0">0.0</h4>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <div
                id="payment_table_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
              >
                <div className="row mt-3">
                  <div className="col-sm-12">
                    {/* <table
                      className="table-sm table-striped table-bordered table-hover table-checkable no-footer dataTable dtr-inline table"
                      id="payment_table"
                      role="grid"
                      aria-describedby="payment_table_info"
                    >
                      <thead>
                        <tr role="row">
                          <th colSpan={3} rowSpan={1}>
                            Payment Details
                          </th>
                          <th
                            colSpan={3}
                            className="text-right"
                            rowSpan={1}
                          ></th>
                        </tr>
                        <tr role="row">
                          <th
                            className="sorting_asc"
                            tabIndex={0}
                            aria-controls="payment_table"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="#"
                          >
                            #
                          </th>
                          <th
                            className="sorting_disabled"
                            tabIndex={0}
                            aria-controls="payment_table"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Payment No"
                          >
                            Payment No
                          </th>
                          <th
                            className="sorting"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Date: activate to sort column ascending"
                          >
                            Date
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="payment_table"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Payment Mode: activate to sort column ascending"
                          >
                            Payment Mode
                          </th>
                          <th
                            className="sorting"
                            aria-controls="payment_table"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Amount: activate to sort column ascending"
                          >
                            Amount
                          </th>
                          <th
                            className="sorting_disabled text-center"
                            tabIndex={0}
                            aria-controls="payment_table"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Action"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd">
                          <td
                            valign="top"
                            colSpan={6}
                            className="dataTables_empty"
                          >
                            No data available in table
                          </td>
                        </tr>
                      </tbody>
                    </table> */}
                    <div>Payment Details</div>
                    <TableGeneric
                      columns={paymentTableCols}
                      data={[]}
                      // footer={customFooter}
                    />
                    <Pagination
                      currentPage={1}
                      totalPages={1}
                      onPageChange={() => {}}
                    />
                  </div>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="float-left">
      <div className="flex justify-center">
        <button
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="mx-1 px-2 py-2">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
