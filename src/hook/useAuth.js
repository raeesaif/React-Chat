import { useMutation, useQuery } from "@tanstack/react-query";
import { authAPI } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSignup = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authAPI.signup,
        onSuccess: (res) => {
            toast.success(res?.message || "Signup successful! Please verify your email.");
            navigate("/login");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Signup failed. Please try again.");
        }
    });
};

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authAPI.login,
        onSuccess: (res) => {
            if (res.data?.user?.id) {
                localStorage.setItem("userId", res.data.user.id);
            }
            toast.success(res?.message || "Login successful!");
            navigate("/");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Invalid credentials.");
        }
    });
};

export const useLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authAPI.logout,
        onSuccess: (res) => {
            toast.success(res?.message || "Logout successful!");
            navigate("/login");
        }
    });
};

export const useGetUser = () => {
    return useQuery({
        queryKey: ["auth-user"],
        queryFn: async () => {
            try {
                const res = await authAPI.getUser();
                return res.data;
            } catch (error) {
                throw error;
            }
        },
        retry: false,
    });
};