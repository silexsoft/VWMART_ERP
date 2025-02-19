'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDynamics from "@/components/Tables/TableDynamic";
import * as yup from "yup";
export default function Page() {
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
      required: true,
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
      required: true,
    },
    {
      label: "Difference Qty",
      type: "input",
      name: "difference_qty",
      width: "100px",
      inputProps: { disabled: true },
    },
    {
      label: "Difference Amount",
      type: "input",
      name: "difference_amount",
      width: "100px",
      inputProps: { disabled: true },
    },
  ];

  const schema = yup.object().shape({
    serial_no: yup.string().required("Sr. No. is required"),
    item_code: yup.string().required("ItemCode is required"),
    product: yup.string().required("Product is required"),
    batch: yup.string().required("Batch is required"),
    landing_cost: yup.number().required("Landing Cost is required"),
    price: yup.number().required("Price is required"),
    mrp: yup.number().required("MRP is required"),
    selling_price: yup.number().required("Selling Price is required"),
    system_qty: yup.number().required("System Qty is required"),
    physical_qty: yup.number().required("Physical Qty is required"),
    difference_qty: yup.number().required("Difference Qty is required"),
    difference_amount: yup.number().required("Difference Amount is required"),
  });
  const onSubmit = () => {};
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Stock Verification Edit"
        links={[{ label: "Stock Verification", route: "/inventorytracking" }]}
      />
      <div className="edit_page edit_stockverification">
        <div className="form_box">
          <div className="row mb-2" data-select2-id={8}>
            <div className="col-md-4 form-group " id="searchBarcodediv">
              <input
                className="form-control form-control-sm"
                placeholder="Enter Barcode or Search Product"
                type="text"
                id="barcode"
                name="barcode"
              />
            </div>
            <div className="col-md-4 form-group ">
              <input
                className="form-control form-control-sm"
                placeholder="Enter Remark"
                type="text"
                id="remark"
                name="remark"
                defaultValue=""
              />
            </div>
            <div className="col-md-4 form-group ">
              <div
                className="row"
                style={{ alignItems: "center" }}
                data-select2-id={6}
              >
                <div className="col-3">
                  <span className="px-0" style={{ fontWeight: "bold" }}>
                    Focus on
                  </span>
                </div>
                <select
                  className="col-8 form-control m-select2 select2-hidden-accessible"
                  name="filter"
                  id="filter"
                  data-allow-clear="true"
                  style={{ fontSize: 12, height: 33 }}
                  aria-placeholder="Select..."
                  data-select2-id="filter"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <option value={2}>Physical Qty</option>
                  <option value={1}>Scan/search</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="table_box">
          <TableDynamics
            columns={columns}
            rows={[]}
            schema={schema}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
