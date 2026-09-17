import { describe, expect, it } from 'vitest';

import {
  catalogApi,
  createCatalogItemRequestBody,
} from '@/features/catalog/api/catalog-api';


describe('catalogApi', () => {
  it('déclare les endpoints RTK Query du module dérivé', () => {
    expect(catalogApi.endpoints.listCatalogItems).toBeDefined();
    expect(catalogApi.endpoints.createCatalogItem).toBeDefined();
  });

  it('normalise le body de création sans ajouter de champ tenant côté client', () => {
    expect(createCatalogItemRequestBody({
      name: '  Référence pilote  ',
      description: '  Démonstration  ',
    })).toEqual({
      name: 'Référence pilote',
      description: 'Démonstration',
    });

    expect(createCatalogItemRequestBody({
      name: 'Référence pilote',
      description: '   ',
    })).toEqual({
      name: 'Référence pilote',
    });
  });
});
