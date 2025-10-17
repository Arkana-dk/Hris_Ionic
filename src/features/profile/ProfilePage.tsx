import React from "react";
import {
  IonContent,
  IonPage,
  IonAvatar,
  IonIcon,
  IonButton,
} from "@ionic/react";
import {
  personOutline,
  mailOutline,
  callOutline,
  businessOutline,
  calendarOutline,
  documentTextOutline,
  settingsOutline,
  logOutOutline,
  chevronForwardOutline,
  shieldCheckmarkOutline,
  notificationsOutline,
  languageOutline,
  helpCircleOutline,
} from "ionicons/icons";

const ProfilePage: React.FC = () => {
  const user = {
    name: "Bumi Regen Anugerah",
    employeeId: "EMP-2024-001",
    position: "UI/UX Designer",
    department: "Design Team",
    email: "bumi.regen@company.com",
    phone: "+62 812-3456-7890",
    joinDate: "2024-06-15",
    avatar: "https://ionicframework.com/docs/img/demos/avatar.svg",
  };

  const menuItems = [
    {
      id: "personal-info",
      title: "Personal Information",
      icon: personOutline,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "documents",
      title: "My Documents",
      icon: documentTextOutline,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: shieldCheckmarkOutline,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: notificationsOutline,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      id: "language",
      title: "Language & Region",
      icon: languageOutline,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      id: "help",
      title: "Help & Support",
      icon: helpCircleOutline,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <IonPage className="bg-gradient-to-br from-gray-50 to-indigo-50">
      <IonContent fullscreen>
        {/* Header with Profile Card */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-5 pt-10 pb-32 animate-gradient">
          <div className="flex items-center justify-between mb-6 animate-fadeInDown">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button className="p-2 hover:bg-white/20 rounded-full transition-smooth">
              <IonIcon icon={settingsOutline} className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="px-5 -mt-24 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-2xl animate-scaleIn">
            {/* Avatar and Basic Info */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <IonAvatar className="w-24 h-24 mx-auto ring-4 ring-white shadow-lg">
                  <img alt="Profile" src={user.avatar} />
                </IonAvatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover-scale">
                  <span className="text-lg">📷</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.name}
              </h2>
              <p className="text-gray-600 mb-1">{user.position}</p>
              <p className="text-sm text-gray-500">{user.employeeId}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">22</p>
                <p className="text-xs text-gray-600">Attendance</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-xs text-gray-600">Leave Balance</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">4.8</p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IonIcon icon={mailOutline} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <IonIcon icon={callOutline} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <IonIcon icon={businessOutline} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <IonIcon icon={calendarOutline} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Join Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="px-5 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Settings & Preferences
          </h3>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-smooth border-b border-gray-100 last:border-b-0 animate-stagger"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <IonIcon
                    icon={item.icon}
                    className={`${item.color} text-xl`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                </div>
                <IonIcon
                  icon={chevronForwardOutline}
                  className="text-gray-400"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-5 pb-8">
          <IonButton
            expand="block"
            color="danger"
            className="custom-button-logout"
          >
            <IonIcon icon={logOutOutline} className="mr-2" />
            Logout
          </IonButton>
        </div>

        {/* App Version */}
        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">Version 1.0.0</p>
          <p className="text-xs text-gray-400">© 2025 HRIS Company</p>
        </div>
      </IonContent>

      <style>{`
        .custom-button-logout {
          --background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          --background-hover: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          --border-radius: 16px;
          height: 56px;
          font-weight: 600;
        }
      `}</style>
    </IonPage>
  );
};

export default ProfilePage;
