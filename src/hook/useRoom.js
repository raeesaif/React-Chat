import { useMutation } from "@tanstack/react-query";
import { roomAPI } from "../api/room";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useCreateRoom = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: roomAPI.createRoom,
        onSuccess: (res) => {
            toast.success("Room created successfully!");
            navigate("/chat");
        },
        onError: (err) => {
            if (err.response?.status === 409) {
                toast.error("Room name already created. Please choose a unique name.");
            } else {
                toast.error(err.response?.data?.message || "Failed to create room.");
            }
        }
    });
};

export const useJoinRoom = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: roomAPI.joinRoom,
        onSuccess: (res) => {
            toast.success("Joined room successfully!");
            navigate("/chat");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to join room.");
        }
    });
};