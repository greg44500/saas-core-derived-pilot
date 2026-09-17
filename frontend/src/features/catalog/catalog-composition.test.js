import { describe, expect, it } from 'vitest';

import {
  APPLICATION_FRONTEND_ROUTES,
} from '@/app/application-routes';
import {
  applicationDashboardWidgets,
  getAccessibleDashboardWidgets,
} from '@/app/application-dashboard';
import { workspaceNavigation } from '@/app/workspace-navigation';
import { filterWorkspaceNavigation } from '@/features/workspace/components/workspace-sidebar';
import { CATALOG_FEATURE, CATALOG_PERMISSION } from '@/features/catalog/constants/catalog';

function hasCatalogNavigation(navigation) {
  return navigation.some((entry) => (
    entry.id === 'catalog'
    && entry.items?.some((item) => item.id === 'catalog-items')
  ));
}

describe('catalog frontend composition', () => {
  it('injecte la route workspace sans modifier le routeur Core', () => {
    expect(APPLICATION_FRONTEND_ROUTES.workspaceRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'catalog' }),
      ]),
    );
  });

  it('filtre la navigation Catalogue par feature et permission', () => {
    expect(hasCatalogNavigation(filterWorkspaceNavigation(
      workspaceNavigation,
      {
        can: () => true,
        hasFeature: () => false,
      },
    ))).toBe(false);

    expect(hasCatalogNavigation(filterWorkspaceNavigation(
      workspaceNavigation,
      {
        can: () => false,
        hasFeature: () => true,
      },
    ))).toBe(false);

    expect(hasCatalogNavigation(filterWorkspaceNavigation(
      workspaceNavigation,
      {
        can: (permission) => permission === CATALOG_PERMISSION.ITEM_READ,
        hasFeature: (feature) => feature === CATALOG_FEATURE,
      },
    ))).toBe(true);
  });

  it('filtre le widget Catalogue avec les mêmes garanties d’accès', () => {
    const catalogWidget = applicationDashboardWidgets.find(
      (widget) => widget.id === 'catalog.items',
    );

    expect(catalogWidget).toBeDefined();

    expect(getAccessibleDashboardWidgets([catalogWidget], {
      can: () => true,
      hasFeature: () => false,
    })).toEqual([]);

    expect(getAccessibleDashboardWidgets([catalogWidget], {
      can: () => false,
      hasFeature: () => true,
    })).toEqual([]);

    expect(getAccessibleDashboardWidgets([catalogWidget], {
      can: (permission) => permission === CATALOG_PERMISSION.ITEM_READ,
      hasFeature: (feature) => feature === CATALOG_FEATURE,
    })).toEqual([catalogWidget]);
  });
});
