import conf from '../conf/conf.js';
import { Client, Databases, Query, Storage, ID } from 'appwrite';

export class Service {
    client = new Client();
    databases;
    storage;

    constructor() {
        this.client.setEndpoint(conf.AppwriteUrl).setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);

        console.log('Service config:', {
            databaseId: conf.appwriteDatabaseId,
            collectionId: conf.appwriteCollectionId,
            bucketId: conf.appwriteBucketId
        });
    }

    async createPost({ title, slug, content, images, status = 'active', userid }) {
        try {
            const post = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(), {
                    title,
                    slug,
                    content,
                    images,
                    status,
                    userid,
                });
            return { success: true, data: post };
        } catch (err) {
            console.error('Error creating post:', err);
            return { success: false, error: err.message };
        }
    }
    async updatePost(postId, { title, content, images, userid }) {
        try {
            const post = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId, {
                    title,
                    content,
                    images,
                    userid,
                });
            return { success: true, data: post };
        } catch (err) {
            console.error('Error updating post:', err);
            return { success: false, error: err.message };
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId);
            return true;
        } catch (err) {
            console.error('Error deleting post:', err);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId);
        } catch (err) {
            console.error('Error getting post:', err);
            throw err;
        }
    }

    async listPosts(queries = [Query.equal("status", "active")]) {
        try {
            const posts = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId, [
                    ...queries,
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]);
            return { success: true, data: posts };
        } catch (err) {
            console.error('Error listing posts:', err);
            return { success: false, error: err.message };
        }
    }

    async uploadfile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId, // Changed from AppwriteBucketId
                ID.unique(),
                file
            );
        } catch (err) {
            console.error('Error uploading file:', err);
            return false;
        }
    }

    async deletefile(fileId) {
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId, // Changed
                fileId
            );
            return true;
        } catch (err) {
            console.error('Error deleting file:', err);
            return false;
        }
    }

    getfilePreview(fileId) {
        return this.storage.getFilePreview(
            conf.appwriteBucketId, // Changed
            fileId,
        );
    }


    getfileview(fileId) {
        return this.getfilePreview(fileId);
    }
};

const service = new Service();
export default service;