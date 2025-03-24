export interface EventAttributes {
    id?: number;
    name: string;
    description: string;
    type: string;
    payload: string;
    timestamp?: Date;
}