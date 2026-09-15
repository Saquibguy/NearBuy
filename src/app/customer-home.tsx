import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.0.101:5000';

export default function CustomerHomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [offerCounts, setOfferCounts] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState(true);

  const loadCustomerData = useCallback(async () => {
    try {
      setLoading(true);

      const userData = await AsyncStorage.getItem(
        'loggedInUser'
      );

      if (!userData) {
        router.replace('/customer-login');
        return;
      }

      const customer = JSON.parse(userData);

      setUser(customer);

      const response = await fetch(
        `${API_URL}/api/requests/customer/${customer.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load requests'
        );
      }

      const customerRequests = data.requests || [];

      setRequests(customerRequests);

      // Get offer count for each request
      const counts: { [key: string]: number } = {};

      await Promise.all(
        customerRequests.map(async (request: any) => {
          try {
            const offerResponse = await fetch(
              `${API_URL}/api/offers/request/${request._id}`
            );

            const offerData = await offerResponse.json();

            counts[request._id] =
              offerData.offers?.length || 0;
          } catch (error) {
            console.error(
              'Offer count error:',
              error
            );

            counts[request._id] = 0;
          }
        })
      );

      setOfferCounts(counts);
    } catch (error) {
      console.error(
        'Load customer home error:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to load your requests.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

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

      case 'audio':
        return '🔊';

      default:
        return '📦';
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'Active') {
      return 'Active';
    }

    if (status === 'Completed') {
      return 'Completed';
    }

    if (status === 'Cancelled') {
      return 'Cancelled';
    }

    return status || 'Active';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading your requests...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            NearBuy
          </Text>

          <Text style={styles.greeting}>
            Welcome back
            {user?.name
              ? `, ${user.name} 👋`
              : ' 👋'}
          </Text>
        </View>
      </View>

      {/* Hero Section */}

      <View style={styles.hero}>
        <Text style={styles.title}>
          What are you looking for?
        </Text>

        <Text style={styles.subtitle}>
          Tell nearby shops what you need and let them
          compete for your order.
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

      {/* Recent Requests Header */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Your Recent Requests
        </Text>

        <Text style={styles.requestCount}>
          {requests.length}{' '}
          {requests.length === 1
            ? 'Request'
            : 'Requests'}
        </Text>
      </View>

      {/* Requests */}

      {requests.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📭
          </Text>

          <Text style={styles.emptyTitle}>
            No Requests Yet
          </Text>

          <Text style={styles.emptyText}>
            Post a request and nearby shops can send
            you offers.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() =>
              router.push('/post-request')
            }
          >
            <Text style={styles.emptyButtonText}>
              Post Your First Request
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        requests.map((request) => {
          const offersCount =
            offerCounts[request._id] || 0;

          const status =
            getStatusText(request.status);

          return (
            <View
              key={request._id}
              style={styles.requestCard}
            >
              {/* Product */}

              <View style={styles.productTop}>
                <View style={styles.productIcon}>
                  <Text style={styles.iconText}>
                    {getProductEmoji(
                      request.category
                    )}
                  </Text>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.product}>
                    {request.productName}
                  </Text>

                  <Text
                    style={styles.description}
                    numberOfLines={2}
                  >
                    {request.description}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Request Details */}

              <View style={styles.detailsRow}>
                <View>
                  <Text style={styles.detailLabel}>
                    Budget
                  </Text>

                  <Text style={styles.detailValue}>
                    ₹{request.budget}
                  </Text>
                </View>

                <View>
                  <Text style={styles.detailLabel}>
                    Offers
                  </Text>

                  <Text
                    style={
                      offersCount > 0
                        ? styles.offerValue
                        : styles.waitingValue
                    }
                  >
                    {offersCount} received
                  </Text>
                </View>

                <View>
                  <Text style={styles.detailLabel}>
                    Status
                  </Text>

                  <Text
                    style={
                      status === 'Active'
                        ? styles.activeStatus
                        : status === 'Cancelled'
                        ? styles.cancelledStatus
                        : styles.waitingStatus
                    }
                  >
                    {status}
                  </Text>
                </View>
              </View>

              {/* View Offers */}

              {offersCount > 0 &&
                status === 'Active' && (
                  <TouchableOpacity
                    style={
                      styles.viewOffersButton
                    }
                    onPress={() => {
                      router.push({
                        pathname: '/offers',
                        params: {
                          id: request._id,
                        },
                      });
                    }}
                  >
                    <Text
                      style={
                        styles.viewOffersText
                      }
                    >
                      View Offers →
                    </Text>
                  </TouchableOpacity>
                )}

              {/* No Offers Message */}

              {offersCount === 0 &&
                status === 'Active' && (
                  <View style={styles.waitingBox}>
                    <Text
                      style={styles.waitingBoxText}
                    >
                      Waiting for sellers to send
                      offers
                    </Text>
                  </View>
                )}
            </View>
          );
        })
      )}

      {/* Quick Actions */}

      <Text style={styles.quickTitle}>
        Quick Actions
      </Text>

      <TouchableOpacity
        style={styles.myRequestsButton}
        onPress={() =>
          router.push('/my-requests')
        }
      >
        <Text style={styles.myRequestsText}>
          View My Requests
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() =>
          router.push('/customer-profile')
        }
      >
        <Text style={styles.profileButtonText}>
          👤 My Profile
        </Text>

        <Text style={styles.profileArrow}>
          →
        </Text>
      </TouchableOpacity>

      {/* Footer */}

      <Text style={styles.footer}>
        Shop local. Compare better.
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
    fontSize: 14,
    color: '#6B7280',
  },

  /* Header */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 28,
  },

  logo: {
    fontSize: 25,
    fontWeight: '800',
    color: '#2563EB',
  },

  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  /* Hero */

  hero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 30,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginTop: 10,
  },

  postButton: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Section */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  requestCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  /* Request Card */

  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  productTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  iconText: {
    fontSize: 23,
  },

  productInfo: {
    flex: 1,
  },

  product: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },

  /* Request Details */

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  offerValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },

  waitingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },

  activeStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },

  waitingStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },

  cancelledStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },

  /* View Offers */

  viewOffersButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewOffersText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Waiting */

  waitingBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  waitingBoxText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },

  /* Empty */

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  emptyIcon: {
    fontSize: 42,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 7,
  },

  emptyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Quick Actions */

  quickTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 18,
    marginBottom: 12,
  },

  myRequestsButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  myRequestsText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '700',
  },

  arrow: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: '600',
  },

  profileButton: {
    height: 52,
    backgroundColor: '#111827',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  profileArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },

  /* Footer */

  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 30,
  },
});