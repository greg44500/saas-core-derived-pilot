import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.js';
import { authorizePermission } from '../../middlewares/authorizePermission.js';
import { enforcePlanFeature } from '../../middlewares/enforcePlanFeature.js';
import {
    enforceWorkspaceAccessMode,
} from '../../middlewares/enforceWorkspaceAccessMode.js';
import { loadWorkspaceContext } from '../../middlewares/loadWorkspaceContext.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
    CATALOG_PERMISSION,
    CATALOG_PLAN_FEATURE,
} from './catalog.constants.js';
import {
    create,
    list,
} from './catalog.controller.js';
import {
    catalogWorkspaceParamsSchema,
    createCatalogItemSchema,
} from './catalog.validation.js';


const router = Router({
    mergeParams: true,
});

router.get(
    '/',
    authenticate,
    validateRequest({
        params: catalogWorkspaceParamsSchema,
    }),
    loadWorkspaceContext,
    authorizePermission(
        CATALOG_PERMISSION.ITEM_READ,
    ),
    enforcePlanFeature(
        CATALOG_PLAN_FEATURE,
    ),
    list,
);

router.post(
    '/',
    authenticate,
    validateRequest({
        params: catalogWorkspaceParamsSchema,
        body: createCatalogItemSchema,
    }),
    loadWorkspaceContext,
    authorizePermission(
        CATALOG_PERMISSION.ITEM_CREATE,
    ),
    enforcePlanFeature(
        CATALOG_PLAN_FEATURE,
    ),
    enforceWorkspaceAccessMode(),
    create,
);


export { router as catalogRouter };
