
export const guestLogin = async () =>
{
    try
    {

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

        return response.data;
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
