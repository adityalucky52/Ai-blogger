import useAuthStore from "../store/authStore";

export const useAuth = () => {
  const { 
    user, 
    login, 
    register, 
    adminRegister,
    logout, 
    isAuthenticated, 
    isLoading, 
    error, 
    clearError, 
    updateProfile, 
    updateAvatar 
  } = useAuthStore();
  
  return { 
    user, 
    login, 
    register, 
    adminRegister,
    logout, 
    isAuthenticated, 
    isLoading, 
    error, 
    clearError, 
    updateProfile, 
    updateAvatar 
  };
};
