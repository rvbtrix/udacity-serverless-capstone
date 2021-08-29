import { IPostItem } from '../../entities/post-item';
import { PostItemModel } from '../models/postitem-model';

interface IPostItemDatasourse {
    getAll(): Promise<IPostItem[]>;
    getByPostId(postId: string): Promise<IPostItem>;
    getByUserId(userId: string): Promise<IPostItem[]>;
    create(postItem: IPostItem): Promise<IPostItem>;
    update(postId: string, userId: string, postItem: Partial<IPostItem>);
    delete(postId: string, userId: string);
}

class PostItemDatasource implements IPostItemDatasourse {
    public getAll = async (): Promise<IPostItem[]> => {
        const response = await PostItemModel.scan()
            .all()
            .exec();

        return (response.toJSON() as unknown) as Promise<IPostItem[]>;
    };

    public getByUserId = async (userId: string): Promise<IPostItem[]> => {
        const response = await PostItemModel
            .query({ userId: { eq: userId } })
            .exec();

        return (response.toJSON() as unknown) as Promise<IPostItem[]>;
    }

    public getByPostId = async (postId: string) => {
        const response = await PostItemModel
            .query({ postId: { eq: postId } })
            .exec();

        const postArray = (response.toJSON() as unknown) as IPostItem[];

        return (postArray.length > 0) ? postArray[0] : undefined;
    };

    public create = async (postItem: IPostItem) => PostItemModel.create(postItem);

    public update = async (postId: string, userId: string, postItem: Partial<IPostItem>) => PostItemModel.update({ postId, userId, }, postItem);

    public delete = async (postId: string, userId: string) => PostItemModel.delete({ postId, userId, });
}

export const postItemDatasource: IPostItemDatasourse = new PostItemDatasource();
