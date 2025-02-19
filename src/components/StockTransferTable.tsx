'use client';
import { useState } from "react";
import React from "react";
import { useRouter } from 'next/navigation';
import  '../css/custom.css';
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

interface StockTransfer {
//   id: string;
//   name: string;
//   sku: string;
//   published: boolean;
//   deleted: boolean;
//   old_price: string;
//   price:string,
//   image_url:string,
//   category_names:string,
//   manufacturer_names:string,
//   totalProducts: number,
//   order_minimum_quantity:number,
//   stock_quantity:string

  Id: string,
  TransferNo:string,
  TransferDate:  Date,
  FromLocation: string,
  ToLocation: string,
  NetAmount: string,
  Qty: string,
  Status: string,
  CreatedBy: string,
  AdditionalCharge: string,
  AdditionalValue: string,
  AdditionalTax: string,
  AdditionalCurrency: string,
  AdditionalTotal: string,
  ShippingType: string,
  ShippingDate: Date,
  ReferenceNo: string,
  TransportDate: Date,
  ModeOfTransport: string,
  TransporterName: string,
  VehicleNo: string,
  Weight: string,
  Note: string
}

interface ProductsTableProps {
  stocktransfer: StockTransfer[];
  totalProducts:number;
  currentPage:number
}

const StockTransferTable: React.FC<ProductsTableProps> = ({ stocktransfer , totalProducts,currentPage }) => {
  const router = useRouter();

  const { token, logout } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const [visibleDropdownId, setVisibleDropdownId] = useState(null);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleOpenInventoryModal = () => setShowInventoryModal(true);

  const closeModal = () => {
    setShowInventoryModal(false); // Close the modal
  };
  const handleSelectAll = () => {
    if (selectedItems.length === stocktransfer.length) {
      setSelectedItems([]); // Deselect all

      alert(selectedItems.length);
    } else {
      //setSelectedItems(products.map((product) => product.id)); // Select all
    }
  };
  
  const toggleDropdown = (id:any) => {
    setVisibleDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = (productId:any) => {
    
  };
  const toggleSelect = (productId:any) => {
    setSelectedItems((prev:any) =>
      prev.includes(productId)
        ? prev.filter((id:any) => id !== productId)
        : [...prev, productId]
    );
  };
  const handleStockAdjustment = (productId:any) => {
    console.log(`Adjust stock for product with ID: ${productId}`);
    // Add your stock adjustment logic here
  };

  const handleDeactivate = (productId:any) => {
    console.log(`Deactivate product with ID: ${productId}`);
    // Add your deactivate logic here
  };
  const  DeleteProduct = async () => {
    try {
    const response = await DeleteProductApi(selectedItems);
  } 
  catch (error) {
    console.error('Error updating product inventory:', error);
  }
}
const handleDeleteClick = (id: string) => {
  // Call the delete API for a single ID
  DeleteProductApi([id]);
};
const DeleteProductApi = async (selectedItems: any[]) => {
  handleOpenInventoryModal();
  console.log("Delete ids"+  JSON.stringify(selectedItems));
   try
   {
           for(const deleteitem of selectedItems)
            {
              try{ const responses = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/Delete/${deleteitem}`, 
                {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization:token ? `Bearer ${token}` : '',
                  },                  
                });
                if (!responses.ok) {
                  throw new Error(`Error: ${responses.statusText}`);
                }
                location.reload();
              }catch{}
            }
   }
   catch
   { }

};

//   if (!stocktransfer) {
//     return <div>Loading...</div>; // Change "wait" to a more descriptive message
//   }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="allproduct_table">
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gray-100 p-4 mt-4"
        >
          <div className="flex items-center justify-between">
            <p>{selectedItems.length} items selected</p>
            <button
              onClick={DeleteProduct}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}
<div className="products-tablepage">
      <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-t border-stroke dark:border-strokedark">          
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          #
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Transfer No
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Transfer Date
          </th> 
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          From Location
          </th>          
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          To Location
          </th>  
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Net Amount
          </th>  
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Qty
          </th> 
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Status
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Created By
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Actions
          </th>                           
        </tr>
      </thead>
      <tbody>
  {stocktransfer && stocktransfer.length > 0 ? (
    stocktransfer.map((stocktransfers, key) => (
      <tr
        key={key}
        className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          {(Number(currentPage)) * 25 + key + 1}
        </td>
        <td className="px-4 py-2 text-sm text-meta-3" style={{ width: '10%' }}>
          {stocktransfers.TransferNo || "No Data Available"}
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          <button
            onClick={() =>
              stocktransfers.Id
                ? router.push(`/products/ProductDetails/${stocktransfers.Id}`)
                : null
            }
            className={`text-blue-500 hover:underline ${!stocktransfers.Id ? "cursor-not-allowed text-gray-500" : ""}`}
            disabled={!stocktransfers.Id}
          >
            {stocktransfers.TransferDate
              ? new Date(stocktransfers.TransferDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "No Data Available"}
          </button>
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          {stocktransfers.FromLocation || "No Data Available"}
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          {stocktransfers.ToLocation || "No Data Available"}
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          {stocktransfers.NetAmount !== null && stocktransfers.NetAmount !== undefined
            ? stocktransfers.NetAmount
            : "No Data Available"}
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          {stocktransfers.Qty !== null && stocktransfers.Qty !== undefined
            ? stocktransfers.Qty
            : "No Data Available"}
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          {stocktransfers.Status || "No Data Available"}
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          {stocktransfers.CreatedBy || "No Data Available"}
        </td>
        <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
          <span className="dtr-data">
            <a
              href={stocktransfers.Id ? `/StockTransfer/${stocktransfers.Id}` : "#"}
              className={`m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill ${
                !stocktransfers.Id ? "cursor-not-allowed text-gray-500" : ""
              }`}
              title="Edit"
              onClick={(e) => !stocktransfers.Id && e.preventDefault()}
            >
              <i className="fa fa-edit"></i>
            </a>
          </span>
          &nbsp;&nbsp;&nbsp;
          <span className="dtr-data">
            <a
              className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
              title="Delete"
            >
              <i className="fa fa-trash"></i>
            </a>
          </span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={10} className="text-center py-4 text-sm text-gray-500">
        No Data Available
      </td>
    </tr>
  )}
</tbody>
    </table>
  </div>
</div>


  {showInventoryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Modal Title</h2>
              <button onClick={closeModal} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>This is the content of the modal.</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
</div>
  );
};

export default StockTransferTable;
