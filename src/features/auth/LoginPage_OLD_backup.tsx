import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonSpinner,
  IonToast,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { authService } from "../../services";

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setError("Email dan password harus diisi");
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.login({ email, password });
      console.log("Login berhasil!");
      history.push("/dashboard");
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
    <IonPage>
      <IonContent className="ion-padding" scrollY={true}>
        {/* Header with Logo */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">🏢</div>
          </div>
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Login to your HRIS account</p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          {/* Email Input */}
          <IonItem lines="none" className="input-item">
            <IonLabel position="stacked" className="input-label">
              Email Address
            </IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              placeholder="Enter your email"
              className="custom-input"
              disabled={loading}
            />
          </IonItem>

          {/* Password Input */}
          <IonItem lines="none" className="input-item">
            <IonLabel position="stacked" className="input-label">
              Password
            </IonLabel>
            <IonInput
              type={showPassword ? "text" : "password"}
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
              placeholder="Enter your password"
              className="custom-input"
              disabled={loading}
            />
            <IonButton
              slot="end"
              fill="clear"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              <IonIcon
                icon={showPassword ? eyeOffOutline : eyeOutline}
                slot="icon-only"
              />
            </IonButton>
          </IonItem>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <button type="button" className="forgot-link">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <IonButton
            expand="block"
            onClick={handleLogin}
            disabled={loading}
            className="login-button"
            size="large"
          >
            {loading ? (
              <>
                <IonSpinner name="crescent" className="button-spinner" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </IonButton>

          {/* Demo Credentials Box */}
          <div className="demo-box">
            <p className="demo-title">🔑 Demo Credentials:</p>
            <p className="demo-text">
              Email: <strong>admin@example.com</strong>
            </p>
            <p className="demo-text">
              Password: <strong>password</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>HRIS Mobile App © 2025</p>
          <p>Bridgestone Karawang</p>
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

      {/* Inline Styles */}
      <style>{`
        /* Container Styles */
        .login-header {
          text-align: center;
          padding: 60px 20px 40px;
        }

        .logo-container {
          margin-bottom: 20px;
        }

        .logo-icon {
          font-size: 72px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .login-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0;
        }

        .login-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        /* Form Styles */
        .login-form {
          max-width: 450px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .input-item {
          --background: #f9fafb;
          --border-radius: 12px;
          --padding-start: 16px;
          --padding-end: 16px;
          --padding-top: 12px;
          --padding-bottom: 12px;
          margin-bottom: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
        }

        .input-item.item-has-focus {
          --border-color: #6366f1;
          border-color: #6366f1;
        }

        .input-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .custom-input {
          --padding-start: 0;
          --padding-end: 0;
          font-size: 16px;
          font-weight: 500;
        }

        .password-toggle {
          --padding-start: 8px;
          --padding-end: 8px;
          margin: 0;
          height: 40px;
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 24px;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #6366f1;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .forgot-link:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        /* Login Button */
        .login-button {
          --background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          --background-hover: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          --background-activated: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
          --border-radius: 12px;
          --box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
          height: 56px;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 24px;
          text-transform: none;
          letter-spacing: 0.5px;
        }

        .login-button:hover {
          --box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
        }

        .button-spinner {
          margin-right: 8px;
        }

        /* Demo Box */
        .demo-box {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          border: 2px solid #93c5fd;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 40px;
        }

        .demo-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e40af;
          margin: 0 0 8px 0;
        }

        .demo-text {
          font-size: 13px;
          color: #1e3a8a;
          margin: 4px 0;
        }

        .demo-text strong {
          color: #1e40af;
          font-weight: 700;
        }

        /* Footer */
        .login-footer {
          text-align: center;
          padding: 20px;
          color: #9ca3af;
          font-size: 12px;
          margin-top: auto;
        }

        .login-footer p {
          margin: 4px 0;
        }

        /* Ensure inputs are clickable */
        ion-input {
          cursor: text !important;
        }

        ion-input input {
          cursor: text !important;
        }

        /* Responsive */
        @media (max-width: 576px) {
          .login-title {
            font-size: 28px;
          }

          .login-subtitle {
            font-size: 14px;
          }

          .logo-icon {
            font-size: 60px;
          }
        }
      `}</style>
    </IonPage>
  );
};

export default LoginPage;
