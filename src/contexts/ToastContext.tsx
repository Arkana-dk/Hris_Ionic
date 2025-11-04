import React, { createContext, useContext, useState } from "react";
import { IonToast } from "@ionic/react";

interface ToastMessage {
  message: string;
  color: "success" | "warning" | "danger" | "primary";
  duration?: number;
}

interface ToastContextType {
  showToast: (
    message: string,
    color?: ToastMessage["color"],
    duration?: number
  ) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (
    message: string,
    color: ToastMessage["color"] = "primary",
    duration: number = 3000
  ) => {
    setToast({ message, color, duration });
  };

  const showError = (message: string) => {
    showToast(message, "danger", 4000);
  };

  const showSuccess = (message: string) => {
    showToast(message, "success", 3000);
  };

  const showWarning = (message: string) => {
    showToast(message, "warning", 3500);
  };

  return (
    <ToastContext.Provider
      value={{ showToast, showError, showSuccess, showWarning }}
    >
      {children}
      <IonToast
        isOpen={!!toast}
        onDidDismiss={() => setToast(null)}
        message={toast?.message}
        duration={toast?.duration}
        color={toast?.color}
        position="top"
        buttons={[
          {
            text: "OK",
            role: "cancel",
          },
        ]}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
