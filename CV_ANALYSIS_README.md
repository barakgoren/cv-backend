# CV Analysis API

This API endpoint analyzes CV/Resume PDF files using OpenAI to extract structured information.

## Overview

The API downloads a PDF file from a provided URL, extracts the text content, and uses OpenAI's GPT-4 to analyze and structure the CV data into a standardized JSON format.

## Setup

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# R2 Storage Configuration (for file uploads)
R2_BUCKET=your-r2-bucket-name
R2_ENDPOINT=your-r2-endpoint-url
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Installation

```bash
npm install
```

## API Endpoint

### Analyze CV from PDF

**Endpoint:** `GET /api/files/read-pdf/:pdfUrl`

**Description:** Downloads and analyzes a CV/Resume PDF file using AI

**Parameters:**
- `pdfUrl` (path parameter): URL-encoded URL of the PDF file to analyze

**Example Request:**
```bash
# URL encode the PDF URL
PDF_URL="https://example.com/resume.pdf"
ENCODED_URL=$(node -e "console.log(encodeURIComponent('$PDF_URL'))")

curl -X GET "http://localhost:3000/api/files/read-pdf/$ENCODED_URL"
```

**Example Response:**
```json
{
  "message": "PDF analyzed successfully",
  "data": {
    "analysis": {
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john.doe@email.com",
        "phone": "+1-555-123-4567",
        "address": "123 Main St, City, State",
        "linkedinUrl": "https://linkedin.com/in/johndoe",
        "portfolioUrl": "https://johndoe.dev"
      },
      "summary": "Experienced software developer with 5+ years...",
      "skills": {
        "technical": ["JavaScript", "React", "Node.js", "Python"],
        "soft": ["Leadership", "Communication", "Problem Solving"],
        "languages": ["English", "Spanish", "Hebrew"]
      },
      "experience": [
        {
          "company": "Tech Corp",
          "position": "Senior Developer",
          "duration": "2020 - Present",
          "description": "Led development of web applications...",
          "achievements": [
            "Improved performance by 40%",
            "Led team of 5 developers"
          ]
        }
      ],
      "education": [
        {
          "institution": "University of Technology",
          "degree": "Bachelor of Science",
          "field": "Computer Science",
          "graduationYear": "2019",
          "gpa": "3.8"
        }
      ],
      "certifications": [
        {
          "name": "AWS Certified Developer",
          "issuer": "Amazon Web Services",
          "date": "2021"
        }
      ],
      "projects": [
        {
          "name": "E-commerce Platform",
          "description": "Built a full-stack e-commerce solution...",
          "technologies": ["React", "Node.js", "MongoDB"],
          "link": "https://github.com/johndoe/ecommerce"
        }
      ],
      "awards": [
        "Employee of the Year 2021",
        "Innovation Award 2020"
      ],
      "additionalInfo": "Volunteer at local coding bootcamp..."
    },
    "metadata": {
      "totalPages": 2,
      "textLength": 1543,
      "analyzedAt": "2025-06-27T01:24:00.000Z"
    }
  }
}
```

## Features

### AI-Powered Analysis
- Uses OpenAI GPT-4 for intelligent text analysis
- Handles Hebrew and English text
- Structured JSON output with consistent format

### Comprehensive Data Extraction
- Personal information (name, contact details, social links)
- Professional summary
- Skills categorization (technical, soft skills, languages)
- Work experience with achievements
- Education history
- Certifications and awards
- Projects with technologies used
- Additional information

### Error Handling
- Validates PDF URLs
- Handles image-based PDFs
- Provides detailed error messages
- Graceful failure for malformed content

## Error Responses

### 400 Bad Request
```json
{
  "message": "File URL is required",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to analyze CV content with AI",
  "data": {
    "error": "CV analysis failed: OpenAI API error",
    "suggestion": "Please ensure the PDF contains readable text and try again."
  }
}
```

## Supported Features

- ✅ PDF text extraction
- ✅ AI-powered content analysis
- ✅ Structured JSON response
- ✅ Hebrew/English language support
- ✅ Error handling and validation
- ✅ Metadata tracking
- ✅ OpenAPI/Swagger documentation

## Testing

Use the example PDF file in the project root or any publicly accessible PDF CV:

```bash
# Test with a sample PDF
curl -X GET "http://localhost:3000/api/files/read-pdf/$(node -e "console.log(encodeURIComponent('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'))")"
```

## Notes

- The PDF must be publicly accessible via HTTP/HTTPS
- Maximum processing time depends on PDF size and complexity
- Requires valid OpenAI API key with sufficient credits
- Best results with text-based PDFs (not scanned images)
