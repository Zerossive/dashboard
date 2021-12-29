import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import Button from "./Button";
import UserPopup from "./UserPopup";

const Navbar = () => {
    const { settings, user } = useGlobalContext();

    const navbar = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState();
    const [showUserPopup, setShowUserPopup] = useState(false);

    useEffect(() => {
        setNavbarHeight(navbar.current.clientHeight);
    }, []);

    return (
        <nav
            className='bg-foreground flex content-center gap-3 p-3 h-16'
            ref={navbar}
        >
            <Link to='/' tabIndex='-1'>
                <img
                    src={process.env.PUBLIC_URL + "/logo192.png"}
                    alt='logo'
                    className='h-full py-1 px-3'
                />
            </Link>
            <Link to='/' tabIndex='-1'>
                <Button>
                    <span
                        id='Home'
                        className='target:bg-red-300 group-hover:scale-110 duration-500'
                    >
                        Home
                    </span>
                </Button>
            </Link>
            <Link to='/Settings' tabIndex='-1'>
                <Button>Settings</Button>
            </Link>
            {/* Divider */}
            <div className='flex-grow'></div>
            <div className='relative'>
                <Button
                    height='100%'
                    classes='px-1 py-1'
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
                        navbarHeight={navbarHeight}
                        setShowUserPopup={setShowUserPopup}
                    />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
