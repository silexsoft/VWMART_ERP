import Link from "next/link";
import "@/css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { auto } from "@popperjs/core";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { token, logout } = useAuth();

  const router = useRouter();
  const { login } = useAuth();
  const [username, setusername] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      try {
        const email = localStorage.getItem("Email");
        if (!email) {
          throw new Error("No email found in localStorage");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Customer/GetCustomerByEmail?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        setusername(data.first_name);
        return data;
      } catch (err) {
        console.error("Error in fetch record by email:");
      }
    };
    fetchData();
  }, [token, router]);

  const handleUpdate = async () => {
    try {
      localStorage.removeItem("NEXT_PUBLIC_BACKEND_TOKEN");
      localStorage.removeItem("Email");
      login("", "");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <header className="headerclass">
      {/* <header className="headerclass sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"></header> */}

      <div className="header-action-account">
        <div className="action_button_square">
          {" "}
          <a className="action-button-sqr">
            <i className="fa-regular fa-square-plus"></i>{" "}
            <span>Quick Action</span> <i className="fa-solid fa-angle-down"></i>
          </a>{" "}
        </div>
        <div className="button_nav-account-right">
          <ul>
            <li className="nmbr-time-usrcustomer">
              <a href="#">
                {/* <Image
                  src="https://cdn.vasyerp.com/assets/images/customer-service.png"
                  alt="Customer Service"
                  width={300}
                  height={300}
                  priority
                /> */}
                <span>+9179 350 42 400 (Mon to Sun: 9:00 AM - 9:00 PM)</span>
              </a>
            </li>
            <li className="search-usrcustomer">
              <a href="#">
                <span className="m-nav__link-icon">
                  <i className="fa fa-search"></i>
                </span>
              </a>
            </li>
            <li className="notification-usrcustomer">
              <a href="#">
                <span className="m-nav__link-icon">
                  <i className="fa fa-bell">
                    <span className="notificationCount">2</span>
                  </i>
                </span>
              </a>
            </li>
            <li className="fax-usrcustomer">
              <a href="#">
                <span className="m-nav__link-icon">
                  <i className="fa fa-fax"></i>
                </span>
              </a>
            </li>
            <li className="year-usrcustomer">
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                >
                  2024-2025<span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#">2021-2022</a>
                  </li>
                  <li>
                    <a href="#">2022-2023</a>
                  </li>
                  <li>
                    <a href="#">2023-2024</a>
                  </li>
                  <li>
                    <a href="#">2024-2025</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="user-name-usrcustomer">
              <span className="m-topbar__userpic">VE</span>
              <div className="user-vw-profiledb">
                <div className="m-card-user-vw">
                  <div className="m-card-user__details-vw">
                    {" "}
                    <span className="m-card-user__name">VW-GOP-1109</span>{" "}
                    <span className="m-card-user__email">
                      veggieswala@gmail.com
                    </span>{" "}
                  </div>
                </div>
                <div className="profile-chngepas-logut">
                  <ul className="profile-log-secttion">
                    <li className="my-profile-chd-cstmr">
                      {" "}
                      <a href="#">
                        {" "}
                        <i className="fa-regular fa-user"></i>{" "}
                        <span className="m-nav__link-title">
                          {" "}
                          <span className="m-nav__link-wrap">
                            {" "}
                            <span className="m-nav__link-text">
                              My Profile
                            </span>{" "}
                          </span>{" "}
                        </span>{" "}
                      </a>{" "}
                    </li>
                    <li className="my-profile-chd-paswrd">
                      {" "}
                      <a href="#" className="btn">
                        <i className="fa-solid fa-key"></i> Change Password
                      </a>{" "}
                      <a href="" className="btn btn-sm btn-danger">
                        <i className="fa fa-sign-out" aria-hidden="true"></i>{" "}
                        Logout
                      </a>{" "}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="questiom-ic-usrcustomer">
              <span>
                <i className="fa fa-question-circle"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {showDropdown && (
        <div className="quickaction-secc">
          <ul className="m-menu__content row">
            <li className="m-menu__item col">
              <h3 className="m-menu__heading m-menu__toggle">
                {" "}
                <span className="m-menu__link-text">Sales</span>
              </h3>
              <ul className="m-menu__inner">
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Invoice</span>{" "}
                  </a>{" "}
                </li>
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Credit Note</span>{" "}
                  </a>{" "}
                </li>
              </ul>
            </li>
            <li className="m-menu__item col">
              <h3 className="m-menu__heading m-menu__toggle">
                {" "}
                <span className="m-menu__link-text">Bank / Cash</span>
              </h3>
              <ul className="m-menu__inner">
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Bank</span>{" "}
                  </a>{" "}
                </li>
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">
                      Bank Transaction
                    </span>{" "}
                  </a>{" "}
                </li>
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Receipt</span>{" "}
                  </a>{" "}
                </li>
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Payment</span>{" "}
                  </a>{" "}
                </li>
              </ul>
            </li>
            <li className="m-menu__item col">
              <h3 className="m-menu__heading m-menu__toggle">
                {" "}
                <span className="m-menu__link-text">Purchase</span>
              </h3>
              <ul className="m-menu__inner">
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">
                      Supplier Bill
                    </span>{" "}
                  </a>{" "}
                </li>
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Debit Note</span>{" "}
                  </a>{" "}
                </li>
              </ul>
            </li>
            <li className="m-menu__item col">
              <h3 className="m-menu__heading m-menu__toggle">
                {" "}
                <span className="m-menu__link-text">Contact</span>
              </h3>
              <ul className="m-menu__inner">
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Contact</span>{" "}
                  </a>{" "}
                </li>
              </ul>
            </li>
            <li className="m-menu__item col">
              <h3 className="m-menu__heading m-menu__toggle">
                {" "}
                <span className="m-menu__link-text">Inventory</span>
              </h3>
              <ul className="m-menu__inner">
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Product</span>{" "}
                  </a>{" "}
                </li>
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">
                      Stock Transfer
                    </span>{" "}
                  </a>{" "}
                </li>
                <li className="m-menu__item">
                  {" "}
                  <a href="#" className="m-menu__link">
                    {" "}
                    <span className="m-menu__link-text">Price Master</span>{" "}
                  </a>{" "}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
