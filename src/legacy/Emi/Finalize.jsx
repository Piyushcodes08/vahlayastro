import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Aside from "../pages/Aside";
import Header from "../../components/sections/Header/Header";

const EMIDetails = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [payments, setPayments] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [emiPlans, setEmiPlans] = useState([]);
  const [emiSchedules, setEmiSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: "",
    fullName: "NA",
    fathersName: "NA",
    mothersName: "NA",
    dob: "NA",
    email: "NA",
  });
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    courseId: null,
    emiNumber: null,
    amount: null,
  });

  const loadPayPalScript = async () => {
    if (!document.querySelector("#paypal-sdk")) {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      document.body.appendChild(script);
      return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });
    }
  };

  // Call this function before rendering the PayPal button
  const openPaymentModal = async (courseId, emiNumber, amount) => {
    try {
      // await loadPayPalScript();
      setPaymentModal({
        isOpen: true,
        courseId,
        emiNumber,
        amount,
      });
    } catch (error) {
      alert("Failed to initialize PayPal. Please try again.");
    }
  };

  const closePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      courseId: null,
      emiNumber: null,
      amount: null,
    });
  };

  const fetchUSDConversionRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/INR"
      ); // Replace with your preferred API
      const data = await response.json();
      return data.rates.USD || 0; // Return the USD rate
    } catch (error) {
      return 0; // Default to 0 on error
    }
  };

  const PaymentModal = () => {
    const [usdAmount, setUsdAmount] = useState(null); // State to store the USD amount
    const [error, setError] = useState(null);

    useEffect(() => {
      // Fetch USD conversion rate when the modal opens
      const fetchUSDConversionRate = async () => {
        try {
          const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/INR"
          );
          const data = await response.json();
          const conversionRate = data.rates.USD || 80; // Fallback rate
          setUsdAmount((paymentModal.amount * conversionRate).toFixed(2));
        } catch (err) {
          setError("Failed to fetch USD conversion rate.");
        }
      };

      fetchUSDConversionRate();
    }, [paymentModal.amount]);

    if (!paymentModal.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(221,39,39,0.2)] p-8 w-full max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#dd2727] to-[#b0a102]"></div>
          
          <h3 className="text-2xl font-bold mb-2 text-white">
            Complete <span className="text-[#dd2727]">Payment</span>
          </h3>
          
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
            <p className="text-gray-300 mb-1 font-medium">
              Course: <span className="text-white">{paymentModal.courseId}</span>
            </p>
            <p className="text-gray-400 text-sm mb-3">
              EMI <span className="text-white font-bold">#{paymentModal.emiNumber}</span>
            </p>
            <div className="text-3xl font-bold text-[#dd2727]">
              ₹{Number(paymentModal.amount).toLocaleString("en-IN")}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
          <div className="flex flex-col gap-4">
            <button
              onClick={() =>
                handlePayment(
                  paymentModal.courseId,
                  paymentModal.emiNumber,
                  paymentModal.amount,
                  "razorpay"
                )
              }
              className="bg-white text-black font-bold px-4 py-3 rounded-xl transition-all hover:bg-gray-200 flex justify-center items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Pay with Razorpay"
              )}
            </button>
            {usdAmount ? (
              <div className="mt-2 relative z-10 paypal-button-container-dark">
              <PayPalScriptProvider
                options={{
                  "client-id": PAYPAL_CLIENT_ID,
                  components: "buttons",
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: usdAmount, // Dynamically set
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture();
                      const paymentId = details.id;

                      const userDetails = {
                        email: userEmail, // Replace with user's email
                        name: formData.fullName || "NA", // Replace with user's name
                      };

                      const backendResponse = await fetch(
                        "https://backend-7e8f.onrender.com/api/final/paypal/success",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            paymentId,
                            userDetails,
                            amount: paymentModal.amount,
                            courseId: paymentModal.courseId,
                          }),
                        }
                      );

                      if (!backendResponse.ok) {
                        const errorData = await backendResponse.json();
                        alert(`Error: ${errorData.error}`);
                        return;
                      }

                      // Add payment to Firestore
                      await addDoc(collection(db, "payments"), {
                        userId: userEmail,
                        courseId: paymentModal.courseId,
                        emiNumber: paymentModal.emiNumber,
                        amount: paymentModal.amount,
                        paymentId,
                        status: "paid",
                        timestamp: new Date(),
                      });

                      alert(
                        `Payment for EMI #${paymentModal.emiNumber} successful via PayPal!`
                      );
                      closePaymentModal();
                    } catch (error) {
                      alert(
                        "An error occurred during payment. Please try again."
                      );
                    }
                  }}
                  onError={(err) => {
                    alert(
                      "An error occurred during the PayPal payment process."
                    );
                  }}
                />
              </PayPalScriptProvider>
              </div>
            ) : (
              <div className="flex justify-center items-center p-4">
                 <div className="w-6 h-6 border-2 border-[#dd2727] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <button
              onClick={closePaymentModal}
              className="mt-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl transition-all uppercase tracking-wider font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  //handlePaymentSuccess(paymentModal.courseId, paymentModal.emiNumber, paymentModal.amount, details.id);

  const handlePayment = async (courseId, emiNumber, amount, paymentMethod) => {
    try {
      const amountInPaise = Number(amount) * 100; // Amount for Razorpay

      if (paymentMethod === "razorpay") {
        setIsLoading(true);
        const options = {
          key: RAZORPAY_KEY,
          amount: amountInPaise,
          currency: "INR",
          name: "EMI Payment",
          description: `Pay EMI #${emiNumber} for course ${courseId}`,
          handler: async (response) => {
            try {
              // Handle payment success
              const paymentDetails = {
                paymentId: response.razorpay_payment_id,
                courseId,
                emiNumber,
                amount,
                userEmail: userEmail,
              };

              // Send payment details to the backend
              const res = await fetch(
                "https://backend-7e8f.onrender.com/api/final/success",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(paymentDetails),
                }
              );

              if (!res.ok) {
                throw new Error("Failed to communicate with the backend.");
              }

              // Notify the user and admin via email (handled in backend)
              const result = await res.json();

              if (result.success) {
                handlePaymentSuccess(
                  courseId,
                  emiNumber,
                  amount,
                  response.razorpay_payment_id
                );
                alert("Payment successful! Emails have been sent.");
              } else {
                throw new Error(result.message || "Failed to send emails.");
              }
            } catch (err) {
              alert(
                "Payment was successful, but there was an issue processing the response."
              );
            } finally {
              setIsLoading(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
          },
          theme: { color: "#F37254" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      alert("Payment failed. Check Contact for details.");
    }
    setIsLoading(false);
  };

  const handlePaymentSuccess = async (
    courseId,
    emiNumber,
    amount,
    paymentId
  ) => {
    try {
      await addDoc(collection(db, "payments"), {
        userId: userEmail,
        courseId,
        amount: Number(amount),
        status: "paid",
        timestamp: new Date(),
        paymentId,
      });

      alert(`Payment for EMI #${emiNumber} successful!`);
      closePaymentModal();
    } catch (error) {
      alert("Failed to record payment. Please try again.");
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserEmail(currentUser.email);

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
          }
        };

        fetchProfile();
      } else {
        setUser(null);
        setUserEmail(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const paymentsQueryRef = query(
      collection(db, "payments"),
      where("userId", "==", userEmail)
    );

    const paymentsUnsubscribe = onSnapshot(paymentsQueryRef, (snapshot) => {
      const userPayments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(userPayments);
    });

    return () => paymentsUnsubscribe();
  }, [userEmail]);

  useEffect(() => {
    if (payments.length === 0) return;

    const plansUnsubscribe = onSnapshot(
      collection(db, "emiPlans"),
      (snapshot) => {
        const allEmiPlans = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmiPlans(allEmiPlans);
      }
    );

    return () => plansUnsubscribe();
  }, [payments]);

  useEffect(() => {
    if (payments.length === 0 || emiPlans.length === 0) return;

    const updatedSchedules = {};

    payments.forEach((payment) => {
      const { courseId, amount } = payment;
      const relevantPlan = emiPlans.find(
        (plan) =>
          plan.courseId === courseId && Number(plan.amount) === Number(amount)
      );

      if (!relevantPlan) return;

      const totalEMIs = parseInt(relevantPlan.duration || 0, 10);
      const sortedPayments = payments
        .filter((p) => p.courseId === courseId)
        .sort((a, b) => {
          const aDate = a.timestamp?.toDate?.() || new Date(a.timestamp);
          const bDate = b.timestamp?.toDate?.() || new Date(b.timestamp);
          return aDate - bDate;
        });

      const firstPaymentDate =
        sortedPayments[0]?.timestamp?.toDate?.() ||
        new Date(sortedPayments[0]?.timestamp) ||
        new Date();

      const schedule = [];

      for (let i = 0; i < totalEMIs; i++) {
        const emiDate = new Date(firstPaymentDate);
        emiDate.setMonth(emiDate.getMonth() + i);

        schedule.push({
          emiNumber: i + 1,
          date: emiDate,
          amount: relevantPlan.amount,
          status: i < sortedPayments.length ? "paid" : "unpaid",
        });
      }

      updatedSchedules[courseId] = schedule;
    });

    setEmiSchedules(updatedSchedules);
    setLoading(false);
  }, [payments, emiPlans]);

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10">
        <Aside />
        <div className="flex-1 p-4 md:p-8">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_30px_rgba(221,39,39,0.1)] w-full mx-auto overflow-x-hidden">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">
          EMI Details <span className="text-[#dd2727] text-xl block md:inline md:ml-4">{userEmail}</span>
        </h2>

        {/* Show message if user is not enrolled in any EMI plans */}
        {Object.keys(emiSchedules).length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              You are not enrolled in any EMI plans.
            </h3>
            <p className="text-gray-400 mb-8">
              Explore available courses with EMI options and start your journey
              today.
            </p>
            <Link to="/courses">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(221,39,39,0.3)]">
                Browse Courses with EMI Plans
              </button>
            </Link>
          </div>
        ) : (
          Object.keys(emiSchedules).map((courseId) => {
            const schedule = emiSchedules[courseId] || [];
            const unpaidEMIs = schedule.filter(
              (emi) => emi.status === "unpaid"
            );
            const totalUnpaid = unpaidEMIs.reduce(
              (sum, emi) => sum + Number(emi.amount),
              0
            );

            return (
              <div
                key={courseId}
                className="mb-8 p-6 bg-black/20 border border-white/10 rounded-2xl hover:border-white/20 transition-all shadow-lg"
              >
                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                  Course: <span className="text-[#dd2727]">{courseId}</span>
                </h3>
                <ul className="space-y-4">
                  {schedule.map((emi, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors gap-4"
                    >
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-lg">
                          EMI #{emi.emiNumber}
                        </span>
                        <span className="text-sm text-gray-400 uppercase tracking-wider">
                          Due on <span className="text-gray-300 font-medium">{emi.date.toLocaleDateString("en-IN")}</span>
                        </span>
                        <span className="text-[#dd2727] font-bold mt-1 text-lg">
                          ₹{Number(emi.amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="w-full md:w-auto flex justify-end">
                      {emi.status === "paid" ? (
                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center w-full md:w-auto">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Paid
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            openPaymentModal(
                              courseId,
                              emi.emiNumber,
                              emi.amount
                            )
                          }
                          className="bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white px-8 py-2 rounded-lg font-bold uppercase tracking-wider text-sm hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(221,39,39,0.3)] w-full md:w-auto"
                        >
                          Pay Now
                        </button>
                      )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}

        <PaymentModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default EMIDetails;
