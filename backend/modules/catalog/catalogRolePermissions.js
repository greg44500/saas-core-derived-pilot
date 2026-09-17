import { SYSTEM_ROLE_KEY } from '../../constants/role.constants.js';
import { CATALOG_PERMISSION } from './catalog.constants.js';


const CATALOG_READ_PERMISSIONS = Object.freeze([
    CATALOG_PERMISSION.ITEM_READ,
]);

const CATALOG_WRITE_PERMISSIONS = Object.freeze([
    CATALOG_PERMISSION.ITEM_READ,
    CATALOG_PERMISSION.ITEM_CREATE,
]);

const catalogRolePermissions = Object.freeze({
    permissions: Object.freeze(
        Object.values(CATALOG_PERMISSION),
    ),
    systemRolePermissions: Object.freeze({
        [SYSTEM_ROLE_KEY.OWNER]: CATALOG_WRITE_PERMISSIONS,
        [SYSTEM_ROLE_KEY.ADMIN]: CATALOG_WRITE_PERMISSIONS,
        [SYSTEM_ROLE_KEY.MANAGER]: CATALOG_WRITE_PERMISSIONS,
        [SYSTEM_ROLE_KEY.MEMBER]: CATALOG_READ_PERMISSIONS,
        [SYSTEM_ROLE_KEY.READER]: CATALOG_READ_PERMISSIONS,
    }),
});


export { catalogRolePermissions };
