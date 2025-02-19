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