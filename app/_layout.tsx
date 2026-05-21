import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: Colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.primary,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="generate" options={{ title: 'Create Portrait' }} />
        <Stack.Screen name="result" options={{ title: 'Your Portrait' }} />
        <Stack.Screen name="history" options={{ title: 'History' }} />
        <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
      </Stack>
    </>
  );
}
