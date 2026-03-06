import { Map, Wallet } from "lucide-react";

interface NavigationProps {
  activeTab: "itinerary" | "finance";
  onTabChange: (tab: "itinerary" | "finance") => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe z-50 flex justify-around items-center h-20 px-6 sm:h-24 sm:static sm:border-0 sm:bg-transparent sm:justify-start sm:gap-4 sm:p-0 sm:pb-0">
      <button
        onClick={() => onTabChange("itinerary")}
        className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-6 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full transition-all flex-1 sm:flex-none justify-center ${
          activeTab === "itinerary"
            ? "text-bali-ocean sm:bg-white sm:shadow-md sm:dark:bg-gray-800 font-bold"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
        }`}
      >
        <Map size={24} className="sm:w-5 sm:h-5" />
        <span className="text-[10px] sm:text-sm uppercase tracking-wider mt-1 sm:mt-0">Itinerary</span>
      </button>

      <button
        onClick={() => onTabChange("finance")}
        className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-6 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full transition-all flex-1 sm:flex-none justify-center ${
          activeTab === "finance"
            ? "text-bali-sage sm:bg-white sm:shadow-md sm:dark:bg-gray-800 font-bold"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
        }`}
      >
        <Wallet size={24} className="sm:w-5 sm:h-5" />
        <span className="text-[10px] sm:text-sm uppercase tracking-wider mt-1 sm:mt-0">Split Costs</span>
      </button>
    </div>
  );
}
