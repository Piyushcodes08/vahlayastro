import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaLock, FaUnlock, FaPaperPlane } from "react-icons/fa";

const socket = io("http://localhost:5000", { autoConnect: false });

import Aside from "./Aside";

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
    socket.connect();
    socket.on("room-created", () => setJoined(true));
    socket.on("user-joined", d => setStatus(`${d.name} joined the orbit`));
    socket.on("waiting-lobby", () => setStatus("In cosmic lobby..."));
    socket.on("room-locked", () => setStatus("Orbit locked"));
    socket.on("room-unlocked", () => setStatus("Orbit unlocked"));
    socket.on("chat-message", d => setChat(c => [...c, d]));
    socket.on("kicked", () => { alert("You were disconnected from orbit"); window.location.reload(); });
    return () => {
      socket.off();
      socket.disconnect();
    };
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
      alert("No cosmic sensors found. Chat-only mode initiated.");
    }
  };

  const createRoom = async () => {
    if(!roomId || !name) return alert("Enter credentials");
    await startMedia();
    socket.emit("create-room", { roomId, name });
  };

  const joinRoom = async () => {
    if(!roomId || !name) return alert("Enter credentials");
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
    if(!msg) return;
    socket.emit("chat-message", { roomId, text: msg });
    setMsg("");
  };

  const screenShare = async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
      localVideo.current.srcObject = screen;
    } catch (e) {
      console.error(e);
    }
  };

  if (!joined) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a] text-white">
        <Aside />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#dd2727] to-[#b0a102]"></div>
            
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold tracking-tighter uppercase">Cosmic <span className="text-[#dd2727]">Meet</span></h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Live Video Communication</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Orbit ID</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-[#dd2727] transition-all" 
                  placeholder="e.g. astrology-101" 
                  onChange={e=>setRoomId(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Astronaut Name</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-[#b0a102] transition-all" 
                  placeholder="Your Name" 
                  onChange={e=>setName(e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button onClick={createRoom} className="bg-white/5 border border-white/10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-sm">Launch</button>
              <button onClick={joinRoom} className="bg-gradient-to-r from-[#dd2727] to-[#b0a102] py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all text-sm shadow-xl">Join Orbit</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Video Stream */}
      <div className="flex-1 relative bg-black">
        <video ref={localVideo} autoPlay muted className="w-full h-full object-cover opacity-80" />
        
        {/* Top Overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{status || "Orbit Stable"}</span>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Room: {roomId}
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-[2rem]">
          <CtrlBtn danger={muted} onClick={toggleMute}>
            {muted ? <FaMicrophoneSlash/> : <FaMicrophone/>}
          </CtrlBtn>
          <CtrlBtn danger={camOff} onClick={toggleCam}>
            {camOff ? <FaVideoSlash/> : <FaVideo/>}
          </CtrlBtn>
          <div className="w-px h-8 bg-white/10 mx-2"></div>
          <CtrlBtn onClick={screenShare}><FaDesktop/></CtrlBtn>
          <CtrlBtn onClick={()=>socket.emit("lock-room",{roomId})}><FaLock/></CtrlBtn>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#dd2727] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Cosmic Chat */}
      <div className="w-96 bg-black/60 backdrop-blur-xl border-l border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#b0a102]">Transmission Log</h4>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chat.length === 0 && (
            <div className="text-center py-20 text-gray-600 italic text-xs uppercase tracking-widest">No signals detected</div>
          )}
          {chat.map((c,i)=>(
            <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-widest">Astronaut</p>
              <p className="text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-black/40 border-t border-white/10">
          <div className="flex gap-2">
            <input 
              value={msg} 
              onKeyPress={e => e.key === 'Enter' && sendMsg()}
              onChange={e=>setMsg(e.target.value)} 
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-[#b0a102] transition-all text-sm"
              placeholder="Signal message..."
            />
            <button onClick={sendMsg} className="bg-[#b0a102] text-black p-4 rounded-2xl hover:scale-105 transition-all shadow-xl">
              <FaPaperPlane/>
            </button>
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
      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 text-lg
        ${danger 
          ? "bg-[#dd2727]/20 text-[#dd2727] border border-[#dd2727]/30 hover:bg-[#dd2727] hover:text-white" 
          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"}`}
    >
      {children}
    </button>
  );
}
