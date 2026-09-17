import { CatalogItem } from './catalog.model.js';


const toCatalogItemDto = (item) => ({
    id: item._id.toString(),
    name: item.name,
    description: item.description ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});

const listCatalogItems = async ({ workspaceId }) => {
    if (!workspaceId) {
        throw new TypeError(
            'workspaceId is required to list catalog items',
        );
    }

    const items = await CatalogItem.find({
        workspace: workspaceId,
    })
        .select('_id name description createdAt updatedAt')
        .sort({
            createdAt: -1,
            _id: -1,
        })
        .lean();

    return items.map(toCatalogItemDto);
};

const createCatalogItem = async ({
    workspaceId,
    actorId,
    name,
    description = null,
}) => {
    if (!workspaceId || !actorId) {
        throw new TypeError(
            'workspaceId and actorId are required to create a catalog item',
        );
    }

    const item = new CatalogItem({
        workspace: workspaceId,
        name,
        description,
        createdBy: actorId,
        updatedBy: actorId,
    });

    await item.save();

    return toCatalogItemDto(item);
};


export {
    createCatalogItem,
    listCatalogItems,
};
