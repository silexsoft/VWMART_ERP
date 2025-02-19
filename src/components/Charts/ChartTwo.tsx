"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
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
      "Dec",
    ],
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
  },
  fill: {
    opacity: 1,
  },
};

const ChartTwo: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: "Customers",
      data: Array(12).fill(0), // Initialize with zeros for all months
    },
  ]);

  const fetchYearCustomerCounts = async (): Promise<void> => {
    const currentYear = new Date().getFullYear();
    const token = localStorage.getItem("NEXT_PUBLIC_BACKEND_TOKEN");
    const updatedData = Array(12).fill(0); // Temporary array to store fetched data

    for (let month = 0; month < 12; month++) {
      const createdFromUtc = new Date(Date.UTC(currentYear, month, 1)).toISOString();
      const createdToUtc = new Date(Date.UTC(currentYear, month + 1, 0, 23, 59, 59)).toISOString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Customer/GetAll?createdFromUtc=${createdFromUtc}&createdToUtc=${createdToUtc}&affiliateId=0&vendorId=0&dayOfBirth=0&monthOfBirth=0&pageIndex=0&pageSize=2147483647&getOnlyTotalCount=true`,
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

      updatedData[month] = data.total_count ?? 0; // Update the count for the month
    }

    // Update the state with the new data
    setSeries([
      {
        name: "Customers",
        data: updatedData,
      },
    ]);
  };

  useEffect(() => {
    fetchYearCustomerCounts();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          {/* <h4 className="text-xl font-semibold text-black dark:text-white">
            Customer this year
          </h4> */}
           {/* <p className="font-semibold text-primary">Total Orders This Year</p> */}
           <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Customers This Year</p>
              {/* <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p> */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
