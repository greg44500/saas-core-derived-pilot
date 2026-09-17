import { DashboardSummaryCard } from '@/features/workspace/components/dashboard-summary-card';
import { useWorkspaceContext } from '@/features/workspace/components/workspace-context';
import { useListCatalogItemsQuery } from '@/features/catalog/api/catalog-api';

function CatalogDashboardWidget() {
  const { workspace } = useWorkspaceContext();
  const {
    data: items = [],
    isLoading,
    isError,
  } = useListCatalogItemsQuery(workspace.id);

  return (
    <DashboardSummaryCard
      description="Nombre d’éléments actuellement enregistrés dans le catalogue de ce workspace."
      href={`/workspaces/${workspace.id}/catalog`}
      isError={isError}
      isLoading={isLoading}
      label="Éléments du catalogue"
      value={items.length}
    />
  );
}

export { CatalogDashboardWidget };
