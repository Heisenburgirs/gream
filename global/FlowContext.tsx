import { createContext, useContext, useState, ReactNode } from 'react';

interface FlowContextType {
  createFlow: boolean;
  toggleCreateFlow: () => void;
  updateFlow: boolean;
  toggleUpdateFlow: () => void;
  deleteFlow: boolean;
  toggleDeleteFlow: () => void;
}

const defaultFlowContext: FlowContextType = {
  createFlow: false,
  toggleCreateFlow: () => {},
  updateFlow: false,
  toggleUpdateFlow: () => {},
  deleteFlow: false,
  toggleDeleteFlow: () => {},
};

export const FlowProvider = createContext<FlowContextType>(defaultFlowContext);

export const useFlowContext = () => {
  return useContext(FlowProvider);
};

export const FlowProviderComponent = ({ children }: { children: ReactNode }) => {
  const [createFlow, setCreateFlow] = useState(false);
  const [updateFlow, setUpdateFlow] = useState(false);
  const [deleteFlow, setDeleteFlow] = useState(false);

  const toggleCreateFlow = () => {
    setCreateFlow((prevState) => !prevState);
  };

  const toggleUpdateFlow = () => {
    setUpdateFlow((prevState) => !prevState);
  };

  const toggleDeleteFlow = () => {
    setDeleteFlow((prevState) => !prevState);
  };

  return (
    <FlowProvider.Provider
      value={{
        createFlow,
        toggleCreateFlow,
        updateFlow,
        toggleUpdateFlow,
        deleteFlow,
        toggleDeleteFlow,
      }}
    >
      {children}
    </FlowProvider.Provider>
  );
};

export default FlowProvider;
