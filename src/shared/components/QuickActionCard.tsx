import React from "react";
import { IonIcon } from "@ionic/react";

interface QuickActionCardProps {
  title: string;
  icon: string;
  color: string;
  badge?: number;
  onClick?: () => void;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  color,
  badge,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-smooth hover-scale group ${color} ${className}`}
    >
      {badge && badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulseSubtle">
          {badge > 9 ? "9+" : badge}
        </div>
      )}
      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <IonIcon icon={icon} className="text-3xl text-white" />
      </div>
      <span className="text-white text-xs font-semibold text-center">
        {title}
      </span>
    </button>
  );
};

export default QuickActionCard;
