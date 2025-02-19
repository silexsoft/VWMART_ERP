import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "@/app/context/AuthContext";


// Define the types for the props that the modal component will receive

interface BrandEditModalProps {
    show: boolean; // 'show' is a boolean to control visibility of the modal
    handleClose: () => void; // 'handleClose' is a function to close the modal
    manufacturerData: {
    id: string;
    name: string;
    image_url: string;
    description: string;
    parent_manufacturer_name: string;
    } | null; // 'manufacturerData' is either an object with the manufacturer data or null
  }
  interface manufacturer {
    id: string;
    name: string;
  } 
const BrandEditModal: React.FC<BrandEditModalProps> = ({
    show,
    handleClose,
    manufacturerData,    
    }) => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        image_url: "",
        description: "",
        parent_manufacturer_name: "",
    });
 
    const [selectedmanufacturer, setSelectedmanufacturer] = useState<number[]>([]); // Use an array for IDs
    const { token, logout } = useAuth();   
    const [categories, setCategories] = useState<manufacturer[]>([]);
    const [manufacturerId, setmanufacturerId] = useState<string>("");

    const [selectedmanufacturerName, setSelectedmanufacturerName] = useState('');
    
  const [imgformData, setImgFormData] = useState({
    image_file: null as File | null   
  });

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

    useEffect(() => {
        if (manufacturerData) {
            setFormData({
                id: String(manufacturerData.id), // Explicitly cast to string
               // department:  "",              
                name: manufacturerData.name || "",
                //catCode:  "",
                description: manufacturerData.description || "",
                image_url: manufacturerData.image_url || "",
                parent_manufacturer_name: manufacturerData.parent_manufacturer_name || "",
            });
        }
        

        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/manufacturer/GetAll?storeId=0&pageIndex=0&pageSize=2147483647&showHidden=false`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '',
            }
          })
            .then(response => response.json())
            .then(data => {
              setCategories(data.items); // Set categories data to state
            })
            .catch(error => console.error("Error fetching categories:", error));
      
    
            
        const manufacturerId = Array.isArray(manufacturerData) ? manufacturerData[0]?.id : manufacturerData?.id;

        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Productmanufacturer/GetProductmanufacturerIds/${manufacturerId}`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("data fnd"+ JSON.stringify(data) );
              if (data && Object.keys(data).length > 0) {
                const firstKey = Object.keys(data)[0];
                setSelectedmanufacturer(data[firstKey]); // Set submanufacturer IDs
              } else {
                console.warn("Empty or invalid response. No data found for the given ID:", manufacturerId);
                setSelectedmanufacturer([]); // Set an empty array or default value
              }
            })
            .catch((error) => console.error("Error fetching data:", error));
          console.log(selectedmanufacturer);


    }, [manufacturerData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
     
        if(imgformData.image_file)
        {
                 try
                 {  const file = imgformData.image_file;
                    const mimeType = file.type; // Get the MIME type (e.g., "image/png")
                    const seoFilename = file.name.split(".")[0]; // Get the filename without extension
                
                    const uploadUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Picture/InsertPicture?mimeType=${encodeURIComponent(
                      mimeType
                    )}&seoFilename=${encodeURIComponent(
                      seoFilename
                    )}&isNew=true&validateBinary=true`;
                
                    const formDataToSend = new FormData();
                    formDataToSend.append("fileBinary", file); // Attach the file
                
                    const response = await fetch(uploadUrl, {
                      method: "PUT",
                      headers: {
                        Authorization: token ? `Bearer ${token}` : "", // Use your token
                        accept: "application/json",
                      },
                      body: formDataToSend, // Send the FormData object
                    });
                
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                
                    const data = await response.json();
                    console.log("data id uploaded successfully:", data.id);
                    
                    

                    console.log('Form data before submission:', JSON.stringify(formData));
                    const manufacturerId = Array.isArray(manufacturerData) ? manufacturerData[0]?.id : manufacturerData?.id;
                    if (!manufacturerId) {
                        console.error('manufacturer ID is missing.');
                        return;
                    }
            
                    console.log("manufacturer ID for this is:", manufacturerId);
            
                    // Fetch manufacturer details
                    const responses = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/manufacturer/GetById/${manufacturerId}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : '',
                        },
                    });
            
                    if (!responses.ok) {
                        throw new Error(`HTTP error! Status: ${responses.status} - ${responses.statusText}`);
                    }            
                    const datas = await responses.json();
                    //console.log('Fetched manufacturer data:', data);            
                    // Update data fields to match formData                  
                    datas.name = formData.name;
                    datas.description = formData.description;
                    
                    datas.parent_manufacturer_id = selectedmanufacturer?.[0] ? Number(selectedmanufacturer[0]) : 0;
    

                    datas.parent_manufacturer_name = selectedmanufacturerName;
                    datas.picture_id= data.id;


                    console.log('Updated data before submitted :', datas); 
                    // Call the Update API
                    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/manufacturer/Update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : '',
                        },
                        body: JSON.stringify(datas),
                    });    
                    if (!updateResponse.ok) {
                        throw new Error(`Update API error! Status: ${JSON.stringify(updateResponse.status)} - ${ updateResponse} - ${updateResponse.statusText}`);
                    }    
                    const updateData = await updateResponse.json();
                   
                 }
                 catch (error) {
                    console.error('Error during submission:',  error);
                } finally {
                    handleClose(); // Close the modal after all operations
                }
                 location.reload();  
        }
        else
        {        
        try {
            console.log('Form data before submission:', JSON.stringify(formData));
            const manufacturerId = Array.isArray(manufacturerData) ? manufacturerData[0]?.id : manufacturerData?.id;
            if (!manufacturerId) {
                console.error('manufacturer ID is missing.');
                return;
            }    
            console.log("manufacturer ID for this is:", manufacturerId);    
            // Fetch manufacturer details
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/manufacturer/GetById/${manufacturerId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }    
            const data = await response.json();
            //console.log('Fetched manufacturer data:', data);    
            // Update data fields to match formData
          
            data.name = formData.name;
            data.description = formData.description;
            
            data.parent_manufacturer_id = selectedmanufacturer?.[0] ? Number(selectedmanufacturer[0]) : 0;
       
            data.parent_manufacturer_name = selectedmanufacturerName;
              
            console.log('Updated data before submitted :', data); 
            // Call the Update API
            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/manufacturer/Update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(data),
            });    
            if (!updateResponse.ok) {
                throw new Error(`Update API error! Status: ${JSON.stringify(updateResponse.status)} - ${ updateResponse} - ${updateResponse.statusText}`);
            }    
            const updateData = await updateResponse.json();
           // console.log('Update API response:', updateData);    
        } catch (error) {
            console.error('Error during submission:',  error);
        } finally {
            handleClose(); // Close the modal after all operations
        }
        handleClose(); // Close the modal after submit
        location.reload();  
       }
    };
       
    const handlemanufacturerChange = (event: any) => {
        const selectedmanufacturerId = event.target.value;
        setmanufacturerId(selectedmanufacturerId);  // Update the selected manufacturer
        setSelectedmanufacturer([selectedmanufacturerId]);       

    const selectedId = event.target.value;
    const selectedmanufacturer = categories.find(manufacturer => manufacturer.id === (typeof manufacturer.id === 'number' ? Number(selectedId) : selectedId));

      setSelectedmanufacturerName(selectedmanufacturer ? selectedmanufacturer.name : '');     

      }; 

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit manufacturer</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDepartment">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                            as="select"
                            name="department"
                            value=""
                            onChange={handleInputChange}
                        >
                            <option value="">Select Department</option>                            
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formmanufacturerName">
                        <Form.Label>
                            manufacturer Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formmanufacturerCode">
                        <Form.Label>manufacturer Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="catCode"
                            value=""
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formParentmanufacturer">
                        <Form.Label>Parent manufacturer</Form.Label>
                        {/* <Form.Control
                            as="select"
                            name="parentmanufacturer"
                            onChange={handleInputChange}
                        >
                            <option value="">Select Parent manufacturer</option>
                            <option value="185772">Parent manufacturer 1</option>
                        </Form.Control> */}
                        <select
                                     className="form-control m-select2"
                                     id="parent_manufacturer_name"
                                     name="parent_manufacturer_name"
                                     onChange={handlemanufacturerChange}
                                     value={selectedmanufacturer[0]}
                                     data-fv-field="parent_manufacturer_name"
                        >
                            
                                     <option value="">Select manufacturer</option>

                                     {categories.map(manufacturer => (
                                        <option key={manufacturer.id} value={manufacturer.id}>
                                                    {manufacturer.name}
                                        </option>
                             ))}
                        </select>
                    </Form.Group>
                             
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>


                 <Form.Group controlId="formImageUpload">
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange} // New handler for file selection
                                />
                    </Form.Group>

                    <Form.Group controlId="formFile">
                        <Form.Label>Upload Image</Form.Label>                       
                        <div className="mt-3">
                            <img
                                src={formData.image_url}
                                alt="Image Preview"
                                width="100"
                                height="100"
                            />
                        </div>
                    </Form.Group>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button type="submit" variant="primary" onClick={handleSubmit} >
                        Save
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BrandEditModal;
