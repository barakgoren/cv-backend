import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Logger from '../utils/logger';

interface UploadResult {
    key: string;
    url: string;
    bucket: string;
    fieldName?: string; // Optional field name for form uploads
    size: number;
}

interface FileInfo {
    key: string;
    size: number;
    lastModified: Date;
    url: string;
}

class FileUploadService {
    private s3Client: S3Client | null = null;
    private bucket: string | null = null;
    private endpoint: string | null = null;
    private publicUrl: string | null = null;
    private initialized: boolean = false;

    constructor() {
        // Don't initialize here - use lazy initialization
    }

    private initialize(): void {
        if (this.initialized) {
            return;
        }

        // Validate required environment variables
        this.validateEnvironmentVariables();

        this.bucket = process.env.R2_BUCKET!;
        this.endpoint = process.env.R2_ENDPOINT!;
        this.publicUrl = process.env.R2_PUBLIC_URL!;

        // Initialize S3 client for Cloudflare R2
        this.s3Client = new S3Client({
            region: 'auto', // Cloudflare R2 uses 'auto' for region
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true, // Required for R2 compatibility
        });

        this.initialized = true;
    }

    private validateEnvironmentVariables(): void {
        const requiredVars = ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_ENDPOINT', 'R2_PUBLIC_URL'];
        const missingVars = requiredVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            Logger.error('Missing required environment variables:', missingVars);
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
    }

    /**
     * Upload a file to Cloudflare R2
     */
    async uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        contentType: string = 'application/octet-stream',
        folder?: string,
        fieldName?: string
    ): Promise<UploadResult> {
        this.initialize(); // Ensure service is initialized

        try {
            // Generate unique file key
            const key = this.generateFileKey(fileName, folder);

            const uploadCommand = new PutObjectCommand({
                Bucket: this.bucket!,
                Key: key,
                Body: fileBuffer,
                ContentType: contentType,
                // Optional: Add metadata
                Metadata: {
                    'uploaded-at': new Date().toISOString(),
                    'original-name': fileName,
                },
            });

            await this.s3Client!.send(uploadCommand);

            // Generate public URL for the uploaded file
            const fileUrl = `${this.publicUrl}/${key}`;

            return {
                key,
                url: fileUrl,
                fieldName,
                bucket: this.bucket!,
                size: fileBuffer.length,
            };
        } catch (error) {
            Logger.error('Error uploading file to R2:', error);
            throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete a file from Cloudflare R2
     */
    async deleteFile(key: string): Promise<void> {
        this.initialize(); // Ensure service is initialized

        try {
            const deleteCommand = new DeleteObjectCommand({
                Bucket: this.bucket!,
                Key: key,
            });

            await this.s3Client!.send(deleteCommand);
        } catch (error) {
            Logger.error('Error deleting file from R2:', error);
            throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate a signed URL for temporary access to a file
     */
    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        this.initialize(); // Ensure service is initialized

        try {
            const getObjectCommand = new GetObjectCommand({
                Bucket: this.bucket!,
                Key: key,
            });

            const signedUrl = await getSignedUrl(this.s3Client!, getObjectCommand, { expiresIn });
            return signedUrl;
        } catch (error) {
            Logger.error('Error generating signed URL:', error);
            throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * List files in a specific folder/prefix
     */
    async listFiles(prefix?: string, maxKeys: number = 100): Promise<FileInfo[]> {
        this.initialize(); // Ensure service is initialized

        try {
            const listCommand = new ListObjectsV2Command({
                Bucket: this.bucket!,
                Prefix: prefix,
                MaxKeys: maxKeys,
            });

            const response = await this.s3Client!.send(listCommand);

            const files: FileInfo[] = (response.Contents || []).map(object => ({
                key: object.Key!,
                size: object.Size || 0,
                lastModified: object.LastModified || new Date(),
                url: `${this.publicUrl}/${object.Key}`,
            }));

            return files;
        } catch (error) {
            Logger.error('Error listing files from R2:', error);
            throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if a file exists
     */
    async fileExists(key: string): Promise<boolean> {
        this.initialize(); // Ensure service is initialized

        try {
            const headCommand = new GetObjectCommand({
                Bucket: this.bucket!,
                Key: key,
            });

            await this.s3Client!.send(headCommand);
            return true;
        } catch (error: any) {
            if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
                return false;
            }
            Logger.error('Error checking if file exists:', error);
            throw new Error(`Failed to check file existence: ${error.message}`);
        }
    }

    /**
     * Generate a unique file key with optional folder structure
     */
    private generateFileKey(fileName: string, folder?: string): string {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');

        const uniqueFileName = `${timestamp}_${randomString}_${sanitizedFileName}`;

        return folder ? `${folder}/${uniqueFileName}` : uniqueFileName;
    }

    /**
     * Get file info without downloading
     */
    async getFileInfo(key: string): Promise<{ size: number; contentType: string; lastModified: Date } | null> {
        this.initialize(); // Ensure service is initialized

        try {
            const headCommand = new GetObjectCommand({
                Bucket: this.bucket!,
                Key: key,
            });

            const response = await this.s3Client!.send(headCommand);

            return {
                size: response.ContentLength || 0,
                contentType: response.ContentType || 'application/octet-stream',
                lastModified: response.LastModified || new Date(),
            };
        } catch (error: any) {
            if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
                return null;
            }
            Logger.error('Error getting file info:', error);
            throw new Error(`Failed to get file info: ${error.message}`);
        }
    }

    /**
     * Get public URL for a file
     */
    getPublicUrl(key: string): string {
        this.initialize(); // Ensure service is initialized
        return `${this.publicUrl}/${key}`;
    }
}

export const fileUploadService = new FileUploadService();
export { FileUploadService, UploadResult, FileInfo };
