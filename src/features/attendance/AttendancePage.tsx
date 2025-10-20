import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { attendanceService } from "../../services";
import type { Attendance, AttendanceStatistics } from "../../types/api.types";
import {
  faMapMarkerAlt,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faUserClock,
  faHistory,
  faChartLine,
  faClockRotateLeft,
  faBan,
  faCalendarPlus,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const AttendancePage: React.FC = () => {
  const history = useHistory();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [workDuration, setWorkDuration] = useState("0h 0m");
  const [currentTime, setCurrentTime] = useState(new Date());

  // API State
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load attendance data
  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);

      // Load both history and statistics in parallel
      const [attendanceData, statsData] = await Promise.all([
        attendanceService
          .getHistory({
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            end_date: new Date().toISOString().split("T")[0],
          })
          .catch(() => []),
        attendanceService
          .getStatistics({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          })
          .catch(() => null),
      ]);

      setAttendanceHistory(attendanceData);
      setStatistics(statsData);

      // Check if already clocked in today
      const today = new Date().toISOString().split("T")[0];
      const todayAttendance = attendanceData.find(
        (att: Attendance) => att.tanggal === today || att.date === today
      );
      if (
        todayAttendance &&
        (todayAttendance.jam_masuk || todayAttendance.clock_in) &&
        !(todayAttendance.jam_keluar || todayAttendance.clock_out)
      ) {
        setIsClockedIn(true);
        setClockInTime(
          todayAttendance.jam_masuk || todayAttendance.clock_in || ""
        );
      }
    } catch (err) {
      console.error("Failed to load attendance:", err);
      setAttendanceHistory([]);
      setError(
        "Gagal memuat data kehadiran. Silakan coba lagi atau hubungi IT Support."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // Calculate work duration if clocked in
      if (isClockedIn && clockInTime) {
        const clockInDate = new Date();
        const [hours, minutes] = clockInTime.split(":");
        clockInDate.setHours(parseInt(hours));
        clockInDate.setMinutes(parseInt(minutes));

        const diff = new Date().getTime() - clockInDate.getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setWorkDuration(`${hrs}h ${mins}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockedIn, clockInTime]);

  const handleClockIn = async () => {
    try {
      setSubmitting(true);
      setError("");

      // Get current location
      const location = await attendanceService.getCurrentLocation();

      // Clock in
      await attendanceService.clockIn({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setClockInTime(timeString);
      setIsClockedIn(true);
      setSuccessMessage("Clock in berhasil!");
      setShowToast(true);

      // Reload attendance data
      loadAttendanceData();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Gagal clock in");
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setSubmitting(true);
      setError("");

      // Get current location
      const location = await attendanceService.getCurrentLocation();

      // Clock out (using submitPresensi with type 'keluar')
      await attendanceService.submitPresensi({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setIsClockedIn(false);
      setWorkDuration("0h 0m");
      setSuccessMessage("Clock out berhasil!");
      setShowToast(true);

      // Reload attendance data
      loadAttendanceData();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Gagal clock out");
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Use real statistics from API, fallback to static
  const monthlyStats = {
    present: statistics?.present_days || 18,
    late: statistics?.late_days || 2,
    absent: statistics?.absent_days || 0,
    totalHours:
      typeof statistics?.total_hours === "string"
        ? parseFloat(statistics.total_hours.split(":")[0] || "168")
        : statistics?.total_hours || 168.5,
    onTimeRate: statistics?.on_time_rate || 90,
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Helper to calculate work hours
  const calculateWorkHours = (clockIn: string, clockOut: string): number => {
    if (!clockIn || !clockOut) return 0;
    const [inHour, inMin] = clockIn.split(":").map(Number);
    const [outHour, outMin] = clockOut.split(":").map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    return Math.round(((outMinutes - inMinutes) / 60) * 100) / 100;
  };

  // Helper to get day name from date
  const getDayName = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const shiftInfo = {
    name: "NS 2",
    time: "08.00 - 16.45",
    checkIn: "07:37",
    checkOut: "Belum Keluar",
  };

  return (
    <IonPage className="bg-gradient-to-b from-slate-50 via-blue-50 to-white">
      <IonContent fullscreen className="font-inter">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <IonSpinner name="crescent" className="w-12 h-12 text-teal-600" />
              <p className="mt-4 text-gray-600 font-medium">
                Loading attendance data...
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {/* Modern Enhanced Header */}
            <div className="relative bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white px-5 pt-10 pb-24 overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-10 left-0 w-56 h-56 bg-cyan-300/10 rounded-full blur-2xl animate-float-delayed"></div>

              {/* Sun/Moon Decoration */}
              <div className="absolute top-8 right-8 w-20 h-20 opacity-20">
                <div className="w-full h-full bg-yellow-200 rounded-full animate-pulse-soft"></div>
                <div className="absolute top-2 right-2 w-16 h-16 bg-yellow-100 rounded-full"></div>
              </div>

              {/* Top Navigation */}
              <div className="relative flex items-center justify-between mb-6">
                <button
                  onClick={() => history.goBack()}
                  className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                </button>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                  <span className="text-xs font-semibold">Jakarta Office</span>
                </div>
              </div>

              {/* Date and Shift Info Card */}
              <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-black mb-0.5">
                      {currentTime.toLocaleDateString("id-ID", {
                        day: "numeric",
                      })}{" "}
                      {currentTime.toLocaleDateString("id-ID", {
                        month: "long",
                      })}{" "}
                      {currentTime.toLocaleDateString("id-ID", {
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-white/70 font-semibold">
                      {shiftInfo.name} ( {shiftInfo.time} )
                    </p>
                  </div>
                </div>

                {/* Clock Time */}
                <div className="text-center py-3 mb-3">
                  <div className="text-5xl font-black tracking-tight drop-shadow-lg">
                    {formatTime(currentTime)}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                    <span className="text-white/80">
                      Masuk:{" "}
                      <span className="font-bold text-orange-200">
                        {shiftInfo.checkIn}
                      </span>
                    </span>
                    <span className="text-white/80">
                      Keluar:{" "}
                      <span className="font-bold text-orange-200">
                        {shiftInfo.checkOut}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-4 gap-2.5">
                  <button className="flex flex-col items-center gap-1.5 p-3 bg-white/15 backdrop-blur-sm rounded-2xl hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/20">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                      <FontAwesomeIcon
                        icon={faClockRotateLeft}
                        className="text-white text-sm"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white/90">
                      Lembur
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-1.5 p-3 bg-white/15 backdrop-blur-sm rounded-2xl hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/20">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <FontAwesomeIcon
                        icon={faBan}
                        className="text-white text-sm"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white/90">
                      Izin
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-1.5 p-3 bg-white/15 backdrop-blur-sm rounded-2xl hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/20">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <FontAwesomeIcon
                        icon={faCalendarPlus}
                        className="text-white text-sm"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white/90">
                      Ganti Shift
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-1.5 p-3 bg-white/15 backdrop-blur-sm rounded-2xl hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/20">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <FontAwesomeIcon
                        icon={faUserCheck}
                        className="text-white text-sm"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white/90">
                      Aktivitas
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-5 -mt-16 pb-8">
              {/* Clock In/Out Button Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl shadow-teal-500/10 mb-6 relative overflow-hidden border border-white/50">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>

                {/* Warning Message */}
                <div className="relative mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                  <p className="text-xs text-center text-gray-700 font-bold">
                    ⚠️ Jangan lewatkan absensi kehadiran Anda hari ini!
                  </p>
                </div>

                {/* Status Display */}
                {isClockedIn && (
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 shadow-sm">
                      <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                          Sedang Bekerja
                        </p>
                        <p className="text-xl font-black text-emerald-600">
                          {workDuration}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clock In/Out Button */}
                <IonButton
                  expand="block"
                  className={`h-16 font-black text-lg shadow-xl ${
                    isClockedIn
                      ? "custom-button-danger"
                      : "custom-button-success"
                  }`}
                  onClick={isClockedIn ? handleClockOut : handleClockIn}
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-3">
                      <IonSpinner name="crescent" />
                      <span>PROCESSING...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={isClockedIn ? faTimesCircle : faCheckCircle}
                        className="text-2xl"
                      />
                      <span>{isClockedIn ? "KELUAR" : "MASUK"}</span>
                    </div>
                  )}
                </IonButton>

                {/* Status Info when clocked in */}
                {isClockedIn && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100/50 text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">
                        Clock In
                      </p>
                      <p className="text-sm font-black text-emerald-600">
                        {clockInTime}
                      </p>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-gray-100 text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">
                        Break Time
                      </p>
                      <p className="text-sm font-black text-gray-700">1h 0m</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Monthly Performance Stats - Soft Pastel Cards */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                      <FontAwesomeIcon
                        icon={faChartLine}
                        className="text-white text-xs"
                      />
                    </div>
                    This Month
                  </h3>
                  <div className="text-xs text-gray-400 font-bold">
                    October 2025
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Present Days */}
                  <div className="group bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-4 shadow-xl shadow-emerald-500/20 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-11 h-11 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl filter drop-shadow-lg">
                            ✓
                          </span>
                        </div>
                        <div className="text-[10px] font-black text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-inner">
                          {monthlyStats.onTimeRate}%
                        </div>
                      </div>
                      <p className="text-3xl font-black text-white mb-0.5 drop-shadow-md">
                        {monthlyStats.present}
                      </p>
                      <p className="text-xs text-white/90 font-bold">
                        Present Days
                      </p>
                    </div>
                  </div>

                  {/* Late Days */}
                  <div className="group bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-4 shadow-xl shadow-orange-500/20 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-11 h-11 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="text-white text-lg drop-shadow-lg"
                          />
                        </div>
                      </div>
                      <p className="text-3xl font-black text-white mb-0.5 drop-shadow-md">
                        {monthlyStats.late}
                      </p>
                      <p className="text-xs text-white/90 font-bold">
                        Late Arrivals
                      </p>
                    </div>
                  </div>

                  {/* Absent Days - Hidden if 0 */}
                  {monthlyStats.absent > 0 && (
                    <div className="group bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl p-4 shadow-xl shadow-rose-500/20 transform hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-11 h-11 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl filter drop-shadow-lg">
                              ✗
                            </span>
                          </div>
                        </div>
                        <p className="text-3xl font-black text-white mb-0.5 drop-shadow-md">
                          {monthlyStats.absent}
                        </p>
                        <p className="text-xs text-white/90 font-bold">
                          Absent Days
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Total Hours */}
                  <div className="group bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl p-4 shadow-xl shadow-blue-500/20 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-11 h-11 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                          <FontAwesomeIcon
                            icon={faUserClock}
                            className="text-white text-lg drop-shadow-lg"
                          />
                        </div>
                      </div>
                      <p className="text-3xl font-black text-white mb-0.5 drop-shadow-md">
                        {monthlyStats.totalHours}h
                      </p>
                      <p className="text-xs text-white/90 font-bold">
                        Total Hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance History - 3D Depth Cards */}
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                      <FontAwesomeIcon
                        icon={faHistory}
                        className="text-white text-xs"
                      />
                    </div>
                    Recent History
                  </h3>
                  <button className="text-xs text-teal-600 font-black hover:text-teal-700 transition-colors px-3 py-1.5 bg-teal-50 rounded-full hover:bg-teal-100">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {attendanceHistory.map((record, index) => (
                    <div
                      key={record.id}
                      className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-teal-200 overflow-hidden transform hover:-translate-y-1"
                      style={{
                        animation: `slideInRight 0.6s ease-out ${
                          index * 0.15
                        }s backwards`,
                      }}
                    >
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                      {/* Colored left border accent */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-all duration-300 ${
                          record.status === "present"
                            ? "bg-gradient-to-b from-emerald-400 to-teal-500 group-hover:w-2"
                            : "bg-gradient-to-b from-amber-400 to-orange-500 group-hover:w-2"
                        }`}
                      ></div>

                      <div className="relative ml-2">
                        {/* Header with Date and Status */}
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                record.status === "present"
                                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30"
                                  : "bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30"
                              }`}
                            >
                              {/* Glow effect */}
                              <div
                                className={`absolute inset-0 rounded-2xl blur-md opacity-50 ${
                                  record.status === "present"
                                    ? "bg-emerald-400"
                                    : "bg-orange-400"
                                }`}
                              ></div>
                              <FontAwesomeIcon
                                icon={
                                  record.status === "present"
                                    ? faCheckCircle
                                    : faClock
                                }
                                className="text-white text-lg drop-shadow-lg relative z-10"
                              />
                            </div>
                            <div>
                              <p className="font-black text-gray-800 text-sm">
                                {getDayName(
                                  record.tanggal || record.date || ""
                                )}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                                {new Date(
                                  record.tanggal || record.date || ""
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide shadow-md transition-all duration-300 group-hover:shadow-lg ${
                              record.status === "present"
                                ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-emerald-500/20"
                                : "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 shadow-orange-500/20"
                            }`}
                          >
                            {record.status === "present"
                              ? "✓ On Time"
                              : "⏰ Late"}
                          </div>
                        </div>

                        {/* Time Details Grid - 3D Cards */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="group/card relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-2.5 text-center border border-blue-100/50 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-400/5 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                            <div className="relative">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="text-white text-[8px]"
                                  />
                                </div>
                                <p className="text-[9px] text-gray-500 font-black uppercase">
                                  In
                                </p>
                              </div>
                              <p className="text-xs font-black text-blue-600">
                                {record.jam_masuk || record.clock_in || "-"}
                              </p>
                            </div>
                          </div>

                          <div className="group/card relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-2.5 text-center border border-rose-100/50 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/0 to-pink-400/5 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                            <div className="relative">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="w-5 h-5 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md shadow-rose-500/30">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="text-white text-[8px]"
                                  />
                                </div>
                                <p className="text-[9px] text-gray-500 font-black uppercase">
                                  Out
                                </p>
                              </div>
                              <p className="text-xs font-black text-rose-600">
                                {record.jam_keluar ||
                                  record.clock_out ||
                                  "Belum Keluar"}
                              </p>
                            </div>
                          </div>

                          <div className="group/card relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-2.5 text-center border border-teal-100/50 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 to-cyan-400/5 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                            <div className="relative">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="w-5 h-5 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/30">
                                  <FontAwesomeIcon
                                    icon={faUserClock}
                                    className="text-white text-[8px]"
                                  />
                                </div>
                                <p className="text-[9px] text-gray-500 font-black uppercase">
                                  Hrs
                                </p>
                              </div>
                              <p className="text-xs font-black text-teal-600">
                                {(record.jam_masuk || record.clock_in) &&
                                (record.jam_keluar || record.clock_out)
                                  ? `${calculateWorkHours(
                                      record.jam_masuk || record.clock_in || "",
                                      record.jam_keluar ||
                                        record.clock_out ||
                                        ""
                                    )}h`
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </IonContent>

      <style>{`
        .custom-button-success {
          --background: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%);
          --background-hover: linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%);
          --background-activated: linear-gradient(135deg, #047857 0%, #0f766e 50%, #0e7490 100%);
          --border-radius: 18px;
          --box-shadow: 0 12px 35px -8px rgba(16, 185, 129, 0.4), 0 0 20px -5px rgba(20, 184, 166, 0.3);
        }
        
        .custom-button-danger {
          --background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          --background-hover: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          --background-activated: linear-gradient(135deg, #b91c1c 0%, #c2410c 100%);
          --border-radius: 18px;
          --box-shadow: 0 12px 35px -8px rgba(239, 68, 68, 0.4), 0 0 20px -5px rgba(249, 115, 22, 0.3);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>

      {/* Toast Notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => {
          setShowToast(false);
          setError("");
          setSuccessMessage("");
        }}
        message={error || successMessage}
        duration={3000}
        position="top"
        color={error ? "danger" : "success"}
      />
    </IonPage>
  );
};

export default AttendancePage;
