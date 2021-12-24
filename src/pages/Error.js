import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
    return (
        <div className='min-h-screen'>
            <div className='flex flex-col items-center p-5'>
                <h1 className='text-5xl p-5'>Error 404</h1>
                <h2 className='text-3xl'>Page not Found</h2>
                <Link to='/' className='p-5'>
                    <span className='text-blue-400 text-xl'>Back to Home</span>
                </Link>
            </div>
        </div>
    );
};

export default Error;
