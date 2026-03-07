import { config } from '../config.js';

/**
 * Custom GHL Bridge to handle actions not currently supported by the MCP bridge.
 * Uses GHL API V2 (Direct).
 */

async function callGhlV2(path: string, method: string = 'GET', body?: any) {
    if (!config.ghlToken) throw new Error("GHL_TOKEN is missing.");

    const url = `https://services.leadconnectorhq.com${path}`;
    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${config.ghlToken}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL API Error (${response.status}): ${errorText}`);
    }

    return response.json();
}

export const ghlCreateAppointmentTool = {
    name: "ghl_create_appointment",
    description: "Book a contact into a calendar for a specific time.",
    parameters: {
        type: "object",
        properties: {
            calendarId: { type: "string", description: "The ID of the calendar to book into" },
            contactId: { type: "string", description: "The ID of the contact" },
            startTime: { type: "string", description: "ISO 8601 timestamp for the start of the appointment" },
            title: { type: "string", description: "Title of the appointment (optional)" }
        },
        required: ["calendarId", "contactId", "startTime"]
    }
};

export const ghlTriggerWorkflowTool = {
    name: "ghl_trigger_workflow",
    description: "Manually add a contact to a specific workflow/automation.",
    parameters: {
        type: "object",
        properties: {
            workflowId: { type: "string", description: "The ID of the workflow to trigger" },
            contactId: { type: "string", description: "The ID of the contact" }
        },
        required: ["workflowId", "contactId"]
    }
};

export const ghlFormsCreateFormTool = {
    name: "ghl_forms_create_form",
    description: "Create a new form for a location.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" },
            name: { type: "string", description: "The name of the form" },
            formType: { type: "string", description: "The type of form (e.g., 'form')" }
        },
        required: ["locationId", "name", "formType"]
    }
};

export const ghlFormsListFormsTool = {
    name: "ghl_forms_list_forms",
    description: "List all forms for a location.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" }
        },
        required: ["locationId"]
    }
};

export const ghlFormsGetFormTool = {
    name: "ghl_forms_get_form",
    description: "Get specific form details.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" },
            formId: { type: "string", description: "The ID of the form" }
        },
        required: ["locationId", "formId"]
    }
};

export const ghlProductsCreateProductTool = {
    name: "ghl_products_create_product",
    description: "Create a new product for a location.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" },
            name: { type: "string", description: "The name of the product" },
            description: { type: "string", description: "The description of the product" }
        },
        required: ["locationId", "name", "description"]
    }
};

export const ghlProductsCreatePriceTool = {
    name: "ghl_products_create_price",
    description: "Create a price for a product.",
    parameters: {
        type: "object",
        properties: {
            productId: { type: "string", description: "The ID of the product" },
            type: { type: "string", enum: ["recurring", "one_time"], description: "The type of price" },
            amount: { type: "number", description: "The amount of the price" },
            currency: { type: "string", description: "The currency (default 'USD')" }
        },
        required: ["productId", "type", "amount"]
    }
};

export const ghlProductsListProductsTool = {
    name: "ghl_products_list_products",
    description: "List all products for a location.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" }
        },
        required: ["locationId"]
    }
};

export const ghlMediaUploadTool = {
    name: "ghl_media_upload",
    description: "Upload media to GHL.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" },
            fileUrl: { type: "string", description: "The URL of the file to upload" }
        },
        required: ["locationId", "fileUrl"]
    }
};

export const ghlFunnelsListFunnelsTool = {
    name: "ghl_funnels_list_funnels",
    description: "List all funnels for a location.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" }
        },
        required: ["locationId"]
    }
};

export const ghlFunnelsGetPagesTool = {
    name: "ghl_funnels_get_pages",
    description: "Get pages for a specific funnel.",
    parameters: {
        type: "object",
        properties: {
            locationId: { type: "string", description: "The ID of the location" },
            funnelId: { type: "string", description: "The ID of the funnel" }
        },
        required: ["locationId", "funnelId"]
    }
};

export async function handleGhlCustomTools(toolName: string, args: any) {
    switch (toolName) {
        case "ghl_create_appointment":
            return await createAppointment(args);
        case "ghl_trigger_workflow":
            return await triggerWorkflow(args);
        case "ghl_forms_create_form":
            return await createForm(args);
        case "ghl_forms_list_forms":
            return await listForms(args);
        case "ghl_forms_get_form":
            return await getForm(args);
        case "ghl_products_create_product":
            return await createProduct(args);
        case "ghl_products_create_price":
            return await createPrice(args);
        case "ghl_products_list_products":
            return await listProducts(args);
        case "ghl_media_upload":
            return await uploadMedia(args);
        case "ghl_funnels_list_funnels":
            return await listFunnels(args);
        case "ghl_funnels_get_pages":
            return await getFunnelPages(args);
        default:
            throw new Error(`Unknown GHL Custom tool: ${toolName}`);
    }
}

async function createAppointment(args: { calendarId: string, contactId: string, startTime: string, title?: string }) {
    console.log(`📅 Creating GHL appointment for ${args.contactId} in calendar ${args.calendarId}...`);
    const path = '/calendars/events';
    const body = {
        calendarId: args.calendarId,
        contactId: args.contactId,
        startTime: args.startTime,
        title: args.title || "Consultation with Michelle",
        status: "confirmed"
    };
    const result = await callGhlV2(path, 'POST', body);
    return `Successfully booked appointment. ID: ${result.id}`;
}

async function triggerWorkflow(args: { workflowId: string, contactId: string }) {
    console.log(`⚡ Triggering GHL workflow ${args.workflowId} for contact ${args.contactId}...`);
    const path = `/workflows/${args.workflowId}/connections`;
    const body = { contactId: args.contactId };
    await callGhlV2(path, 'POST', body);
    return `Successfully added contact to workflow.`;
}

async function createForm(args: { locationId: string, name: string, formType: string }) {
    console.log(`📝 Creating GHL form for location ${args.locationId}...`);
    const path = '/forms/';
    const body = { locationId: args.locationId, name: args.name, formType: args.formType };
    const result = await callGhlV2(path, 'POST', body);
    return `Successfully created form: ${result.name} (ID: ${result.id})`;
}

async function listForms(args: { locationId: string }) {
    console.log(`📋 Listing GHL forms for location ${args.locationId}...`);
    const path = `/forms/?locationId=${args.locationId}`;
    const result = await callGhlV2(path);
    return JSON.stringify(result.forms);
}

async function getForm(args: { locationId: string, formId: string }) {
    console.log(`📋 Getting GHL form ${args.formId} for location ${args.locationId}...`);
    const path = `/forms/${args.formId}?locationId=${args.locationId}`;
    const result = await callGhlV2(path);
    return JSON.stringify(result.form);
}

async function createProduct(args: { locationId: string, name: string, description: string }) {
    console.log(`📦 Creating GHL product for location ${args.locationId}...`);
    const path = '/products/';
    const body = { locationId: args.locationId, name: args.name, description: args.description };
    const result = await callGhlV2(path, 'POST', body);
    return `Successfully created product: ${result.name} (ID: ${result.id})`;
}

async function createPrice(args: { productId: string, type: string, amount: number, currency?: string }) {
    console.log(`💰 Creating GHL price for product ${args.productId}...`);
    const path = `/products/${args.productId}/prices`;
    const body = { type: args.type, amount: args.amount, currency: args.currency || 'USD' };
    const result = await callGhlV2(path, 'POST', body);
    return `Successfully created price: ${result.amount} ${result.currency} (ID: ${result.id})`;
}

async function listProducts(args: { locationId: string }) {
    console.log(`📦 Listing GHL products for location ${args.locationId}...`);
    const path = `/products/?locationId=${args.locationId}`;
    const result = await callGhlV2(path);
    return JSON.stringify(result.products);
}

async function uploadMedia(args: { locationId: string, fileUrl: string }) {
    console.log(`🖼️ Uploading media to GHL location ${args.locationId}...`);
    // Note: GHL V2 media upload often requires multipart. 
    // This implementation assumes the API can handle a body with fileUrl or similar.
    // If not, we might need a more complex multipart implementation.
    const path = '/medias/';
    const body = { locationId: args.locationId, fileUrl: args.fileUrl };
    const result = await callGhlV2(path, 'POST', body);
    return `Successfully uploaded media. ID: ${result.id}`;
}

async function listFunnels(args: { locationId: string }) {
    console.log(`🌪️ Listing GHL funnels for location ${args.locationId}...`);
    const path = `/funnels/list?locationId=${args.locationId}`;
    const result = await callGhlV2(path);
    return JSON.stringify(result.funnels);
}

async function getFunnelPages(args: { locationId: string, funnelId: string }) {
    console.log(`🌪️ Getting GHL funnel pages for funnel ${args.funnelId}...`);
    const path = `/funnels/${args.funnelId}/pages?locationId=${args.locationId}`;
    const result = await callGhlV2(path);
    return JSON.stringify(result.pages);
}
