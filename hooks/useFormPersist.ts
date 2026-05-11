import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";

export function useFormPersist<T extends FieldValues>(
  key: string,
  { watch, setValue }: UseFormReturn<T>
) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate on mount
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed: Partial<T> = JSON.parse(saved);
        Object.entries(parsed).forEach(([k, v]) => {
          setValue(k as Path<T>, v as PathValue<T, Path<T>>);
        });
      } catch (err) {
        console.error("Failed to parse form data from localStorage", err);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
