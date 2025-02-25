"use client";
import PosLayout from "@/components/Layouts/PosLayout";
import { saveProducts,getProductById,updateSpecificProduct } from '@/utils/productService';
import { saveCustomers,getCustomerById } from '@/utils/customerService';
import { saveHoldBill,getHoldBills,getHoldBillsByQuery,getHoldBillsById,deleteHoldBillByCustomerId,deleteHoldBillByCustomerIdByProductId } from '@/utils/holdbillServices';
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import POSProductSearchBox from '@/components/POSProductSearchBox';
import POSCustomerSearchBox from '@/components/POSCustomerSearchBox';
import { Modal, Button, Alert } from "react-bootstrap";
import { guestLogin, holdOrder,createOrder, getholdbills,getOrderItemsByOrderIdFromApi,getProductDetail } from "@/utils/posService";
import OrdersComponent from "@/components/Orders/OrdersComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderReceipt from "@/components/OrderPrint/OrderReceipt";
import CashRegisterNewModal from "@/components/CashRegisterModal";
import { AnyObject, object } from "yup";

const NewPosOrder = () => {
    const { token, logout, warehouseId } = useAuth();
    const [selectedProducts, setSelectedProducts] = useState<{name:string,sku: string,order_minimum_quantity: number,id: number, qty: number; hold_qty?: number,price: number }[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState(0);
    const [customerLastOrder, setCustomerLastOrder] = useState<AnyObject>();
    const [customers, setCustomers] = useState([]);//used for full custoner information
    const [isOpen, setIsOpen] = useState(false);
    const [isInvoicePopupOpen, setIsInvoicePopupOpen] = useState(false);
    const [isCashRegisterModel, setIsCashRegisterModel]=useState(false);
    const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false)
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
    const [holdBills, setHoldBills] = useState<any[]>([]);
    const [discountType, setDiscountType] = useState("amount");
    const [searchHoldBill, setSearchHoldBill] = useState("");
    
    const handleDiscountChange = (index: any, value: any) => {
        
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
    const calculator_handleClick = (value: any) => {
        if (value === 'C') {
            setResult('');
        } else if (value.indexOf("+") > -1) {
            console.log(value.replace("+", ""));
            setResult((parseFloat(result) + parseInt(value.replace("+", ""))).toString());
        }
        else if (value === '') {
            setResult('0');
        }
        else {

            setResult(parseFloat(result + value).toString());
        }
    };

    /**
    * Updates the quantity of the selected product based on calculator input.
    * Closes the modal after updating.
    */
    const popupModel_UpdateQty = () => {
        let next_selectedProducts = [...selectedProducts];
        if (qtyUpdateIndex >= 0 && qtyUpdateIndex < next_selectedProducts.length)
        {
            next_selectedProducts[qtyUpdateIndex].qty = parseInt(result);
            if(next_selectedProducts[qtyUpdateIndex].hold_qty != undefined 
                && next_selectedProducts[qtyUpdateIndex].hold_qty  > 0)
                {
                    next_selectedProducts[qtyUpdateIndex].hold_qty = parseInt(result);
                }
            setSelectedProducts(next_selectedProducts);
        }
        
        setIsOpen(false);
    }

    //Page Load functions
    useEffect(() => {

        /**
         * Fetches products from the API and saves into indexDB.
         */
        let pageIndex = 1;
        const fetchProducts = async (pageIndex:any) => {
            const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAllPOSProduct?pageIndex=${pageIndex - 1}
      &pageSize=100&warehouseId=${warehouseId}`;
            const product_response = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            if(product_response.status == 200)
            {
                const products = await product_response.json();
                pageIndex++;
                saveProducts(products.items);
                if(products.has_next_page)
                {
                    fetchProducts(pageIndex);
                }
                else{
                    toast.success("All products synced successfully.", {
                                        position: "top-right",
                                        autoClose: 5000,
                                        toastId:`product1`
                                        });
                }
            }
            else{
                toast.error("Oops! Unable to sync products.", {
                    position: "top-right",
                    autoClose: 5000,
                    toastId:`product1`
                  });
            }            
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
            if(response.status == 200)
            {
                const customers = await response.json();
                saveCustomers(customers.items);
                toast.success("All customer synced successfully.", {
                    position: "top-right",
                    autoClose: 5000,
                    toastId:`customer1`
                  });
            }
            else{
                toast.error("Oops! Unable to sync customers.", {
                    position: "top-right",
                    autoClose: 5000,
                    toastId:`customer1`
                  });
            }
        };

    
     /**
       * Fetches Hold Bills from the API and save into IndexDB.
       */
     const fetchAllHoldBills = async () => {
        await getholdbills(token, warehouseId).then((holdbillsResponse)=>{
            saveHoldBill(holdbillsResponse.shopping_cart_items);
            toast.success("All hold bills synced successfully.", {
                position: "top-right",
                autoClose: 5000,
                toastId:`holdbill1`
            });
        }).catch((error) =>{
            toast.error("Oops! unable to sync hold bills", {
                position: "top-right",
                autoClose: 5000,
                toastId:`holdbill1`
            });
        })
        
    };

        fetchProducts(pageIndex);
        fetchCustomers();
        fetchAllHoldBills();

         // Add event listener for keydown
            window.addEventListener("keydown", handleFunctionKeyPress);

            // Clean up the event listener on unmount
            return () => {
            window.removeEventListener("keydown", handleFunctionKeyPress);
            };
    }, []);

    //Below use Effect used for Searching hold billls
    useEffect(() =>
        {
            const delayDebounceFn = setTimeout(() =>
            {
                if (searchHoldBill.trim())
                {
                    searchHoldBills(searchHoldBill);
                } else
                {
                    searchHoldBills([]);
                }
            }, 200);
    
            return () => clearTimeout(delayDebounceFn);
        }, [searchHoldBill]);

    const handleFunctionKeyPress = (event: any) => {
        // Check if the pressed key is a function key
        if(event.key == "F6")
        {
            handleHoldClick();
        }
        if(event.key == "F4")
            {
                createCashOrder();
            }
      };

    /*Function to calculate totals*/
    const calculateTotals = () => {
        let totalQuantity = 0;
        let totalMRP = 0;
        let totalAmount = 0;
        let totalDiscount = 0;

        selectedProducts.forEach((product, index) => {
            let qty = product.qty ? product.qty : 1;
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
    const shiftHoldBillToCart= async (CustomerId: any)=>{
        const holdbillsResponse = await getHoldBillsById(CustomerId);
        setSelectedCustomer(CustomerId); 
        getCustomerById(CustomerId).then((obj_cust)=>{
            if(obj_cust != undefined)
            {
                setSearchCustomerTerm(obj_cust.first_name + " " + obj_cust.last_name + " - " + obj_cust.phone);
                setCustomers(obj_cust);
            }
           
        })
        let newproduct_fromHold=[];
        holdbillsResponse.map((holdbill: any, index: any) => {           
           getProductById(holdbill.ProductId).then((productDetail) =>{     
            console.log("productDetail");
            console.log(productDetail);
                if(productDetail != undefined && productDetail != null && productDetail.length > 0)
                {
                    if(productDetail[0].in_stock)
                    {
                        productDetail[0]["hold_qty"]=holdbill.Quantity;
                        newproduct_fromHold.push(productDetail[0]);
                    }
                    else{
                    toast.error(`Product ${productDetail[0].name} is out of stock`, {
                                        position: "top-left",
                                        autoClose: 5000,
                                        toastId:`out_of_stock_${index}`
                                        });
                    }
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
    const removeProduct = (id: any) => {
        setSelectedProducts(selectedProducts.filter((product) => product.id !== id));
        if(selectedCustomer != undefined && selectedCustomer > 0)
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
            if(selectedProducts.length > 0)
            {
                // If a customer is not selected, do a guest login and store the token
                if (selectedCustomer == 0) {
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
                    setSelectedCustomer(0);
                    setSelectedProducts([]);
                }
            }
            else{
                toast.error("Add minimum 1 product", {
                                      position: "top-right",
                                      autoClose: 5000
                                    });
            }
          
        } catch (error) {
            console.error("Error:", error);
        }
    };

    /*Function used to create cash Order */
    const createCashOrder=async () =>{
        let authToken = token;
        let customerid=0;
        try {
            if(selectedProducts.length > 0)
            {
                // If a customer is not selected, do a guest login and store the token
                if (!selectedCustomer) {
                    let responsedata = await guestLogin();
                    setGuestToken(responsedata.token); // Store the token for future use
                    setSelectedCustomer(responsedata.customer_id); 
                    customerid=responsedata.customer_id;
                }
                else{
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
                const orderData =
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
                const orderResponse = await createOrder(authToken, orderData);
                //console.log("Order API Response:", orderResponse);
                if(orderResponse != undefined && orderResponse.shopping_cart_items != undefined && orderResponse.shopping_cart_items.length > 0)
                {
                    /*Here we first delete old hold bill from index db by customer id*/
                    deleteHoldBillByCustomerId(customerid);
                    
                    // Clear the selected products
                    setSelectedCustomer(0);
                    setSelectedProducts([]);
                    toast.success("Order created successfully.", {
                        position: "top-right",
                        autoClose: 5000
                    });
                }
            }
            else{
                toast.error("Add minimum 1 product.", {
                    position: "top-right",
                    autoClose: 5000
                  });
            }
            
        } catch (error) {
            console.error("Error:", error);
            toast.error("Opps! Unable to create order.", {
                                  position: "top-right",
                                  autoClose: 5000
                                });
        }
    }

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
     

    //Search Hold Bills By query
    const searchHoldBills = async (query: any) =>
        {
            try
            {
                if(query != "")
                {
                    const holdbillsResponse = await getHoldBillsByQuery(query);
                    setHoldBills(holdbillsResponse);
                }
                 else{
                    const holdbillsResponse=await getHoldBills();
                    setHoldBills(holdbillsResponse);
                 }
            } catch (error)
            {
                console.error("Error searching customer:", error);
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

    const getAllOrders = () =>{
       setIsOrderPopupOpen(true);
    }

    /* This function is used to Reorder order items by order id.
    This function called from OrdersComponent page */
    const handle_ReOrder = async(obj_order: any)=>{
        setSelectedCustomer(obj_order.customer_id); 
        await getCustomerById(obj_order.customer_id).then((obj_cust)=>{
            //console.log(obj_cust);
            setSearchCustomerTerm(obj_cust.first_name + " " + obj_cust.last_name + " - " + obj_cust.phone);
            setCustomers(obj_cust);
        })
        setSelectedProducts([]);
        let newproduct_fromHold=[];
        await getOrderItemsByOrderIdFromApi(token,obj_order.id).then((obj_oitmResp)=>{
            obj_oitmResp.map((obj_items: any, orditem_index: any) => {   
                getProductDetail(token,obj_items.product_id,warehouseId).then((obj_PD_response)=>{
                     if(obj_PD_response != undefined && obj_PD_response != null && obj_PD_response.id > 0)
                        {
                            updateSpecificProduct(obj_PD_response);
                            if(obj_PD_response.stock_quantity >= obj_items.quantity && obj_PD_response.in_stock)
                            {
                                obj_PD_response["hold_qty"]=obj_items.quantity;
                                newproduct_fromHold.push(obj_PD_response);
                            }
                            else{
                                console.log(`out_of_stock_${orditem_index}_${obj_items.product_id}`);
                                toast.error(`Product ${obj_PD_response.name} is out of stock`, {
                                                    position: "top-right",
                                                    autoClose: 5000,
                                                    toastId:`out_of_stock_${orditem_index}`
                                                    });
                                }
                        }
                        if(newproduct_fromHold.length >= 0)
                            {
                                setSelectedProducts(newproduct_fromHold);
                                setIsOrderPopupOpen(false);
                            } 

                }).catch((obj_error)=>{
                    //Error case
              })       
                      
        })
        }).catch((error)=>{
                
        })

    }

    const PrintInvoice =() =>{
        setIsInvoicePopupOpen(true);
    }

    const handleCashRegisterModel=()=>{
        setIsCashRegisterModel(false);
    }


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
                                            if(product.order_minimum_quantity > 0 && qty < product.order_minimum_quantity)
                                            {
                                                qty=product.order_minimum_quantity;
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
                                                        readOnly={true}
                                                        id={`qty${index}`}
                                                        name={`qty${index}`}
                                                        value={qty}
                                                        onClick={() => { setQtyupdateIndex(index), setIsOpen(true), setResult(qty.toString()) }} ></input></td>
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
                                // <p className="text-center">No products selected.</p>
                                <tbody>
                                   <tr>
                                    <td className="text-center" colSpan={10}>No products selected.</td>
                                   </tr>
                                </tbody>
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
                                        <button type="button" className="col btn btn-dark" onClick={createCashOrder}><i className="fa fa-inr" /> Cash (F4)</button>
                                        <button type="button" className="col btn btn-dark"><i className="fa fa-calendar" /> Pay Later (F11)</button>
                                        <button type="button" className="col btn btn-dark" onClick={()=> PrintInvoice()}><i className="fa fa-print"/> Print Invoice</button>
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
                                        className=" items-center space-x-2" onClick={getholdbillsresponse}
                                    >
                                        <i className="fa fa-pause" aria-hidden="true"></i><br/>
                                        <span>Hold Bill</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        title="Payments"
                                        className="flex-col items-center"
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
                                    <a href="#" title="Orders" id="pos-list" onClick={getAllOrders}>
                                        <i className="fa fa-list" aria-hidden="true"></i> Orders
                                    </a>
                                </li>
                                <li>
                                    <a href="#" id="cashcontrol_modal" title="Cash Control" className="flex items-center space-x-2" onClick={()=> setIsCashRegisterModel(true)}>
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
                            {/* <p>
                                <span className="font-weight-bold">Last Visited:</span> <span id="customer_last_transaction_date">-</span>
                            </p> */}
                            {/* <p>
                                <span className="font-weight-bold">Last Bill Amount:</span>
                                <span id="customer_last_transaction_amount">
                                    <i className="fa fa-inr currency_style" aria-hidden="true"></i>0
                                </span>
                            </p> */}
                            {/* <p>
                                <span className="font-weight-bold">Most Purchased Item:</span>{" "}
                                <span id="customer_last_transaction_prdouct">0</span>
                            </p>
                            <p>
                                <span className="font-weight-bold" id="closing_value">Due Payment:</span>{" "}
                                <span id="customer_closing">0</span>
                            </p> */}
                            {/* <p>
                                <span className="font-weight-bold">Total Purchase:</span> <span id="customer_total_purchase">0</span>
                            </p> */}
                            {/* <p id="loyaltyPointsdiv">
                                <span className="font-weight-bold">Loyalty Points:</span> <span id="customer_loyalty">0</span>
                            </p>
                            <p id="coupon_div" className="m--hide">
                                <span className="font-weight-bold">Coupon:</span>
                                <button className="btn btn-sm btn-dark">
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </button>
                            </p> */}
                        </div>
                        <div className="customer-highlights">
                            <p>
                                <span className="font-weight-bold">Last Bill No.:</span> 
                                <span id="bill_last_no">{customerLastOrder != undefined 
                                && customerLastOrder != null 
                                && customerLastOrder.LatestOrder != null ? "ORD"+customerLastOrder.LatestOrder.CustomOrderNumber : 0}
                                </span>
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
            <Modal className="modal-xl" show={isOrderPopupOpen}>
            <Modal.Header>
            <div className="col-12">
    <h4 className="text-xl font-semibold text-black dark:text-white float-left">
      POS Orders
    </h4>
    <div  className="text-xl font-semibold text-black float-right">
    <a onClick={()=> setIsOrderPopupOpen(false)}><i className="fa fa-close"></i></a>
        </div>
  </div>
                
            </Modal.Header>
                <Modal.Body className="p-1">
                    <OrdersComponent handle_ReOrder={handle_ReOrder}></OrdersComponent>
                </Modal.Body>
            </Modal>
            <div id="holdbilldiv" className={`holdbilldiv right-sidebarpopup mb-2 ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="right-top hold-bill-list p-2">
                    <div className="bg-dark p-2 text-white">
                        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>X</button>
                        <h6>On Hold</h6>
                    </div>
                    <div className="relative py-1 w-full max-w-sm">
                            <input type="text" placeholder="Search "
                            value={searchHoldBill}
                            onChange={(e) => setSearchHoldBill(e.target.value)}
                            className="w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"></input>
                             {searchHoldBill && (
            <button
                onClick={()=>setSearchHoldBill("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none"
            >
                ✕
            </button>
        )}
                            </div>

                    <ul style={{height: window.outerHeight -200 + 'px',overflow:'scroll'}} className="hold_bill_div">
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
 {/* Start Invoice Popup Model  */}
            <Modal className="" show={isInvoicePopupOpen}>
            <Modal.Header>
            <div className="col-12">
    <h4 className="text-xl font-semibold text-black dark:text-white float-left">
      Order Invoice
    </h4>
    <div  className="text-xl font-semibold text-black float-right">
    <a onClick={()=> setIsInvoicePopupOpen(false)}><i className="fa fa-close"></i></a>
        </div>
  </div>
                
            </Modal.Header>
                <Modal.Body>
                    <OrderReceipt></OrderReceipt>
                </Modal.Body>
            </Modal>

            {/* End Invoice Popup Model  */}

            {/* Start Sales Register Popup Model  */}
           
            <CashRegisterNewModal show={isCashRegisterModel} handleClose={handleCashRegisterModel}></CashRegisterNewModal>

            {/* End Sales Register Popup Model  */}
            <ToastContainer></ToastContainer>
        </PosLayout>

    )
}
export default NewPosOrder