import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {API} from '../api/apiConfig'; 

const defaultPhoto = require('../../assets/yooo.jpg');

const AccessControlScreen = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formInitial, setFormInitial] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const [personCountSummary, setPersonCountSummary] = useState({
    actuales: 0,
    entradas: 0,
    salidas: 0,
  });

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      const [clientsRes, countRes] = await Promise.all([
        fetch(`${API}/api/client/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/sensor/people-countToday`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const clientsData = await clientsRes.json();
      const countData = await countRes.json();

      setMembers(
        clientsData.map((c) => ({
          id: c._id,
          name: `${c.nombre} ${c.apellidos}`,
          membershipType: c.tipoMembresia,
          photo: defaultPhoto,
        }))
      );
      setPersonCountSummary(countData);
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al cargar los datos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (member = {}, index = null) => {
    setFormInitial(member);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleFormSave = async (member) => {
    const token = await AsyncStorage.getItem('token');
    const body = {
      nombre: member.name.split(' ')[0],
      apellidos: member.name.split(' ').slice(1).join(' ') || 'Apellido',
      correo: `auto-${Date.now()}@correo.com`,
      telefono: '0000000000',
      fechaNacimiento: '2000-01-01',
      telefonoEmergencia: '0000000000',
      tipoMembresia: member.membershipType,
    };

    try {
      if (editIndex !== null) {
        const res = await fetch(`${API}/api/client/update/${member.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const updated = await res.json();
        const updatedMember = {
          id: member.id,
          name: `${updated.client.nombre} ${updated.client.apellidos}`,
          membershipType: updated.client.tipoMembresia,
          photo: defaultPhoto,
        };
        const updatedList = [...members];
        updatedList[editIndex] = updatedMember;
        setMembers(updatedList);
      } else {
        const res = await fetch(`${API}/api/client/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const { client } = await res.json();
        setMembers([
          ...members,
          {
            id: client._id,
            name: `${client.nombre} ${client.apellidos}`,
            membershipType: client.tipoMembresia,
            photo: defaultPhoto,
          },
        ]);
      }
      setShowForm(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDeleteMember = (idx) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Deseas dar de baja a este miembro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => confirmDelete(idx),
        },
      ]
    );
  };

  const confirmDelete = async (idx) => {
    const token = await AsyncStorage.getItem('token');
    const member = members[idx];
    try {
      await fetch(`${API}/api/client/delete/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const updated = [...members];
      updated.splice(idx, 1);
      setMembers(updated);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Gestion de Clientes" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.flatListContent}>
        <View style={styles.accessControlArea}>
          <Text style={styles.pageTitle}>Gestión y Monitoreo de Acceso</Text>

          <View style={styles.quickStatsBar}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{personCountSummary.actuales}</Text>
              <Text style={styles.statLabel}>Personas Actualmente Dentro</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{personCountSummary.entradas}</Text>
              <Text style={styles.statLabel}>Entradas Hoy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{personCountSummary.salidas}</Text>
              <Text style={styles.statLabel}>Salidas Hoy</Text>
            </View>
          </View>

          <Text style={styles.sectionSubtitle}>Registro de Usuarios</Text>
          <View style={styles.addMemberBox}>
            <Text style={styles.addMemberBoxTitle}>Miembros</Text>
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => openForm()}
            >
              <MaterialCommunityIcons name="account-plus" size={20} color="white" />
              <Text style={styles.btnAddText}>Nuevo Miembro</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <View style={styles.cellPhoto}><Text style={styles.tableHeader}>Foto</Text></View>
              <View style={styles.cellName}><Text style={styles.tableHeader}>Nombre</Text></View>
              <View style={styles.cellMembership}><Text style={styles.tableHeader}>Membresía</Text></View>
              <View style={styles.cellActions}><Text style={styles.tableHeader}>Acciones</Text></View>
            </View>

            {members.map((item, idx) => (
              <View key={item.id} style={styles.tableRow}>
                <View style={styles.cellPhoto}><Image source={item.photo} style={styles.memberPhotoSm} /></View>
                <View style={styles.cellName}><Text style={styles.tableCell}>{item.name}</Text></View>
                <View style={styles.cellMembership}><Text style={styles.tableCell}>{item.membershipType}</Text></View>
                <View style={styles.cellActions}>
                  <TouchableOpacity onPress={() => openForm(item, idx)}>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteMember(idx)}>
                    <MaterialCommunityIcons name="delete-outline" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{formInitial.id ? 'Editar Miembro' : 'Nuevo Miembro'}</Text>
            <TextInput
              placeholder="Nombre completo"
              value={formInitial.name || ''}
              onChangeText={(text) => setFormInitial({ ...formInitial, name: text })}
              style={styles.input}
            />
            <Text style={styles.label}>Tipo de membresía</Text>
            <Picker
              selectedValue={formInitial.membershipType || 'básica'}
              onValueChange={(itemValue) =>
                setFormInitial({ ...formInitial, membershipType: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item label="Básica" value="básica" />
              <Picker.Item label="Estudiante" value="estudiante" />
            </Picker>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnSave} onPress={() => handleFormSave(formInitial)}>
                <Text style={styles.btnAddText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowForm(false)}>
                <Text style={styles.btnAddText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  flexWrap: 'wrap',
  gap: 10,
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
  width: '30%',
  minWidth: 100,
  alignItems: 'center',
  flexGrow: 1,
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
 modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnSave: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
  },
  btnCancel: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
  },
});

export default AccessControlScreen;
