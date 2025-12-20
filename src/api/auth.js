import api from "./axiosInstance"
import { supabase } from "../supabase/supabase"

export const authAPI = {
    signup: async (playload) => {
        const { data } = await api.post("/auth/signup", playload)
        return data
    },
    login: async (playload) => {
        const { data } = await api.post("/auth/login", playload)
        // Set session in Supabase client
        if (data.data?.session) {
            await supabase.auth.setSession(data.data.session)
        }
        return data
    },
    logout: async () => {
        const { data } = await api.post("/auth/logout")
        // Clear session from Supabase client
        await supabase.auth.signOut()
        return data
    },
    getUser: async () => {
        const { data } = await api.get("/auth/get-user");
        return data;
    }
}
