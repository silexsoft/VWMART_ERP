"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";


interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <header className="bg-gray-100 text-black shadow-md w-full">
            <div className="mx-auto">
                <div className="grid grid-cols-12 gap-4 items-center">

                    {/* 🔹 Left Section: Logo & Sidebar Toggle */}
                    <div className="col-span-6 md:col-span-3 lg:col-span-2 flex items-center pl-5">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className=" p-2 rounded-md mr-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href="/">
                            <Image
                                width={55}
                                height={15}
                                src="/images/logo/VWMART-ERPLOGO.png"
                                alt="vasyERP"
                                className="h-8"
                            />
                        </Link>
                    </div>



                    {/* 🔹 Right Section: Order Mode, Salesman Dropdown */}
                    <div className="col-span-6 md:col-span-5 flex items-center justify-end space-x-3">
                        {/* Radio Buttons */}
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="orderType" className="form-radio text-blue-500" value="walkin" defaultChecked />
                                <span>Walk In</span>
                            </label>
                        </div>

                        {/* Salesman Dropdown */}
                        <div className="p-1"><label>Salesman:</label>
                            <select className="bg-white">
                                <option value="0">VW-GOP-1109</option>
                                <option value="17833">RAHUL</option>
                            </select></div>
                    </div>
                    <div className="col-span-6 md:col-span-5 flex items-center justify-end space-x-3">
                        {/* Settings Button */}
                        <button type="button" className="bg-gray-700 p-2 rounded-md text-white">
                            <i className="fa fa-cog text-lg"></i>
                        </button>

                        {/* Logout Button */}
                        <button type="button" className="bg-red-600 p-2 rounded-md text-white">
                            <i className="fa fa-sign-out text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
