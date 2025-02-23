import Dexie from 'dexie';

const db = new Dexie('ProductsDB');

db.version(1).stores({
  products: 'id, name, sku', // Define the `products` table
  customers: 'id, username, first_name  ,last_name,phone',
  holdbills: 'Id, CustomerName, Phone,CustomerId,ProductId',
});

export default db;
