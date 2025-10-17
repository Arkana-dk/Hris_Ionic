import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  gradient?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  gradient = "from-blue-600 to-indigo-600",
  className = "",
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} text-white px-5 py-6 rounded-b-3xl shadow-lg animate-fadeInDown ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
