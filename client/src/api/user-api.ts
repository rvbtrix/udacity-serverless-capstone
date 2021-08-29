import { apiEndpoint } from '../config'
import { Post } from '../types/Post';
import { CreatePostRequest } from '../types/CreatePostRequest';
import Axios from 'axios'
import { UpdatePostRequest } from '../types/UpdatePostRequest';
import { UserProfileRequest } from '../types/UserProfileRequest';
import { User } from '../types/User';

export async function getUser(idToken: string): Promise<User> {
  console.log('Fetching posts')

  const response = await Axios.get(`${apiEndpoint}/users`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('User:', response.data)
  return response.data
}

export async function saveUserProfile(
  idToken: string,
  userProfile: UserProfileRequest
): Promise<User> {
  const response = await Axios.put(`${apiEndpoint}/users`,  JSON.stringify(userProfile), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}
