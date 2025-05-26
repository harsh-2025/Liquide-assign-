import React, {useContext, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  findNodeHandle,
  UIManager,
  Animated,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {CartContext, Product} from '../context/CartContext';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// const {width} = Dimensions.get('window');

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Fashion Item ',
    price: 17,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: '2',
    name: 'Stylish Accessory ',
    price: 25,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: '3',
    name: 'Designer Collection',
    price: 35,
    image: 'https://picsum.photos/200/300',
  },
];

export default function HomeScreen({navigation}: Props) {
  const {addToCart, removeFromCart, getItemQuantity} = useContext(CartContext);
  const imageRefs = useRef<Map<string, View>>(new Map());
  const cartRef = useRef<View>(null);
  const [flyingImage, setFlyingImage] = useState<string | null>(null);
  const animation = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const [flyImageStyle, setFlyImageStyle] = useState({width: 0, height: 0});

  const animateToCart = (item: Product) => {
    const imgRef = imageRefs.current.get(item.id);
    const cartIconRef = cartRef.current;
    if (!imgRef || !cartIconRef) return;

    const measure = (
      ref: View,
    ): Promise<{x: number; y: number; width: number; height: number}> =>
      new Promise(resolve => {
        const handle = findNodeHandle(ref);
        if (handle) {
          UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
            resolve({x: pageX, y: pageY, width, height});
          });
        }
      });

    Promise.all([measure(imgRef), measure(cartIconRef)]).then(([from, to]) => {
      setFlyingImage(item.image);
      setFlyImageStyle({width: 50, height: 50});
      animation.setValue({x: from.x, y: from.y});

      Animated.timing(animation, {
        toValue: {x: to.x, y: to.y},
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setFlyingImage(null);
        addToCart(item);
      });
    });
  };
  const animateFromCart = (item: Product) => {
    const imgRef = imageRefs.current.get(item.id);
    const cartIconRef = cartRef.current;
    if (!imgRef || !cartIconRef) return;

    const measure = (
      ref: View,
    ): Promise<{x: number; y: number; width: number; height: number}> =>
      new Promise(resolve => {
        const handle = findNodeHandle(ref);
        if (handle) {
          UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
            resolve({x: pageX, y: pageY, width, height});
          });
        }
      });

    Promise.all([measure(imgRef), measure(cartIconRef)]).then(([from, to]) => {
      setFlyingImage(item.image);
      setFlyImageStyle({width: 50, height: 50});
      animation.setValue({x: to.x, y: to.y});

      Animated.timing(animation, {
        toValue: {x: from.x, y: from.y},
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setFlyingImage(null);
        removeFromCart(item.id);
      });
    });
  };
  const renderCartButton = (item: Product) => {
    const quantity = getItemQuantity(item.id);

    if (quantity === 0) {
      return (
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => animateToCart(item)}>
          <Text style={styles.iconText}>👜</Text>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => animateFromCart(item)}>
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => animateToCart(item)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProduct = ({item}: {item: Product}) => {
    return (
      <View style={styles.productCard}>
        <View
          style={styles.imageContainer}
          ref={ref => {
            if (ref) {
              imageRefs.current.set(item.id, ref);
            }
          }}>
          <Image
            source={{uri: item.image}}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>${item.price}.00</Text>
          {renderCartButton(item)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyProducts}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Cart')}
          ref={cartRef}>
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
      </View>

      {flyingImage && (
        <Animated.Image
          source={{uri: flyingImage}}
          style={[
            {
              position: 'absolute',
              width: flyImageStyle.width,
              height: flyImageStyle.height,
              borderRadius: 8,
              zIndex: 999,
              transform: animation.getTranslateTransform(),
            },
          ]}
        />
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

  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  iconText: {
    marginRight: 6,
    fontSize: 16,
    color:'blue'
  },
  addToCartText: {
    fontSize: 14,
    color: '#111',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  cartButton: {
    padding: 8,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  navIcon: {
    fontSize: 20,
  },
  flyingIcon: {
    fontSize: 30,
    textAlign: 'center',
  },
});
