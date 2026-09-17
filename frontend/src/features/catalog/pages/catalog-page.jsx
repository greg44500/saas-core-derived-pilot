import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateCatalogItemMutation,
  useListCatalogItemsQuery,
} from '@/features/catalog/api/catalog-api';
import { CATALOG_PERMISSION } from '@/features/catalog/constants/catalog';
import { useWorkspaceContext } from '@/features/workspace/components/workspace-context';

function CatalogItemCard({ item }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        {item.description && (
          <CardDescription>{item.description}</CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}

function CatalogPage() {
  const { workspace, can } = useWorkspaceContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState(null);
  const {
    data: items = [],
    isLoading,
    isError,
    refetch,
  } = useListCatalogItemsQuery(workspace.id);
  const [createItem, { isLoading: isCreating }] = useCreateCatalogItemMutation();
  const canCreate = can(CATALOG_PERMISSION.ITEM_CREATE);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (name.trim().length < 2) {
      setFormError('Le nom doit contenir au moins 2 caractères.');
      return;
    }

    try {
      await createItem({
        workspaceId: workspace.id,
        name,
        description,
      }).unwrap();
      setName('');
      setDescription('');
      await refetch();
    } catch {
      setFormError('La création de l’élément a échoué.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-medium text-primary">{workspace.name}</p>
        <h1 className="text-3xl font-semibold tracking-tight">Catalogue</h1>
        <p className="text-sm text-muted-foreground">
          Gérez les éléments métier propres à ce workspace.
        </p>
      </header>

      {canCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un élément</CardTitle>
            <CardDescription>
              Les données créées restent rattachées au workspace courant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="catalog-name">
                  Nom
                </label>
                <Input
                  id="catalog-name"
                  maxLength={120}
                  onChange={(event) => setName(event.target.value)}
                  required
                  value={name}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="catalog-description">
                  Description
                </label>
                <Textarea
                  id="catalog-description"
                  maxLength={500}
                  onChange={(event) => setDescription(event.target.value)}
                  value={description}
                />
              </div>
              {formError && (
                <p className="text-sm text-destructive" role="alert">{formError}</p>
              )}
              <Button disabled={isCreating} type="submit">
                {isCreating ? 'Création…' : 'Créer l’élément'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="catalog-list-title" className="space-y-3">
        <h2 className="text-xl font-semibold" id="catalog-list-title">Éléments</h2>
        {isLoading && (
          <div aria-live="polite" className="space-y-3" role="status">
            <span className="sr-only">Chargement du catalogue…</span>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {isError && (
          <p className="text-sm text-destructive" role="alert">
            Le catalogue est momentanément indisponible.
          </p>
        )}
        {!isLoading && !isError && items.length === 0 && (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground">
              Aucun élément n’a encore été créé dans ce workspace.
            </CardContent>
          </Card>
        )}
        {!isLoading && !isError && items.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <CatalogItemCard item={item} key={item.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export { CatalogItemCard, CatalogPage };
