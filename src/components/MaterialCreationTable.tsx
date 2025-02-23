'use client';
import  '../css/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import React from "react";
import { useRouter } from 'next/navigation';
import  '../css/custom.css';
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
interface MaterialCreation {
  Id: string;
  Sku: string;
  ProductName: string;
  BatchNo: string;
  MaterialCreationNo: string;
  Description: string;
  QtyTaken: number;
  MrpTaken: number;
  UnitCostTaken: number;
  LandingPriceTaken: number;
  SalesRateTaken: number;
  TaxRateTaken: number;
  TotalTaken: number;
  QtyReceived: number;
  MrpReceived: number;
  UnitCostReceived: number;
  LandingPriceReceived: number;
  SalesRateReceived: number;
  TaxRateReceived: number;
  TotalReceived: number;
  Created_at: Date;
  Updated_at: Date;
}



interface MaterialCreationProps {
  Materials: MaterialCreation[];
  totalMaterials:number;
  currentPage:number
}

const MaterialCreationTable: React.FC<MaterialCreationProps> = ({ Materials , totalMaterials,currentPage }) => {
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
    if (selectedItems.length === Materials.length) {
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
//   const  DeleteMaterials = async () => {
//     try {
//     const response = await DeleteMaterialsApi(selectedItems);
//   } 
//   catch (error) {
//     console.error('Error updating Bank:', error);
//   }
// }
const handleDeleteClick = (id: string) => {
  // Call the delete API for a single ID
  
  DeleteMaterialApi(id);
};
const DeleteMaterialApi = async (deleteItem: any) => {
  handleOpenInventoryModal();

  try {
    console.log(`Deleting item: ${deleteItem}`); // Debugging log

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/DeleteMaterialCreationDetailsById?Id=${deleteItem}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to delete the item:', response);
      alert('Failed to delete the item. Check the console for details.');
    } else {
      console.log('Item deleted successfully.');
      alert('Item deleted successfully.');

      // Refresh data or update state instead of reloading the page
      // Example: refreshData();
      location.reload(); // Use this only if necessary
    }
  } catch (error) {
    console.error('An error occurred:', error);
    alert('An error occurred while deleting the item. Check the console for details.');
  }
};


  if (!Materials) {
    return <div>Loading...</div>; // Change "wait" to a more descriptive message
  }
    
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">     
      <div className="px-4 py-4.5 md:px-6 2xl:px-7.5">
      <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-t border-stroke dark:border-strokedark">         
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Sr.No.
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Material Creation No.
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Material Creation Date
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" style={{ width: '10%' }}>
          Location
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
        {Materials.map((Material, key) => (        
          <tr
            key={key}
            className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
              {/* {key + 1} */}
              {(Number(currentPage)) * 25 + key + 1}

            </td>
            <td className="px-4 py-2 text-sm text-meta-3" style={{ width: '10%' }}>
            <button 
                   onClick={() => router.push(`/MaterialCreation/${Material.Id}`)} 
                  className="text-blue-500 hover:underline"
                >
                 {Material.MaterialCreationNo} 
            </button>            
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
            {'VWMart'}
            </td>  
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>    
            {Material.Created_at && Material.Created_at instanceof Date
                    ? Material.Created_at.toLocaleDateString()
                      : 'Invalid Date'}
            </td>     
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
            {'VWMart'}
            </td>    
            <td className="px-4 py-2 text-sm text-black dark:text-white" style={{ width: '10%' }}>
             <span className="dtr-data">
              <a  href={`/MaterialCreation/${Material.Id}`} data-toggle="modal" data-id="104" data-target="#m_modal_7" className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">
                <i className="fa fa-edit"></i>
              </a>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="dtr-data">
              <a
                            onClick={() => handleDeleteClick(Material.Id)}
                            className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
                            title="Delete"
                          >
                            <i className="fa fa-trash"></i>
                          </a>
              </span>            
            </td>     
           
           
          </tr> 
        ))}
      </tbody>
    </table>
  </div>  
</div>
  );
};

export default MaterialCreationTable;
