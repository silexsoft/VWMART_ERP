"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DiscountsTable from "@/components/DiscountsTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

type Discount = {
  id: string;
  discount_type_id: string;
  discount_percentage: string;
  start_date_utc: string;
  end_date_utc: string;
  is_active: boolean;
  name: string;
};

const DiscountsPage = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    } else {
      const fetchDiscounts = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Discount/GetAll?showHidden=false&isActive=true`,
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
          console.log("Fetched discount:", data);

          const mappedDiscounts = Array.isArray(data)
            ? data.map((discount: any) => ({
                id: discount.id,
                discount_type_id: discount.discount_type_id,
                discount_percentage: discount.discount_percentage,
                start_date_utc: discount.start_date_utc,
                end_date_utc: discount.end_date_utc,
                is_active: discount.is_active,
                name: discount.name,
              }))
            : [];

          setDiscounts(mappedDiscounts);
        } catch (error) {
          console.error("Error fetching discounts:", error);
        }
      };

      fetchDiscounts();
    }
  }, [token, router]);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <DiscountsTable discounts={discounts} />
      </div>
    </DefaultLayout>
  );
};

export default DiscountsPage;
