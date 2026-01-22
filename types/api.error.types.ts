export type ApiError = {
    message?: string;
    code?: number;
    response?: {
        data?: {
            message?: string;
            code?: number;
        };
    };
};