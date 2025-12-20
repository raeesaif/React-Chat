import { useEffect, useState, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { Image, X, Trash2, MoreVertical } from "lucide-react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { roomAPI } from "../api/room";
import { BeatLoader } from "react-spinners";
import { supabase } from "../supabase/supabase";


const ChatPage = () => {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();


    const name = localStorage.getItem("userName");
    const room = localStorage.getItem("roomName");
    const roomId = localStorage.getItem("roomId");
    const userId = localStorage.getItem("userId");

    // Helper to format date separators
    const formatDateSeparator = (date) => {
        const today = new Date();
        const msgDate = new Date(date);
        const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(msg => {
            const date = new Date(msg.created_at || Date.now()).toDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(msg);
        });
        return groups;
    };

    // ✅ Helper function to render message content
    const renderMessage = (msg) => {
        if (msg.deleted) {
            return (
                <p className="italic text-white flex items-center gap-2">
                    <Trash2 size={14} />
                    This message was deleted
                </p>
            );
        }
        if (msg.message_type === 'image') {
            return (
                <img
                    src={msg.image_url}
                    alt="Shared image"
                    className="max-w-full rounded-lg cursor-pointer"
                    onClick={() => window.open(msg.image_url, '_blank')}
                />
            );
        }
        return <p>{msg.message}</p>;
    };

    useEffect(() => {
        if (!name || !room || !roomId) return;

        // Rejoin room on page load/refresh
        socket.emit("join-room", { roomId, name });

        // Load message history
        roomAPI.getMessages(roomId).then(({ messages }) => {
            if (messages && messages.length > 0) {
                const formattedMessages = messages.map(msg => ({
                    id: msg.id,
                    name: msg.sender_id === userId ? "You" : "User",
                    message: msg.message,
                    image_url: msg.image_url,
                    message_type: msg.message_type || 'text',
                    created_at: msg.created_at,
                    time: new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isOwn: msg.sender_id === userId,
                    type: "message",
                }));
                setChat(formattedMessages);
            }
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        });


        // ✅ Listen for server notifications
        const handleNotification = (msg) => {
            console.log("📢 Notification received:", msg);
            setChat((prev) => [
                ...prev,
                { type: "notification", message: msg, id: Date.now() },
            ]);
        };

        // ✅ Listen for new messages from others
        const handleReceiveMessage = ({ senderName, message: receivedMessage, imageUrl, messageType }) => {
            console.log("💬 Received:", senderName, receivedMessage);
            const isOwn = senderName === name;
            setChat((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    name: isOwn ? "You" : senderName,
                    message: receivedMessage,
                    image_url: imageUrl,
                    message_type: messageType || 'text',
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isOwn,
                    type: "message",
                },
            ]);
        };

        // ✅ Listen for typing indicator
        const handleUserTyping = ({ name: typingUser }) => {
            if (typingUser !== name) {
                setIsTyping(true);
            }
        };

        const handleUserStopTyping = () => {
            setIsTyping(false);
        };

        // Handle message deletion
        const handleMessageDeleted = ({ messageId }) => {
            setChat(prev => prev.map(msg =>
                msg.id === messageId ? { ...msg, deleted: true, message: 'This message was deleted' } : msg
            ));
        };

        // ✅ Track online/offline status
        const handleConnect = () => setIsOnline(true);
        const handleDisconnect = () => setIsOnline(false);

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        // ✅ Attach socket listeners
        socket.on("notification", handleNotification);
        socket.on("receive-message", handleReceiveMessage);
        socket.on("message-deleted", handleMessageDeleted);
        socket.on("user-typing", handleUserTyping);
        socket.on("user-stop-typing", handleUserStopTyping);


        // ✅ Cleanup on unmount to prevent duplicates
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("notification", handleNotification);
            socket.off("receive-message", handleReceiveMessage);
            socket.off("message-deleted", handleMessageDeleted);
            socket.off("user-typing", handleUserTyping);
            socket.off("user-stop-typing", handleUserStopTyping);
        };
    }, [name, room]);

    const handleLeaveRoom = () => {
        localStorage.removeItem("roomName");
        localStorage.removeItem("userName");
        localStorage.removeItem("roomId");
        socket.emit("leave-room", { room: roomId, name });
        navigate("/");
    }

    // Handle typing
    const handleTyping = (e) => {
        const value = e.target.value;
        setMessage(value);

        if (value.trim()) {
            socket.emit("typing", { roomId, name });
        }

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            socket.emit("stop-typing", { roomId });
        }, 1000);

        setTypingTimeout(timeout);
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Upload image to Supabase
    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `chat-images/${fileName}`;

        const { data, error } = await supabase.storage
            .from('chat-media')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('chat-media')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    // Delete message
    const deleteMessage = (messageId) => {
        socket.emit("delete-message", { roomId, messageId, userId });
        setChat(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, deleted: true, message: 'This message was deleted' } : msg
        ));
    };

    // ✅ Send message function
    const sendMessage = async (e) => {
        e.preventDefault();

        if (selectedImage) {
            setUploading(true);
            try {
                const imageUrl = await uploadImage(selectedImage);
                socket.emit("stop-typing", { roomId });
                socket.emit("send-message", {
                    roomId,
                    senderId: userId,
                    senderName: name,
                    message: message.trim() || 'Image',
                    imageUrl,
                    messageType: 'image'
                });
                removeImage();
                setMessage("");
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Failed to upload image');
            } finally {
                setUploading(false);
            }
        } else if (message.trim()) {
            socket.emit("stop-typing", { roomId });
            socket.emit("send-message", { roomId, senderId: userId, senderName: name, message });
            setMessage("");
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Talkify</h1>
                        <p className="text-purple-200 text-sm">Room {room} User {name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleLeaveRoom} className="bg-pink-800/30 backdrop-blur-md px-3 py-1 rounded-full text-white animate-bounce cursor-pointer">Leave</button>
                        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                        <span className="text-white text-sm">{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    // Skeleton Loader
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-start">
                            <div className="bg-white/10 rounded-2xl px-4 py-3 w-64 animate-pulse">
                                <div className="h-3 bg-white/20 rounded w-20 mb-2"></div>
                                <div className="h-4 bg-white/20 rounded w-full mb-1"></div>
                                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    Object.entries(groupMessagesByDate(chat)).map(([date, messages]) => (
                        <div key={date}>
                            {/* Date Separator */}
                            <div className="flex justify-center my-4">
                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-purple-200">
                                    {formatDateSeparator(date)}
                                </span>
                            </div>
                            {/* Messages */}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} mb-2 group`}
                                >
                                    <div className="relative">
                                        {/* Message bubble */}
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-3 break-words rounded-2xl ${msg.isOwn
                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                : "bg-white/20 backdrop-blur-md text-white border border-white/30"
                                                }`}
                                        >
                                            {/* Three-dot menu inside bubble - top right */}
                                            {msg.isOwn && !msg.deleted && (
                                                <div className="absolute top-2 right-2">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)}
                                                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 rounded"
                                                    >
                                                        <MoreVertical size={14} />
                                                    </button>
                                                    {/* Dropdown menu */}
                                                    {openMenuId === msg.id && (
                                                        <div className="absolute right-0 top-6 bg-gray-800 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                                            <button
                                                                onClick={() => {
                                                                    deleteMessage(msg.id);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2 text-sm"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {!msg.isOwn && (
                                                <p className="text-xs font-semibold mb-1 text-purple-200">
                                                    {msg.name}
                                                </p>
                                            )}
                                            {renderMessage(msg)}
                                            <p className={`text-xs mt-1 ${msg.isOwn ? "text-purple-100" : "text-gray-300"}`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Typing Indicator */}
            {isTyping && (
                <div className="px-4 py-2">
                    <div className="flex items-center space-x-2 text-purple-200 text-sm">
                        <span>Typing</span>
                        <BeatLoader color="#c084fc" size={8} />
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/20">
                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-3 relative inline-block">
                        <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <form onSubmit={sendMessage} className="flex items-center space-x-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                    >
                        <Image size={20} />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={handleTyping}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={(!message.trim() && !selectedImage) || uploading}
                        className={`p-3 rounded-full transition-all duration-200 ${(message.trim() || selectedImage) && !uploading
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 cursor-pointer"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {uploading ? <BeatLoader color="#fff" size={8} /> : <AiOutlineSend className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
