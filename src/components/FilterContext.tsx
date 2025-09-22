import { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  dateRange: { start: string; end: string };
  latitude: [number, number];
  longitude: [number, number];
  selectedParams: string[];
  floatOptions: {
    trajectory: boolean;
    adjusted: boolean;
    qcFilter: boolean;
    bgcOnly: boolean;
  };
  mapMode: "2d" | "3d";
  depthRange: [number, number];
}

interface FilterContextType {
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: "2023-01", end: "2024-12" },
    latitude: [-90, 90],
    longitude: [-180, 180],
    selectedParams: ["TEMP", "PSAL"],
    floatOptions: {
      trajectory: true,
      adjusted: true,
      qcFilter: false,
      bgcOnly: false,
    },
    mapMode: "2d",
    depthRange: [0, 2000],
  });

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}