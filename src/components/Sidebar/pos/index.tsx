"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import "@fortawesome/fontawesome-free/css/all.min.css";

<link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    rel="stylesheet"
/>;

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
    {
        name: "",
        menuItems: [
            {
                icon: <i className="fa fa-dashboard"></i>,
                label: "Dashboard",
                route: "/",
            },
            {
                icon: <i className="fa fa-cubes" aria-hidden="true"></i>,
                label: "Inventory",
                route: "#",
                children: [
                    { label: "Stock", route: "/stock" },
                    { label: "Product", route: "/products" },
                    { label: "Category/Brand", route: "/CategoryBrand" },
                    { label: "Stock Transfer", route: "/StockTransfer" },
                    { label: "Department", route: "/Department" },
                    { label: "Stock Transfer Request", route: "/StocktransferRequet" },
                    { label: "Bill of Materials", route: "/BillofMaterials" },
                    { label: "Stock Verification", route: "/StockVerification" },
                    { label: "Material Creation", route: "/MaterialCreation" },
                ],
            },
            {
                icon: <i className="fa fa-shopping-cart"></i>,
                label: "Purchase",
                route: "#",
                children: [
                    { label: "Purchase Order", route: "/purchase/PurchaseOrder" },
                    { label: "Material Inward", route: "/purchase/MaterialInward" },
                    { label: "Supplier Bill", route: "/purchase/SupplierBill" },
                    { label: "Debit Note", route: "/purchase/DebitNote" },
                ],
            },
            {
                icon: (
                    <i className="m-menu__link-icon m-menu__link-icon fa fa-bank"></i>
                ),
                label: "Sales",
                route: "#",
                children: [
                    { label: "Estimate", route: "/sales/estimate" },
                    { label: "Sales Order", route: "/sales/order" },
                    { label: "Invoice", route: "/sales/invoice" },
                    { label: "Delivery Challan", route: "/sales/deliverychallan" },
                    { label: "Credit Note", route: "/sales/creditnote" },
                ],
            },
            {
                icon: <i className="fa fa-fax"></i>,
                label: "Bank/Cash",
                route: "#",
                children: [
                    { label: "Bank", route: "/Bank" },
                    { label: "Bank Transaction", route: "/Bank/banktransaction" },
                    { label: "Payment", route: "/Bank/payment" },
                    { label: "Receipt", route: "/Bank/receipt" },
                    { label: "Expense", route: "/Bank/expense" },
                ],
            },
            {
                icon: <i className="m-menu__link-icon m-menu__link-icon fa fa-fax"></i>,
                label: "POS",
                route: "#",
                children: [
                    { label: "New", route: "/pos/new" },
                    { label: "Order List", route: "" },
                    { label: "Credit Note", route: "" },
                    { label: "Sales Register", route: "" }
                ],
            },
            {
                icon: (
                    <i className="m-menu__link-icon m-menu__link-icon fa fa-sitemap"></i>
                ),
                label: "Outlet",
                route: "/Outlet",
            },
            {
                icon: <i className="fa fa-user"></i>,
                label: "Customers",
                route: "#",
                children: [{ label: "Customers", route: "/customers" }],
            },
        ],
    },
];

const SidebarPOs = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();
    const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

    return (


        <ClickOutside onClick={() => setSidebarOpen(false)}>

            <aside
                className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark ${sidebarOpen ? "translate-x-0 lg:ml-0" : "-translate-x-full lg:-ml-72.5"
                    }`}
            >


                <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                    {/* <!-- Sidebar Menu --> */}
                    {/* <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6"> */}
                    <nav className="">
                        {menuGroups.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                                    {group.name}
                                </h3>

                                <ul className="mb-6 flex flex-col gap-1.5">
                                    {group.menuItems.map((menuItem, menuIndex) => (
                                        <SidebarItem
                                            key={menuIndex}
                                            item={menuItem}
                                            pageName={pageName}
                                            setPageName={setPageName}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                    {/* <!-- Sidebar Menu --> */}
                </div>
            </aside>
        </ClickOutside>

    );
};

export default SidebarPOs;
