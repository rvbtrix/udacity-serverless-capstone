import { IUser } from '../../entities/user';
import { UserModel } from '../models/user-model';

interface IUserDatasourse {
    getAll(): Promise<IUser[]>;
    getByUserId(userId: string): Promise<IUser>;
    create(user: IUser): Promise<IUser>;
    update(userId: string, user: Partial<IUser>);
}

class UserDatasource implements IUserDatasourse {
    public getAll = async (): Promise<IUser[]> => {
        const response = await UserModel.scan()
            .all()
            .exec();

        return (response.toJSON() as unknown) as Promise<IUser[]>;
    };

    public getByUserId = async (userId: string): Promise<IUser> => {
        const response = await UserModel
            .query({ userId: { eq: userId } })
            .exec();

        const userArray = (response.toJSON() as unknown) as IUser[];

        return (userArray.length > 0) ? userArray[0] : undefined;
    }

    public create = async (user: IUser) => UserModel.create(user);

    public update = async (userId: string, user: Partial<IUser>) => UserModel.update({ userId }, user);

    public delete = async (userId: string) => UserModel.delete({ userId });
}

export const userDatasource: IUserDatasourse = new UserDatasource();
