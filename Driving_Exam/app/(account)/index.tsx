import * as AuthSession from 'expo-auth-session';
import { useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession();


const clientId = null;
const tenantId = null

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
};

export default function LoginScreen() {
  const { setAccessToken } = useAuth();
  const router = useRouter();

/*   const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  } as any) as string; */

  const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'drivingexam',  
  path: 'redirect',        // <- must match Azure entry
  useProxy: false
} as any) as string;

  console.log('Redirect URI:', redirectUri);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken;
      if (token) {
        setAccessToken(token);
        router.replace('/(exam)/index');
        console.log('Access Token:', token);
        console.log('Redirecting to exam screen: ', router.replace('/(exam)'));
      }
    }
  }, [response, router, setAccessToken]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login with Microsoft</Text>
      <Button
        title="Login"
        disabled={!request}
        onPress={() => promptAsync({ useProxy: false }as any)}
      />
    </View>
  );
}
