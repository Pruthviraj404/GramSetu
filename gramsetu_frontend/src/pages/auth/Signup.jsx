import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Home,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    area: "",
    houseNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const res = await API.get("/api/areas");
      setAreas(res.data);
    } catch (err) {
      console.error("Area list load failure:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      await API.post("/api/auth/register", payload);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Registration failed. Please verify your details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Profile Submitted
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Thank you, <span className="font-semibold text-gray-800">{formData.name}</span>. Your registration details have been sent to the village lookup registry.
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 text-left flex gap-3">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs text-amber-900 font-bold uppercase tracking-wider">Verification Pending</p>
                <p className="text-xs text-amber-800 font-medium leading-normal">
                  Your profile access credentials will be activated as soon as the Gram Panchayat admin verifies your registered Ward and House Number details.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition duration-150 shadow-sm cursor-pointer"
            >
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        
        {/* Top Header Section */}
        <div className="text-center mb-8 select-none">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/10 mb-4 mx-auto font-black text-2xl tracking-tight">
            G
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-xs text-gray-400 font-bold mt-1.5 tracking-widest uppercase">
            पंचायत डिजिटल मंच • GramSetu Portal
          </p>
        </div>

        {/* Signup Form Card Container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-5">
            
            {/* Grid Group: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g., Ramesh Kumar"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 outline-none transition duration-150"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 outline-none transition duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Contact Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="mobileNumber"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 outline-none transition duration-150"
                />
              </div>
            </div>

            {/* Demographic Parameters Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Select Area / Ward</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium outline-none transition duration-150 appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-400">Select Area</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.areaName}>
                        {area.areaName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">House / Property ID</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="houseNumber"
                    required
                    placeholder="e.g., H-102"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 outline-none transition duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Password Configuration Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 outline-none transition duration-150"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 outline-none transition duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Action Trigger Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition duration-150 shadow-sm shadow-emerald-600/10 mt-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>{loading ? "Creating Profile Account..." : "Create Account"}</span>
            </button>
          </form>

          {/* Footer Backlinks */}
          <div className="text-center text-xs font-medium text-gray-500 border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-center gap-1">
            <span className="inline-flex items-center gap-1 text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Identity channels are encrypted.
            </span>
            <div className="sm:ml-auto">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
              >
                Login Here
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;