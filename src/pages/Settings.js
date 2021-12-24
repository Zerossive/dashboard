import { useState } from "react";
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
import { FaHome, FaUser } from "react-icons/fa";
import Toggle from "../components/Toggle";

export default function Settings() {
    const { user, setNotes, settings, setSettings } = useGlobalContext();

    const [settingsCategory, setSettingsCategory] = useState("account");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Home Settings
    const [showWeather, setShowWeather] = useState(settings.showWeather);
    const [showCalendar, setShowCalendar] = useState(settings.showCalendar);
    const [showNotes, setShowNotes] = useState(settings.showNotes);

    const db = getDatabase();

    // Account
    const login = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setLoginEmail("");
            setLoginPassword("");
            setErrorMessage("");
            console.log("Logged in as", loginEmail);
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
        <div className='flex flex-wrap lg:flex-nowrap overflow-hidden animate-fadein'>
            {/* Settings Category */}
            {user && (
                <div className='bg-midground w-full lg:w-auto lg:h-screen flex flex-col'>
                    <ButtonInline
                        height='50px'
                        onClick={() => {
                            setSettingsCategory("account");
                        }}
                        classes='lg:justify-start px-12'
                    >
                        <FaUser />
                        Account
                    </ButtonInline>
                    <ButtonInline
                        height='50px'
                        onClick={() => {
                            setSettingsCategory("home");
                        }}
                        classes='lg:justify-start px-12'
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

                    {/* Login */}
                    {!user && (
                        <form
                            className='flex flex-wrap flex-col w-full lg:w-auto'
                            onSubmit={login}
                        >
                            <h2 className='text-xl pb-3 w-full'>Login</h2>
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
                            <Button type='submit'>Sign In</Button>
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

                            <Button type='submit'>Sign Up</Button>
                        </form>
                    )}
                    {/* Logout */}
                    {user && (
                        <div className='flex flex-col flex-wrap gap-3'>
                            <h4>User Logged In: {user?.email}</h4>

                            <Button onClick={logout}>Sign Out</Button>
                        </div>
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
                    <div className='w-full lg:w-auto'>
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
                    {/* Notes */}
                    <div className='w-full lg:w-auto'>
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
