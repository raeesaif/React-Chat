import api from "./axiosInstance";

export const roomAPI = {
    createRoom: async (payload) => {
        const { data } = await api.post("/room/create", payload);
        return data;
    },

    joinRoom: async (roomName) => {
        const { data } = await api.post("/room/join", { roomName });
        return data;
    },

    getMyRooms: async () => {
        const { data } = await api.get("/room/my-rooms");
        return data;
    },

    getRoomMembers: async (roomId) => {
        const { data } = await api.get(`/room/${roomId}/members`);
        return data;
    },

    getMessages: async (roomId) => {
        const { data } = await api.get(`/room/${roomId}/messages`);
        return data;
    }
};
