'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDynamic from "@/components/Tables/TableDynamic";
import { Tab, Tabs } from "react-bootstrap";
import * as yup from "yup";
export default function Page(){
    const columns = [
      {
        label: "Sr. No.",
        type: "input",
        name: "serial_no",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "ItemCode",
        type: "input",
        name: "item_code",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Product",
        type: "input",
        name: "product",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Batch",
        type: "input",
        name: "batch",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Landing Cost",
        type: "input",
        name: "landing_cost",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Price",
        type: "input",
        name: "price",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "MRP",
        type: "input",
        name: "mrp",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Selling Price",
        type: "input",
        name: "selling_price",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "System Qty",
        type: "input",
        name: "system_qty",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Physical Qty",
        type: "input",
        name: "physical_qty",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Diff. Qty",
        type: "input",
        name: "diff_qty",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Diff. Amt",
        type: "input",
        name: "diff_amt",
        width: "100px",
        inputProps: { disabled: true },
      },
      {
        label: "Approve Qty",
        type: "input",
        name: "approve_qty",
        width: "100px",
        required:true
      },
    ];

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

        const onSubmit = (data:any) => {

        }
    return (
      <DefaultLayout>
        <Breadcrumb
          pageName="Stock Verification"
          links={[
            { label: "Stock Verificaition", route: "/inventorytracking" },
          ]}
        />
        <div className="inventory_details">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="m-portlet">
                <div className="d-flex justify-content-between">
                  <div className="m-portlet__head-caption">
                    <div className="m-portlet__head-title">
                      <span className="badge badge-lg badge-warning">
                        Pending
                      </span>
                    </div>
                  </div>
                  <div className="m-portlet__head-tools" />
                  <div className="m-portlet__head-tools">
                    <ul className="m-portlet__nav">
                      <li className="m-portlet__nav-item">
                        <a
                          href="/inventorytracking/147323/edit"
                          className="btn btn-primary m-btn m-btn--icon m-btn--icon-only"
                          data-skin="dark"
                          data-toggle="m-tooltip"
                          data-placement="top"
                          title=""
                          data-original-title="Edit"
                        >
                          <i className="fa fa-edit" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="m-portlet__body card-body-sm">
                  <div className="row">
                    <input
                      type="hidden"
                      id="trackingId"
                      name="inventoryTrackingId"
                      defaultValue={147323}
                    />
                    <input
                      type="hidden"
                      id="verifiedQty"
                      name="verifiedQty"
                      defaultValue={1.0}
                    />
                    <input
                      type="hidden"
                      id="totalDifferenceAmount"
                      name="totalDifferenceAmount"
                      defaultValue="-644.68"
                    />
                    <div className="col-md-5 col-12">
                      <div className="table-responsive">
                        <table className="table-sm table-striped table-bordered mb-0 table">
                          <tbody>
                            <tr>
                              <th>Stock Verification Date</th>
                              <td>03/02/2025</td>
                            </tr>
                            <tr>
                              <th>Stock Verification No.</th>
                              <td>Inv52</td>
                            </tr>
                            <tr>
                              <th>Status</th>
                              <td>Pending</td>
                            </tr>
                            <tr>
                              <th>Created By</th>
                              <td>VW-GOP-1109</td>
                            </tr>
                            <tr>
                              <th>Remarks</th>
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table_section mt-4">
            <Tabs defaultActiveKey="scanned_product_details">
              <Tab
                eventKey="scanned_product_details"
                title="Scanned Product Details "
              >
                <TableDynamic
                  columns={columns}
                  schema={schema}
                  rows={[]}
                  onSubmit={onSubmit}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </DefaultLayout>
    );
}