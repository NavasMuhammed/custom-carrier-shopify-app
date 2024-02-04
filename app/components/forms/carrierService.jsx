import { Form, useActionData, useNavigation, useSubmit } from '@remix-run/react';
import { BlockStack, Button, Checkbox, TextField } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';




const CarrierServiceForm = () => {

    const [name, setName] = useState('');
    const [discovery, setDiscovery] = useState(false);
    const [url, setUrl] = useState('');

    const nav = useNavigation();
    const submit = useSubmit();
    const actionData = useActionData();

    const handleCheckBoxChange = useCallback((newChecked) => setDiscovery(newChecked), []);
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
    return (
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
    )
}

export default CarrierServiceForm