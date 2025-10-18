import React, { useState } from "react";
import { IonContent, IonPage, IonAvatar } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faFileAlt,
  faCog,
  faSignOutAlt,
  faChevronRight,
  faShieldAlt,
  faBell,
  faLanguage,
  faQuestionCircle,
  faIdCard,
  faBriefcase,
  faMapMarkerAlt,
  faStar,
  faAward,
  faChartLine,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"info" | "stats">("info");

  const user = {
    name: "ILHAM HIDAYATULLAH",
    employeeId: "EMP-2024-BS-001",
    position: "QQ FINFEEL CLEANING SERVICE OFFICER",
    department: "Facility Management",
    company: "Bridgestone Karawang",
    email: "ilham.hidayatullah@bridgestone.co.id",
    phone: "+62 812-3456-7890",
    joinDate: "2024-01-15",
    location: "Karawang, West Java",
    avatar: "https://ionicframework.com/docs/img/demos/avatar.svg",
  };

  const stats = [
    {
      id: "attendance",
      value: "96%",
      label: "Attendance Rate",
      icon: faChartLine,
      gradient: "from-emerald-400 to-teal-500",
      textColor: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    },
    {
      id: "performance",
      value: "4.8",
      label: "Performance",
      icon: faStar,
      gradient: "from-amber-400 to-orange-500",
      textColor: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      id: "projects",
      value: "12",
      label: "Completed Tasks",
      icon: faAward,
      gradient: "from-violet-400 to-purple-500",
      textColor: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
    },
    {
      id: "leaves",
      value: "8",
      label: "Leave Balance",
      icon: faCalendar,
      gradient: "from-cyan-400 to-blue-500",
      textColor: "text-cyan-600",
      bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
    },
  ];

  const menuItems = [
    {
      id: "personal-info",
      title: "Personal Information",
      subtitle: "Update your personal details",
      icon: faUser,
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    },
    {
      id: "employee-id",
      title: "Employee ID Card",
      subtitle: "View your digital ID",
      icon: faIdCard,
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
    },
    {
      id: "documents",
      title: "My Documents",
      subtitle: "Manage your files",
      icon: faFileAlt,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-gradient-to-br from-emerald-100 to-teal-100",
    },
    {
      id: "security",
      title: "Security & Privacy",
      subtitle: "Password & security settings",
      icon: faShieldAlt,
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Manage notification preferences",
      icon: faBell,
      gradient: "from-orange-500 to-red-600",
      iconBg: "bg-gradient-to-br from-orange-100 to-red-100",
    },
    {
      id: "language",
      title: "Language & Region",
      subtitle: "Change language settings",
      icon: faLanguage,
      gradient: "from-indigo-500 to-blue-600",
      iconBg: "bg-gradient-to-br from-indigo-100 to-blue-100",
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: faQuestionCircle,
      gradient: "from-pink-500 to-rose-600",
      iconBg: "bg-gradient-to-br from-pink-100 to-rose-100",
    },
  ];

  return (
    <IonPage className="bg-gradient-to-br from-gray-50 to-gray-100">
      <IonContent fullscreen className="font-inter" scrollY={true}>
        {/* Modern Header with Animated Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white px-5 pt-12 pb-40">
          {/* Animated decorative orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute top-1/2 -left-20 w-56 h-56 bg-pink-400/20 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-0 right-1/3 w-48 h-48 bg-indigo-300/15 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative z-10 flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black mb-1">My Profile</h1>
              <p className="text-white/80 text-sm font-medium">
                Manage your account
              </p>
            </div>
            <button className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg">
              <FontAwesomeIcon icon={faCog} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Main Profile Card with Glass Effect */}
        <div className="px-5 -mt-32 mb-6 relative z-20">
          <div className="bg-white rounded-3xl p-6 shadow-2xl backdrop-blur-xl border border-gray-100 animate-scaleIn">
            {/* Avatar Section */}
            <div className="relative text-center mb-6">
              <div className="relative inline-block mb-5">
                {/* Gradient ring around avatar */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                <IonAvatar className="relative w-28 h-28 mx-auto ring-4 ring-white shadow-2xl">
                  <img alt="Profile" src={user.avatar} />
                </IonAvatar>
                {/* Edit button with gradient */}
                <button className="absolute bottom-1 right-1 w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white">
                  <FontAwesomeIcon icon={faPencil} className="text-sm" />
                </button>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                {user.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-600 font-semibold text-sm">
                  {user.position}
                </p>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-2">
                {user.company} • {user.department}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-full border border-violet-100">
                <FontAwesomeIcon
                  icon={faIdCard}
                  className="text-violet-600 text-xs"
                />
                <span className="text-xs font-bold text-violet-700">
                  {user.employeeId}
                </span>
              </div>
            </div>

            {/* Tabs for Info and Stats */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === "info"
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === "stats"
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Statistics
              </button>
            </div>

            {/* Information Tab */}
            {activeTab === "info" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-blue-100/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                      Email Address
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-green-100/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <FontAwesomeIcon icon={faPhone} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                      Phone Number
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {user.phone}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-purple-100/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      className="text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                      Department
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {user.department}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-orange-100/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {user.location}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-cyan-100/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <FontAwesomeIcon icon={faCalendar} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                      Join Date
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(user.joinDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "stats" && (
              <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                {stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className={`${stat.bgColor} rounded-2xl p-5 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-stagger`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <FontAwesomeIcon
                        icon={stat.icon}
                        className="text-white text-lg"
                      />
                    </div>
                    <p className={`text-3xl font-black ${stat.textColor} mb-1`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 font-semibold leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings Menu with Modern Cards */}
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-gray-900">
              Settings & More
            </h3>
            <div className="w-8 h-1 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"></div>
          </div>

          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                className="group w-full flex items-center gap-4 p-4 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 animate-stagger active:scale-95"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-xl text-gray-700"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-0.5 group-hover:text-violet-600 transition-colors duration-300">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.subtitle}
                  </p>
                </div>
                <div className="w-9 h-9 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-gray-400 group-hover:text-white text-sm transition-all duration-300 group-hover:translate-x-0.5"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modern Logout Button */}
        <div className="px-5 pb-6">
          <button className="w-full h-14 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white font-black rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
            <span>Logout</span>
          </button>
        </div>

        {/* App Info Footer */}
        <div className="text-center pb-12 space-y-1">
          <p className="text-xs text-gray-400 font-semibold">
            HRIS Mobile App v1.0.0
          </p>
          <p className="text-xs text-gray-400">© 2025 Bridgestone Karawang</p>
          <p className="text-[10px] text-gray-300">
            Made with ❤️ for better workforce management
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
