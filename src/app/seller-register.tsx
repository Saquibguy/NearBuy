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

export default function SellerRegisterScreen() {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
    const cleanShopName = shopName.trim();
    const cleanOwnerName = ownerName.trim();
    const cleanCategory = category.trim();
    const cleanEmail = email.trim();
    const cleanArea = area.trim();
    const cleanCity = city.trim();
    const cleanAddress = address.trim();

    if (cleanShopName.length < 2) {
      Alert.alert('Invalid Shop Name', 'Please enter your shop name.');
      return;
    }

    if (!/^[a-zA-Z0-9\s&.-]+$/.test(cleanShopName)) {
      Alert.alert(
        'Invalid Shop Name',
        'Please enter a valid shop name.'
      );
      return;
    }

    if (cleanOwnerName.length < 2) {
      Alert.alert('Invalid Owner Name', 'Please enter the owner name.');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(cleanOwnerName)) {
      Alert.alert(
        'Invalid Owner Name',
        'Owner name can contain only letters and spaces.'
      );
      return;
    }

    if (cleanCategory.length < 2) {
      Alert.alert('Category Required', 'Please enter a shop category.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert(
        'Invalid Phone',
        'Phone number must contain exactly 10 digits.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    if (cleanArea.length < 2) {
      Alert.alert('Area Required', 'Please enter your shop area.');
      return;
    }

    if (cleanCity.length < 2) {
      Alert.alert('City Required', 'Please enter your city.');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert(
        'Invalid PIN Code',
        'PIN code must contain exactly 6 digits.'
      );
      return;
    }

    if (cleanAddress.length < 10) {
      Alert.alert(
        'Invalid Address',
        'Please enter your complete shop address.'
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 8 characters.'
      );
      return;
    }

    if (!openingHours.trim()) {
  Alert.alert('Required', 'Please enter your opening hours.');
  return;
}

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Passwords do not match.'
      );
      return;
    }

   try {
  const response = await fetch(
    'https://nearbuy-backend-gzbq.onrender.com/api/auth/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
  name: cleanOwnerName,
  email: cleanEmail,
  phone: phone,
  password: password,
  role: 'seller',

  shopName: cleanShopName,
  category: cleanCategory,
  area: cleanArea,
  city: cleanCity,
  pincode: pincode,
  address: cleanAddress,
  openingHours: openingHours.trim(),
}),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    Alert.alert(
      'Registration Failed',
      data.message || 'Unable to register seller.'
    );
    return;
  }

  Alert.alert(
    'Registration Successful',
    'Your seller account has been created successfully.',
    [
      {
        text: 'OK',
        onPress: () => router.replace('/seller-login'),
      },
    ]
  );
} catch (error) {
  console.error('Seller registration error:', error);

  Alert.alert(
    'Connection Error',
    'Unable to connect to the NearBuy server.'
  );
}
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        onPress={() => router.replace('/seller-login')}
      >
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>NearBuy</Text>

      <Text style={styles.title}>
        Register your shop
      </Text>

      <Text style={styles.subtitle}>
        Bring your local store to nearby customers.
      </Text>

      <Text style={styles.sectionTitle}>
        Shop Information
      </Text>

      <Text style={styles.label}>Shop Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter shop name"
        placeholderTextColor="#9CA3AF"
        value={shopName}
        onChangeText={setShopName}
        autoCapitalize="words"
        maxLength={80}
      />

      <Text style={styles.label}>Owner Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter owner name"
        placeholderTextColor="#9CA3AF"
        value={ownerName}
        onChangeText={(text) => {
          setOwnerName(text.replace(/[^a-zA-Z\s]/g, ''));
        }}
        autoCapitalize="words"
        maxLength={50}
      />

      <Text style={styles.label}>Shop Category</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Electronics, Grocery, Fashion"
        placeholderTextColor="#9CA3AF"
        value={category}
        onChangeText={setCategory}
        autoCapitalize="words"
        maxLength={50}
      />

      <Text style={styles.sectionTitle}>
        Contact Information
      </Text>

      <Text style={styles.label}>Shop Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="10-digit phone number"
        placeholderTextColor="#9CA3AF"
        value={phone}
        onChangeText={(text) => {
          setPhone(text.replace(/\D/g, ''));
        }}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <Text style={styles.label}>Shop Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter shop email"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.sectionTitle}>
        Shop Location
      </Text>

      <Text style={styles.label}>Area / Locality</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Andheri West"
        placeholderTextColor="#9CA3AF"
        value={area}
        onChangeText={setArea}
        autoCapitalize="words"
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        placeholderTextColor="#9CA3AF"
        value={city}
        onChangeText={(text) => {
          setCity(text.replace(/[^a-zA-Z\s]/g, ''));
        }}
        autoCapitalize="words"
      />

      <Text style={styles.label}>PIN Code</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit PIN code"
        placeholderTextColor="#9CA3AF"
        value={pincode}
        onChangeText={(text) => {
          setPincode(text.replace(/\D/g, ''));
        }}
        keyboardType="number-pad"
        maxLength={6}
      />

      <Text style={styles.label}>Complete Address</Text>
      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Enter complete shop address"
        placeholderTextColor="#9CA3AF"
        value={address}
        onChangeText={setAddress}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Opening Hours</Text>
<TextInput
  style={styles.input}
  placeholder="e.g. 10 AM - 9 PM"
  placeholderTextColor="#9CA3AF"
  value={openingHours}
  onChangeText={setOpeningHours}
  autoCapitalize="none"
  maxLength={50}
/>

      <Text style={styles.sectionTitle}>
        Account Security
      </Text>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Create a password"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        placeholderTextColor="#9CA3AF"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          Register Shop
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.replace('/seller-login')}
      >
        <Text style={styles.signInText}>
          Already registered? Sign In
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

  back: {
    fontSize: 17,
    color: '#2563EB',
    marginTop: 15,
    marginBottom: 30,
  },

  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginTop: 15,
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 18,
  },

  addressInput: {
    height: 100,
    paddingTop: 14,
  },

  button: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  signInButton: {
    alignItems: 'center',
    marginTop: 24,
  },

  signInText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
});