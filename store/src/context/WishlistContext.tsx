import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildWishlistItem,
  getWishlistCount,
  loadWishlist,
  saveWishlist,
  type WishlistItem,
} from "../lib/wishlist";
import type { Product, Variant } from "../lib/types";

interface WishlistToggleInput {
  product: Product;
  variant: Variant;
}

interface WishlistContextValue {
  items: WishlistItem[];
  itemCount: number;
  isInWishlist: (lineId: string) => boolean;
  addItem: (input: WishlistToggleInput) => void;
  removeItem: (lineId: string) => void;
  toggleItem: (input: WishlistToggleInput) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => loadWishlist());

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const isInWishlist = useCallback(
    (lineId: string) => items.some((item) => item.lineId === lineId),
    [items],
  );

  const addItem = useCallback(({ product, variant }: WishlistToggleInput) => {
    const incoming = buildWishlistItem(product, variant);
    setItems((current) => {
      if (current.some((item) => item.lineId === incoming.lineId)) {
        return current;
      }
      return [incoming, ...current];
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const toggleItem = useCallback(
    ({ product, variant }: WishlistToggleInput) => {
      const lineId = buildWishlistItem(product, variant).lineId;
      setItems((current) => {
        if (current.some((item) => item.lineId === lineId)) {
          return current.filter((item) => item.lineId !== lineId);
        }
        return [buildWishlistItem(product, variant), ...current];
      });
    },
    [],
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      itemCount: getWishlistCount(items),
      isInWishlist,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
    }),
    [items, isInWishlist, addItem, removeItem, toggleItem, clearWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
