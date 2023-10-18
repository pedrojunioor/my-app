import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/hooks/useAuth';
import Routes from './src/routes/routes';

export default function App() {

  return (
    <AuthProvider>
      <StatusBar style="auto" translucent />
      <Routes />
    </AuthProvider>
  );
}

