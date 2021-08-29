import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { postItemDatasource } from '../sources/datasource/postitem-datasource'
import { updateUrl } from './posts'
import * as uuid from 'uuid'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

/**
 * 
 * @param postId 
 * @returns 
 */
export const createImage = async (postId: string, userId: string) => {
    try {
        const validPostId = await postExists(postId);
    
        if (!validPostId) return { error: 'Post does not exist!' };
    
        const imageId = uuid.v4();
    
        console.log('imageId:uuid:', imageId);
    
        const newItem = await setImageUrl(postId, userId, imageId);
    
        console.log('newItem::', newItem);
    
        const url = getUploadUrl(imageId);
    
        return {
            newItem: newItem,
            uploadUrl: url
        }
    } catch (error) {
        console.log('createImage.error', error);
    }
}

/**
 * 
 * @param postId 
 * @returns 
 */
async function postExists(postId: string) {
    console.log('Get post1: ', postId)

    const result = await postItemDatasource.getByPostId(postId);

    console.log('Get post: ', result)

    return !!result
}

/**
 * 
 * @param postId 
 * @param imageId 
 * @param event 
 * @returns 
 */
async function setImageUrl(postId: string, userId: string, imageId: string) {

    return await updateUrl(postId, userId, `https://${bucketName}.s3.amazonaws.com/${imageId}`);
}

/**
 * 
 * @returns 
 */
export const createImageUrl = () => {

    const imageId = uuid.v4();
    const signedUrl = getUploadUrl(imageId);

    return { signedUrl, url: `https://${bucketName}.s3.amazonaws.com/${imageId}` };
}

/**
 * 
 * @param imageId 
 * @returns 
 */
function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: +urlExpiration
    })
}
