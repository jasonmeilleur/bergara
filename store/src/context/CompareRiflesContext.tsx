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
  compareRifleId,
  loadCompareRifles,
  MAX_COMPARE_RIFLES,
  saveCompareRifles,
  type CompareRifleItem,
} from "../lib/compare-rifles";
import { getProductBySlug, isRifle } from "../lib/catalog";

interface CompareRiflesContextValue {
  items: CompareRifleItem[];
  itemCount: number;
  maxItems: number;
  isFull: boolean;
  isInCompare: (productSlug: string) => boolean;
  addRifle: (productSlug: string) => boolean;
  removeRifle: (productSlug: string) => void;
  toggleRifle: (productSlug: string) => boolean;
  clearCompare: () => void;
}

const CompareRiflesContext = createContext<CompareRiflesContextValue | null>(null);

export function CompareRiflesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareRifleItem[]>(() => loadCompareRifles());

  useEffect(() => {
    saveCompareRifles(items);
  }, [items]);

  const isInCompare = useCallback(
    (productSlug: string) =>
      items.some((item) => item.productSlug === productSlug),
    [items],
  );

  const addRifle = useCallback((productSlug: string) => {
    const product = getProductBySlug(productSlug);
    if (!product || !isRifle(product)) return false;

    let added = false;
    setItems((current) => {
      if (current.length >= MAX_COMPARE_RIFLES) return current;
      const id = compareRifleId(productSlug);
      if (current.some((item) => item.productSlug === id)) return current;
      added = true;
      return [{ productSlug: id, addedAt: Date.now() }, ...current];
    });
    return added;
  }, []);

  const removeRifle = useCallback((productSlug: string) => {
    setItems((current) =>
      current.filter((item) => item.productSlug !== productSlug),
    );
  }, []);

  const toggleRifle = useCallback(
    (productSlug: string) => {
      if (isInCompare(productSlug)) {
        removeRifle(productSlug);
        return true;
      }
      return addRifle(productSlug);
    },
    [addRifle, isInCompare, removeRifle],
  );

  const clearCompare = useCallback(() => setItems([]), []);

  const value = useMemo<CompareRiflesContextValue>(
    () => ({
      items,
      itemCount: items.length,
      maxItems: MAX_COMPARE_RIFLES,
      isFull: items.length >= MAX_COMPARE_RIFLES,
      isInCompare,
      addRifle,
      removeRifle,
      toggleRifle,
      clearCompare,
    }),
    [items, isInCompare, addRifle, removeRifle, toggleRifle, clearCompare],
  );

  return (
    <CompareRiflesContext.Provider value={value}>
      {children}
    </CompareRiflesContext.Provider>
  );
}

export function useCompareRifles() {
  const context = useContext(CompareRiflesContext);
  if (!context) {
    throw new Error("useCompareRifles must be used within CompareRiflesProvider");
  }
  return context;
}
