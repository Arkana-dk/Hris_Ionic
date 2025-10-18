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

// Services
import { authService } from "./services";

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

// Protected Route Component
const ProtectedRoute: React.FC<{ component: React.ComponentType; exact?: boolean; path: string }> = ({
  component: Component,
  ...rest
}) => {
  const isAuthenticated = authService.isAuthenticated();
  
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      {/* Login Route (No Tabs) */}
      <Route exact path="/login">
        <LoginPage />
      </Route>

      {/* Main App with Tabs (Protected) */}
      <ProtectedRoute exact path="/" component={() => <Redirect to="/dashboard" />} />
      
      <IonTabs>
        <IonRouterOutlet>
          {/* Main Tab Routes */}
          <ProtectedRoute exact path="/dashboard" component={DashboardPage} />
          <ProtectedRoute exact path="/attendance" component={AttendancePage} />
          <ProtectedRoute exact path="/profile" component={ProfilePage} />

          {/* Additional Feature Routes */}
          <ProtectedRoute exact path="/pengajuan" component={PengajuanPage} />
          <ProtectedRoute exact path="/history" component={HistoryPage} />
          <ProtectedRoute exact path="/kalender" component={KalenderPage} />
          <ProtectedRoute exact path="/payslip" component={PayslipPage} />
          <ProtectedRoute exact path="/documents" component={DocumentsPage} />
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
    </IonReactRouter>
  </IonApp>
);

export default App;
