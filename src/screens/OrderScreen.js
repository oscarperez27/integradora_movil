// src/screens/Orders.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { API } from '../api/apiConfig';

const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOrderId, setModalOrderId] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  // Modal para crear nueva orden
  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [newProducts, setNewProducts] = useState([{ sku: '', quantity: '1' }]);
  const [newStatus, setNewStatus] = useState('Pending');

  // Helper to get token
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token || '';
  };

  // Fetch data (orders, users, products)
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch(`${API}/api/order/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/product/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const ordersJson = await ordersRes.json();
      const usersJson = await usersRes.json();
      const productsJson = await productsRes.json();

      const ordersList = ordersJson.orders || ordersJson.orderList || ordersJson.data || [];
      setOrders(ordersList);
      setFilteredOrders(ordersList);
      setUsers(usersJson);
      setProducts(productsJson);
      setError('');
    } catch (err) {
      setError('Error cargando los datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUserNameById = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? (user.firstName || 'Usuario') : 'Desconocido';
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = orders.filter((order) => {
      const userName = getUserNameById(order.IDUser).toLowerCase();
      return userName.includes(term.toLowerCase());
    });
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (id, Status) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/order/order/update/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ Status }),
      });
      if (!res.ok) throw new Error('Error actualizando orden');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la orden');
    }
  };

  const handleCancelOrder = async (id) => {
  try {
    const token = await getToken();
    const res = await fetch(`${API}/api/order/delete/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!res.ok) throw new Error('Error cancelando orden');
    
    fetchData();
  } catch (err) {
    Alert.alert('Error', 'No se pudo cancelar la orden');
  }
};

  const confirmAction = (id, action) => {
    setModalOrderId(id);
    setModalAction(action);
    setModalVisible(true);
  };

  const executeAction = () => {
   if (modalAction === 'Cancelar') {
  handleCancelOrder(modalOrderId); // ✅ esto es lo correcto
} else if (modalAction === 'Pagar') {
      handleStatusChange(modalOrderId, 'Payed');
    }
    setModalVisible(false);
  };

  // FUNCIONES PARA CREAR NUEVA ORDEN:

  const handleNewProductChange = (index, field, value) => {
    const updatedProducts = [...newProducts];
    updatedProducts[index][field] = value;
    setNewProducts(updatedProducts);
  };

  const addNewProductField = () => {
    setNewProducts([...newProducts, { sku: '', quantity: '1' }]);
  };

  const removeNewProductField = (index) => {
    if (newProducts.length === 1) return; // mínimo 1 producto
    const updatedProducts = newProducts.filter((_, i) => i !== index);
    setNewProducts(updatedProducts);
  };

  const submitNewOrder = async () => {
    // Validar que no haya SKU vacío y que cantidad sea > 0
    for (const p of newProducts) {
      if (!p.sku.trim()) {
        Alert.alert('Error', 'Todos los productos deben tener un SKU');
        return;
      }
      if (!p.quantity || isNaN(p.quantity) || Number(p.quantity) <= 0) {
        Alert.alert('Error', 'La cantidad debe ser un número mayor a 0');
        return;
      }
    }

    try {
      const token = await getToken();
      const body = {
        Status: newStatus,
        Products: newProducts.map(p => ({ sku: p.sku.trim(), quantity: Number(p.quantity) })),
      };

      const res = await fetch(`${API}/api/order/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error creando orden');
      }

      Alert.alert('Éxito', 'Orden creada');
      setModalCreateVisible(false);
      setNewProducts([{ sku: '', quantity: '1' }]); // reset form
      fetchData();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo crear la orden');
    }
  };

  const renderOrder = ({ item }) => {
    const subtotal = item.Products?.reduce((acc, p) => {
      const prod = products.find((prod) => prod.sku === p.sku || prod._id === p.productId);
      const price = prod ? prod.price : 0;
      return acc + price * (p.quantity || 1);
    }, 0) || 0;
    const total = +(subtotal * 1.16).toFixed(2);

    const dateString = item.createDate
      ? new Date(item.createDate).toLocaleDateString()
      : 'Fecha desconocida';

    return (
      <View style={styles.card}>
        <Text style={styles.title}>Creador: {getUserNameById(item.IDUser)}</Text>
        <Text>Estado: {item.Status}</Text>
        <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text>Total: ${total.toFixed(2)}</Text>
        <Text>Fecha: {dateString}</Text>
        <Text style={styles.subtitle}>Productos:</Text>
        {item.Products?.map((p, i) => {
          const prod = products.find((prod) => prod.sku === p.sku || prod._id === p.productId);
          return (
            <Text key={i}>
              - {prod ? prod.name : p.sku}: {p.quantity} x ${prod?.price.toFixed(2) || '0.00'}
            </Text>
          );
        })}
        {item.Status === 'Pending' && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => confirmAction(item._id, 'Pagar')} style={styles.buttonPay}>
              <Text style={styles.buttonText}>Marcar como Pagada</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmAction(item._id, 'Cancelar')} style={styles.buttonCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title="Órdenes" navigation={navigation} />

      {/* Botón crear nueva orden */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={() => setModalCreateVisible(true)}
          style={[styles.buttonPay, { paddingVertical: 12 }]}
        >
          <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Crear Nueva Orden</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#D90429" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.container}>
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar por creador"
      value={searchTerm}
      onChangeText={handleSearch}
      autoCorrect={false}
      autoCapitalize="none"
      clearButtonMode="while-editing"
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}

    <FlatList
      data={filteredOrders}
      keyExtractor={(item) => item._id}
      renderItem={renderOrder}
      contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
    />
  </View>
      )}

      {/* Modal Confirmar acción (Pagar/Cancelar) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Confirmar acción: {modalAction}?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={executeAction} style={styles.buttonPay}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.buttonCancel}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Crear nueva orden */}
      <Modal
        visible={modalCreateVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCreateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
              Crear Nueva Orden
            </Text>
            <ScrollView>
              {newProducts.map((p, i)=> (
<View key={i} style={{ marginBottom: 12 }}>
<Text>Producto:</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={p.sku}
    onValueChange={(value) => handleNewProductChange(i, 'sku', value)}
  >
    
    {products.map((prod) => (
      <Picker.Item key={prod.sku} label={prod.name} value={prod.sku} />
    ))}
  </Picker>
</View>
<Text>Cantidad:</Text>
<TextInput
style={styles.searchInput}
value={p.quantity}
keyboardType="numeric"
onChangeText={(text) => handleNewProductChange(i, 'quantity', text)}
/>
{newProducts.length > 1 && (
<TouchableOpacity onPress={() => removeNewProductField(i)}>
<Text style={{ color: 'red', marginTop: 4 }}>Eliminar producto</Text>
</TouchableOpacity>
)}
</View>
))}
          <TouchableOpacity onPress={addNewProductField}>
            <Text style={{ color: '#D90429', marginBottom: 12 }}>+ Agregar otro producto</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={submitNewOrder} style={styles.buttonPay}>
              <Text style={styles.buttonText}>Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalCreateVisible(false)} style={styles.buttonCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
</SafeAreaView>
    );
};

const styles = StyleSheet.create({
container: { paddingHorizontal: 16, paddingBottom: 100 },
searchInput: {
backgroundColor: '#fff',
padding: 10,
borderRadius: 10,
marginBottom: 10,
borderColor: '#ccc',
borderWidth: 1,
},
card: {
backgroundColor: '#fff',
borderRadius: 12,
padding: 16,
marginVertical: 10,
elevation: 2,
},
title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
subtitle: { fontWeight: 'bold', marginTop: 10 },
actions: {
flexDirection: 'row',
justifyContent: 'space-around',
marginTop: 10,
},
buttonPay: {
backgroundColor: '#D90429',
padding: 8,
borderRadius: 8,
},
buttonCancel: {
backgroundColor: '#D90429',
padding: 8,
borderRadius: 8,
},
buttonText: {
color: '#fff',
fontWeight: 'bold',
},
modalOverlay: {
flex: 1,
backgroundColor: 'rgba(0,0,0,0.5)',
justifyContent: 'center',
padding: 20,
},
modalContent: {
backgroundColor: '#fff',
borderRadius: 12,
padding: 20,
},
modalText: {
fontSize: 16,
fontWeight: 'bold',
marginBottom: 12,
textAlign: 'center',
},
modalButtons: {
flexDirection: 'row',
justifyContent: 'space-around',
marginTop: 12,
},
pickerContainer: {
  backgroundColor: '#fff',
  borderRadius: 10,
  borderColor: '#ccc',
  borderWidth: 1,
  marginBottom: 10,
},

error: { color: 'red', textAlign: 'center' },
});

export default Orders;      


