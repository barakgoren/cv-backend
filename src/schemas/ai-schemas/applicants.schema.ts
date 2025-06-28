import { ApplicantsCompareResponse } from '../../types/AiResponses';

// OpenAI JSON Schema for Applicants Comparison
export const applicantsCompareSchema = {
    type: "json_schema" as const,
    json_schema: {
        name: "applicants_compare",
        schema: {
            type: "object",
            properties: {
                applicants: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            personalInfo: {
                                type: "object",
                                properties: {
                                    fullName: { type: "string" },
                                    email: { type: "string" },
                                    phone: { type: "string" },
                                    currentCompany: { type: "string" },
                                    location: { type: "string" },
                                    experience: { type: "string" },
                                    skills: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    keyStrengths: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    areaForImprovement: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    salaryExpectation: { type: "string" }
                                },
                                required: ["fullName"]
                            },
                            matchPrecentage: {
                                type: "number",
                                minimum: 0,
                                maximum: 100
                            },
                            matchPercentageReason: { type: "string" },
                            matchLabel: {
                                type: "string",
                                enum: ["Excellent Match", "Good Match", "Fair Match", "Poor Match", "No Match"]
                            }
                        },
                        required: ["personalInfo", "matchPrecentage", "matchPercentageReason", "matchLabel"]
                    }
                }
            },
            required: ["applicants"]
        }
    }
};

export type { ApplicantsCompareResponse };