'use client';
import  '../css/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import React from "react";
import { useRouter } from 'next/navigation';
import  '../css/custom.css';
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import DepartmentEditModal from './DepartmentEditModal';

interface Department {
  Id: string; // Corresponds to AccountNumber (unique identifier)
  Name:string;
  Image:string;
  CreatedBy:string;
  CreatedAt:string;
  UpdateAt:string
}


interface DepartmentTableProps {
  Departments: Department[];
  totalDepartments:number;
  currentPage:number
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ Departments , totalDepartments,currentPage }) => {
  const router = useRouter();

  const { token, logout } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const [visibleDropdownId, setVisibleDropdownId] = useState(null);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleOpenInventoryModal = () => setShowInventoryModal(true);
  const [showModal, setShowModal] = useState(false);
   const [selectedDepartment, setSelectedDepartment] = useState(null);
  const closeModal = () => {
    setShowInventoryModal(false); // Close the modal
  };
  const handleSelectAll = () => {
    if (selectedItems.length === Departments.length) {
      setSelectedItems([]); // Deselect all

     // alert(selectedItems.length);
    } else {
      //setSelectedItems(products.map((product) => product.id)); // Select all
    }
  };
  const handleShowModal = (categoryData: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedDepartment(categoryData);
    setShowModal(true);
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
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedDepartment(null); // Clear the selected category
  };
  const handleDeactivate = (Id:any) => {
    //console.log(`Deactivate product with ID: ${Id}`);
    // Add your deactivate logic here
  };
  const  DeleteDepartment = async () => {
    try {
    const response = await DeleteDepartmentApi(selectedItems);
  } 
  catch (error) {
    console.error('Error updating Department:', error);
  }
}
const handleDeleteClick = (id: string) => {
  // Call the delete API for a single ID
  DeleteDepartmentApi([id]);
};
const DeleteDepartmentApi = async (selectedItems: any[]) => {
  handleOpenInventoryModal();
  //console.log("Delete ids"+  JSON.stringify(selectedItems));
  //console.log('Authorization Token:', token);

   try
   {
    try {
      // Map delete requests into an array of promises
      const deleteRequests = selectedItems.map((deleteItem) => {
        console.log(`Deleting item: ${deleteItem}`); // Debugging log
        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/DeleteDepartment?id=${deleteItem}`, {
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

  if (!Departments) {
    return <div>Loading...</div>; // Change "wait" to a more descriptive message
  }
    
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
       <div className="px-4 py-4.5 md:px-6 2xl:px-7.5">
      <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-t border-stroke dark:border-strokedark">          
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" >
          Sr.No.
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" >
          Image
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" >
          Name
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" >
          Created By
          </th>          
          <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white" >
          Actions
          </th>         
        </tr>
      </thead>
      <tbody>
        { Departments.length > 0 ? (   Departments.map((Department, key) => (        
          <tr
            key={key}
            className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
          >            
            <td className="px-4 py-2 text-sm text-black dark:text-white" >            
              {(Number(currentPage)) * 25 + key + 1}

            </td>
            <td className="px-4 py-2 text-sm text-meta-3" >
           
            <img
                 src={Department.Image ? `${process.env.NEXT_PUBLIC_API_HOST}/DepartmentImages/${Department.Image}` : '/default-image.jpg'}
                 alt={`Department ${Department.Name}`}
                 style={{ width: '100px' }}
            />
               
                       
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white" >
            {Department.Name} 
            </td>  
            <td className="px-4 py-2 text-sm text-black dark:text-white" >    
            {Department.CreatedBy} 
            </td>
            <td className="px-4 py-2 text-sm text-black dark:text-white" >
              <span className="dtr-data">
                    <a   data-toggle="modal" data-id="104" data-target="#m_modal_7"
                     className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill" 
                     title="Edit"
                     onClick={(e) =>
                        handleShowModal(
                          {
                            Id: String(Department.Id),
                            Name: Department.Name,
                           Image:Department.Image,
                          },
                          e
                        )
                      }
                     >
                         <i className="fa fa-edit"></i>
                    </a>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="dtr-data">
                        <a
                            onClick={() => DeleteDepartmentApi([Department.Id])}
                            className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
                            title="Delete"
                          >
                            <i className="fa fa-trash"></i>
                          </a>
              </span>            
            </td>    
          </tr> 
        ))):(
            <tr>
             <th style={{alignContent: 'center !important'}}>No data available</th> 
            </tr>
            
    
 
            
         )}
        
      </tbody>
    </table>
  </div>
  {showModal && selectedDepartment && (
                  <DepartmentEditModal
                                      show={showModal}
                                      handleClose={handleCloseModal}
                                      DepartmentData={selectedDepartment} // Pass the selected category data
                    />
          )}
  
    
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

export default DepartmentTable;
