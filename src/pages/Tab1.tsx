import { useState } from "react"; // Import 'useState' untuk mengelola state
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import "./Tab1.css";

const Tab1: React.FC = () => {
  // 1. Buat sebuah 'state' untuk menyimpan angka. Nilai awalnya adalah 0.
  const [jumlah, setJumlah] = useState(0);

  // 2. Buat sebuah fungsi untuk menambahkan angka saat tombol diklik.
  const tambahJumlah = () => {
    setJumlah(jumlah + 1); // Ini akan memperbarui nilai 'jumlah' dan me-render ulang UI
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Kita akan meletakkan konten kita di dalam sebuah kartu (Card) */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Penghitung Klik Sederhana</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {/* 3. Tampilkan nilai 'jumlah' saat ini */}
            <h2>Angka Saat Ini: {jumlah}</h2>

            {/* 4. Buat tombol yang saat diklik akan memanggil fungsi 'tambahJumlah' */}
            <IonButton expand="block" onClick={tambahJumlah}>
              Tambah +1
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
