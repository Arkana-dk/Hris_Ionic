import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faCalendar,
  faFileUpload,
  faClock,
  faUmbrella,
  faHospital,
  faBan,
  faClockRotateLeft,
  faExclamationCircle,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import {
  overtimeService,
  leaveService,
  attendanceService,
} from "../../services";
import type { LeaveBalance } from "../../types/api.types";

const PengajuanPage: React.FC = () => {
  const history = useHistory();

  // Tab state
  const [activeTab, setActiveTab] = useState<"leave" | "overtime">("leave");

  // Form state
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  // UI State management
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Load leave balance on mount
  useEffect(() => {
    loadLeaveBalance();
  }, []);

  const loadLeaveBalance = async () => {
    try {
      setLoadingBalance(true);
      const balance = await leaveService.getLeaveBalance();
      setLeaveBalance(balance);
    } catch (err) {
      console.error("Failed to load leave balance:", err);
      // Use default values if API fails
      setLeaveBalance({
        annual_leave: 12,
        sick_leave: 8,
        used_leave: 3,
        remaining_leave: 17,
      });
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachment(file);
      setFileName(file.name);
    }
  };

  const resetForm = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setAttachment(null);
    setFileName("");
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateOvertimeHours = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diff = end.getTime() - start.getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
  };

  const validateLeaveForm = (): boolean => {
    if (!leaveType) {
      setError("Pilih jenis cuti terlebih dahulu");
      setShowToast(true);
      return false;
    }
    if (!startDate || !endDate) {
      setError("Tentukan tanggal mulai dan selesai");
      setShowToast(true);
      return false;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("Tanggal selesai tidak boleh sebelum tanggal mulai");
      setShowToast(true);
      return false;
    }
    if (!reason || reason.trim().length < 10) {
      setError("Alasan minimal 10 karakter");
      setShowToast(true);
      return false;
    }
    return true;
  };

  const validateOvertimeForm = (): boolean => {
    if (!startDate) {
      setError("Tentukan tanggal lembur");
      setShowToast(true);
      return false;
    }
    if (!startTime || !endTime) {
      setError("Tentukan waktu mulai dan selesai");
      setShowToast(true);
      return false;
    }
    if (
      new Date(`2000-01-01 ${endTime}`) <= new Date(`2000-01-01 ${startTime}`)
    ) {
      setError("Waktu selesai harus setelah waktu mulai");
      setShowToast(true);
      return false;
    }
    if (!reason || reason.trim().length < 10) {
      setError("Deskripsi pekerjaan minimal 10 karakter");
      setShowToast(true);
      return false;
    }
    return true;
  };

  const handleSubmitLeave = async () => {
    if (!validateLeaveForm()) return;

    try {
      setLoading(true);
      setError("");

      if (leaveType === "annual" || leaveType === "sick") {
        await leaveService.submitLeave({
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason,
          attachment: attachment || undefined,
        });
      } else {
        await attendanceService.submitRequest({
          type: leaveType as "cuti" | "sakit" | "izin" | "telat" | "lupa_absen",
          date: startDate,
          reason: reason,
          attachment: attachment || undefined,
        });
      }

      setSuccess("Pengajuan cuti berhasil dikirim!");
      setShowToast(true);
      resetForm();

      setTimeout(() => {
        history.push("/history");
      }, 2000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Gagal mengirim pengajuan");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOvertime = async () => {
    if (!validateOvertimeForm()) return;

    try {
      setLoading(true);
      setError("");

      await overtimeService.submitOvertime({
        date: startDate,
        start_time: startTime,
        end_time: endTime,
        reason: reason,
      });

      setSuccess("Pengajuan lembur berhasil dikirim!");
      setShowToast(true);
      resetForm();

      setTimeout(() => {
        history.push("/history");
      }, 2000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Gagal mengirim pengajuan");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const leaveTypes = [
    {
      value: "annual",
      label: "Cuti Tahunan",
      icon: faUmbrella,
      color: "from-blue-400 to-blue-600",
    },
    {
      value: "sick",
      label: "Cuti Sakit",
      icon: faHospital,
      color: "from-red-400 to-red-600",
    },
    {
      value: "izin",
      label: "Izin",
      icon: faBan,
      color: "from-amber-400 to-amber-600",
    },
    {
      value: "telat",
      label: "Izin Terlambat",
      icon: faExclamationCircle,
      color: "from-orange-400 to-orange-600",
    },
    {
      value: "lupa_absen",
      label: "Lupa Absen",
      icon: faCalendarCheck,
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <IonPage className="bg-gradient-to-b from-slate-50 via-blue-50 to-white">
      <IonContent fullscreen className="font-inter">
        {/* Modern Enhanced Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-5 pt-10 pb-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-10 left-0 w-56 h-56 bg-pink-300/10 rounded-full blur-2xl animate-float-delayed"></div>

          {/* Header Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => history.goBack()}
                className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
              </button>
              <div className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                Request System
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-black mb-2">Pengajuan</h1>
              <p className="text-sm text-white/80">
                Ajukan cuti atau lembur dengan mudah
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-white/15 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 shadow-lg">
              <button
                onClick={() => setActiveTab("leave")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === "leave"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                Cuti & Izin
              </button>
              <button
                onClick={() => setActiveTab("overtime")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === "overtime"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Lembur
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-5 -mt-12 pb-8">
          {/* Leave Balance Card */}
          {activeTab === "leave" && (
            <div className="mb-5 bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl shadow-indigo-500/10 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-gray-800">
                  Saldo Cuti Anda
                </h3>
                {loadingBalance && (
                  <IonSpinner name="crescent" className="w-5 h-5" />
                )}
              </div>

              {!loadingBalance && leaveBalance && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <FontAwesomeIcon
                          icon={faUmbrella}
                          className="text-white/60 text-xl"
                        />
                        <div className="text-[10px] font-black text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                          Available
                        </div>
                      </div>
                      <p className="text-3xl font-black text-white mb-1">
                        {leaveBalance.annual_leave}
                      </p>
                      <p className="text-xs text-white/90 font-bold">
                        Cuti Tahunan
                      </p>
                    </div>
                  </div>

                  <div className="relative group bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <FontAwesomeIcon
                          icon={faHospital}
                          className="text-white/60 text-xl"
                        />
                        <div className="text-[10px] font-black text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                          Available
                        </div>
                      </div>
                      <p className="text-3xl font-black text-white mb-1">
                        {leaveBalance.sick_leave}
                      </p>
                      <p className="text-xs text-white/90 font-bold">
                        Cuti Sakit
                      </p>
                    </div>
                  </div>

                  <div className="relative group bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <FontAwesomeIcon
                          icon={faCalendarCheck}
                          className="text-white/60 text-xl"
                        />
                        <div className="text-[10px] font-black text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                          Used
                        </div>
                      </div>
                      <p className="text-3xl font-black text-white mb-1">
                        {leaveBalance.used_leave}
                      </p>
                      <p className="text-xs text-white/90 font-bold">
                        Sudah Dipakai
                      </p>
                    </div>
                  </div>

                  <div className="relative group bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl p-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-white/60 text-xl"
                        />
                        <div className="text-[10px] font-black text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                          Remaining
                        </div>
                      </div>
                      <p className="text-3xl font-black text-white mb-1">
                        {leaveBalance.remaining_leave}
                      </p>
                      <p className="text-xs text-white/90 font-bold">
                        Sisa Cuti
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-indigo-500/10 border border-white/50">
            {/* Leave Form */}
            {activeTab === "leave" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-black text-gray-900 mb-4">
                    Form Pengajuan Cuti
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    Pilih jenis cuti dan lengkapi informasi di bawah
                  </p>
                </div>

                {/* Leave Type Selection - Beautiful Cards */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Jenis Cuti
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {leaveTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setLeaveType(type.value)}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                          leaveType === type.value
                            ? `border-indigo-500 bg-gradient-to-br ${type.color} shadow-lg scale-105`
                            : "border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`flex flex-col items-center gap-2 ${
                            leaveType === type.value
                              ? "text-white"
                              : "text-gray-700 group-hover:text-indigo-600"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              leaveType === type.value
                                ? "bg-white/20"
                                : "bg-gray-100 group-hover:bg-indigo-50"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={type.icon}
                              className="text-xl"
                            />
                          </div>
                          <span className="text-xs font-bold text-center">
                            {type.label}
                          </span>
                        </div>
                        {leaveType === type.value && (
                          <div className="absolute top-2 right-2">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-white text-lg"
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="mr-1.5" />
                      Tanggal Mulai
                    </label>
                    <IonInput
                      type="date"
                      value={startDate}
                      onIonChange={(e) => setStartDate(e.detail.value!)}
                      className="custom-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="mr-1.5" />
                      Tanggal Selesai
                    </label>
                    <IonInput
                      type="date"
                      value={endDate}
                      onIonChange={(e) => setEndDate(e.detail.value!)}
                      className="custom-input"
                    />
                  </div>
                </div>

                {/* Duration Display */}
                {startDate && endDate && (
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">
                        Durasi Cuti:
                      </span>
                      <span className="text-2xl font-black text-indigo-600">
                        {calculateDuration()} hari
                      </span>
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Alasan
                  </label>
                  <IonTextarea
                    value={reason}
                    rows={4}
                    placeholder="Jelaskan alasan pengajuan cuti Anda..."
                    onIonChange={(e) => setReason(e.detail.value!)}
                    className="custom-textarea"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {reason.length}/10 karakter minimum
                  </p>
                </div>

                {/* File Upload */}
                {(leaveType === "sick" || leaveType === "izin") && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faFileUpload} className="mr-1.5" />
                      Lampiran{" "}
                      {leaveType === "sick" ? "(Surat Dokter)" : "(Opsional)"}
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon
                          icon={faFileUpload}
                          className="text-indigo-600 text-xl"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-700">
                          {fileName || "Pilih file"}
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF, JPG, PNG (max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <IonButton
                  expand="block"
                  onClick={handleSubmitLeave}
                  disabled={loading}
                  className="custom-button-submit"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <IonSpinner name="crescent" />
                      <span>Mengirim...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-xl"
                      />
                      <span>Kirim Pengajuan Cuti</span>
                    </div>
                  )}
                </IonButton>
              </div>
            )}

            {/* Overtime Form */}
            {activeTab === "overtime" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-black text-gray-900 mb-4">
                    Form Pengajuan Lembur
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    Ajukan lembur dengan detail waktu dan pekerjaan
                  </p>
                </div>

                {/* Overtime Info Card */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faClockRotateLeft}
                        className="text-white"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 mb-1">
                        Peraturan Lembur
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Lembur minimal 2 jam. Pastikan koordinasi dengan atasan
                        sebelum mengajukan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1.5" />
                    Tanggal Lembur
                  </label>
                  <IonInput
                    type="date"
                    value={startDate}
                    onIonChange={(e) => setStartDate(e.detail.value!)}
                    className="custom-input"
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                      Jam Mulai
                    </label>
                    <IonInput
                      type="time"
                      value={startTime}
                      onIonChange={(e) => setStartTime(e.detail.value!)}
                      className="custom-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                      Jam Selesai
                    </label>
                    <IonInput
                      type="time"
                      value={endTime}
                      onIonChange={(e) => setEndTime(e.detail.value!)}
                      className="custom-input"
                    />
                  </div>
                </div>

                {/* Duration Display */}
                {startTime && endTime && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">
                        Durasi Lembur:
                      </span>
                      <span className="text-2xl font-black text-purple-600">
                        {calculateOvertimeHours()} jam
                      </span>
                    </div>
                  </div>
                )}

                {/* Work Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deskripsi Pekerjaan
                  </label>
                  <IonTextarea
                    value={reason}
                    rows={4}
                    placeholder="Jelaskan pekerjaan yang akan dilakukan selama lembur..."
                    onIonChange={(e) => setReason(e.detail.value!)}
                    className="custom-textarea"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {reason.length}/10 karakter minimum
                  </p>
                </div>

                {/* Submit Button */}
                <IonButton
                  expand="block"
                  onClick={handleSubmitOvertime}
                  disabled={loading}
                  className="custom-button-submit-overtime"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <IonSpinner name="crescent" />
                      <span>Mengirim...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faClockRotateLeft}
                        className="text-xl"
                      />
                      <span>Kirim Pengajuan Lembur</span>
                    </div>
                  )}
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      <style>{`
        .custom-input {
          --background: #f9fafb;
          --padding-start: 16px;
          --padding-end: 16px;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          font-weight: 600;
          transition: all 0.3s;
        }

        .custom-input:focus-within {
          border-color: #6366f1;
          --background: #eef2ff;
        }

        .custom-textarea {
          --background: #f9fafb;
          --padding-start: 16px;
          --padding-end: 16px;
          --padding-top: 12px;
          --padding-bottom: 12px;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          font-weight: 500;
          transition: all 0.3s;
        }

        .custom-textarea:focus-within {
          border-color: #6366f1;
          --background: #eef2ff;
        }

        .custom-button-submit {
          --background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          --background-hover: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
          --background-activated: linear-gradient(135deg, #4338ca 0%, #7e22ce 100%);
          --border-radius: 18px;
          --box-shadow: 0 12px 35px -8px rgba(99, 102, 241, 0.4);
          height: 56px;
          font-weight: 700;
          font-size: 16px;
        }

        .custom-button-submit-overtime {
          --background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          --background-hover: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
          --background-activated: linear-gradient(135deg, #7e22ce 0%, #be185d 100%);
          --border-radius: 18px;
          --box-shadow: 0 12px 35px -8px rgba(168, 85, 247, 0.4);
          height: 56px;
          font-weight: 700;
          font-size: 16px;
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
      `}</style>

      {/* Toast Notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => {
          setShowToast(false);
          setError("");
          setSuccess("");
        }}
        message={error || success}
        duration={3000}
        position="top"
        color={error ? "danger" : "success"}
      />
    </IonPage>
  );
};

export default PengajuanPage;
