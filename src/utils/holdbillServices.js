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

export const savesingleHoldBill = async (holdbill) =>
    {
        try
        {
            await db.holdbills.add(holdbill); // Save all holdbills
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
export const getHoldBillsById = async (billid) =>
    {
        try
        {
            const holdbills = await db.holdbills.where("Id").equals(billid).toArray(); // Retrieve all holdbills
            return holdbills;
        } catch (error)
        {
            console.error('Error retrieving holdbills:', error);
            return [];
        }
    };