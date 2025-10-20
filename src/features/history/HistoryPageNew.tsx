import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonToast,
  IonModal,
  IonButton,
  IonSearchbar,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Type guard functions
function isAttendance(
  item: Attendance | LeaveRequest | OvertimeRequest
): item is Attendance {
  return "clock_in" in item || "tanggal" in item;
}

function isLeaveRequest(
  item: Attendance | LeaveRequest | OvertimeRequest
): item is LeaveRequest {
  return "leave_type" in item && "start_date" in item;
}

function isOvertimeRequest(
  item: Attendance | LeaveRequest | OvertimeRequest
): item is OvertimeRequest {
  return "date" in item && "start_time" in item && !("clock_in" in item);
}
import {
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faHourglass,
  faCalendar,
  faClock,
  faFilter,
  faUmbrella,
  faClockRotateLeft,
  faMapMarkerAlt,
  faFileAlt,
  faXmark,
  faUser,
  faCalendarCheck,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import {
  attendanceService,
  leaveService,
  overtimeService,
} from "../../services";
import type {
  Attendance,
  LeaveRequest,
  OvertimeRequest,
} from "../../types/api.types";

const HistoryPage: React.FC = () => {
  const history = useHistory();

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "attendance" | "leave" | "overtime"
  >("attendance");

  // Data state
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [overtimeHistory, setOvertimeHistory] = useState<OvertimeRequest[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    Attendance | LeaveRequest | OvertimeRequest | null
  >(null);

  // Load data on mount and tab change
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (activeTab === "attendance") {
        const data = await attendanceService.getHistory({
          start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          end_date: new Date().toISOString().split("T")[0],
        });
        setAttendanceHistory(data);
      } else if (activeTab === "leave") {
        const data = await leaveService.getHistory();
        setLeaveHistory(data);
      } else if (activeTab === "overtime") {
        const data = await overtimeService.getHistory();
        setOvertimeHistory(data);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Gagal memuat data history");
      setShowToast(true);

      // Use fallback data
      if (activeTab === "attendance") {
        setAttendanceHistory([
          {
            id: 1,
            tanggal: "2025-10-18",
            jam_masuk: "08:30",
            jam_keluar: "17:15",
            status: "present",
            clock_in_location: "Jakarta Office",
          },
          {
            id: 2,
            tanggal: "2025-10-17",
            jam_masuk: "09:15",
            jam_keluar: "17:30",
            status: "late",
            clock_in_location: "Jakarta Office",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search
  const getFilteredAttendance = (): Attendance[] => {
    let data = attendanceHistory;

    // Filter by status
    if (filterStatus !== "all") {
      data = data.filter((item) => item.status === filterStatus);
    }

    // Search
    if (searchQuery) {
      data = data.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return JSON.stringify(item).toLowerCase().includes(searchLower);
      });
    }

    return data;
  };

  const getFilteredLeave = (): LeaveRequest[] => {
    let data = leaveHistory;

    // Filter by status
    if (filterStatus !== "all") {
      data = data.filter((item) => item.status === filterStatus);
    }

    // Search
    if (searchQuery) {
      data = data.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return JSON.stringify(item).toLowerCase().includes(searchLower);
      });
    }

    return data;
  };

  const getFilteredOvertime = (): OvertimeRequest[] => {
    let data = overtimeHistory;

    // Filter by status
    if (filterStatus !== "all") {
      data = data.filter((item) => item.status === filterStatus);
    }

    // Search
    if (searchQuery) {
      data = data.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return JSON.stringify(item).toLowerCase().includes(searchLower);
      });
    }

    return data;
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: "from-emerald-400 to-teal-500",
      pending: "from-amber-400 to-orange-500",
      rejected: "from-red-400 to-rose-500",
      present: "from-emerald-400 to-teal-500",
      hadir: "from-emerald-400 to-teal-500",
      late: "from-amber-400 to-orange-500",
      telat: "from-amber-400 to-orange-500",
      absent: "from-red-400 to-rose-500",
    };
    return colors[status] || "from-gray-400 to-gray-500";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      approved: "Disetujui",
      pending: "Menunggu",
      rejected: "Ditolak",
      present: "Hadir",
      hadir: "Hadir",
      late: "Terlambat",
      telat: "Terlambat",
      absent: "Tidak Hadir",
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved" || status === "present" || status === "hadir")
      return faCheckCircle;
    if (status === "rejected") return faTimesCircle;
    return faHourglass;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  const calculateWorkHours = (clockIn: string, clockOut: string) => {
    if (!clockIn || !clockOut) return 0;
    const [inHour, inMin] = clockIn.split(":").map(Number);
    const [outHour, outMin] = clockOut.split(":").map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    return Math.round(((outMinutes - inMinutes) / 60) * 10) / 10;
  };

  const handleDetailClick = (
    item: Attendance | LeaveRequest | OvertimeRequest
  ) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const tabs: Array<{
    value: "attendance" | "leave" | "overtime";
    label: string;
    icon: typeof faCalendarCheck;
  }> = [
    { value: "attendance", label: "Absensi", icon: faCalendarCheck },
    { value: "leave", label: "Cuti", icon: faUmbrella },
    { value: "overtime", label: "Lembur", icon: faClockRotateLeft },
  ];

  return (
    <IonPage className="bg-gradient-to-b from-slate-50 via-blue-50 to-white">
      <IonContent fullscreen className="font-inter">
        {/* Modern Enhanced Header */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 text-white px-5 pt-10 pb-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-10 left-0 w-56 h-56 bg-fuchsia-300/10 rounded-full blur-2xl animate-float-delayed"></div>

          {/* Header Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => history.goBack()}
                className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
                >
                  <FontAwesomeIcon icon={faFilter} className="text-lg" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faHistory} />
                History
              </h1>
              <p className="text-sm text-white/80">
                Riwayat aktivitas dan pengajuan Anda
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <IonSearchbar
                value={searchQuery}
                onIonInput={(e) => setSearchQuery(e.detail.value!)}
                placeholder="Cari history..."
                className="custom-searchbar"
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 -mt-12 mb-5">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-1.5 shadow-2xl shadow-purple-500/10 border border-white/50">
            <div className="grid grid-cols-3 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.value
                      ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <FontAwesomeIcon icon={tab.icon} className="text-lg" />
                    <span className="text-xs">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <IonSpinner
                  name="crescent"
                  className="w-12 h-12 text-purple-600"
                />
                <p className="mt-4 text-gray-600 font-medium">
                  Loading history...
                </p>
              </div>
            </div>
          ) : (activeTab === "attendance" &&
              getFilteredAttendance().length === 0) ||
            (activeTab === "leave" && getFilteredLeave().length === 0) ||
            (activeTab === "overtime" && getFilteredOvertime().length === 0) ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-3xl text-gray-400"
                />
              </div>
              <p className="text-gray-600 font-bold">Tidak ada data</p>
              <p className="text-sm text-gray-400 mt-1">
                Belum ada riwayat untuk ditampilkan
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Attendance History */}
              {activeTab === "attendance" &&
                getFilteredAttendance().map((record, index) => (
                  <div
                    key={record.id}
                    onClick={() => handleDetailClick(record)}
                    className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-purple-200 cursor-pointer transform hover:-translate-y-1"
                    style={{
                      animation: `slideInRight 0.6s ease-out ${
                        index * 0.1
                      }s backwards`,
                    }}
                  >
                    {/* Decorative Line */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full bg-gradient-to-b ${getStatusColor(
                        record.status
                      )} group-hover:w-2 transition-all`}
                    ></div>

                    <div className="ml-2">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getStatusColor(
                              record.status
                            )} flex items-center justify-center shadow-lg`}
                          >
                            <FontAwesomeIcon
                              icon={getStatusIcon(record.status)}
                              className="text-white text-lg"
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-800">
                              {
                                formatDate(
                                  record.tanggal || record.date || ""
                                ).split(",")[0]
                              }
                            </p>
                            <p className="text-xs text-gray-400 font-bold">
                              {new Date(
                                record.tanggal || record.date || ""
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r ${getStatusColor(
                            record.status
                          )} text-white shadow-md`}
                        >
                          {getStatusText(record.status)}
                        </div>
                      </div>

                      {/* Time Details */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 text-center border border-blue-100/50">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="text-blue-600 text-xs"
                            />
                            <p className="text-xs text-gray-500 font-black">
                              Masuk
                            </p>
                          </div>
                          <p className="text-sm font-black text-blue-600">
                            {formatTime(
                              record.jam_masuk || record.clock_in || "-"
                            )}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-3 text-center border border-rose-100/50">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="text-rose-600 text-xs"
                            />
                            <p className="text-xs text-gray-500 font-black">
                              Keluar
                            </p>
                          </div>
                          <p className="text-sm font-black text-rose-600">
                            {formatTime(
                              record.jam_keluar || record.clock_out || "-"
                            )}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-3 text-center border border-emerald-100/50">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FontAwesomeIcon
                              icon={faCalendarCheck}
                              className="text-emerald-600 text-xs"
                            />
                            <p className="text-xs text-gray-500 font-black">
                              Jam
                            </p>
                          </div>
                          <p className="text-sm font-black text-emerald-600">
                            {(record.jam_masuk || record.clock_in) &&
                            (record.jam_keluar || record.clock_out)
                              ? calculateWorkHours(
                                  record.jam_masuk || record.clock_in || "",
                                  record.jam_keluar || record.clock_out || ""
                                ) + "h"
                              : "-"}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      {(record.clock_in_location || record.keterangan) && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="text-gray-400"
                          />
                          <span>
                            {record.clock_in_location || record.keterangan}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {/* Leave History */}
              {activeTab === "leave" &&
                getFilteredLeave().map((leave, index) => (
                  <div
                    key={leave.id}
                    onClick={() => handleDetailClick(leave)}
                    className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-purple-200 cursor-pointer transform hover:-translate-y-1"
                    style={{
                      animation: `slideInRight 0.6s ease-out ${
                        index * 0.1
                      }s backwards`,
                    }}
                  >
                    {/* Decorative Line */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full bg-gradient-to-b ${getStatusColor(
                        leave.status
                      )} group-hover:w-2 transition-all`}
                    ></div>

                    <div className="ml-2">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon
                              icon={faUmbrella}
                              className="text-white text-lg"
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-800">
                              {leave.leave_type === "annual"
                                ? "Cuti Tahunan"
                                : leave.leave_type === "sick"
                                ? "Cuti Sakit"
                                : leave.leave_type}
                            </p>
                            <p className="text-xs text-gray-400 font-bold">
                              {leave.duration} hari •{" "}
                              {new Date(leave.created_at).toLocaleDateString(
                                "id-ID",
                                { day: "numeric", month: "short" }
                              )}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r ${getStatusColor(
                            leave.status
                          )} text-white shadow-md flex items-center gap-1`}
                        >
                          <FontAwesomeIcon icon={getStatusIcon(leave.status)} />
                          {getStatusText(leave.status)}
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 mb-3 border border-indigo-100/50">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-xs text-gray-500 font-bold mb-1">
                              Dari
                            </p>
                            <p className="font-black text-indigo-600">
                              {new Date(leave.start_date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </p>
                          </div>
                          <div className="text-gray-400 text-xl">→</div>
                          <div>
                            <p className="text-xs text-gray-500 font-bold mb-1">
                              Sampai
                            </p>
                            <p className="font-black text-purple-600">
                              {new Date(leave.end_date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-1">
                          Alasan:
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {leave.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Overtime History */}
              {activeTab === "overtime" &&
                getFilteredOvertime().map((overtime, index) => (
                  <div
                    key={overtime.id}
                    onClick={() => handleDetailClick(overtime)}
                    className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-purple-200 cursor-pointer transform hover:-translate-y-1"
                    style={{
                      animation: `slideInRight 0.6s ease-out ${
                        index * 0.1
                      }s backwards`,
                    }}
                  >
                    {/* Decorative Line */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full bg-gradient-to-b ${getStatusColor(
                        overtime.status
                      )} group-hover:w-2 transition-all`}
                    ></div>

                    <div className="ml-2">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon
                              icon={faClockRotateLeft}
                              className="text-white text-lg"
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-800">
                              Lembur - {overtime.duration}h
                            </p>
                            <p className="text-xs text-gray-400 font-bold">
                              {formatDate(overtime.date)}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r ${getStatusColor(
                            overtime.status
                          )} text-white shadow-md flex items-center gap-1`}
                        >
                          <FontAwesomeIcon
                            icon={getStatusIcon(overtime.status)}
                          />
                          {getStatusText(overtime.status)}
                        </div>
                      </div>

                      {/* Time Range */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 mb-3 border border-purple-100/50">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-xs text-gray-500 font-bold mb-1">
                              Mulai
                            </p>
                            <p className="font-black text-purple-600">
                              {formatTime(overtime.start_time)}
                            </p>
                          </div>
                          <div className="text-gray-400 text-xl">→</div>
                          <div>
                            <p className="text-xs text-gray-500 font-bold mb-1">
                              Selesai
                            </p>
                            <p className="font-black text-pink-600">
                              {formatTime(overtime.end_time)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-1">
                          Deskripsi Pekerjaan:
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {overtime.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </IonContent>

      {/* Filter Modal */}
      <IonModal
        isOpen={showFilterModal}
        onDidDismiss={() => setShowFilterModal(false)}
        className="custom-modal"
      >
        <div className="h-full bg-gradient-to-b from-slate-50 to-white p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Filter</h2>
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
            >
              <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "all", label: "Semua" },
                  { value: "pending", label: "Menunggu" },
                  { value: "approved", label: "Disetujui" },
                  { value: "rejected", label: "Ditolak" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterStatus(option.value);
                      setShowFilterModal(false);
                    }}
                    className={`p-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                      filterStatus === option.value
                        ? "border-purple-500 bg-purple-50 text-purple-600"
                        : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <IonButton
              expand="block"
              onClick={() => {
                setFilterStatus("all");
                setShowFilterModal(false);
              }}
              className="mt-6"
              style={{
                "--background":
                  "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                "--border-radius": "16px",
                height: "48px",
                fontWeight: "700",
              }}
            >
              Reset Filter
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Detail Modal */}
      <IonModal
        isOpen={showDetailModal}
        onDidDismiss={() => setShowDetailModal(false)}
        className="custom-modal"
      >
        <div className="h-full bg-gradient-to-b from-slate-50 to-white p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Detail</h2>
            <button
              onClick={() => setShowDetailModal(false)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
            >
              <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
            </button>
          </div>

          {selectedItem && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div
                className={`p-4 rounded-2xl bg-gradient-to-r ${getStatusColor(
                  selectedItem.status
                )} text-white`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={getStatusIcon(selectedItem.status)}
                    className="text-2xl"
                  />
                  <div>
                    <p className="text-sm font-bold opacity-90">Status</p>
                    <p className="text-lg font-black">
                      {getStatusText(selectedItem.status)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl p-4 space-y-3">
                {isAttendance(selectedItem) && (
                  <>
                    <DetailRow
                      icon={faCalendar}
                      label="Tanggal"
                      value={formatDate(
                        selectedItem.tanggal || selectedItem.date || ""
                      )}
                    />
                    <DetailRow
                      icon={faClock}
                      label="Jam Masuk"
                      value={formatTime(
                        selectedItem.jam_masuk || selectedItem.clock_in || ""
                      )}
                    />
                    <DetailRow
                      icon={faClock}
                      label="Jam Keluar"
                      value={formatTime(
                        selectedItem.jam_keluar || selectedItem.clock_out || ""
                      )}
                    />
                    <DetailRow
                      icon={faMapMarkerAlt}
                      label="Lokasi"
                      value={
                        selectedItem.clock_in_location ||
                        selectedItem.keterangan ||
                        "-"
                      }
                    />
                  </>
                )}

                {isLeaveRequest(selectedItem) && (
                  <>
                    <DetailRow
                      icon={faUser}
                      label="Jenis Cuti"
                      value={
                        selectedItem.leave_type === "annual"
                          ? "Cuti Tahunan"
                          : "Cuti Sakit"
                      }
                    />
                    <DetailRow
                      icon={faCalendar}
                      label="Dari"
                      value={formatDate(selectedItem.start_date)}
                    />
                    <DetailRow
                      icon={faCalendar}
                      label="Sampai"
                      value={formatDate(selectedItem.end_date)}
                    />
                    <DetailRow
                      icon={faCalendarCheck}
                      label="Durasi"
                      value={`${selectedItem.duration} hari`}
                    />
                    <DetailRow
                      icon={faFileAlt}
                      label="Alasan"
                      value={selectedItem.reason}
                    />
                  </>
                )}

                {isOvertimeRequest(selectedItem) && (
                  <>
                    <DetailRow
                      icon={faCalendar}
                      label="Tanggal"
                      value={formatDate(selectedItem.date)}
                    />
                    <DetailRow
                      icon={faClock}
                      label="Mulai"
                      value={formatTime(selectedItem.start_time)}
                    />
                    <DetailRow
                      icon={faClock}
                      label="Selesai"
                      value={formatTime(selectedItem.end_time)}
                    />
                    <DetailRow
                      icon={faClockRotateLeft}
                      label="Durasi"
                      value={`${selectedItem.duration} jam`}
                    />
                    <DetailRow
                      icon={faFileAlt}
                      label="Pekerjaan"
                      value={selectedItem.reason}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </IonModal>

      <style>{`
        .custom-searchbar {
          --background: transparent;
          --border-radius: 16px;
          --box-shadow: none;
          --color: white;
          --placeholder-color: rgba(255, 255, 255, 0.6);
          --icon-color: white;
          padding: 0;
        }

        .custom-modal {
          --height: 80%;
          --border-radius: 24px 24px 0 0;
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

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Toast */}
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

// Helper Component for Detail Modal
const DetailRow: React.FC<{
  icon: typeof faCalendar;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <FontAwesomeIcon icon={icon} className="text-purple-600 text-sm" />
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 font-bold mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 font-semibold">{value}</p>
    </div>
  </div>
);

export default HistoryPage;
