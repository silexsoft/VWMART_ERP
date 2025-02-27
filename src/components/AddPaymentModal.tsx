import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "@/app/context/AuthContext";

interface AddPaymentModalProps {
  show: boolean;
  handleClose: () => void;
}

interface Category {
  id: string;
  name: string;
}

const AddPaymentNewModal: React.FC<AddPaymentModalProps> = ({
  show,
  handleClose,
}) => {
  const [formData, setFormData] = useState({
    VoucherType: "",
    PaymentType: "",
    PartyName: "",
    Sales: "",
    PaymentMode: "",
    TotalPayment: "",
    PaidAmount: "",
    PendingAmount: "",
    Kasar: "",
    Amount: "",
    Remark: "",
    CashierID: "",
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
      },
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

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue)) {
      setFormData(newValue);
    }
  };

  // Function to prevent invalid key presses
  const handleKeyDown = (event: any) => {
    const invalidKeys = [69, 107, 109, 189, 187, 190, 110]; // e, +, -, ., numpad .
    if (invalidKeys.includes(event.keyCode)) {
      event.preventDefault();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = event.target.value;
    setSelectedCategoryId(selectedId);

    const selectedCategory = categories.find(
      (category) => category.id === selectedId,
    );
    setSelectedCategoryName(selectedCategory ? selectedCategory.name : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // if (formData.image_file) {
      //   try {
      //     const file = formData.image_file;
      //     const mimeType = file.type; // Get the MIME type (e.g., "image/png")
      //     const seoFilename = file.name.split(".")[0]; // Get the filename without extension
      //     const uploadUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Picture/InsertPicture?mimeType=${encodeURIComponent(
      //       mimeType,
      //     )}&seoFilename=${encodeURIComponent(
      //       seoFilename,
      //     )}&isNew=true&validateBinary=true`;
      //     const formDataToSend = new FormData();
      //     formDataToSend.append("fileBinary", file); // Attach the file
      //     const response = await fetch(uploadUrl, {
      //       method: "PUT",
      //       headers: {
      //         Authorization: token ? `Bearer ${token}` : "", // Use your token
      //         accept: "application/json",
      //       },
      //       body: formDataToSend, // Send the FormData object
      //     });
      //     if (!response.ok) {
      //       throw new Error(`HTTP error! Status: ${response.status}`);
      //     }
      //     const data = await response.json();
      //     console.log("data id uploaded successfully:", data.id);
      //     const newCategoryData = {
      //       ...formData,
      //       parent_category_id: selectedCategoryId || null,
      //       published: true,
      //       picture_id: data.id, // Use data.id here
      //     };
      //     console.log(
      //       "before  category created successfully:",
      //       newCategoryData,
      //     );
      //     const responses = await fetch(
      //       `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/Create`,
      //       {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //           Authorization: token ? `Bearer ${token}` : "",
      //         },
      //         body: JSON.stringify(newCategoryData),
      //       },
      //     );
      //     if (!responses.ok) {
      //       throw new Error(`Error creating category: ${responses.statusText}`);
      //     }
      //     const createdCategory = await responses.json();
      //     console.log("New category created successfully:", createdCategory);
      //     location.reload();
      //     // Close the modal after successful submission
      //     handleClose();
      //   } catch (error) {
      //     console.error("Error uploading image:", error);
      //     alert("Failed to upload the image.");
      //   }
      // } else {
      //   const newCategoryData = {
      //     ...formData,
      //     parent_category_id: selectedCategoryId || null,
      //     published: true,
      //   };
      //     console.log("before  category created successfully:", newCategoryData);
      //     const response = await fetch(
      //       `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/Create`,
      //       {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //           Authorization: token ? `Bearer ${token}` : "",
      //         },
      //         body: JSON.stringify(newCategoryData),
      //       },
      //     );
      //     if (!response.ok) {
      //       throw new Error(`Error creating category: ${response.statusText}`);
      //     }
      //     const createdCategory = await response.json();
      //     console.log("New category created successfully:", createdCategory);
      //     location.reload();
      //     // Close the modal after successful submission
      //     handleClose();
      //   }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <Modal className="modal-xl" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row" id="addpayment">
            <div className="form-group row Voucher">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Select Voucher Type
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12 inVoucher">
                <div className="form-group row mb-0">
                  <div className="col input-group p-0">
                    <div className="m-widget4">
                      <label className="m-radio m-radio--solid m-radio--brand m-widget4__title mb-0">
                        <input
                          type="radio"
                          value={formData.VoucherType}
                          className="form-control form-control-sm"
                          name="sales"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <span>Sales</span>
                      </label>
                    </div>
                  </div>
                  <div className="col input-group p-0">
                    <div className="m-widget4">
                      <label className="m-radio m-radio--solid m-radio--brand m-widget4__title mb-0">
                        <input
                          type="radio"
                          value={formData.VoucherType}
                          className="form-control form-control-sm"
                          name="Purchase"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <span>Purchase</span>
                      </label>
                    </div>
                  </div>
                  <div className="col input-group p-0">
                    <div className="m-widget4">
                      <label className="m-radio m-radio--solid m-radio--brand m-widget4__title mb-0">
                        <input
                          type="radio"
                          value={formData.VoucherType}
                          className="form-control form-control-sm"
                          name="Expense"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <span>Expense</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group row payment">
              <label className="col-lg-12 col-md-12 col-sm-12">
                Select Payment Type
              </label>
              <div className="col-lg-12 col-md-12 col-sm-12 inpayment">
                <div className="form-group row mb-0">
                  <div className="col input-group p-0">
                    <div className="m-widget4">
                      <label className="m-radio m-radio--solid m-radio--brand m-widget4__title mb-0">
                        <input
                          type="radio"
                          value={formData.PaymentType}
                          className="form-control form-control-sm"
                          name="AdvancePayment "
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <span>Advance Payment </span>
                      </label>
                    </div>
                  </div>
                  <div className="col input-group p-0">
                    <div className="m-widget4">
                      <label className="m-radio m-radio--solid m-radio--brand m-widget4__title mb-0">
                        <input
                          type="radio"
                          value={formData.PaymentType}
                          className="form-control form-control-sm"
                          name="AgainstBill"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <span>Against Bill</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group row dropdwons">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="col-6 form-group">
                  <label className="mb-0">
                    Select Party Name<small className="text-danger">*</small>
                  </label>
                  <Form.Group controlId="formPartyName">
                    <select
                      className="form-control m-select2"
                      id="PartyName"
                      name="PartyName"
                    >
                      <option value="">Select Party</option>                      
                    </select>
                  </Form.Group>
                </div>

                <div className="col-6 form-group">
                  <label className="mb-0">
                    Select Sales<small className="text-danger">*</small>
                  </label>
                  <Form.Group controlId="formSales">
                    <select
                      className="form-control m-select2"
                      id="Sales"
                      name="Sales"
                    >
                      <option value="">Select Sales</option>                      
                    </select>
                  </Form.Group>
                </div>

                <div className="col-6 form-group">
                  <label className="mb-0">
                    Select Party Name<small className="text-danger">*</small>
                  </label>
                  <Form.Group controlId="formPaymentModeName">
                    <select
                      className="form-control m-select2"
                      id="PaymentModeName"
                      name="PaymentModeName"
                    >
                      <option value="">Payment Mode</option>                      
                    </select>
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-md-12 col-sm-12 totalpayment">
              <div className="form-group row mb-0">
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <div className="form-group row m--margin-top-5">
                    <label className="col-md-12">Total Payment</label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <i
                              className="fa fa-inr currency_style"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                        <Form.Group controlId="formTotalPayment">
                          <Form.Control
                            type="text"
                            name="TotalPayment"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 paid">
                  <div className="form-group row m--margin-top-5">
                    <label className="col-md-12">Paid Amount</label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <i
                              className="fa fa-inr currency_style"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                        <Form.Group controlId="formPaidAmount">
                          <Form.Control
                            type="text"
                            name="PaidAmount"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 pending">
                  <div className="form-group row m--margin-top-5">
                    <label className="col-md-12">Pending Amount</label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <i
                              className="fa fa-inr currency_style"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                        <Form.Group controlId="formPendingAmount">
                          <Form.Control
                            type="text"
                            name="PendingAmount"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-md-12 col-sm-12 kasar">
              <div className="form-group row mb-0">
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <div className="form-group row m--margin-top-5">
                    <label className="col-md-12">Kasar</label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <i
                              className="fa fa-inr currency_style"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                        <Form.Group controlId="formKasar">
                          <Form.Control
                            type="text"
                            name="Kasar"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 amt">
                  <div className="form-group row m--margin-top-5">
                    <label className="col-md-12">Amount</label>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <i
                              className="fa fa-inr currency_style"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                        <Form.Group controlId="formAmount">
                          <Form.Control
                            type="text"
                            name="Amount"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-md-12 col-sm-12 remark">
              <div className="form-group row mb-0">
                <label className="col-md-12">Remark</label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group">                    
                    <Form.Group controlId="formRemark">
                      <Form.Control
                        type="textarea"
                        aria-rowspan={3}
                        name="Remark"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>

<div className="col-lg-12 col-md-12 col-sm-12 bttnsave">
          <Button type="submit" variant="primary">
            Save
          </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPaymentNewModal;
