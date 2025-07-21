
// // screens/ManageAsset.js
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, ScrollView, Image, StyleSheet,
//   TouchableOpacity, Modal, TextInput, Alert
// } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';

// const SERVER = 'http://10.98.130.113:3000';

// export default function ManageAsset() {
//   const [assets, setAssets] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedAsset, setSelectedAsset] = useState(null);
//   const [qrLink, setQrLink] = useState(null);

//   const fetchAssets = () => {
//     fetch(`${SERVER}/api/assets`)
//       .then(res => res.json())
//       .then(data => {
//         const sorted = data.sort((a, b) => a.assetid - b.assetid);
//         setAssets(sorted);
//       })
//       .catch(err => console.error('Failed to load assets:', err));
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const pickImage = async () => {
//     const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
//     if (result.didCancel || !result.assets?.length) return;

//     const asset = result.assets[0];
//     setSelectedAsset(prev => ({
//       ...prev,
//       photo: {
//         uri: asset.uri,
//         name: asset.fileName || 'photo.jpg',
//         type: asset.type || 'image/jpeg'
//       }
//     }));
//   };

//   const handleDelete = (assetid) => {
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this asset?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             fetch(`${SERVER}/api/assets/asset/${assetid}`, { method: 'DELETE' })
//               .then(res => res.json())
//               .then(() => {
//                 Alert.alert('Asset Deleted');
//                 fetchAssets();
//                 setModalVisible(false);
//               })
//               .catch(err => Alert.alert('Delete failed', err.message));
//           }
//         }
//       ]
//     );
//   };

//   const handleUpdate = () => {
//     const formData = new FormData();
//     Object.entries(selectedAsset).forEach(([key, value]) => {
//       if (key === 'photo' && value?.uri) {
//         formData.append('photo', value);
//       } else {
//         formData.append(key, value);
//       }
//     });

//     fetch(`${SERVER}/api/assets/asset/${selectedAsset.assetid}`, {
//       method: 'PUT',
//       body: formData,
//     })
//       .then(res => res.json())
//       .then(() => {
//         Alert.alert('Asset Updated');
//         fetchAssets();
//         setModalVisible(false);
//         setQrLink(null);
//       })
//       .catch(err => Alert.alert('Update failed', err.message));
//   };

//   const generateQr = () => {
//     const { assetid, name, category, purchaseDate, photo } = selectedAsset;

//     if (!assetid || !name || !category || !purchaseDate) {
//       Alert.alert('All fields are required');
//       return;
//     }

//     const qr = `asset://assetid=${assetid}&name=${encodeURIComponent(name)}&category=${category}&purchaseDate=${purchaseDate}&photo=${photo?.name || ''}`;
//     setQrLink(qr);
//   };

//   const generateQrUrl = (link) =>
//     `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}&size=200x200`;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>All Assets</Text>
//         <Text style={styles.count}>Total: {assets.length}</Text>
//       </View>

//       {assets.map((asset, i) => (
//         <TouchableOpacity key={i} onPress={() => { setSelectedAsset(asset); setModalVisible(true); }}>
//           <View style={styles.card}>
//             {asset.photo && (
//               <Image source={{ uri: `${SERVER}/uploads/${asset.photo}` }} style={styles.pic} />
//             )}
//             <View style={{ marginLeft: 10 }}>
//               <Text style={styles.text}>🔧 ID: {asset.assetid}</Text>
//               <Text style={styles.text}>📦 Name: {asset.name}</Text>
//               <Text style={styles.text}>📁 Category: {asset.category}</Text>
//               <Text style={styles.text}>📅 Purchase: {asset.purchaseDate}</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}

//       {/* Edit Modal */}
//       {selectedAsset && (
//         <Modal visible={modalVisible} transparent animationType="slide">
//           <View style={styles.modalBg}>
//             <ScrollView contentContainerStyle={styles.modalBox}>
//               <Text style={styles.modalTitle}>Edit Asset</Text>

//               <TextInput style={styles.input} placeholder="ID" value={selectedAsset.assetid} editable={false} />
//               <TextInput style={styles.input} placeholder="Name" value={selectedAsset.name} onChangeText={val => setSelectedAsset({ ...selectedAsset, name: val })} />
//               <TextInput style={styles.input} placeholder="Category" value={selectedAsset.category} onChangeText={val => setSelectedAsset({ ...selectedAsset, category: val })} />
//               <TextInput style={styles.input} placeholder="Purchase Date" value={selectedAsset.purchaseDate} onChangeText={val => setSelectedAsset({ ...selectedAsset, purchaseDate: val })} />

//               <TouchableOpacity style={styles.button} onPress={pickImage}>
//                 <Text style={styles.buttonText}>PICK IMAGE</Text>
//               </TouchableOpacity>

//               {selectedAsset.photo?.uri && (
//                 <Image source={{ uri: selectedAsset.photo.uri }} style={styles.selectedPhoto} />
//               )}

//               <TouchableOpacity style={styles.button} onPress={generateQr}>
//                 <Text style={styles.buttonText}>GENERATE QR</Text>
//               </TouchableOpacity>

//               {qrLink && (
//                 <View style={{ alignItems: 'center', marginTop: 10 }}>
//                   <Image source={{ uri: generateQrUrl(qrLink) }} style={{ width: 200, height: 200 }} />
//                 </View>
//               )}

//               <View style={styles.btnRow}>
//                 <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
//                   <Text style={styles.buttonText}>UPDATE</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(selectedAsset.assetid)}>
//                   <Text style={styles.buttonText}>DELETE</Text>
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
//                 <Text style={styles.buttonText}>CLOSE</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </Modal>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 16, paddingBottom: 40 },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     alignItems: 'center'
//   },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#171515' },
//   count: { fontSize: 16, color: '#555' },

//   card: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     elevation: 3
//   },

//   pic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
//   text: { color: '#000', fontSize: 14 },

//   modalBg: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },

//   modalBox: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     marginTop: 15,
//     marginBottom: 60,
//     elevation: 10,
//   },

//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 16,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     marginBottom: 12,
//     borderRadius: 10,
//     fontSize: 16,
//     color: '#000',
//     backgroundColor: '#fff',
//   },

//   button: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#007BFF',
//   },

//   updateButton: {
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#0ecc2b',
//     width: '45%'
//   },

//   deleteButton: {
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#FF3B30',
//     width: '45%'
//   },

//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },

//   btnRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },

//   selectedPhoto: {
//     width: 120,
//     height: 120,
//     borderRadius: 10,
//     alignSelf: 'center',
//     marginVertical: 12,
//   }
// });























import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Image, StyleSheet,
  TouchableOpacity, Modal, TextInput, Alert
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

const SERVER = 'http://10.98.130.113:3000';

export default function ManageAsset() {
  const [assets, setAssets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [newDocuments, setNewDocuments] = useState([]);

  const fetchAssets = () => {
    fetch(`${SERVER}/api/assets`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.assetid - b.assetid); // Ascending order
        setAssets(sorted);
      })
      .catch(err => console.error('Failed to load assets:', err));
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    if (result.didCancel || !result.assets?.length) return;

    const asset = result.assets[0];
    setSelectedAsset(prev => ({
      ...prev,
      photo: {
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
        type: asset.type || 'image/jpeg'
      }
    }));
  };

  const pickDocuments = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });

      const formatted = results.map(doc => ({
        uri: doc.uri,
        name: doc.name,
        type: doc.type || 'application/octet-stream',
      }));

      setNewDocuments(formatted);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Document Picker Error', err.message);
      }
    }
  };

  const handleDelete = (assetid) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this asset?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          fetch(`${SERVER}/api/assets/asset/${assetid}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
              Alert.alert('Asset Deleted');
              fetchAssets();
              setModalVisible(false);
            })
            .catch(err => Alert.alert('Delete failed', err.message));
        }
      }
    ]);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    Object.entries(selectedAsset).forEach(([key, value]) => {
      if (key === 'photo' && value?.uri) {
        formData.append('photo', value);
      } else if (typeof value === 'string' || typeof value === 'number') {
        formData.append(key, value);
      }
    });

    newDocuments.forEach(doc => {
      formData.append('documents', {
        uri: doc.uri,
        name: doc.name,
        type: doc.type
      });
    });

    fetch(`${SERVER}/api/assets/asset/${selectedAsset.assetid}`, {
      method: 'PUT',
      body: formData,
    })
      .then(res => res.json())
      .then(() => {
        Alert.alert('Asset Updated');
        fetchAssets();
        setModalVisible(false);
        setQrLink(null);
        setNewDocuments([]);
      })
      .catch(err => Alert.alert('Update failed', err.message));
  };

  const generateQr = () => {
    const { assetid, name, category, purchaseDate, photo } = selectedAsset;
    const qr = `asset://assetid=${assetid}&name=${encodeURIComponent(name)}&category=${category}&purchaseDate=${purchaseDate}&photo=${photo?.name || ''}`;
    setQrLink(qr);
  };

  const generateQrUrl = (link) =>
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}&size=200x200`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>All Assets</Text>
        <Text style={styles.count}>Total: {assets.length}</Text>
      </View>

      {assets.map((asset, i) => (
        <TouchableOpacity key={i} onPress={() => {
          setSelectedAsset(asset);
          setNewDocuments([]);
          setModalVisible(true);
        }}>
          <View style={styles.card}>
            {asset.photo && (
              <Image source={{ uri: `${SERVER}/uploads/${asset.photo}` }} style={styles.pic} />
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.text}>🔧 ID: {asset.assetid}</Text>
              <Text style={styles.text}>📦 Name: {asset.name}</Text>
              <Text style={styles.text}>📁 Category: {asset.category}</Text>
              <Text style={styles.text}>📅 Purchase: {asset.purchaseDate}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Edit Modal */}
      {selectedAsset && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBg}>
            <ScrollView contentContainerStyle={styles.modalBox}>
              <Text style={styles.modalTitle}>Edit Asset</Text>

              <TextInput style={styles.input} placeholder="ID" value={selectedAsset.assetid.toString()} editable={false} />
              <TextInput style={styles.input} placeholder="Name" value={selectedAsset.name} onChangeText={val => setSelectedAsset({ ...selectedAsset, name: val })} />
              <TextInput style={styles.input} placeholder="Category" value={selectedAsset.category} onChangeText={val => setSelectedAsset({ ...selectedAsset, category: val })} />
              <TextInput style={styles.input} placeholder="Purchase Date" value={selectedAsset.purchaseDate} onChangeText={val => setSelectedAsset({ ...selectedAsset, purchaseDate: val })} />

              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>PICK IMAGE</Text>
              </TouchableOpacity>

              {selectedAsset.photo?.uri && (
                <Image source={{ uri: selectedAsset.photo.uri }} style={styles.selectedPhoto} />
              )}

              <TouchableOpacity style={styles.button} onPress={pickDocuments}>
                <Text style={styles.buttonText}>PICK DOCUMENTS</Text>
              </TouchableOpacity>

              {/* Existing Docs from DB (if available) */}
              {selectedAsset.documents?.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>Existing Documents:</Text>
                  {selectedAsset.documents.map((doc, idx) => (
                    <Text key={idx} style={{ fontSize: 12, color: '#333' }}>📎 {doc}</Text>
                  ))}
                </View>
              )}

              {/* New Docs picked */}
              {newDocuments.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>New Documents:</Text>
                  {newDocuments.map((doc, idx) => (
                    <Text key={idx} style={{ fontSize: 12, color: '#007BFF' }}>📎 {doc.name}</Text>
                  ))}
                </View>
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
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(selectedAsset.assetid)}>
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
    backgroundColor: '#fff',
  },

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
    width: '45%'
  },

  deleteButton: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FF3B30',
    width: '45%'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  selectedPhoto: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 12,
  }
});
