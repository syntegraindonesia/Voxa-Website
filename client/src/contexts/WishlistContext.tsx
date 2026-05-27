import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { getLoginUrl } from '@/const';

interface WishlistContextValue {
  savedIds: Set<string>;
  isLoading: boolean;
  toggle: (productId: string) => void;
  isSaved: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue>({
  savedIds: new Set(),
  isLoading: false,
  toggle: () => {},
  isSaved: () => false,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: wishlistIds = [], isLoading } = trpc.wishlist.list.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const savedIds = new Set(wishlistIds);

  const toggleMutation = trpc.wishlist.toggle.useMutation({
    onMutate: async ({ productId }) => {
      await utils.wishlist.list.cancel();
      const prev = utils.wishlist.list.getData();
      const current = prev ?? [];
      const isSaved = current.includes(productId);
      utils.wishlist.list.setData(undefined, isSaved
        ? current.filter((id) => id !== productId)
        : [...current, productId]
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) utils.wishlist.list.setData(undefined, ctx.prev);
      toast.error('Gagal memperbarui wishlist');
    },
    onSettled: () => utils.wishlist.list.invalidate(),
  });

  const toggle = useCallback((productId: string) => {
    if (!isAuthenticated) {
      toast('Silakan masuk untuk menyimpan produk', {
        action: {
          label: 'Masuk',
          onClick: () => { window.location.href = getLoginUrl(); },
        },
      });
      return;
    }
    toggleMutation.mutate({ productId });
  }, [isAuthenticated, toggleMutation]);

  const isSaved = useCallback((productId: string) => savedIds.has(productId), [savedIds]);

  return (
    <WishlistContext.Provider value={{ savedIds, isLoading, toggle, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
