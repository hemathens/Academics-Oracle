import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { LoginCredentials, RegisterData } from '@/types/auth';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isStudent: boolean;
  isTeacher: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'course_tracker_auth';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    // Load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  // Load users from localStorage (for demo purposes)
  const getStoredUsers = (): Array<{ user: User; password: string }> => {
    const stored = localStorage.getItem('course_tracker_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };

  const saveUser = (userData: User) => {
    setUserState(userData);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Check stored users
    const storedUsers = getStoredUsers();
    const foundUser = storedUsers.find(
      (u) => u.user.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      saveUser(foundUser.user);
      return true;
    }

    // For demo: allow any email/password combination (first login creates account)
    // In production, this would call an API
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Check if user already exists
    const storedUsers = getStoredUsers();
    const exists = storedUsers.some((u) => u.user.email === data.email);

    if (exists) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      university: data.university,
      department: data.department,
    };

    // Store user with password
    const updatedUsers = [...storedUsers, { user: newUser, password: data.password }];
    localStorage.setItem('course_tracker_users', JSON.stringify(updatedUsers));

    // Auto-login after registration
    saveUser(newUser);
    return true;
  };

  const logout = () => {
    setUserState(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    // Save to localStorage whenever user changes
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        isStudent: user?.role === 'student' || false,
        isTeacher: user?.role === 'teacher' || false,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

