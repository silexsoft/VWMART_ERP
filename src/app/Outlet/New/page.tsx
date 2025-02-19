"use client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Modal, Button, Alert } from "react-bootstrap";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";
//import { Editor } from "@tinymce/tinymce-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Link from "next/link";
import { add, set } from "date-fns";
import { de, se } from "date-fns/locale";
import { bool } from "yup";
import { useRef } from "react";

let Token = process.env.BACKEND_TOKEN;
const OutletDetail = () => {
  const pathname = usePathname();
  // const id = pathname.match(/\/Outlet\/(\d+)/)?.[1];

  const router = useRouter();
  const { token, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [newWarehouseId, SetnewWarehouseId] = useState("");
  const [newAddressId, SetnewAddressId] = useState("");

  interface Bank {
    bank_name: string;
    location: string;
    account_name: string;
    account_number: string;
    created_by: string;
    ifsc_code: string;
    swift_code: string;
    credit_balance: number | null; // Allow null values
    debit_balance: number | null;
    account_group: string;
    address_line1: string;
    address_line2: string;
    country: string;
    state: string;
    city: string;
    zip_code: string;
    is_upi_available: string;
    created_on: Date;
    warehouse_id?: number | null;
    id?: number | null;
  }

  const [bank, setBank] = useState<Bank>({
    bank_name: "",
    location: "",
    account_name: "",
    account_number: "",
    created_by: "",
    ifsc_code: "",
    swift_code: "",
    credit_balance: 0,
    debit_balance: 0,
    account_group: "",
    address_line1: "",
    address_line2: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    is_upi_available: "",
    created_on: new Date(),
    warehouse_id: 0,
    id: 0,
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

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showfassino, setShowfassino] = useState(false);

  const [mapAddrss, setMapAddrs] = useState();
  const [cords, setcords] = useState([]);
  const [modifiedAddrss, setModifiedAddrss] = useState();
  const [modifiedAddrsObj, setModifiedAddrsObj] = useState();
  const [geoCords, setGeoCords] = useState([0, 0]);

  const setCordsWrapper = (data: any) => {
    setcords(data);
  };

  const setModifiedAddrssWrapper = (data: any) => {
    setModifiedAddrss(data);
  };
  const setModifiedAddrsObjWrapper = (data: any) => {
    setModifiedAddrsObj(data);
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  interface Warehouse {
    name: string;
    admin_comment: string;
    address_id?: number | null;
    parent_warehouse_id?: number | null;
    gstin: string;
    panno: string;
    tanno: string;
    fssaino: string;
    yearinterval: string;
    gsttype: string;
    latitude: string;
    longitude: string;
    radius: string;
    id?: number | null;
  }

  const [warehouse, setwarehouses] = useState<Warehouse>({
    name: "",
    admin_comment: "",
    address_id: 0,
    parent_warehouse_id: 0,
    gstin: "",
    panno: "",
    tanno: "",
    fssaino: "",
    yearinterval: "",
    gsttype: "",
    latitude: "",
    longitude: "",
    radius: "",
    id: 0,
  });
  const [warehouselist, setWarehouseslist] = useState<any>([]);

  interface Address {
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    country_id?: number | null;
    state_province_id?: number | null;
    county: string;
    city: string;
    address1: string;
    address2: string;
    zip_postal_code: string;
    phone_number: string;
    fax_number: string;
    custom_attributes: string;
    created_on_utc: Date;
    latitude: string;
    longitude: string;
    locality: string;
    floor: string;
    id?: number | null;
  }

  const [address, setAddress] = useState<Address>({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    country_id: 0,
    state_province_id: 0,
    county: "",
    city: "",
    address1: "",
    address2: "",
    zip_postal_code: "",
    phone_number: "",
    fax_number: "",
    custom_attributes: "",
    created_on_utc: new Date(),
    latitude: "",
    longitude: "",
    locality: "",
    floor: "",
    id: 0,
  });

  const [yearInterval, setYearInterval] = useState();

  const [gstType, setGstType] = useState("");

  const handlefassino = () => {
    setShowfassino(!showfassino);
  };

  const handleSelectChange = (event: any) => {
    setYearInterval(event.target.value); // Update the state on change
    warehouse.yearinterval = event.target.value;
  };
  const handleSelectgstTypeChange = (event: any) => {
    setGstType(event.target.value); // Update the state on change
    warehouse.gsttype = event.target.value;
  };

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

  useEffect(() => {
    if (modifiedAddrsObj) {
    }
    console.log("modifiedAddrsObj", modifiedAddrsObj);
  }, [modifiedAddrss, modifiedAddrsObj]);

  useEffect(() => {
    if (cords) {
      console.log("latitude", cords[0]);
      console.log("longitude", cords[1]);
      warehouse.latitude = cords[0];
      warehouse.longitude = cords[1];
    }
  }, [cords]);

  useEffect(() => {
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
        setWarehouseslist(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchWarehouse();
  });

  //const handleInputChange = (e:any) => setItemCode(e.target.value);
  const handleCheckboxChange = (e: any) => setAutoGenerate(e.target.checked);

  //  Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBank((predata: any) => ({
      ...predata, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const handleInputWarehouseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setwarehouses((predata: any) => ({
      ...predata, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const handleWarehouseChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedWarehouseId = event.target.value;
    setwarehouses((prevBank: any) => ({
      ...prevBank, // Keep other properties intact
      parent_warehouse_id: selectedWarehouseId, // Update WarehouseId based on selection
    }));
  };
  const handleInputAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAddress((predata: any) => ({
      ...predata, // Spread the previous state
      [name]: value, // Update the specific field
    }));
  };

  const CreateWarehouse = async (warehouseData: any) => {
    try {
      warehouseData.yearinterval = yearInterval;
      console.log(
        "Before inserted warehouseData Data" + JSON.stringify(warehouseData),
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/Create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(warehouseData),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      } else {
        // handleOpenModal();
      }
      const data = await response.json();
      console.log("updated data" + JSON.stringify(data));
      SetnewWarehouseId(data.id);
      return data;
    } catch (error) {
    } finally {
    }
  };

  const updateBank = async (bankData: any, warehouseid: any) => {
    try {
      bankData.country = selectedCountry;
      bankData.state = selectedState;
      bankData.city = selectedCity;
      bankData.warehouse_id = warehouseid;
      console.log("Before inserted bank Data" + JSON.stringify(bankData));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/InsertBankDetails`,
        {
          method: "POST",
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
      } else {
        handleOpenModal();
      }
      const data = await response.json();
      console.log("updated data" + data);
      return data;
    } catch (error) {
    } finally {
    }
  };

  const updateAddress = async (address: any) => {
    try {
      // handleOpenModal();
      address.country = selectedCountry;
      address.city = selectedCity;

      console.log("Before updated address Data" + JSON.stringify(address));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Address/Create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(address),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("updated address data" + JSON.stringify(data));
      SetnewAddressId(data.id);
      return data;
    } catch (error) {
    } finally {
    }
  };

  const updateWarehouse = async (newAddressId: any) => {
    try {
      warehouse.address_id = newAddressId;
      warehouse.id = Number(newWarehouseId);
      console.log("Before updated warehouse Data" + JSON.stringify(warehouse));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/Update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(warehouse),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("updated warehouse address is data" + JSON.stringify(data));
      SetnewAddressId(data.id);
      return data;
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (newWarehouseId) {
      updateBank(bank, newWarehouseId);
    }
  }, [newWarehouseId]);

  useEffect(() => {
    if (newAddressId) {
      updateWarehouse(newAddressId);
    }
  }, [newAddressId]);

  //useEffect(() => {
  //   const fetchBank = async () => {
  //    // setIsLoading(true); // Ensure loading state is set before fetching.

  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Payment/GetBankDetailsByWarehouseId?Id=${id}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Accept: 'application/json',
  //             Authorization: token ? `Bearer ${token}` : '',
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
  //       }

  //       const data = await response.json();
  //       console.log("Fetched Bank Data:", data);
  //       setBank(data);

  //     } catch (error) {
  //       console.error("Failed to fetch Bank:", error || error);
  //     } finally {
  //      // setIsLoading(false); // Always set loading to false after the fetch is complete.
  //     }
  //   };

  //   const fetchWarehouseById = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Warehouse/GetById/${id}
  //         `,
  //         {
  //           method: 'GET',
  //           headers: {
  //             accept: 'application/json',
  //             Authorization: token ? `Bearer ${token}` : '',
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log("api warehouse data is "+JSON.stringify(data));
  //       setwarehouses({
  //             id: data.id,
  //             admin_comment: data.admin_comment || '',
  //             Name: data.name,
  //             address_id: data.address_id,
  //           });
  //     } catch (error) {
  //       console.error("Failed to fetch products:", error);
  //     }
  //   };

  // fetchBank();
  // fetchWarehouseById();

  //}, [ token]); // Adding `id` and `token` to the dependency array.
  const fetchWarehouseAddress = async (AddressId: number) => {
    try {
      setIsLoading(false);
      console.log("AddressId" + AddressId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Address/GetById/${AddressId}
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
      console.log("api warehousae address" + JSON.stringify(data));
      setAddress(data);
    } catch (error) {
      console.error("Failed to fetch warehouse Addressess:", error);
    }
  };
  // useEffect(() => {
  //  // console.log("warehouse data: " + JSON.stringify(warehouse));
  //   if (warehouse && warehouse.address_id !== undefined) { // Ensure `address_id` exists
  //     fetchWarehouseAddress(warehouse.address_id);
  //   } else {
  //     //console.error("Invalid warehouse data or address_id is missing.");
  //   }
  // }, [warehouse]);

  const handleUpdate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!warehouse.name) {
        toast.error("Please Enter Warehouse Name", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      if (!address.zip_postal_code) {
        toast.error("Please Enter Zip Postal Code", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      if (!address.address1) {
        {
          toast.error("Please Enter Address 1", {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }
      }

      // console.log("year interval", yearInterval);
      // console.log("gsttype", gstType);

      // console.log("warehouse data: " + JSON.stringify(warehouse));
      // console.log("bank data: " + JSON.stringify(bank));
      // console.log("address data: " + JSON.stringify(address));

      const respons = await CreateWarehouse(warehouse);
      //const response = await updateBank(bank);
      const responses = await updateAddress(address);
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage = JSON.stringify(error);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  //   if (isLoading) return (
  //     <DefaultLayout>
  //        <div>Loading...</div></DefaultLayout>);
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="New Outlet"
        links={[{ label: "Outlet", route: "/Outlet" }]}
      />

      <div className="common_page_layout outlet-new-page">
        <div className="form-container">
          <form>
            {/* Warehouse new */}
            <div className="row ">
              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Outlet Type
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    ></span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <span>Branch</span>
                    {/* <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="name"
                        id="name"
                        placeholder="name"
                        value={warehouse.name || ""}
                        onChange={handleInputWarehouseChange}
                        data-fv-field="name"
                      />
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    Warehouse Name
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
                        name="name"
                        id="name"
                        placeholder="name"
                        value={warehouse.name || ""}
                        onChange={handleInputWarehouseChange}
                        data-fv-field="first_name"
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
                    First Name
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    ></span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="first_name"
                        id="first_name"
                        placeholder="First Name"
                        value={`${address.first_name || ""}`}
                        onChange={handleInputAddressChange}
                        data-fv-field=" first_name"
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
                    Last Name
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    ></span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="last_name"
                        id="last_name"
                        placeholder="Last Name"
                        value={`${address.last_name || ""}`}
                        onChange={handleInputAddressChange}
                        data-fv-field="last_name"
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
                    Email
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={address.email || ""}
                        onChange={handleInputAddressChange}
                        data-fv-field="email"
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
                    Company
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="company"
                        id="company"
                        placeholder="Company"
                        value={address.company || ""}
                        onChange={handleInputAddressChange}
                        data-fv-field="company"
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
                    ></span>
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
                    Address 1
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
                        name="address1"
                        id="address1"
                        placeholder="Address 1"
                        value={address.address1 || ""}
                        onChange={handleInputAddressChange}
                        data-fv-field="address1"
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
                    Address 2
                    <span
                      style={{ fontSize: "1.25rem" }}
                      className="text-danger"
                    ></span>
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="address2"
                        id="address2"
                        placeholder="Address 2"
                        value={address.address2 || ""}
                        onChange={handleInputAddressChange}
                        data-fv-field="address2"
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
                    Zip Postal Code
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
                        name="zip_postal_code"
                        id="zip_postal_code"
                        placeholder="zip postal code"
                        value={address.zip_postal_code || ""}
                        onChange={handleInputAddressChange}
                        data-fv-field="zip_postal_code"
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
                    Phone Number
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="phone_number"
                        id="phone_number"
                        placeholder="Phone Number"
                        value={address.phone_number || ""}
                        onChange={handleInputAddressChange}
                        data-fv-field="phone_number"
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
                    Fax Number
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="fax_number"
                        id="fax_number"
                        placeholder="Fax Number"
                        value={address.fax_number || ""}
                        onChange={handleInputAddressChange}
                        data-fv-field="fax_number"
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
                    Admin Comment
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="admin_comment"
                        id="admin_comment"
                        placeholder="Admin Commment"
                        value={warehouse.admin_comment || ""}
                        onChange={handleInputWarehouseChange}
                        data-fv-field="admin_comment"
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
                    Year Interval
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <select
                        value={warehouse.yearinterval}
                        onChange={handleSelectChange}
                        id="yearinterval"
                        name="yearinterval"
                      >
                        <option value="2015-2016">2015-2016</option>
                        <option value="2016-2017">2016-2017</option>
                        <option value="2017-2018">2017-2018</option>
                        <option value="2018-2019">2018-2019</option>
                        <option value="2019-2020">2019-2020</option>
                        <option value="2020-2021">2020-2021</option>
                        <option value="2021-2022">2021-2022</option>
                        <option value="2022-2023">2022-2023</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
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
                    GST Type
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <select
                        id="gsttype"
                        name="gsttype"
                        value={warehouse.gsttype} // controlled value (assuming `gstType` is state)
                        onChange={handleSelectgstTypeChange} // controlled input change handler
                      >
                        <option value="UnRegistered">UnRegistered</option>
                        <option value="Registered">Registered</option>
                        <option value="Composition Scheme">
                          Composition Scheme
                        </option>
                        <option value="Input Service Distributor">
                          Input Service Distributor
                        </option>
                        <option value="E-Commerce Operator">
                          E-Commerce Operator
                        </option>
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
                    GSTIN
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="gstin"
                        id="gstin"
                        placeholder="GST IN"
                        value={warehouse.gstin || ""}
                        onChange={handleInputWarehouseChange}
                        data-fv-field="gstin"
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
                    PAN No.
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="panno"
                        id="panno"
                        placeholder="PAN No"
                        value={warehouse.panno || ""}
                        onChange={handleInputWarehouseChange}
                        data-fv-field="panno"
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
                    TAN No.
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="tanno"
                        id="tanno"
                        placeholder="TAN No"
                        value={warehouse.tanno || ""}
                        onChange={handleInputWarehouseChange}
                        data-fv-field="tanno"
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
                    Website
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="Website"
                        id="Website"
                        placeholder="Website"
                        value="https://dev.vwmart.in/"
                        onChange={handleInputAddressChange}
                        data-fv-field="Website"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  ></label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="checkbox"
                        name="ShowFSSAINo"
                        id="ShowFSSAINo"
                        onChange={handlefassino}
                      />
                      FSSAI No.
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    FSSAI No.
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="fssaino"
                        id="fssaino"
                        placeholder="FSSAI No"
                        value={warehouse.fssaino || ""}
                        onChange={handleInputWarehouseChange}
                        data-fv-field="fassino"
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
                    Parent Warehouse
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <select
                        name="parent_warehouse_id"
                        value={warehouse.parent_warehouse_id || ""}
                        onChange={handleWarehouseChange} // Handle change when a warehouse is selected
                      >
                        <option value="">Select Warehouse</option>{" "}
                        {/* Default option */}
                        {warehouselist.map((wh: any) => (
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
              <div className="col-md-3">
                <div className="form-group row has-success">
                  <label
                    style={{ fontWeight: "bold" }}
                    className="col-lg-12 col-md-12 col-sm-12"
                  >
                    IFSC Code
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="ifsc_code"
                        id="ifsc_code"
                        placeholder="IFSC Code"
                        value={bank.ifsc_code || ""}
                        onChange={handleInputChange}
                        data-fv-field="ifsc_code"
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
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="bank_name"
                        id="bank_name"
                        placeholder="Bank Name"
                        value={bank.bank_name || ""}
                        onChange={handleInputChange}
                        data-fv-field="bank_name"
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
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="location"
                        id="location"
                        placeholder="Location"
                        value={bank.location || ""}
                        onChange={handleInputChange}
                        data-fv-field="location"
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
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="account_number"
                        id="account_number"
                        placeholder="Account Number"
                        value={bank.account_number || ""}
                        onChange={handleInputChange}
                        data-fv-field="account_number"
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
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="account_name"
                        id="account_name"
                        placeholder="Account Name"
                        value={bank.account_name || ""}
                        onChange={handleInputChange}
                        data-fv-field="account_name"
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
                  </label>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="swift_code"
                        id="swift_code"
                        placeholder="Swift Code"
                        value={bank.swift_code || ""}
                        onChange={handleInputChange}
                        data-fv-field="swift_code"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section  */}
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row has-success">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Latitude
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="latitude"
                            id="latitude"
                            placeholder="Latitude"
                            value={warehouse.latitude || ""}
                            onChange={handleInputWarehouseChange}
                            data-fv-field="latitude"
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
                        Longitude
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="longitude"
                            id="longitude"
                            placeholder="Longitude"
                            value={warehouse.longitude || ""}
                            onChange={handleInputWarehouseChange}
                            data-fv-field="longitude"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row has-success">
                      <label
                        style={{ fontWeight: "bold" }}
                        className="col-lg-12 col-md-12 col-sm-12"
                      >
                        Radius (In KM)
                      </label>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="radius"
                            id="radius"
                            placeholder="Radius"
                            value={warehouse.radius || ""}
                            onChange={handleInputWarehouseChange}
                            data-fv-field="radius"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <Map
                  address={mapAddrss}
                  setCordsWrapper={setCordsWrapper}
                  setModifiedAddrssWrapper={setModifiedAddrssWrapper}
                  setModifiedAddrsObjWrapper={setModifiedAddrsObjWrapper}
                  geoCords={geoCords}
                  searchInputRef={searchInputRef}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-right">
                <a
                  href="/Outlet/"
                  id="cancel_Outlet"
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

          <ToastContainer />
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
          Data Insert Successfully !
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
export default OutletDetail;
