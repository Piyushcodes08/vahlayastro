import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaLock, FaUnlock, FaPaperPlane } from "react-icons/fa";

const socket = io("http://localhost:5000");

export default function App() {
  const localVideo = useRef();
  const localStream = useRef(null);

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.on("room-created", () => setJoined(true));
    socket.on("user-joined", d => setStatus(`${d.name} joined`));
    socket.on("waiting-lobby", () => setStatus("Waiting in lobby"));
    socket.on("room-locked", () => setStatus("Room locked"));
    socket.on("room-unlocked", () => setStatus("Room unlocked"));
    socket.on("chat-message", d => setChat(c => [...c, d]));
    socket.on("kicked", () => { alert("You were removed"); window.location.reload(); });
    return () => socket.off();
  }, []);

  const startMedia = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: devices.some(d => d.kind === "videoinput"),
        audio: devices.some(d => d.kind === "audioinput"),
      });
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;
    } catch {
      alert("No camera/mic found. Running in chat-only mode.");
    }
  };

  const createRoom = async () => {
    await startMedia();
    console.log(roomId, name);
    socket.emit("create-room", { roomId, name });
  };

  const joinRoom = async () => {
    await startMedia();
    socket.emit("join-room", { roomId, name });
    setJoined(true);
  };

  const toggleMute = () => {
    const t = localStream.current?.getAudioTracks()[0];
    if (t) t.enabled = muted;
    setMuted(!muted);
  };

  const toggleCam = () => {
    const t = localStream.current?.getVideoTracks()[0];
    if (t) t.enabled = camOff;
    setCamOff(!camOff);
  };

  const sendMsg = () => {
    socket.emit("chat-message", { roomId, text: msg });
    setMsg("");
  };

  const screenShare = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
    localVideo.current.srcObject = screen;
  };

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="bg-slate-800 p-8 rounded-xl w-80 shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-4">Mini Meet</h2>
          <input className="w-full p-2 rounded mb-3 text-black" placeholder="Room ID" onChange={e=>setRoomId(e.target.value)} />
          <input className="w-full p-2 rounded mb-4 text-black" placeholder="Your Name" onChange={e=>setName(e.target.value)} />
          <button onClick={createRoom} className="w-full bg-green-500 py-2 rounded mb-2 hover:bg-green-600">Create</button>
          <button onClick={joinRoom} className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600">Join</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      
      {/* Video */}
      <div className="flex-1 relative">
        <video ref={localVideo} autoPlay muted className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded">{status}</div>

        {/* Controls */}
        <div className="absolute bottom-5 w-full flex justify-center gap-4">
          <CtrlBtn danger={muted} onClick={toggleMute}>
            {muted ? <FaMicrophoneSlash/> : <FaMicrophone/>}
          </CtrlBtn>
          <CtrlBtn danger={camOff} onClick={toggleCam}>
            {camOff ? <FaVideoSlash/> : <FaVideo/>}
          </CtrlBtn>
          <CtrlBtn onClick={screenShare}><FaDesktop/></CtrlBtn>
          <CtrlBtn onClick={()=>socket.emit("lock-room",{roomId})}><FaLock/></CtrlBtn>
          <CtrlBtn onClick={()=>socket.emit("unlock-room",{roomId})}><FaUnlock/></CtrlBtn>
        </div>
      </div>

      {/* Chat */}
      <div className="w-80 border-l border-slate-800 flex flex-col">
        <h4 className="p-3 border-b border-slate-800">Chat</h4>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chat.map((c,i)=>(
            <div key={i} className="bg-slate-800 p-2 rounded">{c.text}</div>
          ))}
        </div>
        <div className="p-2 flex gap-2">
          <input value={msg} onChange={e=>setMsg(e.target.value)} className="flex-1 p-2 rounded text-black"/>
          <button onClick={sendMsg} className="bg-green-500 p-2 rounded">
            <FaPaperPlane/>
          </button>
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-full text-xl transition 
        ${danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-800 hover:bg-slate-700"}`}
    >
      {children}
    </button>
  );
}
