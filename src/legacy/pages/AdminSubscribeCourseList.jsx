import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import Admin from "./Admin";
import Header from "../../components/sections/Header/Header";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const AdminEnrolledUsers = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [expend, setExpend] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [courses, setCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [newSubscriber, setNewSubscriber] = useState({
    userId: "",
    course: "",
    courseType: "paid",
    status: "active",
    subscriptionDate: today,
    expiryDate: expiry,
  });

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "paidCourses"), (snapshot) => {
      const paid = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        title: doc.data().title || doc.id,
        type: "paid" 
      }));
      paid.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      setCourses(paid);
      setAllCourses((prev) => {
        const free = prev.filter((c) => c.type === "free");
        return [...free, ...paid];
      });
    });

    const unsub2 = onSnapshot(collection(db, "freeCourses"), (snapshot) => {
      const free = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        title: doc.data().title || doc.id,
        type: "free" 
      }));
      free.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      setFreeCourses(free);
      setAllCourses((prev) => {
        const paid = prev.filter((c) => c.type === "paid");
        return [...paid, ...free];
      });
    });

    const unsub3 = onSnapshot(collection(db, "subscriptions"), (snapshot) => {
      const updated = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscriptions(updated);
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const userRef = doc(db, "subscriptions", newSubscriber.userId);
      const existingUser = subscriptions.find(
        (sub) => sub.id === newSubscriber.userId
      );

      if (newSubscriber.courseType === "paid") {
        const existingDetails = existingUser?.DETAILS || [];
        const courseKey = newSubscriber.course;

        const alreadyExists = existingDetails.some(
          (detail) => detail[courseKey]
        );

        if (alreadyExists) {
          setErrorMessage("User already subscribed to this course.");
          return;
        }

        const newEntry = {
          [courseKey]: {
            subscriptionDate: new Date(
              newSubscriber.subscriptionDate
            ).toISOString(),
            expiryDate: new Date(newSubscriber.expiryDate).toISOString(),
            status: newSubscriber.status,
          },
        };

        await setDoc(
          userRef,
          { DETAILS: [...existingDetails, newEntry] },
          { merge: true }
        );
      } else {
        const existingFree = existingUser?.freecourses || [];
        if (!existingFree.includes(newSubscriber.course)) {
          existingFree.push(newSubscriber.course);
        }
        await setDoc(userRef, { freecourses: existingFree }, { merge: true });
      }

      setSuccessMessage("Subscriber added successfully!");
      setNewSubscriber({
        userId: "",
        course: "",
        courseType: "paid",
        status: "active",
        subscriptionDate: today,
        expiryDate: expiry,
      });
    } catch (err) {
      setErrorMessage("Error adding subscriber: " + err.message);
    }
  };

  const handleDeleteCourse = async (userId, courseName) => {
    const userRef = doc(db, "subscriptions", userId);
    const userSub = subscriptions.find((sub) => sub.id === userId);

    if (!userSub || !courseName) return;

    if (
      window.confirm(
        `Are you sure you want to remove "${courseName}" for user "${userId}"?`
      )
    ) {
      if (userSub.DETAILS?.some((d) => Object.keys(d)[0] === courseName)) {
        const updated = userSub.DETAILS.filter(
          (d) => Object.keys(d)[0] !== courseName
        );
        await updateDoc(userRef, { DETAILS: updated });
      }

      if (userSub.freecourses?.includes(courseName)) {
        const updatedFree = userSub.freecourses.filter((c) => c !== courseName);
        await updateDoc(userRef, { freecourses: updatedFree });
      }
    }
  };

  const filteredSubscribers =
    selectedCourse !== ""
      ? subscriptions.filter((sub) => {
          const paid = sub.DETAILS?.map((c) => Object.keys(c)[0]) || [];
          const free = sub.freecourses || [];
          return paid.includes(selectedCourse) || free.includes(selectedCourse);
        })
      : subscriptions;

  const handleExpand = () => {
    setExpend(!expend);
  };

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen bg-transparent text-white pt-[70px] relative z-10 premium-container">
        <Aside />

        <main className="flex-1 p-4 md:p-8">
          <div className="space-y-8">
          {/* Add New Subscriber Section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-wider">
                ADD NEW <span className="text-[#dd2727]">SUBSCRIBER</span>
              </h2>
              <button 
                onClick={handleExpand} 
                className={`p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 ${expend ? 'rotate-180' : ''}`}
              >
                <IoIosArrowDown size={24} />
              </button>
            </div>

            {expend && (
              <form onSubmit={handleAddSubscriber} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email / User ID</label>
                    <input
                      type="text"
                      required
                      placeholder="user@example.com"
                      value={newSubscriber.userId}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, userId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Course Type</label>
                    <select
                      value={newSubscriber.courseType}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, courseType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all appearance-none cursor-pointer"
                    >
                      <option value="paid" className="bg-[#1a1a1a]">Paid Course</option>
                      <option value="free" className="bg-[#1a1a1a]">Free Course</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Course</label>
                    <select
                      required
                      value={newSubscriber.course}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, course: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1a1a]">Select Course</option>
                      {newSubscriber.courseType === "paid"
                        ? courses.map((c) => (
                            <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                              {c.title}
                            </option>
                          ))
                        : freeCourses.map((c) => (
                            <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                              {c.title}
                            </option>
                          ))}
                    </select>
                  </div>

                  {newSubscriber.courseType === "paid" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subscription Date</label>
                        <input
                          type="date"
                          value={newSubscriber.subscriptionDate}
                          onChange={(e) => setNewSubscriber({ ...newSubscriber, subscriptionDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expiry Date</label>
                        <input
                          type="date"
                          value={newSubscriber.expiryDate}
                          onChange={(e) => setNewSubscriber({ ...newSubscriber, expiryDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all"
                        />
                      </div>
                    </>
                  )}
                </div>

                {errorMessage && <p className="text-red-500 text-sm font-medium">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-sm font-medium">{successMessage}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(221,39,39,0.4)] transform hover:scale-[1.01] transition-all duration-300"
                >
                  Add Subscriber
                </button>
              </form>
            )}
          </div>

          {/* Enrolled Users Section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
            <h2 className="text-2xl font-bold tracking-wider mb-8 text-center uppercase">
              Enrolled <span className="text-[#dd2727]">Users</span>
            </h2>

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Filter by Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a1a]">All Courses</option>
                  {allCourses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!selectedCourse && (
                  <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    Select a course to enable delete
                  </p>
                )}
                <p className="text-sm font-medium tracking-wide">
                  TOTAL SUBSCRIBERS: <strong className="text-[#dd2727] text-lg ml-2">{filteredSubscribers.length}</strong>
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User ID / Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-sm font-medium text-white">{sub.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{sub.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{sub.phone || "N/A"}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            disabled={!selectedCourse}
                            onClick={() => selectedCourse && handleDeleteCourse(sub.id, selectedCourse)}
                            className={`p-2 rounded-lg transition-all ${
                              !selectedCourse 
                                ? "opacity-20 grayscale cursor-not-allowed" 
                                : "hover:bg-red-500/20 text-red-500"
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
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic font-medium">
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
                  <div key={sub.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</p>
                        <p className="text-sm font-bold text-white">{sub.name || "N/A"}</p>
                      </div>
                      <button
                        disabled={!selectedCourse}
                        onClick={() => selectedCourse && handleDeleteCourse(sub.id, selectedCourse)}
                        className={`p-2 rounded-lg ${!selectedCourse ? "opacity-20" : "bg-red-500/20 text-red-500"}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">User ID / Email</p>
                      <p className="text-sm text-gray-300 break-all">{sub.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-sm text-gray-300">{sub.phone || "N/A"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500 italic">No subscribers found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default AdminEnrolledUsers;
