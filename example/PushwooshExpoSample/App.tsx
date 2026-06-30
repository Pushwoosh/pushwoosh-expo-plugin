import { useEffect, useState } from 'react';
import { DeviceEventEmitter, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Pushwoosh from 'pushwoosh-react-native-plugin';

// 1. Replace with your Pushwoosh Application Code (Pushwoosh control panel → your app → Settings).
//    Format looks like "XXXXX-XXXXX".
// 2. Android delivery needs a google-services.json wired via app.json (see README) — the FCM
//    Sender ID is read from there, so you do NOT pass project_number to init on current SDKs.
const PW_APP_CODE: string = 'YOUR_PUSHWOOSH_APP_CODE';

export default function App() {
  const [status, setStatus] = useState('initializing…');
  const [pushToken, setPushToken] = useState('—');
  const [hwid, setHwid] = useState('—');
  const [lastPush, setLastPush] = useState('— (none yet)');

  useEffect(() => {
    if (PW_APP_CODE === 'YOUR_PUSHWOOSH_APP_CODE') {
      setStatus('⚠️ set PW_APP_CODE in App.tsx to your Pushwoosh Application Code');
      return;
    }

    Pushwoosh.init(
      { pw_appid: PW_APP_CODE },
      () => {
        setStatus('init ok → registering…');
        // HWID is assigned at init and is independent of push registration, so fetch it here —
        // this way it still shows when registration can't succeed (iOS Simulator, emulator w/o FCM).
        Pushwoosh.getHwid((id: string) => setHwid(String(id)));
      },
      (error: unknown) => setStatus('init failed: ' + JSON.stringify(error)),
    );

    Pushwoosh.register(
      (token: string) => {
        setPushToken(String(token));
        setStatus('registered ✅');
      },
      (error: unknown) => setStatus('register failed: ' + JSON.stringify(error)),
    );

    // Foreground push events. (Use the same listeners to react to taps / received pushes.)
    const received = DeviceEventEmitter.addListener('pushReceived', (push: unknown) =>
      setLastPush('received: ' + JSON.stringify(push)),
    );
    const opened = DeviceEventEmitter.addListener('pushOpened', (push: unknown) =>
      setLastPush('opened: ' + JSON.stringify(push)),
    );
    return () => {
      received.remove();
      opened.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Pushwoosh Expo Sample</Text>
      <Text style={styles.appId}>app code: {PW_APP_CODE}</Text>
      <Text style={styles.status}>{status}</Text>
      <ScrollView style={styles.box} contentContainerStyle={styles.boxInner}>
        <Text style={styles.key}>HWID</Text>
        <Text style={styles.mono}>{hwid}</Text>
        <Text style={styles.key}>Push token</Text>
        <Text style={styles.mono}>{pushToken}</Text>
        <Text style={styles.key}>Last push</Text>
        <Text style={styles.mono}>{lastPush}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 64, paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  appId: { fontSize: 13, color: '#666', marginBottom: 12 },
  status: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  box: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 24 },
  boxInner: { padding: 12 },
  key: { fontSize: 12, fontWeight: '700', color: '#999', marginTop: 10 },
  mono: { fontFamily: 'Courier', fontSize: 12 },
});
