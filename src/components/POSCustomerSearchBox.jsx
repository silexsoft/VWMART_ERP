"use client";
import React, { useState, useEffect } from "react";
import db from "@/db/dexieDB";
const POSCustomerSearchBox = ({ setSelectedCustomer }) =>
{
    const [searchTerm, setSearchTerm] = useState(''); // User input
    const [customers, setCustomers] = useState([]); // Search results
    const [customerId, setCustomerId] = useState([]);
    useEffect(() =>
    {
        const delayDebounceFn = setTimeout(() =>
        {
            if (searchTerm.trim())
            {
                searchCustomers(searchTerm);
            } else
            {
                setCustomers([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchCustomers = async (query) =>
    {
        try
        {
            const results = await db.customers
                .where("username")
                .startsWithIgnoreCase(query)
                .toArray();
            setCustomers(results);
        } catch (error)
        {
            console.error("Error searching customer:", error);
        }
    };
    const addCustomer = (customer) =>
    {
        setCustomerId(customer.id);
        setSelectedCustomer(customer.id);
        setCustomers([]);
        setSearchTerm(customer.first_name + " " + customer.last_name + " - " + customer.phone);
    };
    const clearSearch = () =>
    {
        setSearchTerm("");
        setCustomerId(null);
        setCustomers([]);
    };

    return (<div>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Walk-in customer..."
            className="w-full p-2 border rounded"
        />
        {/* Clear (X) button */}
        {searchTerm && (
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
                        <li key={customer.id} className="p-2 border-b" onClick={() => addCustomer(customer)} >
                            <strong>{customer.first_name}</strong> <strong> {customer.last_name}</strong>
                            - <strong>{customer.phone}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                searchTerm && !customerId && <p>No Customer found.</p>
            )}
        </div>
    </div>)
};

export default POSCustomerSearchBox;
