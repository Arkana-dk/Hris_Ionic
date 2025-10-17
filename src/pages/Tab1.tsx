import {
  IonContent,
  IonPage,
  IonAvatar,
  IonIcon,
  IonButton,
} from "@ionic/react";
import {
  notificationsOutline,
  calendarOutline,
  walletOutline,
  airplaneOutline,
  timeOutline,
  documentTextOutline,
  briefcaseOutline,
  calendarNumberOutline,
  addCircleOutline,
} from "ionicons/icons";

// Data dummy untuk Office Services
const services = [
  { name: "Reimburse", icon: walletOutline, color: "bg-green-500" },
  { name: "Paid Leave", icon: airplaneOutline, color: "bg-blue-500" },
  { name: "Overtime", icon: timeOutline, color: "bg-purple-500" },
  { name: "Assignment", icon: briefcaseOutline, color: "bg-yellow-500" },
  { name: "Calendar", icon: calendarNumberOutline, color: "bg-red-500" },
  { name: "Document", icon: documentTextOutline, color: "bg-teal-500" },
  { name: "Events", icon: calendarOutline, color: "bg-pink-500" },
  { name: "Add Proposal", icon: addCircleOutline, color: "bg-indigo-500" },
];

const Tab1: React.FC = () => {
  return (
    <IonPage className="bg-gray-900">
      <IonContent fullscreen>
        {/* === HEADER KUSTOM === */}
        <div className="bg-indigo-700 text-white p-5 pt-10 rounded-b-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <IonAvatar>
                <img
                  alt="Profile"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <div>
                <h1 className="font-bold text-lg">Bumi Regen Anugerah</h1>
                <p className="text-xs text-indigo-200">
                  UI/UX Designer • 11 months
                </p>
              </div>
            </div>
            <IonIcon icon={notificationsOutline} className="text-2xl" />
          </div>
        </div>

        {/* === WHAT'S UP TODAY SECTION === */}
        <div className="relative p-5 -mt-10">
          <div className="bg-white rounded-xl shadow-lg flex items-center p-4 space-x-4">
            <div className="flex flex-col items-center justify-center">
              <span className="text-red-500 font-bold text-sm">May</span>
              <span className="text-gray-800 font-bold text-2xl">21</span>
            </div>
            <div className="border-l border-gray-200 pl-4 flex-1">
              <p className="text-gray-500 text-sm">UI/UX Team Huddle</p>
              <p className="font-semibold text-gray-800">09:00am - 10:00am</p>
            </div>
            <a href="#" className="text-sm text-indigo-600 font-semibold">
              See Details
            </a>
          </div>
        </div>

        {/* === OFFICE SERVICES SECTION === */}
        <div className="px-5">
          <h2 className="text-white font-bold text-xl mb-4">Office Services</h2>
          <div className="grid grid-cols-4 gap-4 text-center">
            {services.map((service) => (
              <div key={service.name} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center ${service.color}`}
                >
                  <IonIcon
                    icon={service.icon}
                    className="text-white text-3xl"
                  />
                </div>
                <p className="text-gray-300 text-xs mt-2">{service.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === OFFICE NEWS SECTION === */}
        <div className="px-5 mt-8">
          <h2 className="text-white font-bold text-xl mb-4">Office News</h2>
          <div className="bg-indigo-700 rounded-xl p-5 text-white shadow-lg">
            <h3 className="font-bold text-lg">
              Hello A-Team! Welcome on Super Apps for Amartha!
            </h3>
            <IonButton
              className="mt-4"
              color="light"
              size="small"
              shape="round"
            >
              Learn More
            </IonButton>
          </div>
        </div>

        {/* === ANNOUNCEMENTS SECTION === */}
        <div className="px-5 mt-8 mb-5">
          <h2 className="text-white font-bold text-xl mb-4">Announcements</h2>
          <div className="bg-gray-800 rounded-xl p-4 flex space-x-4 items-start">
            <div className="bg-gray-700 w-16 h-16 rounded-lg flex-shrink-0"></div>
            <div>
              <h4 className="text-white font-semibold">
                Good News! Use Free Udemy Online Course
              </h4>
              <p className="text-gray-400 text-xs mt-1">
                Dear A-Team, to be more productive now you can access free
                online courses at Udemy. You
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
