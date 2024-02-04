import { Form, useActionData, useNavigation, useSubmit } from '@remix-run/react';
import { BlockStack, Button, Checkbox, Select, TextField } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';


const RulesForm = () => {


    const [selectedTrigger, setSelectedTrigger] = useState('Postal code');
    const [selectedCurrency, setSelectedCurrency] = useState('INR');
    const [phoneRequired, setPhoneRequired] = useState(false);
    const [triggerValue, setTriggerValue] = useState("");
    const [carrierCharge, setCarrierCharge] = useState("");
    const [serviceName, setServiceName] = useState("");

    const nav = useNavigation();
    const submit = useSubmit();
    const actionData = useActionData();


    const isLoading =
        ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

    const productId = actionData?.carrier?.admin_graphql_api_id?.replace(
        "gid://shopify/Product/",
        "",
    );
    const isDeleted = actionData?.carrier === "deleted";



    useEffect(() => {
        if (productId) {
            shopify.toast.show("Carrier service created");
        }
        if (isDeleted) {
            shopify.toast.show("Carrier service removed");
        }
    }, [productId, isDeleted]);




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

        setPhoneRequired(false)
        setTriggerValue("")
        setCarrierCharge("")
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

    const handleCheckBoxChangePhone = useCallback((newChecked) => setPhoneRequired(newChecked), []);



    return (
        <Form onSubmit={handleRuleSubmit} action='create-rule'>
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
    )
}

export default RulesForm