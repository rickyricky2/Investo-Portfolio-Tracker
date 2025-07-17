export interface loginFormData{
    email: string;
    password: string;
    rememberMe?: string;
}

export interface ActionResponse{
    success: boolean;
    message: string;
    errors?: Partial<{
        [X in keyof loginFormData]: string[];
    }>;
    inputs?: Partial<loginFormData>;
}