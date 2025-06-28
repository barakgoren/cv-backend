import { CVAnalysisResponse as CVRes } from "./CVAnalysis";

export type ApplicantStructure = {
    personalInfo: {
        fullName: string;
        email?: string;
        phone?: string;
        currentCompany?: string;
        location?: string;
        experience?: string;
        skills?: string[];
        keyStrengths?: string[];
        areaForImprovement?: string[];
        salaryExpectation?: string;
    };
    matchPrecentage: number;
    matchPercentageReason: string;
    matchLabel: string;
}

export type CVAnalysisResponse = CVRes

export type ApplicantsCompareResponse = {
    applicants: ApplicantStructure[];
}