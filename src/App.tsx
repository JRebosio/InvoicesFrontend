import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Container } from "@mantine/core";
import LoginForm from "./components/Login";
import Providers from "./components/Providers";
import Invoices from "./components/Invoices";
import ProvidersForm from "./components/ProvidersForm";
import InvoicesForm from "./components/InvoicesForm";
import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { StyledContainer } from "./styledComponents";
import LostPage from "./components/LostPage";
function Layout() {
  return (
    <>
      <Header />
      <Container px="md" py="sm">
        <Outlet />
      </Container>
    </>
  );
}

export default function App() {
  return (
    <>
      <StyledContainer>
        <MantineProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="login" element={<LoginForm />} />

            <Route element={<PersistLogin />}>
              <Route element={<Layout />}>
                <Route element={<RequireAuth allowedRoles={["PLACER"]} />}>
                  <Route path="/providers" element={<Providers />} />
                  <Route path="/providers/create" element={<ProvidersForm />} />
                  <Route path="/invoices/create" element={<InvoicesForm />} />
                  <Route path="/invoices/:id" element={<InvoicesForm />} />
                </Route>

                <Route
                  element={
                    <RequireAuth allowedRoles={["PLACER", "APPROVER"]} />
                  }
                >
                  <Route path="/invoices" element={<Invoices />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<LostPage />} />
          </Routes>
        </MantineProvider>
      </StyledContainer>
    </>
  );
}
