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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);

    const submitData = {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: formData.message,
      submittedAt: new Date(),
      status: "pending",
    };

    try {
      await addDoc(collection(db, "contact_form"), submitData);

      push("Your message has been submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
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
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>

      <form
        className="card p-6 space-y-4 border border-slate-200 dark:border-slate-800"
        onSubmit={onSubmit}
      >
        <div>
          <label className="label">Full name *</label>
          <input
            className="input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="label">Work email *</label>
          <input
            className="input"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label className="label">Company</label>
          <input
            className="input"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your company name"
          />
        </div>

        <div>
          <label className="label">Message *</label>
          <textarea
            className="input"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            placeholder="Tell us more about your inquiry..."
          ></textarea>
        </div>

        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={(value) => setToken(value)}
        />

        <button
          type="submit"
          disabled={!token || loading}
          className={`w-full px-6 py-3 rounded-lg text-xl font-semibold text-white shadow-sm transition ${
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