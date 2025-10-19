import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  homeOutline,
  timeOutline,
  personOutline,
  home,
  time,
  person,
} from "ionicons/icons";

// Feature Pages
import { DashboardPage } from "./features/dashboard";
import AttendancePage from "./features/attendance/AttendancePage";
import { PengajuanPage } from "./features/pengajuan";
import { HistoryPage } from "./features/history";
import { KalenderPage } from "./features/kalender";
import { PayslipPage } from "./features/payslip";
import { DocumentsPage } from "./features/documents";
import ProfilePage from "./features/profile/ProfilePage";
import { LoginPage } from "./features/auth";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  console.log("🔄 AppRoutes render - isAuthenticated:", isAuthenticated);

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Login Route - Redirect to dashboard if already authenticated */}
        <Route exact path="/login">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
        </Route>

        {/* Root Route - Redirect based on auth */}
        <Route exact path="/">
          {isAuthenticated ? (
            <>
              {console.log("➡️ Redirecting to /dashboard")}
              <Redirect to="/dashboard" />
            </>
          ) : (
            <>
              {console.log("➡️ Redirecting to /login")}
              <Redirect to="/login" />
            </>
          )}
        </Route>

        {/* Protected Routes with Tabs */}
        <Route
          path={[
            "/dashboard",
            "/attendance",
            "/profile",
            "/pengajuan",
            "/history",
            "/kalender",
            "/payslip",
            "/documents",
          ]}
        >
          {isAuthenticated ? (
            <IonTabs>
              <IonRouterOutlet>
                {/* Main Tab Routes */}
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route exact path="/attendance" component={AttendancePage} />
                <Route exact path="/profile" component={ProfilePage} />

                {/* Additional Feature Routes */}
                <Route exact path="/pengajuan" component={PengajuanPage} />
                <Route exact path="/history" component={HistoryPage} />
                <Route exact path="/kalender" component={KalenderPage} />
                <Route exact path="/payslip" component={PayslipPage} />
                <Route exact path="/documents" component={DocumentsPage} />
              </IonRouterOutlet>

              {/* Modern Tab Bar */}
              <IonTabBar slot="bottom" className="custom-tab-bar">
                <IonTabButton
                  tab="dashboard"
                  href="/dashboard"
                  className="custom-tab-button"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={homeOutline}
                    className="tab-icon-outline"
                  />
                  <IonIcon
                    aria-hidden="true"
                    icon={home}
                    className="tab-icon-filled"
                  />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>

                <IonTabButton
                  tab="attendance"
                  href="/attendance"
                  className="custom-tab-button"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={timeOutline}
                    className="tab-icon-outline"
                  />
                  <IonIcon
                    aria-hidden="true"
                    icon={time}
                    className="tab-icon-filled"
                  />
                  <IonLabel>Attendance</IonLabel>
                </IonTabButton>

                <IonTabButton
                  tab="profile"
                  href="/profile"
                  className="custom-tab-button"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={personOutline}
                    className="tab-icon-outline"
                  />
                  <IonIcon
                    aria-hidden="true"
                    icon={person}
                    className="tab-icon-filled"
                  />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </IonApp>
);

export default App;
