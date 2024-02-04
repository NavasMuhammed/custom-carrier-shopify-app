import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
    BlockStack,
    Card,
    Layout,
    Page,
    Text
} from "@shopify/polaris";
import CarrierServiceCard from "../components/cards/carrierServices";
import ShipingRules from "../components/cards/shipingRules";
import CarrierServiceForm from "../components/forms/carrierService";
import RulesForm from "../components/forms/rulesForm";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";



export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const response = await admin.rest.resources.CarrierService.all({
        session: session,
    });

    const rules = await prisma.shippingRule.findMany({
        where: { shop: session.shop },
    });



    return json({ carrier: response.data, rules: rules });
};

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);


    const bodyText = await request.text();
    const body = new URLSearchParams(bodyText);

    const { shop } = session;




    switch (body.get('action')) {
        case 'create': {
            const name = body.get('name');
            const callback_url = body.get('callback_url');
            const service_discovery = body.get('service_discovery') ?? false;
            try {
                const carrier_service = new admin.rest.resources.CarrierService({ session: session });

                carrier_service.name = name;
                carrier_service.callback_url = callback_url;
                carrier_service.service_discovery = JSON.parse(service_discovery);
                await carrier_service.save({
                    update: true,
                });
                return json({ carrier: carrier_service });

            } catch (error) {
                return json({ carrier: error });
            }
        }
        case 'create-rule': {

            console.log(body, "body")

            const trigger = body.get('trigger');
            const currency = body.get('currency');
            const trigger_value = body.get('trigger_value');
            const carrier_charge = body.get('carrier_charge');
            const require_phone_number = JSON.parse(body.get('require_phone_number'));
            const name = body.get('name');
            const payload = {
                shop,
                name,
                trigger,
                currency,
                trigger_value,
                carrier_charge,
                require_phone_number
            }
            try {
                const resp = await prisma.shippingRule.create({
                    data: { ...payload }
                });

                console.log(resp, "resp")
                return json({ carrier: "created" });
            } catch (error) {
                console.log(error, "error")
                return json({ carrier: error });
            }
        }

        case 'remove-rule': {
            const id = body.get('id');

            try {
                await prisma.shippingRule.delete({
                    where: { id: id }
                });

                return json({ carrier: "deleted" });

            } catch (error) {
                return json({ carrier: error });
            }
        }

        case 'remove': {
            const id = body.get('id');

            try {
                await admin.rest.resources.CarrierService.delete({
                    session: session,
                    id: id,
                });

                return json({ carrier: "deleted" });

            } catch (error) {
                return json({ carrier: error });
            }
        }
    }
}




export default function AdditionalPage() {
    const data = useLoaderData();
    const isCarrierAvailable = data?.carrier.length > 0
    const isRulesAvailabel = data?.rules.length > 0
    return (
        <Page>
            <ui-title-bar title="Custom carrier services" />
            <Layout>
                <Layout.Section  >
                    <BlockStack gap={200} align="space-between">
                        <BlockStack gap={200} align="space-between">
                            <Text fontWeight="medium">Available carrier services</Text>

                            {isCarrierAvailable ? (
                                <CarrierServiceCard />
                            ) : (
                                <Card>
                                    <Text>No carrier services available</Text>
                                </Card>
                            )}
                        </BlockStack>
                        <BlockStack gap={200} align="space-between">
                            <BlockStack gap={200} align="space-between">
                                <Text fontWeight="medium">Available rules</Text>

                                {isRulesAvailabel ? (
                                    <ShipingRules />
                                ) : (
                                    <Card>
                                        <Text>No Rules created</Text>
                                    </Card>
                                )}
                            </BlockStack>
                        </BlockStack>
                    </BlockStack>
                </Layout.Section>
                {/* create carrier service */}
                {
                    data?.carrier.length === 0 ?
                        <Layout.Section variant="oneThird">
                            <BlockStack gap={200} align="space-between">
                                <Text fontWeight="medium">Create carrier services</Text>
                                <Card >
                                    <CarrierServiceForm />
                                </Card>
                            </BlockStack>
                        </Layout.Section> :
                        <Layout.Section variant="oneThird">
                            <BlockStack gap={200} align="space-between">
                                <Text fontWeight="medium">Create Shiping rate rules</Text>
                                <Card >
                                    <RulesForm />
                                </Card>
                            </BlockStack>
                        </Layout.Section>
                }
            </Layout>
        </Page>
    );
}

