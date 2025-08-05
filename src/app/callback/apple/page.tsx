"use client"; // This component runs on the client-side

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For client-side navigation

const AppleCallbackPage = () => {
    const router = useRouter();
    // Hardcoded values for demonstration purposes
    const hardcodedStatus = 'success'; // Can be 'success' or 'error'
    const hardcodedToken = 'your_hardcoded_session_token_here'; // Replace with a dummy token if status is 'success'
    const hardcodedErrorMessage = 'Hardcoded error message for testing'; // Replace with a dummy error if status is 'error'

    const [message, setMessage] = useState('Processing your Apple Sign-in...');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Using hardcoded values instead of search parameters
        const status = hardcodedStatus;
        const token = hardcodedToken;
        const errorMessage = hardcodedErrorMessage;

        if (status === 'success' && token) {
            // Authentication successful
            setMessage('Sign-in successful! Redirecting to dashboard...');
            setIsError(false);
            // Here, you would typically store the token (e.g., in localStorage, cookies, or a state management solution)
            // For demonstration, we'll just log it.
            console.log('Received session token:', token);

            // Redirect to your main application dashboard or home page
            router.push('/dashboard'); // Replace with your actual dashboard route
        } else if ( true && errorMessage) {
            // Authentication failed
            setMessage(`Sign-in failed: ${errorMessage}. Please try again.`);
            setIsError(true);
            console.error('Apple Sign-in Error:', errorMessage);
            // Optionally, redirect to a login page or display an error to the user
            // router.push('/login?error=' + encodeURIComponent(errorMessage));
        } else {
            // This block might still be hit if hardcodedStatus is neither 'success' nor 'error'
            setMessage('Invalid callback. Please check hardcoded values.');
            setIsError(true);
            console.error('Apple Callback: Unexpected hardcoded status or missing token/message.');
            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push('/login'); // Replace with your actual login route
            }, 3000);
        }
    }, [router]); // Removed searchParams from dependencies as it's no longer used

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                    {isError ? 'Authentication Failed' : 'Authenticating...'}
                </h1>

                <div className="flex flex-col items-center justify-center space-y-4">
                    {!isError && (
                        <svg className="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    <p className={`text-lg font-medium ${isError ? 'text-red-600' : 'text-gray-700'}`}>
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AppleCallbackPage;
