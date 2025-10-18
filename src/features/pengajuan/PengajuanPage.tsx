import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const PengajuanPage: React.FC = () => {
  const history = useHistory();
  const [jenisPengajuan, setJenisPengajuan] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alasan, setAlasan] = useState("");

  const handleSubmit = () => {
    // Logic untuk submit pengajuan
    alert("Pengajuan berhasil dikirim!");
    history.push("/dashboard");
  };

  return (
    <IonPage className="bg-gray-50">
      <IonContent fullscreen className="font-inter">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => history.goBack()}
              className="p-2 hover:bg-white/20 rounded-full transition-smooth"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Pengajuan</h1>
              <p className="text-sm text-white/80">Ajukan cuti atau izin</p>
            </div>
          </div>
        </div>

        {/* Form Pengajuan */}
        <div className="p-5">
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-scaleIn">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Form Pengajuan
            </h2>

            {/* Jenis Pengajuan */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis Pengajuan
              </label>
              <IonSelect
                value={jenisPengajuan}
                placeholder="Pilih jenis pengajuan"
                onIonChange={(e) => setJenisPengajuan(e.detail.value)}
                className="w-full bg-gray-50 rounded-xl border border-gray-200"
              >
                <IonSelectOption value="cuti">Cuti Tahunan</IonSelectOption>
                <IonSelectOption value="sakit">Cuti Sakit</IonSelectOption>
                <IonSelectOption value="izin">Izin</IonSelectOption>
                <IonSelectOption value="darurat">Cuti Darurat</IonSelectOption>
              </IonSelect>
            </div>

            {/* Tanggal Mulai */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                Tanggal Mulai
              </label>
              <IonInput
                type="date"
                value={startDate}
                onIonChange={(e) => setStartDate(e.detail.value!)}
                className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
              />
            </div>

            {/* Tanggal Selesai */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                Tanggal Selesai
              </label>
              <IonInput
                type="date"
                value={endDate}
                onIonChange={(e) => setEndDate(e.detail.value!)}
                className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
              />
            </div>

            {/* Alasan */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alasan
              </label>
              <IonTextarea
                value={alasan}
                rows={4}
                placeholder="Tuliskan alasan pengajuan Anda..."
                onIonChange={(e) => setAlasan(e.detail.value!)}
                className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3"
              />
            </div>

            {/* Submit Button */}
            <IonButton
              expand="block"
              onClick={handleSubmit}
              className="custom-button-submit"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Kirim Pengajuan
            </IonButton>
          </div>

          {/* Informasi Saldo Cuti */}
          <div className="mt-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-md">
            <h3 className="font-bold text-gray-900 mb-4">Saldo Cuti Anda</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-600">Cuti Tahunan</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-xs text-gray-600">Cuti Sakit</p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      <style>{`
        .custom-button-submit {
          --background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          --background-hover: linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%);
          --border-radius: 16px;
          height: 56px;
          font-weight: 600;
        }
      `}</style>
    </IonPage>
  );
};

export default PengajuanPage;
