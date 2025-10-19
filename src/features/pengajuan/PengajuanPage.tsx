import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faCalendar,
  faFileUpload,
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
  const [jenisPengajuan, setJenisPengajuan] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [alasan, setAlasan] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // State management
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
        used_leave: 0,
        remaining_leave: 20,
      });
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const validateForm = (): boolean => {
    if (!jenisPengajuan) {
      setError("Pilih jenis pengajuan terlebih dahulu");
      setShowToast(true);
      return false;
    }

    if (jenisPengajuan === "lembur") {
      if (!startDate || !startTime || !endTime) {
        setError("Lengkapi tanggal dan waktu lembur");
        setShowToast(true);
        return false;
      }
    } else {
      if (!startDate || !endDate) {
        setError("Lengkapi tanggal mulai dan selesai");
        setShowToast(true);
        return false;
      }
    }

    if (!alasan || alasan.trim().length < 10) {
      setError("Alasan minimal 10 karakter");
      setShowToast(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      if (jenisPengajuan === "lembur") {
        // Submit overtime request
        await overtimeService.submitOvertime({
          date: startDate,
          start_time: startTime,
          end_time: endTime,
          reason: alasan,
        });
        setSuccess("Pengajuan lembur berhasil dikirim!");
      } else if (jenisPengajuan === "cuti" || jenisPengajuan === "sakit") {
        // Submit leave request
        await leaveService.submitLeave({
          leave_type: jenisPengajuan,
          start_date: startDate,
          end_date: endDate,
          reason: alasan,
          attachment: attachment || undefined,
        });
        setSuccess(`Pengajuan ${jenisPengajuan} berhasil dikirim!`);
      } else {
        // Submit attendance request (izin, etc.)
        await attendanceService.submitRequest({
          type: jenisPengajuan as
            | "cuti"
            | "sakit"
            | "izin"
            | "telat"
            | "lupa_absen",
          date: startDate,
          reason: alasan,
          attachment: attachment || undefined,
        });
        setSuccess("Pengajuan berhasil dikirim!");
      }

      setShowToast(true);

      // Reset form
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

  return (
    <IonPage className="bg-gray-50">
      <IonContent fullscreen className="font-inter">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => history.goBack()}
              className="p-2 hover:bg-white/20 rounded-full transition-smooth"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Pengajuan</h1>
              <p className="text-sm text-white/80">Ajukan cuti atau izin</p>
            </div>
          </div>
        </div>

        {/* Form Pengajuan */}
        <div className="p-5">
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-scaleIn">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Form Pengajuan
            </h2>

            {/* Jenis Pengajuan */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis Pengajuan
              </label>
              <IonSelect
                value={jenisPengajuan}
                placeholder="Pilih jenis pengajuan"
                onIonChange={(e) => setJenisPengajuan(e.detail.value)}
                className="w-full bg-gray-50 rounded-xl border border-gray-200"
              >
                <IonSelectOption value="cuti">Cuti Tahunan</IonSelectOption>
                <IonSelectOption value="sakit">Cuti Sakit</IonSelectOption>
                <IonSelectOption value="izin">Izin</IonSelectOption>
                <IonSelectOption value="lembur">Lembur</IonSelectOption>
                <IonSelectOption value="telat">Izin Terlambat</IonSelectOption>
                <IonSelectOption value="lupa_absen">Lupa Absen</IonSelectOption>
              </IonSelect>
            </div>

            {/* Tanggal Mulai atau Tanggal (untuk lembur/izin) */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                {jenisPengajuan === "lembur"
                  ? "Tanggal Lembur"
                  : "Tanggal Mulai"}
              </label>
              <IonInput
                type="date"
                value={startDate}
                onIonChange={(e) => setStartDate(e.detail.value!)}
                className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
              />
            </div>

            {/* Waktu untuk Lembur */}
            {jenisPengajuan === "lembur" && (
              <>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Mulai
                  </label>
                  <IonInput
                    type="time"
                    value={startTime}
                    onIonChange={(e) => setStartTime(e.detail.value!)}
                    className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Selesai
                  </label>
                  <IonInput
                    type="time"
                    value={endTime}
                    onIonChange={(e) => setEndTime(e.detail.value!)}
                    className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
                  />
                </div>
              </>
            )}

            {/* Tanggal Selesai (hanya untuk cuti/sakit) */}
            {(jenisPengajuan === "cuti" || jenisPengajuan === "sakit") && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                  Tanggal Selesai
                </label>
                <IonInput
                  type="date"
                  value={endDate}
                  onIonChange={(e) => setEndDate(e.detail.value!)}
                  className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
                />
              </div>
            )}

            {/* Alasan */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {jenisPengajuan === "lembur" ? "Deskripsi Pekerjaan" : "Alasan"}
              </label>
              <IonTextarea
                value={alasan}
                rows={4}
                placeholder={
                  jenisPengajuan === "lembur"
                    ? "Jelaskan pekerjaan yang akan dilakukan..."
                    : "Tuliskan alasan pengajuan Anda..."
                }
                onIonChange={(e) => setAlasan(e.detail.value!)}
                className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
              />
            </div>

            {/* File Upload (untuk cuti sakit dan izin) */}
            {(jenisPengajuan === "sakit" ||
              jenisPengajuan === "izin" ||
              jenisPengajuan === "telat" ||
              jenisPengajuan === "lupa_absen") && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFileUpload} className="mr-1" />
                  Lampiran (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm"
                />
                {attachment && (
                  <p className="text-xs text-gray-500 mt-2">
                    File terpilih: {attachment.name}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <IonButton
              expand="block"
              onClick={handleSubmit}
              disabled={loading}
              className="custom-button-submit"
            >
              {loading ? (
                <>
                  <IonSpinner name="crescent" className="mr-2" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Kirim Pengajuan
                </>
              )}
            </IonButton>
          </div>

          {/* Informasi Saldo Cuti */}
          <div className="mt-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-md">
            <h3 className="font-bold text-gray-900 mb-4">Saldo Cuti Anda</h3>
            {loadingBalance ? (
              <div className="text-center py-4">
                <IonSpinner name="crescent" className="text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {leaveBalance?.annual_leave || 0}
                  </p>
                  <p className="text-xs text-gray-600">Cuti Tahunan</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {leaveBalance?.sick_leave || 0}
                  </p>
                  <p className="text-xs text-gray-600">Cuti Sakit</p>
                </div>
              </div>
            )}
          </div>
        </div>

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
      </IonContent>

      <style>{`
        .custom-button-submit {
          --background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          --background-hover: linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%);
          --border-radius: 16px;
          height: 56px;
          font-weight: 600;
        }
      `}</style>
    </IonPage>
  );
};

export default PengajuanPage;
