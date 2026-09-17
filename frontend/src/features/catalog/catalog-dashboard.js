import { CatalogDashboardWidget } from '@/features/catalog/components/catalog-dashboard-widget';
import { CATALOG_FEATURE, CATALOG_PERMISSION } from '@/features/catalog/constants/catalog';

const catalogDashboardModule = Object.freeze({
  widgets: Object.freeze([
    Object.freeze({
      id: 'catalog.items',
      label: 'Éléments du catalogue',
      description: 'Suit le volume d’éléments métier enregistrés dans le workspace courant.',
      component: CatalogDashboardWidget,
      slot: 'summary',
      order: 350,
      configurable: true,
      access: Object.freeze({
        features: Object.freeze([CATALOG_FEATURE]),
        permissions: Object.freeze([CATALOG_PERMISSION.ITEM_READ]),
      }),
    }),
  ]),
});

export { catalogDashboardModule };
