// src/screens/InventoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const initialInventoryData = [
  {
    sku: 'PROT-WH001',
    name: 'Proteína Whey Gold Standard 2lb',
    category: 'Proteínas',
    stock: 25,
    minAlert: 10,
    price: '$850.00',
    status: 'in-stock',
  },
  {
    sku: 'CREA-MON005',
    name: 'Creatina Monohidratada 300g',
    category: 'Creatinas',
    stock: 8,
    minAlert: 5,
    price: '$450.00',
    status: 'low-stock',
  },
  {
    sku: 'PREW-C4001',
    name: 'C4 Pre-Entreno Explosivo',
    category: 'Pre-Entrenos',
    stock: 0,
    minAlert: 5,
    price: '$600.00',
    status: 'out-of-stock',
  },
  {
    sku: 'ACC-SHK003',
    name: 'Shaker Prime Gym Logo',
    category: 'Accesorios',
    stock: 50,
    minAlert: 15,
    price: '$150.00',
    status: 'in-stock',
  },
  {
    sku: 'ROPA-TSH01',
    name: 'Playera Dry-Fit',
    category: 'Ropa',
    stock: 12,
    minAlert: 5,
    price: '$300.00',
    status: 'low-stock',
  },
  {
    sku: 'SUP-BCAA001',
    name: 'BCAAs Aminoácidos',
    category: 'Proteínas',
    stock: 18,
    minAlert: 7,
    price: '$550.00',
    status: 'in-stock',
  },
];

const InventoryScreen = ({ navigation }) => {
  const [products, setProducts] = useState(initialInventoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStockStatus, setFilterStockStatus] = useState('');

  const totalProducts = initialInventoryData.length;
  const lowStockProductsCount = initialInventoryData.filter(p => p.status === 'low-stock').length;
  const outOfStockProductsCount = initialInventoryData.filter(p => p.status === 'out-of-stock').length;

  useEffect(() => {
    const filtered = initialInventoryData.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === '' || product.category === filterCategory;
      const matchesStockStatus = filterStockStatus === '' || product.status === filterStockStatus;

      return matchesSearch && matchesCategory && matchesStockStatus;
    });
    setProducts(filtered);
  }, [searchQuery, filterCategory, filterStockStatus]);

  const handleEditProduct = (productName) => {
    Alert.alert(
      'Editar Producto',
      `¿Desea editar el producto ${productName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Editar', onPress: () => console.log('Editar producto') }
      ]
    );
  };

  const handleViewMovements = (productName) => {
    Alert.alert(
      'Movimientos de Inventario',
      `Mostrando movimientos para: ${productName}`,
      [{ text: 'OK' }]
    );
  };

  const handleDeleteProduct = (productName) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Está seguro de eliminar ${productName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Eliminar producto') }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.sku}</Text>
      <Text style={styles.tableCellName}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.category}</Text>
      <Text style={styles.tableCell}>{item.stock}</Text>
      <Text style={styles.tableCell}>{item.minAlert}</Text>
      <Text style={styles.tableCell}>{item.price}</Text>
      <View style={styles.tableCell}>
        <Text style={[styles.stockStatusPill, styles[`status${item.status}`]]}>
          {item.status === 'in-stock' ? 'En Stock' : 
           item.status === 'low-stock' ? 'Stock Bajo' : 'Agotado'}
        </Text>
      </View>
      <View style={styles.tableCellActions}>
        <TouchableOpacity onPress={() => handleEditProduct(item.name)}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleViewMovements(item.name)}>
          <MaterialCommunityIcons name="chart-box-outline" size={20} color="#9b59b6" />
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

      <View style={styles.inventoryStatsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Productos Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{lowStockProductsCount}</Text>
          <Text style={styles.statLabel}>Stock Bajo</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{outOfStockProductsCount}</Text>
          <Text style={styles.statLabel}>Agotados</Text>
        </View>
      </View>

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

      <View style={styles.tableHeaderRow}>
        <Text style={styles.tableHeader}>SKU</Text>
        <Text style={styles.tableHeaderName}>Producto</Text>
        <Text style={styles.tableHeader}>Categoría</Text>
        <Text style={styles.tableHeader}>Stock</Text>
        <Text style={styles.tableHeader}>Mínimo</Text>
        <Text style={styles.tableHeader}>Precio</Text>
        <Text style={styles.tableHeader}>Estado</Text>
        <Text style={styles.tableHeaderActions}>Acciones</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Inventario" navigation={navigation} />
      
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.sku}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContent}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  flatListContent: {
    paddingBottom: 30,
  },
  inventoryArea: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  pageTitle: {
    fontSize: 24,
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  inventoryStatsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  actionsBar: {
    marginBottom: 15,
  },
  btnPrimary: {
    backgroundColor: '#D90429',
    padding: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  filtersBar: {
    marginBottom: 15,
  },
  searchGroup: {
    position: 'relative',
    marginBottom: 15,
  },
  searchInput: {
    padding: 12,
    paddingLeft: 40,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 12,
  },
  filterGroup: {
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeader: {
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
    flex: 1,
    textAlign: 'left',
  },
  tableHeaderName: {
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
    flex: 2,
    textAlign: 'left',
  },
  tableHeaderActions: {
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
    flex: 1.5,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    fontSize: 14,
    color: '#4A4A4A',
    flex: 1,
  },
  tableCellName: {
    fontSize: 14,
    color: '#4A4A4A',
    flex: 2,
  },
  tableCellActions: {
    flexDirection: 'row',
    flex: 1.5,
    justifyContent: 'space-around',
  },
  stockStatusPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusinStock: {
    backgroundColor: '#d5f5e3',
    color: '#27ae60',
  },
  statuslowStock: {
    backgroundColor: '#fef9e7',
    color: '#f39c12',
  },
  statusoutOfStock: {
    backgroundColor: '#fadbd8',
    color: '#e74c3c',
  },
});

export default InventoryScreen;