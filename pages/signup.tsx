import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Check if user session exists and go to Home page if it does
  useEffect(() => {
    const user = localStorage.getItem("userSession");
    if (user) {
      router.push("/");
    }
  }, []);

  // Attempt to signup user
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else if (response.ok) {
        setError(null);
        localStorage.setItem(
          "userSession",
          JSON.stringify({ username: data.username })
        );
        router.push("/"); // Go to Home page
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Head>
        <title>Calculator App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen items-start justify-center bg-slate-300 pt-10">
        <div className="w-1/3 bg-white px-10 py-5">
          <h3 className="text-center text-3xl font-bold">Signup</h3>
          <form onSubmit={(e) => handleSignup(e)}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-5 block w-full rounded-lg border-2 border-solid border-slate-200 p-2 focus:border-slate-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-5 block w-full rounded-lg border-2 border-solid border-slate-200 p-2 focus:border-slate-500 focus:outline-none"
            />
            <div className="flex justify-center pt-5">
              <button className="w-1/2 rounded-lg bg-blue-500 p-4 font-bold text-white hover:cursor-pointer hover:bg-blue-700">
                Sign Up
              </button>
            </div>
            {error && (
              <div className="mx-auto mt-5 w-fit border-4 border-solid border-pink-300 bg-pink-200 p-2 text-center font-bold">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
