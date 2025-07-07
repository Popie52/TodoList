import { useMutation } from '@tanstack/react-query';
import authService from '../services/auth.js';

export const useSignUp = () => {
    return useMutation({
        mutationFn: authService.signup,
    })
}

export const useLogin = () => {
    return useMutation({
        mutationFn: authService.login,
    })
}
