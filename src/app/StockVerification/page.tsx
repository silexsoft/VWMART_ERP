"use client";
import { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableGeneric from "@/components/Tables/TableGeneric";
import { Col, Form } from "react-bootstrap";
export default function Page() {
  const [openDrop, setOpenDrop] = useState(false);
  const [field, setField] = useState([]);
  const stockVerificationColumns = [
    { width: "100px", label: "Sr. No.", field: "serial_no" },
    {
      width: "200px",
      label: "Stock Verification No.",
      field: "stock_verification_no",
    },
    {
      width: "200px",
      label: "Stock Verification Date",
      field: "stock_verification_date",
    },
    { width: "150px", label: "Total Products", field: "total_products" },
    {
      width: "150px",
      label: "Total Physical Qty",
      field: "total_physical_qty",
    },
    {
      width: "200px",
      label: "Difference Amount",
      field: "difference_amount",
    },
    { width: "150px", label: "Approved Qty", field: "approved_qty" },
    { width: "150px", label: "Created By", field: "created_by" },
    { width: "100px", label: "Status", field: "status" },
    { width: "100px", label: "Actions", field: "actions" },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Stock Verification"
        links={[{ label: "", route: "/" }]}
      />
      <div className="stockverification-new-page common_page_layout">
        <div className="product_page inventory_tracking_page">
          <div className="m-portlet__body  card-body-sm" data-select2-id={7}>
            <div className="col-md-12 p-0" data-select2-id={6}>
              <div className="row" data-select2-id={5}>
                <div className="form-group col-lg-3 col-md-4 col-sm-12 d-flex">
                  <div className="date mr-1">
                    <input
                      type="date"
                      className="form-control form-control-sm todaybtn-datepicker"
                      name="fromDate"
                      placeholder="dd/mm/yyyy"
                      id="fromDate"
                      data-date-format="dd/mm/yyyy"
                      defaultValue=""
                      data-date-start-date="01/04/2024"
                      data-date-end-date="31/03/2025"
                    />
                  </div>
                  <div className="date">
                    <input
                      type="date"
                      className="form-control form-control-sm todaybtn-datepicker"
                      name="toDate"
                      placeholder="dd/mm/yyyy"
                      id="toDate"
                      data-date-format="dd/mm/yyyy"
                      defaultValue=""
                      data-date-start-date="01/04/2024"
                      data-date-end-date="31/03/2025"
                    />
                  </div>
                </div>
                <div
                  className="form-group col-lg-2 col-md-2 col-sm-12"
                  data-select2-id={4}
                >
                  <select
                    className="form-control m-select2 select2-hidden-accessible"
                    id="selectstatus"
                    name="status"
                    data-allow-clear="true"
                    data-select2-id="selectstatus"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <option value="" data-select2-id={2}>
                      All
                    </option>
                    <option value="approve" data-select2-id={11}>
                      Approve
                    </option>
                    <option value="pending" data-select2-id={12}>
                      Pending
                    </option>
                    <option value="Reject" data-select2-id={13}>
                      Reject
                    </option>
                  </select>
                </div>
                <div className="col-lg-3 col-md-1" />
                <div className="col-lg-4 col-md-5 col-sm-12 pr-0">
                  <div className="text-right">
                    <div className="col-md-12 d-flex">
                      <select
                        id="datatableCustomTableLengthSelectBox"
                        className="form-control form-control-sm mr-1"
                        data-toggle="tooltip"
                        title=""
                        data-original-title="Show number of record"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                        <option value={500}>500</option>
                        <option value={-1}>All</option>
                      </select>
                      <div className="input-group input-group-sm mr-2">
                        <input
                          type="text"
                          className="form-control form-control-sm m-input search-icons"
                          id="datatableCustomSearchInput"
                          placeholder="Search List..."
                          aria-describedby="basic-addon2"
                        />
                        <span className="search-font fa fa-search"></span>
                      </div>
                      <a
                        href="/StockVerification/new"
                        className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air create-new-btn"
                        data-toggle="modal"
                        data-target="#category_new_model"
                      >
                        Create New
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 form-group">
                  <label>Location</label>
                  <MultiSelectDropdown />
                  {/* <label>Location</label>
                  <select
                    className="form-control branch-multiple-select d-none"
                    name="branch"
                    id="branch"
                    data-col-index={1}
                    multiple
                  >
                    <option value={18048}>VW-BMR 1107</option>
                    <option value={12241}>VW-JLN 1106</option>
                    <option value={12236}>VW-AMR 1105</option>
                    <option value={14965}>VW-PTL 1101</option>
                    <option value={19932}>VW-Mohali 1108</option>
                    <option value={8331}>VW-GOP-1109</option>
                  </select>
                  <div className="btn-group btn-block dropdown d-print-none multicheckbox position-static">
                    <button
                      type="button"
                      id="branch-dropdown-btn"
                      className="btn btn-outline-secondary btn-block dropdown-toggle active bg-secondary text-white"
                      data-toggle="dropdown"
                      data-boundary="window"
                      data-display="static"
                      aria-haspopup="true"
                      aria-expanded="false"
                      aria-pressed="true"
                    >
                      <span>Select Location</span> &nbsp;
                      <span
                        id="branch-dropdown-badge"
                        className="badge badge-dark"
                      >
                        1
                      </span>
                    </button>
                    <div
                      id="branch-dropdown-menu"
                      className="dropdown-menu w-100 overflow-auto"
                      aria-labelledby="branch-dropdown-btn"
                      style={{ overflowY: "scroll", maxHeight: 395 }}
                    >
                      <div className="dropdown-item-text px-2">
                        <div className="input-group">
                          <input
                            type="text"
                            id="branch-search-input"
                            className="form-control"
                            autoComplete="off"
                            aria-describedby="branch-search"
                          />
                        </div>
                      </div>
                      <div
                        id="branch-dropdown-item-all"
                        className="dropdown-item-text text-nowrap px-2"
                      >
                        <label
                          className="d-block mb-0"
                          htmlFor="branch-dropdown-checkbox-all"
                        >
                          <input
                            type="checkbox"
                            id="branch-dropdown-checkbox-all"
                            className="dropdown-checkbox allcheckbox"
                            defaultValue=""
                            autoComplete="off"
                          />{" "}
                          All
                        </label>
                      </div>
                      <div
                        id="branch-dropdown-item-1"
                        className="dropdown-item-text branch-dropdown-item text-nowrap px-2"
                      >
                        <label
                          className="d-block mb-0"
                          htmlFor="branch-dropdown-checkbox-1"
                        >
                          <input
                            type="checkbox"
                            id="branch-dropdown-checkbox-1"
                            className="dropdown-checkbox"
                            defaultValue={18048}
                            data-offset={1}
                            autoComplete="off"
                          />{" "}
                          VW-BMR 1107
                        </label>
                      </div>
                      <div
                        id="branch-dropdown-item-2"
                        className="dropdown-item-text branch-dropdown-item text-nowrap px-2"
                      >
                        <label
                          className="d-block mb-0"
                          htmlFor="branch-dropdown-checkbox-2"
                        >
                          <input
                            type="checkbox"
                            id="branch-dropdown-checkbox-2"
                            className="dropdown-checkbox"
                            defaultValue={12241}
                            data-offset={2}
                            autoComplete="off"
                          />{" "}
                          VW-JLN 1106
                        </label>
                      </div>
                      <div
                        id="branch-dropdown-item-3"
                        className="dropdown-item-text branch-dropdown-item text-nowrap px-2"
                      >
                        <label
                          className="d-block mb-0"
                          htmlFor="branch-dropdown-checkbox-3"
                        >
                          <input
                            type="checkbox"
                            id="branch-dropdown-checkbox-3"
                            className="dropdown-checkbox"
                            defaultValue={12236}
                            data-offset={3}
                            autoComplete="off"
                          />{" "}
                          VW-AMR 1105
                        </label>
                      </div>
                      <div
                        id="branch-dropdown-item-4"
                        className="dropdown-item-text branch-dropdown-item text-nowrap px-2"
                      >
                        <label
                          className="d-block mb-0"
                          htmlFor="branch-dropdown-checkbox-4"
                        >
                          <input
                            type="checkbox"
                            id="branch-dropdown-checkbox-4"
                            className="dropdown-checkbox"
                            defaultValue={14965}
                            data-offset={4}
                            autoComplete="off"
                          />{" "}
                          VW-PTL 1101
                        </label>
                      </div>
                      <div
                        id="branch-dropdown-item-5"
                        className="dropdown-item-text branch-dropdown-item text-nowrap px-2"
                      >
                        <label
                          className="d-block mb-0"
                          htmlFor="branch-dropdown-checkbox-5"
                        >
                          <input
                            type="checkbox"
                            id="branch-dropdown-checkbox-5"
                            className="dropdown-checkbox"
                            defaultValue={19932}
                            data-offset={5}
                            autoComplete="off"
                          />{" "}
                          VW-Mohali 1108
                        </label>
                      </div>
                      <div
                        id="branch-dropdown-item-6"
                        className="dropdown-item-text branch-dropdown-item text-nowrap px-2"
                      >
                        <label
                          className="d-block mb-0"
                          htmlFor="branch-dropdown-checkbox-6"
                        >
                          <input
                            type="checkbox"
                            id="branch-dropdown-checkbox-6"
                            className="dropdown-checkbox"
                            defaultValue={8331}
                            data-offset={6}
                            autoComplete="off"
                          />{" "}
                          VW-GOP-1109
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      id="branch-reset-btn"
                      className="btn btn-white"
                    >
                      <i className="far fa-times-circle" />
                    </button>
                  </div> */}
                </div>
                <div className="col-lg-3 col-md-3 from-group">
                  <div className="form-group">
                    <label className="col-12">&nbsp;</label>
                    <div className="export-icons">
                      <button
                        className="btn btn-sm btn-primary buttons-collection dropdown-toggle"
                        onClick={() => setOpenDrop(!openDrop)}
                      >
                        <span>
                          <i className="fas fa-file-export" />
                        </span>
                      </button>
                      <div
                        className={`dropdown-menu dropdown-menu-right ${openDrop ? "show" : ""}`}
                        x-placement="bottom-end"
                        // style={{
                        //   position: "absolute",
                        //   willChange: "transform",
                        //   top: 0,
                        //   left: 0,
                        //   transform: "translate3d(65px, 57px, 0px)",
                        // }}
                      >
                        <a
                          className="dropdown-item"
                          href="javascript:void(0)"
                          id="SalesItemRegisterexport_excel"
                          title="Excel"
                        >
                          <i className="fa fa-file-excel" /> Excel
                        </a>
                        <a
                          className="dropdown-item"
                          href="javascript:void(0)"
                          id="mytablePDF"
                          title="PDF"
                        >
                          <i className="fa fa-file-pdf" /> PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-section">
            <TableGeneric columns={stockVerificationColumns} data={[]} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

const MultiSelectDropdown = () => {
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // if (dropdownRef.current &&
      //       !dropdownRef.current.contains(event.target)) {
      //     setIsOpen(false);
      // }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const options = [
    { id: 1, label: "Option 1" },
    { id: 2, label: "Option 2" },
    { id: 3, label: "Option 3" },
    { id: 4, label: "Option 4" },
    { id: 5, label: "Option 5" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (event: any) => {
    const optionId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter((id: any) => id !== optionId));
    }
  };

  return (
    <div ref={dropdownRef} className={`dropdown ${isOpen ? "show" : ""}`}>
      <button
        // style={{ width: "20%" }}
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="multiSelectDropdown"
        onClick={toggleDropdown}
      >
        Select Location
      </button>
      <div
        style={{ width: "20%" }}
        className={`dropdown-menu ${isOpen ? "show" : ""}`}
        aria-labelledby="multiSelectDropdown"
      >
        {options.map((option) => (
          <Form.Check
            style={{ marginLeft: "10%" }}
            key={option.id}
            type="checkbox"
            id={`option_${option.id}`}
            label={option.label}
            checked={selectedOptions.includes(option.id)}
            onChange={handleOptionChange}
            value={option.id}
          />
        ))}
      </div>
      {/* {JSON.stringify(selectedOptions)} */}
    </div>
  );
};
