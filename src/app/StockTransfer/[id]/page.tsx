"use client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from "react-bootstrap";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import "@/css/custom.css";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";

//import { Editor } from "@tinymce/tinymce-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Link from "next/link";
import { set } from "date-fns";
import { de, se } from "date-fns/locale";
import StockTable from "@/components/StockTable";

let Token = process.env.BACKEND_TOKEN;
const StockTransferDetail = () => {
  const pathname = usePathname();
  const id = pathname.match(/\/StockTransfer\/(\d+)/)?.[1];

  const router = useRouter();
  const { token, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  interface StockTransferProduct {
    Id: number;
    FromBatch: string;
    ToBatch: string;
    TransferDate: Date;
    TransferNoPrefix: string;
    StockTransferNo: string;
    ItemCode: string;
    ProductName: string;
    Batch: string;
    Qty: number;
    Price: number;
    Discount: number;
    Taxable: boolean; // Assuming this is a boolean field
    Tax: number;
    Total: number;
    FlatDiscount: number;
    StockTransferId: number;
  }

  const [stocktransferproducts, setstocktransferproducts] = useState<
    StockTransferProduct[]
  >([]);
  // ({
  //     Id: Number,
  //     FromBatch: '',
  //     ToBatch: '',
  //     TransferDate: Date,
  //     TransferNoPrefix: '',
  //     StockTranferNo: '',
  //     ItemCode: '',
  //     ProductName: '',
  //     Batch: '',
  //     Qty: '',
  //     Price: '',
  //     Discount: '',
  //     Taxable: '',
  //     Tax: '',
  //     Total: '',
  //     FlatDiscount: '',
  //     StockTransferId: Number
  // });

  const [stocktransfer, setstocktransfer] = useState<any>({
    Id: Number,
    TransferNo: "",
    TransferDate: Date,
    FromLocation: "",
    ToLocation: "",
    NetAmount: "",
    Qty: "",
    Status: "",
    CreatedBy: "",
    AdditionalCharge: "",
    AdditionalValue: "",
    AdditionalTax: "",
    AdditionalCurrency: "",
    AdditionalTotal: "",
    ShippingType: "",
    ShippingDate: Date,
    ReferenceNo: "",
    TransportDate: Date,
    ModeOfTransport: "",
    TransporterName: "",
    VehicleNo: "",
    Weight: "",
    Note: "",
    FlatDiscount: "",
    TotalAmount: "",
    DiscountAmount: "",
    GrossAmount: "",
    TaxAmount: "",
    RoundOff: "",
    TotalCurrency: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [itemCode, setItemCode] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [productName, setProductName] = useState("");
  const [printName, setPrintName] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [warehouse, setWarehouses] = useState<any>([]);

  //const [date, setDate] = useState(new Date());
  const [date, setDate] = useState<Date | null>(new Date());
  const [shippingdate, setshippingdate] = useState<Date | null>(new Date());
  const [transportDate, settransportDate] = useState<Date | null>(new Date());
  const [isTextboxVisible, setTextboxVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("productDetails");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [dropdownProduct, SetdropdownProduct] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  //const [buttonVisibility, setButtonVisibility] = useState<Record<number, boolean>>({});

  const [totalButtonVisibility, setTotalButtonVisibility] = useState(true);

  // const toggleButtonVisibility = (index: number) => {
  //   setButtonVisibility((prevVisibility) => ({
  //     ...prevVisibility,
  //     [index]: !prevVisibility[index], // Toggle the visibility for the index
  //   }));
  // };
  const [buttonVisibility, setButtonVisibility] = useState<boolean[]>([]);
  const toggleButtonVisibility = (index: number) => {
    setButtonVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index]; // Toggle the visibility for the specific index
      return newVisibility;
    });
  };
  const toggleTotalButtonVisibility = () => {
    setTotalButtonVisibility(!totalButtonVisibility);
  };

  const handleArrowClick = (event: any) => {
    setTextboxVisible(!isTextboxVisible);
  };
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  //const handleInputChange = (e:any) => setItemCode(e.target.value);
  const handleCheckboxChange = (e: any) => setAutoGenerate(e.target.checked);

  //  Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setstocktransfer((prevProduct: any) => ({
      ...prevProduct, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const handleProductInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number,
    field: string,
  ) => {
    const { value } = e.target;

    setstocktransferproducts((prevProducts: any[]) =>
      prevProducts.map(
        (product, i) =>
          i === index
            ? { ...product, [field]: value } // Update the specific field for the targeted product
            : product, // Leave other products unchanged
      ),
    );
  };

  useEffect(() => {
    console.log(
      "stocktransferproducts" + JSON.stringify(stocktransferproducts),
    );
  }, [stocktransferproducts]);

  const handleWarehouseChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedWarehouseId = event.target.value;
    setstocktransfer((prevBank: any) => ({
      ...prevBank, // Keep other properties intact
      WarehouseId: selectedWarehouseId, // Update WarehouseId based on selection
    }));
  };
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const query = event.target.value; // Capture the search input value

    setstocktransferproducts((prevProducts: any[]) =>
      prevProducts.map(
        (product, i) =>
          i === index
            ? { ...product, searchQuery: query } // Update the searchQuery field for the targeted product
            : product, // Leave other products unchanged
      ),
    );
    setSearchQuery(query);
    // Fetch products based on the updated query for the specific product
    fetchProducts(query, index);
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const { value } = e.target;

    setstocktransferproducts((prevProducts: any[]) =>
      prevProducts.map(
        (product, i) =>
          i === index
            ? { ...product, Batch: value } // Update the specific field for the targeted product
            : product, // Leave other products unchanged
      ),
    );

    // If `fetchProduct` needs to be called with the selected value:
    fetchProduct(value);
  };

  const fetchProduct = async (query: string) => {
    try {
      console.log("Search query for single product:", query);
      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetProductsByIds/${query}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Ensure `token` is available in scope.
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching product data: ${response.statusText} (${response.status})`,
        );
      }

      const data = await response.json();
      console.log("Selected product data:", data);

      if (data && data.length > 0) {
        setstocktransferproducts([
          {
            Id: data[0]?.Id || 0,
            FromBatch: "",
            ToBatch: "",
            TransferDate: new Date(), // Default to current date or adjust as needed
            TransferNoPrefix: "",
            StockTransferNo: "",
            ItemCode: data[0]?.sku || "",
            ProductName: data[0]?.name || "",
            Batch: "",
            Qty: 0, // Default to 0 or adjust as needed
            Price: data[0]?.price || 0,
            Discount: 0, // Default to 0 or adjust as needed
            Taxable: false, // Default to false or adjust as needed
            Tax: 0,
            Total: 0,
            FlatDiscount: 0,
            StockTransferId: 0,
          },
        ]);
      }

      // return mappedProducts; // Return the mapped products or adjust according to your UI needs
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null; // Return null in case of error
    }
  };
  const fetchProducts = async (query: string, index: Number) => {
    try {
      //  SetdropdownProduct([]);
      console.log("Search query product: " + JSON.stringify(query));
      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=0&pageSize=10&storeId=0&vendorId=0
      &warehouseId=0&visibleIndividuallyOnly=false&excludeFeaturedProducts=false&productTagId=0&
      keywords=${query}&searchDescriptions=false&searchManufacturerPartNumber
      =true&searchSku=true&searchProductTags=false&languageId=0&showHidden=false`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        throw new Error(`Error in search product: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Search product data: " + JSON.stringify(data));

      SetdropdownProduct(
        Array.isArray(data.items)
          ? data.items.map((product: any) => ({
              name: product.name,
              id: product.id,
            }))
          : [],
      );

      return data;
    } catch (error) {
      console.log("Error in product search: " + error);
    }
  };
  const updateStockTransfer = async (stocktransfer: any) => {
    try {
      //handleOpenModal();
      stocktransfer.TotalAmount = calculateTotalAmount();
      stocktransfer.DiscountAmount = calculateDiscountAmount();
      stocktransfer.GrossAmount = (
        parseFloat(calculateTotalAmount()) -
        parseFloat(calculateDiscountAmount())
      ).toFixed(2);
      stocktransfer.TaxAmount = calculateTaxAmount();
      stocktransfer.NetAmount = calculateNetAmounts();
      //stocktransfer.TotalCurrency=
      console.log(
        "Before updated stock transfer Data" + JSON.stringify(stocktransfer),
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/EditStockTransferDetailsById`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(stocktransfer),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("updated data" + data);
      return data;
    } catch (error) {
    } finally {
    }
  };
  const updateStockTransferProducts = async (stocktransferproducts: any[]) => {
    try {
      // Iterate over each product in the stocktransferproducts array
      stocktransferproducts.forEach(async (stocktransferproduct: any) => {
        // You can add custom logic here for each individual product
        console.log(
          "Before updated stock transfer product Data:",
          JSON.stringify(stocktransferproduct),
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/EditStockTransferProductDetailsById`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(stocktransferproduct),
          },
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        //const data = await response.json();
        // console.log("Updated data:", data);
        return response.ok;
      });
    } catch (error) {
      console.error("Error in updating stock transfer products:", error);
    } finally {
      // Optionally handle cleanup or post-update logic
    }
  };

  useEffect(() => {
    const fetchStockTransfer = async () => {
      setIsLoading(true); // Ensure loading state is set before fetching.
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAllStockTransferDetailsById?Id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} - ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("Fetched Stock Transfer product Data:", data);
        setstocktransfer(data);
        setDate(new Date(data.TransferDate));
        setshippingdate(new Date(data.ShippingDate));
        settransportDate(new Date(data.TransportDate));
      } catch (error) {
        console.error(
          "Failed to fetch Stock Transfer product:",
          error || error,
        );
      } finally {
        setIsLoading(false); // Always set loading to false after the fetch is complete.
      }
    };

    const fetchStockTransferProducts = async () => {
      setIsLoading(true); // Ensure loading state is set before fetching.

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAllStockTransferProductDetailsByStockTransferId?Id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} - ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("Fetched Stock Transfer product Data:", data);
        setstocktransferproducts(data);
      } catch (error) {
        console.error(
          "Failed to fetch Stock Transfer product:",
          error || error,
        );
      } finally {
        setIsLoading(false); // Always set loading to false after the fetch is complete.
      }
    };

    const fetchWarehouse = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/GetAll
        `,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("api product"+JSON.stringify(data));
        setWarehouses(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchStockTransfer();
    fetchWarehouse();
    fetchStockTransferProducts();
  }, [id, token]); // Adding `id` and `token` to the dependency array.

  const handleUpdate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      // Assuming stocktransfer.ToLocation is the field you're validating
      if (!stocktransfer.ToLocation) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please select a To Branch.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      if (!stocktransfer.TransferDate) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please select a Transfer Date.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      if (!stocktransfer.TransferNo) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please select a Transfer No.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      if (stocktransferproducts.length === 0) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please add at least one product.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const invalidProductQty = stocktransferproducts.find(
        (product) => !product.Qty || product.Qty === 0,
      );

      if (invalidProductQty) {
        toast.error("Please ensure all products have a valid quantity.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const invalidProductPrice = stocktransferproducts.find(
        (product) => !product.Price || product.Price === 0,
      );

      if (invalidProductPrice) {
        toast.error("Please ensure all products have a valid Price.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const invalidProductDiscount = stocktransferproducts.find(
        (product) => !product.Discount || product.Discount === 0,
      );

      if (invalidProductDiscount) {
        toast.error("Please ensure all products have a valid Discount.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const response = await updateStockTransfer(stocktransfer);
      const res = await updateStockTransferProducts(stocktransferproducts);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const calculateNetAmounts = () => {
    const total = stocktransferproducts.reduce((acc, product) => {
      const qty = Number(product.Qty);
      const price = Number(product.Price);
      const discount = Number(product.Discount);

      // Calculate the product total with the appropriate discount logic
      const productTotal = buttonVisibility[
        stocktransferproducts.indexOf(product)
      ]
        ? // Percentage Discount
          qty * price - (qty * price * discount) / 100
        : // Flat Discount
          qty * price - discount;

      return acc + productTotal; // Add the calculated total to the accumulator
    }, 0);

    return total.toFixed(2); // Return the total value rounded to two decimal places
  };

  const calculateTotalAmount = () => {
    const total = stocktransferproducts.reduce((acc, product) => {
      const qty = Number(product.Qty);
      const price = Number(product.Price);
      // Flat Discount
      return qty * price;
    }, 0);

    return total.toFixed(2);
  };

  const calculateDiscountAmount = () => {
    const totalAmount = parseFloat(calculateTotalAmount()); // Convert the total amount to a number
    const netAmount = Number(calculateNetAmount()); // Convert the net amount to a number

    return (totalAmount - netAmount).toFixed(2); // Calculate the discount amount and return it as a string with two decimals
  };

  const calculateTaxAmount = () => {
    const total = stocktransferproducts.reduce((acc, product) => {
      const Tax = Number(product.Tax);
      return acc + Tax;
    }, 0);

    return total.toFixed(2);
  };

  const calculateNetAmount = () => {
    const netAmount = parseFloat(stocktransfer.NetAmount.toString());
    const discount = parseFloat(stocktransfer.FlatDiscount.toString());

    if (isNaN(netAmount) || netAmount <= 0) {
      return 0; // Return 0 if the net amount is invalid
    }

    if (isNaN(discount)) {
      return netAmount; // Return net amount if discount is invalid
    }

    if (totalButtonVisibility) {
      // Apply percentage discount
      return (netAmount - (netAmount * discount) / 100).toFixed(2);
    } else {
      // Apply flat discount
      return (netAmount - discount).toFixed(2);
    }
  };

  if (isLoading)
    return (
      <DefaultLayout>
        <div>Loading...</div>
      </DefaultLayout>
    );
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={stocktransfer.Prefix}
        links={[{ label: "Stock Transfer", route: "/StockTransfer" }]}
      />
      <div className="common_page_layout stockTransfer-new-page">
        {/* <div className='product-details-header'>
      <h3 className='header-font'>{stocktransfer.Prefix}</h3>
            <ul className="product-page-header-ul">
                  <li className="product-page-header-li">
                        <a href="/" className="m-nav__link m-nav__link--icon">                      
                        <i className="fa-solid fa-house"></i>
                         </a>
                  </li>                  
            </ul>
            <ul className="product-page-header-ul">
                <li className='product-page-header-li'>
                        <a href="/StockTransfer"> 
                        <span>- Stock Transfer</span>
                        </a>
                  </li>
            </ul>
     </div>  */}
        <div className="common_page_layout stocktranfer-new-page">
          <div className="form-container">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group row">
                  <label className="col-lg-12 col-md-12 col-sm-12">
                    From Branch
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      {/* <select
            className="form-control m-select2 select2-hidden-accessible"
            autoFocus
            id="branchFrom"
            name="fromBranchId"
            aria-placeholder="Select Customer"
            data-select2-id="branchFrom"
          >
            <option value="">Select Branch</option>
            <option value="8331" data-state-code="9" data-gst-no="09AAHCV3382L1ZQ" selected>
              VW-GOP-1109 - veggieswala@gmail.com
            </option>
          </select> */}

                      <select
                        className="form-control m-select2 select2-hidden-accessible"
                        name="WarehouseId"
                        value={stocktransfer.FromLocation} // Bind the value to the bank state
                        onChange={handleWarehouseChange} // Handle change when a warehouse is selected
                      >
                        <option value="">Select Batch</option>{" "}
                        {/* Default option */}
                        {warehouse.map((wh: any) => (
                          <option key={wh.id} value={wh.id}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <small className="help-block" style={{ display: "none" }}>
                      Select From Branch
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row">
                  <label className="col-lg-12 col-md-12 col-sm-12">
                    To Branch
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <select
                        className="form-control m-select2 select2-hidden-accessible"
                        name="WarehouseId"
                        value={stocktransfer.ToLocation} // Bind the value to the bank state
                        onChange={handleWarehouseChange} // Handle change when a warehouse is selected
                      >
                        <option value="">Select Batch</option>{" "}
                        {/* Default option */}
                        {warehouse.map((wh: any) => (
                          <option key={wh.id} value={wh.id}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="hidden"
                        id="branchToHidden"
                        name="toBranchId"
                        value="12236"
                      />
                    </div>
                    <small className="help-block" style={{ display: "none" }}>
                      Select To Branch
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group row has-success">
                  <label className="col-lg-12 col-md-12 col-sm-12">
                    Transfer Date
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group date">
                      <ReactDatePicker
                        selected={date}
                        onChange={(selectedDate) => setDate(selectedDate)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-control-sm todaybtn-datepicker"
                        id="TransferDate"
                        name="TransferDate"
                        placeholderText="Select Date"
                      />
                    </div>
                    <small className="help-block" style={{ display: "none" }}>
                      The Stock Transfer Date is required
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row">
                  <label className="col-lg-12 col-md-12 col-sm-12">
                    Transfer No.
                    <small
                      style={{ fontSize: "1.25rem", color: "red" }}
                      className="text-danger"
                    >
                      *
                    </small>
                  </label>
                  <div className="col-lg-6 col-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="prefix"
                      placeholder="Prefix"
                      value={stocktransfer.Prefix}
                    />
                    <small className="help-block" style={{ display: "none" }}>
                      The Prefix is required
                    </small>
                  </div>
                  <div className="col-lg-6 col-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="TransferNo"
                      id="TransferNo"
                      placeholder="Stock Transfer No"
                      value={stocktransfer.TransferNo}
                      onChange={handleInputChange}
                    />
                    <small className="help-block" style={{ display: "none" }}>
                      The Stock Transfer No is required
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="m-portlet__head m-portlet__head__sm">
                  <div className="m-portlet__head-tools">
                    <ul
                      className="nav nav-tabs m-tabs-line m-tabs-line--primary m-tabs-line--2x"
                      role="tablist"
                    >
                      <li className="nav-item m-tabs__item">
                        <button
                          className={`nav-link m-tabs__link ${activeTab === "productDetails" ? "active show" : ""}`}
                          onClick={() => handleTabChange("productDetails")}
                          role="tab"
                          aria-selected={activeTab === "productDetails"}
                        >
                          Product Details
                        </button>
                      </li>
                      <li className="nav-item m-tabs__item">
                        <button
                          className={`nav-link m-tabs__link ${activeTab === "shippingDetails" ? "active show" : ""}`}
                          onClick={() => handleTabChange("shippingDetails")}
                          role="tab"
                          aria-selected={activeTab === "shippingDetails"}
                        >
                          Shipping Details
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content">
                    {activeTab === "productDetails" && (
                      <div id="m_tabs_7_1" className="tab-pane active">
                        <div className="row">
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="table-responsive">
                              <table className="table-sm m-table table-bordered table-hover table text-center">
                                <thead>
                                  <tr>
                                    <th className="paction"></th>
                                    <th>#</th>
                                    <th className="pitemcode">
                                      Item Code/Barcode
                                    </th>
                                    <th className="pname">Product</th>
                                    <th>Batch</th>
                                    <th>
                                      Qty
                                      <small
                                        style={{
                                          fontSize: "1.25rem",
                                          color: "red",
                                        }}
                                        className="text-danger"
                                      >
                                        *
                                      </small>
                                    </th>
                                    <th>
                                      Price
                                      <small
                                        style={{
                                          fontSize: "1.25rem",
                                          color: "red",
                                        }}
                                        className="text-danger"
                                      >
                                        *
                                      </small>
                                    </th>
                                    <th className="text-left">
                                      <input
                                        readOnly
                                        type="checkbox"
                                        className=""
                                        id="rediscount"
                                        name="rediscount"
                                        value="0"
                                        data-toggle="m-tooltip"
                                        title=""
                                        style={{
                                          float: "left",
                                          marginRight: "5px",
                                          width: "16px",
                                          height: "16px",
                                          lineHeight: "28px",
                                        }}
                                        data-original-title="Discount apply in all item"
                                      />
                                      Discount
                                      <small
                                        style={{
                                          fontSize: "1.25rem",
                                          color: "red",
                                        }}
                                        className="text-danger"
                                      >
                                        *
                                      </small>
                                    </th>
                                    <th>Taxable</th>
                                    <th>Tax</th>
                                    <th className="text-right">Total</th>
                                  </tr>
                                </thead>
                                {stocktransferproducts.map(
                                  (stockproduct: any, index: number) => (
                                    <tbody key={index} data-sales-list="">
                                      <tr
                                        data-sales-item="template"
                                        className="m--hide"
                                      >
                                        <td
                                          className="paction"
                                          style={{ width: "70px" }}
                                        >
                                          <a
                                            tabIndex={-1}
                                            href="javascript:void(0)"
                                            data-item-remove=""
                                            className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                          >
                                            <i className="fa fa-times"></i>
                                          </a>
                                          <a
                                            tabIndex={-1}
                                            href="javascript:void(0)"
                                            className="btn btn-sm btn-outline-primary m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                            data-add-item=""
                                          >
                                            <i
                                              className="fa fa-plus"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        </td>
                                        <td style={{ width: "50px" }}>
                                          <span data-item-index="">
                                            {index + 1}
                                          </span>
                                        </td>
                                        <td className="pitemcode">
                                          <div className="m--font-bolder form-group mb-0 p-0 text-right">
                                            <input
                                              type="text"
                                              className="form-control form-control-sm"
                                              name="ItemCode"
                                              placeholder="Item Code"
                                              value={stockproduct.ItemCode}
                                              onChange={(e) =>
                                                handleProductInputChange(
                                                  e,
                                                  index,
                                                  "ItemCode",
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td className="pname">
                                          <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Product Name"
                                            name="ProductName"
                                            value={stockproduct.ProductName}
                                            readOnly
                                          />
                                          <span
                                            id="dropdown"
                                            className="form-control"
                                            onClick={() =>
                                              handleArrowClick(index)
                                            }
                                          >
                                            ^
                                          </span>
                                          {isTextboxVisible && (
                                            <div style={{ marginTop: "10px" }}>
                                              <input
                                                type="text"
                                                id="textbox"
                                                className="form-control"
                                                placeholder=""
                                                value={searchQuery}
                                                onChange={(e) =>
                                                  handleSearchChange(e, index)
                                                }
                                              />
                                              <select
                                                onChange={(e) =>
                                                  handleSelectChange(e, index)
                                                }
                                                value={selectedValue}
                                              >
                                                {dropdownProduct.length > 0 &&
                                                  dropdownProduct.map(
                                                    (prod: any) => (
                                                      <option
                                                        key={prod.id}
                                                        value={prod.id}
                                                      >
                                                        {prod.name}
                                                      </option>
                                                    ),
                                                  )}
                                              </select>
                                            </div>
                                          )}
                                        </td>
                                        <td
                                          style={{ width: "280px" }}
                                          className="batchName"
                                        >
                                          <select
                                            className="form-control m-select2 select2-hidden-accessible"
                                            name="Batch"
                                            value={stockproduct.Batch}
                                            onChange={(e) =>
                                              handleProductInputChange(
                                                e,
                                                index,
                                                "Batch",
                                              )
                                            }
                                          >
                                            <option value="">
                                              Select Batch
                                            </option>
                                            {warehouse.map((wh: any) => (
                                              <option key={wh.id} value={wh.id}>
                                                {wh.name}
                                              </option>
                                            ))}
                                          </select>
                                        </td>
                                        <td style={{ width: "140px" }}>
                                          <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            name="Qty"
                                            placeholder="Qty"
                                            value={stockproduct.Qty}
                                            onChange={(e) =>
                                              handleProductInputChange(
                                                e,
                                                index,
                                                "Qty",
                                              )
                                            }
                                          />
                                        </td>
                                        <td style={{ width: "180px" }}>
                                          <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            name="Price"
                                            placeholder="Price"
                                            value={stockproduct.Price}
                                            onChange={(e) =>
                                              handleProductInputChange(
                                                e,
                                                index,
                                                "Price",
                                              )
                                            }
                                          />
                                        </td>
                                        <td
                                          className="pdisc1"
                                          style={{ width: "210px" }}
                                        >
                                          <div className="input-group">
                                            {stocktransferproducts.map(
                                              (
                                                stockproduct: any,
                                                index: number,
                                              ) => (
                                                <div key={index}>
                                                  {buttonVisibility[index] ? (
                                                    <button
                                                      className="btn btn-secondary"
                                                      type="button"
                                                      onClick={() =>
                                                        toggleButtonVisibility(
                                                          index,
                                                        )
                                                      } // Toggle on click
                                                    >
                                                      <i className="fa fa-percentage"></i>
                                                    </button>
                                                  ) : (
                                                    <button
                                                      className="btn btn-secondary"
                                                      type="button"
                                                      onClick={() =>
                                                        toggleButtonVisibility(
                                                          index,
                                                        )
                                                      } // Toggle on click
                                                    >
                                                      <i
                                                        className="fa fa-inr currency_style"
                                                        aria-hidden="true"
                                                      ></i>
                                                    </button>
                                                  )}
                                                </div>
                                              ),
                                            )}

                                            <input
                                              type="number"
                                              className="form-control form-control-sm"
                                              name="Discount"
                                              placeholder="Discount"
                                              value={stockproduct.Discount}
                                              onChange={(e) =>
                                                handleProductInputChange(
                                                  e,
                                                  index,
                                                  "Discount",
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td style={{ width: "180px" }}>
                                          <span className="m--font-info">
                                            {stockproduct.Taxable
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </td>
                                        <td style={{ width: "180px" }}>
                                          <span className="m--font-info">
                                            Rs. {stockproduct.Tax}
                                          </span>
                                        </td>
                                        <td>
                                          {/* Calculate Total Price Based on Discount Type */}
                                          <span className="m--font-bolder text-right">
                                            {buttonVisibility[index]
                                              ? // Percentage Discount
                                                (
                                                  Number(stockproduct.Qty) *
                                                    Number(stockproduct.Price) -
                                                  (Number(stockproduct.Qty) *
                                                    Number(stockproduct.Price) *
                                                    Number(
                                                      stockproduct.Discount,
                                                    )) /
                                                    100
                                                ).toFixed(2)
                                              : // Flat Discount
                                                (
                                                  Number(stockproduct.Qty) *
                                                    Number(stockproduct.Price) -
                                                  Number(stockproduct.Discount)
                                                ).toFixed(2)}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  ),
                                )}
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === "shippingDetails" && (
                      <div id="m_tabs_7_5" className="tab-pane active">
                        <div className="row">
                          <div className="form-group col-lg-3 col-md-3 col-sm-3">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Shipping Type
                            </label>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-0 p-0">
                              <div className="input-group">
                                <select
                                  className="form-control m-select2 select2-hidden-accessible"
                                  style={{ width: "100%" }}
                                  id="ShippingType"
                                  name="ShippingType"
                                  aria-placeholder="Select Shipping Type"
                                  aria-hidden="true"
                                  value={stocktransfer.ShippingType}
                                  //    onChange={handleInputChange}
                                >
                                  <option value="">Select Shipping Type</option>
                                  <option value="Delivery" selected>
                                    Delivery
                                  </option>
                                  <option value="Pickup">Pickup</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-lg-3 col-md-3 col-sm-3">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Shipping Date
                            </label>
                            <div className="input-group date">
                              <ReactDatePicker
                                selected={shippingdate}
                                onChange={(selectedDate) =>
                                  setshippingdate(selectedDate)
                                }
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm todaybtn-datepicker"
                                id="ShippingDate"
                                name="ShippingDate"
                                placeholderText="Select Shipping Date"
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-3 col-sm-3 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Reference No
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="ReferenceNo"
                              name="ReferenceNo"
                              placeholder="ReferenceNo"
                              value={stocktransfer.ReferenceNo}
                              data-fv-field="ReferenceNo"
                            />
                            {/* <small
        className="help-block"
        data-fv-validator="stringLength"
        data-fv-for="ReferenceNo"
        data-fv-result="NOT_VALIDATED"
        style={{ display: 'none' }}
    >
        The Reference No. must be less than 20 characters long
    </small> */}
                          </div>

                          <div className="form-group col-lg-3 col-md-3 col-sm-3">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Transport Date
                            </label>
                            <div className="input-group date">
                              {/* <input
            type="text"
            className="form-control form-control-sm"
            name="TransportDate"
            id="TransportDate"
            data-date-format="dd/mm/yyyy"
            data-date-start-date="01/04/2024"
            data-date-end-date="31/03/2025"
            placeholder="dd/mm/yyyy"
            value={stocktransfer.TransportDate}
        /> */}

                              <ReactDatePicker
                                selected={transportDate}
                                onChange={(selectedDate) =>
                                  settransportDate(selectedDate)
                                }
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm todaybtn-datepicker"
                                id="TransportDate"
                                name="TransportDate"
                                placeholderText="Select Date"
                              />
                            </div>
                          </div>

                          <div className="form-group col-md-3 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Mode of Transport
                            </label>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-3 p-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="ModeOfTransport"
                                name="ModeOfTransport"
                                placeholder="Mode of Transport"
                                value={stocktransfer.ModeOfTransport}
                                data-fv-field="ModeOfTransport"
                                onChange={handleInputChange}
                              />
                              {/* <small
            className="help-block"
            data-fv-validator="stringLength"
            data-fv-for="ModeOfTransport"
            data-fv-result="NOT_VALIDATED"
            style={{ display: 'none' }}
        >
            The Mode of Transport must be less than 20 characters long
        </small> */}
                            </div>
                          </div>

                          <div className="form-group col-md-3 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Transporter Name
                            </label>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-3 p-0">
                              <div className="input-group w-100">
                                <select
                                  className="form-control m-select2 select2-hidden-accessible"
                                  id="TransporterName"
                                  name="TransporterName"
                                  style={{ width: "100%" }}
                                  aria-placeholder="Select Transporter Name"
                                  aria-readonly="true"
                                >
                                  <option value="">
                                    Select Transporter Name
                                  </option>
                                </select>
                                <span
                                  className="select2 select2-container select2-container--default select2-container--below"
                                  dir="ltr"
                                  style={{ width: "100%" }}
                                >
                                  <span className="selection">
                                    <span
                                      className="select2-selection select2-selection--single"
                                      role="combobox"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      tabIndex={0}
                                      aria-labelledby="select2-transportContactVo-container"
                                    >
                                      <span
                                        className="select2-selection__rendered"
                                        id="select2-transportContactVo-container"
                                        role="textbox"
                                        aria-readonly="true"
                                      ></span>
                                      <span
                                        className="select2-selection__arrow"
                                        role="presentation"
                                      >
                                        <b role="presentation"></b>
                                      </span>
                                    </span>
                                  </span>
                                  <span
                                    className="dropdown-wrapper"
                                    aria-hidden="true"
                                  ></span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-3 col-sm-3 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Vehicle No
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="VehicleNo"
                              name="VehicleNo"
                              placeholder="VehicleNo"
                              value={stocktransfer.VehicleNo}
                              data-fv-field="VehicleNo"
                              onChange={handleInputChange}
                            />
                            <small
                              className="help-block"
                              data-fv-validator="stringLength"
                              data-fv-for="VehicleNo"
                              data-fv-result="NOT_VALIDATED"
                              style={{ display: "none" }}
                            >
                              The vehicle no. must be less than 15 characters
                              long
                            </small>
                            <small
                              className="help-block"
                              data-fv-validator="regexp"
                              data-fv-for="VehicleNo"
                              data-fv-result="NOT_VALIDATED"
                              style={{ display: "none" }}
                            >
                              Vehicle no. is not valid
                            </small>
                          </div>

                          <div className="col-lg-3 col-md-3 col-sm-3 shippingDiv">
                            <label className="col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
                              Weight
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="Weight"
                              name="Weight"
                              placeholder="Weight"
                              value={stocktransfer.Weight}
                              data-fv-field="Weight"
                              onChange={handleInputChange}
                            />
                            {/* <small
        className="help-block"
        data-fv-validator="stringLength"
        data-fv-for="Weight"
        data-fv-result="NOT_VALIDATED"
        style={{ display: 'none' }}
    >
        The weight must be less than 20 characters long
    </small>
    <small
        className="help-block"
        data-fv-validator="regexp"
        data-fv-for="Weight"
        data-fv-result="NOT_VALIDATED"
        style={{ display: 'none' }}
    >
        Weight is not valid
    </small> */}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="m-demo-icon p-0">
                  <div className="m-demo-icon__class">
                    <a
                      href="#additional_charge_div"
                      id="additional_charge_button"
                      data-toggle="collapse"
                      className="m-link m--font-boldest collapsed"
                      aria-expanded="false"
                    >
                      <i
                        className="flaticon-plus m--font-primary"
                        aria-hidden="true"
                      ></i>
                      Add Additional Charges
                    </a>
                  </div>
                  <div className="notes mb-2">
                    <label className="pt-0">Note</label>
                    <div className="col-lg-12 col-md-12 col-sm-12 p-0">
                      <div className="input-group">
                        <textarea
                          className="form-control form-control-sm"
                          name="Note"
                          value={stocktransfer.Note}
                          placeholder="Enter Note"
                          onChange={handleInputChange}
                          rows={2}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <table
                    className="table-sm m-table table-striped table-bordered collapse table"
                    id="tax_summary_table"
                  >
                    <thead>
                      <tr>
                        <th scope="row" className="col-lg-4 col-md-4 col-sm-12">
                          Tax
                        </th>
                        <th scope="row" className="col-lg-4 col-md-4 col-sm-12">
                          Tax Rate
                        </th>
                        <th scope="row" className="col-lg-4 col-md-4 col-sm-12">
                          Tax Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="m--hide" data-tax-item="template">
                        <td className="col-lg-4 col-md-4 col-sm-12"></td>
                        <td className="col-lg-4 col-md-4 col-sm-12"></td>
                        <td className="col-lg-4 col-md-4 col-sm-12"></td>
                      </tr>
                      <tr data-tax-item="65605">
                        <td className="col-lg-4 col-md-4 col-sm-12">CGST</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">9 %</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">6.93</td>
                      </tr>
                      <tr data-tax-item="65605">
                        <td className="col-lg-4 col-md-4 col-sm-12">SGST</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">9 %</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">6.93</td>
                      </tr>
                      <tr data-tax-item="cess">
                        <td className="col-lg-4 col-md-4 col-sm-12">CESS</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">0%</td>
                        <td className="col-lg-4 col-md-4 col-sm-12">0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <table className="table-sm table-bordered m-table mb-0 table text-right">
                  <tbody>
                    <tr>
                      <th>Flat Discount</th>
                      <td className="mb-0">
                        <div className="d-flex justify-content-end">
                          <input
                            type="text"
                            id="FlatDiscount"
                            name="FlatDiscount"
                            // onChange={() => checkFlat()}
                            style={{ maxWidth: "70px", textAlign: "right" }}
                            className="form-control form-control-sm"
                            value={stocktransfer.FlatDiscount}
                            placeholder="Flat Discount"
                            onChange={handleInputChange}
                          />
                          {totalButtonVisibility ? (
                            <button
                              className="btn btn-secondary"
                              type="button"
                              onClick={toggleTotalButtonVisibility} // Call the function here
                            >
                              <i className="fa fa-percentage"></i>
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary"
                              type="button"
                              onClick={toggleTotalButtonVisibility} // Call the function here
                            >
                              <i
                                className="fa fa-inr currency_style"
                                aria-hidden="true"
                              ></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <h6 className="mb-0">Total Amount</h6>
                      </th>
                      <td>
                        <h6 className="mb-0" id="totalpurchase">
                          {calculateTotalAmount()}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <h6 className="mb-0">Discount Amount</h6>
                      </th>
                      <td>
                        <h6 className="mb-0" id="total_disc">
                          {calculateDiscountAmount()}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="col-lg-8 col-md-8 col-sm-12">
                        <h6 className="mb-0">Gross Amount</h6>
                      </th>
                      <td className="col-lg-4 col-md-4 col-sm-12">
                        <h6 className="mb-0" id="total_amount">
                          {(
                            parseFloat(calculateTotalAmount()) -
                            parseFloat(calculateDiscountAmount())
                          ).toFixed(2)}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="col-lg-8 col-md-8 col-sm-12 m--font-info"
                      >
                        <a
                          href="#tax_summary_table"
                          data-toggle="collapse"
                          className="m-link m-link--info m-link--state"
                        >
                          Tax Amount
                        </a>
                      </th>
                      <td className="col-lg-4 col-md-4 col-sm-12">
                        <h6 className="mb-0" id="tax_amount">
                          {calculateTaxAmount()}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="col-lg-8 col-md-8 col-sm-12">
                        <a
                          href="javascript:void(0);"
                          data-toggle="m-popover"
                          data-trigger="click"
                          title=""
                          data-html="true"
                          id="roundoff_edit"
                          data-content={`
                        <div class="m-section__content">
                            <div class="form-group row">
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <input type="text" class="form-control form-control-sm text-right" name="roundoff" id="edit_roundoff" placeholder="Roundoff" value="" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-lg-6 col-md-6 col-sm-6">
                                    <a type="button" className="btn btn-secondary" data-popover-close="">Cancel</a>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <button type="button" className="btn btn-brand float-right" onClick={() => setRoundoff()}>Set</button>
                                </div>
                            </div>
                        </div>
                    `}
                          className="m-link m-link--info m-link--state"
                        >
                          Roundoff
                        </a>
                      </th>
                      <td className="col-lg-4 col-md-4 col-sm-12">
                        <h6 className="mb-0" id="round_off"></h6>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="col-lg-8 col-md-8 col-sm-12">
                        <h4 className="mb-0">Net Amount</h4>
                      </th>
                      <td className="col-lg-4 col-md-4 col-sm-12">
                        <h4 className="mb-0" id="net_amount">
                          {/* {totalButtonVisibility
            ? // Percentage Discount
              (Number(stocktransfer.NetAmount)  -
                (Number(stocktransfer.flatDiscount)) /
                  100).toFixed(2)
            : // Flat Discount
              (Number(stocktransfer.NetAmount) -
                Number(stocktransfer.flatDiscount)).toFixed(2)} */}
                          Rs. {calculateNetAmounts()}
                          {/* {calculateNetAmount()}  */}
                        </h4>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="m-container m-container--fluid m-container--full-height m-page__container"
              style={{ display: "flex" }}
            >
              <div
                style={{
                  justifyContent: "flex-start",
                  flex: "1 1 0",
                  display: "flex",
                  whiteSpace: "nowrap",
                }}
              >
                <a
                  href="/StockTransfer"
                  id="cancel_consumption"
                  className="btn btn-danger"
                >
                  Cancel
                </a>
              </div>
              <div
                style={{
                  justifyContent: "flex-end",
                  flex: "1 1 0",
                  display: "flex",
                  whiteSpace: "nowrap",
                }}
              >
                <button
                  type="submit"
                  className="btn btn-info mr-1"
                  id="save_materialcreation"
                  onClick={handleUpdate}
                >
                  Save
                </button>
              </div>
            </div>

            <ToastContainer />
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Alert in Modal</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {/* Product Updated Successfully ! */}
            </Alert>
          )}{" "}
          Bank Details Successfully !
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </DefaultLayout>
  );
};
export default StockTransferDetail;
