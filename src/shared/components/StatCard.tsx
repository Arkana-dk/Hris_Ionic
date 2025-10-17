import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
  className?: string;
}

const colorClasses = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  red: "from-red-500 to-red-600",
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "blue",
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-md hover-lift animate-scaleIn ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-2xl shadow-lg`}
          >
            {icon}
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center text-xs font-semibold ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span className="mr-1">{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
