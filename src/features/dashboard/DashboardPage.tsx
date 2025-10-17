import React from "react";
import { IonContent, IonPage, IonAvatar, IonIcon } from "@ionic/react";
import {
  notificationsOutline,
  walletOutline,
  airplaneOutline,
  timeOutline,
  briefcaseOutline,
  calendarOutline,
  documentTextOutline,
  todayOutline,
  addCircleOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const history = useHistory();

  const user = {
    name: "Bumi Regen Anugerah",
    position: "UI/UX Designer",
    tenure: "11 months",
    avatar: "https://ionicframework.com/docs/img/demos/avatar.svg",
  };

  // Office Services - 8 fitur seperti gambar
  const services = [
    {
      id: "reimburse",
      name: "Reimburse",
      icon: walletOutline,
      color: "bg-emerald-50",
      textColor: "text-emerald-600",
      route: "/pengajuan",
    },
    {
      id: "paid-leave",
      name: "Paid Leave",
      icon: airplaneOutline,
      color: "bg-sky-50",
      textColor: "text-sky-600",
      route: "/pengajuan",
    },
    {
      id: "overtime",
      name: "Overtime",
      icon: timeOutline,
      color: "bg-violet-50",
      textColor: "text-violet-600",
      route: "/history",
    },
    {
      id: "assignment",
      name: "Assignment",
      icon: briefcaseOutline,
      color: "bg-amber-50",
      textColor: "text-amber-600",
      route: "/kalender",
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: calendarOutline,
      color: "bg-rose-50",
      textColor: "text-rose-600",
      route: "/kalender",
    },
    {
      id: "document",
      name: "Document",
      icon: documentTextOutline,
      color: "bg-teal-50",
      textColor: "text-teal-600",
      route: "/history",
    },
    {
      id: "events",
      name: "Events",
      icon: todayOutline,
      color: "bg-fuchsia-50",
      textColor: "text-fuchsia-600",
      route: "/kalender",
    },
    {
      id: "add-proposal",
      name: "Add Proposal",
      icon: addCircleOutline,
      color: "bg-indigo-50",
      textColor: "text-indigo-600",
      route: "/pengajuan",
    },
  ];

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  return (
    <IonPage className="bg-gray-50">
      <IonContent fullscreen>
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 pt-10 pb-12 rounded-b-3xl shadow-lg animate-fadeInDown">
          <div className="absolute inset-0">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -left-14 w-40 h-40 bg-pink-400/25 blur-3xl rounded-full animate-[pulse_5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-400/20 blur-3xl rounded-full animate-[pulse_7s_ease-in-out_infinite]"></div>
          </div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <IonAvatar className="w-12 h-12">
                <img alt="Profile" src={user.avatar} />
              </IonAvatar>
              <div>
                <h1 className="font-bold text-lg">{user.name}</h1>
                <p className="text-xs text-indigo-200">
                  {user.position} • {user.tenure}
                </p>
              </div>
            </div>
            <button className="relative">
              <IonIcon icon={notificationsOutline} className="text-2xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* What's Up Today Section - Shortened */}
        <div className="relative px-5 -mt-8">
          <div className="bg-white rounded-xl shadow-lg p-3 animate-fadeInUp">
            <div className="flex items-center space-x-3">
              {/* Calendar Date */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 rounded-lg px-3 py-2 min-w-[60px]">
                <span className="text-red-500 font-bold text-xs uppercase">
                  May
                </span>
                <span className="text-gray-800 font-bold text-2xl">21</span>
              </div>

              {/* Event Info */}
              <div className="flex-1 border-l-2 border-gray-200 pl-3">
                <p className="text-gray-600 text-xs font-medium">
                  UI/UX Team Huddle
                </p>
                <p className="font-semibold text-gray-800 text-sm">
                  09:00am - 10:00am
                </p>
              </div>

              {/* See Details */}
              <button
                onClick={() => handleNavigate("/kalender")}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800"
              >
                See Details
              </button>
            </div>
          </div>
        </div>

        {/* Office Services - 8 items */}
        <div className="px-5 mb-6 mt-6">
          <h2 className="text-gray-800 font-bold text-xl mb-4">
            Office Services
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => handleNavigate(service.route)}
                className="flex flex-col items-center animate-stagger hover-scale"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.color} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer mb-1.5`}
                >
                  <IonIcon
                    icon={service.icon}
                    className={`text-2xl ${service.textColor}`}
                  />
                </div>
                <p
                  className={`text-[10px] font-medium text-gray-700 leading-tight`}
                >
                  {service.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Office News */}
        <div className="px-5 mb-6">
          <h2 className="text-gray-800 font-bold text-xl mb-4">Office News</h2>
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl animate-scaleIn relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">
                Hello A-Team! Welcome on Super Apps for Amartha!
              </h3>
              <button className="mt-3 bg-white text-indigo-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-smooth">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="px-5 mb-8">
          <h2 className="text-gray-800 font-bold text-xl mb-4">
            Announcements
          </h2>
          <div className="bg-white rounded-xl p-4 flex space-x-4 items-start shadow-md hover-lift animate-fadeInUp">
            {/* Icon/Image Placeholder */}
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center">
              <span className="text-3xl">📰</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="text-gray-900 font-semibold mb-1">
                Good News! Use Free Udemy Online Course
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Dear A-Team, to be more productive now you can access free
                online courses at Udemy. You can improve your skills anytime!
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
