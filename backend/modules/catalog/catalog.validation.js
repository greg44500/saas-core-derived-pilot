import { z } from 'zod';


const catalogWorkspaceParamsSchema = z.strictObject({
    workspaceId: z
        .string()
        .regex(
            /^[a-f\d]{24}$/i,
            'workspaceId invalide',
        ),
});

const createCatalogItemSchema = z.strictObject({
    name: z
        .string()
        .trim()
        .min(2)
        .max(120),
    description: z
        .string()
        .trim()
        .max(500)
        .optional(),
});


export {
    catalogWorkspaceParamsSchema,
    createCatalogItemSchema,
};
