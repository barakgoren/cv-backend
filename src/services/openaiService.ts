import OpenAI from 'openai';
import Logger from '../utils/logger';
import { CVAnalysis } from '../types/CVAnalysis';
import { applicantsCompareSchema, ApplicantsCompareResponse } from '../schemas/ai-schemas/applicants.schema';
import { cache } from '../utils/cache';

const mockAiResponseCompare: ApplicantsCompareResponse = {
    applicants: [
        {
            personalInfo: {
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1-555-123-4567',
                currentCompany: 'TechCorp Solutions',
                location: 'San Francisco, CA',
                experience: '5+ years',
                skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB'],
                keyStrengths: [
                    'Strong full-stack development experience',
                    'Leadership and team management skills',
                    'Performance optimization expertise',
                    'CI/CD pipeline implementation'
                ],
                areaForImprovement: [
                    'Could benefit from more cloud architecture experience',
                    'Limited experience with microservices at scale'
                ],
                salaryExpectation: '$120,000 - $140,000'
            },
            matchPrecentage: 92,
            matchPercentageReason: 'Excellent alignment with all required skills. Strong experience in React, Node.js, and team leadership. Proven track record in performance optimization and modern development practices.',
            matchLabel: 'Excellent Match'
        },
        {
            personalInfo: {
                fullName: 'Jane Smith',
                email: 'jane.smith@email.com',
                phone: '+1-555-987-6543',
                currentCompany: 'Innovation Labs',
                location: 'New York, NY',
                experience: '3+ years',
                skills: ['Python', 'React', 'Django', 'PostgreSQL', 'AWS'],
                keyStrengths: [
                    'Strong problem-solving abilities',
                    'Experience with modern web frameworks',
                    'Good understanding of database design',
                    'Agile development experience'
                ],
                areaForImprovement: [
                    'Limited Node.js experience',
                    'Could benefit from more senior-level project leadership',
                    'Less experience with large-scale applications'
                ],
                salaryExpectation: '$95,000 - $110,000'
            },
            matchPrecentage: 75,
            matchPercentageReason: 'Good technical foundation with React and database experience. However, lacks Node.js experience and senior-level leadership skills required for this position.',
            matchLabel: 'Good Match'
        },
        {
            personalInfo: {
                fullName: 'Mike Johnson',
                email: 'mike.johnson@domain.com',
                phone: '+1-555-456-7890',
                currentCompany: 'StartupXYZ',
                location: 'Austin, TX',
                experience: '7+ years',
                skills: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Docker'],
                keyStrengths: [
                    'Extensive backend development experience',
                    'Strong system architecture skills',
                    'Experience with containerization',
                    'Proven ability to work in startup environments'
                ],
                areaForImprovement: [
                    'Limited React experience (mainly Angular)',
                    'No Node.js background',
                    'Different technology stack than required'
                ],
                salaryExpectation: '$130,000 - $150,000'
            },
            matchPrecentage: 58,
            matchPercentageReason: 'Strong senior-level experience and system architecture skills, but primarily Java/Angular background does not align well with the React/Node.js requirements.',
            matchLabel: 'Fair Match'
        }
    ]
};

const mockAiResponse: CVAnalysis = {
    personalInfo: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-123-4567',
        address: '123 Main Street, San Francisco, CA 94105',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        portfolioUrl: 'https://johndoe.dev'
    },
    summary: 'Experienced Full-Stack Software Engineer with 5+ years of expertise in building scalable web applications using modern technologies. Proven track record in leading development teams, implementing CI/CD pipelines, and delivering high-quality software solutions. Passionate about clean code, system architecture, and continuous learning.',
    skills: {
        technical: [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js',
            'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
            'Git', 'Jest', 'Cypress', 'REST APIs', 'GraphQL'
        ],
        soft: [
            'Team Leadership', 'Project Management', 'Communication',
            'Problem Solving', 'Mentoring', 'Agile/Scrum', 'Code Review'
        ],
        languages: ['English (Native)', 'Spanish (Conversational)', 'French (Basic)']
    },
    experience: [
        {
            company: 'TechCorp Solutions',
            position: 'Senior Full-Stack Developer',
            duration: '2022 - Present',
            description: 'Lead development of enterprise-level web applications serving 100K+ users. Architect and implement scalable microservices using Node.js and React.',
            achievements: [
                'Reduced application load time by 40% through performance optimization',
                'Led a team of 5 developers in successful product launch',
                'Implemented automated testing pipeline reducing bugs by 60%'
            ]
        },
        {
            company: 'StartupXYZ',
            position: 'Full-Stack Developer',
            duration: '2020 - 2022',
            description: 'Developed and maintained multiple client-facing applications using React, Node.js, and MongoDB. Collaborated closely with design and product teams.',
            achievements: [
                'Built MVP that secured $2M in Series A funding',
                'Increased user engagement by 35% through UX improvements',
                'Mentored 2 junior developers'
            ]
        },
        {
            company: 'Digital Agency Inc',
            position: 'Junior Web Developer',
            duration: '2019 - 2020',
            description: 'Developed responsive websites and web applications for various clients. Worked with HTML, CSS, JavaScript, and WordPress.',
            achievements: [
                'Delivered 15+ client projects on time and within budget',
                'Improved website performance scores by average of 25%'
            ]
        }
    ],
    education: [
        {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            graduationYear: '2019',
            gpa: '3.8'
        }
    ],
    certifications: [
        {
            name: 'AWS Certified Developer Associate',
            issuer: 'Amazon Web Services',
            date: '2023'
        },
        {
            name: 'MongoDB Certified Developer',
            issuer: 'MongoDB Inc.',
            date: '2022'
        },
        {
            name: 'React Professional Certificate',
            issuer: 'Meta',
            date: '2021'
        }
    ],
    projects: [
        {
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AWS S3'],
            link: 'https://github.com/johndoe/ecommerce-platform'
        },
        {
            name: 'Task Management App',
            description: 'Real-time collaborative task management application with drag-and-drop functionality.',
            technologies: ['React', 'Socket.io', 'Express.js', 'PostgreSQL'],
            link: 'https://github.com/johndoe/task-manager'
        },
        {
            name: 'Weather Dashboard',
            description: 'Responsive weather dashboard with location-based forecasts and data visualization.',
            technologies: ['Vue.js', 'Chart.js', 'OpenWeather API', 'CSS Grid'],
            link: 'https://github.com/johndoe/weather-dashboard'
        }
    ],
    awards: [
        'Employee of the Year 2023 - TechCorp Solutions',
        'Best Innovation Award 2022 - StartupXYZ',
        'Dean\'s List 2017-2019 - UC Berkeley'
    ],
    additionalInfo: 'Available for remote work or relocation. Open to both full-time and contract opportunities. Passionate about open-source contributions and have contributed to several popular JavaScript libraries.'
};

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

export const useAI = async <T = CVAnalysis>({ text, schema, content }: { schema?: any; content?: string; text: string }): Promise<T> => {
    try {
        // For development/testing purposes, return mock data
        return mockAiResponse as T;

        // Uncomment below for actual OpenAI integration
        // if (!text || text.trim().length === 0) {
        //     throw new Error('No text provided for analysis');
        // }

        // // Get the OpenAI client (will initialize if needed)
        // const openai = getOpenAIClient();

        // const completion = await openai.chat.completions.create({
        //     model: "gpt-4o",
        //     messages: [
        //         {
        //             role: "system",
        //             content: `You are an expert CV/Resume analyzer. Extract and structure information from the provided CV text into a JSON format. 

        //             Important guidelines:
        //             - Extract all available information accurately
        //             - If information is not found, use empty string or empty array
        //             - For Hebrew text, translate names of companies/institutions to English if they're well-known, otherwise keep original
        //             - Parse dates in a consistent format
        //             - Group similar skills together
        //             - Extract key achievements and responsibilities
        //             - Be thorough but concise in descriptions`
        //         },
        //         {
        //             role: "user",
        //             content: !content ? `Please analyze this CV/Resume text and extract structured information:\n\n${text}` : content
        //         }
        //     ],
        //     response_format: !schema ? {
        //         type: "json_schema",
        //         json_schema: {
        //             name: "cv_analysis",
        //             schema: {
        //                 type: "object",
        //                 properties: {
        //                     personalInfo: {
        //                         type: "object",
        //                         properties: {
        //                             fullName: { type: "string" },
        //                             email: { type: "string" },
        //                             phone: { type: "string" },
        //                             address: { type: "string" },
        //                             linkedinUrl: { type: "string" },
        //                             portfolioUrl: { type: "string" }
        //                         },
        //                         required: ["fullName"]
        //                     },
        //                     summary: { type: "string" },
        //                     skills: {
        //                         type: "object",
        //                         properties: {
        //                             technical: {
        //                                 type: "array",
        //                                 items: { type: "string" }
        //                             },
        //                             soft: {
        //                                 type: "array",
        //                                 items: { type: "string" }
        //                             },
        //                             languages: {
        //                                 type: "array",
        //                                 items: { type: "string" }
        //                             }
        //                         },
        //                         required: ["technical", "soft", "languages"]
        //                     },
        //                     experience: {
        //                         type: "array",
        //                         items: {
        //                             type: "object",
        //                             properties: {
        //                                 company: { type: "string" },
        //                                 position: { type: "string" },
        //                                 duration: { type: "string" },
        //                                 description: { type: "string" },
        //                                 achievements: {
        //                                     type: "array",
        //                                     items: { type: "string" }
        //                                 }
        //                             },
        //                             required: ["company", "position", "duration", "description"]
        //                         }
        //                     },
        //                     education: {
        //                         type: "array",
        //                         items: {
        //                             type: "object",
        //                             properties: {
        //                                 institution: { type: "string" },
        //                                 degree: { type: "string" },
        //                                 field: { type: "string" },
        //                                 graduationYear: { type: "string" },
        //                                 gpa: { type: "string" }
        //                             },
        //                             required: ["institution", "degree", "field"]
        //                         }
        //                     },
        //                     certifications: {
        //                         type: "array",
        //                         items: {
        //                             type: "object",
        //                             properties: {
        //                                 name: { type: "string" },
        //                                 issuer: { type: "string" },
        //                                 date: { type: "string" }
        //                             },
        //                             required: ["name", "issuer"]
        //                         }
        //                     },
        //                     projects: {
        //                         type: "array",
        //                         items: {
        //                             type: "object",
        //                             properties: {
        //                                 name: { type: "string" },
        //                                 description: { type: "string" },
        //                                 technologies: {
        //                                     type: "array",
        //                                     items: { type: "string" }
        //                                 },
        //                                 link: { type: "string" }
        //                             },
        //                             required: ["name", "description", "technologies"]
        //                         }
        //                     },
        //                     awards: {
        //                         type: "array",
        //                         items: { type: "string" }
        //                     },
        //                     additionalInfo: { type: "string" }
        //                 },
        //                 required: ["personalInfo", "summary", "skills", "experience", "education", "certifications", "projects"]
        //             }
        //         }
        //     } : schema,
        //     temperature: 0.1,
        //     max_tokens: 4000
        // });

        // const result = completion.choices[0]?.message?.content;

        // if (!result) {
        //     throw new Error('No response received from OpenAI');
        // }

        // return JSON.parse(result) as T;

    } catch (error: any) {
        Logger.error('Error in OpenAI CV analysis:', error);

        // If it's a JSON parsing error, log the raw response
        if (error instanceof SyntaxError) {
            Logger.error('JSON parsing failed, raw response might be malformed');
        }

        throw new Error(`CV analysis failed: ${error.message}`);
    }
};

export const compareApplicants = async ({
    position,
    applicants
}: {
    position: {
        title: string;
        description: string;
        requirements?: string[];
    }
    applicants: {
        name: string;
        cv: string;
    }[];
}): Promise<ApplicantsCompareResponse> => {
    try {
        return mockAiResponseCompare;
        //         const key = applicants.map(app => app.name).join('-') + '-' + position.title;
        //         // Check if we have a cached result
        //         const cachedResult = cache.get(key);
        //         if (cachedResult) {
        //             return cachedResult;
        //         }
        //         if (!applicants || applicants.length === 0) {
        //             throw new Error('No applicants provided for comparison');
        //         }

        //         if (!position || !position.description || position.description.trim().length === 0) {
        //             throw new Error('No job description provided for comparison');
        //         }

        //         const openai = getOpenAIClient();

        //         // Format CVs with applicant names and numbers for easier reference
        //         const formattedCVs = applicants.map((applicant, index) =>
        //             `=== CV ${index + 1} - ${applicant.name} ===\n${applicant.cv}\n`
        //         ).join('\n');

        //         const systemPrompt = `You are an expert HR recruiter and CV analyzer. Your task is to:

        // 1. Analyze each provided CV against the given job description and requirements
        // 2. Extract key personal information from each CV
        // 3. Calculate a match percentage (0-100) based on:
        //    - Skills alignment with job requirements
        //    - Experience relevance and level
        //    - Education background fit
        //    - Overall career trajectory match
        // 4. Provide a clear reason for the match percentage
        // 5. Assign an appropriate match label
        // 6. Give some points of strengths and areas for improvement for each applicant

        // Match Labels Guidelines:
        // - "Excellent Match" (90-100%): Perfect or near-perfect alignment
        // - "Good Match" (70-89%): Strong alignment with minor gaps
        // - "Fair Match" (50-69%): Reasonable fit with some gaps
        // - "Poor Match" (30-49%): Significant gaps but some relevant experience
        // - "No Match" (0-29%): Little to no relevant experience or skills

        // Be thorough but concise in your analysis. Focus on concrete skills, experience, and qualifications.`;

        //         const userPrompt = `Please analyze and compare the following CVs against this job position:

        // JOB POSITION:
        // Title: ${position.title}
        // Description: ${position.description}

        // ${position.requirements && position.requirements.length > 0 ? `ADDITIONAL REQUIREMENTS:\n${position.requirements.join('\n')}\n` : ''}

        // CVS TO ANALYZE:
        // ${formattedCVs}

        // Please provide a structured comparison with match percentages, reasons, and extracted personal information for each applicant.`;

        //         const completion = await openai.chat.completions.create({
        //             model: "gpt-4o",
        //             messages: [
        //                 {
        //                     role: "system",
        //                     content: systemPrompt
        //                 },
        //                 {
        //                     role: "user",
        //                     content: userPrompt
        //                 }
        //             ],
        //             response_format: applicantsCompareSchema,
        //             temperature: 0.1,
        //             max_tokens: 4000
        //         });

        //         const result = completion.choices[0]?.message?.content;

        //         if (!result) {
        //             throw new Error('No response received from OpenAI');
        //         }

        //         const parsedResult = JSON.parse(result) as ApplicantsCompareResponse;

        //         // Validate that we have the expected number of applicants
        //         if (parsedResult.applicants.length !== applicants.length) {
        //             Logger.warning(`Expected ${applicants.length} applicants, got ${parsedResult.applicants.length}`);
        //         }

        //         // Cache the result for future use
        //         cache.set(key, parsedResult, 60 * 60 * 24); // Cache for 24 hours
        //         return parsedResult;

    } catch (error: any) {
        Logger.error('Error in OpenAI applicants comparison:', error);

        if (error instanceof SyntaxError) {
            Logger.error('JSON parsing failed, raw response might be malformed');
        }

        throw new Error(`Applicants comparison failed: ${error.message}`);
    }
};

export const openaiService = {
    useAI,
    compareApplicants
};
