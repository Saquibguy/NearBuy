import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.0.101:5000';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Required', 'Please enter your current password.');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Required', 'Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Invalid Password',
        'New password must be at least 6 characters.'
      );
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert(
        'Required',
        'Please confirm your new password.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'New password and confirm password do not match.'
      );
      return;
    }

    try {
      setLoading(true);

      const userData =
        await AsyncStorage.getItem('loggedInUser');

      if (!userData) {
        router.replace('/customer-login');
        return;
      }

      const user = JSON.parse(userData);

      const userId = user.id || user._id;

      if (!userId) {
        Alert.alert(
          'Error',
          'Unable to identify your account.'
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Unable to Change Password',
          data.message || 'Something went wrong.'
        );
        return;
      }

      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Change password error:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back */}

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>NearBuy</Text>

      <Text style={styles.title}>
        Change Password
      </Text>

      <Text style={styles.subtitle}>
        Enter your current password and choose a new
        password for your account.
      </Text>

      {/* Current Password */}

      <Text style={styles.label}>
        Current Password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter current password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      {/* New Password */}

      <Text style={styles.label}>
        New Password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Confirm Password */}

      <Text style={styles.label}>
        Confirm New Password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Change Password Button */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Change Password
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
  },

  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },

  backText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: '600',
  },

  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
    marginBottom: 18,
  },

  button: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});