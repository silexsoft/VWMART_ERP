import React from 'react';

const OrderReceipt = ({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="">
    
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Order Details</h2>
        <p>Order ID: {order.id}</p>
        <p>Date: {order.date}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Customer Information</h2>
        <p>Name: {order.customer.name}</p>
        <p>Email: {order.customer.email}</p>
        <p>Address: {order.customer.address}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Items</h2>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total</h2>
        <p className="font-bold text-xl">${order.total.toFixed(2)}</p>
      </div>
      <button
        onClick={handlePrint}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Print Receipt
      </button>
    </div>
  );
};

export default function ReceiptPage() {
  // Example order data
  const exampleOrder = {
    id: '12345',
    date: '2025-02-23',
    customer: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: '123 Main St, Springfield, USA',
    },
    items: [
      { name: 'Product 1', quantity: 2, price: 20.0 },
      { name: 'Product 2', quantity: 1, price: 15.0 },
    ],
    total: 55.0,
  };

  return <OrderReceipt order={exampleOrder} />;
}
