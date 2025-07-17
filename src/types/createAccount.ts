export interface CreateAccountFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    terms: string;
}

export interface ActionResponse{
    success: boolean;
    message: string;
    errors?: {
        [X in keyof CreateAccountFormData]?: string[];
    };
    inputs?: Partial<CreateAccountFormData>;
}