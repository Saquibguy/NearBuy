import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
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

export default function PostRequestScreen() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load customer's saved location
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const userData =
          await AsyncStorage.getItem('loggedInUser');

        if (!userData) {
          Alert.alert(
            'Login Required',
            'Please login again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  router.replace('/customer-login');
                },
              },
            ]
          );
          return;
        }

        const user = JSON.parse(userData);

        if (!user.id) {
          Alert.alert(
            'Error',
            'Customer information is missing.'
          );
          return;
        }

        const savedLocation =
          await AsyncStorage.getItem(
            `customerLocation_${user.id}`
          );

        if (savedLocation) {
          setLocation(savedLocation);
        }
      } catch (error) {
        console.error(
          'Error loading location:',
          error
        );
      } finally {
        setLoadingLocation(false);
      }
    };

    loadLocation();
  }, []);

  const submitRequest = async () => {
    // Prevent multiple submissions
    if (submitting) {
      return;
    }

    // Product name validation
    if (!productName.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter the product name.'
      );
      return;
    }

    // Category validation
    if (!selectedCategory) {
      Alert.alert(
        'Missing Information',
        'Please select a category.'
      );
      return;
    }

    // Description validation
    if (!description.trim()) {
      Alert.alert(
        'Missing Information',
        'Please describe what you need.'
      );
      return;
    }

    // Budget validation
    if (!budget.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your budget.'
      );
      return;
    }

    const numericBudget = Number(budget);

    if (
      !Number.isFinite(numericBudget) ||
      numericBudget <= 0
    ) {
      Alert.alert(
        'Invalid Budget',
        'Please enter a valid budget greater than 0.'
      );
      return;
    }

    // Quantity validation
    if (!quantity.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter the quantity.'
      );
      return;
    }

    const numericQuantity = Number(quantity);

    if (
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      Alert.alert(
        'Invalid Quantity',
        'Please enter a valid quantity greater than 0.'
      );
      return;
    }

    // Location validation
    if (!location.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your location.'
      );
      return;
    }

    setSubmitting(true);

    try {
      // Get logged-in customer
      const userData =
        await AsyncStorage.getItem('loggedInUser');

      if (!userData) {
        Alert.alert(
          'Login Required',
          'Please login again to post a request.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/customer-login');
              },
            },
          ]
        );
        return;
      }

      const user = JSON.parse(userData);

      if (!user.id) {
        Alert.alert(
          'Error',
          'Customer information is missing.'
        );
        return;
      }

      // Send request to backend
      const response = await fetch(
        'http://192.168.0.101:5000/api/requests',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: user.id,
            productName: productName.trim(),
            category: selectedCategory,
            description: description.trim(),
            budget: numericBudget,
            quantity: numericQuantity,
            location: location.trim(),
            condition: 'New',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Error',
          data.message ||
            'Failed to post request.'
        );
        return;
      }

      // Success
      Alert.alert(
        'Request Posted!',
        'Nearby shops can now see your request and send you offers.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/customer-home');
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        'Post request error:',
        error
      );

      Alert.alert(
        'Connection Error',
        'Unable to connect to the NearBuy server.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Back Button */}

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        disabled={submitting}
      >
        <Text style={styles.backText}>
          ‹ Back
        </Text>
      </TouchableOpacity>

      {/* Logo */}

      <Text style={styles.logo}>
        NearBuy
      </Text>

      <Text style={styles.title}>
        Post a Request
      </Text>

      <Text style={styles.subtitle}>
        Tell nearby shops exactly what you need.
      </Text>

      {/* Product Name */}

      <Text style={styles.label}>
        Product Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Bluetooth Speaker"
        placeholderTextColor="#9CA3AF"
        value={productName}
        onChangeText={setProductName}
        editable={!submitting}
      />

      {/* Category */}

      <Text style={styles.label}>
        Category
      </Text>

      <View style={styles.categoryRow}>
        {[
          'Electronics',
          'Fashion',
          'Home',
          'Other',
        ].map((category) => (
          <TouchableOpacity
            key={category}
            style={
              selectedCategory === category
                ? styles.categorySelected
                : styles.category
            }
            onPress={() =>
              setSelectedCategory(category)
            }
            disabled={submitting}
          >
            <Text
              style={
                selectedCategory === category
                  ? styles.categorySelectedText
                  : styles.categoryText
              }
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}

      <Text style={styles.label}>
        What exactly do you need?
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.description,
        ]}
        placeholder="Describe the product, brand, size, features, etc."
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
        multiline
        editable={!submitting}
      />

      {/* Budget */}

      <Text style={styles.label}>
        Your Budget
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Maximum budget in ₹"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
        editable={!submitting}
      />

      {/* Quantity */}

      <Text style={styles.label}>
        Quantity
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 1"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        editable={!submitting}
      />

      {/* Location */}

      <Text style={styles.label}>
        Your Location
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Andheri West"
        placeholderTextColor="#9CA3AF"
        value={location}
        onChangeText={setLocation}
        editable={!loadingLocation && !submitting}
      />

      {/* Post Request Button */}

      <TouchableOpacity
        style={[
          styles.postButton,
          submitting && styles.disabledButton,
        ]}
        onPress={submitRequest}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.postButtonText}>
            Post My Request
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        Nearby shops will be able to respond with their offers.
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

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 18,
  },

  description: {
    height: 110,
    paddingTop: 14,
    textAlignVertical: 'top',
  },

  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  category: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 15,
  },

  categorySelected: {
    backgroundColor: '#2563EB',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 15,
  },

  categoryText: {
    color: '#374151',
    fontWeight: '600',
  },

  categorySelectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  postButton: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  note: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 15,
  },
});