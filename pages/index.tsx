import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [value, setValue] = useState("");
  const [display, setDisplay] = useState("");

  // Arrays to hold the different button types
  const digits = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "="];
  const operators = ["/", "*", "-", "+"];
  const special = ["AC", "%", "√", "^"];
  const memory = ["MC", "MR", "M+", "M-"];

  // Check if user session exists
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userSession") || "null");
    if (user) {
      setUsername(user.username);
    }
  }, [username]);

  // Signout user
  const handleSignout = () => {
    setUsername(null);
    localStorage.removeItem("userSession");
  };

  // Display digits
  const handleDigit = (d: string | number) => {
    if (d !== "=" && d !== "." && d !== 0) {
      console.log(display);
      console.log(typeof display);
      setValue((prevValue) => prevValue + d);
      setDisplay((prevDisplay) => prevDisplay + d);
    } else if (
      d === "." &&
      value[value.length - 1] !== "." && // No 2 consecutive decimals
      !value.includes(".") // Only 1 decimal per value
    ) {
      setValue((prevValue) => prevValue + d);
      setDisplay((prevDisplay) => prevDisplay + d);
    } else if (d === 0 && value.length !== 0) {
      // First digit can't be 0
      setValue((prevValue) => prevValue + d);
      setDisplay((prevDisplay) => prevDisplay + d);
    } else if (d === "=" && !operators.includes(value[value.length - 1])) {
      // Can only evaluate after number input
      setDisplay((prevDisplay) => eval(prevDisplay).toString());
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
      <div className="flex h-screen flex-col items-center">
        <nav className="max-h-1/5 navbar navbar-expand-lg navbar-light relative flex w-full flex-wrap items-center justify-around py-4 font-bold shadow-lg">
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
              <button onClick={() => handleSignout()}>Sign Out</button>
            </div>
          ) : (
            <div className="flex w-1/3 justify-end">
              <Link href="/login">
                <button className="mr-10">Login</button>
              </Link>
              <Link href="/signup">
                <button>Sign Up</button>
              </Link>
            </div>
          )}
        </nav>
        <div className="mt-10 h-[580px] w-[500px] border-4 border-black bg-gray-500">
          <div className="mx-auto mt-5 flex h-[100px] w-[400px] items-center justify-end border-2 border-black bg-slate-400 p-2 text-5xl">
            <span>{display}</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-4 gap-[1px]">
              {memory.map((m) => (
                <button key={m} className="button bg-red-500 hover:bg-red-500">
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-[1px]">
              {special.map((s) => (
                <button
                  key={s}
                  className="button bg-green-500 hover:bg-green-500">
                  {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-[1px]">
              <div className="col-span-3 grid grid-cols-3 gap-[1px]">
                {digits.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDigit(d)}
                    className="button bg-sky-500 hover:bg-sky-500">
                    {d}
                  </button>
                ))}
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-[1px]">
                {operators.map((o) => (
                  <button
                    key={o}
                    className="button bg-orange-500 hover:bg-orange-500">
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
