import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "@/app/context/AuthContext";

interface CategoryNewModalProps {
  show: boolean;
  handleClose: () => void;
}

interface Category {
  id: string;
  name: string;
}

const CategoryNewModal: React.FC<CategoryNewModalProps> = ({ show, handleClose }) => {

    

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    //image_url: "",
    image_file: null as File | null    
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");  
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const { token } = useAuth();
   
  useEffect(() => {
    // Fetch all categories for the dropdown
     
    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/GetAll?storeId=0&pageIndex=0&pageSize=2147483647&showHidden=false`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setCategories(data.items || []))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [token]);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      // Optional: Upload the file to a server or create an object URL
      const fileUrl = URL.createObjectURL(file); // Temporary local URL for preview
      setFormData((prevData) => ({
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

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedCategoryId(selectedId);

    const selectedCategory = categories.find((category) => category.id === selectedId);
    setSelectedCategoryName(selectedCategory ? selectedCategory.name : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

        if (formData.image_file)
        {
            try {
                const file = formData.image_file;
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
                

                const newCategoryData = {
                    ...formData,
                    parent_category_id: selectedCategoryId || null,
                    published: true,
                    picture_id: data.id, // Use data.id here
                  };

                  console.log("before  category created successfully:", newCategoryData);

                  const responses = await fetch(
                    `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/Create`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                      },
                      body: JSON.stringify(newCategoryData),
                    }
                  );
            
                  if (!responses.ok) {
                    throw new Error(`Error creating category: ${responses.statusText}`);
                  }            
                  const createdCategory = await responses.json();
                  console.log("New category created successfully:", createdCategory);
                  location.reload();
                  // Close the modal after successful submission
                  handleClose();
              } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload the image.");
              }
        } 
        else
        { 

      const newCategoryData = {
        ...formData,
        parent_category_id: selectedCategoryId || null,
        published: true
       
      };

      console.log("before  category created successfully:", newCategoryData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/Create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(newCategoryData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error creating category: ${response.statusText}`);
      }

      const createdCategory = await response.json();
      console.log("New category created successfully:", createdCategory);
      location.reload();
      // Close the modal after successful submission
      handleClose();
    }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Category</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategoryName">
            <Form.Label>
              Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
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

          <Form.Group controlId="formParentCategory">
            <Form.Label>Parent Category</Form.Label>
                       <select
                                     className="form-control m-select2"
                                     id="parent_category_name"
                                     name="parent_category_name"
                                     onChange={handleCategoryChange}
                                     value={selectedCategoryId}
                                     data-fv-field="parent_category_name"
                        >                            
                                     <option value="">Select Category</option>
                                     {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                                    {category.name}
                                        </option>
                             ))}
                        </select>
            {/* <Form.Control
              as="select"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
            >
              <option value="">Select Parent Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control> */}
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


          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryNewModal;
