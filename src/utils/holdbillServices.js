import db from '@/db/dexieDB';

// Function to save holdbills
export const saveHoldBill = async (holdbills) =>
{
    try
    {
        await db.holdbills.bulkPut(holdbills); // Save all holdbills
        console.log('Customer saved successfully!');
    } catch (error)
    {
        console.error('Error saving holdbills:', error);
    }
};

// Function to retrieve holdbills
export const getHoldBills = async () =>
{
    try
    {
        const holdbills = await db.holdbills.toArray(); // Retrieve all holdbills
        return holdbills;
    } catch (error)
    {
        console.error('Error retrieving holdbills:', error);
        return [];
    }
};

// Function to retrieve holdbills by id
export const getHoldBillsById = async (CustomerId) =>
    {
        console.log("CustomerId="+CustomerId);
        try
        {
            const holdbills = await db.holdbills.where("CustomerId").equals(CustomerId).toArray(); // Retrieve all holdbills
            return holdbills;
        } catch (error)
        {
            console.error('Error retrieving holdbills:', error);
            return [];
        }
    };
// Function to used to delete holdbills by customerid
    export const deleteHoldBillByCustomerId = async (CustomerId) =>
        {
            try
            {
                await db.holdbills.where("CustomerId").equals(CustomerId).delete(); // Save all holdbills
                console.log('Customer Deleted successfully!');
            } catch (error)
            {
                console.error('Error saving holdbills:', error);
            }
        };

        // Function to used to delete holdbills by customerid By productid
    export const deleteHoldBillByCustomerIdByProductId = async (CustomerId,ProductId) =>
        {
            console.log("CustomerId="+CustomerId + " and ProductId="+ProductId);
            try
            {
                await db.holdbills.where("CustomerId").equals(CustomerId).and(obj => obj.ProductId == ProductId).delete(); // Save all holdbills
                console.log('Customer Deleted successfully!');
            } catch (error)
            {
                console.error('Error saving holdbills:', error);
            }
        };