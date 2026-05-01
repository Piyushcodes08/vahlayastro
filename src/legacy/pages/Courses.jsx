import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Firebase config file
import { useCourses } from "../../context/CoursesContext";
import { db } from "../../firebaseConfig";
import { addDoc, getDoc, doc } from "firebase/firestore";
import { Helmet } from "react-helmet-async";

const slugify = (text) => text?.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

const HeroSection = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { slugMap, loading } = useCourses();

  const courses = Object.values(slugMap);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCourseClick = async (course) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const subscriptionSnap = await getDoc(doc(db, "subscriptions", user.email));
      const subscriptionData = subscriptionSnap.exists() ? subscriptionSnap.data() : null;

      const isEnrolled = course.type === "free"
        ? subscriptionData?.freecourses?.includes(course.title)
        : subscriptionData?.DETAILS?.some(
          (details) =>
            details[course.title]?.status === "active" &&
            new Date(details[course.title]?.expiryDate) > new Date()
        );

      if (isEnrolled) {
        navigate("/enrolledcourse");
      } else {
        navigate(`/courses/${course.type}/${course.slug}`);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  const getMetaTags = () => {

    return (
      <Helmet>
        <title>Astrology Articles by Valay Patel</title>
        <meta name="description" content={''} />
        <meta
          name="keywords"
          content={''}
        />
      </Helmet>

    );
  };
  return (
    <div className="relative bg-ivory overflow-hidden min-h-screen">
      {getMetaTags()}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-ivory skew-y-6 transform"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-900">
              Align Your Life with <br />
              <span className="text-red-600"> <strong>Vahlay Astro </strong></span>
            </h1>
            <p className="text-lg text-gray-700">
              It’s Not Just A Course, It’s A Life-Changing Experience!
            </p>
          </div>
          <div className="relative lg:w-1/2">
            <div className="absolute bg-gradient-to-bl from-red-100 to-red-300 w-72 h-72 rounded-full blur-2xl top-10 left-20"></div>
            <img
              src="https://res.cloudinary.com/dzdnwpocf/image/upload/v1753466298/wheel_no6cpe.png"
              alt="Astrology Wheel"
              className="relative w-80 h-80 mx-auto hover:scale-105 transition-transform animate-slowspin"
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 my-10">
        <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-red-600 shadow-lg rounded-xl hover:shadow-2xl hover:scale-105 transform transition duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleCourseClick(course);
              }}
            >
              <div className="mb-4">
                <div className="absolute top-0 left-2 m-2 rounded-full shadow-lg flex items-center justify-center">
                  <img
                    src="/assets/vahlay_astro.png"
                    alt="logo"
                    className=" w-14 h-14 bg-white object-contain rounded-full"
                  />
                </div>
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="max-w-full h-auto object-cover rounded-t-xl border-8 border-orange-100"
                />
              </div>
              <div className="px-2">
                <h3 className="text-center text-lg font-bold text-red-600">
                  {course.title}
                </h3>
                <p className="text-center text-sm text-gray-700 mb-4">
                  {course.Subtitle || "Untitled Course"}
                </p>
                <Link
                  to={`/courses/${course.type}/${course.slug}`}
                  className="block text-center text-white bg-red-600 font-medium py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Enroll Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
