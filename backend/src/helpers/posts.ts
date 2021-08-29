import { ICreatePostRequest } from '../entities/request/CreatePostRequest'
import { postItemDatasource } from '../sources/datasource/postitem-datasource'
import { IPostItem } from '../entities/post-item';
import { IUpdatePostRequest } from '../entities/request/UpdatePostRequest';
import { createImageUrl } from './attachmentUtils';

/**
 *
 * @returns
 */
export const getAll = async (): Promise<IPostItem[]> => {
    try {
        return await postItemDatasource.getAll();
    } catch (error) {
        console.log('getAll.error', error);
        throw error;
    }
};

/**
 *
 * @param postId
 * @returns
 */
export const getPost = async (postId: string): Promise<IPostItem> => {
    try {
        return await postItemDatasource.getByPostId(postId);
    } catch (error) {
        console.log('getPost.error', error);
    }
};

/**
 *
 * @param requestNewPost
 * @param userId
 * @returns
 */
export const createPost = async (requestNewPost: ICreatePostRequest, userId: string): Promise<any> => {
    try {
        const reWhiteSpace = new RegExp(/^(?!\s+$)[A-Za-zăâîșțĂÂÎȘȚ\s-]+$/);

        if (!reWhiteSpace.test(requestNewPost.description)) throw new Error('Name and duedate is requered.');

        const post: IPostItem = {
            description: requestNewPost.description,
            userId,
        };

        const {signedUrl, url } = createImageUrl();

        post.attachmentUrl = url;
        
        const newPost = await postItemDatasource.create(post);
        
        return {
            newItem: newPost,
            uploadUrl: signedUrl
        };

    } catch (error) {
        console.log('createPost.error', error);
    }
};

/**
 *
 * @param postId
 * @param postToUpdate
 * @returns
 */
export const updatePost = async (postId: string, postToUpdate: IUpdatePostRequest, userId: string): Promise<IPostItem> => {
    try {
        const post: IPostItem = {
            description: postToUpdate.description,
        };

        return await postItemDatasource.update(postId, userId, post);
    } catch (error) {
        console.log('updatePost.error', error);
    }
};

/**
 *
 * @param id
 * @returns
 */
export const deletePost = async (postId: string, userId: string): Promise<boolean> => {
    try {
        return await postItemDatasource.delete(postId, userId);
    } catch (error) {
        console.log('deletePost.error', error);
    }
};

/**
 *
 * @param postId
 * @param postToUpdate
 * @returns
 */
export const updateUrl = async (postId: string, userId: string, attachmentUrl: string): Promise<IPostItem> => {
    try {
        return await postItemDatasource.update(postId, userId, { attachmentUrl });
    } catch (error) {
        console.log('updateUrl.error', error);
    }
};
