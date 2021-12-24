import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { auth } from "./firebase-config";
import { get, getDatabase, ref, child } from "firebase/database";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    // Screen size checks
    const isWidescreen = useMediaQuery({
        query: "(min-width: 1500px)",
    });
    const isMobile = useMediaQuery({
        query: "(max-width: 800px)",
    });

    // Firebase setup
    const [user, setUser] = useState({});
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    // Firebase DB setup
    const [settings, setSettings] = useState({
        notesReversed: false,
        noteCategory: "General",
        noteCategoryList: ["General"],
        showWeather: true,
        showCalendar: true,
        showNotes: true,
    });
    const [notes, setNotes] = useState({});
    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db);
        if (user) {
            // console.log(user);
            get(child(dbRef, `users/${user.uid}`))
                // get(child(dbRef, `users/user1`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        // console.log(snapshot.val());
                        const data = snapshot.val();
                        setSettings((prevState) => ({
                            ...prevState,
                            ...data.settings,
                        }));
                        setNotes({ ...data.notes });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("no user logged in");
        }
    }, [user]);

    return (
        <AppContext.Provider
            value={{
                isMobile,
                isWidescreen,
                user,
                setUser,
                notes,
                setNotes,
                settings,
                setSettings,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
// make sure use
export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider };
