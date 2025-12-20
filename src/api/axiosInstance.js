import axios from "axios";
import { supabase } from "../supabase/supabase";


const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

// Add Authorization header
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
},
    (error) => Promise.reject(error)
);

// Auto-refresh
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const { data, error: refreshError } =
                await supabase.auth.refreshSession();

            if (!refreshError && data?.session) {
                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${data.session.access_token}`;

                return api(original);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
