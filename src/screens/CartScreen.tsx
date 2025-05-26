import React, {useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  // Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {CartContext, CartItem} from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export default function CartScreen({navigation}: Props) {
  const {
    cartItems,
    getTotalItems,
    getTotalPrice,
    clearCart,
    removeFromCart,
    addToCart,
    removeItemTotalFromCart,
  } = useContext(CartContext);

  

  const renderCartItem = ({item}: {item: CartItem}) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.product.image}}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.productPrice}>${item.product.price}.00</Text>

        {/* <Text style={styles.productQuantity}>{ item.quantity} QTY</Text> */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => removeFromCart(item.product.id)}>
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => addToCart(item.product)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 18 }}
        onPress={()=>removeItemTotalFromCart(item.product.id)}
        >🗑️</Text>

      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add some products to get started</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Items:</Text>
        <Text style={styles.summaryValue}>{getTotalItems()}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Price:</Text>
        <Text style={styles.summaryPrice}>${getTotalPrice().toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => {
          navigation.navigate('OrderSuccess');
          clearCart();
        }}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.product.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          {renderCartSummary()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    padding: 10,
  },

  imageContainer: {
    width: '40%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6, // if you want image edges rounded inside container
  },
  productInfo: {
    width: '60%',
    height: 120,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  productQuantity: {
    backgroundColor: '#e0e7ff',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
    flex: 1, // Take top half
  },

  productFooter: {
    flex: 1, // Take bottom half
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  productPrice: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#000',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 2,
  },

  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2.5,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },

  quantityButtonText: {
    fontSize: 18,
    color: '#3b82f6',
    textAlign: 'center',
    fontWeight: 600,
  },

  quantityText: {
    fontSize: 18,
    fontWeight: 600,
    backgroundColor: '#e0e7ff',
    padding: 5,
    color: '#000',
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  clearButton: {
    padding: 8,
  },

  emptyIcon: {
    fontSize: 60,
    opacity: 0.3,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 200,
  },
  iconText: {
    fontSize: 18,
    color: '#2C3E50',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  subtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  checkoutButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
