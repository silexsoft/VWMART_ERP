import db from '@/db/dexieDB';

// Function to save products
export const saveProducts = async (products) => {
  try {
    await db.products.bulkPut(products); // Save all products
    console.log('Products saved successfully!');
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// Function to retrieve products
export const getProducts = async () => {
  try {
    const products = await db.products.toArray(); // Retrieve all products
    return products;
  } catch (error) {
    console.error('Error retrieving products:', error);
    return [];
  }
};