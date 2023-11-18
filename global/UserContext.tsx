import { createContext, useContext, useState, ReactNode  } from 'react';

interface UserInfo {
  name: string;
  profileImage: string;
  typeOfLogin: string;
}

interface UserContextType {
  userAddress: string | null;
  setUserAddress: React.Dispatch<React.SetStateAction<string | null>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  RUDAddress: string | null;
  setRUDAddress: React.Dispatch<React.SetStateAction<string | null>>;
  buttonName: string | null;
  setButtonName: React.Dispatch<React.SetStateAction<string | null>>;
}

// Provide the default values for the context
const defaultUserContext: UserContextType = {
  userAddress: null,
  setUserAddress: () => {},
  userInfo: null,
  setUserInfo: () => {},
  RUDAddress: null,
  setRUDAddress: () => {},
  buttonName: null,
  setButtonName: () => {},
};

export const UserProvider = createContext<UserContextType>(defaultUserContext);

export const useUserContext = () => {
  return useContext(UserProvider);
};

export const UserProviderComponent = ({ children }: { children: ReactNode }) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [RUDAddress, setRUDAddress] = useState<string | null>(null);
  const [buttonName, setButtonName] = useState<string | null>(null);

  return (
    <UserProvider.Provider
      value={{
        userAddress,
        setUserAddress,
        userInfo,
        setUserInfo,
        RUDAddress,
        setRUDAddress,
        buttonName,
        setButtonName,
      }}
    >
      {children}
    </UserProvider.Provider>
  );
};

export default UserProvider;
