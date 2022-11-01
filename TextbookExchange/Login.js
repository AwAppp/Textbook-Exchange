import { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
//import {sign_up, log_in} from "./login/Signup.js"

class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Log in:</Text>
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
        <Text>Register:</Text>
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

  render () {
    return (
      <View>
        <LoginInput name="Email:" value={this.state.email} handleText={(text) => {this.setState({email: text})}}/> 
        <LoginInput name="Username:" value={this.state.user} handleText={(text) => {this.setState({user: text})}}/> 
        <LoginInput name="Password:" value={this.state.pass} handleText={(text)  => {this.setState({pass: text})}}/> 
        <LoginInput placeholder="Confirm Password:" value={this.state.confirmPass} handleText={(text)  => {this.setState({confirmPass: text})}}/> 
        <RegisterButton/>
      </View>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: ''
    };
  }

  render () {
    return (
      <View>
        <LoginInput name="Username:" value={this.state.user} handleText={(text) => {this.setState({user: text})}}/> 
        <LoginInput name="Password:" value={this.state.pass} handleText={(text)  => {this.setState({pass: text})}}/> 
        <LoginButton/>
      </View>
    );
  }
}

class LoginInput extends Component {
  render () {
    return (
      <View>
        <Text>{this.props.name}</Text>
        <TextInput value={this.props.value} onChangeText={(text) => this.props.handleText(text)}/>
      </View>
    );
  }
}

class LoginButton extends Component {
  render() {
    return <Button onPress={() => console.log('Login button pressed')} title="Login"/>
  }
}

class RegisterButton extends Component {
  render() {
    return <Button onPress={() => console.log('Register button pressed')} title="Register"/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {Login, Register}