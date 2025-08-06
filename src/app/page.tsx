// Import Node.js 'fs/promises' for async file operations and 'path' for reliable file paths.
import fs from "fs/promises";
import path from "path";

// Import Next.js cache utility to revalidate the page data.
import { revalidatePath } from "next/cache";

// Import your signIn function from auth.
import { signIn } from "../../auth";

// The Home component is now async to allow for top-level await for file reading.
export default async function Home() {
  // --- Step 2: Read the log file on the server when the page loads ---
  const logFilePath = path.join(process.cwd(), "auth_log.txt");
  let logContent = "No sign-in attempts logged yet.";

  try {
    // Await the reading of the file.
    logContent = await fs.readFile(logFilePath, "utf-8");
  } catch {
    // If the file doesn't exist, the default message will be shown.
    // The unused 'error' variable has been removed from the catch block to fix the linting warning.
    console.log("Log file not found. A new one will be created on the first sign-in.");
  }

  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col items-center gap-8">
        <form
          action={async () => {
            "use server";
            // --- Step 1: Write to the file inside a Server Action ---
            try {
              // The signIn function for OAuth providers typically redirects.
              // The code below will most likely run only if an error occurs during the sign-in process.
              const res = await signIn("apple");

              // Prepare the log entry with a timestamp and the response.
              // JSON.stringify formats the object for readable logging.
              const logEntry = `${new Date().toISOString()} - Sign-in Response: ${JSON.stringify(res, null, 2)}\n\n`;
              
              // Append the entry to the log file.
              await fs.appendFile(logFilePath, logEntry);

            } catch (error) {
              // If signIn throws an error, log that instead.
              // The 'error' type is now handled safely without using 'any'.
              let errorMessage = "An unknown error occurred during sign-in.";
              if (error instanceof Error) {
                errorMessage = error.message;
              }
              console.error("Sign-in error:", error);
              const errorLogEntry = `${new Date().toISOString()} - Sign-in Error: ${errorMessage}\n\n`;
              await fs.appendFile(logFilePath, errorLogEntry);
            }

            // --- Crucial Step: Revalidate the page ---
            // This tells Next.js to re-render the page on the server,
            // which will re-run our fs.readFile logic and show the updated content.
            revalidatePath("/");
          }}
        >
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-3 rounded-lg bg-black px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-gray-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.2033 15.68C16.2833 15.2267 16.3467 14.7733 16.3867 14.32C16.4267 13.8533 16.4467 13.3867 16.4467 12.92C16.4467 12.28 16.36 11.6667 16.1867 11.08C15.6533 9.38667 14.6333 8.04 13.1267 7.04C12.3333 6.50667 11.3933 6.24 10.3067 6.24C9.22001 6.24 8.24001 6.52 7.36667 7.08C6.10667 7.93333 5.21334 9.17333 4.68667 10.8C4.54001 11.24 4.45334 11.7067 4.42667 12.2C4.38667 12.6667 4.36667 13.12 4.36667 13.56C4.36667 14.2267 4.45334 14.8533 4.62667 15.44C4.94001 16.5467 5.46667 17.48 6.20667 18.24C6.94667 19 7.82667 19.4667 8.84667 19.64C9.84001 19.8 10.82 19.6533 11.7867 19.2C12.4267 18.8933 13.0133 18.52 13.5467 18.08C14.08 17.6267 14.48 17.2533 14.7467 16.96C14.7867 16.92 14.9067 16.8133 15.1067 16.64C15.2053 16.562 15.2977 16.4863 15.384 16.413C15.424 16.3867 15.54 16.2933 15.7333 16.1333C15.9867 15.92 16.1267 15.7933 16.1533 15.7533C16.1667 15.74 16.18 15.7267 16.1933 15.7133C16.1933 15.7133 16.2 15.7067 16.2033 15.68ZM11.66 4.4C12.3333 3.65333 12.7933 2.76 13.04 1.72C12.44 1.76 11.8533 1.94667 11.28 2.28C10.7067 2.61333 10.18 3.01333 9.70001 3.48C9.14667 4.02667 8.74001 4.64 8.48001 5.32C8.84001 5.4 9.49334 5.34667 10.44 5.16C10.7467 5.10667 11.1267 4.9 11.58 4.54C11.6067 4.52 11.6333 4.46667"></path>
            </svg>
            <span>Sign in with Apple</span>
          </button>
        </form>
      </main>

      {/* --- Step 3: Display the log content on the frontend --- */}
      <footer className="w-full max-w-4xl p-4 mt-8 bg-gray-50 border rounded-lg shadow-inner">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">
          Authentication Log
        </h2>
        <pre className="w-full text-sm text-gray-600 whitespace-pre-wrap break-words">
          {logContent}
        </pre>
      </footer>
    </div>
  );
}
