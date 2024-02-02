import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {
    Button,
    Card,
    Checkbox,
    Form,
    Layout,
    Page,
    Text,
    TextField
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useCallback, useState } from "react";



export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const response = await admin.rest.resources.CarrierService.all({
        session: session,
    });
    return json({ carrier: response.data });
};

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const bodyText = await request.text();
    const body = new URLSearchParams(bodyText);






    switch (body.get('action')) {
        case 'create': {
            const name = body.get('name');
            const callback_url = body.get('callback_url');
            const service_discovery = body.get('service_discovery') === 'on';
            try {
                const carrier_service = new admin.rest.resources.CarrierService({ session: session });

                carrier_service.name = name;
                carrier_service.callback_url = callback_url;
                carrier_service.service_discovery = service_discovery;
                await carrier_service.save({
                    update: true,
                });
                return json({ carrier: carrier_service });

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

    // when i click addd


    //when i click remove 


}




export default function AdditionalPage() {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [discovery, setDiscovery] = useState(false);



    const handleNewsLetterChange = useCallback(
        (value) => setDiscovery(value),
        [],
    );
    const data = useLoaderData();
    const actionData = useActionData();
    //get loader data from the server
    const submit = useSubmit();
    const handleAddSubmit = (e) => {
        setName('');
        setUrl('');
        setDiscovery(false);
        e.preventDefault();
        const formData = new FormData(e.target);
        submit({ ...Object.fromEntries(formData), action: 'create' }, { method: "POST" });
    };

    const handleRemove = (id) => {

        submit({ id: id, action: 'remove' }, { method: "POST" });
    };
    return (
        <Page>
            <ui-title-bar title="Navas" />
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text>Available carrier services</Text>

                        {data?.carrier.length > 0 ? (
                            data.carrier.map((carrier) => (
                                <Card key={carrier.id}>
                                    <Text fontWeight="bold"> {carrier.name}</Text>
                                    <Text>id: {carrier.id}</Text>
                                    <Text>callback_url: {carrier.callback_url}</Text>
                                    <Text>service_discovery: {carrier.service_discovery ? "true" : "false"}</Text>
                                    <Button onClick={() => handleRemove(carrier.id)}>delete</Button>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <Text>No data available</Text>
                            </Card>
                        )}

                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <Form onSubmit={handleAddSubmit}>
                            {/* <label>
                                Name:
                                <input type="text" name="name" />
                            </label> */}
                            <TextField
                                value={name}
                                onChange={setName}
                                label="Name"
                                name="name"
                                type="text"
                                helpText={
                                    <span>
                                        We’ll use this email address to inform you on future changes to
                                        Polaris.
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
                                        We’ll use this email address to inform you on future changes to
                                        Polaris.
                                    </span>
                                }
                            />
                            <Checkbox
                                checked={discovery}
                                onChange={handleNewsLetterChange}
                                label="Service Discovery"
                                name="service_discovery"
                            />
                            {/* <label>
                                Callback URL:
                                <input type="text" name="callback_url" />
                            </label> */}
                            {/* <label>
                                Service Discovery:
                                <input type="checkbox" name="service_discovery" />
                            </label> */}
                            <Button submit>Submit</Button>
                        </Form>

                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card>
                        <Text>Submit response</Text>
                        <pre style={{ margin: 0 }}>
                            <code>{JSON.stringify(actionData?.carrier, null, 2)}</code>
                        </pre>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

