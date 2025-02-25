import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "@/app/context/AuthContext";

interface CashRegisterModalProps {
  show: boolean;
  handleClose: () => void;
}

interface Category {
  id: string;
  name: string;
}

const CashRegisterNewModal: React.FC<CashRegisterModalProps> = ({
  show,
  handleClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    //image_url: "",
    image_file: null as File | null,
    OpeningCash: "",
    CashPayment: "",
    ChequePayment: "",
    CardPayment: "",
    BankTransfer: "",
    UPIPayment: "",
    WalletPayment: "",
    SalesReturn: "",
    Refund: "",
    CreditApplied: "",
    PayLater: "",
    TotalSales: "",
    Expense: "",
    TotalPhysicalDrawer: "",
    ClosingNote: "",
    Rs1: "",
    Rs2: "",
    Rs5: "",
    Rs10: "",
    Rs20: "",
    Rs50: "",
    Rs100: "",
    Rs200: "",
    Rs500: "",
    BankTransferAmount: "",
    CashFlow: "",
    TotalCashLeft: "",
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
      if (formData.image_file) {
        try {
          const file = formData.image_file;
          const mimeType = file.type; // Get the MIME type (e.g., "image/png")
          const seoFilename = file.name.split(".")[0]; // Get the filename without extension

          const uploadUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Picture/InsertPicture?mimeType=${encodeURIComponent(
            mimeType,
          )}&seoFilename=${encodeURIComponent(
            seoFilename,
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

          console.log(
            "before  category created successfully:",
            newCategoryData,
          );

          const responses = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/Create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify(newCategoryData),
            },
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
      } else {
        const newCategoryData = {
          ...formData,
          parent_category_id: selectedCategoryId || null,
          published: true,
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
          },
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
    <Modal className="modal-xl" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Current Register</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-4">
              <Form.Group controlId="formOpeningCash">
                <Form.Label>Opening Cash</Form.Label>
                <Form.Control
                  type="text"
                  name="OpeningCash"
                  value={formData.OpeningCash}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCashPayment">
                <Form.Label>Cash Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="CashPayment"
                  value={formData.CashPayment}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formChequePayment">
                <Form.Label>Cheque Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="ChequePayment"
                  value={formData.ChequePayment}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCardPayment">
                <Form.Label>Card Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="CardPayment"
                  value={formData.CardPayment}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formBankTransfer">
                <Form.Label>Bank Transfer</Form.Label>
                <Form.Control
                  type="text"
                  name="BankTransfer"
                  value={formData.BankTransfer}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formUPIPayment">
                <Form.Label>UPI Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="UPIPayment"
                  value={formData.UPIPayment}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formWalletPayment">
                <Form.Label>Wallet Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="WalletPayment"
                  value={formData.WalletPayment}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formUPIPayment">
                <Form.Label>UPI Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="UPIPayment"
                  value={formData.UPIPayment}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formSalesReturn">
                <Form.Label>Sales Return</Form.Label>
                <Form.Control
                  type="text"
                  name="SalesReturn"
                  value={formData.SalesReturn}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formRefund">
                <Form.Label>Refund</Form.Label>
                <Form.Control
                  type="text"
                  name="Refund"
                  value={formData.Refund}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCreditApplied">
                <Form.Label>Credit Applied</Form.Label>
                <Form.Control
                  type="text"
                  name="CreditApplied"
                  value={formData.CreditApplied}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formPayLater">
                <Form.Label>Pay Later</Form.Label>
                <Form.Control
                  type="text"
                  name="PayLater"
                  value={formData.PayLater}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formExpense">
                <Form.Label>Expense</Form.Label>
                <Form.Control
                  type="text"
                  name="Expense"
                  value={formData.Expense}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formPurchasePayment">
                <Form.Label>Purchase Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="PurchasePayment"
                  value={formData.PayLater}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formTotalSales">
                <Form.Label>Total Sales</Form.Label>
                <Form.Control
                  type="text"
                  name="TotalSales"
                  value={formData.TotalSales}
                  readOnly
                />
              </Form.Group>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-5">
              <div className="table-responsive">
                <table className="table-sm table-bordered table-striped table">
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>Nos</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          1
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(1)" name="1rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"/> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs1}
                          className="form-control form-control-sm"
                          name="1rs"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      </td>
                      <td width="35%" className="text-right" id="1rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          2
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(2)" name="2rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs2}
                          className="form-control form-control-sm"
                          name="2rs"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      </td>
                      <td width="35%" className="text-right" id="2rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          5
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(5)" name="5rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs5}
                          className="form-control form-control-sm"
                          name="5rs"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      </td>
                      <td width="35%" className="text-right" id="5rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          10
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(10)" name="10rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs10}
                          className="form-control form-control-sm"
                          name="Rs10"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      </td>
                      <td width="35%" className="text-right" id="10rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          20
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(20)" name="20rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs20}
                          className="form-control form-control-sm"
                          name="Rs20"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />{" "}
                      </td>
                      <td width="35%" className="text-right" id="20rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          50
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(50)" name="50rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs50}
                          className="form-control form-control-sm"
                          name="Rs50"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      </td>
                      <td width="35%" className="text-right" id="50rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          100
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(100)" name="100rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs100}
                          className="form-control form-control-sm"
                          name="Rs100"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      </td>
                      <td width="35%" className="text-right" id="100rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          200
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(200)" name="200rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs200}
                          className="form-control form-control-sm"
                          name="Rs200"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />{" "}
                      </td>
                      <td width="35%" className="text-right" id="200rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <td width="20%" className="">
                        <div className="">
                          <i
                            className="fa fa-inr currency_style"
                            aria-hidden="true"
                          ></i>
                          500
                        </div>
                      </td>
                      <td width="25%" className="">
                        {/* <input type="number" min="0" value="0" className="form-control form-control-sm" onchange="setCurencyWiseAmount(500)" name="500rs" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 107 || event.keyCode == 109 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 190 || event.keyCode == 110 ? false : true"> */}
                        <input
                          type="number"
                          min="0"
                          value={formData.Rs500}
                          className="form-control form-control-sm"
                          name="Rs500"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />{" "}
                      </td>
                      <td width="35%" className="text-right" id="500rsAmount">
                        0
                      </td>
                    </tr>
                    <tr className="">
                      <th style={{ width: "20%" }} className="">
                        <div className="">&nbsp;</div>
                      </th>
                      <th style={{ width: "20%" }}>Total</th>
                      <th
                        style={{ width: "35%" }}
                        className="text-right"
                        id="finalCurrencyTotal"
                      ></th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3">
              <Form.Group controlId="formBankAccount">
                <Form.Label>Bank Account</Form.Label>
                <select
                  className="form-control m-select2"
                  id="BankAccount"
                  name="BankAccount"
                  // onChange={handleBankAccountChange}
                  // value={formData.BankAccount}
                >
                  <option value="">Select Bank</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Form.Group>

              <Form.Group controlId="formBankTransferAmount">
                <Form.Label>Bank Transfer</Form.Label>
                <Form.Control
                  type="text"
                  name="BankTransferAmount"
                  onChange={handleChange}
                  //value={formData.BankTransferAmount}
                />
              </Form.Group>

              <Form.Group controlId="formCashFlow">
                <Form.Label>Cash Flow</Form.Label>
                <Form.Control
                  type="text"
                  name="CashFlow"
                  onChange={handleChange}
                  //value={formData.CashFlow}
                />
              </Form.Group>

              <Form.Group controlId="formTotalCashLeft">
                <Form.Label>Total Cash Left In Drawer</Form.Label>
                <Form.Control
                  type="text"
                  name="TotalCashLeft"
                  onChange={handleChange}
                  // value={formData.TotalCashLeft}
                />
              </Form.Group>

              <Form.Group controlId="formPhysicalDrawer">
                <Form.Label>Physical Drawer*</Form.Label>
                <Form.Control
                  type="text"
                  name="TotalPhysicalDrawer"
                  value={formData.TotalPhysicalDrawer}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formClosingNote">
                <Form.Label>Closing Note</Form.Label>
                <Form.Control
                  type="textarea"
                  aria-rowspan={3}
                  name="ClosingNote"
                  value={formData.ClosingNote}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>

          <Button type="submit" variant="primary">
            Close Register
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CashRegisterNewModal;
