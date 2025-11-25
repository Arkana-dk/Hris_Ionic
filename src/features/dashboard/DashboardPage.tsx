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

  // Office Services - Hanya 4 menu seperti gambar MyTelkomsel
  const services = [
    {
      id: "submission",
      name: "Submission",
      icon: faPaperPlane,
      color: "bg-gradient-to-br from-blue-800 to-blue-900 ",
      textColor: "text-white",
      route: "/pengajuan",
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: faCalendarDays,
      color: "bg-gradient-to-br from-emerald-800 to-green-600 ",
      textColor: "text-white",
      route: "/kalender",
    },
    {
      id: "document",
      name: "Document",
      icon: faFileLines,
      color: "bg-gradient-to-br from-violet-800 to-purple-900 ",
      textColor: "text-white",
      route: "/documents",
    },
    {
      id: "payslip",
      name: "Payslip",
      icon: faDollarSign,
      color: "bg-gradient-to-br from-red-800 to-rose-600 ",
      textColor: "text-white",
      route: "/payslip",
    },
  ];

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  return (
    <IonPage className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-white">
      <IonContent fullscreen className="font-inter relative overflow-hidden">
        {/* Clean Background - No Purple */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-20 -right-16 w-80 h-80 bg-gray-200/40 blur-3xl rounded-full"></div>
          <div className="absolute bottom-[-90px] -left-24 w-96 h-96 bg-gray-300/30 blur-3xl rounded-full"></div>
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
            {/* Info Card - Full Width Dark Card */}
            <div
              className="mb-6 animate-fadeInUp"
              style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
            >
              <div className="relative bg-gradient-to-br from-zinc-900 to-blue-600 rounded-b-[40px] shadow-2xl p-6 overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-600/20 via-pink-600/15 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/15 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  {/* Header dengan PP + Greeting + Notification */}
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <IonAvatar className="w-14 h-14 ring-4 ring-red-500/30 shadow-xl">
                        <img
                          alt="Profile"
                          src={user.avatar}
                          className="object-cover"
                        />
                      </IonAvatar>
                      <div>
                        <p className="text-white/80 text-xs font-medium mb-1">
                          {getGreeting(currentTime)} 👋
                        </p>
                        <h1 className="font-bold text-lg leading-tight tracking-wide text-white">
                          {user.fullName}
                        </h1>
                      </div>
                    </div>

                    {/* Notification Bell */}
                    <button className="relative p-3 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full hover:from-blue-800 hover:to-blue-950 transition-all duration-300 active:scale-90 shadow-lg">
                      <FontAwesomeIcon
                        icon={faBell}
                        className="text-white text-lg"
                      />
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-blue-700 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-gray-900 shadow-md">
                        3
                      </span>
                    </button>
                  </div>

                  {/* Active Until + Current Time - Modern Card Style */}
                  <div className="mb-5 bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/50 text-[10px] font-medium mb-0.5">
                            Active Until
                          </p>
                          <p className="text-white text-xs font-semibold">
                            {currentTime.toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-white/50 text-[10px] font-medium mb-0.5 text-right">
                            Current Time
                          </p>
                          <p className="text-white text-base font-bold tracking-wider">
                            {currentTime.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Status - Grid 2 kolom */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {/* Work Hours */}
                    <div>
                      <p className="text-white/60 text-xs mb-2 font-medium">
                        Work Hours
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-yellow-400 font-black text-3xl">
                          {dashboardData?.attendance?.working_duration?.split(
                            "h"
                          )[0] || "0"}
                        </span>
                        <span className="text-white/90 text-sm font-bold">
                          h
                        </span>
                        <button
                          onClick={() => history.push("/attendance")}
                          className="ml-2 w-6 h-6 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold hover:from-blue-800 hover:to-blue-950 transition-all hover:scale-110 shadow-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* This Month */}
                    <div>
                      <p className="text-white/60 text-xs mb-2 font-medium">
                        This Month
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-green-400 font-black text-3xl">
                          {dashboardData?.statistics?.attendance_count || 0}
                        </span>
                        <span className="text-white/90 text-sm font-bold">
                          days
                        </span>
                        <button
                          onClick={() => history.push("/history")}
                          className="ml-2 w-6 h-6 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold hover:from-blue-800 hover:to-blue-950 transition-all hover:scale-110 shadow-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Clock In/Out Section - Mirip Telkomsel */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center flex-1">
                        <p className="text-white/70 text-xs mb-1">Check In</p>
                        <p className="text-white font-bold text-base">
                          {dashboardData?.attendance?.clock_in_time
                            ? new Date(
                                dashboardData.attendance.clock_in_time
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "--:--"}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div className="text-center flex-1">
                        <p className="text-white/70 text-xs mb-1">Check Out</p>
                        <p className="text-white font-bold text-base">
                          {dashboardData?.attendance?.clock_out_time
                            ? new Date(
                                dashboardData.attendance.clock_out_time
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "Not Yet"}
                        </p>
                      </div>
                    </div>

                    {/* Clock In/Out Button */}
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
                      className={`w-full font-bold text-base py-4 rounded-2xl shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                        dashboardData?.attendance?.clock_out_time
                          ? "bg-gray-600 text-white/70"
                          : dashboardData?.attendance?.clock_in_time
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                          : "bg-gradient-to-br from-teal-800 to-green-600 hover:from-teal-900 hover:to-green-700 text-white"
                      }`}
                    >
                      {clockInLoading || clockOutLoading ? (
                        <>
                          <IonSpinner name="crescent" className="w-6 h-6" />
                          <span>Processing...</span>
                        </>
                      ) : dashboardData?.attendance?.clock_out_time ? (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-xl"
                          />
                          <span>COMPLETED TODAY</span>
                        </>
                      ) : dashboardData?.attendance?.clock_in_time ? (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-xl"
                          />
                          <span>CLOCK OUT NOW</span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-xl"
                          />
                          <span>CLOCK IN NOW</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => history.push("/attendance")}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-white text-base"
                        />
                      </div>
                      <span className="text-sm font-bold">View History</span>
                    </button>
                    <button
                      onClick={() => history.push("/history")}
                      className="text-white/80 hover:text-white text-sm font-bold transition-colors flex items-center gap-1"
                    >
                      <span>See All</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Icons - Square Design (Back to Original) */}
            <div className="px-5 mb-6 mt-6">
              <div className="grid grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => handleNavigate(service.route)}
                    className="flex flex-col items-center group animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 0.08}s`,
                      animationFillMode: "backwards",
                    }}
                  >
                    {/* Icon Square/Rounded Square */}
                    <div
                      className={`w-16 h-16 rounded-[20px] flex items-center justify-center ${service.color} shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 mb-2 relative overflow-hidden`}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <FontAwesomeIcon
                        icon={service.icon}
                        className={`text-xl ${service.textColor} relative z-10 drop-shadow-md`}
                      />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors">
                      {service.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links Banner - HR Workspace Style */}
            <div
              className="px-5 mb-5 animate-fadeInUp"
              style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
            >
              <div className="relative bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-3xl overflow-hidden shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="inline-block bg-cyan-400 text-blue-900 px-3 py-1 rounded-full text-xs font-black mb-2 shadow-lg">
                        💼 HR WORKSPACE
                      </div>
                      <h3 className="text-white font-black text-xl leading-tight mb-2 drop-shadow-lg">
                        Employee Portal
                      </h3>
                      <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow">
                        Access your attendance, leave requests, and payslips in
                        one place
                      </p>
                    </div>
                    <div className="text-5xl">🏢</div>
                  </div>
                  <button
                    onClick={() => history.push("/profile")}
                    className="mt-2 bg-white text-blue-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-cyan-400 hover:text-blue-900 hover:scale-105 transition-all duration-300 shadow-xl active:scale-95 border-2 border-white/30"
                  >
                    View Profile →
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-3 right-6 flex gap-1.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Company Info Card - Compact */}
            <div
              className="px-5 mb-5 animate-fadeInUp"
              style={{
                animationDelay: "0.25s",
                animationFillMode: "backwards",
              }}
            >
              <div className="relative bg-white rounded-2xl p-4 shadow-lg border border-gray-100 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-xl"></div>

                <div className="relative z-10">
                  {/* Header with Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-2 h-2 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-sm mb-0.5">
                        PT. Hakuna Matata
                      </h3>
                      <p className="text-gray-500 text-[10px] font-medium">
                        HR Workspace System
                      </p>
                    </div>
                  </div>

                  {/* Info Grid - Compact */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Contact */}
                    <div className="col-span-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-500 text-[9px] font-medium mb-0.5">
                            Contact
                          </p>
                          <p className="text-gray-900 text-xs font-bold truncate">
                            hris@hakunamatata.com
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[9px] font-medium mb-0.5">
                        Status
                      </p>
                      <p className="text-gray-900 text-xs font-bold">Active</p>
                    </div>

                    {/* Year */}
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[9px] font-medium mb-0.5">
                        Year
                      </p>
                      <p className="text-gray-900 text-xs font-bold">2025</p>
                    </div>

                    {/* Version */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[9px] font-medium mb-0.5">
                        Version
                      </p>
                      <p className="text-gray-900 text-xs font-bold">v1.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcements - Enhanced Card Design */}
            <div
              className="px-5 mb-24 animate-fadeInUp"
              style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header with gradient */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h2 className="font-bold text-sm text-gray-900">
                      Latest News
                    </h2>
                  </div>
                  <button
                    onClick={() => history.push("/announcements")}
                    className="text-blue-600 text-xs font-bold hover:text-blue-700 transition-colors"
                  >
                    See All →
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  {announcements.length > 0 ? (
                    <div className="space-y-2">
                      {announcements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className="relative bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] border border-gray-100 hover:border-blue-200"
                          onClick={() => history.push("/announcements")}
                        >
                          {/* Decorative line */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-l-xl"></div>

                          <div className="p-3 pl-4">
                            <div className="flex gap-2 items-start">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="text-gray-900 font-semibold text-xs line-clamp-1 flex-1">
                                    {announcement.title}
                                  </h4>
                                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap">
                                    NEW
                                  </span>
                                </div>
                                <p className="text-gray-600 text-[11px] leading-snug line-clamp-1 mb-1">
                                  {announcement.content}
                                </p>
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="w-2.5 h-2.5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <p className="text-gray-400 text-[9px] font-medium">
                                    {new Date(
                                      announcement.created_at
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs font-semibold mb-0.5">
                        No announcements yet
                      </p>
                      <p className="text-gray-400 text-[10px]">
                        Check back later for updates
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
