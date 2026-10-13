import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

export function Account() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Load account data from localStorage
    const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    setEmail(savedAccount.email || "");
    setPassword(savedAccount.password || "");
  }, []);

  const handleSaveField = (field: string, value: string) => {
    const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    savedAccount[field] = value;
    localStorage.setItem("userAccount", JSON.stringify(savedAccount));
  };

  const handleLogOut = () => {
    // Clear all user data
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userAccount");
    // In a real app, this would also clear auth tokens and redirect to login
    alert("Logged out successfully");
  };

  return (
    <div>
      {/* Header */}
      <div className="app-subheader">
        <Link to="/settings" className="app-subheader-back">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="app-subheader-title">Account</h2>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Email Address */}
        <div>
          <label className="app-field-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleSaveField("email", email)}
            placeholder="your.email@example.com"
            className="app-input w-full"
          />
        </div>

        {/* Password */}
        <div>
          <label className="app-field-label">Password or PIN</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleSaveField("password", password)}
            placeholder="••••••••"
            className="app-input w-full"
          />
        </div>

        {/* Log Out Button */}
        <div className="pt-8">
          <button
            onClick={handleLogOut}
            className="w-full py-3 bg-red-500 text-white rounded-lg text-center font-medium active:bg-red-600"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
