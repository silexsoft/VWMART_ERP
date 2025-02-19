'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface customer {
    id: string;
    email: string;
    username: string;
    active: boolean;
    phone: string;
  }
 

interface CustomersTableProps {
    customers: customer[];
    currentPage:number;
    totalOrders:number;
  }
   
  
const CustomersTable: React.FC<CustomersTableProps> = ({ customers ,totalOrders ,currentPage  }) => {
    const router = useRouter();
    
    if (!customers) {
      return <div>Loading...</div>; // Change "wait" to a more descriptive message
    }
  
    return (     
 <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="px-4 py-6 md:px-6 xl:px-7.5">
    <h4 className="text-xl font-semibold text-black dark:text-white">
      All Customers
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
            Customer Id
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Email
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            User Name
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Phone
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Active
          </th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer, key) => (
          <tr
            key={key}
            className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td className="px-4 py-2 text-sm text-black dark:text-white">
            {(Number(currentPage)) * 25 + key + 1}
            </td>
            <td className="px-4 py-2 text-sm text-meta-3">
              <button
                onClick={() => router.push(`/customers/${customer.id}`)}
                className="text-blue-500 hover:underline"
              >
                {customer.id}
              </button>
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white">
             {customer.email ?? "Guest"}
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white">
             {customer.username ?? "Guest"}
            </td>            
            <td className="px-4 py-2 text-sm text-black dark:text-white">
             {customer.phone ?? "Guest"}
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white">
             {customer.active == true? "True":"False"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    );
  };
  export default CustomersTable;