import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useState } from 'react';

const API_URL = 'http://192.168.0.101:5000';

export default function CustomerLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    // Email validation
    if (!trimmedEmail) {
      Alert.alert(
        'Missing Email',
        'Please enter your email.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    // Password validation
    if (!password) {
      Alert.alert(
        'Missing Password',
        'Please enter your password.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
            role: 'customer',
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid email or password.'
        );
        return;
      }

      // Save logged-in customer
      await AsyncStorage.setItem(
        'loggedInUser',
        JSON.stringify(data.user)
      );

      const userId =
        data.user.id ||
        data.user._id;

      if (!userId) {
        Alert.alert(
          'Login Error',
          'User information is incomplete.'
        );
        return;
      }

      // Check saved location
      const savedLocation =
        await AsyncStorage.getItem(
          `customerLocation_${userId}`
        );

      // Customer already has a location
      if (savedLocation) {
        Alert.alert(
          'Welcome Back!',
          `Welcome back, ${data.user.name}!`,
          [
            {
              text: 'Continue',
              onPress: () => {
                router.replace('/customer-home');
              },
            },
          ]
        );

        return;
      }

      // Customer does not have a location
      Alert.alert(
        'Location Required',
        'Please set your location before continuing.',
        [
          {
            text: 'Continue',
            onPress: () => {
              router.replace('/saved-location');
            },
          },
        ]
      );

    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      Alert.alert(
        'Connection Error',
        'Unable to connect to the NearBuy server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={() => router.replace('/role')}
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
          Welcome back 👋
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue shopping locally.
        </Text>

        {/* Email */}

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        {/* Password */}

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
          editable={!loading}
        />

        {/* Login Button */}

        <TouchableOpacity
          style={[
            styles.loginButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.loginText}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Register */}

        <View style={styles.registerRow}>

          <Text style={styles.registerText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push('/customer-register')
            }
            disabled={loading}
          >
            <Text style={styles.registerLink}>
              {' '}Create Account
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
    fontWeight: '600',
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
    color: '#111827',
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

  buttonDisabled: {
    opacity: 0.7,
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