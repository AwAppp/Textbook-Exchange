import { StyleSheet, View, Image } from 'react-native';
import PostFeed from './pages/PostFeed.js';
import Header from './components/header.js';
import PostGroup from './components/post.js';
import AddPostPage from './pages/AddPost.js';

export default function App() {
  return (
    <View style={styles.container}>
      <AddPostPage />
    </View>
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
