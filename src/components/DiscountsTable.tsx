'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface discount {
    id: string;
    name:string;
    discount_type_id: string;
    discount_percentage: string;
    start_date_utc: string;
    end_date_utc: string;   
    is_active: boolean;
  }
                                            
  const DiscounTypeoMap: Record<number, string> = {
    1: "Assigned to order total",
    2: "Assigned to products",
    5: "Assigned to categories",
    6: "Assigned to manufacturers",
    10: "Assigned to shipping",
    20: "Assigned to order subtotal"
  };
  
interface discountPageProps {
    discounts: discount[];
  }

const DiscountsTable: React.FC<discountPageProps> = ({ discounts }) => {
    const router = useRouter();
  
    console.log(discounts);
    
    if (!discounts) {
      return <div>Loading...</div>; // Change "wait" to a more descriptive message
    }
  
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            All Discounts
          </h4>
        </div>
  
        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Name</p>
          </div>
          <div className="col-span-1 items-center">
            <p className="font-medium">Discount Type</p>
          </div>
          {/* <div className="col-span-1 flex items-center">
            <p className="font-medium">Discount</p>
          </div> */}
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Start Date</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">End Date</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Active</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Action</p>
          </div>
        </div>
  
        {discounts.map((discount, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-1 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">                
                <p className="text-sm text-black dark:text-white">
                  {discount.name}
                </p>
              </div>
            </div>
            <div className="col-span-1 items-center">
              <p className="text-sm text-black dark:text-white"> 
                {discount && discount.discount_type_id ? DiscounTypeoMap[Number(discount.discount_type_id)] || "Unknown Type" : "Unknown Type"}                 
             </p>
            </div>
            {/* <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {discount.discount_percentage} %
              </p>
            </div> */}
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">                  
               {new Date(discount.start_date_utc).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                    })}         
              </p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {new Date(discount.end_date_utc).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                    })}                     
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
              {discount.is_active == true ? "Yes":"No"}                   
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">
              <button 
                     onClick={() => router.push(`/Discounts/${discount.id}`)} 
                    className="text-blue-500 hover:underline"
                  >
                    Edit
              </button>
              </p>
            </div>
          </div>
        ))}
      </div>
    );  
  };
  

  export default DiscountsTable;