'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrdersTable from "@/components/OrdersTable";
import { useState, useEffect, use } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import { getAllOrdersFromApi } from "@/utils/posService";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Tracks the current page index
    const [totalPages, setTotalPages] = useState(0);   // Tracks the total number of pages
    const pageSize = 25;                              // Number of orders per page
    const router = useRouter();
    const { token, logout } = useAuth();

    const [orderSeries, setorderSeries] = useState(0);

    const [totalOrder, settotalOrder] = useState(0);
    const fetchOrders = async (pageIndex: number) => {
        try {
            setorderSeries(pageIndex);
        //     const response = await fetch(
        //         `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/Search?storeId=0&vendorId=0&customerId=0
        // &productId=0&affiliateId=0&warehouseId=0&billingCountryId=0&pageIndex=${pageIndex}&pageSize=${pageSize}
        // &getOnlyTotalCount=false`,
        //         {
        //             method: 'GET',
        //             headers: {
        //                 accept: 'application/json',
        //                 Authorization: token ? `Bearer ${token}` : '',
        //             },
        //         }
        //     );

        //     if (!response.ok) {
        //         throw new Error(`HTTP error! Status: ${response.status}`);
        //     }

            const data = await getAllOrdersFromApi(token,pageIndex,pageSize);
            //console.log('Fetched orders:', data);
            settotalOrder(data.total_count);
            // Update state with orders and total pages
            setOrders(
                Array.isArray(data.items)
                    ? data.items.map((order: any) => ({
                        id: order.id,
                        order_status_id: order.order_status_id,
                        payment_status_id: order.payment_status_id,
                        order_total: order.order_total,
                        created_on_utc: order.created_on_utc,
                        customer_email: order.customer_email,

                        billing_first_name: order.billing_first_name,
                        billing_last_name: order.billing_last_name,
                        billing_email: order.billing_email,
                        billing_city: order.billing_city,
                        billing_address1: order.billing_address1,
                        billing_address2: order.billing_address2,
                        billing_zip_postal_code: order.billing_zip_postal_code,
                        billing_phone_number: order.billing_phone_number,
                        shipping_first_name: order.shipping_first_name,
                        shipping_last_name: order.shipping_last_name,
                        shipping_email: order.shipping_email,
                        shipping_city: order.shipping_city,
                        shipping_address1: order.shipping_address1,
                        shipping_address2: order.shipping_address2,
                        shipping_zip_postal_code: order.shipping_zip_postal_code,
                        shipping_phone_number: order.shipping_phone_number

                    }))
                    : []
            );
            setTotalPages(Math.ceil(data.total_count / pageSize)); // Calculate total pages
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push('/auth/signin');
        }
        fetchOrders(currentPage); // Fetch orders when the page index changes
    }, [token, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <DefaultLayout>
            {/* <Breadcrumb pageName="Orders" /> */}
            <div className="flex flex-col gap-10">
                <OrdersTable orders={orders} totalOrders={totalOrder} currentPage={orderSeries} />
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
            >
                Next
            </button>
        </div>
    );
};

export default OrdersPage;