import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faHourglass,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const HistoryPage: React.FC = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<string>("absensi");

  const attendanceHistory = [
    {
      id: "1",
      date: "2025-05-20",
      day: "Monday",
      clockIn: "08:45 AM",
      clockOut: "05:30 PM",
      status: "present",
      hours: 8.75,
    },
    {
      id: "2",
      date: "2025-05-19",
      day: "Sunday",
      clockIn: "09:15 AM",
      clockOut: "05:45 PM",
      status: "late",
      hours: 8.5,
    },
    {
      id: "3",
      date: "2025-05-18",
      day: "Saturday",
      clockIn: "08:30 AM",
      clockOut: "05:15 PM",
      status: "present",
      hours: 8.75,
    },
  ];

  const leaveHistory = [
    {
      id: "1",
      type: "Cuti Tahunan",
      startDate: "2025-06-15",
      endDate: "2025-06-20",
      days: 6,
      reason: "Liburan keluarga",
      status: "approved",
      appliedDate: "2025-05-10",
    },
    {
      id: "2",
      type: "Cuti Sakit",
      startDate: "2025-05-18",
      endDate: "2025-05-19",
      days: 2,
      reason: "Sakit flu",
      status: "pending",
      appliedDate: "2025-05-15",
    },
    {
      id: "3",
      type: "Izin",
      startDate: "2025-05-05",
      endDate: "2025-05-05",
      days: 1,
      reason: "Keperluan keluarga",
      status: "rejected",
      appliedDate: "2025-05-03",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-600",
      pending: "bg-yellow-100 text-yellow-600",
      rejected: "bg-red-100 text-red-600",
      present: "bg-green-100 text-green-600",
      late: "bg-orange-100 text-orange-600",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-600";
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved" || status === "present") return faCheckCircle;
    if (status === "rejected") return faTimesCircle;
    return faHourglass;
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
              <h1 className="text-2xl font-bold">History</h1>
              <p className="text-sm text-white/80">Riwayat aktivitas Anda</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-6">
          <IonSegment
            value={selectedTab}
            onIonChange={(e) => setSelectedTab(e.detail.value as string)}
            className="bg-white rounded-2xl shadow-md p-1"
          >
            <IonSegmentButton value="absensi" className="custom-segment">
              <IonLabel className="font-semibold">Absensi</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pengajuan" className="custom-segment">
              <IonLabel className="font-semibold">Pengajuan</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Content */}
        <div className="p-5">
          {selectedTab === "absensi" && (
            <div className="space-y-3">
              {attendanceHistory.map((record, index) => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl p-4 shadow-md animate-stagger hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{record.day}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        record.status
                      )}`}
                    >
                      {record.status === "present"
                        ? "Tepat Waktu"
                        : "Terlambat"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Masuk</p>
                      <p className="text-sm font-bold text-green-600">
                        {record.clockIn}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Keluar</p>
                      <p className="text-sm font-bold text-red-600">
                        {record.clockOut}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Jam Kerja</p>
                      <p className="text-sm font-bold text-blue-600">
                        {record.hours}h
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === "pengajuan" && (
            <div className="space-y-3">
              {leaveHistory.map((leave, index) => (
                <div
                  key={leave.id}
                  className="bg-white rounded-xl p-4 shadow-md animate-stagger hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{leave.type}</h4>
                      <p className="text-xs text-gray-500">
                        {leave.days} hari •{" "}
                        {new Date(leave.appliedDate).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadge(
                        leave.status
                      )}`}
                    >
                      <FontAwesomeIcon icon={getStatusIcon(leave.status)} />
                      {leave.status === "approved" && "Disetujui"}
                      {leave.status === "pending" && "Menunggu"}
                      {leave.status === "rejected" && "Ditolak"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Dari</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(leave.startDate).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div>
                        <p className="text-gray-600 text-xs">Sampai</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(leave.endDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Alasan:</p>
                    <p className="text-sm text-gray-900">{leave.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>

      <style>{`
        .custom-segment ion-segment-button {
          --indicator-color: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          --color-checked: #9333ea;
        }
      `}</style>
    </IonPage>
  );
};

export default HistoryPage;
