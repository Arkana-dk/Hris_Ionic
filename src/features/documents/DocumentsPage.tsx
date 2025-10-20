import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonChip,
  IonBadge,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonToast,
  IonIcon,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileContract,
  faCertificate,
  faFileShield,
  faBullhorn,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { cloudDownload, checkmarkCircle, alertCircle, timeOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { documentService } from "../../services";
import type { Document as DocumentType } from "../../types/api.types";

const DocumentsPage: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    // Mock data untuk fallback
    const mockDocuments: DocumentType[] = [
      {
        id: 1,
        employee_id: 1,
        title: "Kontrak Kerja 2025",
        description: "Perjanjian kontrak kerja karyawan tetap periode 2025",
        category: "contract",
        type: "pdf",
        file_path: "/documents/contract-2025.pdf",
        file_size: 2516582,
        uploaded_at: "2025-01-01T08:00:00Z",
        document_date: "2025-01-01",
        status: "active",
        created_at: "2025-01-01T08:00:00Z",
      },
      {
        id: 2,
        employee_id: 1,
        title: "Sertifikat UI/UX Design",
        description: "Sertifikat pelatihan UI/UX Design dari Google",
        category: "certificate",
        type: "pdf",
        file_path: "/documents/certificate-uiux.pdf",
        file_size: 876953,
        uploaded_at: "2024-06-16T09:00:00Z",
        document_date: "2024-06-15",
        status: "active",
        created_at: "2024-06-16T09:00:00Z",
      },
      {
        id: 3,
        employee_id: 1,
        title: "Company Policy Handbook",
        description: "Pedoman kebijakan perusahaan terbaru",
        category: "policy",
        type: "pdf",
        file_path: "/documents/policy-handbook.pdf",
        file_size: 1258291,
        uploaded_at: "2024-03-20T10:00:00Z",
        document_date: "2024-03-20",
        status: "active",
        created_at: "2024-03-20T10:00:00Z",
      },
      {
        id: 4,
        employee_id: 1,
        title: "Pengumuman Event Akhir Tahun",
        description: "Detail acara perayaan akhir tahun perusahaan",
        category: "announcement",
        type: "pdf",
        file_path: "/documents/announcement-event.pdf",
        file_size: 460800,
        uploaded_at: "2024-12-20T14:00:00Z",
        document_date: "2024-12-28",
        status: "active",
        created_at: "2024-12-20T14:00:00Z",
      },
    ];

    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await documentService.getDocuments({
          category: selectedCategory !== "all" ? (selectedCategory as "contract" | "certificate" | "policy" | "announcement" | "other") : undefined,
          status: "active",
        });
        
        setDocuments(Array.isArray(response) ? response : response.data || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Gagal memuat dokumen. Menggunakan data demo.");
        setDocuments(mockDocuments);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [selectedCategory]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    try {
      setError("");
      const response = await documentService.getDocuments({
        category: selectedCategory !== "all" ? (selectedCategory as "contract" | "certificate" | "policy" | "announcement" | "other") : undefined,
        status: "active",
      });
      setDocuments(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error("Error refreshing documents:", err);
      setError("Gagal memuat ulang dokumen");
    }
    event.detail.complete();
  };

  const handleDownload = async (doc: DocumentType) => {
    try {
      setDownloading(doc.id);
      setError("");
      
      const blob = await documentService.downloadDocument(doc.id);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.title}.${doc.type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading document:", err);
      setError("Gagal mengunduh dokumen");
    } finally {
      setDownloading(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "contract":
        return faFileContract;
      case "certificate":
        return faCertificate;
      case "policy":
        return faFileShield;
      case "announcement":
        return faBullhorn;
      default:
        return faFile;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "contract":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "certificate":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "policy":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "announcement":
        return "bg-gradient-to-r from-orange-500 to-orange-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return checkmarkCircle;
      case "expired":
        return alertCircle;
      case "pending":
        return timeOutline;
      default:
        return alertCircle;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      (selectedCategory === "all" || doc.category === selectedCategory) &&
      (searchText === "" ||
        doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <IonPage>
      <IonContent fullscreen className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="relative z-10 min-h-full pb-6">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="px-6 pt-12 pb-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => history.goBack()}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dokumen
                </h1>
                <div className="w-10"></div>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value!)}
                  placeholder="Cari dokumen..."
                  className="custom-searchbar"
                  style={{
                    "--background": "rgba(255, 255, 255, 0.9)",
                    "--border-radius": "12px",
                    "--box-shadow": "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { value: "all", label: "Semua" },
                  { value: "contract", label: "Kontrak" },
                  { value: "certificate", label: "Sertifikat" },
                  { value: "policy", label: "Kebijakan" },
                  { value: "announcement", label: "Pengumuman" },
                ].map((cat) => (
                  <IonChip
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                      selectedCategory === cat.value
                        ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                        : "bg-white/80 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </IonChip>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <IonSpinner name="crescent" className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-gray-500 font-medium">Memuat dokumen...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faFile} className="text-4xl text-blue-500" />
                </div>
                <p className="text-gray-500 font-medium text-lg">Tidak ada dokumen</p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchText ? "Coba kata kunci lain" : "Belum ada dokumen tersedia"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100/50"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Category Icon */}
                        <div
                          className={`flex-shrink-0 w-14 h-14 rounded-xl ${getCategoryColor(
                            doc.category
                          )} flex items-center justify-center shadow-md`}
                        >
                          <FontAwesomeIcon
                            icon={getCategoryIcon(doc.category)}
                            className="text-2xl text-white"
                          />
                        </div>

                        {/* Document Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                              {doc.title}
                            </h3>
                            <IonBadge
                              className={`flex-shrink-0 px-2 py-1 rounded-lg font-medium text-xs ${
                                doc.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : doc.status === "expired"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              <IonIcon icon={getStatusIcon(doc.status)} className="mr-1" />
                              {doc.status === "active"
                                ? "Aktif"
                                : doc.status === "expired"
                                ? "Kadaluarsa"
                                : "Pending"}
                            </IonBadge>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {doc.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Tipe:</span>
                              <span className="uppercase font-semibold text-blue-600">
                                {doc.type}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Ukuran:</span>
                              <span className="font-semibold">{formatFileSize(doc.file_size)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Tanggal:</span>
                              <span className="font-semibold">
                                {formatDate(doc.document_date || doc.uploaded_at)}
                              </span>
                            </span>
                          </div>

                          {/* Download Button */}
                          <button
                            onClick={() => handleDownload(doc)}
                            disabled={downloading === doc.id}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {downloading === doc.id ? (
                              <>
                                <IonSpinner name="crescent" className="w-4 h-4" />
                                <span>Mengunduh...</span>
                              </>
                            ) : (
                              <>
                                <IonIcon icon={cloudDownload} className="text-lg" />
                                <span>Unduh Dokumen</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Toast */}
        <IonToast
          isOpen={!!error}
          onDidDismiss={() => setError("")}
          message={error}
          duration={3000}
          position="top"
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default DocumentsPage;
