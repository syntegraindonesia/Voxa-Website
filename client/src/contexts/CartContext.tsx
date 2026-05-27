import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { products } from '@/data/products';

export interface CartItem {
  id: number;        // DB id for logged-in users; negative temp id for guests
  productId: string;
  color: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, color?: string, qty?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  totalCount: 0,
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

const LS_KEY = 'voxa_guest_cart';

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

let _tempId = -1;
function nextTempId() { return _tempId--; }

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [guestItems, setGuestItems] = useState<CartItem[]>([]);

  // Load guest cart from localStorage on mount
  useEffect(() => {
    setGuestItems(loadGuestCart());
  }, []);

  // Persist guest cart
  useEffect(() => {
    if (!isAuthenticated) saveGuestCart(guestItems);
  }, [guestItems, isAuthenticated]);

  // Server cart for logged-in users
  const { data: serverItems = [] } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 10_000,
  });

  const addMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
    onError: () => toast.error('Gagal menambahkan ke keranjang'),
  });
  const updateMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });
  const removeMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });
  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });

  const items: CartItem[] = isAuthenticated ? serverItems : guestItems;
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((productId: string, color = 'Default', qty = 1) => {
    if (isAuthenticated) {
      addMutation.mutate({ productId, color, quantity: qty });
    } else {
      setGuestItems((prev) => {
        const existing = prev.find((i) => i.productId === productId && i.color === color);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.color === color
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { id: nextTempId(), productId, color, quantity: qty }];
      });
    }
    toast.success('Ditambahkan ke keranjang', {
      action: { label: 'Lihat', onClick: () => setIsOpen(true) },
    });
  }, [isAuthenticated, addMutation]);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (isAuthenticated) {
      updateMutation.mutate({ itemId, quantity });
    } else {
      setGuestItems((prev) => prev.map((i) => i.id === itemId ? { ...i, quantity } : i));
    }
  }, [isAuthenticated, updateMutation]);

  const removeItem = useCallback((itemId: number) => {
    if (isAuthenticated) {
      removeMutation.mutate({ itemId });
    } else {
      setGuestItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  }, [isAuthenticated, removeMutation]);

  const clearCart = useCallback(() => {
    if (isAuthenticated) {
      clearMutation.mutate();
    } else {
      setGuestItems([]);
    }
  }, [isAuthenticated, clearMutation]);

  return (
    <CartContext.Provider value={{ items, totalCount, isOpen, openCart, closeCart, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
