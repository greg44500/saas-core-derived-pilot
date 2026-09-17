import {
    createCatalogItem,
    listCatalogItems,
} from './catalog.service.js';


const list = async (req, res) => {
    const items = await listCatalogItems({
        workspaceId: req.workspace._id,
    });

    res.status(200).json({
        status: 'success',
        data: {
            items,
        },
    });
};

const create = async (req, res) => {
    const item = await createCatalogItem({
        workspaceId: req.workspace._id,
        actorId: req.user.id,
        name: req.validated.body.name,
        description:
            req.validated.body.description ?? null,
    });

    res.status(201).json({
        status: 'success',
        data: {
            item,
        },
    });
};


export {
    create,
    list,
};
