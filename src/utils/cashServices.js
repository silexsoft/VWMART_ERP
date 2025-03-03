//Hold order API
export const pOSCashRegisterCreate = async (token, postData) =>
    {
        try
        {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-frontend/Pos/POSCashRegisterCreate`, {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(postData)
            });
            return response.json();
        } catch (error)
        {
            console.error("Hold order failed:", error);
            throw error;
        }
    };