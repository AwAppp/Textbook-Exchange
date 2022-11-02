import { StyleSheet, View, Image } from 'react-native';
import PostGroup from './components/post.js';


export default function App() {
  return (
    <View style={styles.container}>
      <PostGroup />
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

/*
<Card>
          <Card.Title>Physics for Nerds</Card.Title>
          <Card.Divider />
          <Card.Image
            style={{ padding: 1 }}
            source= {require('./assets/pictures/IMG_8519.jpg')}
          />
          <Text style={{ marginBottom: 10 }}>
            The idea with React Native Elements is more about component
            structure than actual design.
          </Text>
          <Button
            icon={
              <Icon
                name="code"
                color="#ffffff"
                iconStyle={{ marginRight: 10 }}
              />
            }
            buttonStyle={{
              borderRadius: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
            }}
            title="VIEW NOW"
          />
      </Card>
*/