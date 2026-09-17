# D-017 — Module pilote `catalog` et migration RBAC

**Statut :** lot de dérivation pilote  
**Date :** 2026-09-17  
**Base Core :** `v1.0.0-rc.1` / `432fcfd88cd185234e6317a27df0d3d458f93f28`

## Objet

Le SaaS dérivé ajoute un premier module métier `catalog` sans modifier les listes fermées du Core.

Le module déclare :

- la capability `catalog` ;
- les permissions `catalog:item:read` et `catalog:item:create` ;
- un router Workspace dédié ;
- ses fiches du centre d'aide ;
- sa persistance MongoDB strictement rattachée au `workspace`.

## Migration des rôles système existants

Les nouveaux workspaces utilisent directement le registre RBAC applicatif lors de la création de leurs rôles système. Les workspaces déjà présents avant l'installation du module possèdent toutefois des rôles persistés qui ne connaissent pas encore les permissions `catalog`.

La migration suivante doit donc être exécutée pour une base déjà initialisée :

```bash
npm run migration:catalog-system-role-permissions
```

### Phase

`pre-deploy` : exécuter la migration avant d'ouvrir le module `catalog` au trafic d'une base contenant déjà des rôles système.

### Préconditions

- sauvegarde opérationnelle habituelle de la base ;
- application dérivée contenant la composition RBAC `catalog` ;
- connexion MongoDB valide.

### Idempotence

Le helper Core utilise `$addToSet` avec `$each`. Le rejeu n'ajoute donc pas plusieurs fois une même permission.

### Compatibilité

L'ajout de chaînes de permissions métier dans les rôles système est compatible avec la version Core précédente : un runtime ne connaissant pas le module `catalog` n'utilise pas ces permissions.

### Contrôle post-exécution

Vérifier que les rôles système persistés contiennent :

- `owner`, `admin`, `manager` : lecture + création ;
- `member`, `reader` : lecture.

Les rôles personnalisés ne sont pas modifiés automatiquement.

### Rollback / compensation

Un retour au Core précédent peut conserver ces permissions sans effet fonctionnel. Si une suppression stricte est requise, appliquer explicitement un `$pull` des permissions `catalog:item:read` et `catalog:item:create` sur les seuls rôles système concernés après sauvegarde et validation de l'impact.

## Entitlement

L'enregistrement de la capability `catalog` ne l'accorde à aucun plan par défaut. Un plan ou un override doit inclure explicitement `catalog` pour rendre la fonctionnalité effective. Le backend reste l'autorité d'accès via `enforcePlanFeature('catalog')`.
