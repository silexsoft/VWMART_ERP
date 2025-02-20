"use client";
import PosLayout from "@/components/Layouts/PosLayout";
import { saveProducts } from '@/utils/productService';
import { saveCustomers } from '@/utils/customerService';
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import POSProductSearchBox from '@/components/POSProductSearchBox';
import POSCustomerSearchBox from '@/components/POSCustomerSearchBox';
import { Modal, Button, Alert } from "react-bootstrap";
import { guestLogin } from "@/utils/posService";
import { string } from 'yup';
import { set } from "date-fns";
const NewPosOrder = () => {
    const { token, logout, warehouseId } = useAuth();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [isOpen, setIsOpen] = useState(false)
    const [qtyUpdateIndex, setQtyupdateIndex] = useState(0)
    const [result, setResult] = useState('');
    const [remark, setRemark] = useState("");
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalMRP, setTotalMRP] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discounts, setDiscounts] = useState({});
    const [totaldiscount, setTotalDiscount] = useState(0);
    const [guesttoken, setGuestToken] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [holdBills, setHoldBills] = useState([]);

    // Handle discount input change
    const handleDiscountChange = (index, value) => {
        const updatedDiscounts = { ...discounts, [index]: value };
        setDiscounts(updatedDiscounts);
        setTotalDiscount(Object.values(updatedDiscounts).reduce((a, b) => a + b, 0));
        calculateTotals();
    };

    /**
     * Handles button click event for the calculator.
     * Updates the result based on the input value.
     * @param {string} value - The button value clicked on the calculator.
     */
    const calculator_handleClick = (value) => {
        if (value === 'C') {
            setResult('');
        } else if (value.indexOf("+") > -1) {
            console.log(value.replace("+", ""));
            setResult(parseFloat(result) + parseInt(value.replace("+", "")));
        }
        else if (value === '') {
            setResult('0');
        }
        else {

            setResult(parseFloat(result + value));
        }
    };

    /**
    * Updates the quantity of the selected product based on calculator input.
    * Closes the modal after updating.
    */
    const popupModel_UpdateQty = () => {
        const next_selectedProducts = [...selectedProducts];
        next_selectedProducts[qtyUpdateIndex].qty = result;
        setSelectedProducts(next_selectedProducts);
        setIsOpen(false);
    }


    useEffect(() => {
        /**
         * Fetches products from the API and saves them.
         */
        let pageIndex = 1;
        const fetchProducts = async () => {
            const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=${pageIndex - 1}
      &pageSize=100`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            const products = await response.json();
            pageIndex++;
            saveProducts(products.items);
        };

        /**
       * Fetches customers from the API and saves them.
       */
        const fetchCustomers = async () => {
            const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Customer/GetAll`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",

                }
            });
            const customers = await response.json();
            pageIndex++;
            saveCustomers(customers.items);
        };



        fetchProducts();
        fetchCustomers();
    }, []);

    /*Function to calculate totals*/
    const calculateTotals = () => {
        let quantity = 0;
        let mrp = 0;
        let amount = 0;

        selectedProducts.forEach(product => {
            const qty = product.qty ? parseInt(product.qty) : 1;
            quantity += qty;
            mrp += product.price * qty;
            amount += (product.price * qty) - totaldiscount; // Adjust if discounts/taxes are applied
        });

        setTotalQuantity(quantity);
        setTotalMRP(mrp);
        setTotalAmount(amount);
    };

    /*Trigger Calculation When selectedProducts Changes*/
    useEffect(() => {
        calculateTotals();
    }, [selectedProducts]);

    /**
 * Removes a product from the selected products list.
 * @param {string} id - The id of the product to be removed.
 */
    const removeProduct = (id) => {
        setSelectedProducts(selectedProducts.filter((product) => product.id !== id));
    };



    /**
     * Handles the hold order button click.
     * If a customer is not selected, a guest login is done and the token is stored.
     * The selected products are cleared and the hold order API is called.
     */
    const handleHoldClick = async () => {
        let authToken = token;

        try {
            // If a customer is not selected, do a guest login and store the token
            if (!selectedCustomer) {
                authToken = await guestLogin();
                setGuestToken(authToken); // Store the token for future use
            }

            // Clear the selected products
            setSelectedCustomer(null);
            setSelectedProducts([]);

            // Call the hold order API
            //const holdResponse = await holdOrder(authToken, selectedCustomer);
            //console.log("Hold API Response:", holdResponse);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    /**
     * Fetches the hold bills from the API.
     * The response is expected to be an array of hold bills.
     * If the response is successful, the hold bills are stored in the component state.
     * If the response fails, an error is logged to the console.
     */
    const getholdbills = async () => {
        try {
            // const response = await fetch('/api/get-hold-bills'); // 
            // const data = await response.json();
            // setHoldBills(data);
            setIsSidebarOpen(true); // Open the sidebar after fetching data
        } catch (error) {
            // console.error("Error fetching hold bills:", error);
        }
    };

    return (
        <PosLayout>
            <div className="flex flex-col pos-left">
                <div className="row">
                    <div className="col-md-4">
                        <POSProductSearchBox setSelectedProducts={setSelectedProducts} />
                    </div>
                    <div className="col-md-4">
                        <POSCustomerSearchBox setSelectedCustomer={setSelectedCustomer} />
                    </div>
                </div>
                {/* Second Row: Product Grid */}
                <div className="row pos-left-middle">
                    <div className="col-12">
                        <div className="p-2 border rounded bg-white">
                            {selectedProducts.length > 0 ? (
                                <table className="w-full border-collapse border">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border px-4 py-2">ItemCode</th>
                                            <th className="border px-4 py-2">Product</th>
                                            <th className="border px-4 py-2">Qty</th>
                                            <th className="border px-4 py-2">MRP</th>
                                            <th className="border px-4 py-2">Discount</th>
                                            <th className="border px-4 py-2">Unit Cost</th>
                                            <th className="border px-4 py-2">Net Amount</th>
                                            <th className="border px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProducts.map((product, index) => {
                                            const qty = product.qty ?? 1;
                                            const discount = parseFloat(discounts[index] || 0);
                                            const unitCost = product.price - discount;
                                            const netAmount = unitCost * qty; return (
                                                <tr key={product.id}>
                                                    <td className="border px-4 py-2">{product.sku}</td>
                                                    <td className="border px-4 py-2">{product.name}</td>
                                                    <td className="border px-4 py-2"> <input type="number"
                                                        readOnly="readonly"
                                                        id={`qty${index}`}
                                                        name={`qty${index}`}
                                                        value={product.qty == undefined ? 1 : product.qty}
                                                        onClick={() => { setQtyupdateIndex(index), setIsOpen(true), setResult(product.qty == undefined ? 1 : product.qty) }} ></input></td>
                                                    <td className="border px-4 py-2">${product.price}</td>
                                                    <td className="border px-4 py-2"><input
                                                        type="number"
                                                        value={parseFloat(discounts[index] || 0)}
                                                        onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                        className="w-16 text-center border rounded"
                                                    /></td>
                                                    <td className="border px-4 py-2">${unitCost}</td>
                                                    <td className="border px-4 py-2">{netAmount}</td>
                                                    <td className="border px-4 py-2 text-center">
                                                        <button
                                                            onClick={() => removeProduct(product.id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No products selected.</p>
                            )}
                        </div>
                    </div>
                    <div className="pos-left-bottom-fixed col-12">
                        <div className="row">
                            <div className="mb-0 form-group kp-remark col-12">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="note"
                                    id="remark"
                                    placeholder="Remarks"
                                    // value={remark}
                                    // onChange={handleRemarkChange}
                                    autoComplete="off"
                                />
                                <small
                                    style={{ display: "none" }}
                                    className="help-block"
                                >
                                    The Remark must be less than 200 characters long
                                </small>
                            </div>

                            {/* Summary Section */}
                            <div className="col-12 mt-1 mb-0 text-center">
                                <div className="invoice-summary bg-white pt-1 pb-1 col-12">
                                    <div className="row">
                                        <div className="col border-right">
                                            <h6 id="total_quantity">{totalQuantity}</h6>
                                            <span style={{ fontWeight: 700 }}>Quantity</span>
                                        </div>
                                        <div className="col border-right">
                                            <h6 id="total_mrp">{totalMRP.toFixed(2)}</h6>
                                            <span style={{ fontWeight: 700 }}>MRP</span>
                                        </div>
                                        <div className="col border-right">
                                            <h6 id="tax_amount">0</h6>
                                            <span style={{ fontWeight: 700 }}>Tax Amount</span>
                                        </div>
                                        <div className="col border-right">
                                            <h6 id="additional_charge_sub_total">0</h6>
                                            <a href="#" style={{ color: "#000" }} className="add-charge-modals" title="Add Additional Charge">
                                                <span style={{ fontWeight: 700 }}>Add.Charges</span>&nbsp;
                                                <i className="fa fa-plus"></i>
                                            </a>
                                        </div>
                                        <div className="col border-right">
                                            <h6 id="total_discount_amount">{totaldiscount}</h6>
                                            <span style={{ fontWeight: 700 }}>Discount</span>
                                        </div>
                                        <div className="col border-right">
                                            <input
                                                type="text"
                                                id="flat_discount"
                                                name="flatDiscount"
                                                // value={flatDiscount}
                                                // onChange={handleFlatDiscountChange}
                                                style={{ maxWidth: "70px" }}
                                                className="form-control form-control-sm"
                                                placeholder="Percentage"
                                            />
                                            <span style={{ fontWeight: 700, marginTop: "6px", display: "block" }}>Flat Discount</span>
                                        </div>
                                        <div className="col border-right">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm text-right"
                                                name="round_off"
                                                id="round_off"
                                                placeholder="Roundoff"
                                                // value={roundOff}
                                                // onChange={handleRoundOffChange}
                                                style={{ marginBottom: ".5rem" }}
                                            />
                                            <span style={{ fontWeight: 700 }}>Round OFF</span>
                                        </div>
                                        <div className="col total">
                                            <h4 style={{ color: "#00a4e5" }} className="mb-0 font-weight-bold" id="net_amount">{totalAmount.toFixed(2)}</h4>
                                            <span style={{ fontSize: "15px", fontWeight: 700, color: "#00a4e5" }}>Amount</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Buttons */}
                            <div className="col-md-12">
                                <div className="footer-button">
                                    <div id="salesbtndiv" className="row">
                                        <button type="button" className="col btn btn-dark"><i className="fa fa-columns" /> Multiple Pay (F12)</button>
                                        <button type="button" className="col btn btn-dark" onClick={handleHoldClick}><i className="fa fa-pause" /> Hold (F6)</button>
                                        <button type="button" className="col btn btn-dark"><i className="fa fa-inr" /> Cash (F4)</button>
                                        <button type="button" className="col btn btn-dark"><i className="fa fa-calendar" /> Pay Later (F11)</button>
                                        <button type="button" className="col btn btn-dark"><i className="fa fa-print" /> Print Invoice</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div className="pos-right">
                <div className="right-sidebar mt-2 mb-2">
                    <div className="right-top">
                        <div className="sidebar-widget text-center">
                            <ul className="mb-0">
                                <li>
                                    <button
                                        title="Hold Bill"
                                        className="flex items-center space-x-2" onClick={getholdbills}
                                    >
                                        <i className="fa fa-pause" aria-hidden="true"></i>
                                        <span>Hold Bill</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        title="Payments"
                                        className="flex flex-col items-center"
                                    >
                                        <img
                                            src="https://cdn.vasyerp.com/assets/images/receipt-icon.svg?v=0.0.1"
                                            style={{ height: "19px", width: "73px", display: "block", marginBottom: "5px" }}
                                            alt="Payments"
                                        />
                                        <span>Payments</span>
                                    </button>
                                </li>
                                <li>
                                    <a href="#" title="Redeem Loyalty" id="redeemLoyalty">
                                        <i className="fa fa-gift" aria-hidden="true"></i> Redeem Loyalty
                                    </a>
                                </li>
                                <li>
                                    <a href="#" id="expense_modal" title="Add Payment">
                                        <i className="fa fa-money" aria-hidden="true"></i> Add Payment
                                    </a>
                                </li>
                                <li>
                                    <a href="#" title="Credit Notes" id="creditnote_view">
                                        <i className="fa fa-sticky-note" aria-hidden="true"></i> Credit Notes
                                    </a>
                                </li>
                                <li>
                                    <a href="#" title="Orders" id="pos-list">
                                        <i className="fa fa-list" aria-hidden="true"></i> Orders
                                    </a>
                                </li>
                                <li>
                                    <a href="#" id="cashcontrol_modal" title="Cash Control" className="flex items-center space-x-2">
                                        <img
                                            src="https://cdn.vasyerp.com/assets/image/Cash-Control.svg"
                                            id="cashControlImage"
                                            alt="Cash Control"
                                            style={{ height: "40px", width: "40px" }}
                                        />
                                        <span>Cash Control</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <div className="right-bottom text-left">
                        <div className="customer-highlights">
                            <h6>Customer Details</h6>
                            <p>
                                <span className="font-weight-bold">Last Visited:</span> <span id="customer_last_transaction_date">-</span>
                            </p>
                            <p>
                                <span className="font-weight-bold">Last Bill Amount:</span>
                                <span id="customer_last_transaction_amount">
                                    <i className="fa fa-inr currency_style" aria-hidden="true"></i>0
                                </span>
                            </p>
                            <p>
                                <span className="font-weight-bold">Most Purchased Item:</span>{" "}
                                <span id="customer_last_transaction_prdouct">0</span>
                            </p>
                            <p>
                                <span className="font-weight-bold" id="closing_value">Due Payment:</span>{" "}
                                <span id="customer_closing">0</span>
                            </p>
                            <p>
                                <span className="font-weight-bold">Total Purchase:</span> <span id="customer_total_purchase">0</span>
                            </p>
                            <p id="loyaltyPointsdiv">
                                <span className="font-weight-bold">Loyalty Points:</span> <span id="customer_loyalty">0</span>
                            </p>
                            <p id="coupon_div" className="m--hide">
                                <span className="font-weight-bold">Coupon:</span>
                                <button className="btn btn-sm btn-dark">
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </button>
                            </p>
                        </div>
                        <div className="customer-highlights">
                            <p>
                                <span className="font-weight-bold">Last Bill No.:</span> <span id="bill_last_no">ORD12360</span>
                            </p>
                            <p>
                                <span className="font-weight-bold">Last Bill Amount:</span>{" "}
                                <span id="billlast_amount">
                                    <i className="fa fa-inr currency_style" aria-hidden="true"></i> 320.00
                                </span>
                            </p>
                            <p>
                                <button type="button" className="col btn btn-sm btn-dark" >
                                    <i className="fa fa-print" aria-hidden="true"></i> Last Bill Print
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={isOpen}>
                <Modal.Body>
                    <div className="calculator">

                        <input type="text" placeholder="Enter Quantity Here..!" className="form-control mb-3"
                            value={result} readOnly />
                        <div className="buttons">
                            <button onClick={() =>
                                calculator_handleClick('1')}>1</button>
                            <button onClick={() =>
                                calculator_handleClick('2')}>2</button>
                            <button onClick={() =>
                                calculator_handleClick('3')}>3</button>
                            <button onClick={() =>
                                calculator_handleClick('+10')}>+10</button>

                            <button onClick={() =>
                                calculator_handleClick('4')}>4</button>
                            <button onClick={() =>
                                calculator_handleClick('5')}>5</button>
                            <button onClick={() =>
                                calculator_handleClick('6')}>6</button>
                            <button onClick={() =>
                                calculator_handleClick('+20')}>+20</button>


                            <button onClick={() =>
                                calculator_handleClick('7')}>7</button>
                            <button onClick={() =>
                                calculator_handleClick('8')}>8</button>
                            <button onClick={() =>
                                calculator_handleClick('9')}>9</button>
                            <button onClick={() =>
                                calculator_handleClick('+50')}>+50</button>


                            <button className="operator" id='clear' onClick={() =>
                                calculator_handleClick('C')}>C</button>
                            <button onClick={() =>
                                calculator_handleClick('0')}>0</button>
                            <button onClick={() =>
                                calculator_handleClick('.')}>.</button>
                            <button onClick={() =>
                                calculator_handleClick('')}><i className='fa fa-close'>X</i></button>



                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => popupModel_UpdateQty()}>
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
            <div className={`right-sidebarpopup mt-2 mb-2 ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="right-top">
                    <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>X</button>
                    <h3>Hold Bills</h3>
                    <ul>
                        {holdBills.length > 0 ? (
                            holdBills.map((bill, index) => (
                                <li key={index}>
                                    <p>Bill No: {bill.billNo}</p>
                                    <p>Amount: ${bill.amount}</p>
                                </li>
                            ))
                        ) : (
                            <p>No hold bills available.</p>
                        )}
                    </ul>
                </div>
            </div>
        </PosLayout>

    )
}
export default NewPosOrder