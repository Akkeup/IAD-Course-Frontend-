/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthRequest } from '../models/AuthRequest';
import type { AuthResponse } from '../models/AuthResponse';
import type { PublishRequest } from '../models/PublishRequest';
import type { Star } from '../models/Star';
import type { StarsList } from '../models/StarsList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * @param distanceKpc
     * @param page
     * @returns StarsList Published stars
     * @throws ApiError
     */
    public static listStars(
        distanceKpc?: string,
        page?: number,
    ): CancelablePromise<StarsList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/andromeda-stars',
            query: {
                'distance_kpc': distanceKpc,
                'page': page,
            },
        });
    }
    /**
     * @param formData
     * @returns any Draft created
     * @throws ApiError
     */
    public static createStar(
        formData: {
            name: string;
            image: Blob;
            video: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/andromeda-stars',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @returns Star Current draft
     * @throws ApiError
     */
    public static getDraft(): CancelablePromise<Star> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/andromeda-stars/draft',
        });
    }
    /**
     * @param id
     * @param next
     * @returns Star Feed card
     * @throws ApiError
     */
    public static getFeed(
        id?: number,
        next?: boolean,
    ): CancelablePromise<Star> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/andromeda-stars/feed',
            query: {
                'id': id,
                'next': next,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static publishStar(
        id: number,
        requestBody: PublishRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/andromeda-stars/{id}/publish',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteStar(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/andromeda-stars/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static likeStar(
        id: number,
        requestBody: {
            value: 0 | 1;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/andromeda-stars/{id}/like',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Registered
     * @throws ApiError
     */
    public static registerUser(
        requestBody: AuthRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AuthResponse Authenticated
     * @throws ApiError
     */
    public static login(
        requestBody: AuthRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public static logout(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
        });
    }
}
