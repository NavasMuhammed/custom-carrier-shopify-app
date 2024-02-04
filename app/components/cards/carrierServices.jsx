import { BlockStack, Button, Card, InlineStack, Text } from '@shopify/polaris';
import React, { useEffect } from 'react';
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";

const CarrierServiceCard = () => {
    const nav = useNavigation();
    const isLoading =
        ["loading", "submitting"].includes(nav.state) && nav.formMethod === "DELETE";

    console.log(nav, "nav here")
    console.log(nav.state, "nav state here")

    const data = useLoaderData();
    const actionData = useActionData();
    const submit = useSubmit();

    const isDeleted = actionData?.carrier === "deleted";


    const handleRemove = (id) => {
        submit({ id: id, action: 'remove' }, { method: "DELETE", text: 'carrier-removed' });
    };


    useEffect(() => {

        if (isDeleted) {
            shopify.toast.show("Carrier service removed");
        }
    }, [isDeleted]);

    return (
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
    )
}

export default CarrierServiceCard