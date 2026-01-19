import { useState, useEffect } from "react";

export type Role = "sdr" | "ae";

const ROLE_STORAGE_KEY = "salesai-role";

export function useRole() {
  const [role, setRoleState] = useState<Role>("sdr");
  const [isLoading, setIsLoading] = useState(true);

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as Role | null;
    if (savedRole && (savedRole === "sdr" || savedRole === "ae")) {
      setRoleState(savedRole);
    }
    setIsLoading(false);
  }, []);

  // Save role to localStorage when it changes
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
  };

  const toggleRole = () => {
    const newRole = role === "sdr" ? "ae" : "sdr";
    setRole(newRole);
  };

  const getRoleLabel = () => {
    return role === "sdr" ? "SDR Mode" : "AE Mode";
  };

  const getRoleDescription = () => {
    return role === "sdr"
      ? "Focus on discovery and qualification"
      : "Focus on closing and negotiation";
  };

  return {
    role,
    setRole,
    toggleRole,
    getRoleLabel,
    getRoleDescription,
    isLoading,
  };
}
