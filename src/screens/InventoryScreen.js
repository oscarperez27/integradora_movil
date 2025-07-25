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

const InventoryScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStockStatus, setFilterStockStatus] = useState('');

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos basado en búsqueda y filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.categoria === filterCategory;
    
    // Determinar estado de stock
    let status = '';
    if (product.stock === 0) status = 'out-of-stock';
    else if (product.stock < 10) status = 'low-stock';
    else status = 'in-stock';
    
    const matchesStockStatus = !filterStockStatus || status === filterStockStatus;
    
    return matchesSearch && matchesCategory && matchesStockStatus;
  });

  const handleAddProduct = () => {
    // Aquí puedes implementar un modal o navegar a una pantalla de creación
    Alert.prompt(
      'Agregar Producto',
      'Ingrese el nombre del nuevo producto:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Agregar', 
          onPress: async (productName) => {
            if (productName) {
              try {
                const newProduct = {
                  name: productName,
                  price: 0,
                  stock: 0,
                  description: '',
                  sku: `SKU-${Math.random().toString(36).substr(2, 8)}`,
                  categoria: 'Proteínas'
                };
                await createProduct(newProduct);
                fetchProducts(); // Actualizar la lista
                Alert.alert('Éxito', 'Producto creado correctamente');
              } catch (error) {
                Alert.alert('Error', 'No se pudo crear el producto');
              }
            }
          }
        }
      ]
    );
  };

  const handleEditProduct = (product) => {
    Alert.prompt(
      'Editar Producto', 
      `Editar nombre de ${product.name}:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Guardar', 
          onPress: async (newName) => {
            if (newName && newName !== product.name) {
              try {
                await apiUpdateProduct(product._id, { name: newName });
                fetchProducts(); // Actualizar la lista
                Alert.alert('Éxito', 'Producto actualizado');
              } catch (error) {
                Alert.alert('Error', 'No se pudo actualizar el producto');
              }
            }
          }
        }
      ],
      'plain-text',
      product.name
    );
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Está seguro de eliminar ${product.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiDeleteProduct(product._id);
              fetchProducts(); // Actualizar la lista
              Alert.alert('Éxito', 'Producto eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const getStatusStyle = (stock) => {
    if (stock === 0) return styles.statusOutOfStock;
    if (stock < 10) return styles.statusLowStock;
    return styles.statusInStock;
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, styles.cellSku]}>{item.sku}</Text>
      <Text style={[styles.cell, styles.cellName]}>{item.name}</Text>
      <Text style={[styles.cell, styles.cellCategory]}>{item.categoria}</Text>
      <Text style={[styles.cell, styles.cellStock]}>{item.stock}</Text>
      <Text style={[styles.cell, styles.cellPrice]}>${item.price.toFixed(2)}</Text>
      <Text style={[styles.cell, styles.cellStatus]}>
        <Text style={[styles.stockStatusPill, getStatusStyle(item.stock)]}>
          {item.stock === 0 ? 'Agotado' : item.stock < 10 ? 'Stock Bajo' : 'En Stock'}
        </Text>
      </Text>
      <View style={[styles.cell, styles.cellActions]}>
        <TouchableOpacity onPress={() => handleEditProduct(item)}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item)}>
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
          onPress={handleAddProduct}
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

      {loading ? (
        <Text>Cargando productos...</Text>
      ) : (
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
            {filteredProducts.map(product => (
              <View key={product._id}>
                {renderItem({ item: product })}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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