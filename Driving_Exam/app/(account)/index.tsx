import * as AuthSession from 'expo-auth-session';
import { useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession();

//Need to be replaced!!
const clientId = null;
const tenantId = null;

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
};

export default function AccountScreen() {
  const router = useRouter();
  const {
    user,
    setAccessToken,
    setUser,
    logout,
    loading 
  } = useAuth();

/*   const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  } as any) as string; */

  const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'drivingexam',  
  path: 'redirect',        
  useProxy: false
} as any) as string;

  console.log('Redirect URI:', redirectUri);

 const [request, response, promptAsync] = useAuthRequest(
  {
    clientId,
    scopes: [
      'openid',
      'profile',
      'email',
      'https://graph.microsoft.com/User.Read', 
    ],
    redirectUri,                              // drivingexam://redirect
     extraParams: {
      prompt: 'select_account', // <-- this makes Microsoft ask which account to use
    },
    responseType: AuthSession.ResponseType.Token,   
  },
  discovery
);

  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const res  = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data?.displayName) {
        await setUser({
          name:  data.displayName,
          email: data.mail || data.userPrincipalName,
        });
        console.log('Current user:', data.displayName);
        // stay on /account (no need to navigate)
      } else {
        console.warn('User data missing', data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }, [setUser]);


  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken;
      if (token) {
        setAccessToken(token);
        fetchUserProfile(token);
        router.replace('/(account)');
      }
      console.log('AccountScreen loaded');
      console.log('AccountScreen render:', { user });

    }
  }, [response, setAccessToken, fetchUserProfile, user, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>
        {user ? `Welcome, ${user.name}!` : 'Welcome!'}
      </Text>
      {user && (
        <Text style={{ fontSize: 16, marginBottom: 30 }}>{user.email}</Text>
      )}

      {!user && (
        <Button
          title="Login with Microsoft"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      )}

      {user && (
        <>
          <Button
            title="My Exams"
            onPress={() => router.push('/(account)/my-exams')}
          />

          <View style={{ height: 20 }} />

          <Button
            title="Logout"
            color="red"
            onPress={() => {
              logout();
              router.replace('/(account)');
            }}
          />
        </>
      )}
    </View>
  );
}