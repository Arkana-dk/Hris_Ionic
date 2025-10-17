import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* Menggunakan layout Flexbox yang sama seperti Tab 2 untuk menengahkan konten */}
        <div className="flex flex-col justify-center items-center h-full text-center">
          <strong className="text-2xl font-semibold text-gray-800">
            Tab 3 Page
          </strong>

          <p className="mt-2 text-gray-600">
            Jelajahi{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ionicframework.com/docs/components"
              className="text-blue-500 hover:underline"
            >
              Komponen UI
            </a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
