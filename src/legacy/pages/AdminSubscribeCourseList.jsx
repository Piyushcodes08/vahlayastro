import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import SideBar from "./Admin";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";

const AdminEnrolledUsers = () => {
  const [courses, setCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    name: "",
    userId: "",
    course: "",
    courseType: "paid", // "paid" or "free"
    subscriptionDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchSubscribers(selectedCourse);
    } else {
      setSubscribers([]);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const paidSnapshot = await getDocs(collection(db, "paidCourses"));
      const paidList = paidSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
      }));

      const freeSnapshot = await getDocs(collection(db, "freeCourses"));
      const freeList = freeSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
      }));

      setCourses(paidList);
      setFreeCourses(freeList);
      setAllCourses([...paidList, ...freeList]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const fetchSubscribers = async (courseId) => {
    try {
      const subscribersRef = collection(db, `subscribers_${courseId}`);
      const subscriberSnapshot = await getDocs(subscribersRef);
      const subscriberList = subscriberSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscribers(subscriberList);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const collectionName =
        newSubscriber.courseType === "paid"
          ? `subscribers_${newSubscriber.course}`
          : `subscribers_${newSubscriber.course}`;

      // Check if user is already enrolled in this course
      const docRef = doc(db, collectionName, newSubscriber.userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setErrorMessage("User is already enrolled in this course.");
        return;
      }

      // Add to course subscribers collection
      const enrollmentData = {
        name: newSubscriber.name,
        phone: newSubscriber.phone || "",
        ...(newSubscriber.courseType === "paid" && {
          subscriptionDate: newSubscriber.subscriptionDate,
          expiryDate: newSubscriber.expiryDate,
        }),
      };

      await setDoc(docRef, enrollmentData);

      // Add course ID to user's enrolledCourses array
      const userRef = doc(db, "users", newSubscriber.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const enrolledCourses = userData.enrolledCourses || [];
        if (!enrolledCourses.includes(newSubscriber.course)) {
          await setDoc(
            userRef,
            { enrolledCourses: [...enrolledCourses, newSubscriber.course] },
            { merge: true }
          );
        }
      }

      setSuccessMessage("User enrolled successfully!");
      setNewSubscriber({
        name: "",
        userId: "",
        course: "",
        courseType: "paid",
        subscriptionDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split("T")[0],
      });
      if (selectedCourse === newSubscriber.course) {
        fetchSubscribers(selectedCourse);
      }
    } catch (error) {
      console.error("Error during enrollment:", error);
      setErrorMessage("Failed to enroll user. Please try again.");
    }
  };

  const handleDeleteCourse = async (userId, courseId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this user from the course?"
      )
    )
      return;

    try {
      // 1. Remove from subscribers_CourseID collection
      await deleteDoc(doc(db, `subscribers_${courseId}`, userId));

      // 2. Remove from user's enrolledCourses array in 'users' collection
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const enrolledCourses = userData.enrolledCourses || [];
        const updatedCourses = enrolledCourses.filter((id) => id !== courseId);
        await setDoc(
          userRef,
          { enrolledCourses: updatedCourses },
          { merge: true }
        );
      }

      // 3. Remove from 'subscriptions' collection (used by Student EnrolledCourses page)
      // Note: userId in subscribers_CourseID is typically the email
      const subRef = doc(db, "subscriptions", userId);
      const subSnap = await getDoc(subRef);
      if (subSnap.exists()) {
        const subData = subSnap.data();
        
        // Remove from freecourses array
        const freecourses = subData.freecourses || [];
        const updatedFree = freecourses.filter(id => id !== courseId);
        
        // Remove from DETAILS array (paid courses)
        const details = subData.DETAILS || [];
        const updatedDetails = details.filter(d => Object.keys(d)[0] !== courseId);

        await setDoc(subRef, {
          freecourses: updatedFree,
          DETAILS: updatedDetails
        }, { merge: true });
      }

      setSubscribers(subscribers.filter((sub) => sub.id !== userId));
      alert("User removed from course successfully across all records.");
    } catch (error) {
      console.error("Error removing user from course:", error);
      alert("Failed to remove user completely. Please check Firebase console.");
    }
  };

  const filteredSubscribers = subscribers;

  return (
    <div className="admin-layout flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1 relative z-10">
        <SideBar />

        <main className="flex-1 min-w-0 py-10 pt-20 px-6 md:px-10 bg-white">
          <div className="space-y-12">
            {/* Enrollment Form Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#dd2727] rounded-full"></div>
                  Manual <span className="text-[#dd2727]">Enrollment</span>
                </h2>
                <button
                  onClick={() => setFormVisible(!formVisible)}
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#dd2727] transition-colors"
                >
                  {formVisible ? "[ Hide Form ]" : "[ Show Form ]"}
                </button>
              </div>

              {formVisible && (
                <form onSubmit={handleEnrollment} className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Student Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={newSubscriber.name}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#dd2727]/5 focus:border-[#dd2727] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">User ID / Email</label>
                      <input
                        type="text"
                        required
                        placeholder="user@example.com"
                        value={newSubscriber.userId}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, userId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#dd2727]/5 focus:border-[#dd2727] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Course Type</label>
                      <select
                        value={newSubscriber.courseType}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, courseType: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#dd2727]/5 focus:border-[#dd2727] transition-all appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="paid" className="bg-white">Paid Subscription</option>
                        <option value="free" className="bg-white">Free Access</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Select Course</label>
                      <select
                        required
                        value={newSubscriber.course}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, course: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#dd2727]/5 focus:border-[#dd2727] transition-all appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="" className="bg-white text-slate-400">Choose from library...</option>
                        {newSubscriber.courseType === "paid"
                          ? courses.map((c) => (
                              <option key={c.id} value={c.id} className="bg-white text-slate-900">
                                {c.title}
                              </option>
                            ))
                          : freeCourses.map((c) => (
                              <option key={c.id} value={c.id} className="bg-white text-slate-900">
                                {c.title}
                              </option>
                            ))}
                      </select>
                    </div>

                    {newSubscriber.courseType === "paid" && (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Start Date</label>
                          <input
                            type="date"
                            value={newSubscriber.subscriptionDate}
                            onChange={(e) => setNewSubscriber({ ...newSubscriber, subscriptionDate: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#dd2727]/5 focus:border-[#dd2727] transition-all shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">End Date</label>
                          <input
                            type="date"
                            value={newSubscriber.expiryDate}
                            onChange={(e) => setNewSubscriber({ ...newSubscriber, expiryDate: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#dd2727]/5 focus:border-[#dd2727] transition-all shadow-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {errorMessage && <p className="text-red-500 text-sm font-medium">{errorMessage}</p>}
                  {successMessage && <p className="text-green-500 text-sm font-medium">{successMessage}</p>}

                  <button
                    type="submit"
                    className="w-full bg-[#dd2727] text-white py-4 rounded-xl font-extrabold uppercase tracking-widest hover:shadow-lg hover:shadow-red-500/20 transform hover:scale-[1.01] transition-all duration-300"
                  >
                    Confirm Enrollment
                  </button>
                </form>
              )}
            </div>

            {/* Enrolled Users Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden group">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3 mb-10">
                <div className="w-1.5 h-6 bg-[#b0a102] rounded-full"></div>
                Current <span className="text-[#b0a102]">Enrollments</span>
              </h2>

              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div className="w-full md:w-1/2 lg:w-1/3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by Course</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white">All Courses</option>
                    {allCourses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-white">
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {!selectedCourse && (
                    <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                      Select a course to enable delete
                    </p>
                  )}
                  <p className="text-sm font-medium tracking-wide">
                    TOTAL SUBSCRIBERS: <strong className="text-[#dd2727] text-lg ml-2">{filteredSubscribers.length}</strong>
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User ID / Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {filteredSubscribers.length > 0 ? (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{sub.name || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{sub.id}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{sub.phone || "N/A"}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              disabled={!selectedCourse}
                              onClick={() => selectedCourse && handleDeleteCourse(sub.id, selectedCourse)}
                              className={`p-2 rounded-lg transition-all ${
                                !selectedCourse 
                                  ? "opacity-20 grayscale cursor-not-allowed" 
                                  : "hover:bg-red-50 text-red-500"
                              }`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                          No subscribers found for this selection.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((sub) => (
                    <div key={sub.id} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Name</p>
                          <p className="text-sm font-bold text-slate-900">{sub.name || "N/A"}</p>
                        </div>
                        <button
                          disabled={!selectedCourse}
                          onClick={() => selectedCourse && handleDeleteCourse(sub.id, selectedCourse)}
                          className={`p-2 rounded-lg ${!selectedCourse ? "opacity-20" : "bg-red-50 text-red-500"}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User ID / Email</p>
                        <p className="text-sm text-slate-500 break-all">{sub.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                        <p className="text-sm text-slate-500">{sub.phone || "N/A"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-slate-400 italic">No subscribers found.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminEnrolledUsers;
