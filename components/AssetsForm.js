// // import * as DocumentPicker from 'expo-document-picker';
// // import * as ImagePicker from 'expo-image-picker';
// // import React, { useState } from 'react';
// // import {
// //   Alert,
// //   Image,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View
// // } from 'react-native';

// // export default function AssetFormScreen({ navigation }) {
// //   const [form, setForm] = useState({
// //     assetid: '',
// //     name: '',
// //     category: '',
// //     purchaseDate: '',
// //     place: ''
// //   });

// //   const [pic, setPic] = useState(null);
// //   const [documents, setDocuments] = useState([]);
// //  const BASE_URL = 'http://10.186.170.113:3000'; // your IP

// //   // const BASE_URL = 'https://backend-code-new.onrender.com';


 

// //   const handleChange = (field, value) => {
// //     setForm(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleSelectImage = async () => {
// //     try {
// //       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //       if (!permission.granted) {
// //         Alert.alert('Permission required', 'We need camera roll access to select images');
// //         return;
// //       }

// //       const result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         quality: 1
// //       });

// //       if (!result.canceled && result.assets.length > 0) {
// //         const selected = result.assets[0];
// //         const fileName = selected.fileName || selected.uri.split('/').pop();
// //         const match = /\.(\w+)$/.exec(fileName);
// //         const type = match ? `image/${match[1]}` : 'image/jpeg';

// //         setPic({
// //           uri: selected.uri,
// //           name: fileName,
// //           type
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Image pick error:', error);
// //       Alert.alert('Error', 'Failed to pick image');
// //     }
// //   };

// //   const handleSelectDocuments = async () => {
// //     try {
// //       const result = await DocumentPicker.getDocumentAsync({
// //         multiple: true,
// //         type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
// //       });

// //       if (!result.canceled) {
// //         const pickedFiles = Array.isArray(result.assets) ? result.assets : [result];

// //         const formatted = pickedFiles.map(file => ({
// //           uri: file.uri,
// //           name: file.name,
// //           type: file.mimeType || 'application/octet-stream'
// //         }));

// //         setDocuments(prev => [...prev, ...formatted]);
// //       }
// //     } catch (error) {
// //       console.error('Document pick error:', error);
// //       Alert.alert('Error', 'Failed to pick documents');
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     const { assetid, name, category, purchaseDate, place } = form;

// //     if (!assetid || !name || !category || !purchaseDate) {
// //       Alert.alert('Validation', 'Please fill all required fields');
// //       return;
// //     }

// //     try {
// //       const formData = new FormData();
// //       formData.append('assetid', assetid);
// //       formData.append('name', name);
// //       formData.append('category', category);
// //       formData.append('purchaseDate', purchaseDate);
// //       formData.append('place', place);

// //       if (pic?.uri) {
// //         formData.append('photo', {
// //           uri: pic.uri,
// //           name: pic.name,
// //           type: pic.type
// //         });
// //       }

// //       documents.forEach((doc, index) => {
// //         formData.append('documents', {
// //           uri: doc.uri,
// //           name: doc.name,
// //           type: doc.type
// //         });
// //       });

// //       const response = await fetch(`${BASE_URL}/assets/add`, {
// //         method: 'POST',
// //         body: formData,
// //         headers: {
// //           'Accept': 'application/json'
// //         }
// //       });

// //       const text = await response.text();
// //       const resJson = text.startsWith('{') ? JSON.parse(text) : { error: text };

// //       if (response.ok) {
// //         Alert.alert('Success', 'Asset created successfully');
// //         navigation.navigate('HomeScreen');
// //       } else {
// //         Alert.alert('Error', resJson.error || 'Failed to create asset');
// //       }
// //     } catch (error) {
// //       console.error('Submit Error:', error);
// //       Alert.alert('Error', error.message || 'Network request failed');
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.heading}>Asset Form</Text>

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Asset ID"
// //         value={form.assetid}
// //         onChangeText={text => handleChange('assetid', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Asset Name"
// //         value={form.name}
// //         onChangeText={text => handleChange('name', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Category"
// //         value={form.category}
// //         onChangeText={text => handleChange('category', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Purchase Date (YYYY-MM-DD)"
// //         value={form.purchaseDate}
// //         onChangeText={text => handleChange('purchaseDate', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Place"
// //         value={form.place}
// //         onChangeText={text => handleChange('place', text)}
// //       />

// //       <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
// //         <Text style={styles.buttonText}>Pick Photo</Text>
// //       </TouchableOpacity>

// //       {pic && (
// //         <Image
// //           source={{ uri: pic.uri }}
// //           style={{ width: 100, height: 100, borderRadius: 8, marginTop: 10 }}
// //         />
// //       )}

// //       <TouchableOpacity style={[styles.button, { backgroundColor: '#2c7' }]} onPress={handleSelectDocuments}>
// //         <Text style={styles.buttonText}>Pick Documents (PDF/DOC)</Text>
// //       </TouchableOpacity>

// //       {documents.length > 0 && (
// //         <View style={{ marginTop: 10 }}>
// //           {documents.map((doc, idx) => (
// //             <Text key={idx} style={{ fontSize: 12 }}>{doc.name}</Text>
// //           ))}
// //         </View>
// //       )}

// //       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
// //         <Text style={styles.submitText}>Submit</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     gap: 14
// //   },
// //   heading: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     marginBottom: 16
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     padding: 12,
// //     borderRadius: 8
// //   },
// //   button: {
// //     backgroundColor: '#6200ee',
// //     padding: 10,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginTop: 10
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: 'bold'
// //   },
// //   submitButton: {
// //     backgroundColor: 'green',
// //     padding: 12,
// //     borderRadius: 8,
// //     marginTop: 20,
// //     alignItems: 'center'
// //   },
// //   submitText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     fontSize: 16
// //   }
// // });

















// import React, { useState } from 'react';
// import {
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import { launchImageLibrary } from 'react-native-image-picker';

// export default function AssetFormScreen({ navigation }) {
//   const [form, setForm] = useState({
//     assetid: '',
//     name: '',
//     category: '',
//     purchaseDate: '',
//     place: ''
//   });

//   const [pic, setPic] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const BASE_URL = 'http://10.186.170.113:3000'; // Replace with your IP if needed

//   const handleChange = (field, value) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSelectImage = async () => {
//     const result = await launchImageLibrary({
//       mediaType: 'photo',
//       includeBase64: false
//     });

//     if (result.didCancel) return;

//     const asset = result.assets[0];
//     setPic({
//       uri: asset.uri,
//       name: asset.fileName || asset.uri.split('/').pop(),
//       type: asset.type || 'image/jpeg'
//     });
//   };

//   const handleSelectDocuments = async () => {
//     try {
//       const results = await DocumentPicker.pickMultiple({
//         type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx]
//       });

//       const formatted = results.map(file => ({
//         uri: file.uri,
//         name: file.name,
//         type: file.type
//       }));

//       setDocuments(prev => [...prev, ...formatted]);
//     } catch (err) {
//       if (!DocumentPicker.isCancel(err)) {
//         console.error('Document pick error:', err);
//         Alert.alert('Error', 'Failed to pick documents');
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     const { assetid, name, category, purchaseDate, place } = form;

//     if (!assetid || !name || !category || !purchaseDate) {
//       Alert.alert('Validation', 'Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('assetid', assetid);
//       formData.append('name', name);
//       formData.append('category', category);
//       formData.append('purchaseDate', purchaseDate);
//       formData.append('place', place);

//       if (pic?.uri) {
//         formData.append('photo', pic);
//       }

//       documents.forEach(doc => {
//         formData.append('documents', doc);
//       });

//       const response = await fetch(`${BASE_URL}/assets/add`, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Accept': 'application/json'
//         }
//       });

//       const text = await response.text();
//       const resJson = text.startsWith('{') ? JSON.parse(text) : { error: text };

//       if (response.ok) {
//         Alert.alert('Success', 'Asset created successfully');
//         navigation.navigate('HomeScreen');
//       } else {
//         Alert.alert('Error', resJson.error || 'Failed to create asset');
//       }
//     } catch (error) {
//       console.error('Submit Error:', error);
//       Alert.alert('Error', error.message || 'Network request failed');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Asset Form</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Asset ID"
//         value={form.assetid}
//         onChangeText={text => handleChange('assetid', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Asset Name"
//         value={form.name}
//         onChangeText={text => handleChange('name', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Category"
//         value={form.category}
//         onChangeText={text => handleChange('category', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Purchase Date (YYYY-MM-DD)"
//         value={form.purchaseDate}
//         onChangeText={text => handleChange('purchaseDate', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Place"
//         value={form.place}
//         onChangeText={text => handleChange('place', text)}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
//         <Text style={styles.buttonText}>Pick Photo</Text>
//       </TouchableOpacity>

//       {pic && (
//         <Image
//           source={{ uri: pic.uri }}
//           style={{ width: 100, height: 100, borderRadius: 8, marginTop: 10 }}
//         />
//       )}

//       <TouchableOpacity style={[styles.button, { backgroundColor: '#2c7' }]} onPress={handleSelectDocuments}>
//         <Text style={styles.buttonText}>Pick Documents (PDF/DOC)</Text>
//       </TouchableOpacity>

//       {documents.length > 0 && (
//         <View style={{ marginTop: 10 }}>
//           {documents.map((doc, idx) => (
//             <Text key={idx} style={{ fontSize: 12 }}>{doc.name}</Text>
//           ))}
//         </View>
//       )}

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitText}>Submit</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     gap: 14
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 16
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 8
//   },
//   button: {
//     backgroundColor: '#6200ee',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold'
//   },
//   submitButton: {
//     backgroundColor: 'green',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 20,
//     alignItems: 'center'
//   },
//   submitText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16
//   }
// });




















import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function AssetFormScreen({ navigation }) {
  const [form, setForm] = useState({
    assetid: '',
    name: '',
    category: '',
    purchaseDate: '',
    place: ''
  });

  const [pic, setPic] = useState(null);
  const [documents, setDocuments] = useState([]);
  const BASE_URL = 'http://10.98.130.113:3000'; // Replace with your IP if needed

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false
    });

    if (result.didCancel) return;

    const asset = result.assets[0];
    setPic({
      uri: asset.uri,
      name: asset.fileName || asset.uri.split('/').pop(),
      type: asset.type || 'image/jpeg'
    });
  };

  // 🔴 TEMPORARILY DISABLED DOCUMENT PICKER
  const handleSelectDocuments = async () => {
    Alert.alert('Disabled', 'Document Picker is currently disabled.');
  };

  const handleSubmit = async () => {
    const { assetid, name, category, purchaseDate, place } = form;

    if (!assetid || !name || !category || !purchaseDate) {
      Alert.alert('Validation', 'Please fill all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('assetid', assetid);
      formData.append('name', name);
      formData.append('category', category);
      formData.append('purchaseDate', purchaseDate);
      formData.append('place', place);

      if (pic?.uri) {
        formData.append('photo', pic);
      }

      // Don't append documents for now (disabled)

      const response = await fetch(`${BASE_URL}/assets/add`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const text = await response.text();
      const resJson = text.startsWith('{') ? JSON.parse(text) : { error: text };

      if (response.ok) {
        Alert.alert('Success', 'Asset created successfully');
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Error', resJson.error || 'Failed to create asset');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      Alert.alert('Error', error.message || 'Network request failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Asset Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Asset ID"
        value={form.assetid}
        onChangeText={text => handleChange('assetid', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Asset Name"
        value={form.name}
        onChangeText={text => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={form.category}
        onChangeText={text => handleChange('category', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Purchase Date (YYYY-MM-DD)"
        value={form.purchaseDate}
        onChangeText={text => handleChange('purchaseDate', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Place"
        value={form.place}
        onChangeText={text => handleChange('place', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
        <Text style={styles.buttonText}>Pick Photo</Text>
      </TouchableOpacity>

      {pic && (
        <Image
          source={{ uri: pic.uri }}
          style={{ width: 100, height: 100, borderRadius: 8, marginTop: 10 }}
        />
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2c7' }]}
        onPress={handleSelectDocuments}
      >
        <Text style={styles.buttonText}>Pick Documents (DISABLED)</Text>
      </TouchableOpacity>

      {/* Document display removed since it's disabled */}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 14
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
