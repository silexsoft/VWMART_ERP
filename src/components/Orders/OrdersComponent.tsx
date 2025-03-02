"use client";
import React, { useState, useEffect } from "react";
import { getAllOrdersFromApi } from "@/utils/posService";
import { useAuth } from "@/app/context/AuthContext";
import {getStatusColor,orderStatusMap,paymentStatusMap} from "@/utils/commonConstant";
import { useRouter } from 'next/navigation';
import { bool } from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderReceipt from "../OrderPrint/OrderReceipt";
interface OrdersComponentProps { 
  handle_ReOrder: (order: any) => void;
}

const OrdersComponent: React.FC<OrdersComponentProps> = ({ handle_ReOrder }) => {
    const { token, logout, warehouseId } = useAuth();
    const [orders, setOrders] = useState<{id:number,order_total:number,customer_email:string,payment_status_id:string,order_status_id:number,created_on_utc:string}[]>([]);
    const [currentPage, setCurrentPage] = useState(0); // Tracks the current page index
    const [totalPages, setTotalPages] = useState(0);   // Tracks the total number of pages
    const [orderSeries, setorderSeries] = useState(0);
    const [totalOrder, settotalOrder] = useState(0);
    const [printOrderFor, setPrintOrderFor] = useState([]);
    const [isOrderReceiptModel, setIsOrderReceiptModel] = useState(false);
    const [loading, setLoading] = useState(false);
    const pageSize = 25;   
     const router = useRouter();                      

const getAllOrders= async (pageIndex: number)=>{
    try {
        setLoading(true);
        setorderSeries(pageIndex);
      const data = await getAllOrdersFromApi(token,pageIndex,pageSize);  
      settotalOrder(data.total_count);              
                  setOrders(
                      Array.isArray(data.items)
                          ? data.items.map((order: any) => ({
                              id: order.id,
                              order_status_id: order.order_status_id,
                              payment_status_id: order.payment_status_id,
                              order_total: order.order_total,
                              created_on_utc: order.created_on_utc,
                              customer_email: order.customer_email,
                              customer_id: order.customer_id,
                              billing_first_name: order.billing_first_name,
                              billing_last_name: order.billing_last_name,
                              billing_email: order.billing_email,
                              billing_city: order.billing_city,
                              billing_address1: order.billing_address1,
                              billing_address2: order.billing_address2,
                              billing_zip_postal_code: order.billing_zip_postal_code,
                              billing_phone_number: order.billing_phone_number,
                              shipping_first_name: order.shipping_first_name,
                              shipping_last_name: order.shipping_last_name,
                              shipping_email: order.shipping_email,
                              shipping_city: order.shipping_city,
                              shipping_address1: order.shipping_address1,
                              shipping_address2: order.shipping_address2,
                              shipping_zip_postal_code: order.shipping_zip_postal_code,
                              shipping_phone_number: order.shipping_phone_number
      
                          }))
                          : []
                  );
      setTotalPages(Math.ceil(data.total_count / pageSize));
    } catch (error) {
      toast.error("Opps! Unable to get orders.", {
          position: "top-right",
          autoClose: 5000
      });
    }
    finally {
      setLoading(false); // Hide loading indicator
    }
      }
      const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    useEffect(() => {
        getAllOrders(currentPage); // Fetch orders when the page index changes
    }, [token, currentPage]);


    const print_Order=(order:any)=>{
      setPrintOrderFor(order);
      console.log(order);
      setIsOrderReceiptModel(true)
    }

    const handleOrderReceiptModel=()=>{
      setIsOrderReceiptModel(false);
  }

    return (
        <div className="flex flex-col gap-10">
                <div className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
 

  <div style={{height: window.innerHeight -200 + 'px',overflow:'scroll'}} className="p-1 md:px-6 2xl:px-7.5">
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
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
      {loading && <tr> <td colSpan={8}><div className="spinner text-center"></div></td> </tr> }
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
            <td className="px-4 py-2 text-sm text-black dark:text-white">
                 <button onClick={()=> handle_ReOrder(order)}><i className="fa fa-edit"></i></button> &nbsp;&nbsp;
                 
                 <button onClick={()=> print_Order(order)}><i className="fa fa-print"></i></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
<OrderReceipt show={isOrderReceiptModel} handleClose={handleOrderReceiptModel} orderDetail={printOrderFor}></OrderReceipt>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
                
            </div>
    );
};

// Pagination Component
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {
    return (
        <div className="flex justify-center mt-1">
            <button
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                Previous
            </button>
            <span className="px-2 py-2 mx-1">{currentPage + 1} /  {totalPages}</span>
            <button
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                Next
            </button>
        </div>
    );
};
export default OrdersComponent;