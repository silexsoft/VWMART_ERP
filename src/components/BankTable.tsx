'use client';
import  '../css/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import React from "react";
import { useRouter } from 'next/navigation';
import  '../css/custom.css';
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

interface Bank {
  Id: string; // Corresponds to AccountNumber (unique identifier)
  BankName: string; // Corresponds to BankName
  AccountName: string; // Corresponds to AccountName
  Location: string; // Corresponds to Location
  CreatedBy: string; // Corresponds to CreatedBy
  IFSCCode: string; // Corresponds to IFSCCode
  SwiftCode: string; // Corresponds to SwiftCode
  CreditBalance: number; // Corresponds to CreditBalance
  DebitBalance: number; // Corresponds to DebitBalance
  AccountGroup: string; // Corresponds to AccountGroup
  AddressLine1: string; // Corresponds to AddressLine1
  AddressLine2: string; // Corresponds to AddressLine2
  Country: string; // Corresponds to Country
  State: string; // Corresponds to State
  City: string; // Corresponds to City
  ZipCode: string; // Corresponds to ZipCode
  IsUPIAvialble: boolean; // Corresponds to IsUPIAvialble
  CreatedOn: string; // Corresponds to CreatedOn (ISO date string format)
  AccountNumber:string;
  WarehouseId:string
}


interface BankTableProps {
  banks: Bank[];
  totalbanks:number;
  currentPage:number
}

const BankTable: React.FC<BankTableProps> = ({ banks , totalbanks,currentPage }) => {
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
    if (selectedItems.length === banks.length) {
      setSelectedItems([]); // Deselect all

     // alert(selectedItems.length);
    } else {
      //setSelectedItems(products.map((product) => product.id)); // Select all
    }
  };
  
  const toggleDropdown = (id:any) => {
    setVisibleDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = (Id:any) => {
    
  };
  const toggleSelect = (Id:any) => {
    setSelectedItems((prev:any) =>
      prev.includes(Id)
        ? prev.filter((id:any) => id !== Id)
        : [...prev, Id]
    );
  };
  const handleStockAdjustment = (Id:any) => {
   // console.log(`Adjust stock for product with ID: ${Id}`);
    // Add your stock adjustment logic here
  };

  const handleDeactivate = (Id:any) => {
    //console.log(`Deactivate product with ID: ${Id}`);
    // Add your deactivate logic here
  };
  const  DeleteBank = async () => {
    try {
    const response = await DeleteBankApi(selectedItems);
  } 
  catch (error) {
    console.error('Error updating Bank:', error);
  }
}
const handleDeleteClick = (id: string) => {
  // Call the delete API for a single ID
  DeleteBankApi([id]);
};
const DeleteBankApi = async (selectedItems: any[]) => {
  handleOpenInventoryModal();
  //console.log("Delete ids"+  JSON.stringify(selectedItems));
  //console.log('Authorization Token:', token);

   try
   {
    try {
      // Map delete requests into an array of promises
      const deleteRequests = selectedItems.map((deleteItem) => {
        console.log(`Deleting item: ${deleteItem}`); // Debugging log
        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/DeleteBankDetailsById?Id=${deleteItem}`, {
          method: 'DELETE',
          headers: {
          //  'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
      });
  
      // Execute all requests in parallel
      const responses = await Promise.all(deleteRequests);
  
      // Check for any failed responses
      const failedResponses = responses.filter((response) => !response.ok);
  
      if (failedResponses.length > 0) {
        console.error('Some items could not be deleted:', failedResponses);
         // alert(`Failed to delete ${failedResponses.length} items. Check the console for details.`);
      } else {
         // alert('All items deleted successfully.');
      }
  
      // Refresh data or update state instead of reloading the page
      // Example: refreshData();
      location.reload(); // Use this only if necessary
    } catch (error) {
      console.error('An error occurred:', error);
    //  alert('An error occurred while deleting items. Check the console for details.');
    }
   }
   catch
   { }
};

  if (!banks) {
    return <div>Loading...</div>; // Change "wait" to a more descriptive message
  }
    
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Banks
        </h4>
        <h4  className="text-xl font-semibold text-black" style={{ marginTop: "-21px",float: "right" }}>
            Total : {totalbanks}
        </h4>
      </div>      */}
      <div className="px-4 py-4.5 md:px-6 2xl:px-7.5">
      {/* {selectedItems.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gray-100 p-4 mt-4"
        >
          <div className="flex items-center justify-between">
            <p>{selectedItems.length} items selected</p>
            <button
              onClick={DeleteBank}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )} */}
      
       

      <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-t border-stroke dark:border-strokedark">
          {/* <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedItems.length === banks.length}
              />
          </th> */}
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Sr.No.
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Bank Name
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
           Location
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Account Holder Name
          </th> 
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Account Number
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
        {banks.map((bank, key) => (        
          <tr
            key={key}
            className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {/* <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
            <input
                  type="checkbox"
                  checked={selectedItems.includes(bank.Id)}
                  onChange={() => toggleSelect(bank.Id)}
                />
            </td> */}
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
              {/* {key + 1} */}
              {(Number(currentPage)) * 25 + key + 1}

            </td>
            <td className="px-4 py-2 text-sm text-meta-3" style={{ width: '10%' }}>
            <button 
                   onClick={() => router.push(`/banks/${bank.Id}`)} 
                  className="text-blue-500 hover:underline"
                >
                 {bank.BankName} 
            </button>            
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
            {bank.Location} 
            </td>  
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>    
            {bank.AccountName} 
            </td>    
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
            {bank.AccountNumber}
            </td> 
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
            {bank.CreatedBy}
            </td> 

            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
             <span className="dtr-data">
              <a  href={`/Bank/${bank.Id}`} data-toggle="modal" data-id="104" data-target="#m_modal_7" className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">
                <i className="fa fa-edit"></i>
              </a>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="dtr-data">
              <a
                            onClick={() => DeleteBankApi([bank.Id])}
                            className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
                            title="Delete"
                          >
                            <i className="fa fa-trash"></i>
                          </a>
              </span>            
            </td>     
           
            {/* <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
              <button className="hover:text-primary" style={{ fontSize:'20px' , marginLeft:'10px',
               backgroundColor: isHovered ? 'blue' : 'transparent',
               borderRadius: isHovered ? '60px' : '',
               color: isHovered ? '#00a4e5' : 'Black',
      }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => toggleDropdown(bank.Id)}
               >...</button>
{visibleDropdownId === bank.Id  && (
        <div
          className="dropdown-menu dropdown-menu-right show productpage"
          style={{
            position: "absolute",
            zIndex: 10,
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "10px",
          }}
        >
          <a className="dropdown-item productpage" href={`/bank/${bank.Id}`}>
          <i className="la la-edit"></i> Edit Details
          </a>
          <a
            className="dropdown-item productpage"
            href="#"
            onClick={() => handleDeleteClick(bank.Id)}
          >
            <i className="la la-trash"></i> Delete
          </a>
          <a
            className="dropdown-item productpage"
            href="#"
            onClick={() =>
              alert(`Stock Adjustment action triggered for Product`)
            }
          >
            <i className="fa fa-adjust"></i> Stock Adjustment
          </a>
          <a
            className="dropdown-item productpage"
            href="#"
            onClick={() => alert(`Deactivate action triggered for Product`)}
          >
            <i className="fas fa-ban"></i> Deactivate
          </a>
        </div>
      )}
             </td>   */}
          </tr> 
        ))}
      </tbody>
    </table>
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

export default BankTable;
