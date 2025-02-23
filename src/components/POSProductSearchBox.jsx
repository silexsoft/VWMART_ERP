"use client";
import React, { useState, useEffect,useRef } from "react";
import db from "@/db/dexieDB";
import { getProductDetail } from '@/utils/posService';
import { updateSpecificProduct } from '@/utils/productService';
import { useAuth } from "@/app/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const POSProductSearchBox = ({ setSelectedProducts }) =>
{
  const { token, warehouseId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);


  useEffect(() =>
  {
    const delayDebounceFn = setTimeout(() =>
    {
      if (searchTerm.trim())
      {
        searchProducts(searchTerm);
      } else if (products.length > 0) 
      {
        setProducts([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchProducts = async (query) =>
  {
    try
    {
      const results = await db.products
        .where("name")
        .startsWithIgnoreCase(query)
        .or("sku")
        .startsWithIgnoreCase(query)
        //.and(obj => obj.in_stock == true)
        .toArray();
      setProducts(results);
    } catch (error)
    {
      console.error("Error searching products:", error);
    }
  };

  const addProduct = (product) =>
  {
    
    getProductDetail(token,product.id,warehouseId).then((obj_response)=>{
      updateSpecificProduct(obj_response);
      product=obj_response;
      if(product.in_stock )
      {
        setSelectedProducts((prev) =>
          prev.some((p) => p.id === product.id) ? prev : [...prev, product]
        );
      }
      else{
        toast.error("Product is out of stock", {
                      position: "top-right",
                      autoClose: 5000,
                      toastId:`out_of_stock_${product.id}`
                    });
      }
      
      setProducts([]);
      setSearchTerm('');
    }).catch((obj_error)=>{
          //Error case
    })
    
  };

  const addScannedProduct = (product) =>
    {
      
      getProductDetail(token,product.id,warehouseId).then((obj_response)=>{
        updateSpecificProduct(obj_response);
        product=obj_response;
        if(product.in_stock )
        {
          setSelectedProducts((prev) =>
            prev.some((p) => p.id === product.id) ? prev : [...prev, product]
          );
        }
        else{
          toast.error("Product is out of stock", {
                        position: "top-right",
                        autoClose: 5000,
                        toastId:`out_of_stock_${product.id}`
                      });
        }
        
        setProducts([]);
        setSearchTerm('');
      }).catch((obj_error)=>{
            //Error case
      })
      
    };
  
  // After SKU Scan scanner fire tab event and this function called and add items to cart.
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const results = await db.products
        .where("sku")
        .equals(e.target.value.trim())
        .toArray();
      if(results.length > 0)
      {
        addScannedProduct(results[0]);
        e.target.value="";
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className="w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      <div className="mt-2">
        {products.length > 0 ? (
          <ul className="searchlistbox col-md-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-200"
                onClick={() => addProduct(product)}
              >
                <strong>{product.name}</strong>
              </li>
            ))}
          </ul>
        ) : (
          ''
        )}
      </div>
     
    </div>
  );
};

export default POSProductSearchBox;
