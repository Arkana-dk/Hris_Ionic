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

  // Office Services - 8 fitur dengan gradient vibrant design
  const services = [
    {
      id: "reimburse",
      name: "Reimburse",
      icon: faWallet,
      color: "bg-gradient-to-br from-cyan-400 to-cyan-600",
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
      color: "bg-gradient-to-br from-pink-400 to-pink-600",
      textColor: "text-white",
      route: "/history",
    },
    {
      id: "assignment",
      name: "Assignment",
      icon: faBriefcase,
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
      textColor: "text-white",
      route: "/kalender",
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: faCalendarDays,
      color: "bg-gradient-to-br from-teal-400 to-teal-600",
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
      color: "bg-gradient-to-br from-rose-400 to-rose-600",
      textColor: "text-white",
      route: "/kalender",
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
              <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 pt-10 pb-12 rounded-b-3xl shadow-lg animate-fadeInDown">
              <div className="absolute inset-0">
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -left-14 w-40 h-40 bg-pink-400/25 blur-3xl rounded-full animate-[pulse_5s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-400/20 blur-3xl rounded-full animate-[pulse_7s_ease-in-out_infinite]"></div>
              </div>
              <div className="relative flex justify-between items-start">
                <div className="flex items-start space-x-3 flex-1">
                  <IonAvatar className="w-12 h-12 flex-shrink-0 mt-1">
                    <img alt="Profile" src={user.avatar} />
                  </IonAvatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon
                        icon={getGreeting().icon}
                        className="text-lg text-yellow-200"
                      />
                      <h1 className="font-bold text-base">
                        {getGreeting().text} {user.fullName},
                      </h1>
                    </div>
                    <p className="text-xs text-indigo-200 leading-relaxed">
                      {user.jobTitle}
                    </p>
                  </div>
                </div>
                <button className="relative flex-shrink-0 ml-3 mt-1">
                  <FontAwesomeIcon icon={faBell} className="text-2xl" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>

            {/* What's Up Today Section - Modern Design */}
            <div className="relative px-5 -mt-8">
              {todayEvent ? (
                <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-fadeInUp">
                  <div className="flex items-center gap-4">
                    {/* Modern Date Circle */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 transform hover:scale-105 transition-all duration-300">
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
                      className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 active:scale-95 transition-all duration-300"
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
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl animate-scaleIn relative overflow-hidden">
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
