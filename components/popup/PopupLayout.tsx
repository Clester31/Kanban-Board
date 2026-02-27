"use client";
import { useAppContext } from "@/lib/context/AppContext";

export default function PopupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { popup, closePopup } = useAppContext();

  return (
    <div className="relative w-full">
      {children}
      {popup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closePopup}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
          <div className="relative z-10 bg-charade-800 px-4 py-4 border-2 border-charade-700 rounded-md" onClick={(e) => e.stopPropagation()}>
            {popup}
          </div>
        </div>
      )}
    </div>
  );
}
