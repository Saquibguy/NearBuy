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

type Offer = {
  _id: string;
  condition: 'New' | 'Used';
  price: number;
  availability: string;
  shopAddress: string;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Not Selected';
  createdAt: string;
  requestId?: {
    _id: string;
    productName: string;
    category: string;
    budget: number;
    quantity: number;
    location: string;
    status: string;
  };
};

export default function MyOffersScreen() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem('loggedInUser');

      if (!storedUser) {
        Alert.alert('Error', 'Seller information not found.');
        return;
      }

      const user = JSON.parse(storedUser);
      const sellerId = user.id || user._id;

      if (!sellerId) {
        Alert.alert('Error', 'Seller ID not found.');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/offers/seller/${sellerId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load offers');
      }

      setOffers(data.offers || []);
    } catch (error) {
      console.error('Load seller offers error:', error);

      Alert.alert(
        'Unable to load offers',
        'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOffers();
    }, [])
  );

  const getBadgeStyle = (status: Offer['status']) => {
    switch (status) {
      case 'Accepted':
        return styles.acceptedBadge;

      case 'Not Selected':
      case 'Rejected':
        return styles.rejectedBadge;

      default:
        return styles.pendingBadge;
    }
  };

  const getBadgeTextStyle = (status: Offer['status']) => {
    switch (status) {
      case 'Accepted':
        return styles.acceptedText;

      case 'Not Selected':
      case 'Rejected':
        return styles.rejectedText;

      default:
        return styles.pendingText;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
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

      <Text style={styles.title}>My Offers</Text>

      <Text style={styles.subtitle}>
        Track the offers you have sent to customers.
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Loading your offers...
          </Text>
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No offers yet
          </Text>

          <Text style={styles.emptyText}>
            Offers you send to customers will appear here.
          </Text>
        </View>
      ) : (
        offers.map((offer) => (
          <View
            key={offer._id}
            style={styles.offerCard}
          >
            <View style={styles.topRow}>
              <View style={styles.productArea}>
                <Text style={styles.product}>
                  {offer.requestId?.productName || 'Product Request'}
                </Text>

                <Text style={styles.customer}>
                  Customer Request
                </Text>
              </View>

              <View style={getBadgeStyle(offer.status)}>
                <Text style={getBadgeTextStyle(offer.status)}>
                  {offer.status}
                </Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ₹{offer.price}
              </Text>

              <Text style={styles.condition}>
                {offer.condition}
              </Text>
            </View>

            {offer.requestId && (
              <Text style={styles.details}>
                Customer budget: ₹{offer.requestId.budget}
              </Text>
            )}

            <Text style={styles.details}>
              Availability: {offer.availability}
            </Text>

            <Text style={styles.details}>
              Sent: {formatDate(offer.createdAt)}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.footer}>
        Keep your prices competitive to get more customers.
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

  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 15,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  productArea: {
    flex: 1,
    paddingRight: 10,
  },

  product: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },

  customer: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },

  price: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111827',
  },

  condition: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },

  details: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 7,
  },

  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },

  pendingText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },

  acceptedBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },

  acceptedText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
  },

  rejectedBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },

  rejectedText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },

  loadingText: {
    marginTop: 10,
    color: '#6B7280',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },

  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 15,
  },
});