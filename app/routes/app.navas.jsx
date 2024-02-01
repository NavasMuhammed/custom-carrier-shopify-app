import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {
    Button,
    Card,
    Layout,
    Page,
    Text
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";



export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const response = await admin.rest.resources.CarrierService.all({
        session: session,
    });
    return json({ carrier: response.data });
};

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);

    try {
        const carrier_service = new admin.rest.resources.CarrierService({ session: session });

        carrier_service.name = "navas shiping service";
        carrier_service.callback_url = "https://pix-national-eddie-alice.trycloudflare.com/api";
        carrier_service.service_discovery = true;
        await carrier_service.save({
            update: true,
        });
        return json({ carrier: carrier_service });

    } catch (error) {
        return json({ carrier: error });
    }

    // try {
    //     await admin.rest.resources.CarrierService.delete({
    //         session: session,
    //         id: 86379528481,
    //     });

    //     return json({ carrier: "deleted" });

    // } catch (error) {
    //     return json({ carrier: error });
    // }

}




export default function AdditionalPage() {
    const data = useLoaderData();
    const actionData = useActionData();
    //get loader data from the server
    const submit = useSubmit();
    const handleClick = () => {
        submit({}, { method: "POST" })
    };
    return (
        <Page>
            <ui-title-bar title="Navas" />
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text>Fetch response</Text>
                        <pre style={{ margin: 0 }}>
                            <code>{JSON.stringify(data?.carrier, null, 2)}</code>
                        </pre>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <Text>hi</Text>
                        <Button onClick={handleClick}>Submit</Button>

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

