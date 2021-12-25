import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import Button from "./Button";

const Navbar = () => {
    const { settings } = useGlobalContext();

    return (
        <nav className='bg-foreground flex content-center gap-3 p-3 h-16'>
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
            <div className='flex-grow'></div>
            <Link to='/settings'>
                {!settings.profileImageUrl && (
                    <FaUser className='h-full w-auto p-2' />
                )}
                {settings.profileImageUrl && (
                    <img
                        src={settings.profileImageUrl}
                        alt='profile image'
                        className='h-full p-1 rounded-lg'
                    />
                )}
            </Link>
        </nav>
    );
};

export default Navbar;
