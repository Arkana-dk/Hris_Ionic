import React from "react";
import { Event } from "../../types";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const eventTypeColors = {
  meeting: "bg-blue-100 text-blue-600",
  training: "bg-purple-100 text-purple-600",
  holiday: "bg-green-100 text-green-600",
  birthday: "bg-pink-100 text-pink-600",
  "team-building": "bg-orange-100 text-orange-600",
};

const eventTypeIcons: Record<string, string> = {
  meeting: "👥",
  training: "📚",
  holiday: "🏖️",
  birthday: "🎂",
  "team-building": "🎉",
};

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm hover-lift cursor-pointer border border-gray-100 animate-fadeInUp"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl ${
            eventTypeColors[event.type]
          } flex items-center justify-center text-2xl flex-shrink-0`}
        >
          {eventTypeIcons[event.type] || "📅"}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {event.title}
          </h4>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              📅 {formatDate(event.startTime)}
            </span>
            <span className="flex items-center gap-1">
              ⏰ {formatTime(event.startTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
