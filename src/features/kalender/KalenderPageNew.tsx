import React, { useState, useEffect, useCallback } from "react";
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonToast,
  IonModal,
  IonButton,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faCalendar,
  faPlane,
  faBriefcase,
  faUsers,
  faXmark,
  faFilter,
  faCalendarDay,
  faMapMarkerAlt,
  faClock,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  type: "meeting" | "leave" | "holiday" | "training" | "other";
  location?: string;
  all_day: boolean;
}

const KalenderPage: React.FC = () => {
  const history = useHistory();

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("all");

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

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // In real app: call API
      // const data = await calendarService.getEvents({
      //   year: currentDate.getFullYear(),
      //   month: currentDate.getMonth() + 1
      // });

      // Fallback data
      setEvents([
        {
          id: 1,
          title: "Rapat Tim Marketing",
          description: "Diskusi strategi marketing Q4",
          date: "2025-10-21",
          start_time: "09:00",
          end_time: "11:00",
          type: "meeting",
          location: "Meeting Room A",
          all_day: false,
        },
        {
          id: 2,
          title: "Cuti Tahunan",
          description: "Liburan keluarga",
          date: "2025-10-23",
          start_time: undefined,
          end_time: undefined,
          type: "leave",
          location: undefined,
          all_day: true,
        },
        {
          id: 3,
          title: "Training Software Development",
          description: "React Advanced Training",
          date: "2025-10-25",
          start_time: "13:00",
          end_time: "17:00",
          type: "training",
          location: "Training Center",
          all_day: false,
        },
        {
          id: 4,
          title: "Libur Nasional",
          description: "Hari Sumpah Pemuda",
          date: "2025-10-28",
          start_time: undefined,
          end_time: undefined,
          type: "holiday",
          location: undefined,
          all_day: true,
        },
        {
          id: 5,
          title: "Team Building",
          description: "Outbound activity",
          date: "2025-10-30",
          start_time: "08:00",
          end_time: "17:00",
          type: "other",
          location: "Puncak Resort",
          all_day: false,
        },
      ]);
    } catch (err) {
      console.error("Failed to load events:", err);
      setError("Gagal memuat data kalender");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load events
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

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

  const isSelectedDate = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateStr);
  };

  const hasEvent = (date: Date | null) => {
    return getEventsForDate(date).length > 0;
  };

  const getFilteredEvents = () => {
    if (filterType === "all") return events;
    return events.filter((event) => event.type === filterType);
  };

  const getEventTypeIcon = (type: string) => {
    const icons: Record<string, typeof faUsers> = {
      meeting: faUsers,
      leave: faPlane,
      holiday: faCalendar,
      training: faBriefcase,
      other: faCalendarDay,
    };
    return icons[type] || faCalendar;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: "from-purple-400 to-violet-500",
      leave: "from-blue-400 to-cyan-500",
      holiday: "from-red-400 to-rose-500",
      training: "from-green-400 to-emerald-500",
      other: "from-orange-400 to-amber-500",
    };
    return colors[type] || "from-gray-400 to-gray-500";
  };

  const getEventTypeBgColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: "from-purple-50 to-violet-50",
      leave: "from-blue-50 to-cyan-50",
      holiday: "from-red-50 to-rose-50",
      training: "from-green-50 to-emerald-50",
      other: "from-orange-50 to-amber-50",
    };
    return colors[type] || "from-gray-50 to-gray-50";
  };

  const getEventTypeText = (type: string) => {
    const texts: Record<string, string> = {
      meeting: "Meeting",
      leave: "Cuti",
      holiday: "Libur",
      training: "Training",
      other: "Lainnya",
    };
    return texts[type] || type;
  };

  const formatTime = (time: string | null | undefined) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const upcomingEvents = getFilteredEvents()
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const eventTypes = [
    { value: "all", label: "Semua", icon: faCalendar, color: "gray" },
    { value: "meeting", label: "Meeting", icon: faUsers, color: "purple" },
    { value: "leave", label: "Cuti", icon: faPlane, color: "blue" },
    { value: "holiday", label: "Libur", icon: faCalendar, color: "red" },
    { value: "training", label: "Training", icon: faBriefcase, color: "green" },
  ];

  return (
    <IonPage className="bg-gradient-to-b from-slate-50 via-indigo-50 to-white">
      <IonContent fullscreen className="font-inter">
        {/* Modern Enhanced Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-500 text-white px-5 pt-10 pb-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-10 left-0 w-56 h-56 bg-violet-300/10 rounded-full blur-2xl animate-float-delayed"></div>

          {/* Header Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => history.goBack()}
                className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
              </button>
              <button
                onClick={() => setShowFilterModal(true)}
                className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faFilter} className="text-lg" />
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} />
                Kalender
              </h1>
              <p className="text-sm text-white/80">
                Jadwal kerja & event perusahaan
              </p>
            </div>

            {/* Month Navigator */}
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 active:scale-90"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-black">
                    {months[currentDate.getMonth()]}
                  </h2>
                  <p className="text-sm text-white/70 font-bold">
                    {currentDate.getFullYear()}
                  </p>
                </div>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 active:scale-90"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="px-5 -mt-8 pb-8">
          {/* Calendar Grid */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-gray-100/50 mb-5">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-black text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const dateEvents = getEventsForDate(date);
                const hasMultipleEvents = dateEvents.length > 1;

                return (
                  <button
                    key={index}
                    onClick={() => date && handleDateClick(date)}
                    disabled={!date}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-2xl text-sm relative
                      transition-all duration-300
                      ${date ? "cursor-pointer" : ""}
                      ${
                        isToday(date)
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black shadow-lg scale-105"
                          : ""
                      }
                      ${
                        isSelectedDate(date) && !isToday(date)
                          ? "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 font-black border-2 border-indigo-300"
                          : ""
                      }
                      ${
                        date && !isToday(date) && !isSelectedDate(date)
                          ? "hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 text-gray-900 hover:scale-105"
                          : ""
                      }
                      ${!date ? "invisible" : ""}
                    `}
                  >
                    {date && (
                      <>
                        <span className="font-bold">{date.getDate()}</span>
                        {hasEvent(date) && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                            {hasMultipleEvents ? (
                              <div className="flex gap-0.5">
                                <div
                                  className={`w-1 h-1 rounded-full ${
                                    isToday(date) ? "bg-white" : "bg-indigo-600"
                                  }`}
                                ></div>
                                <div
                                  className={`w-1 h-1 rounded-full ${
                                    isToday(date) ? "bg-white" : "bg-purple-600"
                                  }`}
                                ></div>
                              </div>
                            ) : (
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isToday(date) ? "bg-white" : "bg-indigo-600"
                                }`}
                              ></div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Event Type Legend */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-3">
                Tipe Event:
              </p>
              <div className="flex flex-wrap gap-2">
                {eventTypes.slice(1).map((type) => (
                  <div
                    key={type.value}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg"
                  >
                    <FontAwesomeIcon
                      icon={faCircle}
                      className={`text-xs text-${type.color}-500`}
                    />
                    <span className="text-xs font-bold text-gray-700">
                      {type.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-gray-900">
                  {selectedDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                  })}
                </h3>
                <span className="text-sm text-gray-500 font-bold">
                  {selectedDateEvents.length} event
                </span>
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="text-2xl text-gray-400"
                    />
                  </div>
                  <p className="text-gray-600 font-bold">Tidak ada event</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Hari ini tidak ada jadwal
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="group relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-indigo-200 cursor-pointer transform hover:-translate-y-1"
                      style={{
                        animation: `slideInRight 0.6s ease-out ${
                          index * 0.1
                        }s backwards`,
                      }}
                    >
                      {/* Decorative Line */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full bg-gradient-to-b ${getEventTypeColor(
                          event.type
                        )} group-hover:w-2 transition-all`}
                      ></div>

                      <div className="ml-2 flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getEventTypeColor(
                            event.type
                          )} flex items-center justify-center shadow-md`}
                        >
                          <FontAwesomeIcon
                            icon={getEventTypeIcon(event.type)}
                            className="text-white text-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-800">
                            {event.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-bold">
                            {event.all_day
                              ? "Sepanjang Hari"
                              : `${formatTime(event.start_time)} - ${formatTime(
                                  event.end_time
                                )}`}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-black bg-gradient-to-r ${getEventTypeBgColor(
                            event.type
                          )}`}
                        >
                          {getEventTypeText(event.type)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-3">
              Event Mendatang
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <IonSpinner
                  name="crescent"
                  className="w-12 h-12 text-indigo-600"
                />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-2xl text-gray-400"
                  />
                </div>
                <p className="text-gray-600 font-bold">
                  Tidak ada event mendatang
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="group relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-indigo-200 cursor-pointer transform hover:-translate-y-1"
                    style={{
                      animation: `slideInRight 0.6s ease-out ${
                        index * 0.1
                      }s backwards`,
                    }}
                  >
                    {/* Decorative Line */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full bg-gradient-to-b ${getEventTypeColor(
                        event.type
                      )} group-hover:w-2 transition-all`}
                    ></div>

                    <div className="ml-2 flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getEventTypeColor(
                          event.type
                        )} flex items-center justify-center shadow-md`}
                      >
                        <FontAwesomeIcon
                          icon={getEventTypeIcon(event.type)}
                          className="text-white text-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-800">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-bold">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {event.all_day
                            ? "Sepanjang Hari"
                            : `${formatTime(event.start_time)} - ${formatTime(
                                event.end_time
                              )}`}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-black bg-gradient-to-r ${getEventTypeBgColor(
                          event.type
                        )}`}
                      >
                        {getEventTypeText(event.type)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            <h2 className="text-2xl font-black text-gray-900">Filter Event</h2>
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
            >
              <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-3">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setFilterType(type.value);
                  setShowFilterModal(false);
                }}
                className={`w-full p-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-3 ${
                  filterType === type.value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-md"
                    : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    filterType === type.value
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FontAwesomeIcon icon={type.icon} />
                </div>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          <IonButton
            expand="block"
            onClick={() => {
              setFilterType("all");
              setShowFilterModal(false);
            }}
            className="mt-6"
            style={{
              "--background":
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              "--border-radius": "16px",
              height: "48px",
              fontWeight: "700",
            }}
          >
            Reset Filter
          </IonButton>
        </div>
      </IonModal>

      {/* Event Detail Modal */}
      <IonModal
        isOpen={showDetailModal}
        onDidDismiss={() => setShowDetailModal(false)}
        className="custom-modal"
      >
        <div className="h-full bg-gradient-to-b from-slate-50 to-white p-5">
          {selectedEvent && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">
                  Detail Event
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
                </button>
              </div>

              {/* Event Type Badge */}
              <div
                className={`p-4 rounded-2xl bg-gradient-to-r ${getEventTypeColor(
                  selectedEvent.type
                )} text-white mb-5`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={getEventTypeIcon(selectedEvent.type)}
                    className="text-2xl"
                  />
                  <div>
                    <p className="text-sm font-bold opacity-90">
                      {getEventTypeText(selectedEvent.type)}
                    </p>
                    <p className="text-xs opacity-75">
                      {new Date(selectedEvent.date).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Title */}
              <div className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {selectedEvent.title}
                </h3>
                {selectedEvent.description && (
                  <p className="text-sm text-gray-600">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                {/* Time */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-indigo-600"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Waktu</p>
                      <p className="text-sm font-black text-gray-900">
                        {selectedEvent.all_day
                          ? "Sepanjang Hari"
                          : `${formatTime(
                              selectedEvent.start_time
                            )} - ${formatTime(selectedEvent.end_time)}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-purple-600"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold">
                          Lokasi
                        </p>
                        <p className="text-sm font-black text-gray-900">
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </IonModal>

      <style>{`
        .custom-modal {
          --height: 75%;
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

export default KalenderPage;
