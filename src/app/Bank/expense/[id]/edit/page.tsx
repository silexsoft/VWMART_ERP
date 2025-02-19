"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDynamic from "@/components/Tables/TableDynamic";
import TableDynamicExpenseEdit from "@/components/Tables/TableDynamicExpenseEdit";

import * as yup from "yup";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { set } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { AnyAaaaRecord } from "node:dns";
import { usePathname } from "next/navigation";

export default function Page() {
  const [totalVal, setTotalVal] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [taxableAmount, setTaxableAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [expenseId, setExpenseId] = useState(0);
  const { token, logout } = useAuth();
  const [date, setDate] = useState<Date | null>(new Date());
  const { watch } = useForm();
  const { setValue } = useForm();
  const pathname = usePathname();
  const id = pathname.match(/\/Bank\/expense\/(\d+)/)?.[1];

  interface expenses {
    Id?: Number | null;
    ExpenseNo: string;
    ExpenseDate: Date;
    PartyName: string;
    Total: string;
    Paid: string;
    UnPaid: string;
    Branch: string;
    CreatedBy: string;
    CreatedFrom: string;
    InvoiceNo: string;
    ReverseCharge: false;
    AppliedTaxType: string;
    NonGST: false;
    Note: string;
    GrossAmount: string;
    Discount: string;
    TaxableAmount: string;
    Tax: string;
    NetAmount: string;
    CreatedAt: Date;
    UpdatedAt: Date;
  }

  const [expense, setExpense] = useState<expenses>({
    Id: 0,
    ExpenseNo: "",
    ExpenseDate: new Date(),
    PartyName: "",
    Total: "",
    Paid: "",
    UnPaid: "",
    Branch: "",
    CreatedBy: "",
    CreatedFrom: "",
    InvoiceNo: "",
    ReverseCharge: false,
    AppliedTaxType: "",
    NonGST: false,
    Note: "",
    GrossAmount: "",
    Discount: "",
    TaxableAmount: "",
    Tax: "",
    NetAmount: "",
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  });

  interface ExpenseAccount {
    Id?: number | null;
    Account: string;
    ServiceProduct: string;
    Description: string;
    Amount: string;
    Discount: string;
    Tax: string;
    TaxValue: string;
    Total: string;
    ExpenseId?: number | null;
    CreatedAt: Date;
    UpdatedAt: Date;
  }
  const [expenseAccount, setExpenseAccount] = useState<ExpenseAccount[]>([]);
  const [formdata, Setformdata] = useState([]);
  //setValue("names.0.tax_value", 25); // Updates the tax_value for the first row

  const dmyData = [];
  const formRef: any = useRef();
  const handleInputChange = (
    // e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setExpense((predata: any) => ({
      ...predata, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const handleInputCheckboxChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value, ariaChecked } = e.target;

    setExpense((predata: any) => ({
      ...predata, // Spread previous state
      [name]: type === "checkbox" ? ariaChecked : value, // Handle checkbox separately
    }));
  };

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/GetExpensesById/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} - ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log("Fetched Expense Data:", data);
        setExpense(data);
        setGrossAmount(data.GrossAmount);
        setDiscount(data.Discount);
        setTaxAmount(data.Tax);
        setTaxableAmount(data.TaxableAmount);
        setTotalVal(data.NetAmount);
        setExpenseId(data.Id);
      } catch (error) {
        console.error("Failed to fetch Expense:", error || error);
      } finally {
        // setIsLoading(false); // Always set loading to false after the fetch is complete.
      }
    };

    fetchExpense();
  }, []);

  useEffect(() => {
    const fetchExpenseAccounts = async () => {
      try {
        console.log("expenseId" + expenseId);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/GetExpenseAccountByExpenseId/${expenseId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} - ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log("Fetched Expense Account Data:", data);
        setExpenseAccount(data);
        console.log("Expense Account data", JSON.stringify(data));
        //setExpense(data);
      } catch (error) {
        console.error("Failed to fetch Expense:", error || error);
      } finally {
        // setIsLoading(false); // Always set loading to false after the fetch is complete.
      }
    };
    if (expenseId != 0 && expenseAccount.length == 0) {
      fetchExpenseAccounts();
    }
  }, [expenseId]);

  const schema = yup
    .object({
      names: yup
        .array()
        .of(
          yup.object({
            // name: yup.string().required("Name is required"),
            account: yup
              .string()
              .required("Account is required")
              .test("required", "Account is required", (value) => value !== ""),

            amount: yup.number().required("Amount is required").min(0),
            discount: yup.number().required("Discount is required").min(0),
            tax: yup.string().required("Tax is required"),
            tax_value: yup.number().required("Tax Value is required"),
            // total: yup.number().required("Total is required")
            total: yup.number().required("Total is required"),
          }),
        )
        .min(1, "At least one row is required"), // To enforce at least one row
    })
    .required();

  const columns = [
    { label: "#", type: "serial" },
    {
      label: "Account",
      type: "select",
      options: [
        { label: "option1", value: "option1" },
        { label: "option2", value: "option2" },
        { label: "option3", value: "option3" },
      ],
      name: "account",
    },
    {
      label: "Service/Product",
      required: false,
      type: "select",
      options: [
        { label: "Product", value: "Product" },
        { label: "Service", value: "Service" },
      ],
      name: "service_product",
      postScript: '<a href="#">HSN/SAC Code</a>',
    },
    { label: "Description", type: "input", name: "description" },
    { label: "Amount", type: "input", required: true, name: "amount" },
    { label: "Discount", type: "input", required: true, name: "discount" },
    {
      label: "Tax",
      type: "select",
      name: "tax",
      required: true,
      options: [
        { label: "GST 28", value: "28" },
        { label: "GST 18", value: "18" },
        { label: "GST 12", value: "12" },
        { label: "GST 5", value: "5" },
        { label: "NON GST 0", value: "0" },
        { label: "EXEMPT0", value: "0" },
      ],
    },
    { label: "Tax Value", type: "input", name: "tax_value" },
    {
      label: "Total",
      type: "input",
      name: "total",
    },
  ];

  // const rows = [
  //   { name: "John", role: "Admin" },
  //   { name: "Jane", role: "User" },
  // ];

  const customFooter = (
    <>
      <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
      <td className="bold px-4 py-2 text-sm text-black dark:text-white"></td>
      <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
      <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
      <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
      <td className="px-4 py-2 text-sm text-black dark:text-white"></td>
      <td className="px-4 py-2 text-sm text-black dark:text-white">Total</td>
      <td className="px-4 py-2 text-sm text-black dark:text-white">
        {totalVal}
      </td>
    </>
  );
  const CreateExpenseAccount = async (data: any) => {
    for (const account of data.names) {
      if (account.Id != "") {
        try {
          console.log("expenseId" + expenseId);
          // Creating the expenseAccount object based on the account data
          const expenseAccount = {
            Id: account.Id,
            ServiceProduct: account.service_product,
            Account: account.account,
            Description: account.description,
            Amount: account.amount,
            Discount: account.discount,
            Tax: account.tax,
            TaxValue: account.tax_value,
            Total: account.total,
            ExpenseId: expenseId, // Assuming ExpenseId is 0 for now
            // CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
          };
          console.log(
            "Before updated Expense Account Data: " +
              JSON.stringify(expenseAccount),
          );

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/ExpenseAccountUpdate`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify(expenseAccount),
            },
          );

          if (!response.ok) {
            toast.error("Something Went Wrong", {
              position: "top-right",
              autoClose: 5000,
            });
            throw new Error(`Error: ${response.statusText}`);
          }
          toast.success("Details Saved", {
            position: "top-right",
            autoClose: 5000,
          });
          const responseData = await response.json();
          console.log("Updated data: " + JSON.stringify(responseData));
        } catch (error) {
          toast.error("Something Went Wrong", {
            position: "top-right",
            autoClose: 5000,
          });
          //console.error("Error processing expense account:", error);
        }
      } else {
        try {
          console.log(
            "Before inserted Expense Account Data: " + JSON.stringify(account),
          );
          console.log("expenseId" + expenseId);
          // Creating the expenseAccount object based on the account data
          const expenseAccount = {
            ServiceProduct: account.service_product,
            Account: account.account,
            Description: account.description,
            Amount: account.amount,
            Discount: account.discount,
            Tax: account.tax,
            TaxValue: account.tax_value,
            Total: account.total,
            ExpenseId: expenseId, // Assuming ExpenseId is 0 for now
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            Id: 0,
          };

          console.log(
            "Before inserted Expense Account Data: " +
              JSON.stringify(expenseAccount),
          );
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/ExpenseAccountCreate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify(expenseAccount),
            },
          );

          if (!response.ok) {
            toast.error("Something Went Wrong", {
              position: "top-right",
              autoClose: 5000,
            });
            throw new Error(`Error: ${response.statusText}`);
          }
          toast.success("Details Saved", {
            position: "top-right",
            autoClose: 5000,
          });
          const responseData = await response.json();
          console.log("Updated data: " + JSON.stringify(responseData));
        } catch (error) {
          toast.error("Something Went Wrong", {
            position: "top-right",
            autoClose: 5000,
          });
          console.error("Error processing expense account:", error);
        }
      }
    }
  };

  // const CreateExpenseAccount = async (Data: any[]) => {
  //   try {
  //     Data.forEach(async (expenseAccount) => {
  //       console.log(
  //         "Before inserted Expense Account Data" +
  //           JSON.stringify(expenseAccount),
  //       );

  //       expenseAccount.CreatedAt = new Date().toISOString();
  //       expenseAccount.UpdatedAt = new Date().toISOString();
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/ExpenseAccountCreate`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             accept: "application/json",
  //             Authorization: token ? `Bearer ${token}` : "",
  //           },
  //           body: JSON.stringify(expenseAccount),
  //         },
  //       );
  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.statusText}`);
  //       } else {
  //         // handleOpenModal();
  //       }
  //       const data = await response.json();
  //       console.log("updated data" + JSON.stringify(data));

  //       return data;
  //     });
  //   } catch (error) {
  //   } finally {
  //   }
  // };

  const UpdateExpense = async (ExpenseData: any) => {
    try {
      ExpenseData.ReverseCharge =
        ExpenseData.ReverseCharge === "yes" ? true : false;
      ExpenseData.NonGST = ExpenseData.NonGST === "on" ? true : false;
      ExpenseData.GrossAmount = grossAmount;
      ExpenseData.Discount = discount;
      ExpenseData.TaxableAmount = taxableAmount;
      ExpenseData.Tax = taxAmount;
      ExpenseData.NetAmount = totalVal;
      ExpenseData.Total = totalVal;
      ExpenseData.ExpenseDate = new Date(expense.ExpenseDate).toISOString();
      //ExpenseData.CreatedAt = expense.CreatedAt;
      ExpenseData.UpdatedAt = new Date().toISOString();

      console.log(
        "Before inserted ExpenseData Data" + JSON.stringify(ExpenseData),
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/ExpenseUpdate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(ExpenseData),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      } else {
        // handleOpenModal();
      }
      const data = await response.json();
      // console.log("updated data" + JSON.stringify(data));
      // setExpenseId(data.Id);
      // return data.Id;
    } catch (error) {
    } finally {
    }
  };
  const onSubmit = (data: any) => {
    console.log(data);
    console.log("Form Data is:", data);
    console.log("expense data" + JSON.stringify(expense));
    // Setformdata(data);
    UpdateExpense(expense);

    //const expenseid = CreateExpense(expense);
    CreateExpenseAccount(data);

    const dataIds = new Set(data.names.map((item: any) => item.Id));

    // Filter expenseAccount to get Ids not in data.names
    const missingIds = expenseAccount
      .filter((expense) => expense.Id && !dataIds.has(expense.Id))
      .map((expense) => expense.Id);

    console.log("Missing Ids:", missingIds);

    if (missingIds.length > 0) {
      missingIds.forEach((id) => {
        DeleteExpenseAccount(id);
      });
    }
  };

  const DeleteExpenseAccount = async (selectedItems: any) => {
    console.log("Delete ids" + JSON.stringify(selectedItems));
    try {
      try {
        const responses = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Bank/ExpenseAccountDelete/${selectedItems}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );
        if (!responses.ok) {
          toast.error("Something Went Wrong", {
            position: "top-right",
            autoClose: 5000,
          });
          throw new Error(`Error: ${responses.statusText}`);
        }
      } catch {
        toast.error("Something Went Wrong", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch {
      toast.error("Something Went Wrong", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleClick = () => {
    console.log("expense data" + JSON.stringify(expense));
    console.log(formRef);
    if (formRef.current) {
      formRef.current.click();
    }
  };

  console.log("out page");
  console.log(totalVal);

  const rows = expenseAccount.map((item) => ({
    Id: item.Id,
    account: item.Account || "",
    service_product: item.ServiceProduct || "",
    description: item.Description || "",
    amount: item.Amount || "",
    discount: item.Discount || "",
    tax: item.Tax || "",
    tax_value: item.TaxValue || "",
    total: item.Total || "",
  }));

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Edit Bank Expense"
        links={[{ label: "Bank Expense", route: "/Bank/expense" }]}
      />
      <div className="common_page_layout bankexpense-new-page">
        <div className="m-portlet__body card-body-sm expense-edit">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group row has-success">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Expense Date<span className="text-danger">*</span>
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group date">
                    <ReactDatePicker
                      selected={date}
                      onChange={(selectedDate) => setDate(selectedDate)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control form-control-sm todaybtn-datepicker"
                      id="ExpenseDate"
                      name="ExpenseDate"
                      placeholderText="Select Date"
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
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="expenseno"
                    name="expenseno"
                    value="EXP"
                    readOnly
                  />
                </div>
                <div className="col-lg-5 col-6">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="ExpenseNo"
                    id="ExpenseNo"
                    value={expense.ExpenseNo}
                    onChange={handleInputChange}
                  />
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
                      id="InvoiceNo"
                      name="InvoiceNo"
                      value={expense.InvoiceNo}
                      onChange={handleInputChange}
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
                        id="ReverseCharge"
                        name="ReverseCharge"
                        value={expense.ReverseCharge ? "Yes" : "No"}
                        onChange={handleInputChange}
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
                        id="AppliedTaxType"
                        name="AppliedTaxType"
                        value={expense.AppliedTaxType}
                        onChange={handleInputChange}
                      >
                        <option>Select</option>
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
                          <input
                            type="checkbox"
                            id="NonGST"
                            name="NonGST"
                            checked={Boolean(expense.NonGST)}
                            onChange={handleInputChange}
                          />{" "}
                          &nbsp; &nbsp;Non-GST <span></span>
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
                  <textarea
                    className="form-control form-control-sm"
                    id="Note"
                    name="Note"
                    value={expense.Note}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row"></div>
          <div className="row">
            <div className="col-md-12">
              {rows.length > 0 && (
                <TableDynamicExpenseEdit
                  columns={columns}
                  rows={rows}
                  onSubmit={onSubmit}
                  schema={schema}
                  ref={formRef}
                  watch={watch}
                  footer={customFooter}
                  setValue={setValue}
                  getTotal={setTotalVal}
                  getGrossAmount={setGrossAmount}
                  getDiscount={setDiscount}
                  getTaxableAmount={setTaxableAmount}
                  getTaxAmount={setTaxAmount}
                />
              )}
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
                          {grossAmount}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <th>Discount </th>
                      <td>
                        <h6 className="mb-0" id="total_discount">
                          {discount}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <th>Taxable Amount</th>
                      <td>
                        <h6 className="mb-0" id="taxable_amount">
                          {taxableAmount}
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
                          {taxAmount}
                        </h6>
                      </td>
                    </tr>

                    {/* <tr className="border-bottom m--hide tcsdiv">
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
                    </tr> */}
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
                          {parseFloat(totalVal).toFixed(2)}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <h4 className="mb-0">Net Amount</h4>
                      </th>
                      <td>
                        <h4 className="mb-0" id="net_amount">
                          {totalVal}
                        </h4>
                      </td>
                    </tr>
                    {/* <tr className="border-bottom m--hide tdsdiv">
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
                    </tr> */}
                    {/* <tr className="m--hide tdsdiv">
                      <th>
                        <h4 className="mb-0">Payable Amount</h4>
                      </th>
                      <td>
                        <h4 className="mb-0" id="payable_amount">
                          0.00
                        </h4>
                      </td>
                    </tr> */}
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
                onClick={handleClick}
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
      </div>
      <ToastContainer />
    </DefaultLayout>
  );
}
