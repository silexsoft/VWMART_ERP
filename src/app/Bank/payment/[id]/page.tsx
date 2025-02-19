"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import TableGeneric from "@/components/Tables/TableGeneric";

const PaymentDetail = () => {
  const [data, setData] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.match(/\/payment\/(\d+)/)?.[1];
  
  //   let id = router.query.id;
  const columns = [
    {
      width: "20px",
      label: "Bill No.",
      field: "billNo",
    },
    {
      width: "20px",
      label: "Net Amount",
      field: "netAmount",
    },
    {
      width: "20px",
      label: "Paid Amount",
      field: "paidAmount",
    },
    {
      width: "20px",
      label: "Pending Amount",
      field: "pendingAmount",
    },
    {
      width: "20px",
      label: "Kasar Amount",
      field: "kasarAmount",
    },
    {
      width: "20px",
      label: "Payment",
      field: "payment",
    },
  ];

  const dummyData = [
    {
      id: 1,
      billNo: "B12345",
      netAmount: 5000,
      paidAmount: 3000,
      pendingAmount: 2000,
      kasarAmount: 50,
      payment: "Partial",
    },
    {
      id: 2,
      billNo: "B67890",
      netAmount: 7000,
      paidAmount: 7000,
      pendingAmount: 0,
      kasarAmount: 100,
      payment: "Complete",
    },
    {
      id: 3,
      billNo: "B54321",
      netAmount: 8000,
      paidAmount: 4000,
      pendingAmount: 4000,
      kasarAmount: 75,
      payment: "Partial",
    },
    {
      id: 4,
      billNo: "B98765",
      netAmount: 6000,
      paidAmount: 3000,
      pendingAmount: 3000,
      kasarAmount: 50,
      payment: "Partial",
    },
    {
      id: 5,
      billNo: "B11223",
      netAmount: 9000,
      paidAmount: 4500,
      pendingAmount: 4500,
      kasarAmount: 25,
      payment: "Partial",
    },
    {
      id: 6,
      billNo: "",
      netAmount: "",
      paidAmount: "",
      pendingAmount: "",
      kasarAmount: "Total",
      payment: 200,
    },
  ];

  return (
    <DefaultLayout>
      <div className="payment_page container">
        <div className="d-flex justify-content-between align-items-center gap-2">
          <span className="payment_status">Cleared</span>
          <div className="d-flex justify-content-end align-items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/Bank/payment/${id}/edit`)}
            >
              <i className="fa fa-edit"></i>
            </button>
            <button className="btn btn-danger">
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>
        <hr />
        <div className="m-portlet__body card-body-sm">
          <div className="row">
            <div className="col-md-12 table-responsive">
              <table className="table-sm table-striped table-bordered table-hover table-checkable table">
                <tbody>
                  <tr>
                    <th>Party Name</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Payment Date</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Payment Method</th>
                    <td>
                      <span></span>
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Mode</th>
                    <td></td>
                  </tr>

                  <tr>
                    <th>Amount</th>
                    <td>
                      <i
                        className="fa fa-inr currency_style"
                        aria-hidden="true"
                      ></i>{" "}
                     
                    </td>
                  </tr>

                  <tr>
                    <th>Description</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Created By</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Created On</th>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <table className="table-sm table-striped table-bordered table-hover table-checkable mb-0 mt-2 table">
                <tbody>
                  <tr>
                    <th>Bank Name</th>

                    <th>Transaction Date</th>
                    <th>Transaction No.</th>
                  </tr>
                  <tr>
                    <td>Axis Bank Ltd</td>
                    <td>14/10/2024</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <TableGeneric columns={columns} data={dummyData} customClasses="mt-3" />
      </div>
    </DefaultLayout>
  );
};
export default PaymentDetail;
