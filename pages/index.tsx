import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [value, setValue] = useState(""); // Current operand
  const [display, setDisplay] = useState(""); // The expression displayed on the calculator
  const [memory, setMemory] = useState(0); // Stored in memory
  const [history, setHistory] = useState([]); // Use Queue (push and shift)

  // USE INDEXOF TO GET INDEX OF VALUE SUBSTRING IN DISPLAY FOR THE +/- FUNCTION

  // Arrays to hold the different button types
  const digits = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "="];
  const operators = ["/", "*", "-", "+"];
  const special = ["+/-", "%", "√", "x^2"];
  const memories = ["MC", "MR", "M+", "M-"];
  const clear = ["AC", "C", "CE", "DEL"];

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

  // Handle memory functions
  const handleMemory = (m: string) => {
    if (m === "MC") {
      setMemory(0);
    } else if (m === "MR") {
      setValue(memory.toString());
      setDisplay(memory.toString());
    } else if (m === "M+") {
      // If last thing displayed is an operator, remove it and
      // store the result of the expression before it in memory
      if (operators.includes(display[display.length - 1])) {
        setMemory(
          (prevMemory) =>
            prevMemory + eval(display.substring(0, display.length - 1))
        );
      } else {
        setMemory((prevMemory) => prevMemory + eval(display));
      }
    } else if (m === "M-") {
      // If last thing displayed is an operator, remove it and
      // store the result of the expression before it in memory
      if (operators.includes(display[display.length - 1])) {
        setMemory(
          (prevMemory) =>
            prevMemory - eval(display.substring(0, display.length - 1))
        );
      } else {
        setMemory((prevMemory) => prevMemory - eval(display));
      }
    }
  };

  // Handle +/-, percentage, square root, and exponential functions
  const handleSpecial = (s: string) => {
    if (s === "+/-" && value[0] === "-") {
      // Convert current operand to positive
      const index = display.lastIndexOf(value);
      setValue((prevValue) => prevValue.substring(1));
      setDisplay(
        (prevDisplay) =>
          prevDisplay.substring(0, index) + prevDisplay.substring(index + 1)
      );
    } else if (s === "+/-" && value[0] !== "-" && value.length > 0) {
      // Convert current operand to negative if operand isn't empty
      const index = display.lastIndexOf(value);
      setValue((prevValue) => "-" + prevValue);
      setDisplay(
        (prevDisplay) =>
          prevDisplay.substring(0, index) + "-" + prevDisplay.substring(index)
      );
    } else if (s === "%") {
      // Convert current operand to percentage
      let x: number | string = Number(value) * 0.01;
      if (display.length + x.toString().length >= 14) {
        // Round square root to 3 decimals if too long
        x = x.toFixed(10).toString();
      }
      const index = display.lastIndexOf(value);
      setValue(x.toString());
      setDisplay(
        (prevDisplay) => prevDisplay.substring(0, index) + x.toString()
      );
    } else if (s === "√") {
      // Get square root of current operand
      let x: number | string = Math.sqrt(Number(value));
      if (display.length + x.toString().length >= 14) {
        // Round square root to 3 decimals if too long
        x = x.toFixed(10).toString();
      }
      const index = display.lastIndexOf(value);
      setValue(x.toString());
      setDisplay(
        (prevDisplay) => prevDisplay.substring(0, index) + x.toString()
      );
    } else if (s === "^") {
      let x: number | string = Math.pow(Number(value), 2);
      if (display.length + x.toString().length >= 14) {
        // Round exponential to 3 decimals if too long
        x = x.toExponential(10).toString();
      }
      const index = display.lastIndexOf(value);
      setValue(x.toString());
      setDisplay(
        (prevDisplay) => prevDisplay.substring(0, index) + x.toString()
      );
    }
  };

  // Display digits and evaluate expressions
  const handleDigit = (d: string | number) => {
    // Calculator can only display 14 characters max
    if (display.length >= 14) {
      return;
    } else if (
      d !== "=" &&
      d !== "." &&
      display[display.length - 1] === "0" &&
      value.length === 1
    ) {
      // Remove leading zeroes
      setValue((prevValue) => prevValue.substring(0, prevValue.length - 1) + d);
      setDisplay(
        (prevDisplay) => prevDisplay.substring(0, prevDisplay.length - 1) + d
      );
    } else if (d !== "=" && d !== ".") {
      // Display numbers regularly
      setValue((prevValue) => prevValue + d);
      setDisplay((prevDisplay) => prevDisplay + d);
    } else if (d === "." && value.length === 0) {
      // Put 0 before single decimal
      setValue((prevValue) => prevValue + 0 + d);
      setDisplay((prevDisplay) => prevDisplay + 0 + d);
    } else if (
      d === "." &&
      value[value.length - 1] !== "." && // No 2 consecutive decimals
      !value.includes(".") // Only 1 decimal per value
    ) {
      setValue((prevValue) => prevValue + d);
      setDisplay((prevDisplay) => prevDisplay + d);
    } else if (d === "=" && value.length !== 0) {
      // Can only evaluate after number input
      const result = eval(display);
      if (result.length >= 14) {
        setDisplay(result.toExponential(10).toString());
      } else {
        setDisplay(result.toString());
      }
    }
  };

  // Display operators
  const handleOperator = (o: string) => {
    // Calculator can only display 14 characters max
    if (display.length >= 14) {
      return;
    } else {
      setValue("");
      if (!operators.includes(display[display.length - 1])) {
        setDisplay((prevDisplay) => prevDisplay + o);
      } else {
        // Prevent 2 consecutive operators
        setDisplay(
          (prevDisplay) => prevDisplay.substring(0, prevDisplay.length - 1) + o
        );
      }
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
            <div className="mb-[1px] grid grid-cols-4 gap-[1px]">
              {clear.map((c) => (
                <button
                  key={c}
                  // onClick={() => handleMemory(m)}
                  className="button bg-red-500 hover:bg-red-500">
                  {c}
                </button>
              ))}
            </div>
            <div className="mb-[1px] grid grid-cols-4 gap-[1px]">
              {memories.map((m) => (
                <button
                  key={m}
                  onClick={() => handleMemory(m)}
                  className="button bg-purple-500 hover:bg-purple-500">
                  {m}
                </button>
              ))}
            </div>
            <div className="mb-[1px] grid grid-cols-4 gap-[1px]">
              {special.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpecial(s)}
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
                    onClick={() => handleOperator(o)}
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
