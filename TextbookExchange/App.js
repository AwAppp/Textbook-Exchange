import { StyleSheet, View, Image } from 'react-native';
import PostGroup from "./components/post.js";
import Header from './components/header.js';
import {Login, Register} from './Login.js';
import UserProfile from './pages/UserProfile.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Post" children={() => 
          <View>
            <Header/>
            <PostGroup/>
          </View>}/>
        <Tab.Screen name="Profile" component={UserProfile}/>
        <Tab.Screen name="Login" component={Login}/>
        <Tab.Screen name="Register" component={Register}/>
      </Tab.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2774AE',
    justifyContent: 'center',
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
});
