import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import {
    BlockStack,
    Button,
    Card,
    Checkbox,
    Form,
    InlineStack,
    Layout,
    Page,
    Select,
    Text,
    TextField
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useCallback, useEffect, useState } from "react";
import prisma from "../db.server";



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
    const [name, setName] = useState('');
    const [discovery, setDiscovery] = useState(false);
    const [url, setUrl] = useState('');

    const [selectedTrigger, setSelectedTrigger] = useState('Postal code');
    const [selectedCurrency, setSelectedCurrency] = useState('INR');
    const [phoneRequired, setPhoneRequired] = useState(false);
    const [triggerValue, setTriggerValue] = useState("");
    const [carrierCharge, setCarrierCharge] = useState("");
    const [serviceName, setServiceName] = useState("");

    const nav = useNavigation();
    const data = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();



    const isLoading =
        ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

    const productId = actionData?.carrier?.admin_graphql_api_id?.replace(
        "gid://shopify/Product/",
        "",
    );

    const isDeleted = actionData?.carrier === "deleted";
    const isCarrierAvailable = data?.carrier.length > 0
    const isRulesAvailabel = data?.rules.length > 0

    useEffect(() => {
        if (productId) {
            shopify.toast.show("Carrier service created");
        }
        if (isDeleted) {
            shopify.toast.show("Carrier service removed");
        }
    }, [productId, isDeleted]);



    const handleCheckBoxChange = useCallback((newChecked) => setDiscovery(newChecked), []);

    const handleCheckBoxChangePhone = useCallback((newChecked) => setPhoneRequired(newChecked), []);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        // const formData = new FormData(e.target);
        const payload = {
            name: name,
            callback_url: url,
            service_discovery: discovery
        }
        submit({ ...payload, action: 'create' }, { method: "POST" });

        setName('');
        setUrl('');
        setDiscovery(false);
    };

    const handleRuleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: serviceName,
            trigger: selectedTrigger,
            currency: selectedCurrency,
            trigger_value: triggerValue,
            carrier_charge: carrierCharge,
            require_phone_number: phoneRequired
        }

        console.log(payload, "form data");
        submit({ ...payload, action: 'create-rule' }, { method: "POST" });

        setSelectedTrigger("")
        setSelectedCurrency("")
        setPhoneRequired(false)
        setTriggerValue("")
        setCarrierCharge("")
    };

    const handleRemove = (id) => {
        submit({ id: id, action: 'remove' }, { method: "POST" });
    };
    const handleRemoveRule = (id) => {
        submit({ id: id, action: 'remove-rule' }, { method: "POST" });
    };

    const handleSelectChange = useCallback(
        (value) => {
            setSelectedTrigger(value)
            console.log(value, "trigger value")
        },
        [],
    );
    const handleCurrencyChange = useCallback(
        (value) => {
            setSelectedCurrency(value)
            console.log(value, "currency value")
        },
        [],
    );

    return (
        <Page>
            <ui-title-bar title="Custom carrier services" />
            <Layout>
                <Layout.Section  >
                    <BlockStack gap={200} align="space-between">
                        <BlockStack gap={200} align="space-between">
                            <Text fontWeight="medium">Available carrier services</Text>

                            {isCarrierAvailable ? (
                                data.carrier.map((carrier) => (
                                    <Card key={carrier.id}>
                                        <BlockStack gap={200}>
                                            <InlineStack align="space-between">
                                                <Text fontWeight="bold"> {carrier.name}</Text>
                                                <Button variant="primary" tone="critical" loading={isLoading} onClick={() => handleRemove(carrier.id)}>delete</Button>
                                            </InlineStack>
                                            <Text>Id: {carrier.id}</Text>
                                            <Text>Public URL: {carrier.callback_url}</Text>
                                            <Text>Service discovery: {carrier.service_discovery ? "true" : "false"}</Text>
                                        </BlockStack>
                                    </Card>
                                ))
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
                                    data.rules.map((rule, index) => (
                                        <Card key={index}>
                                            <BlockStack gap={200}>
                                                <InlineStack align="space-between">
                                                    <Text fontWeight="bold"> {rule?.name ?? "untitled"}</Text>
                                                    <Button variant="primary" tone="critical" loading={isLoading} onClick={() => handleRemoveRule(rule.id)}>delete</Button>
                                                </InlineStack>
                                                <Text>status: {rule.active ? 'active' : 'inactive'}</Text>
                                                <Text>trigger: {rule.trigger}</Text>
                                                <Text>currency: {rule.currency}</Text>
                                                <Text>trigger_value: {rule.trigger_value}</Text>
                                                <Text>carrier_charge: {rule.carrier_charge}</Text>
                                                <Text>Phone required: {rule.require_phone_number ? "true" : "false"}</Text>
                                            </BlockStack>
                                        </Card>
                                    ))
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
                                    <Form onSubmit={handleAddSubmit}>
                                        <BlockStack gap={200} align="space-evenly">
                                            <TextField
                                                value={name}
                                                onChange={setName}
                                                label="Name"
                                                name="name"
                                                type="text"
                                                helpText={
                                                    <span>
                                                        Provide a name for the carrier service.
                                                    </span>
                                                }
                                            />
                                            <TextField
                                                value={url}
                                                onChange={setUrl}
                                                label="Callback URL"
                                                name="callback_url"
                                                type="text"
                                                helpText={
                                                    <span>
                                                        Provide the public URL for the carrier service.
                                                    </span>
                                                }
                                            />
                                            <Checkbox
                                                checked={discovery}
                                                value={discovery}
                                                onChange={handleCheckBoxChange}
                                                label="Service Discovery"
                                                name="service_discovery"
                                                helpText={
                                                    <span>
                                                        Make the carrier service available to all merchants.
                                                    </span>
                                                }
                                            />
                                            <Button variant="primary" loading={isLoading} submit>Create</Button>
                                        </BlockStack>
                                    </Form>
                                </Card>
                            </BlockStack>
                        </Layout.Section> :
                        <Layout.Section variant="oneThird">
                            <BlockStack gap={200} align="space-between">
                                <Text fontWeight="medium">Create Shiping rate rules</Text>
                                <Card >
                                    <Form onSubmit={handleRuleSubmit}>
                                        <BlockStack gap={200} align="space-evenly">
                                            <TextField
                                                value={serviceName}
                                                onChange={setServiceName}
                                                label="Service Name"
                                                placeholder="Standard Shipping"
                                                name="standard_shipping"
                                                type="text"
                                                helpText={
                                                    <span>
                                                        Provide the service name to be displayed.
                                                    </span>
                                                }
                                            />
                                            <Select
                                                name="trigger"
                                                label="Select trigger"
                                                options={[
                                                    { label: 'Postal code', value: 'postal code' },
                                                    { label: 'Weight', value: 'weight' },
                                                    { label: 'Price', value: 'price' },
                                                    { label: 'Quantity', value: 'quantity' },
                                                    { label: 'Custom', value: 'custom' },
                                                ]}
                                                onChange={handleSelectChange}
                                                value={selectedTrigger}
                                            />
                                            <Select
                                                name="currency"
                                                label="Select Currency"
                                                options={
                                                    [
                                                        { label: 'INR', value: 'INR' },
                                                        { label: 'USD', value: 'USD' }
                                                    ]
                                                }
                                                onChange={handleCurrencyChange}
                                                value={selectedCurrency}
                                            />
                                            <TextField
                                                value={triggerValue}
                                                onChange={setTriggerValue}
                                                label="Trigger value"
                                                placeholder="0"
                                                name="trigger_value"
                                                type="text"
                                                helpText={
                                                    <span>
                                                        Provide the trigger value for custom rates.
                                                    </span>
                                                }
                                            />
                                            <TextField
                                                value={carrierCharge}
                                                onChange={setCarrierCharge}
                                                label="Carrier Charge"
                                                placeholder="0"
                                                name="carrier_charge"
                                                type="text"
                                                helpText={
                                                    <span>
                                                        Provide the trigger value for custom rates.
                                                    </span>
                                                }
                                            />
                                            <Checkbox
                                                checked={phoneRequired}
                                                value={phoneRequired}
                                                onChange={handleCheckBoxChangePhone}
                                                label="Require phone number"
                                                name="require_phone_number"
                                            />
                                            <Button variant="primary" loading={isLoading} submit>Create</Button>
                                        </BlockStack>
                                    </Form>
                                </Card>
                            </BlockStack>
                        </Layout.Section>
                }
            </Layout>
        </Page>
    );
}

