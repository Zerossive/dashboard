import { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context";
import Button from "./Button";
import UserPopup from "./UserPopup";

const Navbar = () => {
    const { settings, user, isMobile } = useGlobalContext();

    const [showUserPopup, setShowUserPopup] = useState(false);

    const navRef = useRef(null);
    const userButton = useRef(null);

    const location = useLocation().pathname.toLowerCase();

    // Scroll direction capturing
    const [scroll1, setScroll1] = useState(0);
    const [scroll2, setScroll2] = useState(0);
    const [scrollWait, setScrollWait] = useState(false);
    const [scrollingUp, setScrollingUp] = useState(true);
    window.onscroll = () => {
        if (!scrollWait) {
            isMobile ? setScroll1(window.scrollY) : setScroll2(window.scrollY);

            setScrollWait(true);
            setTimeout(() => {
                isMobile
                    ? setScroll2(window.scrollY)
                    : setScroll1(window.scrollY);
                setScrollWait(false);
                // On scroll down
                scroll2 - scroll1 < 0 && setScrollingUp(true);
                // On scroll up
                scroll2 - scroll1 > 0 && setScrollingUp(false);
                // Backup check if at top
                window.scrollY === 0 && setScrollingUp(true);

                // Slide navbar in and out of frame
                if (
                    scrollingUp ||
                    !document.documentElement.scrollTop ||
                    (!scrollingUp && !isMobile)
                ) {
                    navRef.current.classList.remove("-translate-y-16");
                } else {
                    navRef.current.classList.add("-translate-y-16");
                }
            }, 100);
        }
    };

    return (
        <nav
            className='bg-foreground flex content-center gap-3 p-3 h-16 sticky top-0 z-50 drop-shadow-lg duration-75 origin-top'
            ref={navRef}
        >
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
