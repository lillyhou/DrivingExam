
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountIndexScreen() {
  const router = useRouter();
  const { activeUser, actions } = useAuth();

  return (
    <View>
      {activeUser ? (
        <>
          <Text>Welcome {activeUser}</Text>
          <Button title="Logout" onPress={() => actions.logout()} />
        </>
      ) : (
        <Button
          title="Login with Microsoft"
          onPress={() => router.push('/(account)/AuthWebView')}
        />
      )}
    </View>
  );
}
