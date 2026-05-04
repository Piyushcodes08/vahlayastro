

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  increment, 
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import ReactPlayer from 'react-player';
import Header from "../../components/sections/Header/Header";
import Aside from "./Aside";

const VideoDetailsPage = () => {
    const { courseName, videoId } = useParams();
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [ads, setAds] = useState([]);
    const [likes, setLikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [watchedVideos, setWatchedVideos] = useState([]);
    const [orderedVideos, setOrderedVideos] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const userSubRef = doc(db, "subscriptions", user.email);
                getDoc(userSubRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        const courseData = docSnap.data().DETAILS.find(d => Object.keys(d)[0] === courseName);
                        if (courseData) {
                            setWatchedVideos(courseData[courseName].watchedVideos || []);
                        }
                    }
                });
            }
        });
        return () => unsubscribe();
    }, [courseName]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1️⃣ Fetch all videos from Firestore (loop through document IDs)
                const videosRef = collection(db, `videos_${courseName}`);
                const videosSnapshot = await getDocs(videosRef);
    
                let allVideos = videosSnapshot.docs.map(doc => ({
                    id: doc.id,  // Use document ID directly
                    ...doc.data(),
                    thumbnail: doc.data().thumbnail || `https://img.youtube.com/vi/${extractYTId(doc.data().url)}/hqdefault.jpg`,
                    order: doc.data().order || 0,
                    titleOrder: doc.data()["title-order"] || 999  // Default large value if missing
                }));
    
                // 2️⃣ Fetch details of the currently playing video
                const currentVideo = allVideos.find(video => video.id === videoId);
                if (!currentVideo) {
                    console.error("Current video not found in Firestore");
                    return;
                }
    
                let activeVideoTitle = currentVideo.title;
                let activeVideoTitleOrder = currentVideo.titleOrder;
    
                setActiveVideo(currentVideo);
                setLikes(currentVideo.likes || 0);
    
                // 3️⃣ Get videos with the same title first
                let relatedVideos = allVideos.filter(video => video.title === activeVideoTitle);
    
                // 4️⃣ If fewer than 10 videos exist, fetch from the next `title-order`
                if (relatedVideos.length < 10) {
                    let remainingVideos = allVideos
                        .filter(video => video.titleOrder > activeVideoTitleOrder)
                        .sort((a, b) => a.titleOrder - b.titleOrder); // Sort by next title-order
    
                    relatedVideos = [...relatedVideos, ...remainingVideos].slice(0, 10);
                } else {
                    relatedVideos = relatedVideos.slice(0, 10); // Ensure max 10 videos
                }
    
                // 5️⃣ Sort the final list by `order`
                relatedVideos.sort((a, b) => a.order - b.order);
    
                setOrderedVideos(relatedVideos);
    
                // Fetch ads
                const adsRef = collection(db, "ads");
                const adsSnapshot = await getDocs(adsRef);
                setAds(adsSnapshot.docs.map(doc => doc.data()));
    
                // Fetch comments
                const commentsQuery = query(
                    collection(db, "Comments_Vahaly_Astro"),
                    where("courseName", "==", courseName),
                    where("videoId", "==", videoId)
                );
    
                const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
                    const fetchedComments = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setComments(fetchedComments.sort((a, b) => b.timestamp - a.timestamp));
                });
    
                setLoading(false);
                return () => unsubscribeComments();
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };
    
        fetchData();
    }, [courseName, videoId]);
    
    
    
    const extractYTId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const markVideoAsWatched = async () => {
        if (!user) return;

        try {
            const userSubRef = doc(db, "subscriptions", user.email);
            const docSnap = await getDoc(userSubRef);

            if (docSnap.exists()) {
                const subscriptions = docSnap.data().DETAILS;
                const courseIndex = subscriptions.findIndex(d => Object.keys(d)[0] === courseName);

                if (courseIndex !== -1) {
                    const updatedSubs = [...subscriptions];
                    const watched = new Set(updatedSubs[courseIndex][courseName].watchedVideos || []);
                    watched.add(videoId);

                    updatedSubs[courseIndex][courseName].watchedVideos = Array.from(watched);

                    await updateDoc(userSubRef, {
                        DETAILS: updatedSubs
                    });
                    setWatchedVideos(Array.from(watched));
                }
            }
        } catch (err) {
            console.error("Error marking video as watched:", err);
        }
    };

    const handleVideoSelect = (video) => {
        navigate(`/course/${courseName}/video/${video.id}`);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            await addDoc(collection(db, "Comments_Vahaly_Astro"), {
                courseName,
                videoId,
                comment: newComment.trim(),
                userName: user.displayName || "Anonymous",
                userId: user.uid,
                timestamp: serverTimestamp(),
            });
            setNewComment("");
        } catch (err) {
            console.error("Error submitting comment:", err);
        }
    };

    const handleLike = async () => {
        if (!user || userLiked) return;

        try {
            const videoRef = doc(db, `videos_${courseName}`, videoId);
            await updateDoc(videoRef, {
                likes: increment(1)
            });
            setUserLiked(true);
            setLikes(prev => prev + 1);
        } catch (err) {
            console.error("Error updating likes:", err);
        }
    };

    const filteredVideos = videos.filter(video =>
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <>
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            <Header />
            <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a] text-white pt-[70px] relative z-10">
                <Aside />
                <main className="flex-1 p-4 md:p-8 flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 lg:w-3/4">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(221,39,39,0.15)] mb-8">
                            <div className="aspect-video relative group">
                                {activeVideo?.url ? (
                                    <ReactPlayer
                                        url={activeVideo.url}
                                        controls
                                        width="100%"
                                        height="100%"
                                        onEnded={markVideoAsWatched}
                                        config={{
                                            file: {
                                                attributes: {
                                                    controlsList: "nodownload"
                                                }
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                                        <p className="text-gray-400 uppercase tracking-widest animate-pulse">Video unavailable</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-6">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                            {activeVideo?.description || "Untitled Video"}
                                        </h1>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-[#b0a102] uppercase tracking-widest">{courseName}</span>
                                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                            <span className="text-xs text-gray-400 uppercase tracking-widest">Lesson {activeVideo?.order || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <button
                                            onClick={handleLike}
                                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                                                userLiked 
                                                    ? "bg-[#dd2727]/10 border-[#dd2727] text-[#dd2727]" 
                                                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                        >
                                            <svg className="w-5 h-5" fill={userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                            </svg>
                                            <span className="font-bold">{likes.toLocaleString()}</span>
                                        </button>
                                        {watchedVideos.includes(videoId) && (
                                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-bold uppercase tracking-widest">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                                Completed
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold uppercase tracking-widest text-white border-l-4 border-[#dd2727] pl-4">Comments <span className="text-gray-500">({comments.length})</span></h2>
                                    
                                    {user && (
                                        <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#dd2727] to-[#b0a102] flex items-center justify-center flex-shrink-0 font-bold text-white shadow-lg">
                                                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Share your thoughts or ask a question..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all min-h-[100px] resize-none"
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        className="px-8 py-2.5 bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                                    >
                                                        Post Comment
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    <div className="space-y-6 mt-10">
                                        {comments.length > 0 ? comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-4 items-start group">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 font-bold text-gray-400 group-hover:bg-[#dd2727]/20 group-hover:text-[#dd2727] transition-colors">
                                                    {comment.userName ? comment.userName[0].toUpperCase() : "?"}
                                                </div>
                                                <div className="flex-1 bg-white/5 rounded-2xl p-5 border border-white/5 group-hover:border-white/10 transition-all">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-bold text-white text-sm">{comment.userName}</h3>
                                                        <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                                                            {comment.timestamp ? new Date(comment.timestamp.toDate()).toLocaleDateString() : "Just now"}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed">{comment.comment}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 text-gray-500 italic">No comments yet. Be the first to start the conversation!</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:w-1/4 space-y-8">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b0a102] mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#b0a102] rounded-full animate-pulse"></span>
                                Course Sequence
                            </h3>
                            
                            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                {orderedVideos.map((video) => (
                                    <div
                                        key={video.id}
                                        onClick={() => handleVideoSelect(video)}
                                        className={`group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${
                                            video.id === videoId 
                                                ? "bg-[#dd2727]/10 border-[#dd2727]/50 shadow-[0_0_15px_rgba(221,39,39,0.2)]" 
                                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className="relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
                                            <img
                                                src={video.thumbnail}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?w=200&auto=format&fit=crop'; }}
                                            />
                                            {watchedVideos.includes(video.id) && (
                                                <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-xs font-bold uppercase tracking-wide truncate ${video.id === videoId ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                                                {video.description || "Lesson " + video.order}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">
                                                {video.duration || 'Video'} • Lesson {video.order}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {ads.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-4">Sponsored Cosmic Guidance</h3>
                                {ads.map((ad, index) => (
                                    <a
                                        key={index}
                                        href={ad.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group"
                                    >
                                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
                                            <img src={ad.imageUrl} alt={ad.title} className="w-full h-40 object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <p className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-[#dd2727] transition-colors">{ad.title}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </aside>
                </main>
            </div>
        </>
    );
};

export default VideoDetailsPage;