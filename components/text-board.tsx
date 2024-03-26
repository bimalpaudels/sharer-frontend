"use client";

import { useState, useEffect, useRef } from "react";

export default function Board() {
  const [broadcast, setBroadcast] = useState("");

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connecting to the server
    const ws = new WebSocket("ws:http://localhost:8000/ws/");
    socketRef.current = ws;

    // Message for Open Connection
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    // Event handler for receiving message
    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      setBroadcast(event.data);
    };

    // Message for Closed Connection
    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleaning up the closing
    return () => {
      ws.close();
    };
  }, []);

  function sendMessage(message: string) {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error("Connection is not open");
    }
  }

  function handleTextAreaChange(event: { target: { value: any } }) {
    const message = event.target.value;
    sendMessage(message);
  }

  return (
    <div className="mt-12 flex justify-center w-full h-full">
      <div className="w-1/2 mx-auto bg-white rounded-lg shadow-xl p-6 ">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-black">Write Something..!!</h2>
        </div>

        <div className={`w-full flex justify-center max-h-dvh`}>
          <textarea
            value={broadcast}
            onChange={handleTextAreaChange}
            className={`w-full resize-none focus:outline-none overflow-hidden h-80 text-xl antialiased font-medium`}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
