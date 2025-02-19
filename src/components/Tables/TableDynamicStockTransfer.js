"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { output } from "framer-motion/m";
import { createPrerenderSearchParamsForClientPage } from "next/dist/server/request/search-params";
import { useAuth } from "@/app/context/AuthContext";
export default function TableDynamicStockTransfer({
  columns,
  rows,
  onSubmit,
  schema,
  ref,
  watch,
  setValue,
  getTotal,
  getGrossAmount,
  getDiscount,
  getTaxableAmount,
  getTaxAmount,
  gettotalNetAmount,
  gettotalQuantity,
  ...props
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue: setFormValue,
    trigger, // Used to trigger validation manually
    watch: watchFields, // Watching fields directly
  } = useForm({
    resolver: yupResolver(schema), // Use the passed schema for validation
    defaultValues: {
      names: rows || [
        {
          name: "",
          account: "",
          role: "",
          Qty: "",
          Price: "",
          Discount: "",
          Taxable: "",
          Tax: "",
          Total: "",
        },
      ],
    },
  });

  const [rest, setReset] = useState(false);
  const { token, logout } = useAuth();
  const [textboxVisibility, setTextboxVisibility] = useState({});
  const [searchQueries, setSearchQueries] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  //   const [dropdownProducts, SetdropdownProducts] = useState({});
  const [dropdownProducts, setDropdownProducts] = useState({});
  const getKey = (rowIndex, colIndex) => `${rowIndex}-${colIndex}`;

  const handleArrowClick = (rowIndex, colIndex) => {
    const key = getKey(rowIndex, colIndex);
    setTextboxVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSearchChange = (e, rowIndex, colIndex) => {
    const key = getKey(rowIndex, colIndex);
    const query = e.target.value;
    setSearchQueries((prev) => ({
      ...prev,
      [key]: query,
    }));

    // Simulate fetching filtered products
    // const filteredProducts = mockProductList.filter((prod) =>
    //   prod.name.toLowerCase().includes(query.toLowerCase()),
    // );

    // setDropdownProducts((prev) => ({
    //   ...prev,
    //   [key]: filteredProducts,
    // }));

    fetchProducts(query, rowIndex);

    fetchProducts(query).then((data) => {
      setDropdownProducts((prev) => ({
        ...prev,
        [key]: Array.isArray(data.items)
          ? data.items.map((product) => ({
              name: product.name,
              id: product.id,
            }))
          : [],
      }));
    });
  };

  const handleSelectChange = (e, rowIndex, colIndex) => {
    const key = getKey(rowIndex, colIndex);
    setSelectedValues((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
    const { value } = e.target;
    fetchProduct(value, rowIndex);
    setTextboxVisibility({});
  };

  const fetchProduct = async (query, index) => {
    try {
      console.log("Search query for single product:", query);
      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetProductsByIds/${query}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Ensure `token` is available in scope.
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching product data: ${response.statusText} (${response.status})`,
        );
      }

      const data = await response.json();
      console.log("Selected product data:", data);

      if (data && data.length > 0) {
        // Update stocktransferproducts at the specific index

        setFormValue(`names[${index}].ItemCode`, data[0]?.sku || ""); // set sku value
        setFormValue(`names[${index}].Product`, data[0]?.name || "");
        setFormValue(`names[${index}].Batch`, "");
        setFormValue(`names[${index}].Qty`, 1);
        setFormValue(`names[${index}].Price`, data[0]?.price || "");
        setFormValue(`names[${index}].Discount`, 0);
        setFormValue(`names[${index}].Taxable`, data[0]?.price || "");
        setFormValue(`names[${index}].Total`, data[0]?.price || "");
        setFormValue(
          `names[${index}].Tax`,
          data[0]?.tax_amount_percentage
            ? String(data[0].tax_amount_percentage)
            : "",
        );
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null; // Return null in case of error
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "names",
  });

  const addRow = () => {
    append({
      name: "",
      account: "",
      role: "",
      Qty: "",
      Price: "",
      Discount: "",
      Taxable: "",
      Tax: "",
      Total: "",
    });
  };

  const deleteRow = (index) => {
    remove(index);
  };
  const fetchProducts = async (query, index) => {
    try {
      //  SetdropdownProduct([]);
      //  console.log("Search query product: " + JSON.stringify(query));
      // const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=0&pageSize=10&storeId=0&vendorId=0
      // &warehouseId=0&visibleIndividuallyOnly=false&excludeFeaturedProducts=false&productTagId=0&
      // keywords=${query}&searchDescriptions=false&searchManufacturerPartNumber
      // =true&searchSku=true&searchProductTags=false&languageId=0&showHidden=false`;

      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=1
      &pageSize=10&storeId=0&vendorId=0&visibleIndividuallyOnly=false&excludeFeaturedProducts=
      false&productTagId=0&keywords=${query}&searchDescriptions=false&searchManufacturerPartNumber=
      true&searchSku=true&searchProductTags=false&languageId=0&showHidden=false`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        throw new Error(`Error in search product: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Search product data: " + JSON.stringify(data));

      setDropdownProducts(
        Array.isArray(data.items)
          ? data.items.map((product) => ({
              name: product.name,
              id: product.id,
            }))
          : [],
      );

      return data;
    } catch (error) {
      console.log("Error in product search: " + error);
    }
  };
  const names = watchFields({ name: "names" }); // Get current values of the dynamic fields
  useEffect(() => {
    console.log("change fields");
    if (!names || !names.names) return; // Prevent unnecessary execution

    let outputTotal = 0;
    let grossAmount = 0;
    let discounts = 0;
    let taxableAmount = 0;
    let taxAmount = 0;
    let totalquantity = 0;
    names.names.forEach((row, index) => {
      const { Qty, Price, Discount, Taxable, Tax, Total } = row;
      if (Qty && Price) {
        console.log("Tax", Tax);
        //const Amount = (Qty * Price) + tax ;
        // const PriceBeforeTax = Qty * Price; // Calculate base price
        // const TaxAmount = (PriceBeforeTax * Tax) / 100; // Calculate tax amount
        // const Amount = PriceBeforeTax + TaxAmount; // Add tax to base price

        // const DiscountAmount = (Amount * Discount) / 100;
        // const TaxableAmount = Amount - Number(Discount);
        // //const TaxAmount = Taxable ? (TaxableAmount * Number(Tax)) / 100 : 0;
        // // const Totals = TaxableAmount + TaxAmount;
        // const Totals = Amount - DiscountAmount;
        const PriceBeforeTax = Qty * Price; // Calculate base price
        const TaxAmount = parseFloat(((PriceBeforeTax * Tax) / 100).toFixed(2)); // Tax amount
        const Amount = parseFloat((PriceBeforeTax + TaxAmount).toFixed(2)); // Total before discount

        const DiscountAmount = parseFloat(
          ((Amount * Discount) / 100).toFixed(2),
        ); // Discount amount
        const TaxableAmount = parseFloat(
          (Amount - Number(Discount)).toFixed(2),
        ); // Taxable amount

        const Totals = parseFloat((Amount - DiscountAmount).toFixed(2)); // Final total
        const newTotal = Number(Amount);
        totalquantity += Number(Qty);
        grossAmount += Number(Amount);
        outputTotal += Totals;
        discounts += Number(Discount);
        taxableAmount += Number(TaxAmount);

        const calculatedTaxValue =
          ((Number(Amount) - Number(Discount)) * Number(Tax)) / 100;
        taxAmount = calculatedTaxValue;

        // if (Discount > 0) {
        //   setFormValue(`names[${index}].Taxable`, TaxableAmount);
        // }
        setFormValue(`names[${index}].Taxable`, Qty * Price);
        if (Tax > 0) {
          //setFormValue(`names[${index}].Tax`, TaxAmount);
        }
        setFormValue(`names[${index}].Total`, Totals);
      }

      //   const { amount, discount, tax, total } = row;
      //   if (amount && discount && tax) {
      //     const calculatedTaxValue =
      //       ((Number(amount) - Number(discount)) * Number(tax)) / 100;
      //     const newTotal = Number(amount) + calculatedTaxValue;
      //     taxAmount = calculatedTaxValue;
      //     outputTotal += newTotal; // Add to total
      //     grossAmount += Number(amount);
      //     discounts += Number(discount);
      //     taxableAmount += Number(tax);
      //     // Prevent unnecessary updates
      //     if (row.tax_value !== calculatedTaxValue) {
      //       setFormValue(`names[${index}].tax_value`, calculatedTaxValue);
      //     }
      //     if (row.total !== newTotal) {
      //       setFormValue(`names[${index}].Total`, newTotal);
      //     }
      //   }
    });
    if (getTotal) {
      getTotal(outputTotal);
    }
    if (getGrossAmount) {
      getGrossAmount(grossAmount);
    }
    if (getDiscount) {
      getDiscount(discounts);
    }
    if (getTaxAmount) {
      getTaxAmount(taxableAmount);
    }
    if (getTaxableAmount) {
      getTaxableAmount(taxAmount);
    }
    if (gettotalNetAmount) {
      gettotalNetAmount(outputTotal);
    }
    if (gettotalQuantity) {
      gettotalQuantity(totalquantity);
    }
  }, [JSON.stringify(names)]); // Prevent infinite re-renders by watching a stable JSON string

  return (
    <div
      className={`rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${props.customClasses ? props.customClasses : ""}`}
    >
      <div className="allproduct_table">
        <div className="products-tablepage">
          <div className="product-table-scroll">
            <form onSubmit={handleSubmit(onSubmit)}>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-t border-stroke dark:border-strokedark">
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={`${column.classNames || "px-4 py-2 text-left text-sm font-medium text-black dark:text-white"}`}
                        style={{ width: column.width }}
                      >
                        {column.label}
                        {column.required && (
                          <span className="text-danger">*</span>
                        )}
                      </th>
                    ))}
                    <th className="px-4 py-2"></th>
                    {/* Add a column for actions (Delete) */}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, rowIndex) => (
                    <tr
                      key={field.id}
                      className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                    >
                      {columns.map((column, colIndex) => {
                        if (column.type === "serial") {
                          return (
                            <td
                              key={colIndex}
                              className="px-4 py-2 text-sm text-black dark:text-white"
                            >
                              {rowIndex + 1}
                            </td>
                          );
                        }
                        if (column.type === "input") {
                          return (
                            <td
                              key={colIndex}
                              className="px-4 py-2 text-sm text-black dark:text-white"
                            >
                              <Controller
                                name={`names[${rowIndex}].${column.name}`} // Ensure name matches the field structure
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <input
                                    // {...field}
                                    value={value}
                                    onChange={onChange}
                                    placeholder={column.label}
                                    className="form-control"
                                    // value={field.value || ""}
                                    {...column.inputProps}
                                  />
                                )}
                              />
                              {column.postScript && <p>{column.postScript}</p>}
                              {errors?.names?.[rowIndex]?.[column.name] && (
                                <p className="m-0 text-xs text-danger">
                                  {errors.names[rowIndex][column.name].message}
                                </p>
                              )}
                            </td>
                          );
                        }
                        if (column.type === "label") {
                          return (
                            <td
                              key={colIndex}
                              className="px-4 py-2 text-sm text-black dark:text-white"
                            >
                              <Controller
                                name={`names[${rowIndex}].${column.name}`} // Ensure name matches the field structure
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <input
                                    // {...field}
                                    value={value ?? ""}
                                    onChange={onChange}
                                    placeholder={column.label}
                                    className="form-control"
                                    readOnly
                                    // value={field.value || ""}
                                    {...column.inputProps}
                                  />
                                )}
                              />
                              {column.postScript && <p>{column.postScript}</p>}
                              {errors?.names?.[rowIndex]?.[column.name] && (
                                <p className="m-0 text-xs text-danger">
                                  {errors.names[rowIndex][column.name].message}
                                </p>
                              )}
                            </td>
                          );
                        }
                        if (column.type === "select") {
                          return (
                            <td
                              key={colIndex}
                              className="px-4 py-2 text-sm text-black dark:text-white"
                            >
                              <Controller
                                name={`names[${rowIndex}].${column.name}`} // Ensure registration matches
                                control={control}
                                render={({ field }) => (
                                  <select {...field} className="form-control">
                                    <option value="">Select</option>
                                    {column.options?.map(
                                      (option, optionIndex) => (
                                        <option
                                          key={optionIndex}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ),
                                    )}
                                  </select>
                                )}
                              />
                              {errors?.names?.[rowIndex]?.[column.name] && (
                                <p className="m-0 text-xs text-danger">
                                  {errors.names[rowIndex][column.name].message}
                                </p>
                              )}
                            </td>
                          );
                        }
                        if (column.type === "text") {
                          return (
                            <td
                              key={colIndex}
                              className="px-4 py-2 text-sm text-black dark:text-white"
                            >
                              <Controller
                                name={`names[${rowIndex}].${column.name}`} // Ensure registration matches
                                control={control}
                                render={({ field }) => (
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={field.value || ""}
                                    {...column.inputProps}
                                  />
                                  //   <select {...field} className="form-control">
                                  //     <option value="">Select</option>
                                  //     {column.options?.map(
                                  //       (option, optionIndex) => (
                                  //         <option
                                  //           key={optionIndex}
                                  //           value={option.value}
                                  //         >
                                  //           {option.label}
                                  //         </option>
                                  //       ),
                                  //     )}
                                  //   </select>
                                )}
                              />
                              {errors?.names?.[rowIndex]?.[column.name] && (
                                <p className="m-0 text-xs text-danger">
                                  {errors.names[rowIndex][column.name].message}
                                </p>
                              )}
                              <span
                                id="dropdown"
                                className="form-control"
                                onClick={() =>
                                  handleArrowClick(rowIndex, colIndex)
                                }
                              >
                                ^
                              </span>
                              {textboxVisibility[
                                getKey(rowIndex, colIndex)
                              ] && (
                                <div
                                  style={{ marginTop: "10px" }}
                                  className="drop-show-input-txt"
                                >
                                  <input
                                    type="text"
                                    id="textbox"
                                    className="form-control"
                                    placeholder=""
                                    value={
                                      searchQueries[
                                        getKey(rowIndex, colIndex)
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleSearchChange(e, rowIndex, colIndex)
                                    }
                                  />
                                  <select
                                    onChange={(e) =>
                                      handleSelectChange(e, rowIndex, colIndex)
                                    }
                                    value={
                                      selectedValues[
                                        getKey(rowIndex, colIndex)
                                      ] || ""
                                    }
                                  >
                                    {dropdownProducts[
                                      getKey(rowIndex, colIndex)
                                    ]?.map((prod) => (
                                      <option key={prod.id} value={prod.id}>
                                        {prod.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </td>
                          );
                        }

                        return (
                          <td
                            key={colIndex}
                            className="px-4 py-2 text-sm text-black dark:text-white"
                          >
                            <input
                              type="text"
                              className="form-control"
                              value={field.value || ""}
                              {...column.inputProps}
                            />
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 text-sm text-black dark:text-white">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteRow(rowIndex)}
                        >
                          <i className="fa fa-close btn btn-danger"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
                    <td className="px-4 py-2 text-sm text-black dark:text-white">
                      <button
                        type="button"
                        onClick={addRow}
                        className="btn btn-primary mr-2 mt-2"
                      >
                        + Add New
                      </button>
                      <button
                        type="submit"
                        style={{ display: "none" }}
                        className="btn btn-primary mt-2"
                        ref={ref}
                      >
                        Submit
                      </button>
                    </td>
                    {props.footer ? props.footer : ""}
                  </tr>
                </tfoot>
              </table>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
