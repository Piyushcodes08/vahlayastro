import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../firebaseConfig"; // Firebase configuration file
import {  updateProfile } from "firebase/auth";

import Aside from "./Aside";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: "",
    fullName: "NA",
    fathersName: "NA",
    mothersName: "NA",
    dob: "NA",
    email: "NA",
  });
  const [imageFile, setImageFile] = useState(null); // State for uploaded image
  const [loading, setLoading] = useState(true); // Loading state to prevent flickering
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);

      // Fetch user profile from Firestore
      const fetchProfile = async () => {
        const userDocRef = doc(db, "students", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            profilePic: userData.profilePic || "",
            fullName: userData.fullName || "NA",
            fathersName: userData.fathersName || "NA",
            mothersName: userData.mothersName || "NA",
            dob: userData.dob || "NA",
            email: currentUser.email || "NA",
          });
        } else {
          // If user profile doesn't exist, set default values
          setFormData({
            profilePic: "",
            fullName: "NA",
            fathersName: "NA",
            mothersName: "NA",
            dob: "NA",
            email: currentUser.email || "NA",
          });
        }

        setLoading(false); // Set loading to false once the profile is fetched
      };

      fetchProfile();
    } else {
      setLoading(false); // In case no user is logged in, stop loading
    }
  }, [db]); // Dependency array ensures it only runs once on mount

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

const handleSave = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      let imageUrl = formData.profilePic;

      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile-pics/${currentUser.uid}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const userDocRef = doc(db, "students", currentUser.uid);
      await setDoc(userDocRef, {
        ...formData,
        profilePic: imageUrl,
      });

      // 🔁 Also update Firebase Auth display name
      await updateProfile(currentUser, {
        displayName: formData.fullName,
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center py-10 px-4">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-[#dd2727] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium tracking-wider animate-pulse">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10 premium-container">
        <Aside />
        <main className="flex-1 p-4 md:p-8">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_30px_rgba(221,39,39,0.1)] w-full max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">
                Student <span className="text-[#dd2727]">Profile</span>
            </h2>

        {user ? (
          <div>
            {isEditing ? (
              <form className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-8">
                  <label className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                    Profile Picture
                  </label>
                  <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                    <input
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#dd2727] file:text-white hover:file:bg-red-700 cursor-pointer"
                    />
                    {imageFile && (
                      <div className="mt-6 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#dd2727] to-[#b0a102] rounded-full blur opacity-50"></div>
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Profile Preview"
                          className="relative w-32 h-32 rounded-full object-cover border-2 border-white/20 bg-black"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Father's Name */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="fathersName"
                      value={formData.fathersName}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Mother's Name */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="mothersName"
                      value={formData.mothersName}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob !== "NA" ? formData.dob : ""}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] focus:border-transparent transition-all color-scheme-dark"
                      style={{colorScheme: 'dark'}}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all uppercase tracking-wider font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(221,39,39,0.3)]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-center mb-10">
                  {formData.profilePic ? (
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#dd2727] to-[#b0a102] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <img
                        src={formData.profilePic}
                        alt="Profile"
                        className="relative w-36 h-36 rounded-full border-2 border-white/20 object-cover bg-black"
                      />
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#dd2727] to-[#b0a102] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative w-36 h-36 rounded-full border-2 border-white/20 bg-[#150a0a] flex items-center justify-center text-gray-400">
                        <span className="text-xs uppercase tracking-widest">No Image</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Full Name</p>
                    <p className="text-lg text-white font-medium">{formData.fullName}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-lg text-white font-medium break-all">{formData.email}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Father's Name</p>
                    <p className="text-lg text-white font-medium">{formData.fathersName}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Mother's Name</p>
                    <p className="text-lg text-white font-medium">{formData.mothersName}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date of Birth</p>
                    <p className="text-lg text-white font-medium">{formData.dob}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-10 border-t border-white/10 pt-6">
                  <button
                    onClick={handleEdit}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(221,39,39,0.3)]"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 uppercase tracking-widest text-sm">Please log in to view your profile</p>
          </div>
        )}
          </div>
      </main>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
