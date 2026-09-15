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

export default function OffersScreen() {
  const { requestId } = useLocalSearchParams<{
    requestId?: string;
  }>();

  const [request, setRequest] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      loadData();
    }
  }, [requestId]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (!requestId) {
        throw new Error('Request ID is missing');
      }

      // Get request details
      const requestResponse = await fetch(
        `${API_URL}/api/requests/${requestId}`
      );

      const requestData = await requestResponse.json();

      if (!requestResponse.ok) {
        throw new Error(
          requestData.message ||
            'Failed to load request'
        );
      }

      setRequest(requestData.request);

      // Get offers for this request
      const offersResponse = await fetch(
        `${API_URL}/api/offers/request/${requestId}`
      );

      const offersData = await offersResponse.json();

      if (!offersResponse.ok) {
        throw new Error(
          offersData.message ||
            'Failed to load offers'
        );
      }

      setOffers(offersData.offers || []);
    } catch (error) {
      console.error(
        'Load offers error:',
        error
      );

      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Unable to load offers.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) {
      return 'Recently';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // Select an offer
  const handleSelectOffer = (
    offerId: string
  ) => {
    Alert.alert(
      'Select Offer',
      'Are you sure you want to select this offer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Select',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/offers/${offerId}/accept`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type':
                      'application/json',
                  },
                }
              );

              const data =
                await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message ||
                    'Failed to select offer'
                );
              }

              Alert.alert(
                'Offer Selected!',
                'You have successfully selected this seller offer.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      loadData();
                    },
                  },
                ]
              );
            } catch (error) {
              console.error(
                'Select offer error:',
                error
              );

              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'Unable to select offer.'
              );
            }
          },
        },
      ]
    );
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading offers...
        </Text>
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
          Offers
        </Text>

        <Text style={styles.subtitle}>
          Compare offers from nearby sellers
        </Text>

        {/* Request Information */}

        {request && (
          <View style={styles.requestCard}>
            <Text style={styles.productName}>
              {request.productName}
            </Text>

            <Text style={styles.category}>
              {request.category}
            </Text>

            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>
                Your Budget
              </Text>

              <Text style={styles.budget}>
                ₹{request.budget}
              </Text>
            </View>
          </View>
        )}

        {/* Offers */}

        {offers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📭
            </Text>

            <Text style={styles.emptyTitle}>
              No Offers Yet
            </Text>

            <Text style={styles.emptyText}>
              Sellers have not submitted any
              offers for this request yet.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.offerCount}>
              {offers.length}{' '}
              {offers.length === 1
                ? 'Offer'
                : 'Offers'}{' '}
              Received
            </Text>

            {offers.map((offer) => (
              <View
                key={offer._id}
                style={styles.offerCard}
              >
                {/* Seller Header */}

                <View
                  style={styles.sellerHeader}
                >
                  <View
                    style={styles.sellerIcon}
                  >
                    <Text
                      style={styles.sellerEmoji}
                    >
                      🏪
                    </Text>
                  </View>

                  <View
                    style={styles.sellerInfo}
                  >
                    <Text
                      style={styles.shopName}
                    >
                      {offer.sellerId
                        ?.shopName ||
                        'Local Shop'}
                    </Text>

                    <Text
                      style={
                        styles.sellerCategory
                      }
                    >
                      {offer.sellerId
                        ?.category ||
                        'Seller'}
                    </Text>
                  </View>

                  <View
                    style={styles.statusBadge}
                  >
                    <Text
                      style={styles.statusText}
                    >
                      {offer.status}
                    </Text>
                  </View>
                </View>

                {/* Price */}

                <View
                  style={styles.priceSection}
                >
                  <Text
                    style={styles.priceLabel}
                  >
                    Seller Offer
                  </Text>

                  <Text
                    style={styles.price}
                  >
                    ₹{offer.price}
                  </Text>
                </View>

                {/* Details */}

                <View style={styles.details}>
                  <View
                    style={styles.detailRow}
                  >
                    <Text
                      style={styles.detailLabel}
                    >
                      Condition
                    </Text>

                    <Text
                      style={styles.detailValue}
                    >
                      {offer.condition}
                    </Text>
                  </View>

                  <View
                    style={styles.detailRow}
                  >
                    <Text
                      style={styles.detailLabel}
                    >
                      Availability
                    </Text>

                    <Text
                      style={styles.detailValue}
                    >
                      {offer.availability}
                    </Text>
                  </View>

                  <View
                    style={styles.detailRow}
                  >
                    <Text
                      style={styles.detailLabel}
                    >
                      Shop Address
                    </Text>

                    <Text
                      style={styles.detailValue}
                    >
                      {offer.shopAddress}
                    </Text>
                  </View>
                </View>

                {/* Seller Message */}

                {offer.message ? (
                  <View
                    style={styles.messageBox}
                  >
                    <Text
                      style={
                        styles.messageLabel
                      }
                    >
                      Seller Message
                    </Text>

                    <Text
                      style={styles.message}
                    >
                      {offer.message}
                    </Text>
                  </View>
                ) : null}

                {/* Rating */}

                <View
                  style={styles.ratingRow}
                >
                  <Text
                    style={styles.rating}
                  >
                    ★{' '}
                    {offer.sellerId
                      ?.rating ?? 0}
                  </Text>

                  <Text
                    style={
                      styles.reviewText
                    }
                  >
                    (
                    {offer.sellerId
                      ?.reviewCount ?? 0}{' '}
                    reviews)
                  </Text>

                  <Text
                    style={styles.date}
                  >
                    {formatDate(
                      offer.createdAt
                    )}
                  </Text>
                </View>

                {/* Select Offer Button */}

                {offer.status ===
                  'Pending' &&
                  request?.status ===
                    'Active' && (
                    <TouchableOpacity
                      style={
                        styles.selectButton
                      }
                      onPress={() =>
                        handleSelectOffer(
                          offer._id
                        )
                      }
                    >
                      <Text
                        style={
                          styles.selectButtonText
                        }
                      >
                        Select This Offer
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            ))}
          </>
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

  /* Back */

  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },

  backText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: '600',
  },

  /* Header */

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

  /* Request */

  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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

  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  budgetLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  budget: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Offer Count */

  offerCount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 25,
    marginBottom: 12,
  },

  /* Offer Card */

  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* Seller */

  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sellerIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  sellerEmoji: {
    fontSize: 23,
  },

  sellerInfo: {
    flex: 1,
  },

  shopName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },

  sellerCategory: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  /* Status */

  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Price */

  priceSection: {
    marginTop: 18,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },

  priceLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  price: {
    fontSize: 25,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 4,
  },

  /* Details */

  details: {
    marginTop: 10,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },

  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    maxWidth: '40%',
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    maxWidth: '55%',
    textAlign: 'right',
  },

  /* Message */

  messageBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 9,
    padding: 12,
    marginTop: 10,
  },

  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 5,
  },

  message: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },

  /* Rating */

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },

  reviewText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },

  date: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 'auto',
  },

  /* Select Offer */

  selectButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Empty */

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  emptyIcon: {
    fontSize: 45,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 20,
  },

  /* Loading */

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
});