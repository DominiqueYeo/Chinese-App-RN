import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_BACKEND } from 'react-native-dotenv';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Message from './Message.jsx';
import Colors from '../constants/colors.js';
import Input from './Input.jsx';
import CustomButton from './CustomButton.jsx';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    color: 'black',
  },
  container: {
    width: 300,
    maxWidth: '80%',
    height: 150,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
  },
  input: {
    width: '100%',
  },
});

const LogInBox = ({ navigation }) => {
  // State and setter for login details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State and setter for signup and login message
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  console.log(`${REACT_APP_BACKEND}/login`);

  const handleEmailChange = (el) => {
    setEmail(el);
    setMessage('');
  };

  const handlePasswordChange = (el) => {
    setPassword(el);
    setMessage('');
  };

  const loginAttempt = async () => {
    // immediately reject log in if there is a missing field\
    if (!email || !password) {
      setMessage('Please enter an email and password');
      return;
    }
    // wrap email and data in an object for easier manipulation
    const data = {
      email,
      password,
    };
    // verify log in. if not verified, send error messages
    try {
      setLoading(true);
      const response = await axios.post(`${REACT_APP_BACKEND}/user/login`, data);

      setLoading(false);
      // If username or password incorrect, inform player
      if (response.data === 'The email or password is incorrect') {
        setMessage('Invalid login. Please try again.');
        return;
      }
      // If successful, redirect to home page
      if (response.data.success === true) {
        const { userId, token } = response.data;
        console.log('userId: ', userId);
        console.log('token: ', token);
        setEmail('');
        setPassword('');
        setMessage('');
        await AsyncStorage.setItem('@sessionToken', token);
        await AsyncStorage.setItem('@userId', userId);
        navigation.navigate('Home');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (

    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder="Email"
        blurOnSubmit
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleEmailChange}
        value={email}
      />
      <Input
        secureTextEntry
        style={styles.input}
        placeholder="Password"
        blurOnSubmit
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handlePasswordChange}
        value={password}
      />
      {loading
        ? (<ActivityIndicator animating={loading} size="large" color="#00ff00" />)
        : (
          <CustomButton
            style={styles.button}
            title="Log In"
            color={Colors.primary}
            onPress={loginAttempt}
          />
        )}
      <View>{message !== '' && <Message message={message} />}</View>
    </View>

  );
};

LogInBox.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LogInBox;