import React from "react";
import { io } from 'socket.io-client';
import { UserContext } from "./UserContext ";
import { useContext, useEffect } from "react";
export const socketContext = React.createContext();
function SocketProvider({ children }) {
    const { user } = useContext(UserContext);
    const socket = io('ws://192.168.2.123:8900');
    useEffect(() => {
        if (!user._id) return
        socket.emit('addUser', user._id);
    }, [user._id]);
    return (
        <socketContext.Provider value={{ socket, currentUserId: user._id }}>
            {children}
        </socketContext.Provider>
    )
}

export default SocketProvider;