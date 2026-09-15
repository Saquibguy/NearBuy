import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <Text style={styles.logo}>NearBuy</Text>

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>SHOP LOCAL • SHOP SMART</Text>
        </View>

        <Text style={styles.title}>
          Your Need.{'\n'}
          <Text style={styles.blueText}>Local Shops Compete.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Post what you need and get offers from nearby local stores.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.featureCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🏪</Text>
          </View>

          <Text style={styles.featureTitle}>Local Shops</Text>

          <Text style={styles.featureText}>
            Find trusted stores near you.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🏷️</Text>
          </View>

          <Text style={styles.featureTitle}>Best Offers</Text>

          <Text style={styles.featureText}>
            Compare prices and choose.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🛡️</Text>
          </View>

          <Text style={styles.featureTitle}>Safe & Easy</Text>

          <Text style={styles.featureText}>
            Simple and reliable shopping.
          </Text>
        </View>
      </View>

      {/* Get Started */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/role')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get Started</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      {/* How It Works */}
      <View style={styles.howSection}>
        <Text style={styles.sectionTitle}>How NearBuy Works</Text>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>

          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Post your need</Text>
            <Text style={styles.stepText}>
              Tell us what product you're looking for.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>

          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Shops send offers</Text>
            <Text style={styles.stepText}>
              Nearby shops respond with their prices.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>

          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose the best offer</Text>
            <Text style={styles.stepText}>
              Compare offers and buy from your preferred shop.
            </Text>
          </View>
        </View>
      </View>

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
    paddingTop: 55,
    paddingBottom: 35,
  },

  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 35,
  },

  hero: {
    marginBottom: 30,
  },

  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 18,
  },

  tagText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 42,
  },

  blueText: {
    color: '#2563EB',
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 25,
    color: '#6B7280',
    marginTop: 16,
    maxWidth: 360,
  },

  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 25,
  },

  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 155,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  icon: {
    fontSize: 20,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  featureText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#6B7280',
    marginTop: 5,
  },

  button: {
    height: 56,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
    marginLeft: 10,
  },

  howSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  stepText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 2,
  },

  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
  },
});