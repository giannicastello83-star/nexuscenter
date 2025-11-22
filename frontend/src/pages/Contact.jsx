import React, { useState } from "react";
import { useToast } from "@/components/Toast";
import ReCAPTCHA from "react-google-recaptcha";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDYijBZM7KI2F09lDJ35hFIdlkHTi6HbMk",
  authDomain: "company-application-33a02.firebaseapp.com",
  projectId: "company-application-33a02",
  storageBucket: "company-application-33a02.firebasestorage.app",
  messagingSenderId: "453718731624",
  appId: "1:453718731624:web:057aa525f34468b4a984dd",
  measurementId: "G-JEF9NF5TDV",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const RECAPTCHA_SITE_KEY = "6LeGB7ErAAAAABNHG37I5AQXic6FPTOqD5YPSZDK";

export default function Contact() {
  const { push } = useToast();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      company: e.target.company.value,
      message: e.target.message.value,
      submittedAt: new Date(),
    };

    try {
      await addDoc(collection(db, "contact_form"), formData);

      push("Your message has been submitted successfully!");

      e.target.reset();
      setToken(null);
    } catch (error) {
      console.error("Firestore Error:", error);
      push("Failed to submit message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <form
        className="card p-6 space-y-4 border border-slate-200 dark:border-slate-800"
        onSubmit={onSubmit}
      >
        <div>
          <label className="label">Full name</label>
          <input className="input" name="name" required />
        </div>

        <div>
          <label className="label">Work email</label>
          <input className="input" name="email" type="email" required />
        </div>

        <div>
          <label className="label">Company</label>
          <input className="input" name="company" />
        </div>

        <div>
          <label className="label">Message</label>
          <textarea
            className="input"
            name="message"
            rows="5"
            required
          ></textarea>
        </div>

        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={(value) => setToken(value)}
        />

        <button
          type="submit"
          disabled={!token || loading}
          className={`px-6 py-3 rounded-lg text-xl font-semibold text-white shadow-sm transition 
            ${
              !token || loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-700 hover:bg-slate-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
