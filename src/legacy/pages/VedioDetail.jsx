

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
        <div className="admin-layout min-h-screen flex flex-col">
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            <Header />

            <div className="flex flex-1 relative z-10 pt-16">
                <Aside />
                <main className="flex-1 admin-fluid-container bg-gray-50/50 p-4 md:p-8 flex flex-col lg:flex-row gap-8">

                    {/* Main Video Column */}
                    <div className="flex-1 lg:w-3/4 space-y-6">
                        <div className="admin-card overflow-hidden bg-white">
                            {/* Video Player */}
                            <div className="aspect-video relative bg-slate-900">
                                {activeVideo?.url ? (
                                    <ReactPlayer
                                        url={activeVideo.url}
                                        controls
                                        width="100%"
                                        height="100%"
                                        onEnded={markVideoAsWatched}
                                        config={{
                                            file: {
                                                attributes: { controlsList: "nodownload" }
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Video unavailable</p>
                                    </div>
                                )}
                            </div>

                            {/* Video Info */}
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">
                                            {activeVideo?.description || "Untitled Video"}
                                        </h1>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-[#dd2727] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">{courseName}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lesson {activeVideo?.order || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${userLiked
                                                    ? "bg-red-50 border-red-200 text-[#dd2727]"
                                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-red-200 hover:text-[#dd2727]"
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill={userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {likes.toLocaleString()}
                                        </button>
                                        {watchedVideos.includes(videoId) && (
                                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-[9px] font-black uppercase tracking-widest">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                Completed
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Comments */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Comments</h2>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full">{comments.length}</span>
                                    </div>

                                    {user && (
                                        <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-xl bg-[#dd2727] flex items-center justify-center flex-shrink-0 font-black text-white text-sm shadow-lg">
                                                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Share your thoughts or ask a question..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#dd2727]/20 focus:border-[#dd2727] transition-all min-h-[100px] resize-none font-medium"
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        className="bg-[#dd2727] text-white px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                                    >
                                                        Post Comment
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    <div className="space-y-4 mt-6">
                                        {comments.length > 0 ? comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-4 items-start group">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 font-black text-slate-500 text-sm group-hover:bg-[#dd2727] group-hover:text-white group-hover:border-[#dd2727] transition-all">
                                                    {comment.userName ? comment.userName[0].toUpperCase() : "?"}
                                                </div>
                                                <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100 group-hover:border-slate-200 transition-all">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">{comment.userName}</h3>
                                                        <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                                            {comment.timestamp ? new Date(comment.timestamp.toDate()).toLocaleDateString() : "Just now"}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{comment.comment}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 admin-card border-dashed">
                                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No comments yet. Be the first!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Playlist */}
                    <aside className="lg:w-1/4 space-y-6">
                        <div className="admin-card p-6 bg-white sticky top-24">
                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#dd2727] rounded-full animate-pulse"></span>
                                Course Sequence
                            </h3>

                            <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                                {orderedVideos.map((video) => (
                                    <div
                                        key={video.id}
                                        onClick={() => handleVideoSelect(video)}
                                        className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${video.id === videoId
                                                ? "bg-red-50 border-red-100"
                                                : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-slate-100"
                                            }`}
                                    >
                                        <div className="relative w-16 h-11 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
                                            <img
                                                src={video.thumbnail}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?w=200&auto=format&fit=crop'; }}
                                            />
                                            {watchedVideos.includes(video.id) && (
                                                <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-[10px] font-bold tracking-wide truncate leading-snug ${video.id === videoId ? "text-[#dd2727]" : "text-slate-700"}`}>
                                                {video.description || "Lesson " + video.order}
                                            </h4>
                                            <p className="text-[9px] text-slate-400 mt-0.5 font-black uppercase tracking-widest">
                                                Lesson {video.order}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {ads.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Sponsored</p>
                                {ads.map((ad, index) => (
                                    <a key={index} href={ad.link} target="_blank" rel="noopener noreferrer" className="block group">
                                        <div className="admin-card overflow-hidden hover:border-slate-300 transition-all">
                                            <img src={ad.imageUrl} alt={ad.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="p-4">
                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest group-hover:text-[#dd2727] transition-colors">{ad.title}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </aside>
                </main>
            </div>
        </div>
    );
};

export default VideoDetailsPage;

