'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from 'react-bootstrap';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const OrderDetail = () => {    
  const pathname = usePathname()
  const id = pathname.match(/\/Orders\/(\d+)/)?.[1];
  const router = useRouter();
  const { token, logout } = useAuth();

  const [order, setOrder] = useState<any>({
        id: '',
        order_total: '',
        order_status_id:'',
        payment_status_id:'',
      });


const [selectedStatus, setSelectedStatus] = useState(order.order_status_id);
interface OrderItem {
  id: string | number; // Adjust type as necessary
  product_image: string;  
  price_excl_tax: Number;
  quantity: string;
  discount_amount_excl_tax: Number;
  product_name:string;
}

const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

const handleOrderStatusChange = (event:any) => {
        setSelectedStatus(event.target.value);
        order.order_status_id = event.target.value;
      };

const [isLoading, setIsLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const handleOpenModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);

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


 const UpdateOrderStatus = async () => {
    try 
    {
      handleOpenModal();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/Update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:token ? `Bearer ${token}` : '', // Use your actual auth token
        },
        body: JSON.stringify(order),
      });  
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }  
      console.log('Order status updated successfully');
    } 
    catch (error)
    {
      console.error('Error updating order status:', error); 
    }
  };


  useEffect(() => {    
    const fetchOrder = async () => {      
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/GetById/${id}`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization:token ? `Bearer ${token}` : '', // Use your actual auth token
            },
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          console.log("Fetched order:", data);
          setOrder(data);
       } catch (error) {
          console.error("Failed to fetch order:", error);
        } finally {
          setIsLoading(false);
        }
      };


      const fetchOrderItems = async () => {      
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/OrderItem/GetOrderItems/${id}?vendorId=0`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization:token ? `Bearer ${token}` : '', // Use your actual auth token
            },
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          console.log("Fetched order iitems:", JSON.stringify(data));
           


          setOrderItems(
            Array.isArray(data)
              ? data.map((orderItems: OrderItem) => ({
                id: orderItems.id,
                product_image: orderItems.product_image,
                price_excl_tax:orderItems.price_excl_tax,
                quantity:orderItems.quantity,
                discount_amount_excl_tax:orderItems.discount_amount_excl_tax, 
                product_name:orderItems.product_name,
                }))
              : []
          );
          
          console.log("Fetched order iitems sss:", JSON.stringify(orderItems));
          
       } catch (error) {
          console.error("Failed to fetch order:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrder();
      fetchOrderItems();
      
  }, []);

  useEffect(() => {
    if (!token) 
    {
      router.push('/auth/signin');
    }
   }, [token]);
 
  if (isLoading) return 
  (
    <DefaultLayout>
       <div>Loading...</div>
    </DefaultLayout>
  );
  
    return(    
        <DefaultLayout>
          <div className="row">
                 <div className="col">
                 <strong className="font-medium text-black dark:text-white" style={{ fontSize: "xx-large" }}>Order Details</strong>
                      <Link href="/Orders" passHref>
                          <Button style={{ color: 'white', float: 'right' ,marginBottom: '15px' }}>Back</Button>
                      </Link>
                  </div>
            </div>
        {/* <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                  
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Order Details
              </h3>
            </div>
            <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                        <span className="text-xl text-blue-500 font-semibold">#</span>
                                 <label className="text-sm font-medium text-gray-800 dark:text-white">
                                    Order Number  : 
                                    <span className="text-lg font-semibold text-black dark:text-gray-100">
                                     {order?.id ? order.id : "No order found"}
                                 </span>
                                </label>
               </div>
               
               <div className="flex items-center gap-2">                        
                                 <label className="text-sm font-medium text-gray-800 dark:text-white">
                                    Order Total  : 
                                    <span className="text-lg font-semibold text-black dark:text-gray-100">
                                     {order?.order_total}
                                 </span>
                                </label>
               </div>   
 
               <div className="flex items-center gap-2">                        
                                 <label className="text-sm font-medium text-gray-800 dark:text-white">
                                    Order Status  : 
                                 <span className="text-lg font-semibold text-black dark:text-gray-100">
                                    {/* {order && order.order_status_id ? orderStatusMap[Number(order.order_status_id)] || "Unknown Status" : "Unknown Status"} */}
                                  {/* <select value={order.order_status_id} 
                                  
                                  onChange={handleOrderStatusChange}
                                  style=
                                  {{
                                         padding: "8px",
                                         fontSize: "16px",
                                         borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f9f9f9",
                                        color: "#333",
                                        cursor: "pointer",
                                    }}>
                                     
                                    <option value="10">Packing Pending</option>
                                    <option value="12">Invoicing Pending</option>
                                    <option value="15">Pickup Pending</option>
                                    <option value="20">In Transit</option>
                                    <option value="30">Completed</option>
                                    <option value="40">Cancelled</option>
                                  </select>
                                 </span>                               

                                </label>
                                <button     
                                 onClick={UpdateOrderStatus}              
                                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90"
                                >
                                    Change Status
                                </button>
                </div>  

               <div className="flex items-center gap-2">                        
                                 <label className="text-sm font-medium text-gray-800 dark:text-white">
                                    Payment Status  : 
                                    <span className="text-lg font-semibold text-black dark:text-gray-100">
                                    {order && order.payment_status_id ? paymentStatusMap[Number(order.payment_status_id)] || "Unknown Status" : "Unknown Status"
                                     }
                                 </span>
                                </label>
               </div>   
            </div>
            </div>
         </div> */} 
 <div className='row'>          
  <div className="col-md-12 mt-4">
    <div className="tab-pane active show" id="m_tab_general" role="tabpanel">
      <div className="row">
        <div className="col-lg-6 col-md-6">
          <div className="table-responsive">
            <table className="table table-sm m-table table-bordered">
              <tbody>
                <tr>
                  <th>Customer</th>
                  <td>
                    {order.shipping_first_name}   {order.shipping_last_name}
                  </td>
                </tr>
                <tr>
                  <th>Place of Supply</th>
                  <td>{order?.shipping_city}</td>
                </tr>
                <tr>
                  <th>Billing Address</th>
                  <td>
                    {order.billing_first_name}   {order.billing_last_name}<br />
                    <br />
                    {order.billing_address1}, {order.billing_zip_postal_code}, {order.billing_city} <br />
                    <span className="">GSTIN - 
                      <span className="" data-address-gstin="">
                        N/A
                      </span>
                    </span><br />
                    <span className="">
                      <i className="la la-phone align-middle"></i>
                      <span className="" data-address-phoneno="">
                        +91-{order.billing_phone_number}
                      </span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Shipping Address</th>
                  <td>
                   {order.shipping_first_name}   {order.shipping_last_name} <br />
                    <br />
                    {order.shipping_address1}, {order.shipping_zip_postal_code}, {order.shipping_city}<br />
                    <span className="">GSTIN - 
                      <span className="" data-address-gstin="">
                        N/A
                      </span><br />
                    </span>
                    <span className="">
                      <i className="la la-phone align-middle"></i>
                      <span className="" data-address-phoneno="">
                       +91-{order.shipping_phone_number}
                      </span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <div className="table-responsive">
            <table className="table table-sm m-table table-bordered">
              <tbody>
                <tr>
                  <th>Order Date</th>
                  <td> {new Date(order.created_on_utc).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}</td>
                </tr>
                <tr>
                  <th>Order No.</th>
                  <td>{order.custom_order_number}</td>
                </tr>
                <tr>
                  <th>Reverse Charge</th>
                  <td>No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table-responsive">
            <table className="table table-sm m-table table-bordered">
              <tbody>
                <tr>
                  <th>Payment status</th>
                  <th id="paymentStatus">
                    {order && order.payment_status_id ? paymentStatusMap[Number(order.payment_status_id)] || "Unknown Status" : "Unknown Status"
                                     }</th>
                </tr>                
                <tr>
                  <th className="text-primary">Total Amount</th>
                  <th className="text-primary">{order.order_total}</th>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table-responsive">
            <div className="table table-sm m-table table-bordered">              
                    <strong>Order Status </strong>                   
                                <select value={order.order_status_id}                                   
                                       onChange={handleOrderStatusChange}
                                                 style=
                                                        {{
                                                           padding: "8px",
                                                           fontSize: "16px",
                                                           borderRadius: "4px",
                                                           border: "1px solid #ccc",
                                                           backgroundColor: "#f9f9f9",
                                                           color: "#333",
                                                           cursor: "pointer",
                                                         }}>                                     
                                         <option value="10">Packing Pending</option>
                                         <option value="12">Invoicing Pending</option>
                                         <option value="15">Pickup Pending</option>
                                         <option value="20">In Transit</option>
                                         <option value="30">Completed</option>
                                         <option value="40">Cancelled</option>
                                </select>
            <p></p>
                    {/* <button
                            style={{
                                      margin: "margin: 9px 38px 8px 36px;background-color: blue;text-align: center;color: white;",
                                  }}
                                   onClick={UpdateOrderStatus}
                                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90"
                    >
                    Change Status
                    </button> */}
                    <button
                             style={{
                                        margin: "9px 38px 8px 36px",
                                        backgroundColor: "#007BFF", // Brighter blue
                                        color: "white",
                                        textAlign: "center",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "10px 20px",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                        transition: "background-color 0.3s ease, transform 0.2s ease",   
                                  }}
                            onClick={UpdateOrderStatus}
                    >
                    Change Status
                    </button>
          </div>           
        </div>

        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <div className="table-responsive">
            <table className="table table-sm m-table table-bordered">
              <tbody>
                <tr>
                  <th>Payment Term</th>
                  <td>{order.payment_method_system_name == 'NopStation.Plugin.Payments.Razorpay' ? 'Razorpay' : 'Cash on Delivery'}</td>
                </tr>
                <tr>
                  <th>Due Date</th>
                  <td>{new Date(order.created_on_utc).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}</td>
                </tr>
                <tr>
                  <th>Export/SEZ</th>
                  <td>No</td>
                </tr>
                <tr>
                  <th>Payment Reminder</th>
                  <td>No</td>
                </tr>
                <tr>
                  <th>Account Ledger</th>
                  <td></td>
                </tr>
                <tr>
                  <th>Created By</th>
                  <td> {order.shipping_first_name}   {order.shipping_last_name}</td>
                </tr>
                <tr>
                  <th>Created Time</th>
                  <td> {new Date(order.created_on_utc).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>   
    </div> 
 </div>

 <div className=''>
  <table className='table table-bordered table-striped table-hover'>
    <thead className='table-dark'>
      <tr>
        <th>Picture</th>
        <th>Product Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Discount</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
        {orderItems.length > 0 ? (
          orderItems.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.product_image || '/default-image.jpg'}
                  alt={`Product ${item.product_name}`}
                  style={{ width: '100px', height: '100px' }}
                />
              </td>
              <td>{item.product_name || 'Unknown'}</td>
              <td>₹ {item.price_excl_tax.toFixed(2)} excl tax </td>
              <td>{item.quantity}</td>
              <td>₹ {item.discount_amount_excl_tax.toFixed(2)} excl tax</td>
              <td>₹ {item.price_excl_tax.toFixed(2)} excl tax</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} style={{ textAlign: 'center' }}>
              No items available
            </td>
          </tr>
        )}
      </tbody>
  </table>
 </div>
                                     
       
        <Modal show={showModal} onHide={handleCloseModal}>
                     <Modal.Header closeButton>
                                     {/* <Modal.Title>Alert in Modal</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                                  Order Status Updated Successfully !
                    </Modal.Body>
                    <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                      Close
                                    </Button>      
                    </Modal.Footer>
      </Modal>


        </DefaultLayout>
        );        
};
export default OrderDetail; 