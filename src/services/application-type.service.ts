import { resolve } from "path";
import ApplicationType from "../models/ApplicationType";
import { ApplicationTypeZSchema } from "../schemas/application-type.schema"

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
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay for demonstration purposes
        const applicationTypes = await ApplicationType.find({ companyId });
        return applicationTypes;
    } catch (error) {
        throw new Error("Failed to fetch application types");
    }
}


export const applicationTypeService = {
    createApplicationType,
    getApplicationTypes
}