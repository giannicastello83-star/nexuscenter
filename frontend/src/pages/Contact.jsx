import React, { useState } from "react";
import { useToast } from "@/components/Toast";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from "emailjs-com";

const RECAPTCHA_SITE_KEY = "6LeGB7ErAAAAABNHG37I5AQXic6FPTOqD5YPSZDK";

// EmailJS Keys
const SERVICE_ID = "service_fc7ays6";
const TEMPLATE_ID = "template_088vx5u";
const PUBLIC_KEY = "eUgT8p6W0DcsoivAt";

export default function Contact() {
  const { push } = useToast();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);

    // emailjs
    //   .sendForm(SERVICE_ID, TEMPLATE_ID, e.target, PUBLIC_KEY)
    //   .then(() => {
    //     push("Message sent successfully!");
    //     e.target.reset();
    //     setToken(null);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     push("Failed to send message.");
    //   })
    //   .finally(() => setLoading(false));
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
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
