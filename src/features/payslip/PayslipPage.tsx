import React, { useState } from "react";
import { IonContent, IonPage, IonModal, IonButton } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faCalendar,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

interface PayslipData {
  id: string;
  month: string;
  year: number;
  period: string;
  grossSalary: number;
  netSalary: number;
  status: "paid" | "pending" | "processing";
  components: {
    basicSalary: number;
    allowances: {
      transport: number;
      meal: number;
      position: number;
    };
    deductions: {
      tax: number;
      insurance: number;
      loan: number;
    };
    overtime: number;
    bonus: number;
  };
}

const PayslipPage: React.FC = () => {
  const history = useHistory();
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const payslips: PayslipData[] = [
    {
      id: "1",
      month: "October",
      year: 2025,
      period: "1-31 October 2025",
      grossSalary: 15000000,
      netSalary: 12750000,
      status: "paid",
      components: {
        basicSalary: 10000000,
        allowances: {
          transport: 1000000,
          meal: 500000,
          position: 1500000,
        },
        deductions: {
          tax: 1500000,
          insurance: 500000,
          loan: 250000,
        },
        overtime: 1500000,
        bonus: 500000,
      },
    },
    {
      id: "2",
      month: "September",
      year: 2025,
      period: "1-30 September 2025",
      grossSalary: 14500000,
      netSalary: 12325000,
      status: "paid",
      components: {
        basicSalary: 10000000,
        allowances: {
          transport: 1000000,
          meal: 500000,
          position: 1500000,
        },
        deductions: {
          tax: 1450000,
          insurance: 500000,
          loan: 225000,
        },
        overtime: 1000000,
        bonus: 500000,
      },
    },
    {
      id: "3",
      month: "August",
      year: 2025,
      period: "1-31 August 2025",
      grossSalary: 14000000,
      netSalary: 11900000,
      status: "paid",
      components: {
        basicSalary: 10000000,
        allowances: {
          transport: 1000000,
          meal: 500000,
          position: 1500000,
        },
        deductions: {
          tax: 1400000,
          insurance: 500000,
          loan: 200000,
        },
        overtime: 500000,
        bonus: 500000,
      },
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-green-100 text-green-600",
      pending: "bg-yellow-100 text-yellow-600",
      processing: "bg-blue-100 text-blue-600",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-600";
  };

  const openPayslipDetail = (payslip: PayslipData) => {
    setSelectedPayslip(payslip);
    setShowModal(true);
  };

  const downloadPayslip = (payslip: PayslipData) => {
    // In real app: Generate PDF and download
    alert(`Downloading payslip for ${payslip.month} ${payslip.year}`);
  };

  return (
    <IonPage className="bg-gray-50">
      <IonContent fullscreen className="font-inter">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 blur-2xl rounded-full"></div>

          <div className="relative flex items-center gap-4">
            <button
              onClick={() => history.goBack()}
              className="p-2 hover:bg-white/20 rounded-full transition-smooth"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Payslip</h1>
              <p className="text-sm text-white/80">Your salary history</p>
            </div>
          </div>
        </div>

        {/* Latest Payslip Highlight */}
        <div className="px-5 -mt-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-emerald-100">Latest Payslip</p>
                <h3 className="text-2xl font-bold">
                  {payslips[0].month} {payslips[0].year}
                </h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <span className="text-3xl">💰</span>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 mb-3">
              <p className="text-xs text-emerald-100 mb-1">Net Salary</p>
              <p className="text-3xl font-bold">
                {formatCurrency(payslips[0].netSalary)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openPayslipDetail(payslips[0])}
                className="flex-1 bg-white text-emerald-600 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-smooth"
              >
                View Details
              </button>
              <button
                onClick={() => downloadPayslip(payslips[0])}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-smooth"
              >
                <FontAwesomeIcon icon={faDownload} className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Payslip History */}
        <div className="px-5 py-6">
          <h2 className="text-gray-800 font-bold text-xl mb-4">
            Payslip History
          </h2>
          <div className="space-y-3">
            {payslips.map((payslip, index) => (
              <div
                key={payslip.id}
                onClick={() => openPayslipDetail(payslip)}
                className="bg-white rounded-xl p-4 shadow-md hover-lift animate-stagger cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-12 h-12 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="text-emerald-600 text-xl"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {payslip.month} {payslip.year}
                      </h4>
                      <p className="text-xs text-gray-500">{payslip.period}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-gray-400 text-lg"
                  />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-600">Net Salary</p>
                    <p className="font-bold text-emerald-600 text-lg">
                      {formatCurrency(payslip.netSalary)}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                      payslip.status
                    )}`}
                  >
                    {payslip.status === "paid" && "✓ Paid"}
                    {payslip.status === "pending" && "⏳ Pending"}
                    {payslip.status === "processing" && "⚙️ Processing"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>

      {/* Payslip Detail Modal */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonContent className="ion-padding">
          {selectedPayslip && (
            <div className="py-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Payslip Detail
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Period */}
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Period</p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedPayslip.month} {selectedPayslip.year}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPayslip.period}
                </p>
              </div>

              {/* Earnings */}
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  Earnings
                </h3>
                <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Basic Salary</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(selectedPayslip.components.basicSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Transport Allowance</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        selectedPayslip.components.allowances.transport
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Meal Allowance</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        selectedPayslip.components.allowances.meal
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Position Allowance</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        selectedPayslip.components.allowances.position
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Overtime</span>
                    <span className="font-semibold text-emerald-600">
                      + {formatCurrency(selectedPayslip.components.overtime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Bonus</span>
                    <span className="font-semibold text-emerald-600">
                      + {formatCurrency(selectedPayslip.components.bonus)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">
                      Gross Salary
                    </span>
                    <span className="font-bold text-gray-900 text-lg">
                      {formatCurrency(selectedPayslip.grossSalary)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  Deductions
                </h3>
                <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Income Tax</span>
                    <span className="font-semibold text-red-600">
                      -{" "}
                      {formatCurrency(
                        selectedPayslip.components.deductions.tax
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Health Insurance</span>
                    <span className="font-semibold text-red-600">
                      -{" "}
                      {formatCurrency(
                        selectedPayslip.components.deductions.insurance
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Loan Repayment</span>
                    <span className="font-semibold text-red-600">
                      -{" "}
                      {formatCurrency(
                        selectedPayslip.components.deductions.loan
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-6">
                <p className="text-sm text-emerald-100 mb-2">
                  Net Salary (Take Home Pay)
                </p>
                <p className="text-4xl font-bold mb-4">
                  {formatCurrency(selectedPayslip.netSalary)}
                </p>
                <div
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm`}
                >
                  ✓ Paid on 1st {selectedPayslip.month}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <IonButton
                  expand="block"
                  onClick={() => downloadPayslip(selectedPayslip)}
                  className="flex-1"
                  style={{
                    "--background":
                      "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                    "--border-radius": "12px",
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download PDF
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowModal(false)}
                  style={{
                    "--border-radius": "12px",
                    "--border-color": "#10b981",
                    "--color": "#10b981",
                  }}
                >
                  Close
                </IonButton>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default PayslipPage;
