"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const PlanContext = createContext();

export function PlanProvider({ children }) {
  const [planList, setPlanList] = useState([]);
  const [savedList, setSavedList] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPlan = localStorage.getItem("fitlog_plan");
      const savedSaved = localStorage.getItem("fitlog_saved");
      if (savedPlan) setPlanList(JSON.parse(savedPlan));
      if (savedSaved) setSavedList(JSON.parse(savedSaved));
    }
  }, []);

  const addToPlan = (workout) => {
    if (planList.some((item) => item.id === workout.id)) {
      toast.error("Already in your plan!");
      return;
    }
    if (planList.length >= 5) {
      toast.error("Maximum 5 workouts allowed!");
      return;
    }
    const updated = [...planList, workout];
    setPlanList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("fitlog_plan", JSON.stringify(updated));
    }
    toast.success("Added to today's plan!");
  };

  const addToSaved = (workout) => {
    if (savedList.some((item) => item.id === workout.id)) {
      toast.error("Already saved!");
      return;
    }
    const updated = [...savedList, workout];
    setSavedList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("fitlog_saved", JSON.stringify(updated));
    }
    toast.success("Saved for later!");
  };

  const removeFromPlan = (id) => {
    const updated = planList.filter((item) => item.id !== id);
    setPlanList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("fitlog_plan", JSON.stringify(updated));
    }
    toast.success("Removed from plan!");
  };

  const removeFromSaved = (id) => {
    const updated = savedList.filter((item) => item.id !== id);
    setSavedList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("fitlog_saved", JSON.stringify(updated));
    }
    toast.success("Removed from saved!");
  };

  return (
    <PlanContext.Provider
      value={{
        planList,
        savedList,
        addToPlan,
        addToSaved,
        removeFromPlan,
        removeFromSaved,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => useContext(PlanContext);