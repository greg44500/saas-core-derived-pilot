import mongoose from 'mongoose';


const { Schema, model } = mongoose;


const catalogItemSchema = new Schema(
    {
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
            immutable: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 120,
        },
        description: {
            type: String,
            default: null,
            trim: true,
            maxlength: 500,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            immutable: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

catalogItemSchema.index({
    workspace: 1,
    createdAt: -1,
});


const CatalogItem = model('CatalogItem', catalogItemSchema);


export { CatalogItem };
