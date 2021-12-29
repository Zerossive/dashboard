import { signOut } from "firebase/auth";
import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../context";
import Button from "./Button";
import { auth } from "../firebase-config";

function UserPopup({ navbarHeight, setShowUserPopup }) {
    const { user, setNotes, setSettings } = useGlobalContext();

    // Handle closing popup on clicking outside of component
    const popup = useRef(null);
    const handleClickOutside = (event) => {
        if (popup.current && !popup.current.contains(event.target)) {
            setShowUserPopup(false);
        }
    };
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    const logout = async () => {
        await signOut(auth);
        setNotes({});
        setSettings({});
        setShowUserPopup(false);
    };

    return (
        <div
            className={`flex flex-wrap flex-col bg-midground shadow-lg p-3 w-max rounded-md absolute top-16 right-0 z-50 animate-growY`}
            ref={popup}
        >
            <h1 className='p-3'>{user.email}</h1>
            <Button onClick={logout}>Log Out</Button>
        </div>
    );
}

export default UserPopup;
