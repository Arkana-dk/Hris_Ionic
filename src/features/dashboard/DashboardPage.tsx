import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonAvatar,
  IonSpinner,
  IonToast,
  IonAlert,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faPaperPlane,
  faCalendarDays,
  faFileLines,
  faDollarSign,
  faCloudSun,
  faMapMarkerAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts";
import { dashboardService } from "../../services";
import attendanceService from "../../services/attendance.service";
import type {
  DashboardData,
  AnnouncementData,
} from "../../services/dashboard.service";

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const { user: authUser, isAuthenticated } = useAuth();

  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);
  const [showClockInAlert, setShowClockInAlert] = useState(false);
  const [showClockOutAlert, setShowClockOutAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: 28,
    condition: "Sunny",
    location: "Jakarta Office",
  });

  // Greeting helper based on current time (ID locale)
  const getGreeting = (date: Date) => {
    const h = date.getHours();
    if (h >= 4 && h < 11) return "Selamat pagi";
    if (h >= 11 && h < 15) return "Selamat siang";
    if (h >= 15 && h < 18) return "Selamat sore";
    return "Selamat malam";
  };

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate weather data (you can replace with real API)
  useEffect(() => {
    const getWeather = async () => {
      // Mock weather data - replace with real weather API
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 18) {
        setWeather({
          temp: 28,
          condition: "Sunny",
          location: "Jakarta Office",
        });
      } else {
        setWeather({
          temp: 24,
          condition: "Clear",
          location: "Jakarta Office",
        });
      }
    };
    getWeather();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all dashboard data
      const [dashboard, announcementsData] = await Promise.all([
        dashboardService.getDashboard().catch(() => null),
        dashboardService.getAnnouncements(3).catch(() => []),
      ]);

      setDashboardData(dashboard);
      setAnnouncements(announcementsData);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Get current location
  const getLocation = async () => {
    try {
      const position = await attendanceService.getCurrentLocation();
      return position;
    } catch (err) {
      console.error("Error getting location:", err);
      setError("Failed to get location. Please enable location services.");
      setShowToast(true);
      throw err;
    }
  };

  // Handle Clock In
  const handleClockIn = async () => {
    try {
      setClockInLoading(true);
      const position = await getLocation();

      const clockInData = {
        type: "in" as const,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        notes: "Clock in from mobile app",
      };

      await attendanceService.clockIn(clockInData);

      // Reload dashboard data to get updated attendance status
      await loadDashboardData();

      setShowClockInAlert(true);
    } catch (err) {
      console.error("Clock in error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clock in";
      setError(errorMessage);
      setShowToast(true);
    } finally {
      setClockInLoading(false);
    }
  };

  // Handle Clock Out
  const handleClockOut = async () => {
    try {
      setClockOutLoading(true);
      const position = await getLocation();

      const clockOutData = {
        type: "out" as const,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        notes: "Clock out from mobile app",
      };

      await attendanceService.clockIn(clockOutData);

      // Reload dashboard data to get updated attendance status
      await loadDashboardData();

      setShowClockOutAlert(true);
    } catch (err) {
      console.error("Clock out error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clock out";
      setError(errorMessage);
      setShowToast(true);
    } finally {
      setClockOutLoading(false);
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

  // Office Services - 4 fitur dengan gradient vibrant design
  const services = [
    {
      id: "submission",
      name: "submission",
      icon: faPaperPlane,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white",
      route: "/pengajuan",
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: faCalendarDays,
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      textColor: "text-white",
      route: "/kalender",
    },
    {
      id: "document",
      name: "Document",
      icon: faFileLines,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white",
      route: "/documents",
    },
    {
      id: "payslip",
      name: "Payslip",
      icon: faDollarSign,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      textColor: "text-white",
      route: "/payslip",
    },
  ];

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  return (
    <IonPage className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-sky-50">
      <IonContent fullscreen className="font-inter relative overflow-hidden">
        {/* Soft background ornaments */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-20 -right-16 w-80 h-80 bg-gradient-to-br from-violet-200/60 via-indigo-200/40 to-sky-200/40 blur-3xl rounded-full"></div>
          <div className="absolute bottom-[-90px] -left-24 w-96 h-96 bg-gradient-to-tr from-cyan-200/50 via-sky-200/30 to-indigo-200/40 blur-3xl rounded-full"></div>
        </div>
        {/* Loading Indicator */}
        {loading && (
          <div className="relative z-10 flex items-center justify-center h-screen">
            <div className="text-center">
              <IonSpinner
                name="crescent"
                className="w-12 h-12 text-purple-600"
              />
              <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <div className="relative z-10">
            {/* Header - Compact with animation */}
            <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 text-white px-5 pt-9 pb-7 rounded-b-[32px] shadow-lg mb-4 animate-slideDown">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full opacity-50 animate-pulse-slow"></div>
              <div className="absolute top-8 right-8 w-10 h-10 bg-white/10 rounded-full animate-float"></div>

              <div className="relative flex justify-between items-center">
                {/* User Info */}
                <div className="flex items-center space-x-3 animate-fadeInLeft">
                  <IonAvatar className="w-12 h-12 ring-2 ring-white/20">
                    <img
                      alt="Profile"
                      src={user.avatar}
                      className="object-cover"
                    />
                  </IonAvatar>
                  <div>
                    <p className="text-white/90 text-[10px] font-semibold">
                      {getGreeting(currentTime)}
                    </p>
                    <h1 className="font-bold text-sm leading-tight tracking-wide">
                      {user.fullName}
                    </h1>
                  </div>
                </div>

                {/* Notification Bell */}
                <button className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-300 active:scale-90 animate-fadeInRight">
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-white text-base animate-bell-ring"
                  />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                </button>
              </div>
            </div>

            {/* Today's Overview - Animated */}
            <div
              className="px-4 mt-4 animate-fadeInUp"
              style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
            >
              <div className="relative bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-500 rounded-[20px] shadow-xl p-3 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-600/20 rounded-full blur-xl opacity-40"></div>

                <div className="relative z-10">
                  {/* Location & Weather - Minimal */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-white text-[8px]"
                      />
                      <span className="text-white text-[9px] font-semibold">
                        {weather.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <FontAwesomeIcon
                        icon={faCloudSun}
                        className="text-yellow-200 text-[8px]"
                      />
                      <span className="text-white text-[9px] font-semibold">
                        {weather.temp}°C
                      </span>
                    </div>
                  </div>
                  {/* Time Card - Minimalist */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 mb-2 shadow-md">
                    <p className="text-white text-[10px] font-medium opacity-80 text-center mb-0.5">
                      {currentTime.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="text-white font-black text-3xl tracking-tight text-center">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                  </div>

                  {/* Attendance Card - Clean & Minimalist */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 shadow-md">
                    {/* Clock In/Out Status */}
                    <div className="flex items-center justify-center gap-2 mb-2.5 text-white/95 text-[10px] font-semibold">
                      <div className="bg-black/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <span>
                          Masuk:{" "}
                          {dashboardData?.attendance?.clock_in_time
                            ? new Date(
                                dashboardData.attendance.clock_in_time
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "--:--"}
                        </span>
                      </div>
                      <div className="bg-black/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <span>
                          Keluar:{" "}
                          {dashboardData?.attendance?.clock_out_time
                            ? new Date(
                                dashboardData.attendance.clock_out_time
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "Belum"}
                        </span>
                      </div>
                    </div>

                    {/* Main Action Button - Minimalist */}
                    <button
                      onClick={
                        dashboardData?.attendance?.clock_in_time
                          ? handleClockOut
                          : handleClockIn
                      }
                      disabled={
                        clockInLoading ||
                        clockOutLoading ||
                        !!dashboardData?.attendance?.clock_out_time
                      }
                      className={`w-full font-bold text-sm py-3 rounded-2xl shadow-lg transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-2 border-t border-white/20 ${
                        dashboardData?.attendance?.clock_out_time
                          ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                          : dashboardData?.attendance?.clock_in_time
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      }`}
                    >
                      {clockInLoading || clockOutLoading ? (
                        <IonSpinner name="crescent" className="w-5 h-5" />
                      ) : dashboardData?.attendance?.clock_out_time ? (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-base drop-shadow"
                          />
                          <span className="drop-shadow">SELESAI</span>
                        </>
                      ) : dashboardData?.attendance?.clock_in_time ? (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-base drop-shadow"
                          />
                          <span className="drop-shadow">KELUAR</span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-base drop-shadow"
                          />
                          <span className="drop-shadow">MASUK</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Services - Modern Animated Design */}
            <div className="px-5 mb-4 mt-4">
              <h2 className="text-gray-800 font-bold text-sm mb-3">
                Office Services
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => handleNavigate(service.route)}
                    className="flex flex-col items-center group animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <div
                      className={`w-14 h-14 rounded-[20px] flex items-center justify-center ${service.color} shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 mb-1.5 relative overflow-hidden`}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <FontAwesomeIcon
                        icon={service.icon}
                        className={`text-base ${service.textColor} relative z-10 drop-shadow-md`}
                      />
                    </div>
                    <p className="text-[10px] font-semibold text-gray-600 text-center leading-tight group-hover:text-gray-800 transition-colors">
                      {service.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Office News - Animated Card */}
            <div
              className="px-5 mb-4 animate-fadeInUp"
              style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
            >
              <h2 className="text-gray-800 font-bold text-sm mb-2.5">
                Office News
              </h2>
              <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-float"></div>

                <div className="relative z-10">
                  <h3 className="font-bold text-xs mb-2 leading-normal">
                    Hello A-Team! Welcome on Super Apps for Amartha!
                  </h3>
                  <button className="mt-1 bg-white text-purple-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-md active:scale-95">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements - Animated List */}
            <div
              className="px-5 mb-6 animate-fadeInUp"
              style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
            >
              <h2 className="text-gray-800 font-bold text-sm mb-2.5">
                Announcements
              </h2>
              {announcements.length > 0 ? (
                <div className="space-y-2">
                  {announcements.map((announcement, index) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-200 animate-slideInRight"
                      style={{
                        animationDelay: `${0.5 + index * 0.1}s`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <div className="flex gap-2.5 items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-base">📰</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-800 font-bold text-[11px] mb-0.5 line-clamp-1">
                            {announcement.title}
                          </h4>
                          <p className="text-gray-500 text-[10px] leading-snug line-clamp-1">
                            {announcement.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                  <p className="text-gray-400 text-xs">
                    No announcements at this time
                  </p>
                </div>
              )}
            </div>
          </div>
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

      {/* Clock In Success Alert */}
      <IonAlert
        isOpen={showClockInAlert}
        onDidDismiss={() => setShowClockInAlert(false)}
        header="Clock In Success"
        message="You have successfully clocked in. Have a productive day!"
        buttons={["OK"]}
      />

      {/* Clock Out Success Alert */}
      <IonAlert
        isOpen={showClockOutAlert}
        onDidDismiss={() => setShowClockOutAlert(false)}
        header="Clock Out Success"
        message="You have successfully clocked out. See you tomorrow!"
        buttons={["OK"]}
      />

      {/* Modern Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bell-ring {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(-10deg);
          }
          20%, 40% {
            transform: rotate(10deg);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-bell-ring {
          animation: bell-ring 1s ease-in-out;
        }

        button:hover .animate-bell-ring {
          animation: bell-ring 1s ease-in-out infinite;
        }
      `}</style>
    </IonPage>
  );
};

export default DashboardPage;
