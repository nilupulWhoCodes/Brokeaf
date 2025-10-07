import React, { createContext, ReactNode, useContext, useState } from 'react';

type TabBarVisibilityContextType = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const TabBarVisibilityContext = createContext<
  TabBarVisibilityContextType | undefined
>(undefined);

export const TabBarVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <TabBarVisibilityContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => {
  const context = useContext(TabBarVisibilityContext);
  if (!context) {
    throw new Error(
      'useTabBarVisibility must be used within TabBarVisibilityProvider'
    );
  }
  return context;
};
