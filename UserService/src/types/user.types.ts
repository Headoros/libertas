export interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    oauth_provider: string;
    oauth_id: string;
    createdAt: Date;
    updatedAt: Date;
}