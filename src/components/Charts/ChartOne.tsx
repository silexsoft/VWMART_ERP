import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import 'bootstrap/dist/css/bootstrap.min.css';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 500,
  },
};

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: "Orders",
      data: Array(12).fill(0),
    },
  ]);
  const [activeButton, setActiveButton] = useState<string>("year");

  const fetchCurrentWeekOrderCounts = async (): Promise<void> => {
    const token = localStorage.getItem('NEXT_PUBLIC_BACKEND_TOKEN');
    // const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date();
  
    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sets to the previous Sunday
  
    // Get the end of the current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sets to Saturday
  
    // Convert both dates to UTC ISO strings
    const createdFromUtc = new Date(Date.UTC(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate())).toISOString();
    const createdToUtc = new Date(Date.UTC(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 23, 59, 59)).toISOString();
   
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/Search?storeId=0&vendorId=0&customerId=0&productId=0&affiliateId=0&warehouseId=0&billingCountryId=0&createdFromUtc=${createdFromUtc}&createdToUtc=${createdToUtc}&pageIndex=0&pageSize=2147483647&getOnlyTotalCount=true`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );
  
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
  
    // Initialize all months with zero values
    Array(12).fill(0).forEach((_, index) => {
      series[0].data[index] = 0;
    });
    // Set the current month's count to the data fetched from the API
    series[0].data[currentMonth] = data.total_count ?? 0;
   // console.log(series); // Log the updated series with weekly count for the current month
  };
  
const fetchCurrentMonthOrderCounts = async (): Promise<void> => {
  const token = localStorage.getItem('NEXT_PUBLIC_BACKEND_TOKEN');
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); 
    
  const createdFromUtc = new Date(Date.UTC(currentYear, currentMonth, 1)).toISOString();
  const createdToUtc = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59)).toISOString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/Search?storeId=0&vendorId=0&customerId=0&productId=0&affiliateId=0&warehouseId=0&billingCountryId=0&createdFromUtc=${createdFromUtc}&createdToUtc=${createdToUtc}&pageIndex=0&pageSize=2147483647&getOnlyTotalCount=true`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    
    Array(12).fill(0).forEach((_, index) => {
      series[0].data[index] = 0;
    });
    series[0].data[currentMonth] = data.total_count ?? 0;
};
  
  const fetchYearOrderCounts = async () => {
    const token = localStorage.getItem("NEXT_PUBLIC_BACKEND_TOKEN");
    const currentYear = new Date().getFullYear();
    const updatedData = Array(12).fill(0); // Initialize with zeros

    for (let month = 0; month < 12; month++) {
      const createdFromUtc = new Date(Date.UTC(currentYear, month, 1)).toISOString();
      const createdToUtc = new Date(Date.UTC(currentYear, month + 1, 0, 23, 59, 59)).toISOString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/Search?storeId=0&vendorId=0&customerId=0&productId=0&affiliateId=0&warehouseId=0&billingCountryId=0&createdFromUtc=${createdFromUtc}&createdToUtc=${createdToUtc}&pageIndex=0&pageSize=2147483647&getOnlyTotalCount=true`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      updatedData[month] = data.total_count ?? 0; // Update the specific month value
    }

    setSeries([{ name: "Orders", data: updatedData }]); // Update the state
  };

  useEffect(() => {
    fetchYearOrderCounts();
  }, []);

const handleYearClick = async () => {
  try {
    setActiveButton('year');
    await fetchYearOrderCounts(); // Fetch and update order counts
  } catch (error) {
    console.error("Failed to fetch order counts:", error);
  }
};

  const handleCurrentMonthClick = async () => {
  try {
    setActiveButton('month');
    await fetchCurrentMonthOrderCounts(); // Fetch and update order counts
  } catch (error) {
    console.error("Failed to fetch order counts:", error);
  }
}

  const handleCurrentWeekClick = async () => {
  try {
    setActiveButton('week');
    await fetchCurrentWeekOrderCounts(); // Fetch and update order counts
  } catch (error) {
    console.error("Failed to fetch order counts:", error);
  }
}


  return (
   <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Orders This Year</p>
              {/* <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p> */}
            </div>
          </div>
          {/* <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div> */}
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            {/* <button  id="year" 
            className={`rounded bg-white px-3 py-1 text-xs font-medium text-black ${
              activeButton === 'year' ? 'shadow-card' : ''
            } hover:bg-white dark:bg-boxdark dark:text-white dark:hover:bg-boxdark`}
            onClick={() => handleYearClick()} 
            >
              Year
            </button> */}
            {/* <button
              className={`rounded px-3 py-1 text-xs font-medium text-black ${
                activeButton === 'month' ? 'shadow-card' : ''
              } hover:bg-white dark:text-white dark:hover:bg-boxdark`}
            onClick={() => handleCurrentMonthClick()}
            >
              Month
            </button>
            <button className={`rounded px-3 py-1 text-xs font-medium text-black ${
                activeButton === 'month' ? 'shadow-card' : ''
              } hover:bg-white dark:text-white dark:hover:bg-boxdark`}
            onClick={() => handleCurrentWeekClick()}
            >
              Week
            </button> */}
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>    
  );
};

export default ChartOne;
