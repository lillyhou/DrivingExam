import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthWebView() {
  const router = useRouter();
  const { actions } = useAuth();

  const backendUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const successRedirect = 'https://auth.success.local/';
  const loginUrl = `${backendUrl}/oauth/login?redirectUri=${encodeURIComponent(successRedirect)}`;

  const handleNavigationStateChange = async (navState: any) => {
    console.log('[WebView] Navigation URL:', navState.url);

    if (navState.url.startsWith(successRedirect)) {
      console.log('[WebView] Detected success redirect. Closing WebView and fetching user info...');
      router.back(); // close WebView and go back to account tab

      try {
        const url = `${backendUrl}/oauth/me`;
        console.log('[WebView] Fetching user info from:', url);

        const res = await fetch(url, {
          credentials: 'include',
        });
        const data = await res.json();

        console.log('[WebView] /oauth/me response:', data);

        if (res.ok && data?.username) {
          actions.setActiveUser(data.username);
          console.log('[WebView] User set:', data.username);
        } else {
          console.warn('[WebView] Failed to get valid user data');
        }
      } catch (err) {
        console.error('[WebView] Error fetching /me:', err);
      }
    }
  };

  return (
    <WebView
      source={{ uri: loginUrl }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      onLoadStart={(e) => console.log('[WebView] Load start:', e.nativeEvent.url)}
      onLoadEnd={(e) => console.log('[WebView] Load end:', e.nativeEvent.url)}
      onError={(e) => console.error('[WebView] Load error:', e.nativeEvent)}
    />
  );
}
