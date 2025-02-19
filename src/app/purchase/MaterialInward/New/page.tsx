"use client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import "@/css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from "react-bootstrap";

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
import { s } from "framer-motion/m";
import Time from "react-datepicker/dist/time";

let Token = process.env.BACKEND_TOKEN;
const MaterialInwardDetail = () => {
  const pathname = usePathname();
  const id = pathname.match(/\/MaterialInward\/(\d+)/)?.[1];

  const router = useRouter();
  const { token, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  interface MaterialInwardProduct {
    Id: number;
    FromBatch: string;
    ToBatch: string;
    TransferDate: Date;
    TransferNoPrefix: string;
    MaterialInwardNo: string;
    ItemCode: string;
    ProductName: string;
    Batch: string;
    POQty: string;
    Qty: number;
    UnitCost: string;
    MRP: string;
    SellingPrice: string;
    PurDisc1: string;
    PurDisc2: string;
    Margin: string;
    Price: number;
    Discount: number;
    Taxable: boolean; // Assuming this is a boolean field
    Tax: number;
    Total: number;
    FlatDiscount: number;
    MaterialInwardId: number;
  }

  const [MaterialInwardproducts, setMaterialInwardproducts] = useState<
    MaterialInwardProduct[]
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
  //     MaterialInwardId: Number
  // });

  const [MaterialInward, setMaterialInward] = useState<any>({
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

  const [index, setIndex] = useState(1);
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
  //  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
  //   const { name, value } = e.target;
  //   setMaterialInward((prevProduct: any) => ({
  //     ...prevProduct,  // Spread the previous state
  //     [name]: value   // Update the specific field
  //   }));

  // };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setMaterialInward((prev: any) => ({
      ...prev,
      [name]: value,
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

    setMaterialInwardproducts((prevProducts: any[]) =>
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
      "MaterialInwardproducts" + JSON.stringify(MaterialInwardproducts),
    );
  }, [MaterialInwardproducts]);

  const handleWarehouseChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedWarehouseId = event.target.value;
    setMaterialInward((prevBank: any) => ({
      ...prevBank, // Keep other properties intact
      WarehouseId: selectedWarehouseId, // Update WarehouseId based on selection
    }));
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const query = event.target.value; // Capture the search input value

    setMaterialInwardproducts((prevProducts: any[]) =>
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

    setMaterialInwardproducts((prevProducts: any[]) =>
      prevProducts.map(
        (product, i) =>
          i === index
            ? { ...product, Batch: value } // Update the specific field for the targeted product
            : product, // Leave other products unchanged
      ),
    );

    // If `fetchProduct` needs to be called with the selected value:
    fetchProduct(value, index);
  };

  const fetchProduct = async (query: string, index: number) => {
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

      // if (data && data.length > 0) {
      //   setMaterialInwardproducts([
      //     {
      //       Id: data[0]?.Id || 0,
      //       FromBatch: '',
      //       ToBatch: '',
      //       TransferDate: new Date(), // Default to current date or adjust as needed
      //       TransferNoPrefix: '',
      //       MaterialInwardNo: '',
      //       ItemCode: data[0]?.sku || '',
      //       ProductName: data[0]?.name || '',
      //       Batch: '',
      //       Qty: 0, // Default to 0 or adjust as needed
      //       Price: data[0]?.price || 0,
      //       Discount: 0, // Default to 0 or adjust as needed
      //       Taxable: false, // Default to false or adjust as needed
      //       Tax: 0,
      //       Total: 0,
      //       FlatDiscount: 0,
      //       MaterialInwardId: 0,
      //     },
      //   ]);
      // }
      if (data && data.length > 0) {
        // Update MaterialInwardproducts at the specific index
        setMaterialInwardproducts((prevState) => {
          const updatedProducts = [...prevState];

          updatedProducts[index] = {
            ...updatedProducts[index], // Retain existing properties of the product at this index
            Id: data[0]?.Id || 0,
            FromBatch: "",
            ToBatch: "",
            TransferDate: new Date(),
            TransferNoPrefix: "",
            MaterialInwardNo: "",
            ItemCode: data[0]?.sku || "",
            ProductName: data[0]?.name || "",
            Batch: "",
            Qty: 0,
            Price: data[0]?.price || 0,
            Discount: 0,
            Taxable: false,
            Tax: 0,
            Total: 0,
            FlatDiscount: 0,
            MaterialInwardId: 0,
          };

          return updatedProducts; // Return updated state
        });
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
      //  console.log("Search query product: " + JSON.stringify(query));
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
  const updateMaterialInward = async (MaterialInward: any) => {
    try {
      //handleOpenModal();

      console.log(JSON.stringify(MaterialInward));

      MaterialInward.TotalAmount = calculateTotalAmount();
      MaterialInward.DiscountAmount = calculateDiscountAmount();
      MaterialInward.GrossAmount = (
        parseFloat(calculateTotalAmount()) -
        parseFloat(calculateDiscountAmount())
      ).toFixed(2);
      MaterialInward.TaxAmount = calculateTaxAmount();
      MaterialInward.NetAmount = calculateNetAmounts();
      MaterialInward.Id = 0;
      MaterialInward.CreatedDate = new Date();
      MaterialInward.ShippingDate = shippingdate ? shippingdate : new Date();
      MaterialInward.transportDate = transportDate ? transportDate : new Date();
      //MaterialInward.TotalCurrency=
      console.log(
        "Before inserted stock transfer Data" + JSON.stringify(MaterialInward),
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/InsertMaterialInwardDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(MaterialInward),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Inserted data" + JSON.stringify(data.Id));
      return data.Id;
    } catch (error) {
    } finally {
    }
  };
  const updateMaterialInwardProducts = async (
    MaterialInwardproducts: any[],
    Id: Number,
  ) => {
    try {
      // Iterate over each product in the MaterialInwardproducts array
      MaterialInwardproducts.forEach(async (MaterialInwardproduct: any) => {
        // You can add custom logic here for each individual product

        MaterialInwardproduct.Id = 0;
        MaterialInwardproduct.MaterialInwardId = Id;

        MaterialInwardproduct.TransferNoPrefix =
          MaterialInwardproduct.TransferNoPrefix;
        MaterialInwardproduct.MaterialInwardNo =
          MaterialInwardproduct.MaterialInwardNo;
        console.log(
          "Before inserted stock transfer product Data:",
          JSON.stringify(MaterialInwardproduct),
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/InsertMaterialInwardProductsDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(MaterialInwardproduct),
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
    const fetchMaterialInward = async () => {
      setIsLoading(true); // Ensure loading state is set before fetching.
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAllMaterialInwardDetailsById?Id=${id}`,
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
        setMaterialInward(data);
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

    const fetchMaterialInwardProducts = async () => {
      setIsLoading(true); // Ensure loading state is set before fetching.

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAllMaterialInwardProductDetailsByMaterialInwardId?Id=${id}`,
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
        setMaterialInwardproducts(data);
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

    // fetchMaterialInward();
    fetchWarehouse();
    //fetchMaterialInwardProducts();
  }, [id, token]); // Adding `id` and `token` to the dependency array.

  const handleUpdate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      // Assuming MaterialInward.ToLocation is the field you're validating
      if (!MaterialInward.ToLocation) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please select a To Branch.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      if (!MaterialInward.TransferDate) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please select a Transfer Date.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      if (!MaterialInward.TransferNo) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please select a Transfer No.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      if (MaterialInwardproducts.length === 0) {
        // Show toast error message if ToLocation is not selected
        toast.error("Please add at least one product.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const invalidProductQty = MaterialInwardproducts.find(
        (product) => !product.Qty || product.Qty === 0,
      );

      if (invalidProductQty) {
        toast.error("Please ensure all products have a valid quantity.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const invalidProductPrice = MaterialInwardproducts.find(
        (product) => !product.Price || product.Price === 0,
      );

      if (invalidProductPrice) {
        toast.error("Please ensure all products have a valid Price.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const invalidProductDiscount = MaterialInwardproducts.find(
        (product) => !product.Discount || product.Discount === 0,
      );

      if (invalidProductDiscount) {
        toast.error("Please ensure all products have a valid Discount.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent form submission
      }

      const response = await updateMaterialInward(MaterialInward);
      const res = await updateMaterialInwardProducts(
        MaterialInwardproducts,
        response,
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const calculateNetAmounts = () => {
    const total = MaterialInwardproducts.reduce((acc, product) => {
      const qty = Number(product.Qty);
      const price = Number(product.Price);
      const discount = Number(product.Discount);

      // Calculate the product total with the appropriate discount logic
      const productTotal = buttonVisibility[
        MaterialInwardproducts.indexOf(product)
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
    const total = MaterialInwardproducts.reduce((acc, product) => {
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
    console.log(
      "calculateDiscountAmount" + totalAmount + "netAmount" + netAmount,
    );
    return (totalAmount - netAmount).toFixed(2); // Calculate the discount amount and return it as a string with two decimals
  };

  const calculateTaxAmount = () => {
    const total = MaterialInwardproducts.reduce((acc, product) => {
      const Tax = Number(product.Tax);
      return acc + Tax;
    }, 0);

    return total.toFixed(2);
  };

  const calculateNetAmount = () => {
    const netAmount = parseFloat(calculateNetAmounts());
    const discount = parseFloat(MaterialInward.FlatDiscount.toString());

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

  // const handleAddRow = (index: number) => {
  //   setMaterialInwardproducts((prevProducts:any) => [
  //     ...prevProducts,
  //     {
  //       ItemCode: "",
  //       ProductName: "",
  //       Batch: "",
  //       Qty: 0,
  //       Price: 0,
  //       Discount: 0,
  //       Taxable: false,
  //       Tax: 0,
  //     },
  //   ]);

  //   setIndex(index + 1); // Increment the index for the new row
  // };

  const handleAddRow = (index: number) => {
    setIndex(index + 2);
  };
  const removeRow = (indexToRemove: any) => {
    setMaterialInwardproducts((prevProducts) =>
      prevProducts.filter((_, index) => index !== indexToRemove),
    );
  };

  // if (isLoading) return (
  //   <DefaultLayout>
  //      <div>Loading...</div></DefaultLayout>);
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="New Material Inward"
        links={[
          { label: "Material Inward", route: "/purchase/MaterialInward" },
        ]}
      />
      <div className="common_page_layout MaterialInward-new-page">
        <div className="form-container">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Select Supplier
                  <small
                    style={{ fontSize: "1.25rem", color: "red" }}
                    className="text-danger"
                  >
                    *
                  </small>
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="SupplierName"
                      name="SupplierName"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row has-success">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Material Inward Date
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
                      id="OrderDate"
                      name="OrderDate"
                      placeholderText="Select Date"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Material Inward No.
                  <small
                    style={{ fontSize: "1.25rem", color: "red" }}
                    className="text-danger"
                  ></small>
                </label>
                <div className="col-lg-12 col-12">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="OrderNo"
                    placeholder="Order No"
                    value={MaterialInward.Prefix}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row has-success">
                <label className="col-lg-12  col-12 col-md-12 col-sm-12">
                  Shipping Note
                  <small
                    style={{ fontSize: "1.25rem", color: "red" }}
                    className="text-danger"
                  >
                    *
                  </small>
                </label>
                <div className="col-lg-12 col-12">
                  <div className="input-group date">
                    <input type="text" placeholder="Enter notes" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Place of Supply:
                </label>
                <label className="col-lg-12 col-md-12 col-sm-12">GSTIN:</label>
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Billing Address
                </label>
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Billing Address is Not Provided
                </label>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Select Purchase
                  <small
                    style={{ fontSize: "1.25rem", color: "red" }}
                    className="text-danger"
                  >
                    *
                  </small>
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="SupplierName"
                      name="SupplierName"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Received By
                  <small
                    style={{ fontSize: "1.25rem", color: "red" }}
                    className="text-danger"
                  ></small>
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="SupplierName"
                      name="SupplierName"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  PO Date
                  <small
                    style={{ fontSize: "1.25rem", color: "red" }}
                    className="text-danger"
                  ></small>
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="SupplierName"
                      name="SupplierName"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-lg-12 col-md-12 col-sm-12">
                  Tax Type
                  <small
                    style={{ fontSize: "1.25rem", color: "red" }}
                    className="text-danger"
                  ></small>
                </label>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="input-group">
                    <select>
                      <option value="Default">Default</option>
                      <option value="TaxInclusive">Tax Inclusive</option>
                      <option value="TaxExclusive">Tax Exclusive</option>
                      <option value="OutofScope">Out of Scope</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="m-portlet__head m-portlet__head__sm">
                <div className="m-portlet__head-tools">
                  <button
                    className={`nav-link m-tabs__link ${activeTab === "productDetails" ? "active show" : ""}`}
                    onClick={() => handleTabChange("productDetails")}
                    role="tab"
                    aria-selected={activeTab === "productDetails"}
                  >
                    Product Details
                  </button>
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
                                  <th>PO Qty</th>
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
                                    Unit Cost
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
                                    MRP
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
                                    Selling Price
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
                                    Pur. Disc1
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
                                    Pur. Disc2
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
                                  <th>Tax</th>
                                  <th>
                                    Landing Cost
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
                                    Margin (%)
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
                                  <th>Total</th>
                                </tr>
                              </thead>

                              {Array.from({ length: index }).map((_, index) => (
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
                                        href="#"
                                        data-item-remove=""
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent default anchor behavior
                                          removeRow(index); // Call the removeRow function
                                        }}
                                        className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                      >
                                        <i className="fa fa-times"></i>
                                      </a>
                                      <a
                                        tabIndex={-1}
                                        href="javascript:void(0)"
                                        className="btn btn-sm btn-outline-primary m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                        data-add-item=""
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent default anchor behavior
                                          handleAddRow(index); // Pass the index to handleAddRow
                                        }}
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
                                          value={
                                            MaterialInwardproducts[index]
                                              ?.ItemCode || ""
                                          }
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
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.ProductName || ""
                                        }
                                        readOnly
                                      />
                                      <span
                                        id="dropdown"
                                        className="form-control"
                                        onClick={() => handleArrowClick(index)}
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
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.Batch || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "Batch",
                                          )
                                        }
                                      >
                                        <option value="">Select Batch</option>
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
                                        name="POQty"
                                        placeholder="POQty"
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.POQty || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "POQty",
                                          )
                                        }
                                      />
                                    </td>
                                    <td style={{ width: "140px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="Qty"
                                        placeholder="Qty"
                                        value={
                                          MaterialInwardproducts[index]?.Qty ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "Qty",
                                          )
                                        }
                                      />
                                    </td>
                                    <td style={{ width: "140px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="UnitCost"
                                        placeholder="UnitCost"
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.UnitCost || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "UnitCost",
                                          )
                                        }
                                      />
                                    </td>
                                    <td style={{ width: "180px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="MRP"
                                        placeholder="MRP"
                                        value={
                                          MaterialInwardproducts[index]?.MRP ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "MRP",
                                          )
                                        }
                                      />
                                    </td>
                                    <td style={{ width: "180px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="SellingPrice"
                                        placeholder="SellingPrice"
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.SellingPrice || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "SellingPrice",
                                          )
                                        }
                                      />
                                    </td>

                                    <td style={{ width: "180px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="PurDisc1"
                                        placeholder="PurDisc1"
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.PurDisc1 || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "PurDisc1",
                                          )
                                        }
                                      />
                                    </td>
                                    <td style={{ width: "180px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="PurDisc2"
                                        placeholder="PurDisc2"
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.PurDisc2 || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "PurDisc2",
                                          )
                                        }
                                      />
                                    </td>
                                    {/* <td
                                      className="pdisc1"
                                      style={{ width: "210px" }}
                                    >
                                      <div className="input-group">
                                        {Array.from({ length: 1 }).map(
                                          (_, index) => (
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
                                          value={
                                            MaterialInwardproducts[index]
                                              ?.Discount || ""
                                          }
                                          onChange={(e) =>
                                            handleProductInputChange(
                                              e,
                                              index,
                                              "Discount",
                                            )
                                          }
                                        />
                                      </div>
                                    </td> */}
                                    {/* <td style={{ width: "180px" }}>
                                      <span className="m--font-info">
                                        {MaterialInwardproducts[index]?.Taxable
                                          ? "Yes"
                                          : "No"}
                                      </span>
                                    </td> */}
                                    <td style={{ width: "180px" }}>
                                      <span className="m--font-info">
                                        Rs.{" "}
                                        {MaterialInwardproducts[index]?.Tax ||
                                          ""}
                                      </span>
                                    </td>

                                    <td style={{ width: "180px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="Price"
                                        placeholder="Price"
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.Price || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "Price",
                                          )
                                        }
                                      />
                                    </td>

                                    <td style={{ width: "180px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        name="Margin"
                                        placeholder="Margin"
                                        value={
                                          MaterialInwardproducts[index]
                                            ?.Margin || ""
                                        }
                                        onChange={(e) =>
                                          handleProductInputChange(
                                            e,
                                            index,
                                            "Margin",
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      {/* Calculate Total Price Based on Discount Type */}
                                      <span className="m--font-bolder text-right">
                                        {buttonVisibility[index]
                                          ? // Percentage Discount
                                            (
                                              Number(
                                                MaterialInwardproducts[index]
                                                  ?.Qty,
                                              ) *
                                                Number(
                                                  MaterialInwardproducts[index]
                                                    ?.Price,
                                                ) -
                                              (Number(
                                                MaterialInwardproducts[index]
                                                  ?.Qty,
                                              ) *
                                                Number(
                                                  MaterialInwardproducts[index]
                                                    ?.Price,
                                                ) *
                                                Number(
                                                  MaterialInwardproducts[index]
                                                    ?.Discount,
                                                )) /
                                                100
                                            ).toFixed(2)
                                          : // Flat Discount
                                            (
                                              Number(
                                                MaterialInwardproducts[index]
                                                  ?.Qty,
                                              ) *
                                                Number(
                                                  MaterialInwardproducts[index]
                                                    ?.Price,
                                                ) -
                                              Number(
                                                MaterialInwardproducts[index]
                                                  ?.Discount,
                                              )
                                            ).toFixed(2)}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              ))}
                            </table>
                          </div>
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
                        value={MaterialInward.Note}
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
                          value={MaterialInward.FlatDiscount}
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
              (Number(MaterialInward.NetAmount)  -
                (Number(MaterialInward.flatDiscount)) /
                  100).toFixed(2)
            : // Flat Discount
              (Number(MaterialInward.NetAmount) -
                Number(MaterialInward.flatDiscount)).toFixed(2)} */}
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
                href="/purchase/MaterialInward"
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
export default MaterialInwardDetail;
