import prisma from "../../db.server";


export const loader = async ({ request }) => {
    //test route for testing shopify api
    console.log("request to navas.shipping.com", request);
    // const rules = await prisma.shippingRule.findMany({
    //     where: { shop: "quickstart-a1b140cb.myshopify.com" },
    // });

    return { rules: "rules" };
};

export const action = async ({ request }) => {

    //get data from load function
    const rules = await prisma.shippingRule.findMany({
        where: { shop: "quickstart-a1b140cb.myshopify.com" },
    });

    console.log("rules", rules);

    const body = await request.json();
    const postalCode = body.rate.destination.postal_code;

    console.log("Parsed request body:", body);

    let shippingRates = [];


    rules.forEach((rule) => {
        switch (rule.trigger) {

            case "Postal code":
                if (rule.trigger_value === postalCode) {
                    shippingRates.push({
                        "service_name": rule.name,
                        "description": 'Includes tracking and insurance.',
                        "service_code": rule.name,
                        "currency": rule.currency,
                        "total_price": rule.carrier_charge,
                        "phone_required": rule.require_phone_number,
                    });
                }
                break;
            default:
                console.log("default");
                break;
        }
    });

    // Return the shipping rates


    console.log("rates", { "rates": shippingRates });

    // The origin is not Ottawa, so return an empty response
    return {
        "rates": shippingRates
    };

}



// "rates": [
//     {
//         "service_name": "Expedited Mail",
//         "description": "Includes tracking and insurance.",
//         "service_code": "expedited_mail",
//         "currency": "INR",
//         "total_price": 1000,
//         "phone_required": false
//     },
//     {
//         "service_name": "Standard Shipping",
//         "description": "No tracking included.",
//         "service_code": "standard_shipping",
//         "currency": "INR",
//         "total_price": 8799,
//         "phone_required": true,
//         "min_delivery_date": "2024-02-10",
//         "max_delivery_date": "2024-02-15"
//     }
// ]