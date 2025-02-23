"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrdersTable from "@/components/OrdersTable";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import CategoryTable from "@/components/CategoryTable";
import BrandTable from "@/components/BrandTable";

import CategoryEditModal from "@/components/CategoryEditModal";
import CategoryNewModal from "@/components/CategoryNewModal";
import BrandNewModal from "@/components/BrandNewModal";
import { set } from "date-fns";

const CategoryBrandPage = () => {
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page index
  const [totalPages, setTotalPages] = useState(0); // Tracks the total number of pages
  //const pageSize = 25;                              // Number of orders per page
  const [pageSize, setPageSize] = useState<number>(10); // Default page size

  const [brand, setBrand] = useState([]);
  const [currentBrandPage, setCurrentBrandPage] = useState(1); // Tracks the current page index
  const [totalBrandPages, setTotalBrandPages] = useState(0); // Tracks the total number of pages
  const [brandpageSize, setbrandpageSize] = useState<number>(10);
  //const brandpageSize = 25;

  const router = useRouter();
  const { token, logout } = useAuth();

  const [categorySeries, setcategorySeries] = useState(0);
  const [totalcategory, settotalcategory] = useState(0);

  const [brandSeries, setbrandSeries] = useState(0);
  const [totalbrand, settotalbrand] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchBrandQuery, setSearchBrandQuery] = useState<string>("");

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };
  const handleOpenBrandModal = (brand = null) => {
    setSelectedBrand(brand);
    setShowBrandModal(true);
  };
  const handleCloseBrandModal = () => {
    setShowBrandModal(false);
    setSelectedBrand(null);
  };

  useEffect(() => {
    fetchCategories(currentPage, searchQuery); // Fetch categories whenever pageIndex or pageSize changes
  }, [currentPage, pageSize, searchQuery]); // Depend on pageIndex and pageSize

  useEffect(() => {
    fetchBrands(currentBrandPage, searchBrandQuery); // Fetch categories whenever pageIndex or pageSize changes
  }, [currentBrandPage, brandpageSize, searchBrandQuery]); // Depend on pageIndex and pageSize

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
    fetchCategories(0, query); // Fetch categories with the updated search query and reset to page 0
  };

  const handleSearchBrandChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const query = event.target.value; // Capture the search input value
    setSearchBrandQuery(query); // Update the searchQuery state
    fetchBrands(0, query); // Fetch categories with the updated search query and reset to page 0
  };

  const fetchCategories = async (pageIndex: number, categoryName: string) => {
    try {
      setcategorySeries(pageIndex);
      const url = categoryName
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/GetAll?categoryName=${categoryName}&storeId=0&pageIndex=${pageIndex - 1}&pageSize=${pageSize}&showHidden=false`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/GetAll?storeId=0&pageIndex=${pageIndex - 1}&pageSize=${pageSize}&showHidden=false`;

      const response = await fetch(
        //`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Category/GetAll?categoryName=${categoryName}storeId=0&pageIndex=${pageIndex}&pageSize=${pageSize}&showHidden=false`,
        url,
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
      settotalcategory(data.total_count);
      // Update state with orders and total pages
      setCategory(
        Array.isArray(data.items)
          ? data.items.map((category: any) => ({
              id: category.id,
              name: category.name,
              image_url: category.image_url,
              description: category.description,
              parent_category_name: category.parent_category_name,
            }))
          : [],
      );
      setTotalPages(Math.ceil(data.total_count / pageSize)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchBrands = async (pageIndex: number, ManufacturerName: string) => {
    try {
      setbrandSeries(pageIndex);

      const url = ManufacturerName
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Manufacturer/GetAll?manufacturerName=${ManufacturerName}&storeId=0&pageIndex=${pageIndex - 1}&pageSize=${brandpageSize}&showHidden=false`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Manufacturer/GetAll?storeId=0&pageIndex=${pageIndex - 1}&pageSize=${brandpageSize}&showHidden=false`;

      const response = await fetch(
        //`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Manufacturer/GetAll?storeId=0&pageIndex=${pageIndex}&pageSize=${pageSize}&showHidden=false`,
        url,
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
      settotalbrand(data.total_count);
      // Update state with orders and total pages
      setBrand(
        Array.isArray(data.items)
          ? data.items.map((brand: any) => ({
              id: brand.id,
              name: brand.name,
              image_url: brand.image_url,
              description: brand.description,
              parent_manufacturer_name: brand.parent_manufacturer_name,
            }))
          : [],
      );
      setTotalBrandPages(Math.ceil(data.total_count / brandpageSize)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
    // fetchCategories(currentPage); // Fetch categories when the page index changes
    // fetchBrands(currentBrandPage);
  }, [token, currentPage, currentBrandPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleBrandPageChange = (newPage: number) => {
    setCurrentBrandPage(newPage);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(Number(event.target.value)); // Update page size
    setCurrentPage(1); // Reset page index to 0 when page size changes
  };

  const handleBrandPageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setbrandpageSize(Number(event.target.value)); // Update page size
    setCurrentBrandPage(1); // Reset page index to 0 when page size changes
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Category/Brand"
        links={[{ label: "", route: "/" }]}
      />
      <div className="common_page_layout CategoryBrand-new-page">
        {/* <div className="product-page-header">
        <h3 className="product-page-title">Category/Brand</h3>
        <ul className="product-page-header-ul">
          <li className="product-page-header-li">
            <a href="/" className="m-nav__link m-nav__link--icon">
              <i className="fa-solid fa-house"></i>
            </a>
          </li>
        </ul>
      </div> */}
        <div className="category_brand_page full-row">
          <div className="row">
            {/* <div className="flex flex-col gap-10"> */}
            <div className="col-6 CategoryBrandLft">
              <div className="m-portlet__head m-portlet__head__sm d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <span className="m-portlet__head-icon">
                    <i className="flaticon-cogwheel-2"></i>
                  </span>
                  <h3 className="m-portlet__head-text m--font-brand ml-2">
                    Category
                  </h3>
                </div>
                <div className="d-flex align-items-center ml-auto">
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
                  <a
                    href="#"
                    className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air create-new-btn"
                    data-toggle="modal"
                    data-target="#category_new_model"
                    onClick={() => handleOpenModal()}
                  >
                    Create New
                  </a>
                </div>
              </div>

              {showModal && (
                <CategoryNewModal
                  show={showModal}
                  handleClose={handleCloseModal}
                />
              )}

              <CategoryTable
                category={category}
                totalCategories={totalcategory}
                currentPage={categorySeries - 1}
                pagesize={pageSize}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
              />
            </div>

            <div className="col-6 CategoryBrandRgt">
              <div className="m-portlet__head m-portlet__head__sm d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <span className="m-portlet__head-icon">
                    <i className="flaticon-cogwheel-2"></i>
                  </span>
                  <h3 className="m-portlet__head-text m--font-brand ml-2">
                    Brand
                  </h3>
                </div>
                <div className="d-flex align-items-center ml-auto">
                  <select
                    id="datatableCustomTableLengthSelectBox"
                    className="form-control form-control-sm mr-2"
                    data-toggle="tooltip"
                    title="Show number of record"
                    value={brandpageSize}
                    onChange={handleBrandPageSizeChange}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                    <option value="-1">All</option>
                  </select>
                  <div className="input-group input-group-sm mr-2">
                    <input
                      type="text"
                      className="form-control form-control-sm m-input search-icons"
                      id="datatableCustomSearchInput"
                      placeholder="Search List..."
                      aria-describedby="basic-addon2"
                      value={searchBrandQuery}
                      onChange={handleSearchBrandChange}
                    />
                    <span className="search-font fa fa-search"></span>
                  </div>
                  <a
                    href="#"
                    className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air create-new-btn"
                    data-toggle="modal"
                    data-target="#category_new_model"
                    onClick={() => handleOpenBrandModal()}
                  >
                    Create New
                  </a>
                </div>
              </div>

              {showBrandModal && (
                <BrandNewModal
                  show={showBrandModal}
                  handleClose={handleCloseBrandModal}
                />
              )}

              <BrandTable
                brand={brand}
                totalBrands={totalbrand}
                currentPage={brandSeries - 1}
                pagesize={brandpageSize}
              />
              <BrandPagination
                currentPage={currentBrandPage}
                totalPages={totalBrandPages}
                onPageChange={handleBrandPageChange}
                pageSize={brandpageSize}
              />
            </div>
          </div>{" "}
        </div>
      </div>
    </DefaultLayout>
  );
};

// Pagination Component
// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }) => {
//   return (
//     <div className="flex justify-center mt-4">
//       <button
//         className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 0}
//       >
//         Previous
//       </button>
//       <span className="px-2 py-2 mx-1">{currentPage + 1} /  {totalPages}</span>
//       <button
//         className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages - 1}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

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
          {Math.min(pageSize * Math.max(1, currentPage))} of {totalPages}{" "}
          entries
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

const BrandPagination = ({
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
          {Math.min(pageSize * Math.max(1, currentPage))} of {totalPages}{" "}
          entries
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
// const BrandPagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }) => {
//   return (
//     <div className="flex justify-center mt-4">
//       <button
//         className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 0}
//       >
//         Previous
//       </button>
//       <span className="px-2 py-2 mx-1">{currentPage + 1} /  {totalPages}</span>
//       <button
//         className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages - 1}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

export default CategoryBrandPage;
