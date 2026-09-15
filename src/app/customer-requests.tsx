import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CustomerRequestsScreen() {
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

      <Text style={styles.title}>Customer Requests</Text>

      <Text style={styles.subtitle}>
        Find nearby requests and send your best offer.
      </Text>

      {/* Request 1 */}

      <View style={styles.requestCard}>
        <View style={styles.topRow}>
          <View style={styles.productArea}>
            <Text style={styles.product}>
              🎧 Bluetooth Headphones
            </Text>

            <Text style={styles.customer}>
              Customer • Andheri West
            </Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>
              Open
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          Looking for good quality Bluetooth headphones
          with clear sound and comfortable ear cushions.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Budget</Text>
          <Text style={styles.budget}>₹2,000</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantity</Text>
          <Text style={styles.infoValue}>1</Text>
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => router.push('/request-details')}
        >
          <Text style={styles.viewButtonText}>
            View Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Request 2 */}

      <View style={styles.requestCard}>
        <View style={styles.topRow}>
          <View style={styles.productArea}>
            <Text style={styles.product}>
              ⌨️ Wireless Keyboard
            </Text>

            <Text style={styles.customer}>
              Customer • Andheri West
            </Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>
              Open
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          Need a wireless keyboard suitable for
          regular computer use.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Budget</Text>
          <Text style={styles.budget}>₹1,500</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantity</Text>
          <Text style={styles.infoValue}>1</Text>
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => router.push('/request-details')}
        >
          <Text style={styles.viewButtonText}>
            View Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Request 3 */}

      <View style={styles.requestCard}>
        <View style={styles.topRow}>
          <View style={styles.productArea}>
            <Text style={styles.product}>
              🔊 Bluetooth Speaker
            </Text>

            <Text style={styles.customer}>
              Customer • Andheri West
            </Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>
              Open
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          Looking for a portable Bluetooth speaker
          with good battery life.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Budget</Text>
          <Text style={styles.budget}>₹3,000</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantity</Text>
          <Text style={styles.infoValue}>1</Text>
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => router.push('/request-details')}
        >
          <Text style={styles.viewButtonText}>
            View Request
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        New customer requests will appear here.
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

  requestCard: {
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

  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },

  activeText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
  },

  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
    marginTop: 15,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },

  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  budget: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  viewButton: {
    height: 46,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
  },
});