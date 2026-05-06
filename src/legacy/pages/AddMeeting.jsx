import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaLock, FaUnlock, FaPaperPlane } from "react-icons/fa";
import SideBar from "./Admin";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";

// ORIGINAL LOGIC & TITLES: Reference from old folder
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
      <div className="admin-layout">
        <Header />
        <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10 admin-fluid-container">
          <SideBar />
          <main className="flex-1 flex items-center justify-center p-4 py-20">
            <div className="w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#dd2727]/5 rounded-full blur-3xl group-hover:bg-[#dd2727]/10 transition-all"></div>
              
              <div className="text-center relative z-10">
                {/* ORIGINAL TITLE */}
                <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">
                  Mini <span className="text-[#dd2727]">Meet</span>
                </h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Admin Meeting Portal</p>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Room ID</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all placeholder:text-gray-700" 
                    placeholder="Room ID" 
                    onChange={e=>setRoomId(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Name</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all placeholder:text-gray-700" 
                    placeholder="Your Name" 
                    onChange={e=>setName(e.target.value)} 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                {/* ORIGINAL TITLES */}
                <button 
                  onClick={createRoom} 
                  className="w-full bg-[#dd2727] text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(221,39,39,0.5)] transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  Create
                </button>
                <button 
                  onClick={joinRoom} 
                  className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  Join
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-layout h-screen overflow-hidden">
      <div className="flex h-full relative z-10">
        <div className="flex-1 relative bg-black">
          <video ref={localVideo} autoPlay muted className="w-full h-full object-cover opacity-90" />
          
          <div className="absolute top-8 left-8 flex items-center gap-4">
            <div className="bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">{status || "Connected"}</p>
            </div>
            <div className="bg-[#dd2727]/80 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
               <p className="text-[10px] font-bold text-white uppercase tracking-widest">ID: {roomId}</p>
            </div>
          </div>

          <div className="absolute bottom-10 w-full flex justify-center items-center gap-6 px-10">
            <div className="flex gap-4 p-4 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl">
              <CtrlBtn danger={muted} onClick={toggleMute}>
                {muted ? <FaMicrophoneSlash className="text-xl"/> : <FaMicrophone className="text-xl"/>}
              </CtrlBtn>
              <CtrlBtn danger={camOff} onClick={toggleCam}>
                {camOff ? <FaVideoSlash className="text-xl"/> : <FaVideo className="text-xl"/>}
              </CtrlBtn>
              <div className="w-px h-10 bg-white/10 self-center mx-2"></div>
              <CtrlBtn onClick={screenShare}><FaDesktop className="text-xl"/></CtrlBtn>
              <CtrlBtn onClick={()=>socket.emit("lock-room",{roomId})}><FaLock className="text-xl"/></CtrlBtn>
              <CtrlBtn onClick={()=>socket.emit("unlock-room",{roomId})}><FaUnlock className="text-xl"/></CtrlBtn>
              <div className="w-px h-10 bg-white/10 self-center mx-2"></div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-3xl font-bold uppercase tracking-widest text-[10px] transition-all"
              >
                Leave
              </button>
            </div>
          </div>
        </div>

        <div className="w-96 bg-[#050505] border-l border-white/5 flex flex-col shadow-2xl relative z-20">
          <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            {/* ORIGINAL TITLE */}
            <h4 className="text-sm font-bold text-white uppercase tracking-[0.4em]">Chat</h4>
            <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Real-time Messaging</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {chat.map((c,i)=>(
              <div key={i} className={`p-5 rounded-3xl border border-white/5 ${c.name === name ? "bg-[#dd2727]/10 ml-8" : "bg-white/5 mr-8"}`}>
                <p className="text-[9px] font-bold text-[#b0a102] uppercase mb-2">{c.name || "User"}</p>
                <p className="text-xs text-gray-300 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-t from-white/5 to-transparent">
            <div className="flex gap-3 bg-white/5 border border-white/10 p-2 rounded-3xl focus-within:ring-2 focus-within:ring-[#dd2727] transition-all">
              <input 
                value={msg} 
                onChange={e=>setMsg(e.target.value)} 
                className="flex-1 bg-transparent px-4 text-sm text-white outline-none"
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
              />
              <button 
                onClick={sendMsg} 
                className="bg-[#dd2727] p-4 rounded-2xl text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <FaPaperPlane/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border
        ${danger 
          ? "bg-red-500/20 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
          : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"}`}
    >
      {children}
    </button>
  );
}
