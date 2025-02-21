import db from '@/db/dexieDB';

// Function to save customers
export const saveCustomers = async (customers) =>
{
    try
    {
        await db.customers.bulkPut(customers); // Save all customers
        console.log('Customer saved successfully!');
    } catch (error)
    {
        console.error('Error saving customers:', error);
    }
};

// Function to retrieve customers
export const getCustomers = async () =>
{
    try
    {
        const customers = await db.customers.toArray(); // Retrieve all customers
        return customers;
    } catch (error)
    {
        console.error('Error retrieving customers:', error);
        return [];
    }
};

// Function to retrieve customers By customerId
export const getCustomerById = async (id) =>
    {
        try
        {
            console.log("getCustomerById="+id);
            //const customer = await db.customers.where("id").equals(id).toArray(); // Retrieve customers by id
            const customer = await db.customers.get(id); // Retrieve customers by id
            return customer;
        } catch (error)
        {
            return [];
        }
    };