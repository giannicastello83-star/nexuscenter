import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

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
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

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

  const updateStatus = async (docId, newStatus) => {
    try {
      const docRef = doc(db, "contact_form", docId);
      await updateDoc(docRef, { status: newStatus });
      fetchCandidates();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status.");
    }
  };

  const deleteCandidate = async (docId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteDoc(doc(db, "contact_form", docId));
        fetchCandidates();
      } catch (err) {
        console.error("Error deleting candidate:", err);
        setError("Failed to delete candidate.");
      }
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus =
      filterStatus === "all" || candidate.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: candidates.length,
    pending: candidates.filter((c) => c.status === "pending").length,
    approved: candidates.filter((c) => c.status === "approved").length,
    rejected: candidates.filter((c) => c.status === "rejected").length,
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Total
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
              Pending
            </p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {stats.pending}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 text-sm font-medium">
              Approved
            </p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.approved}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">
              Rejected
            </p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
              {stats.rejected}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
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
      ) : filteredCandidates.length === 0 ? (
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
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Company
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Message
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {candidate.name || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                    <a
                      href={`mailto:${candidate.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {candidate.email || "N/A"}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                    {candidate.company || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {candidate.message || "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={candidate.status || "pending"}
                      onChange={(e) =>
                        updateStatus(candidate.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${getStatusColor(
                        candidate.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap text-xs">
                    {formatDate(candidate.submittedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => deleteCandidate(candidate.id)}
                      className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                    >
                      Delete
                    </button>
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