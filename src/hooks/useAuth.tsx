import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type ContextProps = {
  children: ReactNode
}

interface UserInfo {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  providerId?: string;
  tenantId?: string;
  uid?: string;
}

type ContextValues = {
  loading?: boolean,
  authenticated?: boolean,
  initializing?: boolean
  user?: UserInfo
  handleLogin?: (email: string, password: string) => Promise<void>
  handleLogout?: () => Promise<void>
  handleCreateNewUser?: (name: string, email: string, password: string) => Promise<void>
}


const AuthContext = createContext<ContextValues>({})

const AuthProvider = ({ children }: ContextProps) => {

  const [authenticated] = useState(false)
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<UserInfo>();

  const refUser = firestore().collection('users');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  async function handleLogin(email: string, password: string) {
    await auth().signInWithEmailAndPassword(email, password)
      .then(() => console.log('User signed!'))
      .catch((error) => {
        Alert.alert(error.message)
      })
  }

  async function handleLogout() {
    setLoading(true)
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  async function handleCreateNewUser(name: string, email: string, password: string) {
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        await res.user.updateProfile({
          displayName: name
        })
        await refUser.add({
          name,
          email,
        });
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      }).finally(() => {

      })
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={{
      loading,
      authenticated,
      initializing,
      user,
      handleLogin,
      handleLogout,
      handleCreateNewUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthentication must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth, AuthContext }
