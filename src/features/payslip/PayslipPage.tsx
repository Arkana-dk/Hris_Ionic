import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonToast,
  IonModal,
  IonButton,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faMoneyBillWave,
  faChartLine,
  faFileInvoiceDollar,
  faFilter,
  faXmark,
  faCheckCircle,
  faWallet,
  faArrowUp,
  faArrowDown,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { payslipService } from "../../services";
import type { Payslip, PayrollComponent } from "../../types/api.types";

// Helper functions
const calculateTotal = (components: PayrollComponent[] | number): number => {
  if (typeof components === "number") return components;
  return components.reduce((sum, component) => sum + component.amount, 0);
};

const PayslipPage: React.FC = () => {
  const history = useHistory();

  // State
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter state
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Load payslips
  useEffect(() => {
    loadPayslips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth]);

  const loadPayslips = async () => {
    try {
      setLoading(true);
      setError("");

      const params: { year?: number; month?: number } = {};
      if (selectedYear) params.year = selectedYear;
      if (selectedMonth) params.month = selectedMonth;

      const response = await payslipService.getPayslips(params);
      // Extract data from paginated response
      setPayslips(Array.isArray(response) ? response : response.data);
    } catch (err) {
      console.error("Failed to load payslips:", err);
      setError("Gagal memuat data payslip");
      setShowToast(true);

      // Fallback data
      setPayslips([
        {
          id: 1,
          employee_id: 1,
          period: "October 2025",
          month: 10,
          year: 2025,
          basic_salary: 10000000,
          allowances: [
            {
              id: 1,
              name: "Tunjangan Transport",
              amount: 1000000,
              type: "fixed",
            },
            { id: 2, name: "Tunjangan Makan", amount: 1500000, type: "fixed" },
            { id: 3, name: "Tunjangan Jabatan", amount: 500000, type: "fixed" },
          ],
          deductions: [
            { id: 4, name: "PPh 21", amount: 1500000, type: "percentage" },
            { id: 5, name: "BPJS Kesehatan", amount: 500000, type: "fixed" },
            {
              id: 6,
              name: "BPJS Ketenagakerjaan",
              amount: 250000,
              type: "fixed",
            },
          ],
          gross_salary: 15000000,
          net_salary: 12750000,
          status: "paid",
          created_at: "2025-10-01T00:00:00Z",
        },
        {
          id: 2,
          employee_id: 1,
          period: "September 2025",
          month: 9,
          year: 2025,
          basic_salary: 10000000,
          allowances: [
            {
              id: 1,
              name: "Tunjangan Transport",
              amount: 1000000,
              type: "fixed",
            },
            { id: 2, name: "Tunjangan Makan", amount: 1500000, type: "fixed" },
          ],
          deductions: [
            { id: 4, name: "PPh 21", amount: 1425000, type: "percentage" },
            { id: 5, name: "BPJS Kesehatan", amount: 500000, type: "fixed" },
            {
              id: 6,
              name: "BPJS Ketenagakerjaan",
              amount: 250000,
              type: "fixed",
            },
          ],
          gross_salary: 14500000,
          net_salary: 12325000,
          status: "paid",
          created_at: "2025-09-01T00:00:00Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (payslipId: number) => {
    try {
      setDownloading(true);
      // TODO: Implement download payslip API
      console.log("Download payslip:", payslipId);
      setError("Fitur download akan segera tersedia");
      setShowToast(true);
    } catch (err) {
      console.error("Failed to download:", err);
      setError("Gagal mengunduh PDF");
      setShowToast(true);
    } finally {
      setDownloading(false);
    }
  };

  const openDetail = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setShowDetailModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "from-emerald-400 to-teal-500",
      pending: "from-amber-400 to-orange-500",
      processing: "from-blue-400 to-indigo-500",
    };
    return colors[status] || "from-gray-400 to-gray-500";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      paid: "Dibayar",
      pending: "Menunggu",
      processing: "Proses",
    };
    return texts[status] || status;
  };

  const getMonthName = (month: number) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[month - 1];
  };

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const latestPayslip = payslips[0];

  return (
    <IonPage className="bg-gradient-to-b from-slate-50 via-emerald-50 to-white">
      <IonContent fullscreen className="font-inter">
        {/* Modern Enhanced Header */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-green-500 text-white px-5 pt-10 pb-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-10 left-0 w-56 h-56 bg-teal-300/10 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-green-300/5 rounded-full blur-2xl animate-pulse"></div>

          {/* Header Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => history.goBack()}
                className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
              </button>
              <button
                onClick={() => setShowFilterModal(true)}
                className="p-2 hover:bg-white/15 rounded-2xl transition-all duration-300 active:scale-90 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faFilter} className="text-lg" />
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBillWave} />
                Payslip
              </h1>
              <p className="text-sm text-white/80">
                Riwayat slip gaji & penghasilan Anda
              </p>
            </div>

            {/* Latest Payslip Highlight Card */}
            {!loading && latestPayslip && (
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-white/70 font-bold mb-1">
                      Payslip Terbaru
                    </p>
                    <h3 className="text-xl font-black">
                      {latestPayslip.period}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FontAwesomeIcon
                      icon={faWallet}
                      className="text-2xl text-white"
                    />
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-white/30">
                  <p className="text-xs text-white/70 font-bold mb-1">
                    Take Home Pay
                  </p>
                  <p className="text-3xl font-black text-white">
                    {formatCurrency(latestPayslip.net_salary)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className="text-green-300 text-xs"
                      />
                      <p className="text-xs text-white/70 font-bold">
                        Pendapatan
                      </p>
                    </div>
                    <p className="text-sm font-black text-white">
                      {formatCurrency(latestPayslip.gross_salary)}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        className="text-red-300 text-xs"
                      />
                      <p className="text-xs text-white/70 font-bold">
                        Potongan
                      </p>
                    </div>
                    <p className="text-sm font-black text-white">
                      {formatCurrency(calculateTotal(latestPayslip.deductions))}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openDetail(latestPayslip)}
                    className="flex-1 bg-white text-emerald-600 py-3 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all duration-300 active:scale-95 shadow-lg"
                  >
                    Lihat Detail
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(latestPayslip.id)}
                    disabled={downloading}
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 active:scale-95 border border-white/30 disabled:opacity-50"
                  >
                    <FontAwesomeIcon
                      icon={downloading ? faClock : faDownload}
                      className={`text-lg ${downloading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payslip History Section */}
        <div className="px-5 -mt-8 pb-8">
          <div className="mb-5">
            <h2 className="text-xl font-black text-gray-900 mb-1">
              Riwayat Payslip
            </h2>
            <p className="text-sm text-gray-500">
              {payslips.length} payslip tersedia
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <IonSpinner
                  name="crescent"
                  className="w-12 h-12 text-emerald-600"
                />
                <p className="mt-4 text-gray-600 font-medium">
                  Loading payslips...
                </p>
              </div>
            </div>
          ) : payslips.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faFileInvoiceDollar}
                  className="text-3xl text-gray-400"
                />
              </div>
              <p className="text-gray-600 font-bold">Tidak ada payslip</p>
              <p className="text-sm text-gray-400 mt-1">
                Belum ada data payslip untuk periode ini
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payslips.map((payslip, index) => (
                <div
                  key={payslip.id}
                  onClick={() => openDetail(payslip)}
                  className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-emerald-200 cursor-pointer transform hover:-translate-y-1"
                  style={{
                    animation: `slideInRight 0.6s ease-out ${
                      index * 0.1
                    }s backwards`,
                  }}
                >
                  {/* Decorative Line */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full bg-gradient-to-b ${getStatusColor(
                      payslip.status
                    )} group-hover:w-2 transition-all`}
                  ></div>

                  <div className="ml-2">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-md">
                          <FontAwesomeIcon
                            icon={faFileInvoiceDollar}
                            className="text-emerald-600 text-lg"
                          />
                        </div>
                        <div>
                          <p className="font-black text-gray-800 text-lg">
                            {payslip.period}
                          </p>
                          <p className="text-xs text-gray-400 font-bold">
                            {payslip.payment_date
                              ? `Dibayar: ${new Date(
                                  payslip.payment_date
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}`
                              : "Belum dibayar"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r ${getStatusColor(
                          payslip.status
                        )} text-white shadow-md flex items-center gap-1`}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {getStatusText(payslip.status)}
                      </div>
                    </div>

                    {/* Net Salary Highlight */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mb-3 border border-emerald-100/50">
                      <p className="text-xs text-gray-500 font-bold mb-1">
                        Take Home Pay
                      </p>
                      <p className="text-2xl font-black text-emerald-600">
                        {formatCurrency(payslip.net_salary)}
                      </p>
                    </div>

                    {/* Breakdown Summary */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center border border-blue-100/50">
                        <p className="text-xs text-gray-500 font-bold mb-1">
                          Gaji Pokok
                        </p>
                        <p className="text-xs font-black text-blue-600">
                          {formatCurrency(payslip.basic_salary)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center border border-green-100/50">
                        <p className="text-xs text-gray-500 font-bold mb-1">
                          Tunjangan
                        </p>
                        <p className="text-xs font-black text-green-600">
                          +{formatCurrency(calculateTotal(payslip.allowances))}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-3 text-center border border-red-100/50">
                        <p className="text-xs text-gray-500 font-bold mb-1">
                          Potongan
                        </p>
                        <p className="text-xs font-black text-red-600">
                          -{formatCurrency(calculateTotal(payslip.deductions))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>

      {/* Filter Modal */}
      <IonModal
        isOpen={showFilterModal}
        onDidDismiss={() => setShowFilterModal(false)}
        className="custom-modal"
      >
        <div className="h-full bg-gradient-to-b from-slate-50 to-white p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Filter Period</h2>
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
            >
              <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Tahun
              </label>
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setShowFilterModal(false);
                    }}
                    className={`p-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                      selectedYear === year
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-md"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Bulan (Opsional)
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedMonth(null);
                    setShowFilterModal(false);
                  }}
                  className={`p-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                    selectedMonth === null
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200"
                  }`}
                >
                  Semua
                </button>
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month);
                      setShowFilterModal(false);
                    }}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                      selectedMonth === month
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-md"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200"
                    }`}
                  >
                    {getMonthName(month)}
                  </button>
                ))}
              </div>
            </div>

            <IonButton
              expand="block"
              onClick={() => {
                setSelectedYear(new Date().getFullYear());
                setSelectedMonth(null);
                setShowFilterModal(false);
              }}
              className="mt-6"
              style={{
                "--background":
                  "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                "--border-radius": "16px",
                height: "48px",
                fontWeight: "700",
              }}
            >
              Reset Filter
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Detail Modal */}
      <IonModal
        isOpen={showDetailModal}
        onDidDismiss={() => setShowDetailModal(false)}
        className="custom-modal-full"
      >
        <div className="h-full bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
          {selectedPayslip && (
            <>
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black">Detail Payslip</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-white" />
                  </button>
                </div>
                <p className="text-lg font-bold text-white/90">
                  {selectedPayslip.period}
                </p>
              </div>

              <div className="p-5 space-y-5">
                {/* Take Home Pay Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-6 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FontAwesomeIcon icon={faWallet} className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-100 font-bold">
                        Take Home Pay
                      </p>
                      <p className="text-xs text-emerald-200">
                        Gaji yang Anda terima
                      </p>
                    </div>
                  </div>
                  <p className="text-4xl font-black mb-4">
                    {formatCurrency(selectedPayslip.net_salary)}
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white/20 backdrop-blur-sm border border-white/30`}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {getStatusText(selectedPayslip.status)} •{" "}
                    {selectedPayslip.payment_date
                      ? new Date(
                          selectedPayslip.payment_date
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                        })
                      : "Pending"}
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="text-emerald-600 text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500 font-bold">
                        Pendapatan
                      </p>
                    </div>
                    <p className="text-xl font-black text-emerald-600">
                      {formatCurrency(selectedPayslip.gross_salary)}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500 font-bold">
                        Potongan
                      </p>
                    </div>
                    <p className="text-xl font-black text-red-600">
                      {formatCurrency(
                        calculateTotal(selectedPayslip.deductions)
                      )}
                    </p>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faChartLine}
                      className="text-emerald-600"
                    />
                    Rincian Lengkap
                  </h3>

                  <div className="space-y-4">
                    {/* Earnings Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faMoneyBillWave}
                            className="text-blue-600 text-xs"
                          />
                        </div>
                        <h4 className="font-bold text-gray-900">Pendapatan</h4>
                      </div>
                      <div className="space-y-2 ml-8">
                        <DetailRow
                          label="Gaji Pokok"
                          value={formatCurrency(selectedPayslip.basic_salary)}
                          color="text-gray-700"
                        />
                        <DetailRow
                          label="Tunjangan"
                          value={`+ ${formatCurrency(
                            calculateTotal(selectedPayslip.allowances)
                          )}`}
                          color="text-green-600"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <DetailRow
                        label="Total Pendapatan"
                        value={formatCurrency(selectedPayslip.gross_salary)}
                        color="text-gray-900"
                        bold
                      />
                    </div>

                    {/* Deductions Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="text-red-600 text-xs"
                          />
                        </div>
                        <h4 className="font-bold text-gray-900">Potongan</h4>
                      </div>
                      <div className="space-y-2 ml-8">
                        <DetailRow
                          label="Total Potongan"
                          value={`- ${formatCurrency(
                            calculateTotal(selectedPayslip.deductions)
                          )}`}
                          color="text-red-600"
                        />
                      </div>
                    </div>

                    <div className="border-t-2 border-emerald-200 pt-3 bg-emerald-50 -mx-5 px-5 py-3 rounded-2xl">
                      <DetailRow
                        label="Gaji Bersih (Take Home)"
                        value={formatCurrency(selectedPayslip.net_salary)}
                        color="text-emerald-600"
                        bold
                        large
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 sticky bottom-0 bg-white py-3 -mx-5 px-5 border-t border-gray-100">
                  <IonButton
                    expand="block"
                    onClick={() => handleDownloadPDF(selectedPayslip.id)}
                    disabled={downloading}
                    className="flex-1"
                    style={{
                      "--background":
                        "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                      "--border-radius": "16px",
                      height: "50px",
                      fontWeight: "700",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={downloading ? faClock : faDownload}
                      className={`mr-2 ${downloading ? "animate-spin" : ""}`}
                    />
                    {downloading ? "Downloading..." : "Download PDF"}
                  </IonButton>
                </div>
              </div>
            </>
          )}
        </div>
      </IonModal>

      <style>{`
        .custom-modal {
          --height: 70%;
          --border-radius: 24px 24px 0 0;
        }

        .custom-modal-full {
          --height: 90%;
          --border-radius: 24px 24px 0 0;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => {
          setShowToast(false);
          setError("");
        }}
        message={error}
        duration={3000}
        position="top"
        color={error.includes("berhasil") ? "success" : "danger"}
      />
    </IonPage>
  );
};

// Helper Component for Detail Rows
const DetailRow: React.FC<{
  label: string;
  value: string;
  color: string;
  bold?: boolean;
  large?: boolean;
}> = ({ label, value, color, bold = false, large = false }) => (
  <div className="flex items-center justify-between py-1">
    <span
      className={`${bold ? "font-bold" : "font-medium"} ${
        large ? "text-base" : "text-sm"
      } text-gray-700`}
    >
      {label}
    </span>
    <span
      className={`${bold ? "font-black" : "font-semibold"} ${
        large ? "text-xl" : "text-sm"
      } ${color}`}
    >
      {value}
    </span>
  </div>
);

export default PayslipPage;
