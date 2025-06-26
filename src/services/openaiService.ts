import OpenAI from 'openai';
import Logger from '../utils/logger';
import { CVAnalysis } from '../types/CVAnalysis';

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
    if (!openaiClient) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key is not configured');
        }
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
};

export const analyzeCVText = async (text: string): Promise<CVAnalysis> => {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error('No text provided for analysis');
        }

        Logger.log('Starting CV analysis with OpenAI');

        // Get the OpenAI client (will initialize if needed)
        const openai = getOpenAIClient();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert CV/Resume analyzer. Extract and structure information from the provided CV text into a JSON format. 
                    
                    Important guidelines:
                    - Extract all available information accurately
                    - If information is not found, use empty string or empty array
                    - For Hebrew text, translate names of companies/institutions to English if they're well-known, otherwise keep original
                    - Parse dates in a consistent format
                    - Group similar skills together
                    - Extract key achievements and responsibilities
                    - Be thorough but concise in descriptions`
                },
                {
                    role: "user",
                    content: `Please analyze this CV/Resume text and extract structured information:\n\n${text}`
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "cv_analysis",
                    schema: {
                        type: "object",
                        properties: {
                            personalInfo: {
                                type: "object",
                                properties: {
                                    fullName: { type: "string" },
                                    email: { type: "string" },
                                    phone: { type: "string" },
                                    address: { type: "string" },
                                    linkedinUrl: { type: "string" },
                                    portfolioUrl: { type: "string" }
                                },
                                required: ["fullName"]
                            },
                            summary: { type: "string" },
                            skills: {
                                type: "object",
                                properties: {
                                    technical: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    soft: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    languages: {
                                        type: "array",
                                        items: { type: "string" }
                                    }
                                },
                                required: ["technical", "soft", "languages"]
                            },
                            experience: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        company: { type: "string" },
                                        position: { type: "string" },
                                        duration: { type: "string" },
                                        description: { type: "string" },
                                        achievements: {
                                            type: "array",
                                            items: { type: "string" }
                                        }
                                    },
                                    required: ["company", "position", "duration", "description"]
                                }
                            },
                            education: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        institution: { type: "string" },
                                        degree: { type: "string" },
                                        field: { type: "string" },
                                        graduationYear: { type: "string" },
                                        gpa: { type: "string" }
                                    },
                                    required: ["institution", "degree", "field"]
                                }
                            },
                            certifications: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        issuer: { type: "string" },
                                        date: { type: "string" }
                                    },
                                    required: ["name", "issuer"]
                                }
                            },
                            projects: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        description: { type: "string" },
                                        technologies: {
                                            type: "array",
                                            items: { type: "string" }
                                        },
                                        link: { type: "string" }
                                    },
                                    required: ["name", "description", "technologies"]
                                }
                            },
                            awards: {
                                type: "array",
                                items: { type: "string" }
                            },
                            additionalInfo: { type: "string" }
                        },
                        required: ["personalInfo", "summary", "skills", "experience", "education", "certifications", "projects"]
                    }
                }
            },
            temperature: 0.1,
            max_tokens: 4000
        });

        const result = completion.choices[0]?.message?.content;
        
        if (!result) {
            throw new Error('No response received from OpenAI');
        }

        Logger.log('CV analysis completed successfully');
        
        return JSON.parse(result) as CVAnalysis;
        
    } catch (error: any) {
        Logger.error('Error in OpenAI CV analysis:', error);
        
        // If it's a JSON parsing error, log the raw response
        if (error instanceof SyntaxError) {
            Logger.error('JSON parsing failed, raw response might be malformed');
        }
        
        throw new Error(`CV analysis failed: ${error.message}`);
    }
};

export const openaiService = {
    analyzeCVText
};
