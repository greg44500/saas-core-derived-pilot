import { CATALOG_PLAN_FEATURE } from './catalog.constants.js';


const catalogPlanCapabilities = Object.freeze({
    features: Object.freeze([
        CATALOG_PLAN_FEATURE,
    ]),
    featureDefinitions: Object.freeze({
        [CATALOG_PLAN_FEATURE]: Object.freeze({
            label: 'Catalogue',
            description:
                'Permet de consulter et gérer les éléments du catalogue métier.',
            category: 'catalog',
            categoryLabel: 'Catalogue',
            displayOrder: 100,
            tags: Object.freeze([
                'derived-pilot',
            ]),
        }),
    }),
});


export { catalogPlanCapabilities };
