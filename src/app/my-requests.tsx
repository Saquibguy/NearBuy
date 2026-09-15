import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
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

export default function MyRequestsScreen() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const userData = await AsyncStorage.getItem('loggedInUser');

      if (!userData) {
        router.replace('/customer-login');
        return;
      }

      const user = JSON.parse(userData);

      const response = await fetch(
        `${API_URL}/api/requests/customer/${user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load requests');
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error('Load requests error:', error);

      Alert.alert(
        'Error',
        'Unable to load your requests. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return {
          badge: styles.activeBadge,
          text: styles.activeText,
        };

      case 'Waiting':
        return {
          badge: styles.waitingBadge,
          text: styles.waitingText,
        };

      case 'Completed':
        return {
          badge: styles.completedBadge,
          text: styles.completedText,
        };

      default:
        return {
          badge: styles.waitingBadge,
          text: styles.waitingText,
        };
    }
  };

  const getOffersText = (request: any) => {
    if (request.status === 'Completed') {
      return 'Offer accepted';
    }

    if (request.offersCount && request.offersCount > 0) {
      return `${request.offersCount} offers received`;
    }

    return 'No offers yet';
  };

  const getOffersStyle = (request: any) => {
    if (request.status === 'Completed') {
      return styles.completedOffers;
    }

    if (request.offersCount && request.offersCount > 0) {
      return styles.offers;
    }

    return styles.waitingOffers;
  };

  const getProductEmoji = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'electronics':
        return '🎧';

      case 'mobile':
      case 'mobiles':
        return '📱';

      case 'computer':
      case 'computers':
        return '💻';

      case 'home':
        return '🏠';

      case 'fashion':
        return '👕';

      default:
        return '📦';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>NearBuy</Text>

      <Text style={styles.title}>My Requests</Text>

      <Text style={styles.subtitle}>
        Track products you've asked nearby shops for.
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Loading your requests...
          </Text>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>

          <Text style={styles.emptyTitle}>
            No Requests Yet
          </Text>

          <Text style={styles.emptyText}>
            You haven't posted any product requests yet.
          </Text>

          <TouchableOpacity
            style={styles.postButton}
            onPress={() => router.push('/post-request')}
          >
            <Text style={styles.postButtonText}>
              + Post a Request
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        requests.map((request) => {
          const status = request.status || 'Active';
          const statusStyle = getStatusStyle(status);

          return (
            <TouchableOpacity
              key={request._id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/request-details',
                  params: {
                    id: request._id,
                  },
                })
              }
            >
              <View style={styles.cardTop}>
                <Text style={styles.product}>
                  {getProductEmoji(request.category)}{' '}
                  {request.productName}
                </Text>

                <View style={statusStyle.badge}>
                  <Text style={statusStyle.text}>
                    {status}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>
                {request.description}
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.info}>
                  Budget: ₹{request.budget}
                </Text>

                <Text style={styles.info}>
                  Qty: {request.quantity}
                </Text>
              </View>

              <View style={styles.bottomRow}>
                <Text style={getOffersStyle(request)}>
                  {getOffersText(request)}
                </Text>

                <Text style={styles.view}>
                  View →
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
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

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },

  emptyEmoji: {
    fontSize: 40,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  postButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 18,
  },

  postButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  product: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginRight: 10,
  },

  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 15,
  },

  info: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },

  offers: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
  },

  waitingOffers: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '700',
  },

  completedOffers: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },

  view: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },

  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },

  activeText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
  },

  waitingBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },

  waitingText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },

  completedBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },

  completedText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
  },
});