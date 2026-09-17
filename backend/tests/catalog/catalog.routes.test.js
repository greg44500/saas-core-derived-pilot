import express from 'express';
import request from 'supertest';
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

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
} from '../../modules/catalog/catalog.constants.js';
import {
    create,
    list,
} from '../../modules/catalog/catalog.controller.js';
import { catalogRouter } from '../../modules/catalog/catalog.routes.js';
import {
    catalogWorkspaceParamsSchema,
    createCatalogItemSchema,
} from '../../modules/catalog/catalog.validation.js';


const {
    validationMiddleware,
    workspaceContextMiddleware,
    permissionMiddleware,
    featureMiddleware,
    workspaceAccessMiddleware,
} = vi.hoisted(() => ({
    validationMiddleware: vi.fn((req, res, next) => next()),
    workspaceContextMiddleware: vi.fn((req, res, next) => {
        req.workspace = {
            _id: req.params.workspaceId,
        };
        next();
    }),
    permissionMiddleware: vi.fn((req, res, next) => next()),
    featureMiddleware: vi.fn((req, res, next) => next()),
    workspaceAccessMiddleware: vi.fn((req, res, next) => next()),
}));

vi.mock('../../middlewares/authenticate.js', () => ({
    authenticate: vi.fn((req, res, next) => {
        req.user = {
            id: 'user-id',
        };
        next();
    }),
}));

vi.mock('../../middlewares/validateRequest.js', () => ({
    validateRequest: vi.fn(() => validationMiddleware),
}));

vi.mock('../../middlewares/loadWorkspaceContext.js', () => ({
    loadWorkspaceContext: workspaceContextMiddleware,
}));

vi.mock('../../middlewares/authorizePermission.js', () => ({
    authorizePermission: vi.fn(() => permissionMiddleware),
}));

vi.mock('../../middlewares/enforcePlanFeature.js', () => ({
    enforcePlanFeature: vi.fn(() => featureMiddleware),
}));

vi.mock('../../middlewares/enforceWorkspaceAccessMode.js', () => ({
    enforceWorkspaceAccessMode: vi.fn(() => workspaceAccessMiddleware),
}));

vi.mock('../../modules/catalog/catalog.controller.js', () => ({
    list: vi.fn((req, res) => {
        res.status(200).json({
            status: 'success',
        });
    }),
    create: vi.fn((req, res) => {
        res.status(201).json({
            status: 'success',
        });
    }),
}));

beforeEach(() => {
    authenticate.mockClear();
    validateRequest.mockClear();
    authorizePermission.mockClear();
    enforcePlanFeature.mockClear();
    enforceWorkspaceAccessMode.mockClear();
    validationMiddleware.mockClear();
    workspaceContextMiddleware.mockClear();
    permissionMiddleware.mockClear();
    featureMiddleware.mockClear();
    workspaceAccessMiddleware.mockClear();
    list.mockClear();
    create.mockClear();
});


describe('catalog.routes', () => {
    it('protège la lecture avec tenant, permission et entitlement', async () => {
        const app = express();
        app.use(express.json());
        app.use(
            '/workspaces/:workspaceId/catalog',
            catalogRouter,
        );

        const response = await request(app)
            .get('/workspaces/507f1f77bcf86cd799439011/catalog');

        expect(response.status).toBe(200);
        expect(validateRequest).toHaveBeenCalledWith({
            params: catalogWorkspaceParamsSchema,
        });
        expect(authorizePermission).toHaveBeenCalledWith(
            CATALOG_PERMISSION.ITEM_READ,
        );
        expect(enforcePlanFeature).toHaveBeenCalledWith(
            CATALOG_PLAN_FEATURE,
        );
        expect(workspaceAccessMiddleware).not.toHaveBeenCalled();
        expect(list).toHaveBeenCalledOnce();
    });

    it('protège la création avec permission, entitlement et mode d’accès en écriture', async () => {
        const app = express();
        app.use(express.json());
        app.use(
            '/workspaces/:workspaceId/catalog',
            catalogRouter,
        );

        const response = await request(app)
            .post('/workspaces/507f1f77bcf86cd799439011/catalog')
            .send({
                name: 'Référence pilote',
            });

        expect(response.status).toBe(201);
        expect(validateRequest).toHaveBeenCalledWith({
            params: catalogWorkspaceParamsSchema,
            body: createCatalogItemSchema,
        });
        expect(authorizePermission).toHaveBeenCalledWith(
            CATALOG_PERMISSION.ITEM_CREATE,
        );
        expect(enforcePlanFeature).toHaveBeenCalledWith(
            CATALOG_PLAN_FEATURE,
        );
        expect(enforceWorkspaceAccessMode).toHaveBeenCalledWith();
        expect(
            permissionMiddleware.mock.invocationCallOrder[0],
        ).toBeLessThan(
            featureMiddleware.mock.invocationCallOrder[0],
        );
        expect(
            featureMiddleware.mock.invocationCallOrder[0],
        ).toBeLessThan(
            workspaceAccessMiddleware.mock.invocationCallOrder[0],
        );
        expect(
            workspaceAccessMiddleware.mock.invocationCallOrder[0],
        ).toBeLessThan(
            create.mock.invocationCallOrder[0],
        );
    });
});
