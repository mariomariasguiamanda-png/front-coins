export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const user = localStorage.getItem("user");
  return !!(user && user !== "undefined");
};
