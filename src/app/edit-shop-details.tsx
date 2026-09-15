import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function EditShopDetailsScreen() {
  const [shopName, setShopName] = useState('City Tech Store');
  const [category, setCategory] = useState('Electronics');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [hours, setHours] = useState('10 AM - 9 PM');

  const saveChanges = () => {
    if (!shopName.trim()) {
      Alert.alert('Invalid Shop Name', 'Please enter your shop name.');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Invalid Category', 'Please enter a category.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Invalid Phone', 'Please enter your phone number.');
      return;
    }

    if (!hours.trim()) {
      Alert.alert('Invalid Hours', 'Please enter your opening hours.');
      return;
    }

    Alert.alert(
      'Shop Updated!',
      'Your shop details have been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
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

      <Text style={styles.title}>Edit Shop Details</Text>

      <Text style={styles.subtitle}>
        Update your shop information.
      </Text>

      <Text style={styles.label}>Shop Name</Text>

      <TextInput
        style={styles.input}
        value={shopName}
        onChangeText={setShopName}
        placeholder="Enter shop name"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Category</Text>

      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="e.g. Electronics"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Phone Number</Text>

      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Opening Hours</Text>

      <TextInput
        style={styles.input}
        value={hours}
        onChangeText={setHours}
        placeholder="e.g. 10 AM - 9 PM"
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveChanges}
      >
        <Text style={styles.saveButtonText}>
          Save Changes
        </Text>
      </TouchableOpacity>
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

  saveButton: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});