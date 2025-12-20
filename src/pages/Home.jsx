import { MessageCircle, Users, Sparkles, ArrowRight, LogOut } from "lucide-react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useLogout } from "../hook/useAuth";
import { useGetUser } from "../hook/useAuth";

import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
const Home = () => {

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);


    const { mutate: logout } = useLogout()
    const { data: user, isLoading } = useGetUser();

    const handleProtectedRoute = (route) => {
        if (!user) {
            setShowModal(true);   // modal show karo
            return;
        }
        navigate(route); // agar login hai → page open
    };


    return (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex flex-col" >
            <div className="flex justify-end items-center gap-3 p-5 text-3xl ">
                <div className="flex items-center gap-2">
                    <Avatar className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" >{user?.user_metadata?.name?.charAt(0)?.toUpperCase()}</Avatar>
                    <span className="text-white font-bold text-lg">{user?.user_metadata?.name || 'User'}</span>
                </div>

                <Tooltip title="Logout" >
                    <button onClick={() => logout()} className=" text-white font-bold cursor-pointer " ><LogOut /></button>
                </Tooltip>
            </div>
            <div className="  flex-1 flex  items-center justify-center p-4">

                <main className="max-w-6xl w-full">
                    {/* Hero Section */}
                    <section className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center justify-center space-x-2 mb-6">
                            <div className="w-3 h-3 bg-[hsl(var(--status-online))] rounded-full animate-pulse"></div>
                            <span className="text-foreground text-sm font-medium text-green-400 animate-pulse "><MessageCircle /></span>
                            <span className="text-foreground text-sm font-medium text-white">Ready to connect</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold text-foreground text-white mb-4 tracking-tight">
                            Talkify
                        </h1>

                        <div className="group text-purple-300">
                            <p className="group-[&_*]:text-inherit text-lg md:text-xl mb-2">
                                Connecting hearts and minds
                            </p>

                            <p className="group-[&_*]:text-inherit text-sm md:text-base max-w-2xl mx-auto">
                                Choose your way to connect: create private rooms for intimate conversations or join the global chat to meet new people
                            </p>
                        </div>

                    </section>

                    {/* Feature Cards */}
                    <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Create Room Card */}
                        <article className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-purple-600 rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform duration-300 animate-fade-in cursor-pointer">
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <MessageCircle className="w-7 h-7 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2 text-purple-500">Create Your Room</h2>
                                <p className="text-purple-300 text-sm">
                                    Start a private space for you and your friends. Control who joins and keep conversations intimate and secure.
                                </p>
                            </div>

                            <ul className="space-y-2 mb-6 text-sm text-purple-300">
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Private & secure rooms
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Invite-only access
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Customizable settings
                                </li>
                            </ul>

                            {/* ✅ Tailwind overrides MUI */}
                            <Button
                                variant="contained"
                                disableElevation
                                className="!w-full !bg-purple-500  hover:!bg-purple-500/90 !text-primary-foreground group !rounded-xl"
                                onClick={() => handleProtectedRoute("/room-chat")}
                            >
                                Create Room
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </article>

                        {/* Open Chat Card */}
                        <article className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-pink-400 rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform duration-300 animate-fade-in [animation-delay:150ms] cursor-pointer">
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Users className="w-7 h-7 text-pink-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-pink-500 mb-2">Join Open Chat</h2>
                                <p className="text-purple-300 text-sm">
                                    Connect with people from around the world. Share ideas, make friends, and explore diverse conversations.
                                </p>
                            </div>

                            <ul className="space-y-2 mb-6 text-sm text-purple-300">
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                    Global community
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                    Meet new people
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                    Real-time conversations
                                </li>
                            </ul>

                            {/* ✅ Tailwind overrides again */}
                            <Button
                                variant="contained"
                                disableElevation
                                className="!w-full !bg-pink-500 hover:!bg-pink-500/90  group !rounded-xl"
                                onClick={() => handleProtectedRoute("/open-chat")}
                            >
                                Join Open Chat
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </article>
                    </section>

                    {/* Footer Status */}
                    <footer className="text-center mt-12 animate-fade-in [animation-delay:300ms]">
                        <p className="text-white/60 text-xs">
                            Safe, secure, and always online
                        </p>
                    </footer>
                </main>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-80 text-center">
                        <h2 className="text-xl font-bold mb-3 text-black">
                            Account Required
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Please sign up or login to start chatting.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                className="!bg-purple-600 hover:!bg-purple-800  !text-white !w-full !rounded-lg "
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </Button>
                            <Button
                                className="!bg-gray-300 hover:!bg-gray-600 hover:!text-white !text-black !w-full !rounded-lg"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
