import { signOut } from "firebase/auth";
import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../context";
import Button from "./Button";
import { auth } from "../firebase-config";
import { FaCog, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function UserPopup({ userButton, showUserPopup, setShowUserPopup }) {
    const { user, setNotes, setSettings } = useGlobalContext();

    // Handle closing popup on clicking outside of component
    const popup = useRef(null);
    const handleClickOutside = (event) => {
        if (
            popup.current &&
            !popup.current.contains(event.target) &&
            !userButton.current.contains(event.target)
        ) {
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
            className={`flex flex-wrap flex-col p-6 gap-6 bg-accent drop-shadow-lg w-max rounded-md absolute top-16 right-0 z-50 animate-growY`}
            ref={popup}
        >
            <div>
                <p>Signed in as</p>
                <p className='font-bold'>{user.email}</p>
            </div>
            <Button onClick={logout}>
                <FaSignInAlt />
                Sign Out
            </Button>
            <Link to='/settings' className='flex flex-col'>
                <Button onClick={() => setShowUserPopup(false)}>
                    <FaCog />
                    Settings
                </Button>
            </Link>
        </div>
    );
}

export default UserPopup;
