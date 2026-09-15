import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'https://nearbuy-backend-gzbq.onrender.com';

export default function CustomerRegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    // Name validation
    if (!trimmedName) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }

    if (!/^[A-Za-z ]{2,}$/.test(trimmedName)) {
      Alert.alert(
        'Invalid Name',
        'Name should contain only letters and spaces.'
      );
      return;
    }

    // Email validation
    if (!trimmedEmail) {
      Alert.alert('Required', 'Please enter your email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(trimmedPhone)) {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid 10-digit phone number.'
      );
      return;
    }

    // Password validation
    if (password.length < 8) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Password and confirm password do not match.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            password,
            role: 'customer',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Registration Failed',
          data.message || 'Unable to create your account.'
        );
        return;
      }

      // Save the newly registered user
      if (data.user) {
        await AsyncStorage.setItem(
          'loggedInUser',
          JSON.stringify(data.user)
        );
      }

      // Mark this as a newly registered customer
      await AsyncStorage.setItem(
        'isNewUser',
        'true'
      );

      const newUserId =
        data.user?.id ||
        data.user?._id;

      if (!newUserId) {
        Alert.alert(
          'Registration Error',
          'Account was created, but the user ID was not returned.'
        );
        return;
      }

      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => {
              router.replace({
                pathname: '/saved-location',
                params: {
                  userId: String(newUserId),
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);

      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Make sure your backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>NearBuy</Text>

        <Text style={styles.title}>
          Create Customer Account
        </Text>

        <Text style={styles.subtitle}>
          Create your account to discover nearby shops and post product requests.
        </Text>

        {/* Name */}
        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          editable={!loading}
          autoCapitalize="words"
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter 10-digit phone number"
          placeholderTextColor="#9CA3AF"
          value={phone}
          onChangeText={(text) =>
            setPhone(text.replace(/\D/g, '').slice(0, 10))
          }
          editable={!loading}
          keyboardType="phone-pad"
          maxLength={10}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Minimum 8 characters"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          secureTextEntry
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Re-enter your password"
          placeholderTextColor="#9CA3AF"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
          secureTextEntry
        />

        {/* Register */}
        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Register
            </Text>
          )}
        </TouchableOpacity>

        {/* Login */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/customer-login')}
            disabled={loading}
          >
            <Text style={styles.loginLink}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  back: {
    fontSize: 17,
    color: '#2563EB',
    marginTop: 15,
    marginBottom: 30,
    fontWeight: '600',
  },

  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 25,
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
    marginBottom: 28,
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
    marginBottom: 18,
  },

  button: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginText: {
    fontSize: 15,
    color: '#6B7280',
  },

  loginLink: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '700',
    marginLeft: 5,
  },
});