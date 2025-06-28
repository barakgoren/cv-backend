import { resolve } from "path";
import ApplicationType from "../models/ApplicationType";
import { ApplicationTypeZSchema } from "../schemas/application-type.schema"
import Logger from "../utils/logger";

const createApplicationType = async (applicationType: ApplicationTypeZSchema) => {
    try {
        const newApplicationType = new ApplicationType(applicationType);
        const savedApplicationType = await newApplicationType.save();
        return savedApplicationType;
    } catch (error) {
        throw new Error("Failed to create application type");
    }
}

const getApplicationTypes = async (companyId: number) => {
    try {
        const applicationTypes = await ApplicationType.find({ companyId });
        return applicationTypes;
    } catch (error) {
        throw new Error("Failed to fetch application types");
    }
}

const getApplicationTypeById = async (applicationTypeId: number) => {
    try {
        const applicationType = await ApplicationType.findByUid(applicationTypeId);
        if (!applicationType) {
            return null; // or throw an error if you prefer
        }
        return applicationType;
    } catch (error) {
        throw new Error("Failed to fetch application type");
    }
}

const patchApplicationType = async (applicationTypeId: number, updateData: Partial<ApplicationTypeZSchema>) => {
    try {
        const updatedApplicationType = await ApplicationType.findByUid(applicationTypeId);
        if (!updatedApplicationType) {
            throw new Error("Application type not found");
        }
        Object.assign(updatedApplicationType, updateData);
        const savedApplicationType = await updatedApplicationType.save();
        return savedApplicationType;
    } catch (error) {
        throw new Error("Failed to update application type");
    }
}

const updateApplicationType = async (applicationTypeId: number, updateData: ApplicationTypeZSchema) => {
    try {
        const applicationType = await ApplicationType.findByUid(applicationTypeId);
        if (!applicationType) {
            throw new Error("Application type not found");
        }
        Object.assign(applicationType, updateData);
        const savedApplicationType = await applicationType.save();
        return savedApplicationType;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update application type");
    }
}

const deleteApplicationType = async (applicationTypeId: number) => {
    try {
        const applicationType = await ApplicationType.findByUid(applicationTypeId);
        if (!applicationType) {
            throw new Error("Application type not found");
        }
        await applicationType.softDelete();
        return applicationType;
    } catch (error) {
        throw new Error("Failed to delete application type");
    }
}

export const applicationTypeService = {
    createApplicationType,
    getApplicationTypes,
    patchApplicationType,
    getApplicationTypeById,
    deleteApplicationType,
    updateApplicationType
}