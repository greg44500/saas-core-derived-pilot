import { baseApi } from '@/services/api/base-api';

function createCatalogItemRequestBody({ name, description }) {
  return {
    name: name.trim(),
    ...(description?.trim()
      ? { description: description.trim() }
      : {}),
  };
}

const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCatalogItems: build.query({
      query: (workspaceId) => ({
        url: `/workspaces/${workspaceId}/catalog`,
      }),
      transformResponse: (response) => response?.data?.items ?? [],
    }),
    createCatalogItem: build.mutation({
      query: ({ workspaceId, name, description }) => ({
        url: `/workspaces/${workspaceId}/catalog`,
        method: 'POST',
        body: createCatalogItemRequestBody({
          name,
          description,
        }),
      }),
      transformResponse: (response) => response?.data?.item ?? null,
    }),
  }),
});

export const {
  useCreateCatalogItemMutation,
  useListCatalogItemsQuery,
} = catalogApi;

export { catalogApi, createCatalogItemRequestBody };
