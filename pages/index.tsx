import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { BsArrowUpSquare, BsArrowDownSquare } from "react-icons/bs";

interface IHistory {
  expression: string;
  result: number;
}

export default function Home() {
  // Username of currently logged in user
  const [username, setUsername] = useState(null);

  // Current operand
  const [value, setValue] = useState("");

  // The expression displayed on the calculator
  const [display, setDisplay] = useState("");

  // The value stored in memory
  const [memory, setMemory] = useState(0);

  // Stores 10 most recent evaluated numbers
  const [history, setHistory] = useState<IHistory[]>([]);

  // The current history index being display
  let historyIndex = useRef(-1);

  // The expression used to get history values
  const [expression, setExpression] = useState<string | null>(null);

  // Arrays to hold the different button types
  const digits = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "="];
  const operators = ["/", "*", "-", "+"];
  const special = ["+/-", "%", "√", "^"];
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

  // Display History on Calculator
  const showHistory = () => {
    historyIndex.current = history.length - 1;
    if (history.length > 0) {
      setValue(history[history.length - 1].result.toString());
      setDisplay(history[history.length - 1].result.toString());
      setExpression(history[history.length - 1].expression);
    }
  };

  // Show previous (older) history
  const showPrevHistory = () => {
    if (historyIndex.current < 0) return;
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
    }
    setValue(history[historyIndex.current].result.toString());
    setDisplay(history[historyIndex.current].result.toString());
    setExpression(history[historyIndex.current].expression);
  };

  // Show next (newer) history
  const showNextHistory = () => {
    if (historyIndex.current < 0 || historyIndex.current >= history.length)
      return;
    if (historyIndex.current < history.length - 1) {
      historyIndex.current += 1;
    }
    setValue(history[historyIndex.current].result.toString());
    setDisplay(history[historyIndex.current].result.toString());
    setExpression(history[historyIndex.current].expression);
  };

  // Handle clear functions
  const handleClear = (c: string) => {
    setExpression(null);
    if (c === "AC") {
      // Clear the full display and reset memory to 0
      setValue("");
      setDisplay("");
      setMemory(0);
    } else if (c === "C") {
      // Clear the full display
      setValue("");
      setDisplay("");
    } else if (c === "CE") {
      // Clear current operand
      const index = display.lastIndexOf(value);
      setValue("");
      setDisplay((prevDisplay) => prevDisplay.substring(0, index));
    } else if (c === "DEL") {
      // Delete the rightmost display character
      if (value.length > 0) {
        setValue((prevValue) => prevValue.substring(0, prevValue.length - 1));
      }
      if (display.length > 0) {
        setDisplay((prevDisplay) =>
          prevDisplay.substring(0, prevDisplay.length - 1)
        );
      }
    }
  };

  // Handle memory functions
  const handleMemory = (m: string) => {
    setExpression(null);
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
    setExpression(null);
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
    } else if (s === "^" && value.length > 0) {
      // Handle exponential function so it isn't next to itself or an operator
      setValue("");
      if (
        !operators.includes(display[display.length - 1]) &&
        display[display.length - 1] !== "^" &&
        display.length > 0
      ) {
        setDisplay((prevDisplay) => prevDisplay + "^");
      }
    }
  };

  // Display digits and evaluate expressions
  const handleDigit = (d: string | number) => {
    setExpression(null);
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
      const replaced = display.replace(/\^/g, "**");
      const result: number = eval(replaced);
      if (result.toString().length >= 14) {
        setDisplay(result.toExponential(10).toString());
      } else {
        setDisplay(result.toString());
      }

      // Add to history
      if (history.length >= 10) {
        setHistory((prevHistory) => prevHistory.slice(1));
      }
      setHistory((prevHistory) => [
        ...prevHistory,
        { expression: display, result: result }
      ]);
    }
  };

  // Display operators
  const handleOperator = (o: string) => {
    setExpression(null);
    // Calculator can only display 14 characters max
    if (display.length >= 14) {
      return;
    } else {
      setValue("");
      if (
        !operators.includes(display[display.length - 1]) &&
        display[display.length - 1] !== "^" &&
        display.length > 0
      ) {
        setDisplay((prevDisplay) => prevDisplay + o);
      } else if (display.length > 0) {
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
        <div className="relative mt-10 h-[580px] w-[500px] border-4 border-black bg-gray-500">
          <button
            onClick={() => showHistory()}
            className="absolute right-4 top-6 hover:cursor-pointer">
            <FaHistory />
          </button>
          <button
            onClick={() => showPrevHistory()}
            className="absolute right-4 top-14 hover:cursor-pointer">
            <BsArrowUpSquare />
          </button>
          <button
            onClick={() => showNextHistory()}
            className="absolute right-4 top-20 hover:cursor-pointer">
            <BsArrowDownSquare />
          </button>
          <div className="mx-auto mt-5 flex h-[100px] w-[400px] items-center justify-end border-2 border-black bg-slate-400 p-2 text-5xl">
            {expression && <span>({expression})= </span>}
            <span>{display}</span>
          </div>
          <div className="p-5">
            <div className="mb-[1px] grid grid-cols-4 gap-[1px]">
              {clear.map((c) => (
                <button
                  key={c}
                  onClick={() => handleClear(c)}
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
