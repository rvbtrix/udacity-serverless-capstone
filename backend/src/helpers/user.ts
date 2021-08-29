import { IUserRequest } from '../entities/request/UserRequest';
import { IUser } from '../entities/user';
import { userDatasource } from '../sources/datasource/user-datasource';
import * as emailValidator from 'email-validator';

/**
 *
 * @param userId
 * @returns
 */
export const getUser = async (userId: string): Promise<IUser> => {
    try {
        return await userDatasource.getByUserId(userId);
    } catch (error) {
        console.log('getPost.error', error);
    }
};

/**
 *
 * @param requestNewPost
 * @returns
 */
export const updateUserProfile = async (userRequest: IUserRequest, userId: string): Promise<any> => {
    try {
        console.log('user', userId);

        if(!emailValidator.validate(userRequest.email)) throw 'Invalid Email';

        const user = await userDatasource.getByUserId(userId);
        
        if (user){
            const updateUser: IUser = {
                ...userRequest,
            };

            console.log('user', JSON.stringify(updateUser));
    
            return await userDatasource.update(userId, updateUser);
        }
        else {
            const createUser: IUser = {
                ...userRequest,
                userId,
            };
    
            return await userDatasource.create(createUser);
        }
    } catch (error) {
        console.log('User.error', error);
    }
};

