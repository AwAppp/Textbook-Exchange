import { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import Backend from "./Backend.js"

const BackendInstance = new Backend();

class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Log in to an existing account</Text>
        <LoginForm/>
        <Button onPress={() => this.props.navigation.navigate('Register')} title="Create Account"/>
      </View>
    )
  } 
}

class Register extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Register a new account</Text>
        <RegisterForm/>
      </View>
    )
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
    if (this.state.pass === this.state.confirmPass) {
      console.log('matching passwords');
      let uid = await BackendInstance.signUp(this.state.email, this.state.pass);
      console.log(uid);
      if (uid) {
        //success
        //this.props.navigation.navigate(...);
        //navigate to home page or login screen
      }
      else {
        //uid is null
        //Display error message
        //ASK FOR ERROR MESSAGE FROM BACKEND! IMPORTANT!
      }
    }
    else {
      //display error message: Non-matching passwords
    }
  }

  render () {
    return (
      <View>
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
    let uid = await BackendInstance.signIn(this.props.email, this.props.pass);
    if (uid) {
      //success
      //this.props.navigation.navigate(...);
      //navigate to home page
    }
    else {
      //uid is null
      //display error message
    }
  }

  render () {
    return (
      <View>
        <LoginInput name="Email" value={this.state.email} handleText={(text) => {this.setState({email: text})}}/> 
        <LoginInput name="Password" value={this.state.pass} handleText={(text)  => {this.setState({pass: text})}} secure={true}/> 
        <Button onPress={() => console.log('Login button pressed')} title="Login"/>
      </View>
    );
  }
}

class LoginInput extends Component {
  render () {
    return (
      <View>
        <TextInput style={styles.input} placeholder={this.props.name} value={this.props.value} onChangeText={(text) => this.props.handleText(text)} secureTextEntry={this.props.secure}/>
      </View>
    );
  }
}

//make your stylesheet actually do stuff lol
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8fb4ff',
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