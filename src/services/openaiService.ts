import OpenAI from 'openai';
import Logger from '../utils/logger';
import { CVAnalysis } from '../types/CVAnalysis';

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

export const analyzeCVText = async (text: string): Promise<CVAnalysis> => {
    try {
        // For development/testing purposes, return mock data
        Logger.log('Using mock CV analysis response');
        return mockAiResponse;

        // Uncomment below for actual OpenAI integration
        // if (!text || text.trim().length === 0) {
        //     throw new Error('No text provided for analysis');
        // }

        // Logger.log('Starting CV analysis with OpenAI');

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
        //             content: `Please analyze this CV/Resume text and extract structured information:\n\n${text}`
        //         }
        //     ],
        //     response_format: {
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
        //     },
        //     temperature: 0.1,
        //     max_tokens: 4000
        // });

        // const result = completion.choices[0]?.message?.content;
        
        // if (!result) {
        //     throw new Error('No response received from OpenAI');
        // }

        // Logger.log('CV analysis completed successfully');
        
        // return JSON.parse(result) as CVAnalysis;
        
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
