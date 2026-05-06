import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function useFormPersist<T extends Record<string, any>>(
  key: string,
  { watch, setValue }: UseFormReturn<T>
) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate on mount
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([k, v]) => {
          setValue(k as any, v as any);
        });
      } catch (err) {
        console.error("Failed to parse form data from localStorage", err);
      }
    }
    setIsHydrated(true);
  }, [key, setValue]);

  // Persist on every change
  useEffect(() => {
    if (!isHydrated) return;

    const subscription = watch((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [key, watch, isHydrated]);

  return { isHydrated };
}
