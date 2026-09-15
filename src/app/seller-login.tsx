import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.0.101:5000';

export default function SellerLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('================================');
    console.log('SELLER LOGIN API:', API_URL);
    console.log('================================');

    if (!email.trim()) {
      Alert.alert(
        'Required',
        'Please enter your email.'
      );
      return;
    }

    if (!password) {
      Alert.alert(
        'Required',
        'Please enter your password.'
      );
      return;
    }

    try {
      const loginUrl =
        `${API_URL}/api/auth/login`;

      console.log(
        'Seller login request:',
        loginUrl
      );

      const response = await fetch(
        loginUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            role: 'seller',
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        'Seller login response:',
        response.status
      );

      if (!response.ok) {
        Alert.alert(
          'Login Failed',
          data.message ||
            'Invalid email or password.'
        );
        return;
      }

      await AsyncStorage.setItem(
        'loggedInUser',
        JSON.stringify(data.user)
      );

      console.log(
        'Seller login successful'
      );

      router.replace(
        '/seller-home'
      );
    } catch (error) {
      console.error(
        'Seller login error:',
        error
      );

      Alert.alert(
        'Connection Error',
        'Unable to connect to the NearBuy server.'
      );
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={() =>
          router.replace('/role')
        }
      >
        <Text style={styles.back}>
          ‹ Back
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>

        <Text style={styles.logo}>
          NearBuy
        </Text>

        <Text style={styles.title}>
          Welcome, Shop Owner 👋
        </Text>

        <Text style={styles.subtitle}>
          Sign in to receive customer
          requests and send offers.
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Shop email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            Sign In
          </Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>

          <Text style={styles.registerText}>
            Don't have a shop account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push(
                '/seller-register'
              )
            }
          >
            <Text style={styles.registerLink}>
              {' '}Register Shop
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    padding: 24,
  },

  back: {
    fontSize: 17,
    color: '#2563EB',
    marginTop: 15,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    marginBottom: 35,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },

  loginButton: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  registerText: {
    color: '#6B7280',
    fontSize: 14,
  },

  registerLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
});