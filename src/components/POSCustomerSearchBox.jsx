"use client";
import React, { useState, useEffect } from "react";
import db from "@/db/dexieDB";
import { useAuth } from "@/app/context/AuthContext";
import { migrateshoppingcart,getCustomerLastOrder } from "@/utils/posService";
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
    //const [customers, setCustomers] = useState([]); // Search results
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

    return (<div>
        <input
            type="text"
            value={searchCustomerTerm}
            onChange={(e) => setSearchCustomerTerm(e.target.value)}
            placeholder="Walk-in customer..."
            className="w-full p-2 border rounded"
        />
        {/* Clear (X) button */}
        {searchCustomerTerm && (
            <button
                onClick={clearSearch}
                className=" p-2 border rounded"
            >
                ✕
            </button>
        )}
        <div className="mt-2">
            {customers.length > 0 ? (
                <ul className="searchlistbox col-md-3">
                    {customers.map((customer) => (
                        <li key={customer.id} className="p-2 border-b" onClick={() => selectCustomer(customer)} >
                            <strong>{customer.first_name}</strong> <strong> {customer.last_name}</strong>
                            - <strong>{customer.phone}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                searchCustomerTerm && !customerId && <p>No Customer found.</p>
            )}
        </div>
    </div>)
};

export default POSCustomerSearchBox;
