
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

        return data.token;

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

// export const holdOrder = async (token, customerId) =>
// {
//     try
//     {
//         const response = await axios.post(
//             `${API_BASE_URL}/hold`,
//             { customerId }, // Send customerId if available
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         return response.data;
//     } catch (error)
//     {
//         console.error("Hold order failed:", error);
//         throw error;
//     }
// };
