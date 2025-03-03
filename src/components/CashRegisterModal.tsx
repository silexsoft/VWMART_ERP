import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "@/app/context/AuthContext";
import { pOSCashRegisterCreate } from '@/utils/cashServices';
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
    Id:0,
    name: "",
    description: "",
    OpeningCash: 0,
    CashPayment: 0,
    ChequePayment: 0,
    CardPayment: 0,
    BankTransfer: 0,
    BankTransferAmount: 0,
    BankAccount:"",
    UPIPayment: 0,
    WalletPayment: 0,
    SalesReturn: 0,
    Refund: 0,
    CreditApplied: 0,
    PayLater:0,
    TotalSales: 0,
    PurchasePayment:0,
    Expense: 0,
    CashFlow: 0,
    TotalCashLeft: 0,
    PhysicalDrawer: 0,
    ClosingNote: "",
    CashierID:0,
    Rs1: 0,
    Rs2: 0,
    Rs5: 0,
    Rs10: 0,
    Rs20: 0,
    Rs50: 0,
    Rs100: 0,
    Rs200: 0,
    Rs500: 0
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



  const handleChange = (event: any) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue)) {
      //setFormData(newValue);
      setFormData((prevData) => ({
        ...prevData,
        BankAccount: newValue,
      }));
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
    console.log(name +"="+ value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      //location.reload();
      // Close the modal after successful submission
      //handleClose();

      pOSCashRegisterCreate(token,formData).then((createResponse: any) => {
        console.log(createResponse);
      });
    } catch (error) {
      console.error("Error uploading image:", error);
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
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCashPayment">
                <Form.Label>Cash Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="CashPayment"
                  value={formData.CashPayment}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formChequePayment">
                <Form.Label>Cheque Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="ChequePayment"
                  value={formData.ChequePayment}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCardPayment">
                <Form.Label>Card Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="CardPayment"
                  value={formData.CardPayment}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formBankTransfer">
                <Form.Label>Bank Transfer</Form.Label>
                <Form.Control
                  type="text"
                  name="BankTransfer"
                  value={formData.BankTransfer}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formUPIPayment">
                <Form.Label>UPI Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="UPIPayment"
                  value={formData.UPIPayment}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formWalletPayment">
                <Form.Label>Wallet Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="WalletPayment"
                  value={formData.WalletPayment}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formUPIPayment">
                <Form.Label>UPI Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="UPIPayment"
                  value={formData.UPIPayment}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formSalesReturn">
                <Form.Label>Sales Return</Form.Label>
                <Form.Control
                  type="text"
                  name="SalesReturn"
                  value={formData.SalesReturn}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formRefund">
                <Form.Label>Refund</Form.Label>
                <Form.Control
                  type="text"
                  name="Refund"
                  value={formData.Refund}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCreditApplied">
                <Form.Label>Credit Applied</Form.Label>
                <Form.Control
                  type="text"
                  name="CreditApplied"
                  value={formData.CreditApplied}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formPayLater">
                <Form.Label>Pay Later</Form.Label>
                <Form.Control
                  type="text"
                  name="PayLater"
                  value={formData.PayLater}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formExpense">
                <Form.Label>Expense</Form.Label>
                <Form.Control
                  type="text"
                  name="Expense"
                  value={formData.Expense}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formPurchasePayment">
                <Form.Label>Purchase Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="PurchasePayment"
                  value={formData.PayLater}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formTotalSales">
                <Form.Label>Total Sales</Form.Label>
                <Form.Control
                  type="text"
                  name="TotalSales"
                  value={formData.TotalSales}
                  onChange={handleInputChange}
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
                          name="Rs1"
                          onChange={handleInputChange}
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
                          name="Rs2"
                          onChange={handleInputChange}
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
                          name="Rs5"
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                  value={formData.BankAccount}
                  onChange={handleChange}
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
                  onChange={handleInputChange}
                  value={formData.BankTransferAmount}
                />
              </Form.Group>

              <Form.Group controlId="formCashFlow">
                <Form.Label>Cash Flow</Form.Label>
                <Form.Control
                  type="text"
                  name="CashFlow"
                  onChange={handleInputChange}
                  value={formData.CashFlow}
                />
              </Form.Group>

              <Form.Group controlId="formTotalCashLeft">
                <Form.Label>Total Cash Left In Drawer</Form.Label>
                <Form.Control
                  type="text"
                  name="TotalCashLeft"
                  onChange={handleInputChange}
                  value={formData.TotalCashLeft}
                />
              </Form.Group>

              <Form.Group controlId="formPhysicalDrawer">
                <Form.Label>Physical Drawer*</Form.Label>
                <Form.Control
                  type="text"
                  name="TotalPhysicalDrawer"
                  value={formData.PhysicalDrawer}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formClosingNote">
                <Form.Label>Closing Note</Form.Label>
                <Form.Control
                  type="textarea"
                  aria-rowspan={3}
                  name="ClosingNote"
                  value={formData.ClosingNote}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>
          </div>
<div className="col-lg-12 col-md-12 col-sm-12 text-center">
<Button type="submit" variant="primary">
            Close Register
          </Button>
</div>
        
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CashRegisterNewModal;
