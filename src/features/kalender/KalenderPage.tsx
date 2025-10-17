import React, { useState } from "react";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import {
  arrowBack,
  chevronBackOutline,
  chevronForwardOutline,
  calendarOutline,
  airplaneOutline,
  businessOutline,
  peopleOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";

const KalenderPage: React.FC = () => {
  const history = useHistory();
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const events = [
    {
      id: "1",
      date: new Date(2025, 4, 21), // May 21, 2025
      title: "Rapat Tim Marketing",
      time: "09:00 - 11:00",
      type: "meeting",
      icon: peopleOutline,
      color: "purple",
    },
    {
      id: "2",
      date: new Date(2025, 4, 23),
      title: "Cuti Tahunan",
      time: "Full Day",
      type: "leave",
      icon: airplaneOutline,
      color: "blue",
    },
    {
      id: "3",
      date: new Date(2025, 4, 25),
      title: "Presentasi Project",
      time: "14:00 - 16:00",
      type: "meeting",
      icon: businessOutline,
      color: "green",
    },
    {
      id: "4",
      date: new Date(2025, 4, 30),
      title: "Libur Nasional - Waisak",
      time: "Full Day",
      type: "holiday",
      icon: calendarOutline,
      color: "red",
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hasEvent = (date: Date | null) => {
    if (!date) return false;
    return events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);
  const selectedEvents = getEventsForDate(new Date(2025, 4, 21)); // Default to May 21

  const getColorClass = (color: string) => {
    const colors = {
      purple: "bg-purple-100 text-purple-600",
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      red: "bg-red-100 text-red-600",
    };
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <IonPage className="bg-gradient-to-br from-gray-50 to-blue-50">
      <IonContent fullscreen>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-6 rounded-b-3xl shadow-lg animate-fadeInDown">
          <div className="flex items-center gap-4">
            <button
              onClick={() => history.goBack()}
              className="p-2 hover:bg-white/20 rounded-full transition-smooth"
            >
              <IonIcon icon={arrowBack} className="text-2xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Kalender</h1>
              <p className="text-sm text-white/80">Jadwal & Event</p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-5">
          {/* Month Navigation */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-5 animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-smooth"
              >
                <IonIcon icon={chevronBackOutline} className="text-xl" />
              </button>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-smooth"
              >
                <IonIcon icon={chevronForwardOutline} className="text-xl" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm
                    ${date ? "cursor-pointer" : ""}
                    ${
                      isToday(date)
                        ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold shadow-md"
                        : ""
                    }
                    ${
                      date && !isToday(date)
                        ? "hover:bg-gray-100 text-gray-900"
                        : ""
                    }
                    ${!date ? "text-gray-300" : ""}
                  `}
                >
                  {date && (
                    <div className="relative">
                      <span>{date.getDate()}</span>
                      {hasEvent(date) && !isToday(date) && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Event Hari Ini (21 Mei)
            </h3>
            <div className="space-y-3">
              {selectedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl p-4 shadow-md animate-stagger hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${getColorClass(event.color)}`}
                    >
                      <IonIcon icon={event.icon} className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Events */}
            <h3 className="text-lg font-bold text-gray-900 mb-3 mt-6">
              Event Mendatang
            </h3>
            <div className="space-y-3">
              {events
                .filter((e) => e.date > new Date())
                .map((event, index) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl p-4 shadow-md animate-stagger hover-lift"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${getColorClass(
                          event.color
                        )}`}
                      >
                        <IonIcon icon={event.icon} className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600">{event.time}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.date.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default KalenderPage;
