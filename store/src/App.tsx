import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareRiflesProvider } from "./context/CompareRiflesContext";
import { SiteLayout } from "./layouts/SiteLayout";
import { CatalogRoute } from "./pages/CatalogRoute";
import { SeriesPage } from "./pages/SeriesPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { HomePage } from "./pages/HomePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { FaqPage } from "./pages/FaqPage";
import { SitemapPage } from "./pages/SitemapPage";
import { AccountPage } from "./pages/AccountPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SearchPage } from "./pages/SearchPage";
import { WishlistPage } from "./pages/WishlistPage";
import { CompareRiflesPage } from "./pages/CompareRiflesPage";
import { SignUpPage } from "./pages/SignUpPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <CompareRiflesProvider>
          <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="design-system" element={<DesignSystemPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="account/login" element={<LoginPage />} />
            <Route path="account/sign-up" element={<SignUpPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="sitemap" element={<SitemapPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="rifles/compare" element={<CompareRiflesPage />} />
            <Route path=":categoryId/:seriesSlug" element={<SeriesPage />} />
            <Route path=":slug" element={<CatalogRoute />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          </Routes>
          </CompareRiflesProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
