const catalogFrontendRouteModule = Object.freeze({
  workspaceRoutes: Object.freeze([
    Object.freeze({
      path: 'catalog',
      lazy: async () => {
        const { CatalogRoute } = await import(
          '@/features/catalog/components/catalog-route'
        );
        return { Component: CatalogRoute };
      },
    }),
  ]),
});

export { catalogFrontendRouteModule };
