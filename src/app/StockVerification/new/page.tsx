"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDynamic from "@/components/Tables/TableDynamic";
import * as yup from "yup";
export default function Page() {
  const columns = [
    { label: "Sr. No.", type: "input", name: "serial_no", width: "100px" },
    { label: "ItemCode", type: "input", name: "item_code", width: "100px" },
    { label: "Product*", type: "input", name: "product", width: "100px" },
    { label: "Batch", type: "input", name: "batch", width: "100px" },
    {
      label: "Landing Cost",
      type: "input",
      name: "landing_cost",
      width: "100px",
    },
    { label: "Price", type: "input", name: "price", width: "100px" },
    { label: "MRP", type: "input", name: "mrp", width: "100px" },
    {
      label: "Selling Price",
      type: "input",
      name: "selling_price",
      width: "100px",
    },
    {
      label: "System Qty",
      type: "input",
      name: "system_qty",
      width: "100px",
    },
    {
      label: "Physical Qty*",
      type: "input",
      name: "physical_qty",
      width: "100px",
    },
    {
      label: "Difference Qty",
      type: "input",
      name: "difference_qty",
      width: "100px",
    },
    {
      label: "Difference Amount",
      type: "input",
      name: "difference_amount",
      width: "100px",
    },
    { label: "Action", type: "input", name: "action", width: "100px" },
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

  const onSubmit = (data: any) => {};
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Stock Verification New"
        links={[{ label: "Stock Verification", route: "/StockVerification" }]}
      />
      <div className="stockverification-new-page common_page_layout">
        <div className="form-container verification_new">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="m-portlet m-portlet--tabs m-portlet--head-solid-bg m-portlet--head-sm">
                <div className="m-portlet__body card-body-sm">
                  <div className="tab-content">
                    <div className="row mb-3">
                      <div className="col-md-2 form-group">
                        <label className="col-lg-12 col-md-12 col-sm-12 p-0">
                          Department
                        </label>
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="department"
                          data-col-index={1}
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <option value="" data-select2-id={2}>
                            All
                          </option>
                          <option value={15924}>Other</option>
                          <option value={13094}>Grocery</option>
                        </select>
                      </div>
                      <div className="col-md-2 form-group">
                        <label className="col-lg-12 col-md-12 col-sm-12 p-0">
                          Category
                          <small
                            style={{ fontWeight: "bold", fontSize: "0.66rem" }}
                          >
                            (Category &amp; Subcategory Selection)
                          </small>
                        </label>
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="category"
                          data-col-index={1}
                          data-allow-clear="true"
                          data-select2-id="category"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <option data-select2-id={11} />
                          <option value={185772}>\</option>
                          <option value={403030}>8901826803603</option>
                          <option value={189777}>8906004620645</option>
                          <option value={425188}>biscuit</option>
                          <option value={424686}>BIVERAGE</option>
                          <option value={276810}>body wash</option>
                          <option value={426290}>BRAEK FAST</option>
                          <option value={426234}>BREAK FAST</option>
                          <option value={425179}>CAFE</option>
                          <option value={424534}>chocolate</option>
                          <option value={426231}>CLOTH CARE</option>
                          <option value={396316}>cold drink</option>
                          <option value={424171}>colga</option>
                          <option value={424476}>colgate</option>
                          <option value={423262}>dairy</option>
                          <option value={372215}>disposble</option>
                          <option value={426221}>DRY FRUITE</option>
                          <option value={426235}>FOOD</option>
                          <option value={425408}>frozen</option>
                          <option value={154853}>General</option>
                          <option value={426219}>GROCERY</option>
                          <option value={426236}>HAIR CARE</option>
                          <option value={426237}>HOME CARE</option>
                          <option value={425078}>ice cream</option>
                          <option value={425234}>juice</option>
                          <option value={424985}>lassi</option>
                          <option value={424535}>masala</option>
                          <option value={426238}>PAIN RELIFE</option>
                          <option value={424488}>perfume</option>
                          <option value={426229}>PERSONAL CARE</option>
                          <option value={154768}>Pulses</option>
                          <option value={423263}>SHAKES</option>
                          <option value={426217}>SNACKS</option>
                          <option value={314612}>soap</option>
                          <option value={426243}>SPIECE</option>
                          <option value={423525}>STAPLE</option>
                          <option value={425391}>surf</option>
                          <option value={426419}>VW CAFE</option>
                        </select>
                      </div>
                      <div className="col-md-2 form-group">
                        <label className="col-lg-12 col-md-12 col-sm-12 p-0">
                          Brand
                          <small
                            style={{ fontWeight: "bold", fontSize: "0.72rem" }}
                          >
                            (Brand &amp; Subbrand Selection)
                          </small>
                        </label>
                        <select
                          className="form-control m-select2 select2-hidden-accessible"
                          id="brand"
                          data-col-index={2}
                          data-allow-clear="true"
                          data-select2-id="brand"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <option value="" data-select2-id={6}>
                            All
                          </option>
                          <option value={696683}>8901826803603</option>
                          <option value={731975}>active wheel</option>
                          <option value={709646}>act popcorn</option>
                        </select>
                      </div>
                      <div className="col-md-1" id="applyCol">
                        <label className="col-lg-12 col-md-12 col-sm-12 p-0">
                          &nbsp;
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-info"
                          id="generate_barcode_btn_up"
                        >
                          Apply
                        </button>
                      </div>
                      <div className="col-md-5" id="applyCheck">
                        <div className="col-12">
                          <label>Clear Form</label>
                          <input
                            type="checkbox"
                            id="clearDuplicateValue"
                            name="clearDuplicateValue"
                            defaultValue={0}
                          />
                        </div>
                        <div className="col-12">
                          <div className="row" style={{ alignItems: "center" }}>
                            <div className="col-3">
                              <span
                                className="px-0"
                                style={{ fontWeight: "bold" }}
                              >
                                Focus on
                              </span>
                            </div>
                            <select
                              className="col-6 form-control m-select2 select2-hidden-accessible"
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
                    <div className="row mb-2">
                      <div
                        className="col-md-4 form-group "
                        id="searchBarcodediv"
                      >
                        <input
                          className="form-control form-control-sm"
                          placeholder="Enter Barcode or Search Product"
                          type="text"
                          id="barcode"
                          name="barcode"
                        />
                      </div>
                      <div className="col-md-8 form-group ">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Enter Remark"
                          type="text"
                          id="remark"
                          name="remark"
                        />
                      </div>
                    </div>
                    <div
                      className="tab-pane active"
                      id="m_tabs_7_1"
                      role="tabpanel"
                    >
                      <div className="row" id="productdetails-portlet">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <TableDynamic
                            columns={columns}
                            schema={schema}
                            rows={[]}
                            onSubmit={onSubmit}
                          />
                        </div>
                      </div>
                    </div>
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
