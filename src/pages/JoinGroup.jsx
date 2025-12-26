// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../socket.js";
// import { PrivateChatSchema } from "../schema/authschema";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ArrowBigLeft } from "lucide-react";

// const INITIAL_VALUE = {
//     name: "",
//     roomName: "",
// }


// const JoinGroup = () => {
//     const navigate = useNavigate();

//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors }
//     } = useForm({
//         resolver: zodResolver(PrivateChatSchema),
//         defaultValues: INITIAL_VALUE
//     });

//     // Handle Join / Create Room
//     const onSubmit = (data) => {
//         const { name, roomName } = data;
//         reset()

//         socket.emit("join-room", {
//             room: roomName,
//             name,
//         });

//         localStorage.setItem("userName", name);
//         localStorage.setItem("roomName", roomName);

//         navigate("/chat");
//     };


//     return (
//         <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex flex-col" >
//             <div className="p-7">
//                 <button onClick={() => navigate("/")} className="text-white bg-purple-400 hover:bg-purple-600 rounded-lg py-2 px-3 cursor-pointer" >
//                     <ArrowBigLeft />
//                 </button>
//             </div>
//             <div className="flex-1 flex  items-center justify-center p-5">
//                 <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 w-96 text-center">
//                     <div className="mb-6">
//                         <h1 className="text-4xl font-bold text-white mb-2">Talkify</h1>
//                         <p className="text-purple-200 text-sm">Connecting hearts and minds</p>
//                         <div className="flex items-center justify-center space-x-2 mt-3">
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                             <span className="text-white text-xs">Ready to connect</span>
//                         </div>
//                     </div>

//                     <form onSubmit={handleSubmit(onSubmit)} >
//                         <div className="flex flex-col gap-4">
//                             <input
//                                 type="text"
//                                 {...register("name")}
//                                 placeholder="Enter your name"
//                                 className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
//                             />
//                             {errors.name && <p className="flex justify-start text-red-400" >{errors.name.message}</p>}
//                             <input
//                                 type="text"
//                                 {...register("roomName")}
//                                 placeholder="Enter your room name"
//                                 className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
//                             />
//                             {errors.roomName && <p className="flex justify-start text-red-400" >{errors.roomName.message}</p>}
//                             <div className="flex justify-center items-center gap-4">
//                                 {/* Create Room Button */}
//                                 <button
//                                     type="submit"
//                                     onClick={() => handleJoinorCreateRoom("create")}
//                                     className="py-3 px-8 rounded-full transition-all duration-200 font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 cursor-pointer"
//                                 >
//                                     Create Room
//                                 </button>

//                                 {/* Join Room Button */}
//                                 <button
//                                     type="submit"
//                                     onClick={() => handleJoinorCreateRoom("join")}
//                                     className="py-3 px-8 rounded-full transition-all duration-200 font-medium  bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 cursor-pointer"
//                                 >
//                                     Join Room
//                                 </button>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JoinGroup;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import { PrivateChatSchema } from "../schema/authschema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeft } from "lucide-react";
import { useCreateRoom, useJoinRoom } from "../hook/useRoom.js";
import CircularProgress from '@mui/material/CircularProgress';

const INITIAL_VALUE = {
    name: "",
    roomName: "",
}

const JoinGroup = () => {
    const navigate = useNavigate();
    const [action, setAction] = useState(null);

    const createRoom = useCreateRoom();
    const joinRoom = useJoinRoom();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(PrivateChatSchema),
        defaultValues: INITIAL_VALUE
    });

    const onSubmit = (data) => {
        const { name, roomName } = data;

        localStorage.setItem("userName", name);

        if (action === "create") {
            createRoom.mutate(
                { roomName, isPrivate: false },
                {
                    onSuccess: (res) => {
                        localStorage.setItem("roomId", res.room.id);
                        localStorage.setItem("roomName", roomName);
                        reset();
                        navigate("/chat");
                    }
                }
            );
        }

        if (action === "join") {
            joinRoom.mutate(roomName, {
                onSuccess: (res) => {
                    localStorage.setItem("roomId", res.roomId);
                    localStorage.setItem("roomName", roomName);
                    reset();
                    navigate("/chat");
                }
            });
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex flex-col">
            <div className="p-7">
                <button onClick={() => navigate("/")} className="text-white bg-purple-400 hover:bg-purple-600 rounded-lg py-2 px-3 cursor-pointer">
                    <ArrowBigLeft />
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 w-96 text-center">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-white mb-2">Talkify</h1>
                        <p className="text-purple-200 text-sm">Connecting hearts and minds</p>
                        <div className="flex items-center justify-center space-x-2 mt-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs">Ready to connect</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="Enter your name"
                                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                            {errors.name && <p className="flex justify-start text-red-400">{errors.name.message}</p>}
                            <input
                                type="text"
                                {...register("roomName")}
                                placeholder="Enter your room name"
                                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                            {errors.roomName && <p className="flex justify-start text-red-400">{errors.roomName.message}</p>}
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    type="submit"
                                    onClick={() => setAction("create")}
                                    disabled={createRoom.isPending || joinRoom.isPending}
                                    className="py-3 px-8 rounded-full transition-all duration-200 font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {createRoom.isPending && action === "create" ? (
                                        <>
                                            <CircularProgress size={18} color="inherit" />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        "Create Room"
                                    )}
                                </button>

                                <button
                                    type="submit"
                                    onClick={() => setAction("join")}
                                    disabled={createRoom.isPending || joinRoom.isPending}
                                    className="py-3 px-8 rounded-full transition-all duration-200 font-medium bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {joinRoom.isPending && action === "join" ? (
                                        <>
                                            <CircularProgress size={18} color="inherit" />
                                            <span>Joining...</span>
                                        </>
                                    ) : (
                                        "Join Room"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinGroup;
