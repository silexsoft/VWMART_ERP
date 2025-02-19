"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function TableDynamicExpenseEdit({
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
    resolver: yupResolver(schema),
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
          Id: "",
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
  useEffect(() => {
    console.log("fields err", errors);
  }, [errors]);
  const addRow = () => {
    append({
      name: "",
      account: "",
      role: "",
      amount: "",
      discount: "",
      tax: "",
      tax_value: "",
      total: "",
      Id: "",
    });
  };

  // useEffect(() => {
  //   if (rows && rows.length > 0) {
  //     reset({ names: rows });
  //   }
  // }, [rows, reset]);

  const deleteRow = (index) => {
    remove(index);
  };
  console.log("rows", rows);
  const names = watchFields({ name: "names" }); // Get current values of the dynamic fields
  // const names = watch("names");

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
                                    //  value={field.value || ""}
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
