import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function CustomerProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState('Not set');

  const loadProfile = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('loggedInUser');

      if (!savedUser) {
        router.replace('/customer-login');
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      // Load location specifically for this customer
      if (parsedUser.id) {
        const savedLocation = await AsyncStorage.getItem(
          `customerLocation_${parsedUser.id}`
        );

        if (savedLocation) {
          setLocation(savedLocation);
        } else {
          setLocation('Not set');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);

      Alert.alert(
        'Error',
        'Unable to load your profile.'
      );
    }
  };

  // Reload profile whenever this screen becomes active
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const userName = user?.name || 'Customer';
  const userEmail = user?.email || 'customer@example.com';
  const userPhone = user?.phone || '+91 98765 43210';

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');

      router.replace('/role');
    } catch (error) {
      console.error('Logout error:', error);

      Alert.alert(
        'Error',
        'Unable to logout. Please try again.'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Back */}

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>NearBuy</Text>

      <Text style={styles.title}>My Profile</Text>

      {/* Profile Header */}

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {userName}
          </Text>

          <Text style={styles.email}>
            {userEmail}
          </Text>

          <Text style={styles.phone}>
            {userPhone}
          </Text>
        </View>
      </View>

      {/* Personal Information */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          PERSONAL INFORMATION
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>
            {userName}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>
            {userEmail}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>
            {userPhone}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>
            {location}
          </Text>
        </View>
      </View>

      {/* Account */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          ACCOUNT
        </Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/edit-profile')}
        >
          <Text style={styles.menuText}>
            ✏️ Edit Profile
          </Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/my-requests')}
        >
          <Text style={styles.menuText}>
            📋 My Requests
          </Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/saved-location')}
        >
          <Text style={styles.menuText}>
            📍 Saved Location
          </Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
  style={styles.menuItem}
  onPress={() => router.push('/change-password')}
>
  <Text style={styles.menuText}>
    🔐 Change Password
  </Text>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>

      {/* Logout */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>
        NearBuy v1.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 24,
    paddingBottom: 40,
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
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 3,
  },

  phone: {
    fontSize: 14,
    color: '#6B7280',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  label: {
    fontSize: 14,
    color: '#6B7280',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    maxWidth: '60%',
    textAlign: 'right',
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  menuText: {
    fontSize: 16,
    color: '#111827',
  },

  arrow: {
    fontSize: 25,
    color: '#9CA3AF',
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },

  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 24,
  },
});