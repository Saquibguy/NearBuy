import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.0.101:5000';

export default function MakeOffer() {
  const { requestId } = useLocalSearchParams<{
    requestId: string;
  }>();

  const [request, setRequest] = useState<any>(null);
  const [condition, setCondition] = useState('New');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (requestId) {
      loadRequest();
    }
  }, [requestId]);

  const loadRequest = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/requests/${requestId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load request'
        );
      }

      setRequest(data.request);
    } catch (error) {
      console.error('Load request error:', error);

      Alert.alert(
        'Error',
        'Unable to load customer request.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async () => {
    if (!price.trim()) {
      Alert.alert('Required', 'Please enter your offer price.');
      return;
    }

    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert(
        'Invalid Price',
        'Please enter a valid offer price.'
      );
      return;
    }

    if (!availability.trim()) {
      Alert.alert(
        'Required',
        'Please enter product availability.'
      );
      return;
    }

    if (!shopAddress.trim()) {
      Alert.alert(
        'Required',
        'Please enter your pickup/shop address.'
      );
      return;
    }

    try {
      setSubmitting(true);

      const userData = await AsyncStorage.getItem(
        'loggedInUser'
      );

      if (!userData) {
        Alert.alert(
          'Login Required',
          'Please login again.'
        );
        router.replace('/seller-login');
        return;
      }

      const seller = JSON.parse(userData);

      // Offer API will be connected here next.
      // For now we validate the complete form.

     const response = await fetch(`${API_URL}/api/offers`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    requestId,
    sellerId: seller.id,
    condition,
    price: numericPrice,
    availability: availability.trim(),
    shopAddress: shopAddress.trim(),
    message: message.trim(),
  }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message || 'Failed to submit offer'
  );
}

Alert.alert(
  'Offer Sent!',
  'Your offer has been submitted successfully.',
  [
    {
      text: 'OK',
      onPress: () => {
        router.replace('/seller-home');
      },
    },
  ]
);
    } catch (error) {
      console.error('Send offer error:', error);

      Alert.alert(
        'Error',
        'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
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
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Request not found.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.title}>
          Make an Offer
        </Text>

        <Text style={styles.subtitle}>
          Submit your offer for this customer request
        </Text>

        {/* Request Card */}
        <View style={styles.requestCard}>
          <Text style={styles.productEmoji}>🎧</Text>

          <View style={styles.requestInfo}>
            <Text style={styles.productName}>
              {request.productName}
            </Text>

            <Text style={styles.category}>
              {request.category}
            </Text>

            <Text style={styles.budget}>
              Customer Budget: ₹{request.budget}
            </Text>
          </View>
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Product Condition
          </Text>

          <View style={styles.conditionRow}>
            <TouchableOpacity
              style={[
                styles.conditionButton,
                condition === 'New' &&
                  styles.conditionButtonActive,
              ]}
              onPress={() => setCondition('New')}
            >
              <Text
                style={[
                  styles.conditionText,
                  condition === 'New' &&
                    styles.conditionTextActive,
                ]}
              >
                New
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.conditionButton,
                condition === 'Used' &&
                  styles.conditionButtonActive,
              ]}
              onPress={() => setCondition('Used')}
            >
              <Text
                style={[
                  styles.conditionText,
                  condition === 'Used' &&
                    styles.conditionTextActive,
                ]}
              >
                Used
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Your Offer Price
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your price"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            editable={!submitting}
          />
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Availability
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Available today"
            placeholderTextColor="#94A3B8"
            value={availability}
            onChangeText={setAvailability}
            editable={!submitting}
          />
        </View>

        {/* Shop Address */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Pickup / Shop Address
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
            ]}
            placeholder="Enter your shop address"
            placeholderTextColor="#94A3B8"
            value={shopAddress}
            onChangeText={setShopAddress}
            multiline
            editable={!submitting}
          />
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Message to Customer
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
            ]}
            placeholder="Add a message (optional)"
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!submitting}
          />
        </View>

        {/* Send Offer */}
        <TouchableOpacity
          style={[
            styles.offerButton,
            submitting && styles.disabledButton,
          ]}
          onPress={handleSendOffer}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.offerButtonText}>
              Send Offer
            </Text>
          )}
        </TouchableOpacity>
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

  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  productEmoji: {
    fontSize: 40,
    marginRight: 14,
  },

  requestInfo: {
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

  budget: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 8,
  },

  section: {
    marginTop: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },

  conditionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  conditionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  conditionButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },

  conditionText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },

  conditionTextActive: {
    color: '#2563EB',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },

  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  offerButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 28,
  },

  disabledButton: {
    opacity: 0.7,
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

  errorText: {
    fontSize: 17,
    color: '#475569',
    marginBottom: 15,
  },
});