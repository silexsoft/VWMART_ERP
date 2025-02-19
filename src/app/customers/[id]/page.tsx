'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from 'react-bootstrap';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import OrdersTable from "@/components/OrdersTable";
import Link from "next/link";
const CustomerDetail = () => {    
  const pathname = usePathname()
  const id = pathname.match(/\/customers\/(\d+)/)?.[1];
  const router = useRouter();
  const { token, logout } = useAuth();

  const [customer, setCustomer] = useState<any>({
        id: '',
        first_name: '',
        last_name:'',
        email:'',
        phone: '',
        username:'',
        company:''
      });

const [orders, setOrders] = useState([]);
const [currentPage, setCurrentPage] = useState(0); // Tracks the current page index
const [totalPages, setTotalPages] = useState(0);   // Tracks the total number of pages

const [isLoading, setIsLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const handleOpenModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);
const pageSize=25;
const [totalOrder, settotalOrder] = useState(0);  
const [orderSeries, setorderSeries] = useState(0);
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
        body: JSON.stringify(customer),
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer((prev: any) => ({
      ...prev,  // Spread the previous state
      [name]: value   // Update the specific field
    }));
  };

  useEffect(() => {        
    const fetchCustomer = async () => {      
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Customer/GetById/${id}`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization:token ? `Bearer ${token}` : '',
            },
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          console.log("Fetched customer details:", data);
          setCustomer(data);
       } catch (error) {
          console.error("Failed to customer details:", error);
        } finally {
          setIsLoading(false);
        }
      };     
       fetchCustomer();
  }, []);
  const fetchOrders = async (pageIndex: number) => {
    try {
      setorderSeries(pageIndex);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/Search?storeId=0&vendorId=0&customerId=${id}
        &productId=0&affiliateId=0&warehouseId=0&billingCountryId=0&pageIndex=${pageIndex}&pageSize=${pageSize}
        &getOnlyTotalCount=false`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      //console.log('Fetched orders:', data);
      settotalOrder(data.total_count);
      // Update state with orders and total pages
      setOrders(
        Array.isArray(data.items)
          ? data.items.map((order: any) => ({
              id: order.id,
              order_status_id: order.order_status_id,
              payment_status_id: order.payment_status_id,
              order_total: order.order_total,
              created_on_utc: order.created_on_utc,
              customer_email: order.customer_email,
           
              billing_first_name:order.billing_first_name,
              billing_last_name:order.billing_last_name,
              billing_email:order.billing_email,
              billing_city:order.billing_city,
              billing_address1:order.billing_address1,
              billing_address2:order.billing_address2,
              billing_zip_postal_code:order.billing_zip_postal_code,
              billing_phone_number:order.billing_phone_number,
              shipping_first_name:order.shipping_first_name,
              shipping_last_name:order.shipping_last_name,
              shipping_email:order.shipping_email,
              shipping_city:order.shipping_city,
              shipping_address1:order.shipping_address1,
              shipping_address2:order.shipping_address2,
              shipping_zip_postal_code:order.shipping_zip_postal_code,
              shipping_phone_number:order.shipping_phone_number              
            }))
          : []
      );
      setTotalPages(Math.ceil(data.total_count / pageSize)); // Calculate total pages
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  useEffect(() => {
    if (!token) 
    {
      router.push('/auth/signin');
    }
fetchOrders(currentPage); // Fetch orders when the page index changes
}, [token,currentPage]);

 
   const  handleUpdate = async () => {
    try 
    {      
      const response = await updateCustomer(customer);
    } 
    catch (error) 
    {
      console.error('Error updating customer:', error);
    }
  }
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const updateCustomer = async (productData: any) => {
    try {     
      handleOpenModal();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Customer/Update`, {
        method: 'PUT',
        headers: {        
          'Content-Type': 'application/json',   
          accept: 'application/json',
          Authorization:token ? `Bearer ${token}` : '',
          
        },        
        body: JSON.stringify(productData),
      });    
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
     console.log("updated data"+data);
      return data; 
    } 
    catch (error) 
    { }
    finally {
      
    }  
  };
  if (isLoading) return 
  (
    <DefaultLayout>
       <div>Loading...</div>
    </DefaultLayout>
  );
  
    return(    
        <DefaultLayout>
             <div className="row" style={{marginBottom:"30px"}}>
                 <div className="col">
                 <strong className="font-medium text-black dark:text-white" style={{ fontSize: "xx-large" }}>Customer Details</strong>
                      <Link href="/customers" passHref>
                          <Button style={{ color: 'white', float: 'right' }}>Back</Button>
                      </Link>
                  </div>
            </div>
            <div className='row'>
                 <div className="col-md-6">
                         <strong>First Name</strong>      
                         <input
                                  type="text"
                                  name="first_name" 
                                  value={customer?.first_name}
                                  onChange={handleInputChange}
                                  placeholder="First Name"
                                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                           />
                 </div>
                <div className="col-md-6">
                         <strong>Last Name</strong>
                         <input
                                    type="text"
                                    name="last_name" 
                                    value={customer?.last_name}
                                     onChange={handleInputChange}
                                    placeholder="Last Name"
                                     className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                />
                </div>
            </div>
            <div className='row'>
                <div className="col-md-6">
                              <strong>Email</strong>
                              <input
                                       type="text"
                                        name="email" 
                                        value={customer?.email}
                                         onChange={handleInputChange}
                                        placeholder="Email"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                 </div>
                <div className="col-md-6">
                                 <strong>Phone</strong>
                                 <input
                                         type="text"
                                         name="phone" 
                                         value={customer?.phone}
                                        onChange={handleInputChange}
                                         placeholder="Phone"
                                         className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                       />
                 </div>
            </div>

            <div className='row'>
                <div className="col-md-6">
                              <strong>User Name</strong>
                              <input
                                       type="text"
                                        name="username" 
                                        value={customer?.username}
                                         onChange={handleInputChange}
                                        placeholder="Username"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                 </div>
                <div className="col-md-6">
                                 <strong>Company</strong>
                                 <input
                                         type="text"
                                         name="company" 
                                         value={customer?.company}
                                        onChange={handleInputChange}
                                         placeholder="Company"
                                         className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                       />
                 </div>
            </div>

            <div id='productUpdateBtn'>
            <button
                   onClick={handleUpdate}
                   className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              Update 
            </button>
      </div>

     {totalOrder > 0 ? (       
        <div className="flex flex-col gap-10">
        <OrdersTable orders={orders} totalOrders={totalOrder} currentPage={orderSeries} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>) : null}
                
        <Modal show={showModal} onHide={handleCloseModal}>
                     <Modal.Header closeButton>                                     
                    </Modal.Header>
                    <Modal.Body>
                                  Customer  Details Updated Successfully !
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
      <div className="flex justify-center mt-4">
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
  
export default CustomerDetail; 