import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Backend } from './Backend.js'

export default function App() {
  // const user = Backend.sigin('anpgtao@gmail.com', '159357tap.');
  // const uid = Backend.signIn('anpgtao@gmail.com', '159357tap.');

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
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
