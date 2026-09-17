import { BookOpen } from 'lucide-react';

import { CATALOG_FEATURE, CATALOG_PERMISSION } from '@/features/catalog/constants/catalog';

const catalogWorkspaceNavigation = Object.freeze({
  groups: Object.freeze([
    Object.freeze({
      id: 'catalog',
      type: 'group',
      label: 'Catalogue',
      Icon: BookOpen,
      items: Object.freeze([
        Object.freeze({
          id: 'catalog-items',
          label: 'Éléments',
          Icon: BookOpen,
          permission: CATALOG_PERMISSION.ITEM_READ,
          feature: CATALOG_FEATURE,
          path: 'catalog',
        }),
      ]),
    }),
  ]),
});

export { catalogWorkspaceNavigation };
