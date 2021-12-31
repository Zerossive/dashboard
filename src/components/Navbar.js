import { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context";
import Button from "./Button";
import UserPopup from "./UserPopup";

const Navbar = () => {
    const { settings, user } = useGlobalContext();

    const [showUserPopup, setShowUserPopup] = useState(false);

    const userButton = useRef(null);

    const location = useLocation().pathname.toLowerCase();

    return (
        <nav className='bg-foreground flex content-center gap-3 p-3 h-16 sticky top-0 z-50 drop-shadow-lg'>
            <Link to='/' tabIndex='-1'>
                <img
                    src={process.env.PUBLIC_URL + "/logo192.png"}
                    alt='logo'
                    className='h-full py-1 px-3 duration-75 active:scale-90'
                />
            </Link>
            <Link to='/' tabIndex='-1'>
                <Button classes={`${location === "/" && "bg-accent"}`}>
                    Home
                </Button>
            </Link>
            <Link to='/settings' tabIndex='-1'>
                <Button classes={`${location === "/settings" && "bg-accent"}`}>
                    Settings
                </Button>
            </Link>
            {/* Divider */}
            <div className='flex-grow'></div>
            <div className='relative' ref={userButton}>
                <Button
                    height='100%'
                    classes={`px-1 py-1 ${showUserPopup && "bg-accent"}`}
                    onClick={() => setShowUserPopup(!showUserPopup)}
                >
                    {!settings.profileImageUrl && (
                        <FaUser className='h-full w-auto' />
                    )}
                    {settings.profileImageUrl && (
                        <img
                            src={settings.profileImageUrl}
                            alt='user profile'
                            className='h-full rounded-lg'
                        />
                    )}
                </Button>
                {showUserPopup && user && (
                    <UserPopup
                        userButton={userButton}
                        showUserPopup={showUserPopup}
                        setShowUserPopup={setShowUserPopup}
                    />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
