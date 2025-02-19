import "../../css/custom.css";
import { TableGenericProps } from "@/types/tables";
export default function TableGeneric({ ...props }: TableGenericProps) {
  return (
    <div
      className={`rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${props.customClasses ? props.customClasses : ""}`}
    >
      <div className="allproduct_table">
        <div className="products-tablepage">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-t border-stroke dark:border-strokedark">
                {props.columns.map((column: any, index: number) => (
                  <th
                    key={index}
                    className={`${column.classNames ? column.classNames : "px-4 py-2 text-left text-sm font-medium text-black dark:text-white"}`}
                    style={{
                      width: column.width,
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* in case there is no data  */}

              {props.data.length == 0 && (
                <tr>
                  <td colSpan={props.columns.length} className="text-center">
                    {props.noDataMsg ? props.noDataMsg : "No Data Found"}
                  </td>
                </tr>
              )}

              {props.data.map((row: any, indexis: number) => (
                <tr
                  key={indexis}
                  className="border-t border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                >
                  {props.columns.map((column: any, index: any) => {
                    if (column.type == "serial") {
                      return (
                        <td
                          key={column.field}
                          className="px-4 py-2 text-sm text-black dark:text-white"
                          style={{ width: column.width }}
                        >
                          {/* {index + 1} */}

                          {Number(props.currentPage) * Number(props.pagesize) +
                            indexis +
                            1}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={column.field}
                        className="px-4 py-2 text-sm text-black dark:text-white"
                        style={{ width: column.width }}
                      >
                        {column.renderCell
                          ? column.renderCell(row[column.field], row)
                          : row[column.field]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            {props.footer ? props.footer : ""}
          </table>
        </div>
      </div>
    </div>
  );
}
