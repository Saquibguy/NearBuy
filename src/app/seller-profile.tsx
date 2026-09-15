import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SellerProfileScreen() {
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    const loadSeller = async () => {
      try {
        const userData = await AsyncStorage.getItem('loggedInUser');

        if (userData) {
          setSeller(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load seller profile:', error);
      }
    };

    loadSeller();
  }, []);

  const shopLocation = seller
    ? `${seller.area || ''}${
        seller.area && seller.city ? ', ' : ''
      }${seller.city || ''}${
        seller.pincode ? ` - ${seller.pincode}` : ''
      }`
    : 'Not available';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>NearBuy</Text>
      <Text style={styles.title}>Shop Profile</Text>

      {/* Shop Header */}
      <View style={styles.profileCard}>
        <View style={styles.shopIcon}>
          <Text style={styles.shopIconText}>🏪</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.shopName}>
            {seller?.shopName || 'Shop Name'}
          </Text>

          <Text style={styles.category}>
            {seller?.category || 'Category'}
          </Text>

          <Text style={styles.rating}>
            ★ {seller?.rating ?? 0} • {seller?.reviewCount ?? 0} reviews
          </Text>
        </View>
      </View>

      {/* Shop Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>SHOP INFORMATION</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Shop Name</Text>
          <Text style={styles.value}>
            {seller?.shopName || 'Not available'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>
            {seller?.category || 'Not available'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>
            {seller?.phone || 'Not available'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>
            {shopLocation}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>
            {seller?.address || 'Not available'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Opening Hours</Text>
          <Text style={styles.value}>
            {seller?.openingHours || 'Not available'}
          </Text>
        </View>
      </View>

      {/* Shop Management */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>SHOP MANAGEMENT</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/edit-shop-details')}
        >
          <Text style={styles.menuText}>
            ✏️ Edit Shop Details
          </Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/shop-location')}
        >
          <Text style={styles.menuText}>
            📍 Shop Location
          </Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/my-offers')}
        >
          <Text style={styles.menuText}>
            💰 My Offers
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
        onPress={() => router.replace('/role')}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>NearBuy v1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
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
    marginBottom: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  shopIcon: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  shopIconText: {
    fontSize: 32,
  },

  profileInfo: {
    flex: 1,
  },

  shopName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  category: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  rating: {
    fontSize: 14,
    color: '#F59E0B',
    marginTop: 6,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 15,
    letterSpacing: 0.5,
  },

  row: {
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  menuText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },

  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },

  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 5,
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },

  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 20,
  },
});