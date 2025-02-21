"use client";
import React, { useState, useEffect } from "react";
import db from "@/db/dexieDB";
import { getProductDetail } from '@/utils/posService';
import { updateSpecificProduct } from '@/utils/productService';
import { useAuth } from "@/app/context/AuthContext";
const POSProductSearchBox = ({ setSelectedProducts }) =>
{
  const { token, warehouseId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);


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
      setSelectedProducts((prev) =>
        prev.some((p) => p.id === product.id) ? prev : [...prev, product]
      );
      setProducts([]);
      setSearchTerm('');
    }).catch((obj_error)=>{
          //Error case
    })
    
  };



  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="w-full p-2 border rounded"
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
