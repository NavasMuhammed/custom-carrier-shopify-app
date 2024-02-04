import { useActionData, useLoaderData, useNavigation, useSubmit } from '@remix-run/react';
import { BlockStack, Button, Card, InlineStack, Text } from '@shopify/polaris';
import React, { useEffect } from 'react';

const ShipingRules = () => {

    const data = useLoaderData()
    const actionData = useActionData()
    const nav = useNavigation();
    const submit = useSubmit();


    const isLoading = ["loading", "submitting"].includes(nav.state) && nav.formMethod;

    const isDeleted = actionData?.rules === "deleted";


    const handleRemoveRule = (id) => {
        submit({ id: id, action: 'remove-rule' }, { method: "POST", text: 'carrier-removed' });
    };

    useEffect(() => {
        if (isDeleted) {
            shopify.toast.show("Carrier service removed");
        }
    }, [isDeleted]);

    return (
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
    )
}

export default ShipingRules