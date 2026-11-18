/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Star = {
    id: number;
    name: string;
    catalog_id: string;
    distance_kpc: string;
    velocity_kms: number;
    status: string;
    description: string;
    image_url: string;
    video_url: string;
    likes_count: number;
    is_owner: Star.is_owner;
    is_liked: Star.is_liked;
};
export namespace Star {
    export enum is_owner {
        '_0' = 0,
        '_1' = 1,
    }
    export enum is_liked {
        '_0' = 0,
        '_1' = 1,
    }
}

