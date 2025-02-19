"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { output } from "framer-motion/m";

export default function TableDynamic({
  columns,
  rows,
  onSubmit,
  schema,
  ...props
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: yupResolver(schema), // Use the passed schema for validation
    defaultValues: {
      names: rows || [{ name: "", account: "", role: "" }],
    },
  });

  const [rest, setReset] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "names",
  });

  useEffect(() => {
    setReset(!reset);
    reset({
      names: rows || [{ name: "", account: "", role: "" }],
    });
  }, [schema, rows, reset]);

  const addRow = () => {
    append({ name: "", account: "", role: "" });
  };

  const deleteRow = (index) => {
    remove(index);
  };

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
              </table>

              <button
                type="button"
                onClick={addRow}
                className="btn btn-primary mr-2 mt-2"
              >
                + Add New
              </button>
              <button type="submit" className="btn btn-primary mt-2">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
