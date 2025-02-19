import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "@/app/context/AuthContext";
import { color } from "framer-motion";
import { form } from "framer-motion/client";

interface DepartmentEditModalProps {
  show: boolean;
  handleClose: () => void;
  DepartmentData: {
    Id: string;
    Name: string;
    Image: string;
    } | null;
}

interface Department {
  Id: string;
  Name: string;
 
}
 
const DepartmentEditModal: React.FC<DepartmentEditModalProps> = ({ show, handleClose,DepartmentData }) => {

    

  const [formData, setFormData] = useState({
    Id:"",
    Name: "",    
    Image: ""  
  });

  const [categories, setCategories] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");  
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("");
  const { token } = useAuth();

   const [imgformData, setImgFormData] = useState({
       image_file: null as File | null   
     });

  useEffect(() => { 
    
    if (DepartmentData) {
        setFormData({
            Id: String(DepartmentData.Id), // Explicitly cast to string                     
            Name: DepartmentData.Name || "",            
            Image: DepartmentData.Image || "",
        });
    }
  }, [token]);

  
  
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
             const file = e.target.files?.[0]; // Get the selected file
             if (file) {
               // Optional: Upload the file to a server or create an object URL
               const fileUrl = URL.createObjectURL(file); // Temporary local URL for preview
               setImgFormData((prevData) => ({
                 ...prevData,
                 image_file: file, // Save the file object for upload
                 //image_url: fileUrl, // Save the file's local URL for preview
               }));
             }
          };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   console.log(JSON.stringify(formData));   
    try {
      if (imgformData.image_file) {
        // Create a new FormData instance
    
        const requestData = new FormData();
        
        requestData.append("Id",formData.Id);
        requestData.append("ImageFile", imgformData.image_file); // Attach the image file
        requestData.append("Name", formData.Name); // Attach the department name
  
        // Make the POST request
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/UpdateDepartment`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "", // Include the token if available
            },
            body: requestData, // Send the FormData as the request body
          }
        );
  
        if (response.ok) {
          // Check if there's a response body
          const contentType = response.headers.get("content-type");
          let data = null;
          if (contentType && contentType.includes("application/json")) {
            data = await response.json(); // Parse the JSON response
          }
  
          console.log("Success:", data || "No response body");
        //  alert("Department uploaded successfully!");
          handleClose(); // Close the modal after success
         location.reload();
        } else {
          const error = await response.text();
          console.error("Error:", error);
        //  alert("Failed to upload department.");
        }
      } else {
        const requestData = new FormData();
        requestData.append("Id",formData.Id);
        requestData.append("Name", formData.Name); // Attach the department name
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/UpdateDepartment`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "", // Include the token if available
              },
              body: requestData, // Send the FormData as the request body
            }
          );
    
          if (response.ok) {
            // Check if there's a response body
            const contentType = response.headers.get("content-type");
            let data = null;
            if (contentType && contentType.includes("application/json")) {
              data = await response.json(); // Parse the JSON response
            }
    
            console.log("Success:", data || "No response body");
          //  alert("Department uploaded successfully!");
            handleClose(); // Close the modal after success
            location.reload();
          } else {
            const error = await response.text();
            console.error("Error:", error);
          //  alert("Failed to upload department.");
          }
      }
    } catch (error) {
      console.error("Error during submission:", error);
     // alert("An unexpected error occurred. Please try again.");
    }
  };
  
  
  return (
<Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
            <Modal.Title>Create New Department</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDepartmentName">
            <Form.Label>
              Department Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>         
            <Form.Group controlId="formImageUpload">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                type="file"
                name="Image"
                accept="image/*"
                onChange={handleFileChange} // New handler for file selection
            />
            <span style={{color:"red"}}>Accepted Formats: JPG,JPEG,PNG,BMP</span>
            </Form.Group>&nbsp;&nbsp;&nbsp;
            <Form.Group>
            <div className="mt-3">
                            <img
                                src={formData.Image ? `${process.env.NEXT_PUBLIC_API_HOST}/DepartmentImages/${formData.Image}` : '/default-image.jpg'}
                                alt="Image Preview"
                                width="100"
                                height="100"
                            />
                        </div></Form.Group>
            <div className="depart-new-popup-btns" style={{float:"right"}}>
            <span>
          <Button variant="secondary" onClick={() => {
              handleClose();  // Close modal
              window.location.reload();  // Reload the page
            }}
          >
            Close
          </Button></span>
          <span>&nbsp;
          <Button type="submit" variant="primary">
            Create
          </Button></span></div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DepartmentEditModal;
