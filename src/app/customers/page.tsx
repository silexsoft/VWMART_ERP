'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CustomersTable from "@/components/CustomersTable";
import { useState, useEffect, use } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

const CustomersPage = () => {
  const [Customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page index
  const [totalPages, setTotalPages] = useState(0);   // Tracks the total number of pages
  const pageSize = 25;                              // Number of orders per page
  const router = useRouter();
  const { token, logout } = useAuth();
  const [customerSeries, setcustomerSeries] = useState(0);
  const [totalCustomer, settotalCustomer] = useState(0);  

  const fetchCustomers = async (pageIndex: number) => {
    try {
        setcustomerSeries(pageIndex);
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Customer/GetAll?affiliateId=0&vendorId=0&customerRoleIds=3&dayOfBirth=0&
        monthOfBirth=0&pageIndex=${pageIndex}&pageSize=${pageSize}&getOnlyTotalCount=false`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched customers:', data);
      settotalCustomer(data.total_count);
      // Update state with orders and total pages
      setCustomers(
        Array.isArray(data.items)
          ? data.items.map((customer: any) => ({
              id: customer.id,
              email: customer.email,
              username: customer.username,
              active: customer.active,
              phone:customer.phone
            }))
          : []
      );
      setTotalPages(Math.ceil(data.total_count / pageSize)); // Calculate total pages
    } catch (error) {
      console.error('Error fetching Customer:', error);
    }
  };

  useEffect(() => {
           if (!token) 
           {
                router.push('/auth/signin');
           }
            fetchCustomers(currentPage); // Fetch orders when the page index changes
  }, [token,currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
    
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Orders" /> */}
      <div className="flex flex-col gap-10">
        <CustomersTable customers={Customers} totalOrders={totalCustomer} currentPage={customerSeries} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </DefaultLayout>
  );
};

// Pagination Component
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
    <div className="flex justify-center mt-4">
      <button
        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>     
      <span className="px-2 py-2 mx-1">{currentPage + 1} /  {totalPages}</span>  
      <button
        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      > Next
      </button>
    </div>
  );
};

export default CustomersPage;