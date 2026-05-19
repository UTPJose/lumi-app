import { useLocalStorage } from './useLocalStorage';

export function useUserProfile() {
  const [userName, setUserName] = useLocalStorage('userName', 'Usuario');
  const [userAge, setUserAge] = useLocalStorage('userAge', 0);
  const [userInterests, setUserInterests] = useLocalStorage('userInterests', [] as string[]);

  const setName = (name: string): void => {
    setUserName(name);
  };

  const setAge = (age: number): void => {
    setUserAge(age);
  };

  const setInterests = (interests: string[]): void => {
    setUserInterests(interests);
  };

  const addInterest = (interest: string): void => {
    if (!userInterests.includes(interest)) {
      setInterests([...userInterests, interest]);
    }
  };

  const removeInterest = (interest: string): void => {
    setInterests(userInterests.filter(i => i !== interest));
  };

  const toggleInterest = (interest: string): void => {
    if (userInterests.includes(interest)) {
      removeInterest(interest);
    } else {
      addInterest(interest);
    }
  };

  const clearProfile = (): void => {
    setName('Usuario');
    setAge(0);
    setInterests([]);
  };

  return {
    userName,
    userAge,
    userInterests,
    setName,
    setAge,
    setInterests,
    addInterest,
    removeInterest,
    toggleInterest,
    clearProfile,
  };
}
