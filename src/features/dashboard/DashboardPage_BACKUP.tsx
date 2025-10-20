import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonAvatar,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faWallet,
  faPlane,
  faClock,
  faBriefcase,
  faCalendarDays,
  faFileLines,
  faCalendarCheck,
  faDollarSign,
  faSun,
  faMoon,
  faCloudSun,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts";
import { dashboardService } from "../../services";
import type {
  DashboardData,
  EventData,
  AnnouncementData,
} from "../../services/dashboard.service";

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const { user: authUser, isAuthenticated } = useAuth();

  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [todayEvent, setTodayEvent] = useState<EventData | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all dashboard data
      const [dashboard, events, announcementsData] = await Promise.all([
        dashboardService.getDashboard().catch(() => null),
        dashboardService.getTodayEvents().catch(() => []),
        dashboardService.getAnnouncements(3).catch(() => []),
      ]);

      setDashboardData(dashboard);
      setTodayEvent(events.length > 0 ? events[0] : null);
      setAnnouncements(announcementsData);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Use user from auth context with fallbacks
  const user = {
    name: authUser?.name || "User",
    position: authUser?.position || "Employee",
    avatar:
      authUser?.avatar ||
      "https://ionicframework.com/docs/img/demos/avatar.svg",
    fullName: authUser?.name || "Employee",
    jobTitle:
      dashboardData?.user?.job_title ||
      authUser?.position ||
      authUser?.department ||
      "Position",
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Selamat Pagi", icon: faSun };
    if (hour < 15) return { text: "Selamat Siang", icon: faCloudSun };
    if (hour < 18) return { text: "Selamat Sore", icon: faCloudSun };
    return { text: "Selamat Malam", icon: faMoon };
  };

  // Office Services - 8 fitur dengan gradient vibrant desig      color: "bg-gradient-to-br from-blue-400 to-indigo-600",
      textColor: "text-white",
      route: "/pengajuan",
    },
    {
      id: "paid-leave",
      name: "Paid Leave",
      icon: faPlane,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      textColor: "text-white",
      route: "/pengajuan",
    },
    {
      id: "overtime",
      name: "Overtime",
      icon: faClock,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      textColor: "text-white",
      route: "/history",
    },
    {
      id: "assignment",
      name: "Assignment",
      icon: faBriefcase,
      color: "bg-gradient-to-br from-indigo-400 to-purple-600",
      textColor: "text-white",
      route: "/kalender",
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: faCalendarDays,
      color: "bg-gradient-to-br from-blue-400 to-indigo-600",
      textColor: "text-white",
      route: "/kalender",
    },
    {
      id: "document",
      name: "Document",
      icon: faFileLines,
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
      textColor: "text-white",
      route: "/documents",
    },
    {
      id: "events",
      name: "Events",
      icon: faCalendarCheck,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      textColor: "text-white",
      route: "/kalender",
    },
    {
      id: "payslip",
      name: "Payslip",
      icon: faDollarSign,
      color: "bg-gradient-to-br from-blue-400 to-purple-600",
ender",
    },
    {
      id: "payslip",
      name: "Payslip",
      icon: faDollarSign,
      color: "bg-gradient-to-br from-violet-400 to-violet-600",
      textColor: "text-white",
      route: "/payslip",
    },
  ];

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  return (
    <IonPage className="bg-gray-50">
      <IonContent fullscreen className="font-inter">
        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <IonSpinner
                name="crescent"
                className="w-12 h-12 text-violet-600"
              />
              <p className="mt-4                       </div>
        )}

        {/* Main Dashboard Content */}
        <div className="animate-fadeIn">
          {/* Premium Corporate Header with Glassmorphism */}
          <div className="relative">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white px-6 pt-12 pb-16 rounded-b-[2rem] shadow-2xl animate-fadeInDown">
              {/* Sophisticated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
                }}></div>
              </div>
              
              {/* Elegant Floating Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 blur-3xl rounded-full"></div>
                <div className="absolute top-10 -left-20 w-56 h-56 bg-gradient-to-br from-violet-500/15 to-purple-500/10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-blue-400/5 blur-3xl rounded-full"></div>
              </div>

              {/* Header Content */}
              <div className="relative">
                {/* Top Bar with Bell */}
                <div className="flex justify-between items-center mb-6">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full"></div>
                  <button className="relative p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group">
                    <FontAwesomeIcon 
                      icon={faBell} 
                      className="text-xl text-white/90 group-hover:text-white transition-colors" 
                    />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                  </button>
                </div>

                {/* Profile Section */}
                <div className="flex items-start space-x-4">
                  {/* Premium Avatar with Status Ring */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                    <IonAvatar className="relative w-16 h-16 ring-4 ring-white/20 rounded-2xl overflow-hidden">
                      <img 
                        alt="Profile" 
                        src={user.avatar}
                        className="w-full h-full object-cover"
                      />
                    </IonAvatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-slate-900 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* User Info with Modern Typography */}
                  <div className="flex-1 min-w-0">
                    {/* Greeting with Time-based Icon */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-lg backdrop-blur-sm border border-amber-300/30">
                        <FontAwesomeIcon
                          icon={getGreeting().icon}
                          className="text-sm text-amber-300"
                        />
                      </div>
                      <span className="text-xs font-medium text-blue-200/80 tracking-wide uppercase">
                        {getGreeting().text}
                      </span>
                    </div>

                    {/* Name with Professional Typography */}
                    <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight leading-tight">
                      {user.fullName}
                    </h1>

                    {/* Position with Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      <p className="text-xs font-medium text-blue-100 tracking-wide">
                        {user.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional: Date & Time Display */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-blue-200/70">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
                    <span className="text-xs font-medium">
                      {new Date().toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Up Today Section - Modern Design */}
            <div className="relative px-5 -mt-8">
              {todayEvent ? (
                <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-fadeInUp">
                  <div className="flex items-center gap-4">
                    {/* Modern Date Circle */}
                    <d                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300">
                        <span className="text-white font-black text-2xl drop-shadow-md">
                          {new Date().getDate()}
                        </span>
                      </div>
                    </div>

                    {/* Event Info with Icon */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                          Today's Schedule
                        </p>
                      </div>
                      <h3 className="font-black text-gray-800 text-sm mb-0.5 truncate">
                        {todayEvent.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="text-violet-500 text-xs"
                        />
                        <p className="font-bold text-gray-600 text-xs">
                          {todayEvent.time}
                        </p>
                      </div>
                    </div>

                    {/* Modern See Details Button */}
                    <button
                      onClick={() => handleNavigate("/kalender")}
                      className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-300"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-fadeInUp">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-black text-2xl">
                        {new Date().getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm font-medium">
                        No events scheduled for today
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Office Services - 8 items */}
            <div className="px-5 mb-6 mt-6">
              <h2 className="text-gray-800 font-bold text-xl mb-4">
                Office Services
              </h2>
              <div className="grid grid-cols-4 gap-3 text-center">
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => handleNavigate(service.route)}
                    className="flex flex-col items-center animate-stagger hover-scale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.color} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer mb-1.5`}
                    >
                      <FontAwesomeIcon
                        icon={service.icon}
                        className={`text-xl ${service.textColor}`}
                      />
                    </div>
                    <p
                      className={`text-[10px] font-medium text-gray-700 leading-tight`}
                    >
                      {service.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Office News */}
            <div className="px-5 mb-6">
              <h2 className="text-gray-800 font-bold text-xl mb-4">
                Office News
              </h2>
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl animate-scaleIn relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">
                    Hello A-Team! Welcome on Super Apps for Amartha!
                  </h3>
                  <button className="mt-3 bg-white text-indigo-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-smooth">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="px-5 mb-8">
              <h2 className="text-gray-800 font-bold text-xl mb-4">
                Announcements
              </h2>
              {announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.map((announcement, index) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-xl p-4 flex space-x-4 items-start shadow-md hover-lift animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Icon/Image Placeholder */}
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center">
         <div
                      key={announcement.id}
                      className="bg-white rounded-xl p-4 flex space-x-4 items-start shadow-md hover-lift animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Icon/Image Placeholder */}
                      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <span className="text-3xl">📰</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-1">
                          {announcement.title}
                        </h4>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          {announcement.content}
                        </p>
                        <p className="text-gray-400 text-[10px] mt-2">
                          {new Date(announcement.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-4 text-center shadow-md">
                  <p className="text-gray-500 text-sm">
                    No announcements at this time
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </IonContent>

      {/* Error Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={error}
        duration={3000}
        position="top"
        color="danger"
      />
    </IonPage>
  );
};

export default DashboardPage;
