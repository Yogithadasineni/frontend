
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Image, StyleSheet,
  TouchableOpacity, Modal, TextInput, Alert
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const SERVER = 'http://10.98.130.113:3000';

export default function ManageEmployee() {
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [trainingText, setTrainingText] = useState('');
  const [qrLink, setQrLink] = useState(null);

  const fetchEmployees = () => {
    fetch(`${SERVER}/api/employees/all`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.empid - b.empid);
        setEmployees(sorted);
      })
      .catch(err => console.error('Failed to load employees:', err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    if (result.didCancel || !result.assets?.length) return;

    const asset = result.assets[0];
    setSelectedEmp(prev => ({
      ...prev,
      photo: {
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
        type: asset.type || 'image/jpeg'
      }
    }));
  };

  const handleDelete = (empid) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            fetch(`${SERVER}/api/employees/employee/${empid}`, { method: 'DELETE' })
              .then(res => res.json())
              .then(() => {
                Alert.alert('Deleted Successfully');
                fetchEmployees();
                setModalVisible(false);
              })
              .catch(err => Alert.alert('Delete failed', err.message));
          }
        }
      ]
    );
  };

  const generateQr = () => {
    const { empid, name, dept, phone, address, training, photo } = selectedEmp;

    if (!empid || !name || !dept || !phone || !address) {
      Alert.alert('All fields are required');
      return;
    }

    const trainingStr = training?.join('-') || '';
    const qr = `emp://empid=${empid}&name=${encodeURIComponent(name)}&dept=${dept}&phone=${phone}&address=${encodeURIComponent(address)}&training=${encodeURIComponent(trainingStr)}&photo=${photo?.name || ''}`;
    setQrLink(qr);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    Object.entries(selectedEmp).forEach(([key, value]) => {
      if (key === 'photo' && value?.uri) {
        formData.append('photo', value);
      } else if (key === 'training') {
        formData.append('training', JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    fetch(`${SERVER}/api/employees/employee/${selectedEmp.empid}`, {
      method: 'PUT',
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        Alert.alert('Updated Successfully');
        fetchEmployees();
        setModalVisible(false);
        setQrLink(null);
      })
      .catch(err => Alert.alert('Update failed', err.message));
  };

  const generateQrUrl = (link) =>
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}&size=200x200`;

  const addTraining = () => {
    if (trainingText.trim() !== '') {
      setSelectedEmp(prev => ({
        ...prev,
        training: [...(prev.training || []), trainingText.trim()]
      }));
      setTrainingText('');
    }
  };

  const removeTraining = (index) => {
    setSelectedEmp(prev => ({
      ...prev,
      training: prev.training.filter((_, i) => i !== index)
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>All Employees</Text>
        <Text style={styles.count}>Total: {employees.length}</Text>
      </View>

      {employees.map((emp, i) => (
        <TouchableOpacity key={i} onPress={() => { setSelectedEmp(emp); setModalVisible(true); }}>
          <View style={styles.card}>
            {emp.photo && (
              <Image source={{ uri: `${SERVER}/uploads/${emp.photo}` }} style={styles.pic} />
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.text}>👤 ID: {emp.empid}</Text>
              <Text style={styles.text}>👨 Name: {emp.name}</Text>
              <Text style={styles.text}>🏢 Dept: {emp.dept}</Text>
              <Text style={styles.text}>📞 Phone: {emp.phone}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Modal */}
      {selectedEmp && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBg}>
            <ScrollView contentContainerStyle={styles.modalBox}>
              <Text style={styles.modalTitle}>Edit Employee</Text>

              <TextInput style={styles.input} placeholder="ID" placeholderTextColor="#888"  value={selectedEmp.empid} editable={false} />
              <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#888"  value={selectedEmp.name} onChangeText={val => setSelectedEmp({ ...selectedEmp, name: val })} />
              <TextInput style={styles.input} placeholder="Department"  placeholderTextColor="#888"  value={selectedEmp.dept} onChangeText={val => setSelectedEmp({ ...selectedEmp, dept: val })} />
              <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#888"  keyboardType="phone-pad" value={selectedEmp.phone} onChangeText={val => setSelectedEmp({ ...selectedEmp, phone: val })} />
              <TextInput style={styles.input} placeholder="Address"  placeholderTextColor="#888" value={selectedEmp.address} onChangeText={val => setSelectedEmp({ ...selectedEmp, address: val })} />

              <View style={styles.trainingInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Add Training"
                  placeholderTextColor="#888" 
                  value={trainingText}
                  onChangeText={setTrainingText}
                />
                <TouchableOpacity style={styles.smallButton} onPress={addTraining}>
                  <Text style={styles.buttonText}>ADD</Text>
                </TouchableOpacity>
              </View>

              {(selectedEmp.training || []).map((item, idx) => (
                <View key={idx} style={styles.trainingItem}>
                  <Text style={styles.trainingText} >  {idx + 1}. {item}   </Text>
                  <TouchableOpacity onPress={() => removeTraining(idx)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}


                      
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>PICK IMAGE</Text>
              </TouchableOpacity>

              {selectedEmp.photo?.uri && (
                <Image source={{ uri: selectedEmp.photo.uri }} style={styles.selectedPhoto} />
              )}

              <TouchableOpacity style={styles.button} onPress={generateQr}>
                <Text style={styles.buttonText}>GENERATE QR</Text>
              </TouchableOpacity>

              {qrLink && (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                  <Image source={{ uri: generateQrUrl(qrLink) }} style={{ width: 200, height: 200 }} />
                </View>
              )}

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                  <Text style={styles.buttonText}>UPDATE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(selectedEmp.empid)}>
                  <Text style={styles.buttonText}>DELETE</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>CLOSE</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center'
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#171515' },
  count: { fontSize: 16, color: '#555' },

  card: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3
  },

  pic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
  text: { color: '#000', fontSize: 14 },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
    marginBottom: 60,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',               // <-- Ensure input text is black
    placeholderTextColor: '#888',
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  trainingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  trainingText: {
    fontSize: 16,
    color:'black'
    },

  trainingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    backgroundColor: '#f2f2f7',
  },

  removeText: { color: 'red', fontWeight: 'bold' },

  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#007BFF',
  },

  updateButton: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#0ecc2b',
    width: '30%'
  },

  deleteButton: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FF3B30',
    width: '30%'
  },

  smallButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  selectedPhoto: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 12,
  }
});
