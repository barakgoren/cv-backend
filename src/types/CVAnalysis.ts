// CV Analysis related types
export interface CVAnalysis {
    personalInfo: {
        fullName: string;
        email?: string;
        phone?: string;
        address?: string;
        linkedinUrl?: string;
        portfolioUrl?: string;
    };
    summary: string;
    skills: {
        technical: string[];
        soft: string[];
        languages: string[];
    };
    experience: Array<{
        company: string;
        position: string;
        duration: string;
        description: string;
        achievements?: string[];
    }>;
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        graduationYear?: string;
        gpa?: string;
    }>;
    certifications: Array<{
        name: string;
        issuer: string;
        date?: string;
    }>;
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        link?: string;
    }>;
    awards?: string[];
    additionalInfo?: string;
}

export interface CVAnalysisResponse {
    analysis: CVAnalysis;
    metadata: {
        totalPages: number;
        textLength: number;
        analyzedAt: string;
    };
}
