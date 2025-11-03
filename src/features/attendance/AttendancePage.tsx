import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonSpinner, IonToast } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { attendanceService } from "../../services";
import type { Attendance, AttendanceStatistics } from "../../types/api.types";
import {
  faArrowLeft,
  faHistory,
  faCheckCircle,
  faClock,
  faUserClock,
  faCalendarDays,
  faDownload,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const AttendancePage: React.FC = () => {
  const history = useHistory();
  const [currentTime] = useState(new Date());

  // API State
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Attendance[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "present" | "late" | "absent"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load attendance data
  useEffect(() => {
    loadAttendanceData();
  }, []);

  // Filter attendance based on selected filter and search
  useEffect(() => {
    let filtered = [...attendanceHistory];

    // Apply status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((record) => record.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((record) => {
        const date = new Date(record.tanggal || record.date || "");
        const dateStr = date.toLocaleDateString("id-ID");
        const dayName = date.toLocaleDateString("id-ID", { weekday: "long" });
        return (
          dateStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dayName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredHistory(filtered);
  }, [attendanceHistory, selectedFilter, searchQuery]);

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
    } catch (err) {
      console.error("Failed to load attendance:", err);
      // Fallback to static data
      setAttendanceHistory([
        {
          id: "1",
          tanggal: "2025-11-03",
          jam_masuk: "08:45",
          jam_keluar: "17:30",
          status: "present",
          keterangan: "",
        },
        {
          id: "2",
          tanggal: "2025-11-02",
          jam_masuk: "09:15",
          jam_keluar: "17:45",
          status: "late",
          keterangan: "Terlambat 15 menit",
        },
        {
          id: "3",
          tanggal: "2025-11-01",
          jam_masuk: "08:30",
          jam_keluar: "17:15",
          status: "present",
          keterangan: "",
        },
        {
          id: "4",
          tanggal: "2025-10-31",
          jam_masuk: "",
          jam_keluar: "",
          status: "absent",
          keterangan: "Izin sakit",
        },
        {
          id: "5",
          tanggal: "2025-10-30",
          jam_masuk: "08:50",
          jam_keluar: "17:20",
          status: "present",
          keterangan: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      // Just for updating currentTime if needed
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Use real statistics from API, fallback to static
  const monthlyStats = {
    present: statistics?.present_days || 20,
    late: statistics?.late_days || 3,
    absent: statistics?.absent_days || 1,
    totalHours:
      typeof statistics?.total_hours === "string"
        ? parseFloat(statistics.total_hours.split(":")[0] || "168")
        : statistics?.total_hours || 176,
    onTimeRate: statistics?.on_time_rate || 87,
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
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
    });
  };

  // Helper to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <IonPage className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
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
            {/* Compact Header */}
            <div className="relative bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white px-5 pt-6 pb-16 overflow-hidden">
              {/* Subtle Background */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>

              {/* Top Navigation */}
              <div className="relative flex items-center justify-between mb-4">
                <button
                  onClick={() => history.goBack()}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 active:scale-90"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-base" />
                </button>
                <h1 className="text-lg font-black">Riwayat Presensi</h1>
                <button className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 active:scale-90">
                  <FontAwesomeIcon icon={faDownload} className="text-base" />
                </button>
              </div>

              {/* Compact Date Info */}
              <div className="relative text-center">
                <p className="text-xs text-white/80 font-medium mb-0.5">
                  {formatDate(currentTime.toISOString().split("T")[0])}
                </p>
                <p className="text-xl font-black tracking-tight">
                  {getDayName(currentTime.toISOString().split("T")[0])}
                </p>
              </div>
            </div>

            {/* Content Container */}
            <div className="px-5 mt-5 pb-8">
              {/* Compact Stats Cards with proper spacing */}
              <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100 mb-4">
                <div className="grid grid-cols-4 gap-3">
                  {/* Present Days */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-1.5 shadow-md">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-white text-sm"
                      />
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-0.5">
                      {monthlyStats.present}
                    </p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">
                      Hadir
                    </p>
                  </div>

                  {/* Late Days */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-1.5 shadow-md">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-white text-sm"
                      />
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-0.5">
                      {monthlyStats.late}
                    </p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">
                      Terlambat
                    </p>
                  </div>

                  {/* Absent Days */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-1.5 shadow-md">
                      <FontAwesomeIcon
                        icon={faBan}
                        className="text-white text-sm"
                      />
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-0.5">
                      {monthlyStats.absent}
                    </p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">
                      Tidak Hadir
                    </p>
                  </div>

                  {/* Total Hours */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-1.5 shadow-md">
                      <FontAwesomeIcon
                        icon={faUserClock}
                        className="text-white text-sm"
                      />
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-0.5">
                      {monthlyStats.totalHours}
                    </p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">
                      Jam
                    </p>
                  </div>
                </div>
              </div>

              {/* Compact Filter Section */}
              <div className="bg-white rounded-xl p-2.5 shadow-md border border-gray-100 mb-3">
                <div className="flex gap-1.5 mb-2.5">
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] transition-all duration-300 ${
                      selectedFilter === "all"
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setSelectedFilter("present")}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] transition-all duration-300 ${
                      selectedFilter === "present"
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Hadir
                  </button>
                  <button
                    onClick={() => setSelectedFilter("late")}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] transition-all duration-300 ${
                      selectedFilter === "late"
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Terlambat
                  </button>
                  <button
                    onClick={() => setSelectedFilter("absent")}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] transition-all duration-300 ${
                      selectedFilter === "absent"
                        ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tidak Hadir
                  </button>
                </div>

                {/* Compact Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari tanggal atau hari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pr-9 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"
                  />
                </div>
              </div>

              {/* Attendance History - Clean Minimalist Design */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-black text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={faHistory}
                      className="text-teal-500 text-[10px]"
                    />
                    Riwayat Kehadiran
                  </h3>
                  <span className="text-[10px] text-gray-500 font-bold">
                    {filteredHistory.length} data
                  </span>
                </div>

                {filteredHistory.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FontAwesomeIcon
                        icon={faHistory}
                        className="text-gray-400 text-lg"
                      />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">
                      Tidak ada data ditemukan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredHistory.map((record, index) => {
                      const statusConfig = {
                        present: {
                          bgColor: "bg-emerald-50",
                          borderColor: "border-emerald-200",
                          iconColor: "text-emerald-500",
                          badgeBg: "bg-emerald-100",
                          badgeText: "text-emerald-700",
                          label: "Hadir",
                          icon: faCheckCircle,
                        },
                        late: {
                          bgColor: "bg-amber-50",
                          borderColor: "border-amber-200",
                          iconColor: "text-amber-500",
                          badgeBg: "bg-amber-100",
                          badgeText: "text-amber-700",
                          label: "Terlambat",
                          icon: faClock,
                        },
                        absent: {
                          bgColor: "bg-rose-50",
                          borderColor: "border-rose-200",
                          iconColor: "text-rose-500",
                          badgeBg: "bg-rose-100",
                          badgeText: "text-rose-700",
                          label: "Tidak Hadir",
                          icon: faBan,
                        },
                      };

                      const config =
                        statusConfig[
                          record.status as keyof typeof statusConfig
                        ] || statusConfig.present;

                      return (
                        <div
                          key={record.id}
                          className={`bg-white rounded-xl p-3 shadow-md border ${config.borderColor} hover:shadow-lg transition-all duration-300`}
                          style={{
                            animation: `slideInRight 0.4s ease-out ${
                              index * 0.08
                            }s backwards`,
                          }}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-9 h-9 ${config.bgColor} rounded-lg flex items-center justify-center`}
                              >
                                <FontAwesomeIcon
                                  icon={config.icon}
                                  className={`${config.iconColor} text-sm`}
                                />
                              </div>
                              <div>
                                <p className="font-black text-gray-800 text-xs leading-tight">
                                  {getDayName(
                                    record.tanggal || record.date || ""
                                  )}
                                </p>
                                <p className="text-[9px] text-gray-500 font-medium leading-tight">
                                  {formatDate(
                                    record.tanggal || record.date || ""
                                  )}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`${config.badgeBg} ${config.badgeText} px-2 py-0.5 rounded-md text-[9px] font-bold uppercase`}
                            >
                              {config.label}
                            </span>
                          </div>

                          {/* Time Info */}
                          {record.status !== "absent" ? (
                            <div className="grid grid-cols-3 gap-1.5">
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 text-center border border-blue-100">
                                <p className="text-[8px] text-gray-500 font-bold uppercase mb-0.5 leading-tight">
                                  Masuk
                                </p>
                                <p className="text-xs font-black text-blue-600">
                                  {record.jam_masuk || record.clock_in || "-"}
                                </p>
                              </div>
                              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-2 text-center border border-rose-100">
                                <p className="text-[8px] text-gray-500 font-bold uppercase mb-0.5 leading-tight">
                                  Keluar
                                </p>
                                <p className="text-xs font-black text-rose-600">
                                  {record.jam_keluar || record.clock_out || "-"}
                                </p>
                              </div>
                              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-2 text-center border border-teal-100">
                                <p className="text-[8px] text-gray-500 font-bold uppercase mb-0.5 leading-tight">
                                  Total
                                </p>
                                <p className="text-xs font-black text-teal-600">
                                  {(record.jam_masuk || record.clock_in) &&
                                  (record.jam_keluar || record.clock_out)
                                    ? `${calculateWorkHours(
                                        record.jam_masuk ||
                                          record.clock_in ||
                                          "",
                                        record.jam_keluar ||
                                          record.clock_out ||
                                          ""
                                      )}h`
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                              <p className="text-[10px] text-gray-600 font-medium">
                                {record.keterangan || "Tidak ada keterangan"}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </IonContent>

      <style>{`
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Toast Notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => {
          setShowToast(false);
          setError("");
        }}
        message={error}
        duration={3000}
        position="top"
        color="danger"
      />
    </IonPage>
  );
};

export default AttendancePage;
