// src/screens/InventoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const initialInventoryData = [
  { sku: 'PROT-WH001', name: 'Proteína Whey Gold Standard 2lb', category: 'Proteínas', stock: 25, price: '$850.00', status: 'in-stock' },
  { sku: 'CREA-MON005', name: 'Creatina Monohidratada 300g', category: 'Creatinas', stock: 8, price: '$450.00', status: 'low-stock' },
  { sku: 'PREW-C4001', name: 'C4 Pre-Entreno Explosivo', category: 'Pre-Entrenos', stock: 0, price: '$600.00', status: 'out-of-stock' },
  { sku: 'ACC-SHK003', name: 'Shaker Prime Gym Logo', category: 'Accesorios', stock: 50, price: '$150.00', status: 'in-stock' },
  { sku: 'ROPA-TSH01', name: 'Playera Dry-Fit', category: 'Ropa', stock: 12, price: '$300.00', status: 'low-stock' },
  { sku: 'SUP-BCAA001', name: 'BCAAs Aminoácidos', category: 'Proteínas', stock: 18, price: '$550.00', status: 'in-stock' },
];

const InventoryScreen = ({ navigation }) => {
  const [products, setProducts] = useState(initialInventoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStockStatus, setFilterStockStatus] = useState('');

  useEffect(() => {
    const filtered = initialInventoryData.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || product.category === filterCategory;
      const matchesStockStatus = !filterStockStatus || product.status === filterStockStatus;
      return matchesSearch && matchesCategory && matchesStockStatus;
    });
    setProducts(filtered);
  }, [searchQuery, filterCategory, filterStockStatus]);

  const handleEditProduct = (productName) => {
    Alert.alert('Editar Producto', `¿Desea editar el producto ${productName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Editar', onPress: () => console.log('Editar producto') },
    ]);
  };

  const handleDeleteProduct = (productName) => {
    Alert.alert('Eliminar Producto', `¿Está seguro de eliminar ${productName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Eliminar producto') },
    ]);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'in-stock': return styles.statusInStock;
      case 'low-stock': return styles.statusLowStock;
      case 'out-of-stock': return styles.statusOutOfStock;
      default: return {};
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, styles.cellSku]}>{item.sku}</Text>
      <Text style={[styles.cell, styles.cellName]}>{item.name}</Text>
      <Text style={[styles.cell, styles.cellCategory]}>{item.category}</Text>
      <Text style={[styles.cell, styles.cellStock]}>{item.stock}</Text>
      <Text style={[styles.cell, styles.cellPrice]}>{item.price}</Text>
      <Text style={[styles.cell, styles.cellStatus]}>
        <Text style={[styles.stockStatusPill, getStatusStyle(item.status)]}>
          {item.status === 'in-stock' ? 'En Stock' : item.status === 'low-stock' ? 'Stock Bajo' : 'Agotado'}
        </Text>
      </Text>
      <View style={[styles.cell, styles.cellActions]}>
        <TouchableOpacity onPress={() => handleEditProduct(item.name)}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.name)}>
          <MaterialCommunityIcons name="delete-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.inventoryArea}>
      <Text style={styles.pageTitle}>Control de Inventario</Text>
      <Text style={styles.pageSubtitle}>Suplementos y Productos</Text>

      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => Alert.alert('Agregar Producto', 'Funcionalidad para agregar nuevo producto')}
        >
          <MaterialCommunityIcons name="plus" size={20} color="white" />
          <Text style={styles.btnPrimaryText}>Añadir Producto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersBar}>
        <View style={styles.searchGroup}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o SKU"
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <MaterialCommunityIcons name="magnify" size={24} color="#95a5a6" style={styles.searchIcon} />
        </View>

        <View style={styles.filterGroup}>
          <Picker
            selectedValue={filterCategory}
            onValueChange={setFilterCategory}
            style={styles.picker}
            dropdownIconColor="#7f8c8d"
          >
            <Picker.Item label="Todas las categorías" value="" />
            <Picker.Item label="Proteínas" value="Proteínas" />
            <Picker.Item label="Creatinas" value="Creatinas" />
            <Picker.Item label="Pre-Entrenos" value="Pre-Entrenos" />
            <Picker.Item label="Ropa" value="Ropa" />
            <Picker.Item label="Accesorios" value="Accesorios" />
          </Picker>
        </View>

        <View style={styles.filterGroup}>
          <Picker
            selectedValue={filterStockStatus}
            onValueChange={setFilterStockStatus}
            style={styles.picker}
            dropdownIconColor="#7f8c8d"
          >
            <Picker.Item label="Todos los estados" value="" />
            <Picker.Item label="En Stock" value="in-stock" />
            <Picker.Item label="Stock Bajo" value="low-stock" />
            <Picker.Item label="Agotado" value="out-of-stock" />
          </Picker>
        </View>
      </View>

      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.cell, styles.cellSku]}>SKU</Text>
            <Text style={[styles.cell, styles.cellName]}>Producto</Text>
            <Text style={[styles.cell, styles.cellCategory]}>Categoría</Text>
            <Text style={[styles.cell, styles.cellStock]}>Stock</Text>
            <Text style={[styles.cell, styles.cellPrice]}>Precio</Text>
            <Text style={[styles.cell, styles.cellStatus]}>Estado</Text>
            <Text style={[styles.cell, styles.cellActions]}>Acciones</Text>
          </View>
          {products.map(product => (
            <View key={product.sku}>
              {renderItem({ item: product })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Inventario" navigation={navigation} />
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={<ListHeader />}
        keyExtractor={() => Math.random().toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  flatListContent: { paddingBottom: 30, flexGrow: 1 },
  inventoryArea: { padding: 20, backgroundColor: '#f0f0f0' },
  pageTitle: { fontSize: 24, color: '#1A1A1A', fontWeight: 'bold', marginBottom: 5 },
  pageSubtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
  actionsBar: { marginBottom: 15 },
  btnPrimary: {
    backgroundColor: '#D90429',
    padding: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  filtersBar: { marginBottom: 15 },
  searchGroup: { position: 'relative', marginBottom: 15 },
  searchInput: {
    padding: 12,
    paddingLeft: 40,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: { position: 'absolute', left: 10, top: 12 },
  filterGroup: { marginBottom: 15 },
  picker: { borderWidth: 1, borderColor: '#DCDCDC', borderRadius: 5, backgroundColor: '#FFFFFF' },
  tableContainer: { backgroundColor: '#fff', borderRadius: 5, overflow: 'hidden' },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
  },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  cell: { paddingHorizontal: 8, textAlign: 'left', fontSize: 14, color: '#4A4A4A' },
  cellSku: { width: 100 },
  cellName: { width: 180 },
  cellCategory: { width: 100 },
  cellStock: { width: 60 },
  cellPrice: { width: 80 },
  cellStatus: { width: 100 },
  cellActions: { width: 100, flexDirection: 'row', justifyContent: 'space-around' },
  stockStatusPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusInStock: { backgroundColor: '#d5f5e3', color: '#27ae60' },
  statusLowStock: { backgroundColor: '#fef9e7', color: '#f39c12' },
  statusOutOfStock: { backgroundColor: '#fadbd8', color: '#e74c3c' },
});

export default InventoryScreen;