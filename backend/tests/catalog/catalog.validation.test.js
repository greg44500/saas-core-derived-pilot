import {
    describe,
    expect,
    it,
} from 'vitest';

import {
    catalogWorkspaceParamsSchema,
    createCatalogItemSchema,
} from '../../modules/catalog/catalog.validation.js';


describe('catalog validation', () => {
    it('normalise les données autorisées à la création', () => {
        const result = createCatalogItemSchema.parse({
            name: '  Référence pilote  ',
            description: '  Élément de démonstration  ',
        });

        expect(result).toEqual({
            name: 'Référence pilote',
            description: 'Élément de démonstration',
        });
    });

    it('refuse les champs inconnus et les identifiants workspace invalides', () => {
        expect(
            createCatalogItemSchema.safeParse({
                name: 'Référence pilote',
                workspace: '507f1f77bcf86cd799439011',
            }).success,
        ).toBe(false);

        expect(
            catalogWorkspaceParamsSchema.safeParse({
                workspaceId: 'invalid',
            }).success,
        ).toBe(false);
    });
});
