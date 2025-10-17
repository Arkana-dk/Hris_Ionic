import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/*
        - Menggunakan Flexbox dari Tailwind untuk membuat konten berada di tengah.
        - `flex flex-col justify-center items-center`: Membuat layout flex vertikal dan menengahkan item di kedua sumbu.
        - `h-full`: Memastikan container mengambil tinggi penuh dari IonContent.
        - `text-center`: Membuat teks di dalamnya rata tengah.
      */}
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-col justify-center items-center h-full text-center">
          <strong className="text-2xl font-semibold text-white">
            Tab 2 Page
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

export default Tab2;
