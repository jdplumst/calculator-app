import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState(null);

  // Check if user session exists
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usersession") || "null");
    if (user) {
      setUsername(user.username);
    }
  });

  return (
    <>
      <Head>
        <title>Calculator App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen">
        <nav className="navbar navbar-expand-lg navbar-light relative flex w-full flex-wrap items-center justify-around py-4 font-bold shadow-lg">
          <div className="w-1/3">
            {username ? (
              <span>You are signed in as {username}</span>
            ) : (
              <span>You are not signed in</span>
            )}
          </div>
          <h1 className="text-4xl">Calculator App</h1>
          {username ? (
            <div className="flex w-1/3 justify-end">
              <button>Sign Out</button>
            </div>
          ) : (
            <div className="flex w-1/3 justify-end">
              <button className="mr-10">Login</button>
              <button>Sign Up</button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
