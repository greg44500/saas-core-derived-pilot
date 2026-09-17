import mongoose from 'mongoose';
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import { CatalogItem } from '../../modules/catalog/catalog.model.js';
import {
    createCatalogItem,
    listCatalogItems,
} from '../../modules/catalog/catalog.service.js';


afterEach(() => {
    vi.restoreAllMocks();
});


describe('catalog.service', () => {
    it('filtre toujours la lecture par workspace', async () => {
        const workspaceId = new mongoose.Types.ObjectId();
        const otherWorkspaceId = new mongoose.Types.ObjectId();
        const lean = vi.fn().mockResolvedValue([
            {
                _id: new mongoose.Types.ObjectId(),
                workspace: otherWorkspaceId,
                name: 'Élément visible uniquement via le résultat mocké',
                description: null,
                createdAt: new Date('2026-09-17T10:00:00.000Z'),
                updatedAt: new Date('2026-09-17T10:00:00.000Z'),
            },
        ]);
        const sort = vi.fn(() => ({ lean }));
        const select = vi.fn(() => ({ sort }));
        const find = vi
            .spyOn(CatalogItem, 'find')
            .mockReturnValue({ select });

        await listCatalogItems({ workspaceId });

        expect(find).toHaveBeenCalledWith({
            workspace: workspaceId,
        });
        expect(select).toHaveBeenCalledWith(
            '_id name description createdAt updatedAt',
        );
    });

    it('impose le workspace et l’acteur fournis par le contexte serveur à la création', async () => {
        const workspaceId = new mongoose.Types.ObjectId();
        const actorId = new mongoose.Types.ObjectId();
        const createdAt = new Date('2026-09-17T11:00:00.000Z');

        vi.spyOn(CatalogItem.prototype, 'save')
            .mockImplementation(async function save() {
                this.createdAt = createdAt;
                this.updatedAt = createdAt;
                return this;
            });

        const result = await createCatalogItem({
            workspaceId,
            actorId,
            name: 'Produit dérivé',
            description: 'Preuve D-017',
        });

        expect(result).toMatchObject({
            name: 'Produit dérivé',
            description: 'Preuve D-017',
            createdAt,
            updatedAt: createdAt,
        });
    });
});
