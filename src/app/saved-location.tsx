import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SavedLocationScreen() {
  const { userId } =
    useLocalSearchParams<{ userId?: string }>();

  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      // New user coming from registration
      if (userId) {
        const savedLocation =
          await AsyncStorage.getItem(
            `customerLocation_${userId}`
          );

        if (savedLocation) {
          setLocation(savedLocation);
        }

        return;
      }

      // Existing logged-in customer
      const userData =
        await AsyncStorage.getItem(
          'loggedInUser'
        );

      if (!userData) {
        router.replace('/customer-login');
        return;
      }

      const user = JSON.parse(userData);

      setExistingUser(user);

      const currentUserId =
        user.id || user._id;

      if (!currentUserId) {
        router.replace('/customer-login');
        return;
      }

      const savedLocation =
        await AsyncStorage.getItem(
          `customerLocation_${currentUserId}`
        );

      if (savedLocation) {
        setLocation(savedLocation);
      }
    } catch (error) {
      console.error(
        'Load location error:',
        error
      );
    }
  };

  const handleSaveLocation = async () => {
    const trimmedLocation =
      location.trim();

    if (!trimmedLocation) {
      Alert.alert(
        'Location Required',
        'Please enter your location.'
      );
      return;
    }

    let targetUserId = userId;

    if (!targetUserId && existingUser) {
      targetUserId =
        existingUser.id ||
        existingUser._id;
    }

    if (!targetUserId) {
      Alert.alert(
        'Session Error',
        'Unable to identify your account. Please log in again.'
      );

      router.replace('/customer-login');
      return;
    }

    try {
      setSaving(true);

      await AsyncStorage.setItem(
        `customerLocation_${targetUserId}`,
        trimmedLocation
      );

      Alert.alert(
        'Location Saved',
        'Your location has been saved successfully.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // IMPORTANT:
              // New registration must go to login
              if (userId) {
                router.replace('/customer-login');
                return;
              }

              // Existing logged-in customer
              router.replace('/customer-home');
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        'Save location error:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to save your location.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <TouchableOpacity
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.back}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.logo}>
          NearBuy
        </Text>

        <Text style={styles.title}>
          Set Your Location
        </Text>

        <Text style={styles.subtitle}>
          Enter your area or locality to help
          us find nearby shops for you.
        </Text>

        <Text style={styles.label}>
          Location
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Bhiwandi, Maharashtra"
          placeholderTextColor="#9CA3AF"
          value={location}
          onChangeText={setLocation}
          editable={!saving}
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={[
            styles.button,
            saving && styles.buttonDisabled,
          ]}
          onPress={handleSaveLocation}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.buttonText}>
              Save Location
            </Text>
          )}
        </TouchableOpacity>

      </View>
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
    marginBottom: 30,
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
  },

  button: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});