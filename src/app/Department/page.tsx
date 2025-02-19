"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import DepartmentTable from "@/components/DepartmentTable";
import DepartmentNewModal from "@/components/DepartmentNewModal";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { form } from "framer-motion/m";
import "@/css/custom.css";
import { de } from "date-fns/locale";

const DepartmentPage = () => {
  interface Department {
    Id: number;
    Name: string;
    Image: string;
    CreatedBy: string;
    CreatedAt: string;
    UpdateAt: string;
  }
  const [Departments, setDepartments] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalDepartments, setTotalPages] = useState(0);

  const [totalDepartment, settotalDepartment] = useState(0);
  const [DepartmentSeries, setDepartmentSeries] = useState(0);
  const pageSize = 25;

  const router = useRouter();
  const { token, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments(currentPage, searchQuery); // Fetch categories whenever pageIndex or pageSize changes
  }, [currentPage, pageSize, searchQuery]); // Depend on pageIndex and pageSize

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value; // Capture the search input value
    setSearchQuery(query); // Update the searchQuery state
    fetchDepartments(0, query); // Fetch categories with the updated search query and reset to page 0
  };
  const handleOpenModal = (category = null) => {
    setDepartments(category);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setDepartments(null);
  };
  const fetchDepartments = async (pageIndex: number, search: string) => {
    try {
      setDepartmentSeries(pageIndex);
      //console.log("searchQuery:", search);

      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/DepartmentGetAll`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        //console.error(`HTTP error! Status: ${response.status}`);
        setDepartments([]);
        setTotalPages(0);
        settotalDepartment(0);
        return;
      }

      const data = await response.json();
      console.log("API Department Data:", JSON.stringify(data));

      // Ensure that data.items is an array before processing
      const formattedData = Array.isArray(data)
        ? data.map((Department: any) => ({
            Id: Department.Id,
            Name: Department.Name,
            Image: Department.Image,
            CreatedBy: Department.CreatedBy,
            CreatedAt: Department.CreatedAt,
            UpdateAt: Department.UpdateAt,
          }))
        : [];

      setDepartments(formattedData);
      setTotalPages(data.total_pages || 0);
      settotalDepartment(data.total_count || 0);
      // console.log("Formatted Department Data:", JSON.stringify(formattedData));
    } catch (error) {
      //console.error("Failed to fetch Departments:", error);
      setDepartments([]);
      setTotalPages(0);
      settotalDepartment(0);
    }
  };

  useEffect(() => {
    //console.log(Departments)
  }, [Departments]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Department" links={[{ label: "", route: "/" }]} />
      <div className="common_page_layout department-new-page">
        <div className="flex flex-col gap-10">
          <div className="m-portlet__head m-portlet__head__sm d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <span className="m-portlet__head-icon">
                <i className="flaticon-cogwheel-2"></i>
              </span>
            </div>
            <div className="d-flex align-items-center ml-auto">
              <select
                id="datatableCustomTableLengthSelectBox"
                className="form-control form-control-sm mr-2"
                data-toggle="tooltip"
                title="Show number of record"
                value={pageSize}
                // onChange={handlePageSizeChange}
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
                className="btn btn-sm btn-primary m-btn m-btn--icon m-btn--air create-new-btn"
                data-toggle="modal"
                data-target="#department_new_model"
                onClick={() => handleOpenModal()}
              >
                Create New
              </a>
            </div>
          </div>

          <DepartmentTable
            Departments={Departments}
            totalDepartments={totalDepartments}
            currentPage={DepartmentSeries}
          />
        </div>
      </div>
      {showModal && (
        <DepartmentNewModal show={showModal} handleClose={handleCloseModal} />
      )}
    </DefaultLayout>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div>
      <div className="flex justify-center">
        <button
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="mx-1 px-2 py-2">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DepartmentPage;
