// src/screens/AccessControlScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const initialCurrentlyInsideData = [
  {
    id: 'in1',
    photo: require('../../assets/yooo.jpg'),
    name: 'Ana López',
    membershipType: 'Premium',
  },
  {
    id: 'in2',
    photo: require('../../assets/yooo.jpg'),
    name: 'Carlos Martínez',
    membershipType: 'Básica',
  },
  {
    id: 'in3',
    photo: require('../../assets/yooo.jpg'),
    name: 'Laura Fernández',
    membershipType: 'Estudiante',
  },
];

const AccessControlScreen = ({ navigation }) => {
  const [currentlyInside] = useState(initialCurrentlyInsideData);
  const currentPeopleCount = currentlyInside.length;

  const handleEditMember = (name) => {
    Alert.alert('Editar Perfil', `¿Desea editar el perfil de ${name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Editar', onPress: () => console.log('Editar perfil') },
    ]);
  };

  const handleDeleteMember = (name) => {
    Alert.alert('Eliminar Perfil', `¿Está seguro de eliminar a ${name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => console.log('Eliminar miembro'),
      },
    ]);
  };

  const ListHeader = () => (
    <View style={styles.accessControlArea}>
      <Text style={styles.pageTitle}>Gestión y Monitoreo de Acceso</Text>

      <View style={styles.quickStatsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentPeopleCount}</Text>
          <Text style={styles.statLabel}>Personas Actualmente Dentro</Text>
        </View>
      </View>

      <Text style={styles.sectionSubtitle}>Registro de Usuarios</Text>
      <View style={styles.addMemberBox}>
        <Text style={styles.addMemberBoxTitle}>Miembros</Text>
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() =>
            Alert.alert('Agregar Miembro', 'Funcionalidad para agregar nuevo miembro')
          }
        >
          <MaterialCommunityIcons name="account-plus" size={20} color="white" />
          <Text style={styles.btnAddText}>Nuevo Miembro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.cellPhoto}>
            <Text style={styles.tableHeader}>Foto</Text>
          </View>
          <View style={styles.cellName}>
            <Text style={styles.tableHeader}>Nombre</Text>
          </View>
          <View style={styles.cellMembership}>
            <Text style={styles.tableHeader}>Membresía</Text>
          </View>
          <View style={styles.cellActions}>
            <Text style={styles.tableHeader}>Acciones</Text>
          </View>
        </View>

        {currentlyInside.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <View style={styles.cellPhoto}>
              <Image source={item.photo} style={styles.memberPhotoSm} />
            </View>
            <View style={styles.cellName}>
              <Text style={styles.tableCell}>{item.name}</Text>
            </View>
            <View style={styles.cellMembership}>
              <Text style={styles.tableCell}>{item.membershipType}</Text>
            </View>
            <View style={styles.cellActions}>
              <TouchableOpacity onPress={() => handleEditMember(item.name)}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#3498db" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteMember(item.name)}>
                <MaterialCommunityIcons name="delete-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Control de Acceso" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.flatListContent}>
        <ListHeader />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  flatListContent: {
    paddingBottom: 30,
    flexGrow: 1,
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
  tableHeader: {
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableCell: {
    fontSize: 14,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  memberPhotoSm: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cellPhoto: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  cellName: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  cellMembership: {
    flex: 1.5,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  cellActions: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default AccessControlScreen;
