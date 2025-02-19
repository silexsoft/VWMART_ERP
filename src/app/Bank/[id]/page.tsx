"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from "react-bootstrap";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

//import { Editor } from "@tinymce/tinymce-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Link from "next/link";
import { set } from "date-fns";
import { de, se } from "date-fns/locale";

let Token = process.env.BACKEND_TOKEN;
const BankDetail = () => {
  const pathname = usePathname();
  const id = pathname.match(/\/Bank\/(\d+)/)?.[1];

  const router = useRouter();
  const { token, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [bank, setBank] = useState<any>({
    Id: "", // Corresponds to AccountNumber (unique identifier)
    BankName: "", // Corresponds to BankName
    AccountName: "", // Corresponds to AccountName
    Location: "", // Corresponds to Location
    CreatedBy: "", // Corresponds to CreatedBy
    IFSCCode: "", // Corresponds to IFSCCode
    SwiftCode: "", // Corresponds to SwiftCode
    CreditBalance: "", // Corresponds to CreditBalance
    DebitBalance: "", // Corresponds to DebitBalance
    AccountGroup: "", // Corresponds to AccountGroup
    AddressLine1: "", // Corresponds to AddressLine1
    AddressLine2: "", // Corresponds to AddressLine2
    Country: "", // Corresponds to Country
    State: "", // Corresponds to State
    City: "", // Corresponds to City
    ZipCode: "", // Corresponds to ZipCode
    IsUPIAvialble: "", // Corresponds to IsUPIAvialble
    CreatedOn: "", // Corresponds to CreatedOn (ISO date string format)
    AccountNumber: "",
    WarehouseId: "",
  });
  interface City {
    id: string;
    name: string;
  }

  interface State {
    id: string;
    name: string;
  }

  interface Country {
    id: string;
    name: string;
  }
  interface MockData {
    countries: Country[];
    states: { [key: string]: State[] };
    cities: { [key: string]: City[] };
  }

  const [isLoading, setIsLoading] = useState(true);
  const [itemCode, setItemCode] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [productName, setProductName] = useState("");
  const [printName, setPrintName] = useState("");

  // const [countries, setCountries] = useState<Country[]>([]);
  // const [states, setStates] = useState<State[]>([]);
  // const [cities, setCities] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState("");
  // const [selectedState, setSelectedState] = useState("");

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [warehouse, setWarehouses] = useState<any>([]);

  const mockData: MockData = {
    countries: [{ id: "India", name: "India" }],
    states: {
      India: [
        { id: "Andhra Pradesh", name: "Andhra Pradesh" },
        { id: "Arunachal Pradesh", name: "Arunachal Pradesh" },
        { id: "Assam", name: "Assam" },
        { id: "Bihar", name: "Bihar" },
        { id: "Chhattisgarh", name: "Chhattisgarh" },
        { id: "Goa", name: "Goa" },
        { id: "Gujarat", name: "Gujarat" },
        { id: "Haryana", name: "Haryana" },
        { id: "Himachal Pradesh", name: "Himachal Pradesh" },
        { id: "Jammu and Kashmir", name: "Jammu and Kashmir" },
        { id: "Jharkhand", name: "Jharkhand" },
        { id: "Karnataka", name: "Karnataka" },
        { id: "Kerala", name: "Kerala" },
        { id: "Madhya Pradesh", name: "Madhya Pradesh" },
        { id: "Maharashtra", name: "Maharashtra" },
        { id: "Manipur", name: "Manipur" },
        { id: "Meghalaya", name: "Meghalaya" },
        { id: "Mizoram", name: "Mizoram" },
        { id: "Nagaland", name: "Nagaland" },
        { id: "Odisha", name: "Odisha" },
        { id: "Punjab", name: "Punjab" },
        { id: "Rajasthan", name: "Rajasthan" },
        { id: "Sikkim", name: "Sikkim" },
        { id: "Tamil Nadu", name: "Tamil Nadu" },
        { id: "Telangana", name: "Telangana" },
        { id: "Tripura", name: "Tripura" },
        { id: "Uttar Pradesh", name: "Uttar Pradesh" },
        { id: "Uttarakhand", name: "Uttarakhand" },
        { id: "West Bengal", name: "West Bengal" },
        {
          id: "Andaman and Nicobar Islands",
          name: "Andaman and Nicobar Islands",
        },
        { id: "Chandigarh", name: "Chandigarh" },
        {
          id: "Dadra and Nagar Haveli and Daman and Diu",
          name: "Dadra and Nagar Haveli and Daman and Diu",
        },
        { id: "Delhi", name: "Delhi" },
        { id: "Lakshadweep", name: "Lakshadweep" },
        { id: "Puducherry", name: "Puducherry" },
      ],
    },
    cities: {
      Haryana: [
        { id: "Ambala", name: "Ambala" },
        { id: "Bhiwani", name: "Bhiwani" },
        { id: "Faridabad", name: "Faridabad" },
        { id: "Gurugram", name: "Gurugram" },
        { id: "Hisar", name: "Hisar" },
        { id: "Karnal", name: "Karnal" },
        { id: "Kurukshetra", name: "Kurukshetra" },
        { id: "Panipat", name: "Panipat" },
        { id: "Panchkula", name: "Panchkula" },
        { id: "Rohtak", name: "Rohtak" },
        { id: "Sonipat", name: "Sonipat" },
        { id: "Yamunanagar", name: "Yamunanagar" },
        { id: "Mahendragarh", name: "Mahendragarh" },
        { id: "Palwal", name: "Palwal" },
        { id: "Fatehabad", name: "Fatehabad" },
        { id: "Sirsa", name: "Sirsa" },
        { id: "Jind", name: "Jind" },
        { id: "Kaithal", name: "Kaithal" },
        { id: "Nuh", name: "Nuh" },
        { id: "Rewari", name: "Rewari" },
        { id: "Shahbad", name: "Shahbad" },
      ],
      Punjab: [
        { id: "Amritsar", name: "Amritsar" },
        { id: "Ludhiana", name: "Ludhiana" },
        { id: "Jalandhar", name: "Jalandhar" },
        { id: "Chandigarh", name: "Chandigarh" },
        { id: "Patiala", name: "Patiala" },
        { id: "Bathinda", name: "Bathinda" },
        { id: "Moga", name: "Moga" },
        { id: "Pathankot", name: "Pathankot" },
        { id: "Hoshiarpur", name: "Hoshiarpur" },
        { id: "Firozpur", name: "Firozpur" },
        { id: "Kapurthala", name: "Kapurthala" },
        { id: "Faridkot", name: "Faridkot" },
        { id: "Sangrur", name: "Sangrur" },
        { id: "Rupnagar (Ropar)", name: "Rupnagar (Ropar)" },
        { id: "Muktsar", name: "Muktsar" },
        { id: "Tarn Taran", name: "Tarn Taran" },
        { id: "Barnala", name: "Barnala" },
        { id: "Sri Muktsar Sahib", name: "Sri Muktsar Sahib" },
        { id: "Mansa", name: "Mansa" },
        {
          id: "Shahid Bhagat Singh Nagar (Nawanshahr)",
          name: "Shahid Bhagat Singh Nagar (Nawanshahr)",
        },
      ],
      Chandigarh: [
        { id: "Sector 1", name: "Sector 1" },
        { id: "Sector 2", name: "Sector 2" },
        { id: "Sector 3", name: "Sector 3" },
        { id: "Sector 4", name: "Sector 4" },
        { id: "Sector 5", name: "Sector 5" },
        { id: "Sector 6", name: "Sector 6" },
        { id: "Sector 7", name: "Sector 7" },
        { id: "Sector 8", name: "Sector 8" },
        { id: "Sector 9", name: "Sector 9" },
        { id: "Sector 10", name: "Sector 10" },
        { id: "Sector 11", name: "Sector 11" },
        { id: "Sector 12", name: "Sector 12" },
        { id: "Sector 13", name: "Sector 13" },
        { id: "Sector 14", name: "Sector 14" },
        { id: "Sector 15", name: "Sector 15" },
        { id: "Sector 16", name: "Sector 16" },
        { id: "Sector 17", name: "Sector 17" },
        { id: "Sector 18", name: "Sector 18" },
        { id: "Sector 19", name: "Sector 19" },
        { id: "Sector 20", name: "Sector 20" },
        { id: "Sector 21", name: "Sector 21" },
        { id: "Sector 22", name: "Sector 22" },
        { id: "Sector 23", name: "Sector 23" },
        { id: "Sector 24", name: "Sector 24" },
        { id: "Sector 25", name: "Sector 25" },
        { id: "Sector 26", name: "Sector 26" },
        { id: "Sector 27", name: "Sector 27" },
        { id: "Sector 28", name: "Sector 28" },
        { id: "Sector 29", name: "Sector 29" },
        { id: "Sector 30", name: "Sector 30" },
        { id: "Sector 31", name: "Sector 31" },
        { id: "Sector 32", name: "Sector 32" },
        { id: "Sector 33", name: "Sector 33" },
        { id: "Sector 34", name: "Sector 34" },
        { id: "Sector 35", name: "Sector 35" },
        { id: "Sector 36", name: "Sector 36" },
        { id: "Sector 37", name: "Sector 37" },
        { id: "Sector 38", name: "Sector 38" },
        { id: "Sector 39", name: "Sector 39" },
        { id: "Sector 40", name: "Sector 40" },
        { id: "Sector 41", name: "Sector 41" },
        { id: "Sector 42", name: "Sector 42" },
        { id: "Sector 43", name: "Sector 43" },
        { id: "Sector 44", name: "Sector 44" },
        { id: "Sector 45", name: "Sector 45" },
        { id: "Sector 46", name: "Sector 46" },
        { id: "Sector 47", name: "Sector 47" },
        { id: "Sector 48", name: "Sector 48" },
        { id: "Sector 49", name: "Sector 49" },
        { id: "Sector 50", name: "Sector 50" },
        { id: "Sector 51", name: "Sector 51" },
        { id: "Sector 52", name: "Sector 52" },
        { id: "Sector 53", name: "Sector 53" },
        { id: "Sector 54", name: "Sector 54" },
        { id: "Sector 55", name: "Sector 55" },
        { id: "Sector 56", name: "Sector 56" },
        { id: "Sector 57", name: "Sector 57" },
        { id: "Sector 58", name: "Sector 58" },
        { id: "Sector 59", name: "Sector 59" },
        { id: "Sector 60", name: "Sector 60" },
        { id: "Sukhna Lake", name: "Sukhna Lake" },
        { id: "Rock Garden of Chandigarh", name: "Rock Garden of Chandigarh" },
        { id: "Rose Garden", name: "Rose Garden" },
        { id: "Elante Mall", name: "Elante Mall" },
        { id: "Sector 17 Plaza", name: "Sector 17 Plaza" },
        { id: "Sector 43 Bus Stand", name: "Sector 43 Bus Stand" },
        { id: "Punjab University Campus", name: "Punjab University Campus" },
        { id: "Chandigarh Haat", name: "Chandigarh Haat" },
        { id: "Mushroom Park", name: "Mushroom Park" },
        {
          id: "Chandigarh Capitol Complex",
          name: "Chandigarh Capitol Complex",
        },
      ],
      "Uttar Pradesh": [
        { id: "Agra", name: "Agra" },
        { id: "Aligarh", name: "Aligarh" },
        { id: "Allahabad", name: "Allahabad" },
        { id: "Ambedkar Nagar", name: "Ambedkar Nagar" },
        { id: "Amethi", name: "Amethi" },
        { id: "Azamgarh", name: "Azamgarh" },
        { id: "Baghpat", name: "Baghpat" },
        { id: "Bahraich", name: "Bahraich" },
        { id: "Ballia", name: "Ballia" },
        { id: "Balrampur", name: "Balrampur" },
        { id: "Banda", name: "Banda" },
        { id: "Barabanki", name: "Barabanki" },
        { id: "Basti", name: "Basti" },
        { id: "Bijnor", name: "Bijnor" },
        { id: "Budaun", name: "Budaun" },
        { id: "Bulandshahr", name: "Bulandshahr" },
        { id: "Chandauli", name: "Chandauli" },
        { id: "Chitrakoot", name: "Chitrakoot" },
        { id: "Deoria", name: "Deoria" },
        { id: "Etah", name: "Etah" },
        { id: "Etawah", name: "Etawah" },
        { id: "Faizabad", name: "Faizabad" },
        { id: "Farrukhabad", name: "Farrukhabad" },
        { id: "Fatehpur", name: "Fatehpur" },
        { id: "Gautam Buddh Nagar", name: "Gautam Buddh Nagar" },
        { id: "Ghaziabad", name: "Ghaziabad" },
        { id: "Gonda", name: "Gonda" },
        { id: "Gorakhpur", name: "Gorakhpur" },
        { id: "Hamirpur", name: "Hamirpur" },
        { id: "Hardoi", name: "Hardoi" },
        { id: "Hathras", name: "Hathras" },
        { id: "Jalaun", name: "Jalaun" },
        { id: "Jaunpur", name: "Jaunpur" },
        { id: "Jhansi", name: "Jhansi" },
        { id: "Kanpur", name: "Kanpur" },
        { id: "Kannauj", name: "Kannauj" },
        { id: "Kaushambi", name: "Kaushambi" },
        { id: "Kushinagar", name: "Kushinagar" },
        { id: "Lakhimpur Kheri", name: "Lakhimpur Kheri" },
        { id: "Lalitpur", name: "Lalitpur" },
        { id: "Lucknow", name: "Lucknow" },
        { id: "Mau", name: "Mau" },
        { id: "Meerut", name: "Meerut" },
        { id: "Mirzapur", name: "Mirzapur" },
        { id: "Moradabad", name: "Moradabad" },
        { id: "Muzaffarnagar", name: "Muzaffarnagar" },
        { id: "Pratapgarh", name: "Pratapgarh" },
        { id: "Raebareli", name: "Raebareli" },
        { id: "Rampur", name: "Rampur" },
        { id: "Saharanpur", name: "Saharanpur" },
        { id: "Sambhal", name: "Sambhal" },
        { id: "Sant Kabir Nagar", name: "Sant Kabir Nagar" },
        { id: "Shahjahanpur", name: "Shahjahanpur" },
        { id: "Shamli", name: "Shamli" },
        { id: "Siddharthnagar", name: "Siddharthnagar" },
        { id: "Sitapur", name: "Sitapur" },
        { id: "Sonbhadra", name: "Sonbhadra" },
        { id: "Sultanpur", name: "Sultanpur" },
        { id: "Unnao", name: "Unnao" },
        { id: "Varanasi", name: "Varanasi" },
      ],
    },
  };

  //const handleInputChange = (e:any) => setItemCode(e.target.value);
  const handleCheckboxChange = (e: any) => setAutoGenerate(e.target.checked);

  //  Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBank((prevProduct: any) => ({
      ...prevProduct, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const handleWarehouseChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedWarehouseId = event.target.value;
    setBank((prevBank: any) => ({
      ...prevBank, // Keep other properties intact
      WarehouseId: selectedWarehouseId, // Update WarehouseId based on selection
    }));
  };

  const updateBank = async (bankData: any) => {
    try {
      handleOpenModal();
      bankData.country = selectedCountry;
      bankData.state = selectedState;
      bankData.city = selectedCity;
      console.log("Before updated bank Data" + JSON.stringify(bankData));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/EditBankDetailsById`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(bankData),
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

  useEffect(() => {
    const fetchBank = async () => {
      setIsLoading(true); // Ensure loading state is set before fetching.

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetBankDetailsById?Id=${id}`,
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
        console.log("Fetched Bank Data:", data);
        setBank(data);
      } catch (error) {
        console.error("Failed to fetch Bank:", error || error);
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

    fetchBank();
    fetchWarehouse();
  }, [id, token]); // Adding `id` and `token` to the dependency array.

  useEffect(() => {
    setCountries(mockData.countries);
  }, []);
  // Update states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      setStates(mockData.states[selectedCountry] || []);
      setCities([]); // Reset cities
    }
  }, [selectedCountry]);

  // Update cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      setCities(mockData.cities[selectedState] || []);
    }
  }, [selectedState]);

  const handleUpdate = async () => {
    try {
      const response = await updateBank(bank);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (isLoading)
    return (
      <DefaultLayout>
        <div>Loading...</div>
      </DefaultLayout>
    );
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Edit Bank"
        links={[{ label: "Bank", route: "/Bank" }]}
      />

      <div className="common_page_layout bank-new-page">
        <div className="form-container">
          <h2>General Details</h2>
          <form>
            {/* Bank Name */}
            <div className="row ">
              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Select Group
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <select>
                        <option>Bank Account</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    IFSC Code
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="IFSCCode"
                        id="IFSCCode"
                        placeholder="IFSC Code"
                        value={bank.IFSCCode}
                        onChange={handleInputChange}
                        data-fv-field="IFSCCode"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Bank Name
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="BankName"
                        id="BankName"
                        placeholder="Bank Name"
                        value={bank.BankName}
                        onChange={handleInputChange}
                        data-fv-field="BankName"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Branch Name
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="Location"
                        id="Location"
                        placeholder="Location"
                        value={bank.Location}
                        onChange={handleInputChange}
                        data-fv-field="Location"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Account Holder Name
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="AccountName"
                        id="AccountName"
                        placeholder="AccountName"
                        value={bank.AccountName}
                        onChange={handleInputChange}
                        data-fv-field="AccountName"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Account No.
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="AccountNumber"
                        id="AccountNumber"
                        placeholder="AccountNumber"
                        value={bank.AccountNumber}
                        onChange={handleInputChange}
                        data-fv-field="AccountNumber"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Swift Code
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="SwiftCode"
                        id="SwiftCode"
                        placeholder="SwiftCode"
                        value={bank.SwiftCode}
                        onChange={handleInputChange}
                        data-fv-field="SwiftCode"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <label className="m-checkbox m-checkbox--solid m-checkbox--brand">
                        <input
                          type="checkbox"
                          name="IsUPIAvailable"
                          id="IsUPIAvailable"
                          value="1"
                          checked={bank && bank.IsUPIAvialble === 1}
                          onChange={(e) =>
                            setBank({
                              ...bank,
                              IsUPIAvialble: e.target.checked ? 1 : 0,
                            })
                          }
                        />
                        Is Upi Available?
                        <span></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Address Line 1
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="AddressLine1"
                        id="AddressLine1"
                        placeholder="AddressLine1"
                        value={bank.AddressLine1}
                        onChange={handleInputChange}
                        data-fv-field="AddressLine1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Address Line 2
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="AddressLine2"
                        id="AddressLine2"
                        placeholder="AddressLine2"
                        value={bank.AddressLine2}
                        onChange={handleInputChange}
                        data-fv-field="AddressLine2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Select Country
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
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Select State
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
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Select City
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <select onChange={(e) => setSelectedCity(e.target.value)}>
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    ZIP/Postal Code
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    >
                      *
                    </span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="ZipCode"
                        id="ZipCode"
                        placeholder="ZipCode"
                        value={bank.ZipCode}
                        onChange={handleInputChange}
                        data-fv-field="ZipCode"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Warehouse
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
                        name="WarehouseId"
                        value={bank.WarehouseId} // Bind the value to the bank state
                        onChange={handleWarehouseChange} // Handle change when a warehouse is selected
                      >
                        <option value="">Select Warehouse</option>{" "}
                        {/* Default option */}
                        {warehouse.map((wh: any) => (
                          <option key={wh.id} value={wh.id}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-right">
                <a
                  href="/Bank/"
                  id="cancel_bank"
                  className="btn btn-sm btn-secondary"
                >
                  Cancel
                </a>
                <button
                  type="button"
                  className="btn btn-sm btn-brand"
                  id="save_bank"
                  onClick={handleUpdate}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
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
export default BankDetail;
