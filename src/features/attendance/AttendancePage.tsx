import React, { useState } from "react";
import { IonContent, IonPage, IonIcon, IonButton } from "@ionic/react";
import {
  locationOutline,
  timeOutline,
  checkmarkCircle,
  closeCircle,
  arrowBack,
} from "ionicons/icons";
import { PageHeader } from "../../shared/components";

const AttendancePage: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [workDuration] = useState("0h 0m");

  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now.toLocaleTimeString());
    setIsClockedIn(true);
    // In real app: Send to API
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    // In real app: Send to API
  };

  const attendanceHistory = [
    {
      id: "1",
      date: "2025-05-20",
      clockIn: "08:45 AM",
      clockOut: "05:30 PM",
      workHours: 8.75,
      status: "present",
    },
    {
      id: "2",
      date: "2025-05-19",
      clockIn: "09:15 AM",
      clockOut: "05:45 PM",
      workHours: 8.5,
      status: "late",
    },
    {
      id: "3",
      date: "2025-05-18",
      clockIn: "08:30 AM",
      clockOut: "05:15 PM",
      workHours: 8.75,
      status: "present",
    },
    {
      id: "4",
      date: "2025-05-17",
      clockIn: "08:55 AM",
      clockOut: "05:20 PM",
      workHours: 8.42,
      status: "present",
    },
  ];

  const monthlyStats = {
    present: 18,
    late: 2,
    absent: 0,
    totalHours: 168.5,
  };

  return (
    <IonPage className="bg-gradient-to-br from-gray-50 to-blue-50">
      <IonContent fullscreen>
        {/* Header */}
        <PageHeader
          title="Attendance"
          subtitle="Track your work hours"
          gradient="from-blue-600 to-cyan-600"
          action={
            <button className="p-2 hover:bg-white/20 rounded-full transition-smooth">
              <IonIcon icon={arrowBack} className="text-2xl" />
            </button>
          }
        />

        {/* Clock In/Out Card */}
        <div className="px-5 pt-6 pb-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl animate-scaleIn">
            {/* Current Time Display */}
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm mb-2">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h2 className="text-5xl font-bold text-gray-900 mb-1">
                {currentTime}
              </h2>
              {isClockedIn && (
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mt-3 animate-fadeIn">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulseSubtle"></div>
                  Working • {workDuration}
                </div>
              )}
            </div>

            {/* Location Info */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 animate-fadeInUp">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IonIcon
                    icon={locationOutline}
                    className="text-blue-600 text-xl"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    Office Location
                  </p>
                  <p className="text-xs text-gray-600">
                    Jakarta Office, Indonesia
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Clock In/Out Status */}
            {isClockedIn ? (
              <div className="space-y-4 mb-6 animate-fadeIn">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <span className="text-sm text-gray-600">Clock In Time</span>
                  <span className="font-bold text-green-600">
                    {clockInTime}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Break Time</span>
                  <span className="font-bold text-gray-900">1h 0m</span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 mb-6 text-center animate-fadeIn">
                <p className="text-sm text-gray-600">
                  Ready to start your workday?
                </p>
              </div>
            )}

            {/* Clock In/Out Button */}
            <IonButton
              expand="block"
              className={`h-14 font-bold text-base ${
                isClockedIn ? "custom-button-danger" : "custom-button-success"
              }`}
              onClick={isClockedIn ? handleClockOut : handleClockIn}
            >
              <IonIcon
                icon={isClockedIn ? closeCircle : checkmarkCircle}
                className="mr-2"
              />
              {isClockedIn ? "Clock Out" : "Clock In"}
            </IonButton>
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="px-5 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            This Month Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-md animate-stagger">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                  ✓
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.present}
                  </p>
                  <p className="text-xs text-gray-500">Present Days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md animate-stagger">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                  ⏰
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.late}
                  </p>
                  <p className="text-xs text-gray-500">Late Days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md animate-stagger">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">
                  ✗
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.absent}
                  </p>
                  <p className="text-xs text-gray-500">Absent Days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md animate-stagger">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                  📊
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.totalHours}h
                  </p>
                  <p className="text-xs text-gray-500">Total Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="px-5 pb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent History
          </h3>
          <div className="space-y-3">
            {attendanceHistory.map((record, index) => (
              <div
                key={record.id}
                className="bg-white rounded-xl p-4 shadow-sm animate-stagger"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.workHours} hours worked
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === "present"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {record.status === "present" ? "✓ On Time" : "⏰ Late"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <IonIcon icon={timeOutline} className="text-green-600" />
                    <span className="text-gray-600">In: </span>
                    <span className="font-semibold text-gray-900">
                      {record.clockIn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IonIcon icon={timeOutline} className="text-red-600" />
                    <span className="text-gray-600">Out: </span>
                    <span className="font-semibold text-gray-900">
                      {record.clockOut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>

      <style>{`
        .custom-button-success {
          --background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          --background-hover: linear-gradient(135deg, #059669 0%, #047857 100%);
          --border-radius: 16px;
        }
        .custom-button-danger {
          --background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          --background-hover: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          --border-radius: 16px;
        }
      `}</style>
    </IonPage>
  );
};

export default AttendancePage;
