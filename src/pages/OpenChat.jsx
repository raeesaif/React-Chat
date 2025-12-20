import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OpenChatSchema } from "../schema/authschema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeft } from "lucide-react";
import { socket } from "../socket.js";
const INITIAL_VALUES = {
    name: ""
}


const OpenChat = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(OpenChatSchema),
        defaultValues: INITIAL_VALUES,
    })

    const onSubmit = (data) => {
        localStorage.setItem("userName", data?.name);
        localStorage.setItem("roomName", "Open Chat");
        localStorage.setItem("roomId", "open-chat-room");
        
        reset();
        navigate("/open-chatmessage");
    }

    return (
        <div className="min-h-screen flex flex-col  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" >
            <div className="p-7">
                <button onClick={() => navigate("/")} className="text-white bg-purple-400 hover:bg-purple-600 rounded-lg py-2 px-3 cursor-pointer" >
                    <ArrowBigLeft />
                </button>
            </div>
            <div className=" flex-1 flex  items-center justify-center">
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
                            {errors?.name && <p className="flex justify-start text-red-400" >{errors?.name?.message}</p>}
                            <button
                                type="submit"
                                className={`py-3 px-8 rounded-full transition-all duration-200 font-medium 
                                bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 cursor-pointer`}
                            >
                                Join Chat
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OpenChat;
