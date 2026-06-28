import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Login = () => {

    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);

        } return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () => {
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            setError("Enter a valid 10 digit mobile number")
            return;
        }
        setError("");
        setLoading(true);
        try {
            await API.post("/api/auth/send-otp", { mobileNumber: mobile });
            setStep(2);
            setTimer(30);
        } catch (err) {
            setError(err.response?.data?.message || "Mobile number not registered with GramPanchayat");

        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Enter a valid 6-digit OTP");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const res = await API.post("/api/auth/verify-otp", { mobileNumber: mobile, otp });
            const { token, name, role } = res.data;
            login(token, { name, role, mobile });

            if (role == "ADMIN") navigate("/admin/dashboard");
            else if (role == "WATERMAN") navigate("/waterman/dashboard");
            else navigate("/citizen/dashboard");
        } catch (err) {
            setError("Invalid or Expired Otp");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md rotate-3 hover:rotate-0 transition-transform">
                        <span className="text-white text-3xl font-black">G</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">GramSetu</h1>
                    <p className="text-sm text-gray-500 mt-1">ग्राम पंचायत व्यवस्थापन प्रणाली</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-emerald-600" : "bg-gray-200"}`} />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"}`} />
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 font-medium">{error}</div>}

                {step === 1 ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Mobile Number</label>
                            <div className="flex gap-2">
                                <div className="bg-gray-100 px-3 rounded-xl flex items-center text-gray-500 text-sm font-medium border border-transparent">🇮🇳 +91</div>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                                    placeholder="9876543210"
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-emerald-600 transition shadow-inner"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Must be registered with your resident Gram Panchayat office.</p>
                        </div>
                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition shadow-md disabled:opacity-60"
                        >
                            {loading ? "Sending OTP..." : "Get Verification Code"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Enter 6-Digit OTP</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="••••••"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest outline-none focus:border-emerald-600 transition shadow-inner"
                            />
                            {timer > 0 ? (
                                <p className="text-xs text-gray-400 text-center mt-3">Resend code available in <span className="font-medium text-gray-600">{timer}s</span></p>
                            ) : (
                                <button onClick={handleSendOtp} className="text-xs text-emerald-600 font-semibold hover:underline block mx-auto mt-3">Resend OTP Code</button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                            >
                                Modify Number
                            </button>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition shadow-md disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Confirm & Login"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};




export default Login;
