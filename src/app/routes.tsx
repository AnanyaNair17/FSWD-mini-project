import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { StaffLoginPage } from "./pages/StaffLoginPage";
import { RegisterClinicPage } from "./pages/RegisterClinicPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ClinicDetailPage } from "./pages/ClinicDetailPage";
import { RootLayout } from "./layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "browse", Component: BrowsePage },
      { path: "staff-login", Component: StaffLoginPage },
      { path: "register-clinic", Component: RegisterClinicPage },
      { path: "how-it-works", Component: HowItWorksPage },
      { path: "clinic/:id", Component: ClinicDetailPage },
    ],
  },
]);
