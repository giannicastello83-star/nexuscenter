import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "contact_form"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCandidates(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError("Failed to load candidates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.toDate) {
      return date.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Candidates</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Total submissions: {candidates.length}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 dark:border-emerald-500"></div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">
            No candidates found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Company
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Message
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Submitted At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {candidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-medium">
                    {candidate.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    <a
                      href={`mailto:${candidate.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {candidate.email || "N/A"}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {candidate.company || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {candidate.message || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {formatDate(candidate.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}