import { useEffect, useRef, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useGlobalContext } from "../context";
import Button from "../components/Button";
import ButtonInline from "../components/ButtonInline";
import { getDatabase, ref, update } from "firebase/database";
import { FaHome, FaSignInAlt, FaUser, FaUserPlus } from "react-icons/fa";
import Toggle from "../components/Toggle";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

export default function Settings() {
    const { user, setNotes, settings, setSettings } = useGlobalContext();

    const [settingsCategory, setSettingsCategory] = useState("account");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // User Profile
    const [profileImageUrl, setProfileImageUrl] = useState("");

    // Home Settings
    const [showWeather, setShowWeather] = useState(settings.showWeather);
    const [showCalendar, setShowCalendar] = useState(settings.showCalendar);
    const [showNotes, setShowNotes] = useState(settings.showNotes);

    const db = getDatabase();

    const container = useRef();
    const refPassthrough = (el) => {
        handlers.ref(el);
        container.current = el;
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Swipe Navigation
    let navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedRight: (eventData) => {
            if (
                document.activeElement === document.body &&
                Math.abs(eventData.deltaX) > 50
            ) {
                navigate("/");
            }
        },
        onSwiping: (eventData) => {
            if (
                document.activeElement === document.body &&
                eventData.dir === "Right"
            ) {
                container.current.style.transform = `translateX(${eventData.deltaX}px)`;
            }
        },
        onSwiped: () => {
            if (document.activeElement === document.body) {
                container.current.style.transform = `translateX(0px)`;
            }
        },
    });

    // Account
    const login = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setLoginEmail("");
            setLoginPassword("");
            setErrorMessage("");
            console.log("Signed in as", loginEmail);
        } catch (error) {
            setErrorMessage(error.message);
            console.log(error.message);
        }
    };
    const register = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            setErrorMessage("");
            console.log("Registered as", registerEmail);
        } catch (error) {
            setErrorMessage(error.message);
            console.log(error.message);
        }
    };
    const logout = async () => {
        await signOut(auth);
        setNotes({});
        setSettings({});
    };

    // Profile
    const handleChangeUserImage = () => {
        handleSettingsChange("profileImageUrl", profileImageUrl);
        setProfileImageUrl("");
    };

    // Notes
    const handleSettingsChange = (settingName, settingValue) => {
        setSettings({
            ...settings,
            [settingName]: settingValue,
        });
        const updates = {};
        updates["/users/" + user.uid + "/settings/" + settingName] =
            settingValue;
        update(ref(db), updates);
    };

    return (
        <div
            className='flex flex-wrap lg:flex-nowrap overflow-hidden animate-fadein'
            {...handlers}
            ref={refPassthrough}
        >
            {/* Settings Category */}
            {user && (
                <div className='bg-midground w-full lg:w-auto lg:h-[calc(100vh-4rem)] flex flex-col drop-shadow-lg'>
                    <ButtonInline
                        height='50px'
                        onClick={() => {
                            setSettingsCategory("account");
                        }}
                        classes={`lg:justify-start px-12 ${
                            settingsCategory === "account" && "bg-accent"
                        }`}
                    >
                        <FaUser />
                        Account
                    </ButtonInline>
                    <ButtonInline
                        height='50px'
                        onClick={() => {
                            setSettingsCategory("home");
                        }}
                        classes={`lg:justify-start px-12 ${
                            settingsCategory === "home" && "bg-accent"
                        }`}
                    >
                        <FaHome />
                        Home
                    </ButtonInline>
                </div>
            )}

            {/* Settings Details */}
            {/* Account Settings */}
            {settingsCategory === "account" && (
                <div className='flex w-full flex-wrap p-6 gap-6 content-start animate-growfadein'>
                    <h1 className='text-2xl w-full font-bold border-b-2 pb-3'>
                        Account Settings
                    </h1>

                    {/* Error Message */}
                    {errorMessage && (
                        <button
                            className='bg-error w-full flex p-3 rounded-md justify-center animate-growfadein'
                            onClick={() => {
                                setErrorMessage("");
                            }}
                        >
                            <p>{errorMessage} (tap to close)</p>
                        </button>
                    )}

                    {/* Sign In */}
                    {!user && (
                        <form
                            className='flex flex-wrap flex-col w-full lg:w-auto'
                            onSubmit={login}
                        >
                            <h2 className='text-xl pb-3 w-full'>Sign In</h2>
                            <input
                                className='bg-foreground rounded-md p-3 mb-3'
                                placeholder='Email'
                                type='email'
                                required
                                onChange={(event) => {
                                    setLoginEmail(event.target.value);
                                }}
                            />
                            <input
                                className='bg-foreground rounded-md p-3 mb-3'
                                placeholder='Password'
                                type='password'
                                required
                                onChange={(event) => {
                                    setLoginPassword(event.target.value);
                                }}
                            />
                            <Button type='submit'>
                                <FaSignInAlt />
                                Sign In
                            </Button>
                        </form>
                    )}

                    {/* Register */}
                    {!user && (
                        <form
                            className='flex flex-wrap flex-col w-full lg:w-auto'
                            onSubmit={register}
                        >
                            <h2 className='text-xl pb-3 w-full'>Register</h2>
                            <input
                                className='bg-foreground rounded-md p-3 mb-3'
                                placeholder='Email'
                                type='email'
                                required
                                onChange={(event) => {
                                    setRegisterEmail(event.target.value);
                                }}
                            />
                            <input
                                className='bg-foreground rounded-md p-3 mb-3'
                                placeholder='Password'
                                type='password'
                                required
                                onChange={(event) => {
                                    setRegisterPassword(event.target.value);
                                }}
                            />

                            <Button type='submit'>
                                <FaUserPlus />
                                Sign Up
                            </Button>
                        </form>
                    )}
                    {/* Already Signed In */}
                    {user && (
                        <>
                            {/* Sign Out */}
                            <div className='w-full'>
                                <h2 className='text-xl pb-3'>
                                    Email: {user?.email}
                                </h2>
                                <Button onClick={logout}>
                                    <FaSignInAlt />
                                    Sign Out
                                </Button>
                            </div>
                            {/* User Profile */}
                            <div className='w-full flex flex-col gap-3'>
                                <h2 className='text-xl'>User Profile</h2>
                                {/* Profile Image */}
                                <div className='flex flex-wrap gap-3'>
                                    <h3 className='text-md w-full'>
                                        {!settings.profileImageUrl && "No "}
                                        Current Profile Image:
                                    </h3>
                                    {settings.profileImageUrl && (
                                        <>
                                            <div className='w-full'>
                                                <img
                                                    src={
                                                        settings.profileImageUrl
                                                    }
                                                    alt='user profile'
                                                    className='rounded-md h-32'
                                                />
                                            </div>
                                            <p className='w-full'>
                                                {settings.profileImageUrl}
                                            </p>
                                        </>
                                    )}
                                    <input
                                        type='text'
                                        className='bg-foreground rounded-md p-3 flex-grow'
                                        placeholder='Insert New Image URL'
                                        value={profileImageUrl}
                                        onChange={(e) =>
                                            setProfileImageUrl(e.target.value)
                                        }
                                    />
                                    <Button onClick={handleChangeUserImage}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Home Settings */}
            {settingsCategory === "home" && (
                // <div className='flex flex-wrap flex-col gap-6 p-6 w-full animate-growfadein'>
                <div className='flex w-full flex-wrap p-6 gap-6 content-start animate-growfadein'>
                    <h1 className='w-full text-2xl font-bold border-b-2 pb-3'>
                        Homepage Settings
                    </h1>
                    {/* Show/hide sections */}
                    <div className='w-full'>
                        <h2 className='text-xl pb-3'>Show/Hide Sections</h2>
                        <div className='flex flex-wrap gap-3'>
                            <Toggle
                                text='Weather'
                                checked={showWeather}
                                onClick={() => {
                                    setShowWeather(!showWeather);
                                    handleSettingsChange(
                                        "showWeather",
                                        !showWeather
                                    );
                                }}
                            />
                            <Toggle
                                text='Calendar'
                                checked={showCalendar}
                                onClick={() => {
                                    setShowCalendar(!showCalendar);
                                    handleSettingsChange(
                                        "showCalendar",
                                        !showCalendar
                                    );
                                }}
                            />
                            <Toggle
                                text='Notes'
                                checked={showNotes}
                                onClick={() => {
                                    setShowNotes(!showNotes);
                                    handleSettingsChange(
                                        "showNotes",
                                        !showNotes
                                    );
                                }}
                            />
                        </div>
                    </div>
                    {/* Weather */}
                    <div className='w-full'>
                        <h2 className='text-xl pb-3'>Weather</h2>
                        <Toggle
                            text='Imperial Format'
                            checked={settings.weatherFormat}
                            onClick={() => {
                                handleSettingsChange(
                                    "weatherFormat",
                                    !settings.weatherFormat
                                );
                            }}
                        />
                    </div>
                    {/* Calendar */}
                    <div className='w-full'>
                        <h2 className='text-xl pb-3'>Calendar</h2>
                        <Toggle
                            text='12 Hour Clock'
                            checked={settings.formatAMPM}
                            onClick={() => {
                                handleSettingsChange(
                                    "formatAMPM",
                                    !settings.formatAMPM
                                );
                            }}
                        />
                    </div>
                    {/* Notes */}
                    <div className='w-full'>
                        <h2 className='text-xl pb-3'>Notes</h2>
                        <Toggle
                            text='Reverse Note Order'
                            checked={settings.notesReversed}
                            onClick={() => {
                                handleSettingsChange(
                                    "notesReversed",
                                    !settings.notesReversed
                                );
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
