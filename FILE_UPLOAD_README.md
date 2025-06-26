# File Upload Service - Cloudflare R2 Integration

This document provides information about the file upload service integrated with Cloudflare R2.

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
```

## Available Endpoints

### 1. Upload Single File
- **POST** `/api/files/upload`
- **Authentication**: Required (Bearer token)
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: The file to upload (required)
  - `folder`: Optional folder name to organize files

**Example using curl:**
```bash
curl -X POST "http://localhost:3005/api/files/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.pdf" \
  -F "folder=resumes"
```

### 2. Upload Multiple Files
- **POST** `/api/files/upload-multiple`
- **Authentication**: Required (Bearer token)
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `files`: Array of files to upload (max 5 files)
  - `folder`: Optional folder name

**Example using curl:**
```bash
curl -X POST "http://localhost:3005/api/files/upload-multiple" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.jpg" \
  -F "folder=documents"
```

### 3. Delete File
- **DELETE** `/api/files/{key}`
- **Authentication**: Required (Bearer token)

**Example:**
```bash
curl -X DELETE "http://localhost:3005/api/files/uploads/1642512345_abc123_resume.pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Signed URL
- **GET** `/api/files/{key}/url`
- **Authentication**: Required (Bearer token)
- **Query Parameters**:
  - `expiresIn`: URL expiration time in seconds (default: 3600)

**Example:**
```bash
curl -X GET "http://localhost:3005/api/files/uploads/1642512345_abc123_resume.pdf/url?expiresIn=7200" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. List Files
- **GET** `/api/files/list`
- **Authentication**: Required (Bearer token)
- **Query Parameters**:
  - `prefix`: Filter files by prefix/folder
  - `maxKeys`: Maximum number of files to return (default: 100)

**Example:**
```bash
curl -X GET "http://localhost:3005/api/files/list?prefix=uploads/&maxKeys=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Get File Info
- **GET** `/api/files/{key}/info`
- **Authentication**: Required (Bearer token)

**Example:**
```bash
curl -X GET "http://localhost:3005/api/files/uploads/1642512345_abc123_resume.pdf/info" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Health Check
- **GET** `/api/files/health`
- **Authentication**: Not required

**Example:**
```bash
curl -X GET "http://localhost:3005/api/files/health"
```

## Supported File Types

- PDF documents: `application/pdf`
- Images: `image/jpeg`, `image/png`, `image/gif`
- Word documents: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Plain text: `text/plain`

## File Size Limits

- Maximum file size: 10MB per file
- Maximum files in multiple upload: 5 files

## Response Format

All endpoints return responses in the following format:

```json
{
  "data": { /* response data */ },
  "meta": {
    "code": 200,
    "title": "Success",
    "message": "Request successful"
  }
}
```

### Success Response Example (File Upload):
```json
{
  "data": {
    "key": "uploads/1642512345_abc123_resume.pdf",
    "url": "https://your-bucket.r2.cloudflarestorage.com/uploads/1642512345_abc123_resume.pdf",
    "bucket": "your-bucket-name",
    "size": 1048576
  },
  "meta": {
    "code": 200,
    "title": "Success", 
    "message": "File uploaded successfully"
  }
}
```

## Form Configuration Integration

The system also provides a `/api/application/form-config/{companyId}` endpoint that includes file upload configuration for dynamic forms.

## Security Notes

1. All file upload endpoints require authentication (Bearer token)
2. File type validation is enforced server-side
3. File size limits are enforced (10MB max)
4. Unique file names are generated to prevent conflicts
5. Signed URLs provide temporary access with configurable expiration

## Error Handling

The service includes comprehensive error handling for:
- Invalid file types
- File size limits exceeded
- Missing authentication
- Network failures
- R2 service errors
- File not found scenarios

## Testing the Service

1. Start the server: `npm run dev`
2. Check health endpoint: `GET /api/files/health`
3. Use the Swagger documentation at `/api-docs` for interactive testing
4. Test file upload with a valid JWT token

## Integration with Applications

Files uploaded through this service can be referenced in applications by storing the returned `key` in the application's `customFields`. The application service already supports link preview functionality for URLs, and file keys can be used to generate signed URLs when needed.
