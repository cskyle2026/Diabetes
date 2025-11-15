import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Screen } from './types';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { CameraScreen } from './screens/CameraScreen';
import { ResultScreen } from './screens/ResultScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useAppContext();

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Login:
        return <LoginScreen />;
      case Screen.Register:
        return <RegisterScreen />;
      case Screen.ProfileSetup:
        return <ProfileSetupScreen />;
      case Screen.Camera:
        return <CameraScreen />;
      case Screen.Result:
        return <ResultScreen />;
      case Screen.Settings:
        return <SettingsScreen />;
      case Screen.UserProfile:
        return <UserProfileScreen />;
      default:
        return <LoginScreen />;
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-rose-100 via-white to-violet-100 min-h-screen font-sans">
       <div className="transition-opacity duration-500 ease-in-out">
            {renderScreen()}
       </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ScreenRenderer />
    </AppProvider>
  );
};

export default App;