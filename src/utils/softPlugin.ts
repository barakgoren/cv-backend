import { Schema, Document, Query, HookNextFunction } from 'mongoose';

// Extend Mongoose's Document type to include the soft delete methods
export interface SoftDeleteDocument extends Document {
    active: boolean;
    uid: number;
    softDelete: () => Promise<void>;
    restore: () => Promise<void>;
}

// Define the plugin function
export function softDeletePlugin<T extends SoftDeleteDocument>(schema: Schema<T>) {
    // Add the `active` field to the schema
    schema.add({
        active: { type: Boolean, default: true, select: false }, // `select: false` hides it from queries
        uid: { type: Number, unique: true, index: true }
    });

    // Modify `find`, `findOne`, and `countDocuments` to exclude inactive documents by default
    schema.pre<Query<T, T>>(/^find/, function (next: HookNextFunction) {
        if (!this.getFilter().includeInactive) {
            this.where({ active: true });
        }
        delete this.getFilter().includeInactive; // Prevent passing this to MongoDB
        next();
    });

    // Pre-save hook to assign a unique `uid` to new documents
    schema.pre('save', async function (next) {
        if (this.isNew) {
            const Model = this.constructor as any;
            const count = await Model.countDocuments();
            const lastUid = await Model.findOne().sort({ uid: -1 }).select('uid');
            const lastUidGreaterThanCount = lastUid && lastUid.uid > count;
            if (lastUid && lastUidGreaterThanCount) {
                this.uid = lastUid.uid + 1;
            } else {
                this.uid = count + 1;
            }
        }
        next();
    });

    // Find one document by its `uid`
    schema.statics.findByUid = function (uid: number) {
        return this.findOne({ uid } as any);
    };

    schema.statics.findManyByUids = function (uids: number[]) {
        return this.find({ uid: { $in: uids } } as any);
    }

    // Instance method to soft delete a document
    schema.methods.softDelete = async function () {
        this.active = false;
        await this.save();
    };

    // Instance method to restore a soft-deleted document
    schema.methods.restore = async function () {
        this.active = true;
        await this.save();
    };

    // Ensure the `active` field is omitted when converting to JSON or plain objects
    schema.set('toJSON', {
        transform: (doc, ret) => {
            delete ret.active;
            return ret;
        },
    });

    schema.set('toObject', {
        transform: (doc, ret) => {
            delete ret.active;
            return ret;
        },
    });
}
