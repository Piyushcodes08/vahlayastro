import React, { useEffect, useState,useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { PieChart } from "react-minimal-pie-chart";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebaseConfig";
import QandASection from "./QuestionAndAns"; // Your Q&A section component
import '@whereby.com/browser-sdk/embed';
import Draggable from 'react-draggable';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Aside from '../pages/Aside'
import Header from "../../components/sections/Header/Header";

const PersonalCourse = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [validityPercentage, setValidityPercentage] = useState("0");
  const [totalVideos, setTotalVideos] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [iframeUrl, setIframeUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [courseType, setCourseType] = useState(null);
  const [groupedVideos, setGroupedVideos] = useState({});
  const [upcomingEMIs, setUpcomingEMIs] = useState([]);
    const swiperNavRefs = useRef([]);
  

  const [formData, setFormData] = useState({
    profilePic: "",
    email: "NA",
  });

  const auth = getAuth();

  /**
   * -----------------------
   *  FETCH COURSE DATA
   * -----------------------
   */
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setVideos([]);
      setStudyMaterials([]);

      try {
        // Check course type (free or paid)
        const courseDoc = doc(db, "freeCourses", courseName);
        const courseSnapshot = await getDoc(courseDoc);
        if (courseSnapshot.exists()) {
          setCourseType(courseSnapshot.data().type);
        }

        // Fetch Videos
        const videosRef = collection(db, `videos_${courseName}`);
        const videosSnapshot = await getDocs(videosRef);
        const fetchedVideos = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(fetchedVideos);
        setTotalVideos(fetchedVideos.length);

        // Group videos by `title` and sort them by `title-order` and `order`
        const grouped = {};
        const titleOrders = {};
        fetchedVideos.forEach((video) => {
          const title = video.title.trim();
          const titleOrder = video["title-order"] || 999;
          const videoOrder = video.order || 999;

          if (!grouped[title]) {
            grouped[title] = [];
            titleOrders[title] = titleOrder;
          }
          grouped[title].push({ ...video, videoOrder });
        });

        const sortedGroups = Object.keys(grouped)
          .sort((a, b) => titleOrders[a] - titleOrders[b])
          .reduce((acc, key) => {
            acc[key] = grouped[key].sort((a, b) => a.videoOrder - b.videoOrder);
            return acc;
          }, {});
        setGroupedVideos(sortedGroups);

        // Fetch Study Materials
        const materialsRef = collection(db, `materials_${courseName}`);
        const materialsSnapshot = await getDocs(materialsRef);
        const fetchedMaterials = materialsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudyMaterials(fetchedMaterials);

        // Check subscription details if user is logged in
        if (userEmail) {
          const userSubscriptionRef = doc(db, "subscriptions", userEmail);
          const subscriptionSnapshot = await getDoc(userSubscriptionRef);
          if (subscriptionSnapshot.exists()) {
            const subscriptionData = subscriptionSnapshot.data();

            if (courseType === "free") {
              if (
                subscriptionData.freecourses &&
                subscriptionData.freecourses.includes(courseName)
              ) {
                setWatchedVideos([]);
              }
            } else {
              const courseDetails = subscriptionData.DETAILS.find(
                (detail) => Object.keys(detail)[0] === courseName
              );
              if (courseDetails) {
                const courseInfo = courseDetails[courseName];
                const isFreeCourse = courseInfo.isFree;

                if (isFreeCourse) {
                  setValidityPercentage(null);
                } else {
                  let daysLeft = 0;
                  let usedDays = 0;
                  let totalDays = 0;

                  if (courseInfo.subscriptionDate && courseInfo.expiryDate) {
                    const subDate = new Date(courseInfo.subscriptionDate);
                    const expDate = new Date(courseInfo.expiryDate);
                    const now = new Date();

                    const totalTime = expDate.getTime() - subDate.getTime();
                    totalDays = Math.floor(totalTime / (1000 * 3600 * 24));

                    const usedTime = now.getTime() - subDate.getTime();
                    usedDays =
                      usedTime > 0
                        ? Math.floor(usedTime / (1000 * 3600 * 24))
                        : 0;

                    const rawDaysLeft = totalDays - usedDays;
                    daysLeft = rawDaysLeft < 0 ? 0 : rawDaysLeft;
                  }

                  if (totalDays > 0) {
                    const validityPercent = Math.floor(
                      (daysLeft / totalDays) * 100
                    );
                    setValidityPercentage(validityPercent.toString());
                  } else {
                    setValidityPercentage("0");
                  }
                }
                setWatchedVideos(courseInfo.watchedVideos || []);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseName, userEmail, courseType]);


  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const snap = await getDocs(collection(db, 'meetings'));
        const allMeetings = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Filter meeting by courseName
        const courseMeeting = allMeetings.find(
          (m) => m.courseId === courseName
        );

        if (courseMeeting && courseMeeting.viewerRoomUrl) {
          setMeetingUrl(courseMeeting.viewerRoomUrl);
        }
      } catch (err) {
        console.error('Error fetching meetings:', err);
      }
    };

    fetchMeetings();
  }, [courseName]);

  const handleOpenPopup = (url) => {
    setIframeUrl(url);
    setShowIframe(true);
    setIsFullscreen(false);
    localStorage.setItem('liveMeeting', JSON.stringify({ url, isFullscreen: false }));
  };

  const handleClosePopup = () => {
    setShowIframe(false);
    setIframeUrl('');
    setIsFullscreen(false);
    localStorage.removeItem('liveMeeting');
  };

  console.log(meetings)
  /**
   * -----------------------
   *  FETCH EMI DETAILS
   * -----------------------
   */
  useEffect(() => {
    const fetchEMIDetails = async () => {
      if (!userEmail) return;

      try {
        const paymentsRef = collection(db, "payments");
        const q1 = query(paymentsRef, where("userId", "==", userEmail));
        const querySnapshot = await getDocs(q1);

        const emiDetails = [];

        for (const paymentDoc of querySnapshot.docs) {
          const paymentData = paymentDoc.data();

          // Get EMI plan details
          const emiPlanRef = doc(db, "emiPlans", paymentData.planId);
          const emiPlanSnap = await getDoc(emiPlanRef);

          if (emiPlanSnap.exists()) {
            const emiPlan = emiPlanSnap.data();
            const totalEMIs = emiPlan.duration;

            // Find latest paid EMI number
            const paidEMIs = await getDocs(
              query(
                collection(db, "payments"),
                where("userId", "==", userEmail),
                where("planId", "==", paymentData.planId),
                where("status", "==", "paid")
              )
            );

            const nextEMINumber = paidEMIs.size + 1;

            if (nextEMINumber <= totalEMIs) {
              // Calculate due date (example: monthly payments)
              const lastPaymentDate =
                paymentData.timestamp?.toDate() || new Date();
              const dueDate = new Date(lastPaymentDate);
              dueDate.setMonth(dueDate.getMonth() + (nextEMINumber - 1));

              // Calculate days remaining
              const today = new Date();
              const timeDiff = dueDate.getTime() - today.getTime();
              const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

              emiDetails.push({
                courseId: paymentData.courseId,
                emiNumber: nextEMINumber,
                dueDate,
                daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
                amountDue: emiPlan.amount,
                planId: paymentData.planId,
              });
            }
          }
        }

        // Sort by days remaining ascending
        setUpcomingEMIs(emiDetails.sort((a, b) => a.daysRemaining - b.daysRemaining));
      } catch (error) {
        console.error("Error fetching EMI details:", error);
      }
    };

    fetchEMIDetails();
  }, [userEmail]);

  /**
   * -----------------------
   *  SUBSCRIPTION VALIDITY
   * -----------------------
   */
  const SubscriptionValidity = () => {
    if (courseType === "free") {
      // For free courses, no subscription validity chart
      return null;
    }

    return (
      <div className="bg-red-100 p-4 rounded-lg shadow-md w-72 h-auto">
        <h3 className="text-lg font-semibold text-center text-red-600 mb-2">
          Subscription Validity
        </h3>
        {typeof validityPercentage === "string" &&
          validityPercentage === "Lifetime Access" ? (
          <p className="text-center text-xl text-red-700">Lifetime Access</p>
        ) : validityPercentage === "0" ? (
          <p className="text-center text-xl text-red-700">Expired</p>
        ) : (
          <div>
            <PieChart
              data={[
                {
                  title: "Remaining",
                  value: parseInt(validityPercentage) || 0,
                  color: "#FF5252",
                },
                {
                  title: "Expired",
                  value: 100 - (parseInt(validityPercentage) || 0),
                  color: "#fcfafa",
                },
              ]}
              lineWidth={20}
              rounded
              animate
            />
            <p className="text-center mt-2 text-red-700">
              {validityPercentage || 0}% Validity Remaining
            </p>
          </div>
        )}
      </div>
    );
  };

  /**
   * -----------------------
   *  REAL-TIME WATCHED VIDEOS
   * -----------------------
   */
  useEffect(() => {
    if (!userEmail || courseType === "free") return;

    const userSubscriptionRef = doc(db, "subscriptions", userEmail);
    const unsubscribe = onSnapshot(userSubscriptionRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const subscriptionData = docSnapshot.data();
        console.log(subscriptionData)
        const courseDetails = subscriptionData.DETAILS.find(

          (detail) => Object.keys(detail)[0] === courseName

        );
        if (courseDetails) {
          const watchedVideosList = courseDetails[courseName].watchedVideos || [];
          setWatchedVideos(watchedVideosList);
        }
      }
    });
    return () => unsubscribe();
  }, [courseName, userEmail, courseType]);

  /**
   * -----------------------
   *  MODULES COVERED
   * -----------------------
   */
  const calculateModulesCovered = () => {
    if (courseType === "free") return 0;
    if (!groupedVideos || !watchedVideos) return 0;

    let modulesCovered = 0;
    const moduleTitles = Object.keys(groupedVideos);

    moduleTitles.forEach((title) => {
      const videosInModule = groupedVideos[title];
      const totalVideosInModule = videosInModule.length;
      const watchedVideosInModule = videosInModule.filter((video) =>
        watchedVideos.includes(video.id)
      ).length;
      if (watchedVideosInModule === totalVideosInModule) {
        modulesCovered++;
      }
    });

    return modulesCovered;
  };

  const modulesCovered = calculateModulesCovered();
  const totalModules = Object.keys(groupedVideos).length;
  const modulesCoveredPercentage =
    totalModules > 0 ? Math.round((modulesCovered / totalModules) * 100) : 0;

  /**
   * -----------------------
   *  COURSE PROGRESS (VIDEOS)
   * -----------------------
   */
  const calculateWatchedPercentage = () => {
    if (courseType === "free") return 0;
    if (totalVideos === 0) return 0;
    return Math.round((watchedVideos.length / totalVideos) * 100);
  };
  const watchedPercentage = calculateWatchedPercentage();

  /**
   * -----------------------
   *  MARK VIDEO AS WATCHED
   * -----------------------
   */
  const handleMarkAsWatched = async (videoId) => {
    if (!userEmail || courseType === "free") return;

    try {
      const userSubscriptionRef = doc(db, "subscriptions", userEmail);
      const subscriptionSnapshot = await getDoc(userSubscriptionRef);

      if (subscriptionSnapshot.exists()) {
        const subscriptionData = subscriptionSnapshot.data();
        const courseDetails = subscriptionData.DETAILS.find(
          (detail) => Object.keys(detail)[0] === courseName
        );
        if (courseDetails) {
          const updatedWatchedVideos = courseDetails[courseName].watchedVideos || [];
          if (!updatedWatchedVideos.includes(videoId)) {
            updatedWatchedVideos.push(videoId);

            const updatedDetails = subscriptionData.DETAILS.map((detail) => {
              const courseKey = Object.keys(detail)[0];
              if (courseKey === courseName) {
                return {
                  [courseKey]: {
                    ...detail[courseKey],
                    watchedVideos: updatedWatchedVideos,
                  },
                };
              }
              return detail;
            });

            await updateDoc(userSubscriptionRef, { DETAILS: updatedDetails });
            setWatchedVideos(updatedWatchedVideos);
          }
        }
      }
    } catch (error) {
      console.error("Error updating watched videos:", error);
    }
  };

  /**
   * -----------------------
   *  TRACK LOGGED-IN USER
   * -----------------------
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserEmail(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  /**
   * -----------------------
   *  FETCH LATEST MEETING
   * -----------------------
   */
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const meetingsRef = collection(db, 'meetings');
        const q = query(meetingsRef, where('courseId', '==', courseName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const meetingDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMeetings(meetingDocs);
        } else {
          setMeetings([]);
        }
      } catch (err) {
        console.error('Error fetching meetings:', err);
      }
    };

    if (courseName) {
      fetchMeetings();
    }
  }, [courseName]);
  console.log(meetings)
  /**
   * -----------------------
   *  JOIN LIVE SESSION
   * -----------------------
   */
  const handleRedirect = () => {
    if (meetings.length > 0) {
      const latestMeeting = meetings[meetings.length - 1];
      const url = latestMeeting.viewerRoomUrl || latestMeeting.ringCentralMeeting?.viewerRoomUrl;
      if (url && url.startsWith("http")) {
        setIframeUrl(url);
        setShowIframe(true);
      } else {
        alert("Valid meeting URL not found.");
      }
    } else {
      alert("No meeting found for this course.");
    }
  };




  /**
   * -----------------------
   *  LOADING STATE
   * -----------------------
   */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );
  }

  /**
   * -----------------------
   *  NO DATA
   * -----------------------
   */
  if (!videos.length && !studyMaterials.length) {
    return (
      <div className="text-center mt-10 text-red-500">
        No data found for <strong>{courseName}</strong>.
      </div>
    );
  }

  /**
   * -----------------------
   *  RENDER COMPONENT
   * -----------------------
   */
  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10">
        {/* SIDEBAR */}
        <Aside />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_30px_rgba(221,39,39,0.1)] w-full mx-auto overflow-x-hidden">
        {/* Course Name */}
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white text-center border-b border-white/10 pb-6 uppercase tracking-wider">
          <span className="text-[#dd2727]">{courseName}</span>
        </h1>

        {/* Live Session Marquee */}
        {meetings.length > 0 && (
          <Link to={`/${courseName}/meetings`}>
            <div className="bg-gradient-to-r from-[#dd2727]/20 to-[#b0a102]/20 border border-[#dd2727]/30 text-white p-4 mb-8 rounded-xl hover:bg-[#dd2727]/30 transition-all text-center font-bold uppercase tracking-wider animate-pulse flex items-center justify-center shadow-[0_0_15px_rgba(221,39,39,0.2)]">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"></span>
              Click Here to join Live Session for {courseName}
            </div>
          </Link>
        )}






        {/* Upcoming EMI Payments */}
        {upcomingEMIs.length > 0 && (
          <div className="mb-8 p-6 bg-black/20 border border-[#dd2727]/30 rounded-2xl shadow-[0_0_20px_rgba(221,39,39,0.1)]">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center">
               <span className="text-[#dd2727] mr-2">⚠</span> Upcoming EMI Payments
            </h3>
            <div className="space-y-4">
            {upcomingEMIs.map((emi, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col">
                    <h4 className="font-bold text-white text-lg">Course: <span className="text-[#dd2727]">{emi.courseId}</span></h4>
                    <p className="text-gray-300 font-medium mt-1">EMI #{emi.emiNumber} Due</p>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">
                      Due Date: <span className="text-gray-200">{emi.dueDate.toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-start md:items-end w-full md:w-auto">
                    <p
                      className={`text-lg font-bold ${emi.daysRemaining <= 3 ? "text-[#dd2727]" : "text-green-400"
                        }`}
                    >
                      {emi.daysRemaining} days left
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">₹{emi.amountDue}</p>
                    <Link
                      to={`/finalize`}
                      className="mt-4 px-8 py-2 rounded-lg bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(221,39,39,0.3)] w-full md:w-auto text-center"
                    >
                      Pay Now
                    </Link>
                  </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Top Row: Validity, Progress, Modules, Study Materials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Subscription Validity (Paid Courses) */}
          {courseType !== "free" && (
            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center hover:border-white/20 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 text-center uppercase tracking-wider">
                Subscription
              </h3>
              {typeof validityPercentage === "string" && validityPercentage === "Lifetime Access" ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-center text-2xl font-bold text-[#b0a102] drop-shadow-[0_0_10px_rgba(176,161,2,0.5)]">Lifetime<br/>Access</p>
                </div>
              ) : validityPercentage === "0" ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-center text-2xl font-bold text-[#dd2727] drop-shadow-[0_0_10px_rgba(221,39,39,0.5)]">Expired</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center relative" style={{ width: "140px", height: "140px" }}>
                    <PieChart
                      data={[
                        {
                          title: "Remaining",
                          value: parseInt(validityPercentage) || 0,
                          color: "#dd2727",
                        },
                        {
                          title: "Expired",
                          value: 100 - (parseInt(validityPercentage) || 0),
                          color: "rgba(255,255,255,0.1)",
                        },
                      ]}
                      lineWidth={20}
                      rounded
                      animate
                      style={{ height: "140px", width: "140px" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-white">{validityPercentage || 0}%</span>
                    </div>
                  </div>
                  <p className="text-center mt-4 text-sm text-gray-400 font-medium uppercase tracking-wider">
                    Validity Remaining
                  </p>
                </>
              )}
            </div>
          )}

          {/* Course Progress */}
          <div className="bg-black/20 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center hover:border-white/20 transition-all">
            <h3 className="text-lg font-bold text-white mb-4 text-center uppercase tracking-wider">
              Course Progress
            </h3>
            {courseType !== "free" ? (
              <>
                <div className="flex items-center justify-center relative" style={{ width: "140px", height: "140px" }}>
                  <PieChart
                    data={[
                      { title: "Watched", value: watchedPercentage, color: "#b0a102" },
                      { title: "Remaining", value: 100 - watchedPercentage, color: "rgba(255,255,255,0.1)" },
                    ]}
                    lineWidth={20}
                    rounded
                    animate
                    style={{ height: "140px", width: "140px" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-white">{watchedPercentage}%</span>
                  </div>
                </div>
                <p className="text-center mt-4 text-sm text-gray-400 font-medium uppercase tracking-wider">
                  {watchedVideos.length}/{totalVideos} Videos Watched
                </p>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-center text-gray-400 italic">
                  Progress tracking is not available for free courses.
                </p>
              </div>
            )}
          </div>

          {/* Modules Covered (Paid Courses) */}
          {courseType !== "free" && totalModules > 0 && (
            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center hover:border-white/20 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 text-center uppercase tracking-wider">
                Modules Covered
              </h3>
              <div className="flex items-center justify-center relative" style={{ width: "140px", height: "140px" }}>
                <PieChart
                  data={[
                    { title: "Covered", value: modulesCovered, color: "#dd2727" },
                    {
                      title: "Remaining",
                      value: totalModules - modulesCovered,
                      color: "rgba(255,255,255,0.1)",
                    },
                  ]}
                  lineWidth={20}
                  rounded
                  animate
                  style={{ height: "140px", width: "140px" }}
                />
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-white">{modulesCoveredPercentage}%</span>
                  </div>
              </div>
              <p className="text-center mt-4 text-sm text-gray-400 font-medium uppercase tracking-wider">
                {modulesCovered}/{totalModules} Modules Covered
              </p>
            </div>
          )}

          {/* Study Materials */}
          {studyMaterials.length > 0 && (
            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col hover:border-white/20 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 text-center uppercase tracking-wider">
                Study Materials
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[160px] custom-scrollbar pr-2">
                {studyMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col items-start hover:bg-white/10 transition-colors"
                  >
                    <h4 className="text-white font-medium mb-2 text-sm">
                      {material.title}
                    </h4>
                    <a
                      href={material.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-wider text-white bg-white/10 border border-white/20 px-4 py-1.5 rounded-lg hover:bg-[#dd2727] hover:border-[#dd2727] transition-all shadow-md w-full text-center"
                    >
                      Download PDF
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


       {/* COURSE VIDEOS */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                  Course <span className="text-[#dd2727]">Videos</span>
                </h2>
                {Object.keys(groupedVideos).reverse().map((title, index) => {
                  // Initialize navigation refs
                  if (!swiperNavRefs.current[index]) {
                    swiperNavRefs.current[index] = {
                      prev: React.createRef(),
                      next: React.createRef(),
                    };
                  }
      
                  const { prev, next } = swiperNavRefs.current[index];
      
                  return (
                    <div key={index} className="mb-10 p-6 bg-black/20 border border-white/10 rounded-2xl">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#dd2727] rounded-full inline-block"></span>
                        {title}
                      </h3>
      
                      {/* Swiper Container */}
                      <div className="relative group px-8">
                        {/* Left Nav */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button ref={prev}>
                            <FaChevronLeft className="text-white w-10 h-10 bg-black/50 border border-white/20 rounded-full p-2 backdrop-blur hover:bg-[#dd2727] transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                          </button>
                        </div>
      
                        <Swiper
                          modules={[Navigation, Pagination]}
                          navigation={{
                            prevEl: prev.current,
                            nextEl: next.current,
                          }}
                          onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prev.current;
                            swiper.params.navigation.nextEl = next.current;
                          }}
                          pagination={{ clickable: true, dynamicBullets: true }}
                          spaceBetween={20}
                          slidesPerView={1}
                          breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                          }}
                          className="w-full pb-10"
                        >
                          {groupedVideos[title].map((video) => (
                            <SwiperSlide key={video.id} className="h-auto">
                              <div className="bg-white/5 border border-white/10 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(221,39,39,0.15)] hover:border-white/20 h-full flex flex-col group/card">
                                <Link to={`/course/${courseName}/video/${video.id}`} className="flex flex-col h-full">
                                  <div className="relative w-full aspect-video bg-black overflow-hidden border-b border-white/10">
                                    <video
                                      src={video.url}
                                      className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                                      controlsList="nodownload"
                                      onEnded={() => handleMarkAsWatched(video.id)}
                                      muted
                                    />
                                    {/* Play icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                      <div className="w-12 h-12 rounded-full bg-[#dd2727]/80 flex items-center justify-center shadow-[0_0_20px_rgba(221,39,39,0.5)]">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 flex-1 flex flex-col">
                                    <p className="text-white font-bold text-sm line-clamp-2 group-hover/card:text-[#dd2727] transition-colors">
                                      {video.description}
                                    </p>
                                    {watchedVideos.includes(video.id) && (
                                       <span className="mt-auto pt-3 inline-flex items-center text-xs font-bold text-green-400 uppercase tracking-wider">
                                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                          Watched
                                       </span>
                                    )}
                                  </div>
                                </Link>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
      
                        {/* Right Nav */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button ref={next}>
                            <FaChevronRight className="text-white w-10 h-10 bg-black/50 border border-white/20 rounded-full p-2 backdrop-blur hover:bg-[#dd2727] transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
      


        {/* Q&A SECTION */}
        <div className="mb-8">
          <QandASection courseName={courseName} />
        </div>

        </div>
      </main>
    </div>
    </>
  );
};

export default PersonalCourse;
