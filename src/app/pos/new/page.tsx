"use client";
import PosLayout from "@/components/Layouts/PosLayout";
import { saveProducts,getProductById } from '@/utils/productService';
import { saveCustomers,getCustomerById } from '@/utils/customerService';
import { saveHoldBill,getHoldBills,getHoldBillsById,deleteHoldBillByCustomerId,deleteHoldBillByCustomerIdByProductId } from '@/utils/holdbillServices';
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import POSProductSearchBox from '@/components/POSProductSearchBox';
import POSCustomerSearchBox from '@/components/POSCustomerSearchBox';
import { Modal, Button, Alert } from "react-bootstrap";
import { guestLogin, holdOrder, getholdbills } from "@/utils/posService";

const NewPosOrder = () => {
    const { token, logout, warehouseId } = useAuth();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [customerLastOrder, setCustomerLastOrder] = useState();
    const [customers, setCustomers] = useState([]);//used for full custoner information
    const [isOpen, setIsOpen] = useState(false)
    const [qtyUpdateIndex, setQtyupdateIndex] = useState(0)
    const [result, setResult] = useState('');
    const [remark, setRemark] = useState("");
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalMRP, setTotalMRP] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    // const [discounts, setDiscounts] = useState({});
    const [discounts, setDiscounts] = useState(() => new Array(selectedProducts.length).fill(0));
    const [searchCustomerTerm, setSearchCustomerTerm] = useState(''); // User input
    const [totaldiscount, setTotalDiscount] = useState(0);
    const [guesttoken, setGuestToken] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [holdBills, setHoldBills] = useState([]);
    const [discountType, setDiscountType] = useState("amount");

    const handleDiscountChange = (index, value) => {
        setDiscounts((prevDiscounts = []) => {
            if (!selectedProducts[index]) return prevDiscounts;

            let updatedDiscounts = [...prevDiscounts];

            let discountValue = parseFloat(value) || 0;
            if (discountType === "percentage") {
                discountValue = Math.min(100, Math.max(0, discountValue)); // Ensure valid %
                updatedDiscounts[index] = discountValue; // Store percentage, not amount
            } else {
                updatedDiscounts[index] = discountValue; // Store amount directly
            }

            return updatedDiscounts;
        });

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
        if(next_selectedProducts[qtyUpdateIndex].hold_qty != undefined && next_selectedProducts[qtyUpdateIndex].hold_qty > 0)
            {
                next_selectedProducts[qtyUpdateIndex].hold_qty = result;
            }
        setSelectedProducts(next_selectedProducts);
        setIsOpen(false);
    }


    useEffect(() => {
        /**
         * Fetches products from the API and saves into indexDB.
         */
        let pageIndex = 1;
        const fetchProducts = async () => {
            const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=${pageIndex - 1}
      &pageSize=100&warehouseId=${warehouseId}`;
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

    
     /**
       * Fetches Hold Bills from the API and save into IndexDB.
       */
     const fetchAllHoldBills = async () => {
        const holdbillsResponse = await getholdbills(token, warehouseId);
        saveHoldBill(holdbillsResponse.shopping_cart_items);
    };

        fetchProducts();
        fetchCustomers();
        fetchAllHoldBills();
    }, []);

    /*Function to calculate totals*/
    const calculateTotals = () => {
        let totalQuantity = 0;
        let totalMRP = 0;
        let totalAmount = 0;
        let totalDiscount = 0;

        selectedProducts.forEach((product, index) => {
            let qty = product.qty ? parseInt(product.qty) : 1;
            if(product.hold_qty != undefined && product.hold_qty > 0)
            {
                qty=product.hold_qty;
            }
            let discount = parseFloat(discounts[index] || 0);

            // Correctly apply the discount
            if (discountType === "percentage") {
                discount = (product.price * discount) / 100; // Convert % to ₹
            }

            const unitCost = product.price - discount;
            const netAmount = unitCost * qty;

            totalQuantity += qty;
            totalMRP += product.price * qty;
            totalAmount += netAmount;
            totalDiscount += discount * qty; // Ensure discount is correctly summed
        });

        setTotalQuantity(totalQuantity);
        setTotalMRP(totalMRP);
        setTotalAmount(totalAmount);
        setTotalDiscount(totalDiscount); // Update the total discount amount
    };

    /* This function is used to add hold bill to cart by id*/
    const shiftHoldBillToCart= async (CustomerId)=>{
        const holdbillsResponse = await getHoldBillsById(CustomerId);
        setSelectedCustomer(CustomerId); 
        getCustomerById(CustomerId).then((obj_cust)=>{
            console.log(obj_cust);
            setSearchCustomerTerm(obj_cust.first_name + " " + obj_cust.last_name + " - " + obj_cust.phone);
            setCustomers(obj_cust);
        })
        let newproduct_fromHold=[];
        holdbillsResponse.map((holdbill, index) => {           
           getProductById(holdbill.ProductId).then((productDetail) =>{               
                if(productDetail != undefined && productDetail != null && productDetail.length > 0)
                {
                    productDetail[0]["hold_qty"]=holdbill.Quantity;
                    newproduct_fromHold.push(productDetail[0]);
                }
                if(newproduct_fromHold.length >= holdbillsResponse.length)
                    {
                        setSelectedProducts(newproduct_fromHold);
                    }    
           }) 
                 
        })        
    }

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
        if(selectedCustomer != undefined)
        {
            deleteHoldBillByCustomerIdByProductId(selectedCustomer,id);
        }
    };



    /**
     * Handles the hold order button click.
     * If a customer is not selected, a guest login is done and the token is stored.
     * The selected products are cleared and the hold order API is called.
     */
    const handleHoldClick = async () => {
        let authToken = token;
        let customerid=0;
        try {
            // If a customer is not selected, do a guest login and store the token
            if (!selectedCustomer) {
                console.log("selectedCustomer:", selectedCustomer);
                let responsedata = await guestLogin();
                setGuestToken(responsedata.token); // Store the token for future use
                setSelectedCustomer(responsedata.customer_id); 
                customerid=responsedata.customer_id;
                console.log("Customer ID:", responsedata.customer_id);
            }
            else{
                console.log("Selected Customer ID:", selectedCustomer);
                customerid=selectedCustomer;
            }

            // Create shopping cart items dynamically from selectedProducts
            const shoppingCartItems = selectedProducts.map((product, index) => {
                const qty = product.qty ?? 1;
                const discount = parseFloat(discounts[index] || 0);
                const unitCost = product.price - discount;
                const netAmount = unitCost * qty;

                return {
                    StoreId: 1, // Replace with actual store ID if needed
                    ShoppingCartTypeId: 2, // Adjust as necessary
                    CustomerId: customerid,
                    ProductId: product.id,
                    AttributesXml: "<Attributes>Sample</Attributes>", // Replace with actual attributes if needed
                    CustomerEnteredPrice: product.price,
                    Quantity: qty,
                    RentalStartDateUtc: new Date().toISOString(),
                    RentalEndDateUtc: new Date().toISOString(),
                    CreatedOnUtc: new Date().toISOString(),
                    UpdatedOnUtc: new Date().toISOString(),
                    WarehouseId: 5, // Adjust if needed
                    InStock: true,
                    Hold: true,
                    Type: "Standard", // Adjust as needed
                    SalesManId: 101, // Replace with actual SalesManId if applicable
                    DiscountType: discountType, // Use discountType from state
                    DiscountVal: discount,
                    AdditionalDiscountVal: 0, // Update if you have additional discounts
                    AdditionalDiscountType: "Flat", // Adjust as needed
                    NetAmount: netAmount,
                    Mrp: product.price,
                    UnitCost: unitCost,
                    ShoppingCartType: "ShoppingCart",
                    Id: product.id
                };
            });

            // Define the hold API payload
            const holdData =
            {
                shopping_cart_items: shoppingCartItems,
                dictionary: {
                    additionalProp1: "value1",
                    additionalProp2: "value2",
                    additionalProp3: "value3"
                }
            }
                ;

            // Call hold API
            const holdResponse = await holdOrder(authToken, holdData);
            console.log("Hold API Response:", holdResponse);
            if(holdResponse != undefined)
            {
                /*Here we first delete old hold bill from index db by customer id*/
                deleteHoldBillByCustomerId(customerid);
                /*Here we  save hold bill into index db*/
                saveHoldBill(holdResponse.shopping_cart_items);
                
                // Clear the selected products
                setSelectedCustomer(null);
                setSelectedProducts([]);
            }
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
    const getholdbillsresponse = async () => {
        try {

            //const holdbillsResponse = await getholdbills(token, warehouseId);
            const holdbillsResponse=await getHoldBills();
            setHoldBills(holdbillsResponse);
            setIsSidebarOpen(true); // Open the sidebar after fetching data
        } catch (error) {
            // console.error("Error fetching hold bills:", error);
        }
    };

    const toggleDiscountType = () => {
        console.log("toggleDiscountType");
        setDiscountType((prevType) => {
            const newType = prevType === "amount" ? "percentage" : "amount";
            return newType;
        });

        calculateTotals();
    };



    return (
        <PosLayout>
            <div className="flex flex-col pos-left">
                <div className="row">
                    <div className="col-md-4">
                        <POSProductSearchBox setSelectedProducts={setSelectedProducts} />
                    </div>
                    <div className="col-md-4">
                        <POSCustomerSearchBox setSelectedCustomer={setSelectedCustomer} 
                        selectedCustomer={selectedCustomer} 
                        selectedProducts={selectedProducts}
                        setSearchCustomerTerm={setSearchCustomerTerm}
                        searchCustomerTerm={searchCustomerTerm}
                        setCustomers={setCustomers}
                        customers={customers}
                        setCustomerLastOrder={setCustomerLastOrder} />
                    </div>
                </div>
                {/* Second Row: Product Grid */}
                <div className="row pos-left-middle">
                    <div className="col-12">
                        <div className="border rounded bg-white">
                        <table className="w-full border-collapse border carttable">
                                    <thead>
                                        <tr className="bg-black text-center text-white">
                                            <th className="border px-2 py-2 ">Itemcode</th>
                                            <th className="border px-2 py-2 w-45">Product</th>
                                            <th className="border px-2 py-2 w-20">Qty</th>
                                            <th className="border px-2 py-2">MRP</th>
                                            <th className="border px-2 py-2">Discount</th>
                                            <th className="border px-2 py-2">Add. Discount</th>
                                            <th className="border px-2 py-2">Unit Cost</th>
                                            <th className="border px-2 py-2">Net Amount</th>
                                            <th className="border px-2 py-2">Action</th>
                                        </tr>
                                    </thead>
                            {selectedProducts.length > 0 ? (
                                
                                    <tbody>
                                        {selectedProducts.map((product, index) => {
                                            let qty = product.qty ?? 1;
                                            if(product.hold_qty != undefined && product.hold_qty > 0)
                                            {
                                                qty=product.hold_qty;
                                            }
                                            let discount = parseFloat(discounts[index] || 0);
                                            //alert(discount);
                                            // Apply discount correctly based on discount type
                                            if (discountType === "percentage") {
                                                discount = (product.price * discount) / 100; // Convert percentage to amount
                                            } 
                                            //alert(discount);
                                            const unitCost = product.price - discount;
                                            const netAmount = unitCost * qty; return (
                                                <tr key={product.id}>
                                                    <td className="border px-2 py-2">{product.sku}</td>
                                                    <td className="border px-2 py-2 w-45">{product.name}</td>
                                                    <td className="border px-2 py-2 w-20"> <input type="number"
                                                        readOnly="readonly"
                                                        id={`qty${index}`}
                                                        name={`qty${index}`}
                                                        value={qty}
                                                        onClick={() => { setQtyupdateIndex(index), setIsOpen(true), setResult(qty) }} ></input></td>
                                                    <td className="border px-2 py-2">{product.price}</td>
                                                    <td className="border px-2 py-2">
                                                        {/* <input
                                                        type="number"
                                                        value={parseFloat(discounts[index] || 0)}
                                                        onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                        className="w-16 text-center border rounded"
                                                    /> */}
                                                        <div className="input-group">
                                                            <button
                                                                type="button"
                                                                onClick={toggleDiscountType}
                                                                className={`btn btn-dark ${discountType === "percentage" ? "btn-percent" : "btn-rupee"}`}
                                                            >
                                                                {discountType === "percentage" ? (
                                                                    <i className="fa fa-percent" aria-hidden="true"></i>
                                                                ) : (
                                                                    <i className="fa fa-inr currency_style" aria-hidden="true"></i>
                                                                )}
                                                            </button>
                                                            {/* <input
                                                                type="number"
                                                                // value={discountType === "percentage" ? ((discounts[index] / totalAmount) * 100).toFixed(2) : discounts[index]}
                                                                value={discount}
                                                                onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                                className="w-16 text-center border rounded"
                                                            /> */}
                                                            <input
                                                                type="number"
                                                                // Use the updated discounts array
                                                                onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                                className="w-16 text-center border rounded"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="border px-2 py-2">0</td>
                                                    <td className="border px-2 py-2">{unitCost.toFixed(2)}</td>
                                                    <td className="border px-2 py-2">{netAmount.toFixed(2)}</td>
                                                    <td className="border px-2 py-2 text-center">
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
                                
                            ) : (
                                <p className="text-center">No products selected.</p>
                            )}
                            </table>
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
                                        className="flex items-center space-x-2" onClick={getholdbillsresponse}
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
                            {/* <p>
                                <span className="font-weight-bold">Last Bill Amount:</span>
                                <span id="customer_last_transaction_amount">
                                    <i className="fa fa-inr currency_style" aria-hidden="true"></i>0
                                </span>
                            </p> */}
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
                                <span className="font-weight-bold">Last Bill No.:</span> <span id="bill_last_no">{customerLastOrder != undefined && customerLastOrder != null && customerLastOrder.LatestOrder != null ? "ORD"+customerLastOrder.LatestOrder.CustomOrderNumber : 0}</span>
                            </p>
                            <p>
                                <span className="font-weight-bold">Last Bill Amount:</span>{" "}
                                <span id="billlast_amount">
                                    <i className="fa fa-inr currency_style" aria-hidden="true"></i> {customerLastOrder != undefined && customerLastOrder != null && customerLastOrder.LatestOrder != null ? customerLastOrder.LatestOrder.OrderTotal : 0}
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
                                calculator_handleClick('')}><i className='fa fa-close'></i></button>



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
            <div id="holdbilldiv" className={`holdbilldiv right-sidebarpopup mb-2 ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="right-top hold-bill-list p-2">
                    <div className="bg-dark p-2 text-white">
                        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>X</button>
                        <h6>On Hold</h6>
                    </div>

                    <ul className="hold_bill_div">
                        {holdBills.length > 0 ? (
                            holdBills.map((bill, index) => (
                                <li key={index} className="mb-2">
                                    <div>
                                        <a href="#"  onClick={()=>shiftHoldBillToCart(bill.CustomerId)}>
                                            <div className="d-flex align-items-center">
                                                <p>Order ID : <span>HOLD{bill.Id}</span></p>
                                                {/* <p className="mt-1 print-btn pb-0"  >
                                                <span><button>
                                                    <i className="fa fa-print" aria-hidden="true"></i></button></span></p> */}
                                                {/* <p className="mt-1 print-btn pb-0"  >
                                                <span><button><i className="fa fa-trash" aria-hidden="true"></i>
                                                </button></span></p> */}
                                            </div>
                                            <p className="mt-1"  ><span>{bill.CreatedOnUtc}</span></p>
                                            <p>
                                                Contact Name :{bill.CustomerName && bill.CustomerName !== null ? bill.CustomerName : 'Walk In Customer'}</p>
                                            <p>Contact No : {bill.Phone}</p><p>Amount  <b><i className="fa fa-inr currency_style" aria-hidden="true">
                                            </i>{bill.Netamount}</b>
                                            </p>
                                        </a>
                                    </div>
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