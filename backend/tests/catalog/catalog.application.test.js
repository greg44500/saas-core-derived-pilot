import {
    describe,
    expect,
    it,
} from 'vitest';

import {
    ACTIVE_PLAN_CAPABILITY_REGISTRY,
} from '../../config/applicationCapability.registry.js';
import {
    ACTIVE_HELP_REGISTRY,
} from '../../config/applicationHelp.registry.js';
import {
    ACTIVE_APPLICATION_ROLE_PERMISSION_REGISTRY,
} from '../../config/applicationRolePermission.registry.js';
import {
    APPLICATION_BACKEND_ROUTE_MODULES,
} from '../../config/applicationRoutes.registry.js';
import { SYSTEM_ROLE_KEY } from '../../constants/role.constants.js';
import {
    CATALOG_PERMISSION,
    CATALOG_PLAN_FEATURE,
} from '../../modules/catalog/catalog.constants.js';


describe('catalog application composition', () => {
    it('enregistre la capability et les permissions sans étendre les constantes Core', () => {
        expect(
            ACTIVE_PLAN_CAPABILITY_REGISTRY.features.has(
                CATALOG_PLAN_FEATURE,
            ),
        ).toBe(true);

        expect(
            ACTIVE_APPLICATION_ROLE_PERMISSION_REGISTRY.permissions,
        ).toEqual(
            expect.arrayContaining(
                Object.values(CATALOG_PERMISSION),
            ),
        );

        expect(
            ACTIVE_APPLICATION_ROLE_PERMISSION_REGISTRY
                .systemRolePermissions[SYSTEM_ROLE_KEY.OWNER],
        ).toEqual(
            expect.arrayContaining(
                Object.values(CATALOG_PERMISSION),
            ),
        );
    });

    it('monte le router métier sur le point d’extension applicatif', () => {
        expect(APPLICATION_BACKEND_ROUTE_MODULES).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    key: 'catalog',
                    mountPath:
                        '/api/workspaces/:workspaceId/catalog',
                }),
            ]),
        );
    });

    it('injecte les fiches Catalogue dans le centre d’aide Workspace', () => {
        expect(
            ACTIVE_HELP_REGISTRY.categoriesById.workspace_catalog,
        ).toMatchObject({
            context: 'workspace',
            label: 'Catalogue',
        });

        expect(
            ACTIVE_HELP_REGISTRY.entriesById['workspace.catalog.read'],
        ).toBeDefined();
        expect(
            ACTIVE_HELP_REGISTRY.entriesById['workspace.catalog.create'],
        ).toBeDefined();
    });
});
