import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'https://nearbuy-backend-gzbq.onrender.com';

export default function SellerHome() {
  const [shopName, setShopName] = useState('Seller');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeller();
    loadRequests();
  }, []);

  const loadSeller = async () => {
    try {
      const userData = await AsyncStorage.getItem('loggedInUser');

      if (userData) {
        const user = JSON.parse(userData);
        setShopName(user.shopName || 'Seller');
      }
    } catch (error) {
      console.error('Failed to load seller:', error);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/requests`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load requests');
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error('Load requests error:', error);
      Alert.alert(
        'Error',
        'Unable to load customer requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getProductEmoji = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'electronics':
        return '🎧';
      case 'mobile':
        return '📱';
      case 'laptop':
        return '💻';
      case 'fashion':
        return '👕';
      case 'home':
        return '🏠';
      case 'books':
        return '📚';
      default:
        return '📦';
    }
  };

  const formatDate = (date: string) => {
    if (!date) return 'Recently';

    const requestDate = new Date(date);
    const now = new Date();

    const diffMs = now.getTime() - requestDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'Just now';
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    }

    if (diffHours < 24) {
      return `${diffHours} hr ago`;
    }

    if (diffDays === 1) {
      return 'Yesterday';
    }

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    return requestDate.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.shopName}>{shopName}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/seller-profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Customer Requests</Text>
          <Text style={styles.subtitle}>
            Find products customers are looking for
          </Text>
        </View>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />

            <Text style={styles.loadingText}>
              Loading requests...
            </Text>
          </View>
        ) : requests.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>

            <Text style={styles.emptyTitle}>
              No Customer Requests
            </Text>

            <Text style={styles.emptyText}>
              There are currently no active customer requests.
            </Text>
          </View>
        ) : (
          /* Request Cards */
          requests.map((request) => (
            <View
              key={request._id}
              style={styles.requestCard}
            >
              {/* Product Header */}
              <View style={styles.productHeader}>
                <Text style={styles.productEmoji}>
                  {getProductEmoji(request.category)}
                </Text>

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {request.productName}
                  </Text>

                  <Text style={styles.category}>
                    {request.category}
                  </Text>
                </View>

                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>
                    {request.status}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text
                style={styles.description}
                numberOfLines={2}
              >
                {request.description}
              </Text>

              {/* Details */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>
                    Budget
                  </Text>

                  <Text style={styles.detailValue}>
                    ₹{request.budget}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>
                    Quantity
                  </Text>

                  <Text style={styles.detailValue}>
                    {request.quantity}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>
                    Condition
                  </Text>

                  <Text style={styles.detailValue}>
                    {request.condition || 'New'}
                  </Text>
                </View>
              </View>

              {/* Location */}
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>

                <Text style={styles.locationText}>
                  {request.location}
                </Text>
              </View>

              {/* Posted Date */}
              <Text style={styles.postedText}>
                Posted {formatDate(request.createdAt)}
              </Text>

              {/* View Request Button */}
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  router.push({
                    pathname: '/seller-request-details',
                    params: {
                      id: request._id,
                    },
                  });
                }}
              >
                <Text style={styles.viewButtonText}>
                  View Request
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/my-offers')}
          >
            <Text style={styles.bottomIcon}>💼</Text>
            <Text style={styles.bottomText}>My Offers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/seller-profile')}
          >
            <Text style={styles.bottomIcon}>👤</Text>
            <Text style={styles.bottomText}>My Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  welcome: {
    fontSize: 15,
    color: '#64748B',
  },

  shopName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 3,
  },

  profileIcon: {
    fontSize: 28,
  },

  titleSection: {
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 15,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
  },

  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },

  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productEmoji: {
    fontSize: 34,
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  category: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  activeText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },

  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginTop: 15,
  },

  detailsRow: {
    flexDirection: 'row',
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },

  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 4,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
  },

  postedText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 10,
  },

  viewButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 15,
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  bottomButton: {
    alignItems: 'center',
    flex: 1,
  },

  bottomIcon: {
    fontSize: 22,
  },

  bottomText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 5,
  },
});