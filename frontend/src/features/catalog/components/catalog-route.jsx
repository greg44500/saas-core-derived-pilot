import { WorkspacePermissionGate } from '@/features/workspace/components/workspace-permission-gate';
import { useWorkspaceContext } from '@/features/workspace/components/workspace-context';
import { CatalogPage } from '@/features/catalog/pages/catalog-page';
import { CATALOG_FEATURE, CATALOG_PERMISSION } from '@/features/catalog/constants/catalog';

function CatalogUnavailable() {
  return (
    <section className="space-y-2 rounded-xl border border-border bg-card p-6">
      <h1 className="text-2xl font-semibold">Catalogue indisponible</h1>
      <p className="text-sm text-muted-foreground">
        Cette fonctionnalité n’est pas incluse dans les droits effectifs de ce workspace.
      </p>
    </section>
  );
}

function CatalogAccessDenied() {
  return (
    <section className="space-y-2 rounded-xl border border-border bg-card p-6">
      <h1 className="text-2xl font-semibold">Accès refusé</h1>
      <p className="text-sm text-muted-foreground">
        Votre rôle ne permet pas de consulter le catalogue de ce workspace.
      </p>
    </section>
  );
}

function CatalogRoute() {
  const { hasFeature } = useWorkspaceContext();

  if (!hasFeature(CATALOG_FEATURE)) {
    return <CatalogUnavailable />;
  }

  return (
    <WorkspacePermissionGate
      fallback={<CatalogAccessDenied />}
      permission={CATALOG_PERMISSION.ITEM_READ}
    >
      <CatalogPage />
    </WorkspacePermissionGate>
  );
}

export { CatalogAccessDenied, CatalogRoute, CatalogUnavailable };
