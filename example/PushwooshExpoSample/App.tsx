import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Pushwoosh from 'pushwoosh-react-native-plugin';

export default function App() {

  Pushwoosh.init({ "pw_appid": "A8B44-0B460", "project_number": "245850018966" });
  Pushwoosh.register();

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
