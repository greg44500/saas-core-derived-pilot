import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    ACTIVE_APPLICATION_ROLE_PERMISSION_REGISTRY,
} from '../../config/applicationRolePermission.registry.js';
import { SYSTEM_ROLE_KEY } from '../../constants/role.constants.js';
import {
    backfillRegisteredSystemRolePermissions,
} from '../../migrations/backfillRegisteredSystemRolePermissions.migration.js';
import {
    CATALOG_PERMISSION,
} from '../../modules/catalog/catalog.constants.js';
import { Role } from '../../modules/role/role.model.js';


afterEach(() => {
    vi.restoreAllMocks();
});


describe('catalog system role permissions migration', () => {
    it('backfill les rôles système persistés avec les permissions du module', async () => {
        const updateMany = vi
            .spyOn(Role.collection, 'updateMany')
            .mockResolvedValue({
                matchedCount: 1,
                modifiedCount: 1,
            });

        const result = await backfillRegisteredSystemRolePermissions({
            permissionRegistry:
                ACTIVE_APPLICATION_ROLE_PERMISSION_REGISTRY,
        });

        expect(result).toEqual({
            matchedRoles: 5,
            updatedRoles: 5,
        });

        expect(updateMany).toHaveBeenCalledWith(
            {
                isSystem: true,
                key: SYSTEM_ROLE_KEY.OWNER,
            },
            {
                $addToSet: {
                    permissions: {
                        $each: [
                            CATALOG_PERMISSION.ITEM_READ,
                            CATALOG_PERMISSION.ITEM_CREATE,
                        ],
                    },
                },
            },
        );

        expect(updateMany).toHaveBeenCalledWith(
            {
                isSystem: true,
                key: SYSTEM_ROLE_KEY.READER,
            },
            {
                $addToSet: {
                    permissions: {
                        $each: [
                            CATALOG_PERMISSION.ITEM_READ,
                        ],
                    },
                },
            },
        );
    });
});
