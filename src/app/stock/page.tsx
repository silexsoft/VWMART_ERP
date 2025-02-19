"use client";
import "@/css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StockTable from "@/components/StockTable";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { set } from "date-fns";

const StockPage = () => {
  const [products, setproducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [totalProduct, settotalProduct] = useState(0);
  const [productSeries, setproductSeries] = useState(0);
  //const pageSize = 25;
  const [pageSize, setPageSize] = useState<number>(10);
  const router = useRouter();
  const { token, logout, warehouseId } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedcategory, setSelectedcategory] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const [manufactures, setmanufactures] = useState<Manufacturer[]>([]);
  const [selectedmanufacturer, setselectedmanufacturer] = useState<number[]>(
    [],
  );
  const [manufacturerId, setManufacturerId] = useState<string>("");

  const [taxCategory, SettaxCategory] = useState<any>({
    name: "",
    id: "",
  });

  interface Category {
    id: string;
    name: string;
  }

  interface Manufacturer {
    id: string;
    name: string;
  }
  const toggleFilters = () => setShowFilters((prev) => !prev);
  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
    fetchTaxCategory();
  }, [token]);

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

  const fetchProducts = async (pageIndex: number) => {
    try {
      setproductSeries(pageIndex);
      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetAll?pageIndex=${pageIndex - 1}&pageSize=${pageSize}&categoryIds=${categoryId}&manufacturerIds=${manufacturerId}&storeId=0&vendorId=0&
      warehouseId=${warehouseId}&visibleIndividuallyOnly=false&excludeFeaturedProducts=false&productTagId=0&keywords=${searchQuery}&
      searchDescriptions=true&searchManufacturerPartNumber=true&searchSku=true&searchProductTags=false&
      languageId=0&showHidden=false`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("api product" + JSON.stringify(data));

      setTotalPages(data.total_pages);
      settotalProduct(data.total_count);
      // Ensure data.items is defined and is an array
      setproducts(
        Array.isArray(data.items)
          ? data.items.map((product: any) => ({
              id: product.id,
              name: product.name,
              sku: product.sku,
              published: product.published,
              //deleted: product.deleted,
              old_price: product.old_price,
              price: product.price,
              image_url: product.image_url,
              category_names: product.category_names,
              sub_category_names: product.sub_category_names,
              manufacturer_names: product.manufacturer_names,
              order_minimum_quantity: product.order_minimum_quantity,
              stock_quantity: product.stock_quantity,
            }))
          : [],
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/GetAll?storeId=0&pageIndex=0&pageSize=2147483647&showHidden=false`,
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
      //const data: Category[] = await response.json();
      // console.log("Fetched categories:", data);
      const data = await response.json();
      // Ensure data.items is an array and set it to categories
      setCategories(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchManufactures = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Manufacturer/GetAll?storeId=0&pageIndex=0&pageSize=2147483647&showHidden=false`,
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
      //const data: Category[] = await response.json();
      // console.log("Fetched categories:", data);
      const data = await response.json();
      // Ensure data.items is an array and set it to categories
      setmanufactures(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  useEffect(() => {
    fetchProducts(currentPage); // Fetch orders when the page index changes
    fetchCategories();
    fetchManufactures();
  }, [currentPage, pageSize, searchQuery, categoryId, manufacturerId]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(Number(event.target.value)); // Update page size
    setCurrentPage(1); // Reset page index to 0 when page size changes
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
  };

  const handleCategoryChange = (event: any) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId); // Update the selected category
    setSelectedcategory([selectedCategoryId]);
  };

  const handleManufacturerChange = (event: any) => {
    const selectedManufacturerId = event.target.value;
    setManufacturerId(selectedManufacturerId); // Update the selected category
    setselectedmanufacturer([selectedManufacturerId]);
  };
  if (pageSize === undefined) {
    return (
      <DefaultLayout>
        <div>Loading...</div>
      </DefaultLayout>
    ); // Show loading state while pageSize is undefined
  }

  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Products" /> */}
      {/* <div className="flex flex-col gap-10"> */}

      {/* <div  className='product-page-header'>
            <h3 className='product-page-title'>Stock</h3>
            <ul className="product-page-header-ul">
                  <li className="product-page-header-li">
                        <a href="/" className="m-nav__link m-nav__link--icon">                      
                        <i className="fa-solid fa-house"></i>
                         </a>
                  </li>
            </ul>
      </div> */}
      <Breadcrumb pageName="Stock" links={[{ label: "", route: "/" }]} />
      <div className="common_page_layout stock-new-page">
        <div className="product_page">
          <div className="m-portlet__head m-portlet__head__sm d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center ml-auto">
              <div className="export-icons">
                <a
                  href="#"
                  className="btn btn-sm btn-primary buttons-collection dropdown-toggle buttons-colvis"
                  style={{ borderRadius: "5px" }}
                  onClick={(e) => e.preventDefault()} // Prevent default behavior for href="#"
                  aria-expanded="true"
                >
                  <span>
                    <i className="fas fa-file-export"></i>
                  </span>
                </a>
              </div>
              <select
                id="datatableCustomTableLengthSelectBox"
                className="form-control form-control-sm mr-2"
                data-toggle="tooltip"
                title="Show number of record"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="-1">All</option>
              </select>
              <span className="headerfilter" onClick={toggleFilters}>
                <i className="fas fa-filter"></i>
                <span>Filter</span>
              </span>
              <div className="input-group input-group-sm mr-2">
                <input
                  type="text"
                  className="form-control form-control-sm m-input search-icons"
                  id="datatableCustomSearchInput"
                  placeholder="Search List..."
                  aria-describedby="basic-addon2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="search-font fa fa-search"></span>
              </div>
            </div>
          </div>
          <motion.div
            className="row product-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={
              showFilters
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }} // Prevent layout breaking during collapse
          >
            <div className="row product-filter">
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Category
                </label>
                {/* <select className='form-control product-filter-select'>
                           <option>All</option>
                           <option>Other</option>
                           <option>Grocery</option>
                         </select> */}
                <select
                  className="form-control product-filter-select"
                  id="parent_category_name"
                  name="parent_category_name"
                  onChange={handleCategoryChange}
                  value={selectedcategory[0]}
                  data-fv-field="parent_category_name"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Brand
                </label>
                <select
                  className="form-control product-filter-select"
                  id="parent_manufacturer_name"
                  name="parent_manufacturer_name"
                  onChange={handleManufacturerChange}
                  value={selectedmanufacturer[0]}
                  data-fv-field="parent_category_name"
                >
                  <option value="">Select Brand</option>

                  {manufactures.map((manufacture) => (
                    <option key={manufacture.id} value={manufacture.id}>
                      {manufacture.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Purchase Tax
                </label>
                <select className="form-control product-filter-select">
                  <option>All</option>
                  <option>Other</option>
                  <option>Grocery</option>
                </select>
              </div> */}
              <div className="col-md-2 form-group">
                <label className="col-lg-12 col-md-12 col-sm-12 product-filter-font p-0">
                  Sales Tax
                </label>
                <select className="form-control product-filter-select">
                  <option>None</option>
                  {taxCategory.length > 0 &&
                    taxCategory.map((tax: any) => (
                      <option key={tax.id} value={tax.id}>
                        {tax.name}
                      </option>
                    ))}

                  {/* <option value="0">[None]</option>
                  <option value="1">GST8%</option>
                  <option value="2">GST10%</option>
                  <option value="3">GST12%</option>
                  <option value="4">GST15%</option>
                  <option value="5">GST18%</option> */}
                </select>
              </div>
            </div>
          </motion.div>

          <StockTable
            products={products}
            totalProducts={totalProduct}
            currentPage={productSeries - 1}
            pagesize={pageSize}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}) => {
  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if totalPages is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // First Page
      pageNumbers.push(1);

      // Left Ellipsis
      if (currentPage > maxVisiblePages - 1) {
        pageNumbers.push("...");
      }

      // Middle Pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Right Ellipsis
      if (currentPage < totalPages - maxVisiblePages + 2) {
        pageNumbers.push("...");
      }

      // Last Page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      // Prevent navigation if it's out of bounds
      if (page < 1 || page > totalPages) return;
      onPageChange(page);
    }
  };

  return (
    <div className="row">
      <div className="col-sm-12 col-md-5">
        <div className="table-info">
          Showing {pageSize * (Math.max(1, currentPage) - 1) + 1} to
          {Math.min(pageSize * Math.max(1, currentPage), totalPages)} of{" "}
          {totalPages} entries
          {/* Showing {( (pageSize -1) *       (currentPage)) +1 } to {pageSize * currentPage} of {totalPages} entries */}
        </div>
      </div>
      <div className="col-sm-12 col-md-7">
        <div className="table-pagination">
          <ul className="pagination">
            {/* Previous Button */}
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() =>
                currentPage > 1 && handlePageClick(currentPage - 1)
              }
            >
              <button className="page-link"> &lt; </button>
            </li>

            {/* Page Numbers */}
            {renderPageNumbers().map((page, index) => (
              <li
                key={index}
                className={`page-item ${page === currentPage ? "active" : ""}`}
                onClick={() => handlePageClick(page)}
              >
                <button className="page-link">{page}</button>
              </li>
            ))}

            {/* Next Button */}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() =>
                currentPage < totalPages && handlePageClick(currentPage + 1)
              }
            >
              <button className="page-link"> &gt; </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
