import { useAuth } from "../../context/AuthContext";
import { Clock, ShieldAlert, LogOut } from "lucide-react";

const AccountApprovalGuard = ({ children }) => {
    const { user, logout } = useAuth();

    console.log("Current User Auth State inside Guard:", user);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user.isApproved === false || user.approved === false) {
        return (
            <div className="relative min-h-screen bg-gray-50/50">

                {/* 1. Backdrop Blur Lock Layer */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-[6px] transition-all duration-300">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">

                        {/* Pulsing Status Icon */}
                        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-pulse">
                            <Clock className="w-8 h-8 stroke-[2.2]" />
                        </div>

                        {/* Dynamic Alert Messages */}
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                Account Verification Pending
                            </h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                Namaste <span className="font-bold text-gray-800">{user?.name || "Citizen"}</span>, your registration record has been committed to the GramSetu system node safely.
                            </p>
                            <div className="text-xs font-semibold bg-amber-50/70 border border-amber-100 text-amber-800 p-3 rounded-xl">
                                Awaiting a digital signature verification stamp from your local Gram Panchayat Administrative Authority.
                            </div>
                        </div>

                        {/* Action Terminals */}
                        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
                                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                                <span>GramSetu Core Authentication Sandbox</span>
                            </div>

                            <button
                                onClick={logout} // Direct callback hooks to clean system memory safely
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Exit Session Endpoint</span>
                            </button>
                        </div>

                    </div>
                </div>

                {/* 2. Blurred Dummy Layout Background (Renders underlying components in a frozen state) */}
                <div className="select-none pointer-events-none opacity-30 blur-[6px] max-h-screen overflow-hidden">
                    {children}
                </div>
            </div>
        );
    }

    return children;
}

export default AccountApprovalGuard;
