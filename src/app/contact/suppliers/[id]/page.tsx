'use client'
import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumb";
import { Tabs, Tab } from "react-bootstrap";
import TableGeneric from "@/components/Tables/TableGeneric";
import { label } from "framer-motion/m";

const data = [
  {
    supplier_bill_no: "SB001",
    date: "2025-01-01",
    total_amount: 1000,
    paid_amount: 500,
    due_amount: 500,
    created_by: "John Doe",
    action: "View",
  },
  {
    supplier_bill_no: "SB002",
    date: "2025-01-02",
    total_amount: 1500,
    paid_amount: 700,
    due_amount: 800,
    created_by: "Jane Smith",
    action: "Edit",
  },
  {
    supplier_bill_no: "SB003",
    date: "2025-01-03",
    total_amount: 2000,
    paid_amount: 1200,
    due_amount: 800,
    created_by: "Mike Johnson",
    action: "Delete",
  },
  {
    supplier_bill_no: "SB004",
    date: "2025-01-04",
    total_amount: 2500,
    paid_amount: 1300,
    due_amount: 1200,
    created_by: "Emily Davis",
    action: "View",
  },
];
const paymentData = [
  {
    id: 1,
    payment_no: "P001",
    date: "2025-01-17",
    payment_mode: "Credit Card",
    amount: 2000,
    created_by: "Emma White",
    action: "View",
  },
  {
    id: 2,
    payment_no: "P002",
    date: "2025-01-18",
    payment_mode: "Cash",
    amount: 2500,
    created_by: "Liam Green",
    action: "Edit",
  },
  {
    id: 3,
    payment_no: "P003",
    date: "2025-01-19",
    payment_mode: "Bank Transfer",
    amount: 3000,
    created_by: "Noah Brown",
    action: "Delete",
  },
  {
    id: 4,
    payment_no: "P004",
    date: "2025-01-20",
    payment_mode: "Cheque",
    amount: 3500,
    created_by: "Olivia Black",
    action: "View",
  },
];

console.log(data);

const debitNoteColumns = [
  {
    width: "100px",
    label: "Purchase No.",
    field: "purchase_no",
  },
  {
    width: "100px",
    label: "Date",
    field: "date",
  },
  {
    width: "150px",
    label: "Total Amount",
    field: "total_amount",
  },
  {
    width: "150px",
    label: "Created By",
    field: "created_by",
  },
  {
    width: "100px",
    label: "Action",
    field: "action",
  },
];

const expenseColumns = [
  {
    width: "60px",
    label: "Sr. No.",
    field: "sr_no",
  },
  {
    width: "80px",
    label: "No.",
    field: "no",
  },
  {
    width: "100px",
    label: "Date",
    field: "date",
  },
  {
    width: "150px",
    label: "Party Name",
    field: "party_name",
  },
  {
    width: "100px",
    label: "Total",
    field: "total",
  },
  {
    width: "100px",
    label: "Paid",
    field: "paid",
  },
  {
    width: "100px",
    label: "UnPaid",
    field: "unpaid",
  },
  {
    width: "120px",
    label: "Branch",
    field: "branch",
  },
  {
    width: "150px",
    label: "Created By",
    field: "created_by",
  },
  {
    width: "150px",
    label: "Created From",
    field: "created_from",
  },
  {
    width: "100px",
    label: "Actions",
    field: "actions",
  },
];

const receiptColumns = [
  {
    width: "60px",
    label: "#",
    field: "id",
  },
  {
    width: "120px",
    label: "Receipt No",
    field: "receipt_no",
  },
  {
    width: "100px",
    label: "Date",
    field: "date",
  },
  {
    width: "150px",
    label: "Payment Mode",
    field: "payment_mode",
  },
  {
    width: "100px",
    label: "Amount",
    field: "amount",
  },
  {
    width: "150px",
    label: "Created By",
    field: "created_by",
  },
  {
    width: "100px",
    label: "Action",
    field: "action",
  },
];

const paymentColumns = [
  {
    width: "60px",
    label: "#",
    field: "id",
  },
  {
    width: "120px",
    label: "Payment No.",
    field: "payment_no",
    renderCell: (value:any,row:any) => <span className="font-semibold text-primary cursor-pointer" onClick={() => {}}>{value}</span>
  },
  {
    width: "100px",
    label: "Date",
    field: "date",
  },
  {
    width: "150px",
    label: "Payment Mode",
    field: "payment_mode",
  },
  {
    width: "100px",
    label: "Amount",
    field: "amount",
  },
  {
    width: "150px",
    label: "Created By",
    field: "created_by",
  },
  {
    width: "100px",
    label: "Action",
    field: "action",
  },
];


export default function Page() {

const [showMore,setShowMore] = useState(false)
  
  const supplierBillColumns = [
    {
      width:"50px",
      label:"#",
      field:"serial"
    },
  {
    width: "100px",
    label: "Supplier Bill No.",
    field: "supplier_bill_no",
    renderCell: (value: any, row: any) => (
      <span className="font-semibold text-primary cursor-pointer" onClick={() => {}}>{value}</span>
    )
  },
  {
    width: "100px",
    label: "Date",
    field: "date",
  },
  {
    width: "150px",
    label: "Total Amount",
    field: "total_amount",
  },
  {
    width: "150px",
    label: "Paid Amount",
    field: "paid_amount",
  },
  {
    width: "150px",
    label: "Due Amount",
    field: "due_amount",
  },
  {
    width: "150px",
    label: "Created By",
    field: "created_by",
  },
  {
    width: "100px",
    label: "Action",
    field: "action",
  },
];



    return (
      <DefaultLayout>
        <Breadcrumbs
          pageName="VANYA ENTERPRISES 1860"
          links={[{ label: "Supplier", route: "#" }]}
        />
        <div className="supplier_details my-3">
          <div className="row">
            <div className="col-md-12">
              <div className="m-portlet__head-tools order-head-btn float-right">
                <a
                  href="#"
                  data-toggle="modal"
                  data-target="#image_upload"
                  className="btn btn-success m-btn m-btn--icon m-btn--icon-only mr-1"
                  title="File Upload"
                >
            
                  <i className="fa fa-upload" />
                </a>
                <a
                  title="PDF"
                  href="/contact/suppliers/pdf/6324506"
                  target="_blank"
                  className="btn btn-warning m-btn m-btn--icon m-btn--icon-only mr-1"
                >
                  <i className="m-nav__link-icon fa fa-file-pdf" />
                </a>
                <a
                  title="Edit"
                  href="/contact/6324506/edit"
                  className="btn btn-info m-btn m-btn--icon m-btn--icon-only mr-1"
                >
                  <i className="fa fa-edit" />
                </a>
                <button
                  id="contact_delete"
                  className="btn btn-danger m-btn m-btn--icon m-btn--icon-only mr-1"
                >
                  <i className="fa fa-trash" />
                </button>
                <button
                  className="btn btn-primary m-btn m-btn--icon m-btn--icon-only"
                  title="New"
                  onClick={() => setShowMore(!showMore)}
                >
                  <i className="fa fa-plus" />
                </button>
                <div className={`dropdown-menu dropdown-menu-right ${showMore ? "show" : ""}`} style={{right:0}}>
               
                    <button className="dropdown-item" type="submit">
                      Supplier Bill
                    </button>
                   
                                
                    <button className="dropdown-item" type="submit">
                      Make Payment
                    </button>
                   
             
              
                    
                    <button className="dropdown-item" type="submit">
                      Make Debit Note
                    </button>
                    
                
                </div>
              </div>

              <Tabs
                defaultActiveKey="general_details"
                id="uncontrolled-tab-example"
              >
                <Tab eventKey="general_details" title="General Details">
                  <div className="mt-2">
                    <div className="row">
                      <div className="col-md-4">
                        <table className="table-sm table-bordered table-hover table-checkable table">
                          <tbody>
                            <tr>
                              <td className="font-weight-bold">Name</td>
                              <td>
                                <span id="overflowwithdot" title=" "></span>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Company Name</td>
                              <td>
                                <span
                                  id="overflowwithdot"
                                  title="VANYA ENTERPRISES 1860"
                                >
                                  VANYA ENTERPRISES 1860
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Type</td>
                              <td className="text-capitalize">other</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Code</td>
                              <td />
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Contact No.</td>
                              <td>
                                <a href="tel:9140719834">+91-9140719834</a>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Whatsapp No.</td>
                              <td>+91-9140719834</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Email</td>
                              <td>
                                Email is Not Provided
                                <a href="mailto:" />
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">PAN No.</td>
                              <td>ALVPP3885C</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">TAN No.</td>
                              <td className="text-capitalize" />
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Due Payment</td>
                              <td>0.00</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Payment Terms
                              </td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Payment Mode</td>
                              <td>N/A</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-4">
                        <table className="table-sm table-bordered table-hover table-checkable table">
                          <tbody>
                            <tr>
                              <td className="font-weight-bold">Bank Name</td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Branch Name</td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Account No.</td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Bank IFSC Code
                              </td>
                              <td>N/A</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-4">
                        <table className="table-sm table-bordered table-hover table-checkable table">
                          <tbody>
                            <tr className="m--hide">
                              <td className="font-weight-bold">Credit Limit</td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Telephone No.
                              </td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Date Of Birth
                              </td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Anniversary Date
                              </td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Remarks</td>
                              <td>N/A</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Account Group Name
                              </td>
                              <td>Sundry Creditors</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-4">
                        <table className="table-sm table-bordered table-hover table-checkable table">
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card-body-sm" role="alert"></div>
                  </div>
                </Tab>
                <Tab eventKey="address_details" title="Address Details">
                  <div className="mt-2">
                    <div className="row">
                      <div className="col-md-4">
                        <table className="table-sm table-bordered table-hover table-checkable table">
                          <tbody>
                            <tr>
                              <th>Default Address</th>
                              <th className="text-right"></th>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">First Name</td>
                              <td />
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Last Name</td>
                              <td />
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Company Name</td>
                              <td>VANYA ENTERPRISES 1860</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Mobile No.</td>
                              <td>+91-9140719834</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Email</td>
                              <td>
                                Email is Not Provided
                                <a href="mailto:" />
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">GST Type</td>
                              <td>Registered</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">GSTIN</td>
                              <td>09ALVPP3885C1ZF</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Address Line 1
                              </td>
                              <td>
                                NEAR SHIV MANDIR,00,MIRZAPUR ,MIRZAPUR PACHPEDWA
                                GORAKHPUR 273015
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Address Line 2
                              </td>
                              <td />
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Country</td>
                              <td>India</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">State</td>
                              <td>Uttar Pradesh</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">City</td>
                              <td>Gorakhpur</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                ZIP/Postal Code
                              </td>
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="supplier_bill" title="Supplier Bill">
                  <div className="mt-2">
                    <TableGeneric columns={supplierBillColumns} data={data} />
                  </div>
                </Tab>
                <Tab eventKey="debit_note" title="Debit Note">
                  <div className="mt-2">
                    <TableGeneric columns={debitNoteColumns} data={[]} />
                  </div>
                </Tab>
                <Tab eventKey="expense" title="Expense">
                  <div className="mt-2">
                    <TableGeneric columns={expenseColumns} data={[]} />
                  </div>
                </Tab>
                <Tab eventKey="receipt" title="Receipt">
                  <div className="mt-2">
                    <TableGeneric columns={receiptColumns} data={[]} />
                  </div>
                </Tab>
                <Tab eventKey="payment" title="Payment">
                  <div className="mt-2">
                    <TableGeneric columns={paymentColumns} data={paymentData} />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
}