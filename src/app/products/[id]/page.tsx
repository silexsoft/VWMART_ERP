"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from "react-bootstrap";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import "@/css/custom.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
//import { Editor } from "@tinymce/tinymce-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Link from "next/link";
import { set } from "date-fns";
import { de, se } from "date-fns/locale";

let Token = process.env.BACKEND_TOKEN;
const ProductDetail = () => {
  const pathname = usePathname();
  const id = pathname.match(/\/products\/(\d+)/)?.[1];

  const router = useRouter();
  const { token, logout } = useAuth();

  interface Warehouse {
    id: number;
    name: string;
    inventory?: {
      stock_quantity: number;
      reserved_quantity: number;
    };
  }

  // interface ProductInventory {
  //   product_id: number;
  //   warehouse_id: number;
  //   stock_quantity: number;
  //   reserved_quantity: number;
  //   use:boolean
  // }

  type ProductInventory = {
    warehouse_id: number;
    product_id: string;
    stock_quantity: number;
    reserved_quantity: number;
    use: string; // Make sure this field is included if it's required in your type
    [key: string]: string | number;
  };

  //  const [inventory, setInventory] =  useState([]);
  //  const [warehouses, setWarehouses] = useState<Warehouse[]>([]); const [categories, setCategories] = useState([]);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [DeletewarehouseInventory, setDeletewarehouseInventory] = useState<
    ProductInventory[]
  >([]);

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showInventoryAlert, setShowInventoryAlert] = useState(false);

  const handleOpenInventoryModal = () => setShowInventoryModal(true);
  const handleCloseInventoryModal = () => setShowInventoryModal(false);

  const [taxCategory, SettaxCategory] = useState<any>({
    name: "",
    id: "",
  });

  const [product, setProduct] = useState<any>({
    id: "",
    name: "",
    sku: "",
    short_description: "",
    full_description: "",
    published: false,
    old_price: Number,
    price: Number,
    product_cost: Number,
    weight: Number,
    order_minimum_quantity: Number,
    is_tax_exempt: false,
    tax_category_id: 0,
    //deleted:false
  });

  interface Category {
    id: string;
    name: string;
  }
  interface Brand {
    id: string;
    name: string;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [itemCode, setItemCode] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [productName, setProductName] = useState("");
  const [printName, setPrintName] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [subCategoryId, setSubCategoryId] = useState<string>("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState<string>("");

  const [selectedcategory, setSelectedcategory] = useState<number[]>([]); // Use an array for IDs
  const [selectedbrand, setSelectedbrand] = useState<number[]>([]); // Use an array for IDs

  const [nutritionItems, setNutritionItems] = useState([]);

  const addNutrition = () => {
    // setNutritionItems([
    //     ...nutritionItems,
    //     { name: '', value: '', index: nutritionItems.length }
    // ]);
  };

  const removeNutrition = (index: any) => {
    setNutritionItems(nutritionItems.filter((item, i) => i !== index));
  };
  const handleCategoryChange = (event: any) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId); // Update the selected category
    setSelectedcategory([selectedCategoryId]);
    // Fetch subcategories based on the selected category ID
    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/GetAllCategoriesByParentCategoryId/${selectedCategoryId}?showHidden=false`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    )
      .then((response) => {
        console.log("Response:", response); // Log response to inspect it
        return response.json(); // Only parse as JSON if the response is valid
      })
      .then((data) => {
        setSubCategories(data); // Set subcategories data to state
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
      });
  };
  const fetchTaxCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/TaxCategory/GetAll`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "", // Use your actual auth token
          },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched tax category:", data);
      SettaxCategory(data);
    } catch (error) {
      console.error("Failed to fetch tax category:", error);
    } finally {
      //  setIsLoading(false);
    }
  };
  const setSubCategory = (categoryId: any, subCategoryId: any) => {
    console.log(`Setting subcategory for: ${categoryId}, ${subCategoryId}`);
    // Add subcategory logic here if needed
  };

  const [warningVisible, setWarningVisible] = useState(false);

  const handleSubCategoryChange = (e: any) => {
    const selectedValue = e.target.value;
    setSubCategoryId(selectedValue);

    // Show or hide the warning based on selection
    if (!selectedValue) {
      setWarningVisible(true);
    } else {
      setWarningVisible(false);
    }
  };

  const handleBrandChange = (e: any) => {
    const selectedValue = e.target.value;
    // setBrandId(selectedValue);
    setBrandId(selectedValue); // Update the selected category
    setSelectedbrand([selectedValue]);
  };

  //const handleInputChange = (e:any) => setItemCode(e.target.value);
  const handleCheckboxChange = (e: any) => setAutoGenerate(e.target.checked);

  //  Handle input change
  // const handleInputChange = (
  //   e:
  //     | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //     | React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   const { name, value } = e.target;
  //   setProduct((prevProduct: any) => ({
  //     ...prevProduct, // Spread the previous state
  //     [name]: value, // Update the specific field
  //   }));
  // };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement; // Explicit type assertion

    setProduct((prevProduct: any) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value, // Use `checked` for checkboxes, `value` otherwise
    }));
  };

  const handleWarehouseInventoryChange = (
    value: boolean | number, // Accepts boolean for checkboxes, number for input boxes
    warehouseId: number,
    field: keyof ProductInventory, // Restrict field to keys of ProductInventory
  ) => {
    setInventory((prevInventory) => {
      const inventoryExists = prevInventory.some(
        (inv) => inv.warehouse_id === warehouseId,
      );

      if (typeof value === "boolean" && value === false) {
        setDeletewarehouseInventory((prevDeletewarehouseInventory) => [
          ...prevDeletewarehouseInventory,
          ...prevInventory.filter((inv) => inv.warehouse_id === warehouseId),
        ]);

        setInventory((prevInventory) =>
          prevInventory.filter((inv) => inv.warehouse_id !== warehouseId),
        );
      }

      if (typeof value === "boolean" && value === true) {
        setDeletewarehouseInventory((prevDeletewarehouseInventory) =>
          prevDeletewarehouseInventory.filter(
            (inv) => inv.warehouse_id !== warehouseId,
          ),
        );
      }

      if (inventoryExists) {
        // Update the existing inventory record
        return prevInventory.map((inv) =>
          inv.warehouse_id === warehouseId
            ? {
                ...inv,
                [field]: value, // Update the specific field
                ...(field === "stock_quantity" &&
                  typeof value === "boolean" &&
                  !value && {
                    stock_quantity: 0,
                    reserved_quantity: 0,
                  }), // Reset fields if checkbox is unchecked
              }
            : inv,
        ) as ProductInventory[];
      } else {
        // Create a new inventory record if it doesn't exist
        return [
          ...prevInventory,
          {
            warehouse_id: warehouseId,
            product_id: "", // Default product ID
            stock_quantity: typeof value === "boolean" && !value ? 0 : 0,
            reserved_quantity: typeof value === "boolean" && !value ? 0 : 0,
            use: "default", // Default value for 'use'
            //[field]: value, // Add the dynamically updated field
          } as ProductInventory,
        ];
      }
    });
  };

  useEffect(() => {
    console.log("Updated inventory:", inventory);
  }, [inventory]);

  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, checked } = event.target;
  //   setProduct((prevProduct: any
  //   ) => ({
  //     ...prevProduct,
  //     [name]: checked,
  //   }));
  // };

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    console.log("full description" + data);
    setProduct((prevProduct: any) => ({
      ...prevProduct, // Spread the previous state
      ["full_description"]: data, // Update the specific field
    }));
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }

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
      .then((data) => {
        setCategories(data.items); // Set categories data to state
      })
      .catch((error) => console.error("Error fetching categories:", error));

    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Manufacturer/GetAll?storeId=0&pageIndex=0&pageSize=2147483647&showHidden=false`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setBrands(data.items); // Set categories data to state
      })
      .catch((error) => console.error("Error fetching brands:", error));

    /// set product category

    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductCategory/GetProductCategoryIds/${id}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data fnd" + JSON.stringify(data));
        if (data && Object.keys(data).length > 0) {
          const firstKey = Object.keys(data)[0];
          setSelectedcategory(data[firstKey]); // Set subcategory IDs
        } else {
          console.warn(
            "Empty or invalid response. No data found for the given ID:",
            id,
          );
          setSelectedcategory([]); // Set an empty array or default value
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
    console.log(selectedcategory);

    // get product Manufacturer
    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductManufacturer/GetProductManufacturersByProductId/${id}?showHidden=false`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Manufacturer data found: " + JSON.stringify(data));
        if (Array.isArray(data) && data.length > 0) {
          const firstManufacturerId = data[0]?.manufacturer_id; // Get the `manufacturer_id` of the first object
          setSelectedbrand([firstManufacturerId]); // Set the manufacturer_id
        } else {
          console.warn(
            "Empty or invalid response. No data found for the given ID:",
            id,
          );
          setSelectedbrand([]); // Set null or a default value for no data
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
    console.log("selectedbrand" + selectedbrand);

    fetchTaxCategory();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const response = await updateProduct(product);

      if (selectedcategory.length !== 0) {
        const categoryResonse = await updateProductCategory(selectedcategory);
      }
      if (selectedbrand.length !== 0) {
        const manufacturerResponse =
          await updateProductManufacturer(selectedbrand);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const updateProductCategory = async (selectedcategory: any) => {
    //alert(selectedcategory[0]);
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductCategory/Create`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify({
            product_id: id,
            category_id: selectedcategory[0],
            is_featured_product: false,
            display_order: 0,
            id: 0,
          }),
        },
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data); // Handle the response data
        })
        .catch((error) => {
          console.error("Error:", error); // Handle any errors
        });
    } catch {}
  };

  const updateProductManufacturer = async (selectedbrand: any) => {
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductManufacturer/Create`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify({
            product_id: id,
            manufacturer_id: selectedbrand[0],
            is_featured_product: false,
            display_order: 0,
            id: 0,
          }),
        },
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data); // Handle the response data
        })
        .catch((error) => {
          console.error("Error:", error); // Handle any errors
        });
    } catch {}
  };

  const handleUpdateInventory = async () => {
    try {
      const response = await updateProductInventory(
        inventory,
        DeletewarehouseInventory,
      );
    } catch (error) {
      console.error("Error updating product inventory:", error);
    }
  };

  const updateProduct = async (productData: any) => {
    try {
      handleOpenModal();
      console.log("productData" + JSON.stringify(productData));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/Update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(productData),
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

  const updateProductInventory = async (
    productInventories: any[],
    DeletewarehouseInventory: any[],
  ) => {
    handleOpenInventoryModal();
    console.log(
      "DeletewarehouseInventory" + JSON.stringify(DeletewarehouseInventory),
    );
    try {
      for (const deletewarehouseInventory of DeletewarehouseInventory) {
        try {
          const responses = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductWarehouse/Delete/${deletewarehouseInventory.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            },
          );
          if (!responses.ok) {
            throw new Error(`Error: ${responses.statusText}`);
          }
        } catch {}
      }
    } catch {}

    for (const productInventory of productInventories) {
      try {
        // if(productInventory.stock_quantity === ""){
        //   const responses = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductWarehouse/Delete/${productInventory.id}`,
        //     {
        //       method: 'DELETE',
        //       headers: {
        //         'Content-Type': 'application/json',
        //         accept: 'application/json',
        //         Authorization:token ? `Bearer ${token}` : '',
        //       },
        //       body: JSON.stringify(productInventory),
        //     });
        //     if (!responses.ok) {
        //       throw new Error(`Error: ${responses.statusText}`);
        //     }
        // }

        if (productInventory.stock_quantity === true) {
          productInventory.stock_quantity = 0;
        }

        if (!productInventory.product_id) {
          const pathname = window.location.pathname;
          const productIdMatch = pathname.match(/\/products\/(\d+)/);
          if (productIdMatch) {
            productInventory.product_id = productIdMatch[1];
            const responses = await fetch(
              `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductWarehouse/Create`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                  Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(productInventory),
              },
            );
            if (!responses.ok) {
              throw new Error(`Error: ${responses.statusText}`);
            }
          }
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductWarehouse/Update`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify(productInventory),
            },
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        }

        //console.log("Inside loop :", JSON.stringify(productInventory));

        //const data = await response.json();s
        //console.log("Updated product inventory:", data);
      } catch (error) {
        console.error("Failed to update product inventory:", error);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetProductsByIds/${id}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "", // Use your actual auth token
            },
          },
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched product:", data);
        setProduct(data[0]);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProductsInventory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/ProductWarehouse/GetAllProductWarehouseInventoryRecords/${id}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data: ProductInventory[] = await response.json();
        // const data = await response.json();
        console.log("Fetched fetch product Inventory:", data);
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch product Inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWarehouseNames = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/GetAll`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data: Warehouse[] = await response.json();
        //   const data = await response.json();
        console.log("Fetched fetch warehouse names:", data);
        //Setwarehouse(data);

        setWarehouses(data || []);
      } catch (error) {
        setWarehouses([]);
        console.error("Failed to fetch warehouse names:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    fetchProductsInventory();
    fetchWarehouseNames();
  }, []);

  // Map inventory data to each warehouse
  const warehousesWithInventory = warehouses.map((warehouse) => {
    const matchingInventory = Array.isArray(inventory)
      ? inventory.find((inv) => inv.warehouse_id === warehouse.id)
      : null;

    return {
      ...warehouse,
      inventory: matchingInventory
        ? {
            stock_quantity: matchingInventory.stock_quantity,
            reserved_quantity: matchingInventory.reserved_quantity,
          }
        : {
            // stock_quantity: 0,
            //reserved_quantity: 0,
          },
    };
  });

  if (isLoading)
    return (
      <DefaultLayout>
        <div>Loading...</div>
      </DefaultLayout>
    );
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Edit Product"
        links={[{ label: product.name, route: "/products" }]}
      />
      <div className="product-detail-page common_page_layout">
        <div className="productdetailpage">
          {/* <div className='product-details-header'>
      <h3 className='header-font'>Edit Product</h3>
            <ul className="product-page-header-ul">
                  <li className="product-page-header-li">
                        <a href="/" className="m-nav__link m-nav__link--icon">                      
                        <i className="fa-solid fa-house"></i>
                         </a>
                  </li>                  
            </ul>
            <ul className="product-page-header-ul">
                <li className='product-page-header-li'>
                        <a href="/products"> 
                        <span>- Product</span>
                        </a>
                  </li>
            </ul>
            <ul className="product-page-header-ul">
                <li className='product-page-header-li'>
                        <a href="/products"> 
                        <span>{product.name}</span>
                        </a>
                  </li>
            </ul>
     </div>  */}

          <div className="productdetailpage_formcontainer">
            <div className="form-container">
              <h2>General Details</h2>
              <form>
                {/* Item Code/Barcode */}
                <div className="row ">
                  <div className="col-md-3">
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-md-6 col-6 mr-0 pr-0"
                      >
                        Item Code/Barcode
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <label
                        style={{ fontWeight: "bold", display: "none" }}
                        className="col-md-6 col-6 mr-0 text-right"
                      >
                        <input
                          type="checkbox"
                          name="autogenratebarcode"
                          id="autogenratebarcode"
                          value={product.sku}
                          checked={autoGenerate}
                          //onChange={handleCheckboxChange}
                        />
                        &nbsp;Auto Generate
                        <span></span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="sku"
                          name="sku"
                          placeholder="Item Code/Barcode"
                          data-fv-field="sku"
                          value={product.sku}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Product Name
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="name"
                          id="name"
                          placeholder="Product Name"
                          value={product.name}
                          onChange={handleInputChange}
                          data-fv-field="name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3" style={{ display: "none" }}>
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Print Name
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-8">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="displayName"
                          id="displayName"
                          placeholder="Print Name"
                          value={product.name}
                          onChange={handleInputChange}
                          data-fv-field="displayName"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group row has-success">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Category
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <select
                            className="form-control m-select2"
                            id="category_id"
                            name="categoryVo.categoryId"
                            onChange={handleCategoryChange}
                            value={selectedcategory[0]}
                            data-fv-field="categoryVo.categoryId"
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-md-12"
                      >
                        Sub Category
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        ></span>
                      </label>
                      <div className="col-md-12">
                        <div className="input-group">
                          <select
                            className="form-control m-select2"
                            id="sub_category_id"
                            name="subCategoryVo.categoryId"
                            value={subCategoryId}
                            onChange={handleSubCategoryChange}
                            // placeholder="Select Sub Category"
                            data-allow-clear="true"
                          >
                            <option value="">Select Sub Category</option>
                            {subCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group row has-success">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Select Brand
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <select
                            className="form-control m-select2"
                            id="brand"
                            name="brandVo.brandId"
                            value={selectedbrand[0]}
                            onChange={handleBrandChange}
                            //placeholder="Select Brand"
                            data-select2-id="brand"
                            aria-hidden="true"
                            data-fv-field="brandVo.brandId"
                          >
                            <option value="">Select Brand</option>
                            {brands.map((brands) => (
                              <option key={brands.id} value={brands.id}>
                                {brands.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2" style={{ display: "none" }}>
                    <div className="form-group row">
                      <label
                        className="col-md-12"
                        style={{ fontWeight: "bold" }}
                      >
                        Sub Brand
                      </label>
                      <div className="col-md-12">
                        <div className="input-group">
                          <select
                            className="form-control m-select2 select2-hidden-accessible"
                            id="sub_brand_id"
                            name="subBrandVo.brandId"
                            data-default=""
                            //placeholder="Select Sub Brand"
                            data-allow-clear="true"
                            data-select2-id="sub_brand_id"
                            // tabIndex="-1"
                            aria-hidden="true"
                          >
                            <option value="" data-select2-id="26">
                              Select Sub Brand
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2" style={{ display: "none" }}>
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Select UOM
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <select
                            className="form-control m-select2 select2-hidden-accessible"
                            id="uom"
                            // onChange={() => uomChange()}
                            name="unitOfMeasurementVo.measurementId"
                            //placeholder="Unit of Measurements"
                            data-select2-id="uom"
                            //tabIndex="-1"
                            aria-hidden="true"
                            data-fv-field="unitOfMeasurementVo.measurementId"
                          >
                            <option value="">Select Unit Of Measurement</option>
                            <option value="46170" data-decimal="2">
                              Pcs
                            </option>
                            <option
                              value="45774"
                              data-decimal="1"
                              data-select2-id="10"
                            >
                              PIECES
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2" style={{ display: "none" }}>
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        HSN Code
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="hsnCode"
                          placeholder="HSN Code"
                          value=""
                          data-fv-field="hsnCode"
                        />
                        <small
                          className="help-block"
                          data-fv-validator="callback"
                          data-fv-for="hsnCode"
                          data-fv-result="NOT_VALIDATED"
                          style={{ display: "none" }}
                        >
                          HSN Code is required when Cess is checked
                        </small>
                        <small
                          className="help-block"
                          data-fv-validator="stringLength"
                          data-fv-for="hsnCode"
                          data-fv-result="NOT_VALIDATED"
                          style={{ display: "none" }}
                        >
                          The hsn code must be 4-8 characters long
                        </small>
                        <small
                          className="help-block"
                          data-fv-validator="regexp"
                          data-fv-for="hsnCode"
                          data-fv-result="NOT_VALIDATED"
                          style={{ display: "none" }}
                        >
                          The hsn can only consist of numbers
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2" style={{ display: "none" }}>
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Purchase Tax
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <select
                            className="form-control m-select2 select2-hidden-accessible"
                            id="purchase_tax"
                            name="purchaseTaxVo.taxId"
                            // placeholder="Select Tax"
                            //onChange={() => setsalestax()}
                            data-select2-id="purchase_tax"
                            aria-hidden="true"
                            data-fv-field="purchaseTaxVo.taxId"
                          >
                            <option value="">Purchase Tax</option>
                            <option value="65606" data-rate="28.0">
                              GST 28(28.0%)
                            </option>
                            <option
                              value="65605"
                              data-rate="18.0"
                              selected
                              data-select2-id="12"
                            >
                              GST 18(18.0%)
                            </option>
                            <option value="65604" data-rate="12.0">
                              GST 12(12.0%)
                            </option>
                            <option value="65603" data-rate="5.0">
                              GST 5(5.0%)
                            </option>
                            <option value="65602" data-rate="0.0">
                              NON GST 0(0.0%)
                            </option>
                            <option value="65601" data-rate="0.0">
                              EXEMPT 0(0.0%)
                            </option>
                            <option value="65600" data-rate="0.0">
                              GST 0(0.0%)
                            </option>
                            <option value="63381" data-rate="10.0">
                              10.0 %(10.0%)
                            </option>
                            <option value="61518" data-rate="0.25">
                              0.25 %(0.25%)
                            </option>
                            <option value="46827" data-rate="10.0">
                              10.0 %(10.0%)
                            </option>
                            <option value="30390" data-rate="10.0">
                              GST 10(10.0%)
                            </option>
                            <option value="30327" data-rate="3.0">
                              GST 3(3.0%)
                            </option>
                            <option value="30326" data-rate="0.25">
                              GST 0.25(0.25%)
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Sales Tax
                        <span
                          style={{ fontSize: "1.25rem" }}
                          className="text-danger"
                        >
                          *
                        </span>
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <select
                            className="form-control form-control-sm m-select2 select2-hidden-accessible"
                            id="tax_category_id"
                            name="tax_category_id"
                            value={product.tax_category_id}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Tax</option>
                            {taxCategory.length > 0 &&
                              taxCategory.map((tax: any) => (
                                <option key={tax.id} value={tax.id}>
                                  {tax.name}
                                </option>
                              ))}
                            {/* <option value="65606">GST 28(28.0%)</option>
                            <option value="65605" selected data-select2-id="14">
                              GST 18(18.0%)
                            </option>
                            <option value="65604">GST 12(12.0%)</option>
                            <option value="65603">GST 5(5.0%)</option>
                            <option value="65602">NON GST 0(0.0%)</option>
                            <option value="65601">EXEMPT 0(0.0%)</option>
                            <option value="65600">GST 0(0.0%)</option>
                            <option value="63381">10.0 %(10.0%)</option>
                            <option value="61518">0.25 %(0.25%)</option>
                            <option value="46827">10.0 %(10.0%)</option>
                            <option value="30390">GST 10(10.0%)</option>
                            <option value="30327">GST 3(3.0%)</option>
                            <option value="30326">GST 0.25(0.25%)</option> */}
                          </select>
                        </div>
                        <small
                          className="help-block"
                          data-fv-validator="notEmpty"
                          data-fv-for="taxVo.taxId"
                          data-fv-result="NOT_VALIDATED"
                          style={{ display: "none" }}
                        >
                          Select Sales Tax
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="m-checkbox-inline">
                          <label
                            style={{ fontWeight: "bold", display: "none" }}
                          >
                            <input
                              type="checkbox"
                              name="purchaseTaxIncluded"
                              value="1"
                              checked
                            />
                            &nbsp;Purchase Tax Including
                            <span></span>
                          </label>
                          <label style={{ fontWeight: "bold" }}>
                            <input
                              type="checkbox"
                              name="is_tax_exempt"
                              id="is_tax_exempt"
                              checked={product.is_tax_exempt}
                              onChange={handleInputChange}
                            />
                            &nbsp;Sales Tax Excluding
                            <span></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-md-2 col-sm-12"
                    style={{ display: "none" }}
                  >
                    <div className="form-group row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="m-checkbox-inline">
                          <label style={{ fontWeight: "bold" }}>
                            <input
                              type="checkbox"
                              name="cess"
                              id="cess"
                              value="0"
                            />
                            &nbsp;Cess %<span></span>
                          </label>
                        </div>
                      </div>
                      <div
                        className="col-lg-12 col-md-12 col-sm-12 m--hide"
                        id="cess_div"
                      >
                        <div className="input-group">
                          <div
                            className="input-group-prepend"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* You can add any content here if needed */}
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="cesstax"
                            name="cesstax"
                            placeholder="Cess %"
                            value="0.0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 col-sm-12">
                    <div className="form-group row"></div>
                  </div>

                  <div
                    className="col-md-4 col-sm-12"
                    style={{ display: "none" }}
                  >
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Ingredients
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-8">
                        {/* <div className="bootstrap-tagsinput">
                                                  <input type="text" placeholder="" />
                                            </div> */}
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="ingredients"
                          data-role="tagsinput"
                          data-tag-color="label-info"
                          value=""
                          //s style={{ display: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Short Description
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <textarea
                          className="form-control form-control-sm"
                          //rows="1"
                          name="short_description"
                          id="short_description"
                          placeholder="Enter Short Description"
                          onChange={handleInputChange}
                          value={product?.short_description}
                          //maxLength="300"
                          data-fv-field="short_description"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Description
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <CKEditor
                          editor={ClassicEditor}
                          data={product?.full_description}
                          onChange={handleEditorChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group row">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-sm-12"
                      >
                        Net Weight
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="weight"
                          id="weight"
                          placeholder="Net Weight"
                          value={product?.weight}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6" style={{ display: "none" }}>
                    <div className="form-group row mb-0">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <table
                          className="table-sm table-bordered mb-0 table"
                          id="product_table"
                        >
                          <thead>
                            <tr>
                              <th>Nutrition</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nutritionItems.map((item, index) => (
                              <tr key={index}>
                                <td
                                  className="text-center align-middle"
                                  style={{ width: "20px" }}
                                >
                                  <span>{index + 1}</span>
                                </td>

                                <td style={{ width: "180px" }}>
                                  <div className="m--font-bolder form-group mb-0 p-0">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      name={`productNutritionVos[${index}].name`}
                                      id={`productNutritionVosName${index}`}
                                      placeholder="Nutrition Name"
                                      // value={item.name}
                                      // onChange={(e) => {
                                      //     const newItems = [...nutritionItems];
                                      //     newItems[index].name = e.target.value;
                                      //     setNutritionItems(newItems);
                                      //}}
                                    />
                                  </div>
                                </td>
                                <td style={{ width: "180px" }}>
                                  <div className="m--font-bolder form-group mb-0 p-0">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      name={`productNutritionVos[${index}].value`}
                                      id={`productNutritionVosValue${index}`}
                                      placeholder="Nutrition Value"
                                      // value={item.value}
                                      // onChange={(e) => {
                                      //   const newItems = [...nutritionItems];
                                      // newItems[index].value = e.target.value;
                                      //  setNutritionItems(newItems);
                                      // }}
                                    />
                                  </div>
                                </td>
                                <td
                                  className="paction"
                                  style={{ width: "40px" }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => removeNutrition(index)}
                                    className="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>
                                <a
                                  href="javascript:void(0);"
                                  onClick={addNutrition}
                                  className="m-link m--font-boldest"
                                >
                                  <i
                                    className="flaticon-plus m--font-primary"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  Add Nutrition
                                </a>
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="productpage_pricing">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <label style={{ fontWeight: "bold" }}>Pricing Details</label>
                <div className="row">
                  <div className="form-group col-lg-2 col-md-2">
                    <label style={{ fontWeight: "bold" }}>
                      Purchase Price
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="price"
                      onFocus={(e) => e.target.select()}
                      //onChange={() => changePurchasePrice(-1)}
                      name="price"
                      placeholder="Purchase Price"
                      onChange={handleInputChange}
                      value={product.price}
                      data-fv-field="price"
                    />
                  </div>

                  <div className="form-group col-lg-2 col-md-2">
                    <label style={{ fontWeight: "bold" }}>
                      Landing Cost
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="product_cost"
                      name="product_cost"
                      placeholder="Landing Cost"
                      onChange={handleInputChange}
                      value={product.product_cost}
                    />
                  </div>

                  <div className="form-group col-md-2">
                    <label style={{ fontWeight: "bold" }}>
                      MRP
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="old_price"
                      name="old_price"
                      placeholder="MRP"
                      value={product.old_price}
                      onChange={handleInputChange}
                      data-fv-field="old_price"
                    />
                  </div>

                  <div className="form-group col-lg-2 col-md-2">
                    <div className="form-group row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <label style={{ fontWeight: "bold" }}>
                          Selling Discount
                          <span
                            style={{ fontSize: "1.25rem" }}
                            className="text-danger"
                          >
                            *
                          </span>
                        </label>
                        <input
                          type="hidden"
                          className="form-control form-control-sm"
                          id="DiscountType_selling-1"
                          name="productVarientsVos[0].discountType"
                          placeholder="Discount"
                          value="amount"
                        />
                        <div className="input-group square-btn">
                          <div
                            className="input-group-prepend"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <button
                              className="btn btn-secondary btn-icon btn-sm dis-btn-pt"
                              type="button"
                              id="btn_percentage_discount_selling-1"
                              //onClick={() => btnpercentageDiscount('selling', -1)}
                              style={{
                                backgroundColor: "rgb(235, 237, 242)",
                                display: "none",
                              }}
                            >
                              <i className="fa fa-percentage m--font-info"></i>
                            </button>
                            <button
                              className="btn btn-secondary btn-icon btn-sm dis-btn-pt"
                              type="button"
                              id="btn_amount_discount_selling-1"
                              //onClick={() => btnamountDiscount('selling', -1)}
                              style={{ backgroundColor: "#ebedf2" }}
                            >
                              <i
                                className="fa fa-inr currency_style"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="Discount_selling-1"
                            name="productVarientsVos[0].discount"
                            //onChange={() => setSellingpriceAndOther('selling', -1)}
                            placeholder="Percentage"
                            value=""
                            //onKeyUp={(e) => e.target.value = minmax(e.target.value, 0, 100, -1)}
                            data-fv-field="productVarientsVos[0].discount"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group col-lg-2 col-md-2">
                    <label style={{ fontWeight: "bold" }}>
                      Selling Price
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="sellingPrice-1"
                      name="productVarientsVos[0].sellingPrice"
                      // onChange={() => {
                      //  setdiscountOnChangeSellingPrice('selling', -1);
                      //  setmargine('selling', -1);
                      //}}
                      placeholder="Selling Price"
                      value=""
                      data-fv-field="productVarientsVos[0].sellingPrice"
                    />
                  </div>

                  <div className="form-group col-lg-2 col-md-2">
                    <div className="form-group row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <label style={{ fontWeight: "bold" }}>
                          Selling Margin
                          <span
                            style={{ fontSize: "1.25rem" }}
                            className="text-danger"
                          >
                            *
                          </span>
                        </label>
                        <div className="input-group square-btn">
                          <div
                            className="input-group-prepend"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <button
                              className="btn btn-secondary btn-icon btn-sm dis-btn-pt"
                              type="button"
                              id="btn_percentage_selling-1"
                              //  onClick={() => btnpercentage('selling', -1)}
                              style={{
                                backgroundColor: "rgb(235, 237, 242)",
                                display: "none",
                              }}
                            >
                              <i className="fa fa-percentage m--font-info"></i>
                            </button>
                            <button
                              className="btn btn-secondary btn-icon btn-sm dis-btn-pt"
                              type="button"
                              id="btn_amount_selling-1"
                              // onClick={() => btnamount('selling', -1)}
                              style={{ backgroundColor: "rgb(235, 237, 242)" }}
                            >
                              <i
                                className="fa fa-inr currency_style"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="sellingMargin-1"
                            // onChange={() => setSelingPriceOnChangeMargine('selling', -1)}
                            //onKeyUp={(e) => e.target.value = minmaxMargine(e.target.value, 0, 100, -1)}
                            name="productVarientsVos[0].retailerMargin"
                            placeholder="Retailer Margin"
                            value=""
                            data-fv-field="productVarientsVos[0].retailerMargin"
                          />
                          <input
                            type="hidden"
                            name="productVarientsVos[0].retailerMarginType"
                            id="sellingMargin-1_Type"
                            value="amount"
                          />
                        </div>
                        <small
                          className="help-block"
                          data-fv-validator="notEmpty"
                          data-fv-for="productVarientsVos[0].retailerMargin"
                          data-fv-result="NOT_VALIDATED"
                          style={{ display: "none" }}
                        >
                          The margin is required
                        </small>
                        <small
                          className="help-block"
                          data-fv-validator="stringLength"
                          data-fv-for="productVarientsVos[0].retailerMargin"
                          data-fv-result="NOT_VALIDATED"
                          style={{ display: "none" }}
                        >
                          The margin must be less than 20 characters long
                        </small>
                        <small
                          className="help-block"
                          data-fv-validator="regexp"
                          data-fv-for="productVarientsVos[0].retailerMargin"
                          data-fv-result="NOT_VALIDATED"
                          style={{ display: "none" }}
                        >
                          The margin is invalid
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="form-group col-lg-2 col-md-2">
                    <label style={{ fontWeight: "bold" }}>
                      Minimum Qty
                      <span
                        style={{ fontSize: "1.25rem" }}
                        className="text-danger"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm validate-decimal"
                      id="order_minimum_quantity"
                      name="order_minimum_quantity"
                      //onKeyPress={(e) => checkCharacter(e, e.target, 'numericdot')}
                      //onKeyUp={(e) => {
                      //  checkMinQty(-1);
                      //  validateDecimalDigit(e);
                      // }}
                      onChange={handleInputChange}
                      placeholder="Minimum Qty"
                      value={product.order_minimum_quantity}
                    />
                  </div>

                  {/* <div className="row">
                    <div className="col-md-12">
                      <button
                        className="btn btn-danger"
                        onClick={() => router.push("/products/")}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ float: "right" }}
                        onClick={handleUpdate}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row savecancelfooterbtns">
        <div className="col-md-12">
          <button
            className="btn btn-danger"
            onClick={() => router.push("/products/")}
          >
            Cancel
          </button>
          <button
            style={{ float: "right" }}
            onClick={handleUpdate}
            className="btn btn-primary"
          >
            Save
          </button>
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
          Product Updated Successfully !
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInventoryModal} onHide={handleCloseInventoryModal}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Alert in Modal</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowInventoryAlert(false)}
              dismissible
            >
              {/* Product Updated Successfully ! */}
            </Alert>
          )}
          Product Inventory Updated Successfully !
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInventoryModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </DefaultLayout>
  );
};

export default ProductDetail;
