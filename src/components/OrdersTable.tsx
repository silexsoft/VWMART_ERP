'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface order {
    id: string;
    order_status_id: string;
    payment_status_id: string;
    order_total: string;
    created_on_utc: string;
    customer_email: string
  }

  const orderStatusMap: Record<number, string> = {
    10: "Packing Pending",
    12: "Invoicing Pending",
    15: "Pickup Pending",
    20: "In Transit",
    30: "Completed",
    40: "Cancelled"
  };
  
  const paymentStatusMap: Record<number, string> = {
    10: "Pending",
    20: "Authorized",
    30: "Paid",
    35: "PartiallyRefunded",
    40: "Refunded",
    50: "Voided"
  };

interface OrdersTableProps {
    orders: order[];
    currentPage:number;
    totalOrders:number;
  }
  const getStatusColor = (statusId: number | undefined) => {
    switch (statusId) {
      case 10:
      case 12:
      case 15:
        return "bg-yellow-500"; // Yellow
      case 20:
        return "bg-blue-500"; // Blue
      case 30:
        return "bg-green-500"; // Green
      case 40:
        return "bg-red-500"; // Red
      default:
        return "bg-gray-500"; // Default Gray for unknown statuses
    }
  };
  
  
const OrdersTable: React.FC<OrdersTableProps> = ({ orders ,totalOrders ,currentPage  }) => {
    const router = useRouter();
    
            

    if (!orders) {
      return <div>Loading...</div>; // Change "wait" to a more descriptive message
    }
  
    return (
      // <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      //   <div className="px-4 py-6 md:px-6 xl:px-7.5">
      //     <h4 className="text-xl font-semibold text-black dark:text-white">
      //       All Orders
      //     </h4>
      //   </div>
  
      //   <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
      //     <span className="col-span-1 flex items-center">
      //       #
      //     </span>
      //     <div className="col-span-1 flex items-center">
      //       <p className="font-medium">Invoice No.</p>
      //     </div>
      //     <div className="col-span-1 flex items-center">
      //       <p className="font-medium">Invoice Date</p>
      //     </div>
      //     <div className="col-span-2  items-center sm:flex">
      //       <p className="font-medium">Customer Email</p>
      //     </div>
      //     <div className="col-span-1  items-center sm:flex">
      //       <p className="font-medium">Order status</p>
      //     </div>
      //     <div className="col-span-1 flex items-center">
      //       <p className="font-medium">Payment status</p>
      //     </div>
          
      //     <div className="col-span-1 flex items-center">
      //       <p className="font-medium">Order total</p>
      //     </div>
      //     {/* <div className="col-span-1 flex items-center">
      //       <p className="font-medium">Action</p>
      //     </div> */}
      //   </div>
  
      //   {orders.map((order, key) => (
      //     <div
      //       className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
      //       key={key}
      //     >
      //       <div className="col-span-1 flex items-center">
      //         <p className="text-sm text-black dark:text-white">
      //           {key + 1}
      //         </p>
      //       </div>

      //       <div className="col-span-1 flex items-center">
      //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      //           <p className="text-sm text-meta-3">
      //         <button 
      //                onClick={() => router.push(`/Orders/${order.id}`)} 
      //               className="text-blue-500 hover:underline"
      //             >
      //               {order.id}
      //             </button>
      //         </p>                  
      //         </div>
      //       </div>

      //       <div className="col-span-1 flex items-center">
      //         <p className="text-sm text-black dark:text-white">
      //               {new Date(order.created_on_utc).toLocaleString("en-US", {
      //                       year: "numeric",
      //                       month: "2-digit",
      //                       day: "2-digit",
      //                       hour: "2-digit",
      //                       minute: "2-digit",
      //                       second: "2-digit",
      //               })}              
      //         </p>
      //       </div>

      //       <div className="col-span-2  items-center sm:flex">
      //         <p className="text-sm text-black dark:text-white">
      //             {order.customer_email}
      //         </p>
      //       </div>


      //       <div className="col-span-1  items-center sm:flex">
      //       <p
      //           className={`text-sm text-white px-2 py-1 rounded ${getStatusColor(
      //           Number(order.order_status_id)
      //           )}`}
      //     >
      //         {order && order.order_status_id ? orderStatusMap[Number(order.order_status_id)] || "Unknown Status" : "Unknown Status"}
      //       </p>
      //       </div>

      //       <div className="col-span-1 flex items-center">
      //         <p className="text-sm text-black dark:text-white">
      //           {order && order.payment_status_id ? paymentStatusMap[Number(order.payment_status_id)] || "Unknown Status" : "Unknown Status"}
      //         </p>
      //       </div>
            
      //       <div className="col-span-1 flex items-center">
      //         <p className="text-sm text-black dark:text-white">
      //         {Number(order.order_total).toFixed(2)}             
      //         </p>
      //       </div>
            
      //     </div>
      //   ))}
      // </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="px-4 py-6 md:px-6 xl:px-7.5">
    <h4 className="text-xl font-semibold text-black dark:text-white">
      All Orders
    </h4>
    <h4  className="text-xl font-semibold text-black" style={{ marginTop: "-21px",float: "right" }}>
            Total : {totalOrders}
        </h4>
  </div>

  <div className="px-4 py-4.5 md:px-6 2xl:px-7.5">
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-t border-stroke dark:border-strokedark">
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            #
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Order No.
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Invoice Date
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Customer Email
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Order Status
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Payment Status
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Order Total
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, key) => (
          <tr
            key={key}
            className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td className="px-4 py-2 text-sm text-black dark:text-white">
            {(Number(currentPage)) * 25 + key + 1}
            </td>
            <td className="px-4 py-2 text-sm text-meta-3">
              <button
                onClick={() => router.push(`/Orders/${order.id}`)}
                className="text-blue-500 hover:underline"
              >
                {order.id}
              </button>
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white">
              {new Date(order.created_on_utc).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white">
              {order.customer_email}
            </td>
            <td className="px-4 py-2 text-center align-middle">
              <p
                className={`text-sm text-white px-2 py-1 rounded ${getStatusColor(
                  Number(order.order_status_id)
                )}`}
              >
                {order.order_status_id
                  ? orderStatusMap[Number(order.order_status_id)] ||
                    "Unknown Status"
                  : "Unknown Status"}
              </p>
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white">
              {order.payment_status_id
                ? paymentStatusMap[Number(order.payment_status_id)] ||
                  "Unknown Status"
                : "Unknown Status"}
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white">
            ₹ {Number(order.order_total).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    );
  
  };
  

  export default OrdersTable;