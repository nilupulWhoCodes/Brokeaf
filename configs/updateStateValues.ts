export const updateStateValue = <T, K extends keyof T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  key: K,
  value: T[K]
) => {
  setState((prevState) => ({
    ...prevState,
    [key]: value,
  }));
};
