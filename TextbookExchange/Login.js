import { useNavigation } from '@react-navigation/native';
import { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert} from 'react-native';
import Backend from "./Backend.js"

const BackendInstance = new Backend();

function Login (props) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.description}>Log in to an existing account</Text>
      <LoginForm setUid={props.setUid} navigation={navigation}/>
       <Button onPress={() => navigation.navigate('Register')} title="Create Account"/>
    </View>
  )
}

function Register () {
  const navigation = useNavigation();
   return (
    <View style={styles.container}>
      <Text style={styles.description}>Register a new account</Text>
       <RegisterForm navigation={navigation}/>
      <Text style={styles.description}>Have an account?</Text>
       <Button onPress={() => this.props.navigation.navigate('Login')} title="Go back"/>
     </View>
  )
}

//Move this into a different file
function interpretErrorMessage(res) {
  if (res instanceof Error) {
    console.log(res.code);    
    let errorMessage = "";
    switch (res.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email already in use!";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Error: message should not appear"; //Should not happen
        break;
      case "auth/weak-password":
        errorMessage = "Password too weak";
        break;
      case "auth/wrong-password":
        errorMessage = "Wrong password";
        break;
      case "auth/user-not-found":
        errorMessage = "User does not exist";
        break;
      case "auth/user-disabled":
        errorMessage = "Account disabled";
        break;
      default:
        errorMessage = "An error has occured";
    }
    return errorMessage;
  }
  else if (res['error_message']) {
    return res['error_message'];
  }
  else {
    return null;
  }
}


class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      user: '',
      pass: '',
      confirmPass: ''
    };
  }

  async attemptCreateUser() {
    console.log('Register button pressed');
    let uid = null;
    let errorMessage = null;
    if (this.state. email === '' || this.state.user === '' || this.state.pass === '') {
      errorMessage = 'All fields must be nonempty';
    } 
    else if (this.state.pass !== this.state.confirmPass) {
      errorMessage = 'Non-matching passwords';
    }
    else {
      uid = await BackendInstance.signUp(this.state.email, this.state.pass);
      if (uid instanceof Error) {
        errorMessage = interpretErrorMessage(uid);
      }
      else {
        //Add username field to user's info
        let userInfo = await BackendInstance.getUserInfo(this.state.email, this.state.pass);
        //probably best if userInfo is of type error instead
        if (interpretErrorMessage(userInfo)) {  
          errorMessage = interpretErrorMessage(uid); 
        }
        else {
          userInfo['username'] = this.state.user;
          uid = await BackendInstance.updateUser(userInfo);
          if (uid instanceof Error) {
            errorMessage = interpretErrorMessage(uid);
          }
          this.props.navigation.navigate('Login');
        }
      }
    }
    if (errorMessage) {
      Alert.alert(
        "Registration failed",
        errorMessage,
      ); 
    }
  }

  render () {
    return (
      <View style={styles.align}>
        <LoginInput name="Email" value={this.state.email} handleText={(text) => {this.setState({email: text})}}/> 
        <LoginInput name="Username" value={this.state.user} handleText={(text) => {this.setState({user: text})}}/> 
        <LoginInput name="Password" value={this.state.pass} handleText={(text)  => {this.setState({pass: text})}} secure={true}/> 
        <LoginInput name="Confirm Password" value={this.state.confirmPass} handleText={(text)  => {this.setState({confirmPass: text})}} secure={true}/> 
        <Button onPress={async () => await this.attemptCreateUser()} title="Register"/>
      </View>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: ''
    };
  }

  async attemptLogin() {
    console.log('Login button pressed');
    let errorMessage = null;
    if (this.state.email == '' || this.state.pass === '') {
      errorMessage = 'All fields must be nonempty';
    }
    else {
      let uid = await BackendInstance.signIn(this.state.email, this.state.pass);
      if (uid instanceof Error) {
        console.log(uid.message);
        errorMessage = interpretErrorMessage(uid);
      }
      else {
        this.props.setUid(uid);
        this.props.navigation.navigate('Home');
      }
    }
    if (errorMessage) {
      Alert.alert(
        "Login failed",
        errorMessage,
      ); 
    }    
  }

  render () {
    return (
      <View style={styles.align}>
        <LoginInput name="Email" value={this.state.email} handleText={(text) => {this.setState({email: text})}}/> 
        <LoginInput name="Password" value={this.state.pass} handleText={(text)  => {this.setState({pass: text})}} secure={true}/> 
        <Button onPress={async () => await this.attemptLogin()} title="Login"/>
      </View>
    );
  }
}

class LoginInput extends Component {
  render () {
    return (
      <View style={styles.align}>
        <TextInput style={styles.input} placeholder={this.props.name} value={this.props.value} onChangeText={(text) => this.props.handleText(text)} secureTextEntry={this.props.secure}/>
      </View>
    );
  }
}

//temporary
//make interior of inputs different color than background
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8fb4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  align: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    textAlign: 'center',
    paddingVertical: 1,
    paddingHorizontal: 6,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#000000',
    margin: 2,
    color: 'black',
    width: 150,
  },
  description: {
    textAlign: 'center',
    fontSize: 30,
    margin: 2,
  },
  button: {
    fontSize: 18,
    backgroundColor: '#2f73fa',
    margin: 2,
    borderRadius: 4,
    borderWidth: 1,
    width: 200,
  },
  text: {
    textAlign: 'center',
    paddingVertical: 1,
    paddingHorizontal: 6,
    fontSize: 18,
    color: '#e6e6e6',
  }
});

function Button(props) {
  const { onPress, title } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

export {Login, Register}