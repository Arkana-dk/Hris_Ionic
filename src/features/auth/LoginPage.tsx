import React, { useState } from "react";
import { IonContent, IonPage, IonSpinner, IonToast } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { authService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const history = useHistory();
  const { login: setAuthLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Debug untuk memastikan state berubah
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Email changed:", e.target.value);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Password changed:", e.target.value);
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password });

    // Validation
    if (!email || !password) {
      setError("Email dan password harus diisi");
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.login({ email, password });
      console.log("Login success:", result);

      // Update auth context, then navigate after a micro delay
      setAuthLogin();
      setTimeout(() => {
        history.replace("/dashboard");
      }, 0);
    } catch (err) {
      console.error("Login error:", err);
      const error = err as Error;
      setError(error.message || "Login gagal. Silakan coba lagi.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage className="bg-gradient-to-br from-gray-50 to-gray-100">
      <IonContent fullscreen className="font-inter">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white px-5 pt-16 pb-32 pointer-events-none">
          {/* Animated decorative orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute top-1/2 -left-20 w-56 h-56 bg-pink-400/20 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className="relative z-10 text-center pointer-events-auto">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-4xl">🏢</span>
            </div>
            <h1 className="text-3xl font-black mb-2">Welcome Back!</h1>
            <p className="text-white/80 text-sm font-medium">
              Login to your HRIS account
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="px-5 -mt-24 mb-6 relative z-30 pointer-events-auto">
          <div className="bg-white rounded-3xl p-6 shadow-2xl backdrop-blur-xl border border-gray-100">
            <form onSubmit={handleLogin} className="pointer-events-auto">
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 text-gray-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right mb-6">
                <button
                  type="button"
                  className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 hover:from-violet-600 hover:via-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" className="w-5 h-5" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>

              {/* Real API Credentials Info */}
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-700">
                    🔑 Login dengan Database Real:
                  </p>
                  <span className="text-[10px] px-2 py-0.5 bg-green-500 text-white rounded-full font-bold">
                    REAL API
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium mb-2">
                  Gunakan credentials yang valid dari database
                  hakunamatata.my.id
                </p>
                <p className="text-[10px] text-gray-500 italic">
                  💡 Hubungi admin untuk mendapatkan email & password yang
                  terdaftar
                </p>
              </div>

              {/* API Status Info */}
              <div className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-gray-700 mb-1">
                  📡 API Connection:
                </p>
                <p className="text-[10px] text-gray-600 font-medium">
                  🔗 Backend:{" "}
                  <span className="font-mono text-gray-800">
                    hakunamatata.my.id
                  </span>
                </p>
                <p className="text-[10px] text-gray-600 font-medium">
                  ✅ Mode:{" "}
                  <span className="font-bold text-green-600">
                    Direct Database Access
                  </span>
                </p>
                <p className="text-[10px] text-gray-600 font-medium">
                  🛡️ CORS:{" "}
                  <span className="font-bold text-blue-600">
                    Handled by Proxy
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center px-5 pb-8">
          <p className="text-xs text-gray-400 font-medium">
            HRIS Mobile App © 2025
          </p>
          <p className="text-xs text-gray-400 font-medium">
            Bridgestone Karawang
          </p>
        </div>

        {/* Toast for errors */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={error}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
