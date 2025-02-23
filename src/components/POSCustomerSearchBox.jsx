"use client";
import React, { useState, useEffect } from "react";
import db from "@/db/dexieDB";
import { useAuth } from "@/app/context/AuthContext";
import { migrateshoppingcart,getCustomerLastOrder } from "@/utils/posService";
import { Modal, Button, Alert } from "react-bootstrap";
const POSCustomerSearchBox = ({ setSelectedCustomer,
    selectedCustomer,
    selectedProducts,
    setSearchCustomerTerm,
    searchCustomerTerm,
    setCustomers,
    customers,
    setCustomerLastOrder
 }) =>
{
    const { token, logout, warehouseId } = useAuth();
    //const [searchTerm, setSearchTerm] = useState(''); // User input
    const [isNewCustomerPopupOpen, setIsNewCustomerPopupOpen] = useState(false); // Search results
    const [customerId, setCustomerId] = useState([]);
    useEffect(() =>
    {
        const delayDebounceFn = setTimeout(() =>
        {
            if (searchCustomerTerm.trim())
            {
                searchCustomers(searchCustomerTerm);
            } else
            {
                setCustomers([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchCustomerTerm]);

    const searchCustomers = async (query) =>
    {
        try
        {
            const results = await db.customers
                .where("username")
                .startsWithIgnoreCase(query)
                .or("phone").startsWithIgnoreCase(query)
                .toArray();
            setCustomers(results);
        } catch (error)
        {
            console.error("Error searching customer:", error);
        }
    };
    const selectCustomer =async (customer) =>
    {
        let oldCustomerId=0;
        if(selectedProducts.length > 0)
            {
                oldCustomerId=selectedCustomer;
            }
        await getCustomerLastOrder(token,customer.phone).then((obj_order)=>{
            setCustomerLastOrder(obj_order);
        })
        if(selectedProducts!= null && selectedProducts.length > 0 && oldCustomerId > 0)
        {
            ////Case if having items in cart
            try {
                const migrateResponse = await migrateshoppingcart(token,oldCustomerId,customer.id, warehouseId);
                setCustomerId(customer.id);
                setSelectedCustomer(customer.id);
                setCustomers([]);
                //setSearchTerm(customer.first_name + " " + customer.last_name + " - " + customer.phone);
                setSearchCustomerTerm(customer.first_name + " " + customer.last_name + " - " + customer.phone);
            } catch (error) {
                console.error("Migrate customer:", error);
            }
        }
        else{
            ////Case if cart empty
                setCustomerId(customer.id);
                setSelectedCustomer(customer.id);
                setCustomers([]);
                //setSearchTerm(customer.first_name + " " + customer.last_name + " - " + customer.phone);
                setSearchCustomerTerm(customer.first_name + " " + customer.last_name + " - " + customer.phone);
        }
    };
    const clearSearch = () =>
    {
        //setSearchTerm("");
        setSearchCustomerTerm("");
        setCustomerId(null);
        setCustomers([]);
    };
 
    /*This function is used to create new customer. */
    const createCustomer =async (event)=>{
        event.preventDefault();
        const formData = new FormData(event.target);
        console.log(formData);
    }

return (<div>
    <div className="relative p-0 w-full max-w-sm">
        <input
            type="text"
            value={searchCustomerTerm}
            onChange={(e) => setSearchCustomerTerm(e.target.value)}
            placeholder="Walk-in customer..."
            className="w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        {/* Clear (X) button */}
        {searchCustomerTerm && (
            <button
                onClick={clearSearch}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-non"
            >
                ✕
            </button>
        )}
        </div>
        <div className="mt-2">
        
            {customers.length > 0 ? (
                
                <ul className="searchlistbox col-md-3">
                     <li className="p-2 border-b" onClick={() => setIsNewCustomerPopupOpen(true)} >
                            <a className="link-primary cursor-pointer"> Add Customer</a>
                        </li>
                    {customers.map((customer) => (
                        <li key={customer.id} className="p-2 border-b" onClick={() => selectCustomer(customer)} >
                            <strong>{customer.first_name}</strong> <strong> {customer.last_name}</strong>
                            - <strong>{customer.phone}</strong>
                        </li>
                    ))}
                </ul>
                
                
            ) : (
                searchCustomerTerm && !customerId && 
                <ul className="searchlistbox col-md-3">
                <li className="p-2 border-b" onClick={() => setIsNewCustomerPopupOpen(true)} >
                        <a className="link-primary cursor-pointer"> Add Customer</a>
                    </li>
                </ul>
            )}
        </div>
       {/*Start Add customer Model */}
        <Modal className="modal-sm" show={isNewCustomerPopupOpen}>
            <Modal.Header>
            <div className="col-12">
    <h4 className="text-xl font-semibold text-black dark:text-white float-left">
      New Customer
    </h4>
    <div  className="text-xl font-semibold text-black float-right">
    <a className="cursor-pointer" onClick={()=> setIsNewCustomerPopupOpen(false)}><i className="fa fa-close"></i></a>
        </div>
  </div>
                
            </Modal.Header>
                <Modal.Body>
                    <form onSubmit={createCustomer}>
                    <div className="row">
                        <div className="col-12">
                        <label className="col-lg-12 col-md-12 col-sm-12 p-2">
                   Name <span className="text-red">*</span>
                  </label>
                            <input className="form-control form-control-sm" type="text" name="name" required></input>
                        </div>
                        <div className="col-12">
                        <label className="col-lg-12 col-md-12 col-sm-12 p-2">
                   Mobile No. <span className="text-red">*</span>
                  </label>
                          <input className="form-control form-control-sm" type="text"
  pattern="(?:0|[1-9]\d*)" minLength={10} name="phone" required></input>
                        </div>
                        <div className="col-12">
                         <Button variant="primary" type="submit">
                           Save
                        </Button>
                        </div>
                    </div>
                    </form>
                    
                </Modal.Body>
            </Modal>
{/*End Add customer Model */}
    </div>)
};

export default POSCustomerSearchBox;
