
export const guestLogin = async () =>
{
    try
    {
 console.log("guestLogin");
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-frontend/Authenticate/GetToken`, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "is_guest": true,
                "email": '',
                "password": ''
            })
        });

        let data = await response.json();
        return data;

        // document.cookie = `token=${data.token}`


    } catch (error)
    {
        if (error instanceof Error)
        {
            console.log(error)
        } else
        {
            console.log(String(error));
        }
    }

};

//Hold order API
export const holdOrder = async (token, holdData) =>
{
    try
    {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-frontend/Pos/AddProductToCart`, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(holdData)
        });
        return response.json();
        //return response.data;
    } catch (error)
    {
        console.error("Hold order failed:", error);
        throw error;
    }
};

//Create order API
export const createOrder = async (token, orderData) =>
    {
        try
        {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-frontend/Pos/ConfirmOrder`, {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(orderData)
            });
            return response.json();
        } catch (error)
        {
            console.error("Hold order failed:", error);
            throw error;
        }
    };

//Get Hold Bills
export const getholdbills = async (token, warehouseId) =>
{
    try
    {
        console.log(warehouseId);
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-frontend/Pos/HoldCart?warehouseId=${warehouseId}`, {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ""
            }

        });

        return response.json();
    } catch (error)
    {
        console.error("Get Hold order failed:", error);
        throw error;
    }
};

//This api code used to Migrate ShoppingCart from demo user to selected user.
export const migrateshoppingcart = async(token, fromCustomerId, toCustomerId, warehouseid) => {
   
    try
    {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-frontend/ShoppingCart/MigrateShoppingCart/${fromCustomerId}/${toCustomerId}?includeCouponCodes=true&warehouseid==${warehouseid}`, {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ""
            }
        });

        return response.json();
    } catch (error)
    {
        console.error("Get Hold order failed:", error);
        throw error;
    }
  }

  //This api code used to get product detail from api.
export const getProductDetail = async(token, productid, warehouseid) => {
   
    try
    {
        console.log("warehouseId="+warehouseid);
        const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Product/GetById/${productid}?warehouseId=${warehouseid}`;
        let response = await fetch(url, {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ""
            }
        });

        return response.json();
    } catch (error)
    {
        console.error("Get Hold order failed:", error);
        throw error;
    }
  }

//This api code used to get Customer last order detail by phone no.
export const getCustomerLastOrder = async(token, phoneno) => {
   
    try
    {
        const url = `${process.env.NEXT_PUBLIC_API_HOST}/api-frontend/Pos/GetTokenByPhone?phone=${phoneno}`;
        let response = await fetch(url, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ""
            }
        });

        return response.json();
    } catch (error)
    {
        console.error("Get Hold order failed:", error);
        throw error;
    }
  }

  //This api get orders from api
export const getAllOrdersFromApi = async(token, pageIndex,pageSize) => {
   console.log("token="+token);
    try
    {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/Search?storeId=0&vendorId=0&customerId=0
    &productId=0&affiliateId=0&warehouseId=0&billingCountryId=0&pageIndex=${pageIndex}&pageSize=${pageSize}
    &getOnlyTotalCount=false`,
            {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            }
        );

        return response.json();
    } catch (error)
    {
        console.error("Get Hold order failed:", error);
        throw error;
    }
  }

  //This api get order all items by order id from api
export const getOrderItemsByOrderIdFromApi = async(token, orderid) => {
     try
     {

         const response = await fetch(
             `${process.env.NEXT_PUBLIC_API_HOST}/api-backend/OrderItem/GetOrderItems/${orderid}`,
             {
                 method: 'GET',
                 headers: {
                     accept: 'application/json',
                     Authorization: token ? `Bearer ${token}` : '',
                 },
             }
         );
 
         return response.json();
     } catch (error)
     {
         console.error("Get Hold order failed:", error);
         throw error;
     }
   }
