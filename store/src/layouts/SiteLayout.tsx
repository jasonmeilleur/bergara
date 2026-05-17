import { Outlet } from "react-router-dom";
import { CartDrawer } from "../design-system/CartDrawer";
import { CookieBanner } from "../design-system/CookieBanner";
import { Footer } from "../design-system/Footer";
import { Header } from "../design-system/Header";

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CookieBanner />
    </div>
  );
}
