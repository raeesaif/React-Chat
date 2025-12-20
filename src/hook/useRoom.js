import { useMutation } from "@tanstack/react-query";
import { roomAPI } from "../api/room";

export const useCreateRoom = () => {
    return useMutation({
        mutationFn: roomAPI.createRoom,
    });
};
export const useJoinRoom = () => {
    return useMutation({
        mutationFn: roomAPI.joinRoom,
    });
};
export const useGetMyRooms = () => {
    return useQuery({
        queryKey: ["my-rooms"],
        queryFn: roomAPI.getMyRooms,
    });
};