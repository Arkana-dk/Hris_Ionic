import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonChip,
  IonBadge,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faCertificate,
  faFileShield,
  faBullhorn,
  faDownload,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

interface Document {
  id: string;
  title: string;
  category: "contract" | "certificate" | "policy" | "announcement";
  date: string;
  size: string;
  status: "active" | "expired";
}

const DocumentsPage: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const documents: Document[] = [
    {
      id: "1",
      title: "Employment Contract 2025",
      category: "contract",
      date: "2025-01-01",
      size: "2.4 MB",
      status: "active",
    },
    {
      id: "2",
      title: "UI/UX Design Certificate",
      category: "certificate",
      date: "2024-06-15",
      size: "856 KB",
      status: "active",
    },
    {
      id: "3",
      title: "Company Policy Handbook",
      category: "policy",
      date: "2024-03-20",
      size: "1.2 MB",
      status: "active",
    },
    {
      id: "4",
      title: "New Year Event Announcement",
      category: "announcement",
      date: "2024-12-28",
      size: "450 KB",
      status: "active",
    },
    {
      id: "5",
      title: "Figma Certification",
      category: "certificate",
      date: "2024-05-10",
      size: "720 KB",
      status: "active",
    },
    {
      id: "6",
      title: "Work From Home Policy",
      category: "policy",
      date: "2024-02-15",
      size: "980 KB",
      status: "active",
    },
  ];

  // Get icon untuk setiap kategori dengan Font Awesome
  const getCategoryIcon = (category: Document["category"]) => {
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
        return faFileContract;
    }
  };

  // Get background color untuk kategori
  const getCategoryColor = (category: Document["category"]) => {
    switch (category) {
      case "contract":
        return "bg-blue-50";
      case "certificate":
        return "bg-amber-50";
      case "policy":
        return "bg-emerald-50";
      case "announcement":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  const downloadDocument = (doc: Document) => {
    console.log("Downloading:", doc.title);
    alert(`Downloading ${doc.title}...`);
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Category stats
  const categories = [
    {
      type: "contract",
      label: "Contracts",
      count: documents.filter((d) => d.category === "contract").length,
    },
    {
      type: "certificate",
      label: "Certificates",
      count: documents.filter((d) => d.category === "certificate").length,
    },
    {
      type: "policy",
      label: "Policies",
      count: documents.filter((d) => d.category === "policy").length,
    },
    {
      type: "announcement",
      label: "Announcements",
      count: documents.filter((d) => d.category === "announcement").length,
    },
  ];

  return (
    <IonPage>
      <IonContent className="bg-gray-50 font-inter">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 pt-12 pb-6 px-5">
          <div className="flex items-center mb-4">
            <button onClick={() => history.goBack()} className="mr-3">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-white text-xl"
              />
            </button>
            <h1 className="text-white text-2xl font-bold">Documents</h1>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 -mt-2">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search documents..."
            className="custom-searchbar"
          />
        </div>

        {/* Category Cards */}
        <div className="px-5 mt-4 grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.type}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.type ? "all" : cat.type
                )
              }
              className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all ${
                selectedCategory === cat.type ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl ${getCategoryColor(
                    cat.type
                  )} flex items-center justify-center mb-2`}
                >
                  <FontAwesomeIcon
                    icon={getCategoryIcon(cat.type)}
                    className={`text-xl ${
                      cat.type === "contract"
                        ? "text-blue-600"
                        : cat.type === "certificate"
                        ? "text-amber-600"
                        : cat.type === "policy"
                        ? "text-emerald-600"
                        : "text-purple-600"
                    }`}
                  />
                </div>
                <IonBadge color="primary">{cat.count}</IonBadge>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {cat.label}
              </h3>
            </div>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="px-5 mt-4 flex space-x-2 overflow-x-auto pb-2">
          <IonChip
            color={selectedCategory === "all" ? "primary" : "medium"}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </IonChip>
          <IonChip
            color={selectedCategory === "contract" ? "primary" : "medium"}
            onClick={() => setSelectedCategory("contract")}
          >
            Contracts
          </IonChip>
          <IonChip
            color={selectedCategory === "certificate" ? "primary" : "medium"}
            onClick={() => setSelectedCategory("certificate")}
          >
            Certificates
          </IonChip>
          <IonChip
            color={selectedCategory === "policy" ? "primary" : "medium"}
            onClick={() => setSelectedCategory("policy")}
          >
            Policies
          </IonChip>
          <IonChip
            color={selectedCategory === "announcement" ? "primary" : "medium"}
            onClick={() => setSelectedCategory("announcement")}
          >
            Announcements
          </IonChip>
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <p className="text-gray-400">No documents found</p>
          </div>
        ) : (
          <div className="px-5 mt-4 pb-20">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 rounded-lg ${getCategoryColor(
                      doc.category
                    )} flex items-center justify-center mr-3`}
                  >
                    <FontAwesomeIcon
                      icon={getCategoryIcon(doc.category)}
                      className={`text-lg ${
                        doc.category === "contract"
                          ? "text-blue-600"
                          : doc.category === "certificate"
                          ? "text-amber-600"
                          : doc.category === "policy"
                          ? "text-emerald-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {doc.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <IonBadge
                        color={doc.status === "active" ? "success" : "danger"}
                        className="ml-auto"
                      >
                        {doc.status}
                      </IonBadge>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => downloadDocument(doc)}
                    className="text-indigo-600 hover:text-indigo-800 ml-2"
                  >
                    <FontAwesomeIcon icon={faDownload} className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DocumentsPage;
