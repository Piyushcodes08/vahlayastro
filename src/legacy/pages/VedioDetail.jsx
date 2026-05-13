
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
import Footer from "../../components/sections/Footer/Footer";

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
                        const details = docSnap.data().DETAILS;
                        if (details && Array.isArray(details)) {
                            const courseData = details.find(d => Object.keys(d)[0] === courseName);
                            if (courseData) {
                                setWatchedVideos(courseData[courseName].watchedVideos || []);
                            }
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
                const videosRef = collection(db, `videos_${courseName}`);
                const videosSnapshot = await getDocs(videosRef);

                let allVideos = videosSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const videoUrl = (data.url || data.videoUrl || data.link || "").trim();
                    const ytId = extractYTId(videoUrl);

                    return {
                        id: doc.id,
                        ...data,
                        url: videoUrl,
                        thumbnail: data.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?w=200'),
                        displayTitle: data.description || data.title || "Untitled Lesson",
                        order: parseInt(data.order) || 0,
                        titleOrder: parseInt(data["title-order"]) || 0
                    };
                });

                setVideos(allVideos);

                const currentVideo = allVideos.find(video => video.id === videoId);
                if (!currentVideo) {
                    if (allVideos.length > 0) {
                        navigate(`/course/${courseName}/video/${allVideos[0].id}`);
                    }
                    setLoading(false);
                    return;
                }

                setActiveVideo(currentVideo);
                setLikes(currentVideo.likes || 0);

                const sortedVideos = [...allVideos].sort((a, b) => {
                    if (a.titleOrder !== b.titleOrder) {
                        return a.titleOrder - b.titleOrder;
                    }
                    return a.order - b.order;
                });

                setOrderedVideos(sortedVideos);

                const adsRef = collection(db, "ads");
                const adsSnapshot = await getDocs(adsRef);
                setAds(adsSnapshot.docs.map(doc => doc.data()));

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
        if (!url) return null;
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
                    await updateDoc(userSubRef, { DETAILS: updatedSubs });
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
            await updateDoc(videoRef, { likes: increment(1) });
            setUserLiked(true);
            setLikes(prev => prev + 1);
        } catch (err) {
            console.error("Error updating likes:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-slate-900">
            <Header />

            <div className="flex flex-1 relative z-10 pt-32">
                <Aside />

                <main className="flex-1 p-4 md:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto pt-[50px]">

                    {/* Left Column: Video & Info */}
                    <div className="flex-1 lg:w-3/4 space-y-4 pb-20">

                        {/* Video Player Section */}
                        <div className="bg-black aspect-video relative rounded-xl overflow-hidden shadow-sm">
                            {activeVideo?.url ? (
                                <div className="w-full h-full">
                                    {activeVideo.url.includes('youtube.com') || activeVideo.url.includes('youtu.be') || activeVideo.url.includes('vimeo.com') || activeVideo.url.includes('drive.google.com') ? (
                                        <ReactPlayer url={activeVideo.url} controls playing={true} width="100%" height="100%" onEnded={markVideoAsWatched} />
                                    ) : (
                                        <video key={activeVideo.url} src={activeVideo.url} controls autoPlay muted className="w-full h-full object-contain" onEnded={markVideoAsWatched} />
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full bg-slate-900 text-white/50 text-xs uppercase tracking-widest">Video Unavailable</div>
                            )}
                        </div>

                        {/* Video Title and Likes Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight mb-4">
                                {activeVideo?.displayTitle}
                            </h1>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLike}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-all group"
                                >
                                    <span className={`text-xl ${userLiked ? 'text-red-500' : 'text-slate-400'} group-hover:scale-110 transition-transform`}>❤</span>
                                    <span className="text-sm font-bold text-slate-600">{likes}</span>
                                </button>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                    Module {activeVideo?.titleOrder} • Lesson {activeVideo?.order}
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-lg font-bold text-slate-800">Comments ({comments.length})</h2>
                            </div>

                            <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-red-500 transition-all resize-none h-20 placeholder:text-slate-400"
                                    placeholder="Add a public comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-[#dd2727] text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-red-700 transition-all"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
                                            {comment.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs font-bold text-slate-900">{comment.userName}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                                                    {comment.timestamp?.toDate().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">{comment.comment}</p>
                                        </div>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <p className="text-center py-10 text-slate-400 text-xs font-bold italic uppercase tracking-widest">No comments yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Playlist */}
                    <aside className="lg:w-1/4 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-20">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Course Sequence</h3>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto">
                                {orderedVideos.map((video) => {
                                    const isActive = video.id === videoId;
                                    const isWatched = watchedVideos.includes(video.id);

                                    return (
                                        <button
                                            key={video.id}
                                            onClick={() => handleVideoSelect(video)}
                                            className={`w-full group flex items-center gap-4 p-4 transition-all text-left border-b border-slate-50 ${isActive ? 'bg-red-50 border-l-4 border-l-[#dd2727]' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="relative w-16 aspect-video bg-slate-200 rounded overflow-hidden flex-shrink-0">
                                                <img src={video.thumbnail} alt="" className={`w-full h-full object-cover ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                                                {isWatched && (
                                                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${isActive ? 'text-[#dd2727]' : 'text-slate-400'}`}>
                                                    M{video.titleOrder} • L{video.order}
                                                </p>
                                                <h5 className={`text-xs font-bold truncate ${isActive ? 'text-[#dd2727]' : 'text-slate-700'}`}>
                                                    {video.displayTitle}
                                                </h5>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Ads */}
                        {ads.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Sponsored</p>
                                {ads.map((ad, index) => (
                                    <a key={index} href={ad.link} target="_blank" rel="noopener noreferrer" className="block group">
                                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white group-hover:border-red-300 transition-all shadow-sm">
                                            <img src={ad.imageUrl} alt="" className="w-full aspect-video object-cover" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </aside>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default VideoDetailsPage;
