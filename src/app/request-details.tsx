import {
  router,
  useLocalSearchParams,
} from 'expo-router';


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

export default function RequestDetailsScreen() {
  const params =
    useLocalSearchParams<{
      id?: string | string[];
    }>();

  const requestId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [request, setRequest] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [cancelling, setCancelling] =
    useState(false);

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    if (!requestId) {
      setLoading(false);

      Alert.alert(
        'Error',
        'Request ID is missing.'
      );

      return;
    }

    try {
      setLoading(true);

      const url =
        `${API_URL}/api/requests/${requestId}`;

      console.log(
        'Loading request URL:',
        url
      );

      const response =
        await fetch(url);

      console.log(
        'Response status:',
        response.status
      );

      console.log(
        'Response content type:',
        response.headers.get(
          'content-type'
        )
      );

      // Read response as TEXT first
      const responseText =
        await response.text();

      console.log(
        'Response body:',
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`
        );
      }

      // Convert text to JSON
      let data;

      try {
        data =
          JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          'JSON parsing failed:',
          parseError
        );

        throw new Error(
          `Server returned non-JSON response: ${responseText.substring(
            0,
            200
          )}`
        );
      }

      console.log(
        'Parsed request data:',
        data
      );

      if (!data.request) {
        throw new Error(
          'Request data is missing from server response.'
        );
      }

      setRequest(data.request);

    } catch (error: any) {
      console.error(
        'Load request details error:',
        error
      );

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load request details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = () => {
    if (!request?._id) {
      return;
    }

    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: cancelRequest,
        },
      ]
    );
  };

  const cancelRequest = async () => {
    if (!request?._id) {
      return;
    }

    try {
      setCancelling(true);

      const response =
        await fetch(
          `${API_URL}/api/requests/${request._id}/cancel`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
          }
        );

      const responseText =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          'Server returned an invalid response.'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to cancel request.'
        );
      }

      setRequest(data.request);

      Alert.alert(
        'Request Cancelled',
        'Your request has been cancelled successfully.'
      );

    } catch (error: any) {
      console.error(
        'Cancel request error:',
        error
      );

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to cancel request.'
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleViewOffers = () => {
    if (!request?._id) {
      Alert.alert(
        'Error',
        'Request ID is missing.'
      );
      return;
    }

    router.push({
      pathname: '/offers',
      params: {
        requestId: request._id,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading request details...
        </Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            Unable to load request
          </Text>

          <Text style={styles.errorText}>
            The request details could not
            be loaded.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadRequest}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
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
          Request Details
        </Text>

        <Text style={styles.subtitle}>
          View the details of your product
          request
        </Text>

        {/* Product Card */}

        <View style={styles.card}>
          <Text style={styles.productName}>
            {request.productName ||
              'Product'}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                request.status ===
                  'Cancelled'
                  ? styles.cancelledBadge
                  : styles.activeBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  request.status ===
                    'Cancelled'
                    ? styles.cancelledText
                    : styles.activeText,
                ]}
              >
                {request.status ||
                  'Active'}
              </Text>
            </View>
          </View>
        </View>

        {/* Request Information */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Request Information
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Category
            </Text>

            <Text style={styles.value}>
              {request.category ||
                'Not specified'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Budget
            </Text>

            <Text style={styles.budgetValue}>
              ₹{request.budget || 0}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Quantity
            </Text>

            <Text style={styles.value}>
              {request.quantity || 1}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Condition
            </Text>

            <Text style={styles.value}>
              {request.condition ||
                'New'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Location
            </Text>

            <Text
              style={[
                styles.value,
                styles.locationValue,
              ]}
            >
              {request.location ||
                'Not specified'}
            </Text>
          </View>
        </View>

        {/* Description */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            {request.description ||
              'No description provided.'}
          </Text>
        </View>

        {/* Posted Information */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Request Information
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Posted
            </Text>

            <Text style={styles.value}>
              {request.createdAt
                ? new Date(
                    request.createdAt
                  ).toLocaleDateString()
                : 'Not available'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Request ID
            </Text>

            <Text
              style={[
                styles.value,
                styles.requestId,
              ]}
              numberOfLines={1}
            >
              {request._id}
            </Text>
          </View>
        </View>

        {/* Offers Button */}

        {request.status !==
          'Cancelled' && (
          <TouchableOpacity
            style={styles.offersButton}
            onPress={handleViewOffers}
          >
            <Text style={styles.offersButtonText}>
              View All Offers
            </Text>
          </TouchableOpacity>
        )}

        {/* Cancel Button */}

        {request.status ===
          'Active' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={
              handleCancelRequest
            }
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator
                color="#DC2626"
              />
            ) : (
              <Text
                style={styles.cancelButtonText}
              >
                Cancel Request
              </Text>
            )}
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748B',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeBadge: {
    backgroundColor: '#DCFCE7',
  },

  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },

  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },

  activeText: {
    color: '#15803D',
  },

  cancelledText: {
    color: '#DC2626',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 15,
  },

  label: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1.5,
    textAlign: 'right',
  },

  budgetValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2563EB',
    flex: 1.5,
    textAlign: 'right',
  },

  locationValue: {
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#475569',
  },

  requestId: {
    fontSize: 12,
    color: '#64748B',
  },

  offersButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },

  offersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  errorTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  errorText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});