export interface GenericResponse<T> {
    is_success: boolean;
    message: string;
    data: T;
    errors?: any[];
}

export interface HTTPValidationError {
    detail: {
        loc: string[];
        msg: string;
        type: string;
    }[];
} 