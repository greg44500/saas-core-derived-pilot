import { CATALOG_PERMISSION, CATALOG_PLAN_FEATURE } from './catalog.constants.js';


const catalogHelpModule = Object.freeze({
    key: 'catalog',
    categories: Object.freeze([
        Object.freeze({
            id: 'workspace_catalog',
            context: 'workspace',
            label: 'Catalogue',
            description:
                'Consulter et enrichir le catalogue métier du workspace.',
            order: 50,
        }),
    ]),
    entries: Object.freeze([
        Object.freeze({
            id: 'workspace.catalog.read',
            context: 'workspace',
            categoryId: 'workspace_catalog',
            title: 'Consulter le catalogue',
            summary:
                'Afficher les éléments du catalogue appartenant au workspace courant.',
            search: Object.freeze({
                keywords: Object.freeze([
                    'catalogue',
                    'éléments',
                    'liste',
                ]),
                questions: Object.freeze([
                    'Comment consulter le catalogue ?',
                    'Où voir les éléments du workspace ?',
                ]),
            }),
            audience: Object.freeze({
                permissions: Object.freeze([
                    CATALOG_PERMISSION.ITEM_READ,
                ]),
                ownerOnly: false,
            }),
            requirements: Object.freeze({
                features: Object.freeze([
                    CATALOG_PLAN_FEATURE,
                ]),
            }),
            whoCanPerform:
                'Tout membre disposant de la permission de lecture du catalogue.',
            prerequisites: Object.freeze([
                'La fonctionnalité Catalogue doit être incluse dans les droits effectifs du workspace.',
            ]),
            steps: Object.freeze([
                'Ouvrez la rubrique Catalogue dans la navigation du workspace.',
                'Consultez les éléments disponibles dans la liste.',
            ]),
            outcome:
                'Seuls les éléments rattachés au workspace courant sont affichés.',
            edgeCases: Object.freeze([
                'Un workspace sans élément affiche un état vide sans exposer les données d’un autre workspace.',
            ]),
            sensitiveConsequences: Object.freeze([]),
            relatedEntryIds: Object.freeze([
                'workspace.catalog.create',
            ]),
            order: 900,
        }),
        Object.freeze({
            id: 'workspace.catalog.create',
            context: 'workspace',
            categoryId: 'workspace_catalog',
            title: 'Ajouter un élément au catalogue',
            summary:
                'Créer un nouvel élément dans le catalogue du workspace courant.',
            search: Object.freeze({
                keywords: Object.freeze([
                    'catalogue',
                    'ajouter',
                    'créer',
                ]),
                questions: Object.freeze([
                    'Comment ajouter un élément au catalogue ?',
                    'Qui peut créer un élément ?',
                ]),
            }),
            audience: Object.freeze({
                permissions: Object.freeze([
                    CATALOG_PERMISSION.ITEM_CREATE,
                ]),
                ownerOnly: false,
            }),
            requirements: Object.freeze({
                features: Object.freeze([
                    CATALOG_PLAN_FEATURE,
                ]),
            }),
            whoCanPerform:
                'Un membre disposant de la permission de création du catalogue.',
            prerequisites: Object.freeze([
                'Le workspace doit être accessible en écriture.',
                'La fonctionnalité Catalogue doit être incluse dans les droits effectifs du workspace.',
            ]),
            steps: Object.freeze([
                'Ouvrez la rubrique Catalogue.',
                'Renseignez le nom et, si nécessaire, une description.',
                'Validez la création.',
            ]),
            outcome:
                'Le nouvel élément est créé dans le workspace courant et apparaît dans sa liste.',
            edgeCases: Object.freeze([
                'Un compte ou workspace en mode de remédiation ne peut pas créer de nouvel élément métier.',
            ]),
            sensitiveConsequences: Object.freeze([]),
            relatedEntryIds: Object.freeze([
                'workspace.catalog.read',
            ]),
            order: 910,
        }),
    ]),
    workspaceRemediationEntryIds: Object.freeze([]),
});


export { catalogHelpModule };
