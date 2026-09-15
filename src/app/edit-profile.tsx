import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
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

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Load current customer information
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(
          'loggedInUser'
        );

        if (!savedUser) {
          Alert.alert(
            'Login Required',
            'Please login again.'
          );

          router.replace('/customer-login');
          return;
        }

        const user = JSON.parse(savedUser);

        setUserId(user.id || '');
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');

        // Load customer location
        if (user.id) {
          const savedLocation =
            await AsyncStorage.getItem(
              `customerLocation_${user.id}`
            );

          if (savedLocation) {
            setLocation(savedLocation);
          }
        }
      } catch (error) {
        console.error(
          'Error loading profile:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to load your profile.'
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const saveChanges = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanLocation = location.trim();

    // Name validation
    if (!cleanName) {
      Alert.alert(
        'Invalid Name',
        'Please enter your name.'
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        'Invalid Name',
        'Name must contain at least 2 characters.'
      );
      return;
    }

    if (!/^[A-Za-z ]+$/.test(cleanName)) {
      Alert.alert(
        'Invalid Name',
        'Name can contain only letters and spaces.'
      );
      return;
    }

    // Email validation
    if (!cleanEmail) {
      Alert.alert(
        'Invalid Email',
        'Please enter your email.'
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    // Phone validation
    const cleanPhoneDigits =
      cleanPhone.replace(/\D/g, '');

    if (!cleanPhone) {
      Alert.alert(
        'Invalid Phone',
        'Please enter your phone number.'
      );
      return;
    }

    if (cleanPhoneDigits.length !== 10) {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid 10-digit phone number.'
      );
      return;
    }

    // Location validation
    if (!cleanLocation) {
      Alert.alert(
        'Invalid Location',
        'Please enter your location.'
      );
      return;
    }

    if (!userId) {
      Alert.alert(
        'Error',
        'Customer ID not found. Please login again.'
      );
      return;
    }

    setLoading(true);

    try {
      // Update customer in MongoDB
      const response = await fetch(
        `http://192.168.0.101:5000/api/auth/customer/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhoneDigits,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Update Failed',
          data.message ||
            'Unable to update your profile.'
        );
        return;
      }

      // Save updated user locally
      await AsyncStorage.setItem(
        'loggedInUser',
        JSON.stringify(data.user)
      );

      // Save customer location locally
      await AsyncStorage.setItem(
        `customerLocation_${userId}`,
        cleanLocation
      );

      Alert.alert(
        'Profile Updated!',
        'Your profile has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        'Profile update error:',
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

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Back Button */}

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        disabled={loading}
      >
        <Text style={styles.backText}>
          ‹ Back
        </Text>
      </TouchableOpacity>

      {/* Header */}

      <Text style={styles.logo}>
        NearBuy
      </Text>

      <Text style={styles.title}>
        Edit Profile
      </Text>

      <Text style={styles.subtitle}>
        Update your personal information.
      </Text>

      {/* Form */}

      <View style={styles.card}>
        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#9CA3AF"
          editable={!loading}
        />

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          editable={!loading}
        />

        <Text style={styles.label}>
          Location
        </Text>

        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
          placeholderTextColor="#9CA3AF"
          editable={!loading}
        />
      </View>

      {/* Save Button */}

      <TouchableOpacity
        style={[
          styles.saveButton,
          loading && styles.disabledButton,
        ]}
        onPress={saveChanges}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>
            Save Changes
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        Your updated information will be used for your
        NearBuy profile.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 15,
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
    fontSize: 22,
    fontWeight: '800',
    color: '#2563EB',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginTop: 25,
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 6,
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
    marginBottom: 16,
  },

  saveButton: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  note: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 15,
  },
});