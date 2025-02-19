'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { start } from 'repl';
import { Modal, Button, Alert } from 'react-bootstrap';

import { useAuth } from '@/app/context/AuthContext';   
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
const DiscountDetail = () => {
  
  const router = useRouter();
  const { token, logout } = useAuth();
  
const pathname = usePathname()
const id = pathname.match(/\/Discounts\/(\d+)/)?.[1];

  
const [isLoading, setIsLoading] = useState(true);
const [startDate, setStartDate] = React.useState<Date | null>(null);
const [endDate, setEndDate] = React.useState<Date | null>(null);


const [showModal, setShowModal] = useState(false);
const handleOpenModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);



const [discount, setDiscount] = useState<any>({
    id: '',
    name: '',
    discount_type_id: '',
    discount_percentage: '',
    start_date_utc: '',
    end_date_utc:'',
    created_on_utc:'',
    is_active:false
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDiscount((prevdiscount: any) => ({
      ...prevdiscount,  // Spread the previous state
      [name]: value   // Update the specific field
    }));
  };  
    
 
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDiscount((prevdiscount: any
    ) => ({
      ...prevdiscount,
      [name]: checked,
    }));
  };

  const  handleUpdate = async () => {
    try {
    const response = await updateDiscount(discount);
  } 
  catch (error) {
    console.error('Error updating product:', error);
  }
}

  useEffect(() => {
    if (discount?.start_date_utc) {
      // Ensure the start_date_utc is in a valid Date format
      const startDate = new Date(discount.start_date_utc);
      if (!isNaN(startDate.getTime())) { // Check if the date is valid
        setStartDate(startDate);
      }
    }

    if (discount?.end_date_utc) {
        // Ensure the start_date_utc is in a valid Date format
        const endDate = new Date(discount.end_date_utc);
        if (!isNaN(endDate.getTime())) { // Check if the date is valid
          setEndDate(endDate);
        }
      }
  }, [discount]);

  function formatDate(date:any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  const handleEndDateChange = (date: Date | null) => {
    // Check if date is a valid Date object
    if (date instanceof Date) {
      setEndDate(date); // Update local endDate state
  
      if (setDiscount) {
        // If setDiscount is available, update parent state with the new UTC date
        setDiscount((prevDiscount:any) => ({
          ...prevDiscount,
          end_date_utc: formatDate(date),
        }));
      } else {
        // If setDiscount is not available, make sure discount is not mutated directly
        // instead of mutating the discount object directly.
        // Perhaps update local state instead if discount is a local state.
        console.warn('setDiscount not available, please use a controlled component.');
      }
    } else {
      setEndDate(null);
    }
  };
  


  const handleStartDateChange = (date: Date | null) => {
    // Check if date is a valid Date object
    if (date instanceof Date) {
      setStartDate(date); // Update local endDate state
  
      if (setDiscount) {
        // If setDiscount is available, update parent state with the new UTC date
        setDiscount((prevDiscount:any) => ({
          ...prevDiscount,
          start_date_utc: formatDate(date),
        }));
      } else {
        // If setDiscount is not available, make sure discount is not mutated directly
        // instead of mutating the discount object directly.
        // Perhaps update local state instead if discount is a local state.
        console.warn('setDiscount not available, please use a controlled component.');
      }
    } else {
      setEndDate(null);
    }
  };
  const updateDiscount = async (discountData: any) => {
    try { 
      handleOpenModal();
       // console.log("update this:", JSON.stringify(discountData));
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Discount/Update`, {
        method: 'PUT',
        headers: {        
          'Content-Type': 'application/json',   
          accept: 'application/json',
          Authorization:token ? `Bearer ${token}` : '',
          
        },        
        body: JSON.stringify(discountData),
      });    
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
       // console.log("Fetched product:", data);
      return data; // Return the response data as needed
    } catch (error) {    
    }  
  };

  useEffect(() => {
    if (!token) {
      router.push('/auth/signin');
    }
  }, [token, router]);

   useEffect(() => {    
    const fetchDiscount = async () => {      
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Discount/GetById/${id}`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: token ? `Bearer ${token}` : '', // Use your actual auth token
            },
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          console.log("Fetched Discount:", data);
          setDiscount(data);
       } catch (error) {
          console.error("Failed to fetch Discount:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDiscount();
  }, [token]);



  if (isLoading) return (
    <DefaultLayout>
       <div>Loading...</div></DefaultLayout>);
    return(    
        <DefaultLayout>

{token ? (
        <>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">

  
<div className="flex flex-col gap-9">
  {/* <!-- Input Fields --> */}
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">
        Discount Details
      </h3>
    </div>
    <div className="flex flex-col gap-5.5 p-6.5">
      <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Name
        </label>
        <input
          value={discount?.name}
          name="name" 
          type="text"       
          onChange={handleInputChange}   
          placeholder="Product Name"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 
          text-black outline-none transition focus:border-primary active:border-primary  
           dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
         Discount percentage
        </label>
        <input
          type="text"
          name="discount_percentage" 
          onChange={handleInputChange}
          value={discount?.discount_percentage}
         // onChange={handleInputChange}
          placeholder="Active Input"
          className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
        />
      </div>
      {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-5.5 p-6.5">
            <div>
            <label
                         htmlFor="is_active"
                        className="flex cursor-pointer select-none items-center"
              >    
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Is Active 
                    </label>
                    <div className="relative">
                            <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    className="sr-only"
                                    checked={discount?.is_active} 
                                    onChange={handleCheckboxChange}
                            />                    
                    <div
                         className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                         discount?.is_active && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                            }`}
                        >                            
                    </div>
                </div>
            </label>
            </div>
            </div>
            </div> */}
            </div>
        </div>
    </div>
                      
    <div className="flex flex-col gap-9">
          {/* <!-- Textarea Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              {/* <h3 className="font-medium text-black dark:text-white">
                Textarea Fields
              </h3> */}
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Start Date
                </label>
                <DatePicker
                            selected={startDate} // Bind the value to state
                            //onChange={(date) => setStartDate(date instanceof Date ? date : null)} // Handle date changes
                            onChange={handleStartDateChange}  
                            showTimeSelect
                            dateFormat="Pp" // Displays both date and time
                            placeholderText="Start Date and Time"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                   />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                End Date
                </label>
                <DatePicker
                          selected={endDate} // Bind the value to state
                          //  onChange={(date) => setEndDate(date instanceof Date ? date : null)} // Handle date changes
                          onChange={handleEndDateChange} // Handle date changes and update discount
                          showTimeSelect
                          dateFormat="Pp" // Displays both date and time
                          placeholderText="Start Date and Time"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                   />
              </div>
            </div>
          </div>                    
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
        </>
      ) : (
        <p>    
        </p>
      )}
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Alert in Modal</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
              Discount Updated Successfully !
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



export default DiscountDetail; 