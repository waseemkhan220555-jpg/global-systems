
import { useEffect, useState } from "react";
import {
  Clock,
  Phone,
  User,
  Wrench,
  RefreshCw,
  LogOut,
  Lock,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Admin() {
  const [inquiries, setInquiries] = useState([]);

  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ======================================
  // VERIFY ADMIN KEY WITH BACKEND
  // ======================================

  const verifyAdmin = async (key) => {
    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: "GET",
        headers: {
          "x-admin-key": key,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message:
            response.status === 401 || response.status === 403
              ? "Incorrect admin password. Access denied."
              : "Server error. Please try again.",
        };
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        return {
          success: false,
          message: "Unexpected server response.",
        };
      }

      return {
        success: true,
        inquiries: data,
      };
    } catch (err) {
      console.error("Authentication error:", err);

      return {
        success: false,
        message: "Cannot connect to backend. Check your server.",
      };
    }
  };

  // ======================================
  // CHECK EXISTING SESSION
  // ======================================

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const savedKey = sessionStorage.getItem("gs_admin_key");

      if (!savedKey) {
        if (active) {
          setCheckingSession(false);
        }
        return;
      }

      const result = await verifyAdmin(savedKey);

      if (!active) return;

      if (result.success) {
        setAdminKey(savedKey);
        setInquiries(result.inquiries);
        setAuthenticated(true);
      } else {
        sessionStorage.removeItem("gs_admin_key");
        setError(result.message);
      }

      setCheckingSession(false);
    };

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  // ======================================
  // LOGIN
  // ======================================

  const handleLogin = async (e) => {
    e.preventDefault();

    const enteredKey = keyInput.trim();

    if (!enteredKey) {
      setError("Please enter your admin password.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await verifyAdmin(enteredKey);

    if (result.success) {
      sessionStorage.setItem("gs_admin_key", enteredKey);

      setAdminKey(enteredKey);
      setInquiries(result.inquiries);
      setAuthenticated(true);
      setKeyInput("");
      setError("");
    } else {
      sessionStorage.removeItem("gs_admin_key");

      setAdminKey("");
      setAuthenticated(false);
      setError(result.message);
    }

    setLoading(false);
  };

  // ======================================
  // REFRESH INQUIRIES
  // ======================================

  const fetchInquiries = async () => {
    if (!adminKey || !authenticated) return;

    setLoading(true);
    setError("");

    const result = await verifyAdmin(adminKey);

    if (result.success) {
      setInquiries(result.inquiries);
    } else {
      handleLogout();
      setError(result.message);
    }

    setLoading(false);
  };

  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {
    sessionStorage.removeItem("gs_admin_key");

    setAdminKey("");
    setKeyInput("");
    setInquiries([]);
    setAuthenticated(false);
    setError("");
  };

  // ======================================
  // DATE FORMAT
  // ======================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ======================================
  // SESSION CHECK SCREEN
  // ======================================

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-blue-600"
          />
          <p className="mt-4 font-bold text-slate-600">
            Verifying admin session...
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // LOGIN SCREEN
  // ======================================

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <Lock size={30} className="text-blue-600" />
          </div>

          <h1 className="text-center text-3xl font-black text-slate-900">
            Admin Login
          </h1>

          <p className="mt-2 text-center text-slate-500">
            Global Systems Management Panel
          </p>

          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Enter admin password"
            autoComplete="current-password"
            className="mt-7 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <RefreshCw size={18} className="animate-spin" />
            )}

            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  // ======================================
  // ADMIN DASHBOARD
  // ======================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Wrench size={28} className="text-blue-600" />

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Admin Dashboard
              </h1>

              <p className="text-slate-500">
                Global Systems Management
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchInquiries}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total Inquiries
            </p>

            <h2 className="mt-2 text-4xl font-black text-blue-600">
              {inquiries.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Authentication
            </p>

            <h2 className="mt-2 text-2xl font-black text-green-600">
              Verified
            </h2>
          </div>
        </div>

        {/* INQUIRIES */}
        <div className="mt-10">
          <h2 className="text-2xl font-black text-slate-900">
            Service Inquiries
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Customer requests submitted through your website.
          </p>

          {inquiries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              <Wrench
                size={40}
                className="mx-auto mb-3 text-slate-300"
              />

              <h3 className="font-bold text-slate-700">
                No inquiries received yet.
              </h3>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...inquiries].reverse().map((item) => (
                <div
                  key={item._id || item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {item.service || "General Inquiry"}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={13} />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <p className="flex items-center gap-2 font-bold text-slate-900">
                      <User size={17} className="text-slate-400" />
                      {item.name}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={17} className="text-slate-400" />

                      <a
                        href={`tel:${item.phone}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {item.phone}
                      </a>
                    </p>
                  </div>

                  {item.message && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="mb-2 text-xs font-bold uppercase text-slate-500">
                        Issue Details
                      </p>

                      <p className="whitespace-pre-wrap text-sm text-slate-700">
                        {item.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;