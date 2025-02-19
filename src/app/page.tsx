'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: "VWMart Erp",
//   description: "VWMart Erp",
// };


export default function Home() {

  const router = useRouter();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(true); 

useEffect(() => {
  if (!token) 
  {
    router.push('/auth/signin');
  }
  else
  {
    setLoading(false);
  }
 }, [token,router]);

 if (loading) {
  // Render a loader while checking the token
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading...</p>
    </div>
  );
}
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>   
    </>
  );
} 

 
               