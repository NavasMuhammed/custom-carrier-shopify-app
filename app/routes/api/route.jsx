

export const loader = async ({ request }) => {
    //test route for testing shopify api
    console.log("request to navas.shipping.com", request);
    return { message: "hello world" };
};

export const action = async ({ request }) => {
    //test route for testing shopify api
    // console.log("request to navas.shipping.com", request);
    // Extract the callback URL from the request body
    const body = await request.json();

    // Log the parsed body
    console.log("Parsed request body:", body);

    if (body.rate.destination.postal_code !== "676519") {
        // The origin is not Ottawa, so return an empty response
        return {
            "rates": [
                {
                    "service_name": "Expedited Mail",
                    "description": "Includes tracking and insurance.",
                    "service_code": "expedited_mail",
                    "currency": "INR",
                    "total_price": 1000,
                    "phone_required": false
                },
                {
                    "service_name": "Standard Shipping",
                    "description": "No tracking included.",
                    "service_code": "standard_shipping",
                    "currency": "INR",
                    "total_price": 8799,
                    "phone_required": true,
                    "min_delivery_date": "2024-02-10",
                    "max_delivery_date": "2024-02-15"
                }
            ]
        };
    }
    if (body.rate.destination.postal_code === "676519") {
        return {
            "rates": [
                {
                    "service_name": "Expedited Mail",
                    "description": "Includes tracking and insurance.",
                    "service_code": "expedited_mail",
                    "currency": "INR",
                    "total_price": 500,
                    "phone_required": false
                },
                {
                    "service_name": "Standard Shipping",
                    "description": "No tracking included.",
                    "service_code": "standard_shipping",
                    "currency": "INR",
                    "total_price": 800,
                    "phone_required": true,
                    "min_delivery_date": "2024-02-10",
                    "max_delivery_date": "2024-02-15"
                }
            ]
        };
    }
}