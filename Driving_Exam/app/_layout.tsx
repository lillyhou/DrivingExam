import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';


export default function RootLayout() {
 return (
   <AuthProvider>
    <Tabs initialRouteName="(account)">
        <Tabs.Screen 
        name="(account)" 
        options={{ 
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="(modules)" 
        options={{ 
          title: 'Modules',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }} 
      />
      <Tabs.Screen
        name="(exam)"
        options={{
          title: 'Exam Simulation',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" color={color} size={size} />
          ),
        }}
      />
    
    </Tabs>
      </AuthProvider>
  );

}
