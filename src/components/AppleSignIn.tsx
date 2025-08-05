// components/AppleSignIn.tsx
"use client";
import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (options: {
          clientId: string;
          scope: string;
          redirectURI: string;
          state: string;
          usePopup: boolean;
        }) => void;
        signIn: () => void;
      };
    };
  }
}

interface AppleAuthorizationEventDetail {
  authorization: {
    code: string;
    id_token: string;
    state: string;
  };
  user?: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

const AppleSignIn: React.FC = () => {
  const [isAppleScriptLoaded, setIsAppleScriptLoaded] = useState(false);

  // Constants from environment variables
  const APPLE_SERVICE_ID = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID || "Z5643SFV7H";
  const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "http://localhost:8082/get-ios-code";
  const APPLE_STATE_STRING = process.env.NEXT_PUBLIC_APPLE_STATE_STRING || "a-hardcoded-secure-random-string";

  useEffect(() => {
    // Check if the script is already loaded to prevent multiple loads
    if (document.querySelector('script[src="https://appleid.cdn-apple.com/appleauth/js/appleid/1/appleid.auth.js"]')) {
      setIsAppleScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/js/appleid/1/appleid.auth.js';
    script.async = true;
    
    // Use an onload handler to update state once the script is ready
    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: APPLE_SERVICE_ID,
          scope: 'name email',
          redirectURI: APPLE_REDIRECT_URI,
          state: APPLE_STATE_STRING,
          usePopup: true,
        });

        document.addEventListener('AppleIDSignInOnSuccess', (event: any) => {
          const detail = (event as CustomEvent<AppleAuthorizationEventDetail>).detail;
          const { id_token } = detail.authorization;

          fetch('http://localhost:5000/api/apple-signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_token }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Sign-in failed on server');
            }
            return response.json();
          })
          .then(data => {
            if (data.user) {
              console.log('User signed in:', data.user);
              // Handle successful sign-in (e.g., redirect to dashboard)
            }
          })
          .catch(error => {
            console.error('Sign-in error:', error);
            alert('Sign in failed. Please try again.');
          });
        });

        document.addEventListener('AppleIDSignInOnFailure', (event: any) => {
          const detail = (event as CustomEvent).detail;
          console.error('Apple Sign In failed:', detail);
          alert('Sign in with Apple failed.');
        });
        
        // After initialization, set the state to true
        setIsAppleScriptLoaded(true);
      }
    };
    
    // Handle script loading errors
    script.onerror = () => {
      console.error("Failed to load Apple Sign In script.");
    };

    document.head.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // You should also remove the event listeners here for a clean cleanup
      document.removeEventListener('AppleIDSignInOnSuccess', () => {});
      document.removeEventListener('AppleIDSignInOnFailure', () => {});
    };
  }, [APPLE_SERVICE_ID, APPLE_REDIRECT_URI, APPLE_STATE_STRING]); // Dependencies

  const onSignInHandler = () => {
    // Only call signIn() if the script is loaded
    if (isAppleScriptLoaded && window.AppleID) {
      window.AppleID.auth.signIn();
    } else {
      console.error("AppleID script not loaded yet.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sign in with Apple</h1>
      <button 
        className="text-white px-4 py-2 rounded bg-green-500 hover:bg-green-600 transition-colors" 
        onClick={onSignInHandler}
        disabled={!isAppleScriptLoaded} // Disable the button until the script is ready
      >
        Sign in with Apple
      </button>
      {!isAppleScriptLoaded && <p>Loading Apple Sign In...</p>}
    </div>
  );
};

export default AppleSignIn;