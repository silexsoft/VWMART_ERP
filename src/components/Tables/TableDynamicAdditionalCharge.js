"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function TableDynamicAdditionalCharge({
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
          amount: "",
          discount: "",
          tax: "",
          tax_value: "",
        },
      ],
    },
  });

  const [rest, setReset] = useState(false);

  const fillfields = () => {};

  // const { watch } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "names",
  });

  // useEffect(() => {
  //   setReset(!reset);
  //   reset({
  //     names: rows || [
  //       {
  //         name: "",
  //         account: "",
  //         role: "",
  //         amount: "",
  //         discount: "",
  //         tax: "",
  //         tax_value: "",
  //       },
  //     ],
  //   });
  // }, [schema, rows, reset]);

  // Function to add a new row
  const addRow = () => {
    append({
      name: "",
      account: "",
      role: "",
      amount: "",
      discount: "",
      tax: "",
      tax_value: "",
    });
  };

  const deleteRow = (index) => {
    remove(index);
  };

  const names = watchFields({ name: "names" }); // Get current values of the dynamic fields

  useEffect(() => {
    if (!names || !names.names) return; // Prevent unnecessary execution

    let outputTotal = 0;
    let grossAmount = 0;
    let discounts = 0;
    let taxableAmount = 0;
    let taxAmount = 0;
    names.names.forEach((row, index) => {
      const { amount, discount, tax, total } = row;

      if (amount && discount && tax) {
        const calculatedTaxValue =
          ((Number(amount) - Number(discount)) * Number(tax)) / 100;
        const newTotal = Number(amount) + calculatedTaxValue;
        taxAmount = calculatedTaxValue;
        outputTotal += newTotal; // Add to total
        grossAmount += Number(amount);
        discounts += Number(discount);
        taxableAmount += Number(tax);
        // Prevent unnecessary updates
        if (row.tax_value !== calculatedTaxValue) {
          setFormValue(`names[${index}].tax_value`, calculatedTaxValue);
        }
        if (row.total !== newTotal) {
          setFormValue(`names[${index}].total`, newTotal);
        }
      }
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
  }, [JSON.stringify(names)]); // Prevent infinite re-renders by watching a stable JSON string

  // useEffect(() => {
  //   if (names && names.names) {
  //     const namesAry = names.names;

  //     let outputTotal = 0;
  //     namesAry.forEach((row, index) => {
  //       outputTotal = outputTotal + Number(row.total);

  //       const { amount, discount, tax } = row;
  //       if (amount && discount && tax) {
  //         //const calculatedTaxValue = ((amount - discount) * tax) / 100;

  //         const calculatedTaxValue =
  //           ((Number(amount) - Number(discount)) * Number(tax)) / 100;

  //         // setValue("tax_value",123)
  //         setFormValue(`names[${index}].tax_value`, calculatedTaxValue); // Update tax_value
  //         setFormValue(
  //           `names[${index}].total`,
  //           Number(amount) + Number(calculatedTaxValue),
  //         );
  //       }
  //     });
  //     if (getTotal) {
  //       getTotal(outputTotal);
  //     }
  //   }
  // }, [names]);

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
