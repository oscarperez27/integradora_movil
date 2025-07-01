// src/screens/AccessControlScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const initialCurrentlyInsideData = [
  {
    id: 'in1',
    photo: require('../../assets/yooo.jpg'),
    name: 'Ana López',
    entryTime: '08:15 AM',
    membershipType: 'Premium',
  },
  {
    id: 'in2',
    photo: require('../../assets/yooo.jpg'),
    name: 'Carlos Martínez',
    entryTime: '08:32 AM',
    membershipType: 'Básica',
  },
  {
    id: 'in3',
    photo: require('../../assets/yooo.jpg'),
    name: 'Laura Fernández',
    entryTime: '09:01 AM',
    membershipType: 'Estudiante',
  },
];

const initialExitRegisterData = [
  {
    id: 'out1',
    photo: require('../../assets/yooo.jpg'),
    name: 'Juan Pérez',
    exitTime: '10:30 AM',
    timeInGym: '2h 15min',
  },
  {
    id: 'out2',
    photo: require('../../assets/yooo.jpg'),
    name: 'María González',
    exitTime: '11:45 AM',
    timeInGym: '1h 30min',
  },
  {
    id: 'out3',
    photo: require('../../assets/yooo.jpg'),
    name: 'Pedro Sánchez',
    exitTime: '12:20 PM',
    timeInGym: '3h 05min',
  },
];

const initialAccessHistoryData = [
  {
    id: 'h1',
    date: '2025-05-31',
    entryTime: '07:30 AM',
    exitTime: '08:45 AM',
    memberName: 'Roberto Pérez',
    method: 'Check-in',
    status: 'allowed',
  },
  {
    id: 'h2',
    date: '2025-05-31',
    entryTime: '07:35 AM',
    exitTime: '-',
    memberName: 'Visitante',
    method: 'Check-in',
    status: 'denied',
  },
  {
    id: 'h3',
    date: '2025-05-30',
    entryTime: '18:05 PM',
    exitTime: '19:30 PM',
    memberName: 'Sofía Gómez',
    method: 'Check-in',
    status: 'allowed',
  },
];

const AccessControlScreen = ({ navigation }) => {
  const [currentlyInside] = useState(initialCurrentlyInsideData);
  const [exitRegister] = useState(initialExitRegisterData);
  const [accessHistoryDisplay, setAccessHistoryDisplay] = useState(initialAccessHistoryData);

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const currentPeopleCount = initialCurrentlyInsideData.length;
  const accessesTodayCount = initialAccessHistoryData.filter(item => item.status === 'allowed').length;
  const exitsTodayCount = initialExitRegisterData.length;

  useEffect(() => {
    const filteredHistory = initialAccessHistoryData.filter(record => {
      const matchesMember = record.memberName.toLowerCase().includes(filterMember.toLowerCase());
      const matchesStatus = filterStatus === '' || record.status === filterStatus;

      const recordDate = new Date(record.date);
      const start = filterStartDate ? new Date(filterStartDate) : null;
      const end = filterEndDate ? new Date(filterEndDate) : null;

      const matchesStartDate = !start || recordDate >= start;
      const matchesEndDate = !end || recordDate <= end;

      return matchesMember && matchesStatus && matchesStartDate && matchesEndDate;
    });

    setAccessHistoryDisplay(filteredHistory);
  }, [filterStartDate, filterEndDate, filterMember, filterStatus]);

  const handleDetailsPress = (memberName) => {
    Alert.alert(
      'Detalles de Acceso',
      `Mostrando detalles para: ${memberName}`,
      [{ text: 'OK' }]
    );
  };

  const handleEditPress = (memberName) => {
    Alert.alert(
      'Editar Registro',
      `¿Desea editar el registro de ${memberName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => console.log('Editar registro') }
      ]
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCellFlex1}>{item.date}</Text>
      <Text style={styles.tableCellFlex1}>{item.entryTime}</Text>
      <Text style={styles.tableCellFlex1}>{item.exitTime}</Text>
      <Text style={styles.tableCellFlex2}>{item.memberName}</Text>
      <Text style={styles.tableCellFlex1}>{item.method}</Text>
      <View style={styles.tableCellFlex1}>
        <Text style={[styles.statusPill, styles[`status${item.status}`]]}>
          {item.status === 'allowed' ? 'Permitido' : 'Denegado'}
        </Text>
      </View>
      <View style={styles.tableCellActions}>
        <TouchableOpacity onPress={() => handleDetailsPress(item.memberName)}>
          <MaterialCommunityIcons name="eye-outline" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditPress(item.memberName)}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#f39c12" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.accessControlArea}>
      <Text style={styles.pageTitle}>Gestión y Monitoreo de Acceso</Text>

      <View style={styles.quickStatsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentPeopleCount}</Text>
          <Text style={styles.statLabel}>Personas Actualmente Dentro</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{accessesTodayCount}</Text>
          <Text style={styles.statLabel}>Accesos del Día</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{exitsTodayCount}</Text>
          <Text style={styles.statLabel}>Salidas del Día</Text>
        </View>
      </View>

      <Text style={styles.sectionSubtitle}>Registro de Entrada</Text>
      <View style={styles.addMemberBox}>
        <Text style={styles.addMemberBoxTitle}>Miembros</Text>
        <TouchableOpacity 
          style={styles.btnAdd} 
          onPress={() => Alert.alert('Agregar Miembro', 'Funcionalidad para agregar nuevo miembro')}
        >
          <MaterialCommunityIcons name="account-plus" size={20} color="white" />
          <Text style={styles.btnAddText}>Nuevo Miembro</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeaderPhoto}>Foto</Text>
          <Text style={styles.tableHeaderNameLarge}>Nombre</Text>
          <Text style={styles.tableHeaderFlex1}>Entrada</Text>
          <Text style={styles.tableHeaderFlex1}>Membresía</Text>
          <Text style={styles.tableHeaderActions}>Acciones</Text>
        </View>
        
        {currentlyInside.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Image source={item.photo} style={styles.memberPhotoSm} />
            <Text style={styles.tableCellNameLarge}>{item.name}</Text>
            <Text style={styles.tableCellFlex1}>{item.entryTime}</Text>
            <Text style={styles.tableCellFlex1}>{item.membershipType}</Text>
            <View style={styles.tableCellActions}>
              <TouchableOpacity onPress={() => Alert.alert('Registrar Salida', `Registrar salida para ${item.name}`)}>
                <MaterialCommunityIcons name="exit-run" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionSubtitle}>Registro de Salida</Text>
      <View style={styles.addMemberBox}>
        <Text style={styles.addMemberBoxTitle}>Registrar salida</Text>
        <TouchableOpacity 
          style={styles.btnAdd} 
          onPress={() => Alert.alert('Registrar Salida', 'Funcionalidad para registrar salida')}
        >
          <MaterialCommunityIcons name="logout" size={20} color="white" />
          <Text style={styles.btnAddText}>Registrar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeaderPhoto}>Foto</Text>
          <Text style={styles.tableHeaderNameLarge}>Nombre</Text>
          <Text style={styles.tableHeaderFlex1}>Salida</Text>
          <Text style={styles.tableHeaderFlex1}>Tiempo</Text>
        </View>
        
        {exitRegister.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Image source={item.photo} style={styles.memberPhotoSm} />
            <Text style={styles.tableCellNameLarge}>{item.name}</Text>
            <Text style={styles.tableCellFlex1}>{item.exitTime}</Text>
            <Text style={styles.tableCellFlex1}>{item.timeInGym}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionSubtitle}>Histórico de Accesos</Text>
      <View style={styles.filtersBar}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Desde:</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            value={filterStartDate}
            onChangeText={setFilterStartDate}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hasta:</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            value={filterEndDate}
            onChangeText={setFilterEndDate}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Miembro:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre o ID"
            value={filterMember}
            onChangeText={setFilterMember}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Estado:</Text>
          <Picker
            selectedValue={filterStatus}
            onValueChange={(itemValue) => setFilterStatus(itemValue)}
            style={styles.picker}
            dropdownIconColor="#7f8c8d"
          >
            <Picker.Item label="Todos" value="" />
            <Picker.Item label="Permitido" value="allowed" />
            <Picker.Item label="Denegado" value="denied" />
          </Picker>
        </View>
      </View>

      <View style={styles.tableHeaderRow}>
        <Text style={styles.tableHeaderFlex1}>Fecha</Text>
        <Text style={styles.tableHeaderFlex1}>Entrada</Text>
        <Text style={styles.tableHeaderFlex1}>Salida</Text>
        <Text style={styles.tableHeaderFlex2}>Miembro</Text>
        <Text style={styles.tableHeaderFlex1}>Método</Text>
        <Text style={styles.tableHeaderFlex1}>Estado</Text>
        <Text style={styles.tableHeaderActions}>Acciones</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Control de Acceso" navigation={navigation} />
      
      <FlatList
        data={accessHistoryDisplay}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
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
  accessControlArea: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  pageTitle: {
    fontSize: 24,
    color: '#1A1A1A',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  quickStatsBar: {
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
  sectionSubtitle: {
    fontSize: 18,
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 15,
    fontWeight: '600',
  },
  addMemberBox: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  addMemberBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  btnAdd: {
    backgroundColor: '#D90429',
    padding: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAddText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  tableContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
    letterSpacing: 0.5,
  },
  tableHeaderPhoto: {
    width: 50,
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
  },
  tableHeaderNameLarge: {
    flex: 2,
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
  },
  tableHeaderFlex1: {
    flex: 1,
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
  },
  tableHeaderFlex2: {
    flex: 2,
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
  },
  tableHeaderActions: {
    width: 80,
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
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
  tableCellFlex1: {
    flex: 1,
    fontSize: 14,
    color: '#4A4A4A',
  },
  tableCellFlex2: {
    flex: 2,
    fontSize: 14,
    color: '#4A4A4A',
  },
  tableCellNameLarge: {
    flex: 2,
    fontSize: 14,
    color: '#4A4A4A',
  },
  tableCellActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 80,
  },
  memberPhotoSm: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusallowed: {
    backgroundColor: '#d5f5e3',
    color: '#27ae60',
  },
  statusdenied: {
    backgroundColor: '#fadbd8',
    color: '#e74c3c',
  },
  filtersBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  formGroup: {
    width: '48%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    fontSize: 14,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
});

export default AccessControlScreen;