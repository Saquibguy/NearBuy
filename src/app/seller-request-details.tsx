import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function SellerRequestDetails() {
  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const requestId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      loadRequest();
    } else {
      setLoading(false);

      Alert.alert(
        'Error',
        'Request ID is missing.'
      );
    }
  }, [requestId]);

  const loadRequest = async () => {
    if (!requestId) {
      console.error('Request ID is missing');
      setLoading(false);

      Alert.alert(
        'Error',
        'Request ID is missing.'
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/requests/${requestId}`
      );

      const responseText = await response.text();

      console.log(
        'Seller request status:',
        response.status
      );

      console.log(
        'Seller request response:',
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          'JSON parse error:',
          parseError
        );

        throw new Error(
          'Server returned an invalid response.'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to load customer request'
        );
      }

      if (!data.request) {
        throw new Error(
          'Request data was not returned by the server.'
        );
      }

      setRequest(data.request);
    } catch (error) {
      console.error(
        'Load seller request error:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to load customer request.'
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

  const formatPostedDate = (date: string) => {
    if (!date) {
      return 'Recently';
    }

    const requestDate = new Date(date);

    return requestDate.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading request...
        </Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>
          ⚠️
        </Text>

        <Text style={styles.errorTitle}>
          Request Not Found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.title}>
          Customer Request
        </Text>

        <Text style={styles.subtitle}>
          Review the customer's requirements
        </Text>

        {/* Product Card */}
        <View style={styles.productCard}>
          <Text style={styles.productEmoji}>
            {getProductEmoji(
              request.category
            )}
          </Text>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {request.productName}
            </Text>

            <Text style={styles.category}>
              {request.category}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {request.status}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            {request.description}
          </Text>
        </View>

        {/* Requirements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Requirements
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Budget
            </Text>

            <Text style={styles.value}>
              ₹{request.budget}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Quantity
            </Text>

            <Text style={styles.value}>
              {request.quantity}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Condition
            </Text>

            <Text style={styles.value}>
              {request.condition || 'New'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Category
            </Text>

            <Text style={styles.value}>
              {request.category}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Location
            </Text>

            <Text style={styles.value}>
              {request.location}
            </Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Customer
          </Text>

          <View style={styles.customerRow}>
            <View style={styles.customerIcon}>
              <Text style={styles.customerEmoji}>
                👤
              </Text>
            </View>

            <View>
              <Text style={styles.customerName}>
                Customer
              </Text>

              <Text style={styles.customerSubtext}>
                Customer ID:{' '}
                {request.customerId}
              </Text>
            </View>
          </View>

          <Text style={styles.postedText}>
            Posted on{' '}
            {formatPostedDate(
              request.createdAt
            )}
          </Text>
        </View>

        {/* Make Offer */}
        {request.status === 'Active' && (
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() => {
              router.push({
                pathname: '/make-offer',
                params: {
                  requestId: request._id,
                },
              });
            }}
          >
            <Text style={styles.offerButtonText}>
              Make an Offer
            </Text>
          </TouchableOpacity>
        )}
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

  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },

  backText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: '600',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
    marginBottom: 20,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  productEmoji: {
    fontSize: 42,
    marginRight: 14,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
  },

  category: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  label: {
    fontSize: 14,
    color: '#64748B',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    maxWidth: '60%',
    textAlign: 'right',
  },

  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  customerIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  customerEmoji: {
    fontSize: 23,
  },

  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },

  customerSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    maxWidth: 240,
  },

  postedText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 15,
  },

  offerButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 25,
  },

  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },

  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 15,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },

  errorIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 15,
  },
});