
// // import { useState } from 'react';
// // import {
// //   Alert,
// //   Button,
// //   Image,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View
// // } from 'react-native';
// // import { launchImageLibrary } from 'react-native-image-picker';

// // export default function EmployeeForm({ navigation }) {
// //   const [data, setData] = useState({
// //     empid: '',
// //     name: '',
// //     dept: '',
// //     phone: '',
// //     address: '',
// //     training: [],
// //     photo: null
// //   });

// //   const [trainingText, setTrainingText] = useState('');

// //   const handleChange = (field, value) => {
// //     setData(prev => ({ ...prev, [field]: value }));
// //   };

// //   const addTraining = () => {
// //     if (trainingText.trim() !== '') {
// //       setData(prev => ({
// //         ...prev,
// //         training: [...prev.training, trainingText.trim()]
// //       }));
// //       setTrainingText('');
// //     }
// //   };

// //   const removeTraining = (indexToRemove) => {
// //     setData(prev => ({
// //       ...prev,
// //       training: prev.training.filter((_, index) => index !== indexToRemove)
// //     }));
// //   };

// //   const pickImage = async () => {
// //     const result = await launchImageLibrary({
// //       mediaType: 'photo',
// //       quality: 1
// //     });

// //     if (result.didCancel || !result.assets || result.assets.length === 0) {
// //       return;
// //     }

// //     const asset = result.assets[0];
// //     const localUri = asset.uri;
// //     const fileName = asset.fileName || localUri.split('/').pop();
// //     const type = asset.type || 'image/jpeg';

// //     setData(prev => ({
// //       ...prev,
// //       photo: {
// //         uri: localUri,
// //         name: fileName,
// //         type
// //       }
// //     }));
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       if (!data.photo) {
// //         Alert.alert('Error', 'Please select a photo');
// //         return;
// //       }

// //       const formData = new FormData();

// //       formData.append('empid', data.empid);
// //       formData.append('name', data.name);
// //       formData.append('dept', data.dept);
// //       formData.append('phone', data.phone);
// //       formData.append('address', data.address);
// //       formData.append('training', JSON.stringify(data.training));
// //       formData.append('photo', {
// //         uri: data.photo.uri,
// //         name: data.photo.name,
// //         type: data.photo.type
// //       });

// //       const response = await fetch('http://10.98.130.113:3000/emp/employee', {
// //         method: 'POST',
// //         body: formData,
// //         headers: {
// //           Accept: 'application/json'
// //         }
// //       });

// //       const resJson = await response.json();

// //       if (response.ok) {
// //         Alert.alert('Success', 'Employee created');
// //         navigation.navigate('EmployeeDetailsScreen', { empid: resJson.data.empid });
// //       } else {
// //         Alert.alert('Error', resJson.error || 'Failed to create employee');
// //       }
// //     } catch (error) {
// //       console.error('Submission failed:', error);
// //       Alert.alert('Error', error.message || 'Failed to create employee');
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.heading}>Employee Form</Text>

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Employee ID"
// //         value={data.empid}
// //         onChangeText={text => handleChange('empid', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Name"
// //         value={data.name}
// //         onChangeText={text => handleChange('name', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Department"
// //         value={data.dept}
// //         onChangeText={text => handleChange('dept', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Phone"
// //         keyboardType="phone-pad"
// //         value={data.phone}
// //         onChangeText={text => handleChange('phone', text)}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Address"
// //         value={data.address}
// //         onChangeText={text => handleChange('address', text)}
// //       />

// //       <View style={styles.trainingInputRow}>
// //         <TextInput
// //           style={[styles.input, { flex: 1 }]}
// //           placeholder="Add Training"
// //           value={trainingText}
// //           onChangeText={setTrainingText}
// //         />
// //         <Button title="Add" onPress={addTraining} />
// //       </View>

// //       {data.training.map((item, index) => (
// //         <View key={index} style={styles.trainingItem}>
// //           <Text style={styles.trainingText}>{index + 1}. {item}</Text>
// //           <TouchableOpacity onPress={() => removeTraining(index)}>
// //             <Text style={styles.removeText}>Remove</Text>
// //           </TouchableOpacity>
// //         </View>
// //       ))}

// //       <Button title="Pick Photo" onPress={pickImage} />

// //       {data.photo && (
// //         <Image
// //           source={{ uri: data.photo.uri }}
// //           style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
// //         />
// //       )}

// //       <Button title="Submit" onPress={handleSubmit} style={{ marginTop: 20 }} />
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     gap: 12
// //   },
// //   heading: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     marginBottom: 16
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     padding: 10,
// //     borderRadius: 8
// //   },
// //   trainingInputRow: {
// //     flexDirection: 'row',
// //     gap: 10,
// //     alignItems: 'center'
// //   },
// //   trainingItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     backgroundColor: '#eef',
// //     padding: 10,
// //     borderRadius: 8,
// //     marginTop: 6
// //   },
// //   trainingText: {
// //     fontSize: 16
// //   },
// //   removeText: {
// //     color: 'red',
// //     fontWeight: '600'
// //   }
// // });











// import { useState } from 'react';
// import {
//   Alert,
//   Button,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';

// export default function EmployeeForm({ navigation }) {
//   const [data, setData] = useState({
//     empid: '',
//     name: '',
//     dept: '',
//     phone: '',
//     address: '',
//     training: [],
//     photo: null
//   });

//   const [trainingText, setTrainingText] = useState('');
//   const [qrLink, setQrLink] = useState(null);

//   const handleChange = (field, value) => {
//     setData(prev => ({ ...prev, [field]: value }));
//   };

//   const addTraining = () => {
//     if (trainingText.trim() !== '') {
//       setData(prev => ({
//         ...prev,
//         training: [...prev.training, trainingText.trim()]
//       }));
//       setTrainingText('');
//     }
//   };

//   const removeTraining = (indexToRemove) => {
//     setData(prev => ({
//       ...prev,
//       training: prev.training.filter((_, index) => index !== indexToRemove)
//     }));
//   };

//   const pickImage = async () => {
//     const result = await launchImageLibrary({
//       mediaType: 'photo',
//       quality: 1
//     });

//     if (result.didCancel || !result.assets || result.assets.length === 0) return;

//     const asset = result.assets[0];
//     const localUri = asset.uri;
//     const fileName = asset.fileName || localUri.split('/').pop();
//     const type = asset.type || 'image/jpeg';

//     setData(prev => ({
//       ...prev,
//       photo: {
//         uri: localUri,
//         name: fileName,
//         type
//       }
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!data.photo) {
//         Alert.alert('Error', 'Please select a photo');
//         return;
//       }

//       const formData = new FormData();
//       formData.append('empid', data.empid);
//       formData.append('name', data.name);
//       formData.append('dept', data.dept);
//       formData.append('phone', data.phone);
//       formData.append('address', data.address);
//       formData.append('training', JSON.stringify(data.training));
//       formData.append('photo', {
//         uri: data.photo.uri,
//         name: data.photo.name,
//         type: data.photo.type
//       });

//       const response = await fetch('http://10.98.130.113:3000/emp/employee', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Accept: 'application/json'
//         }
//       });

//       const resJson = await response.json();

//       if (response.ok) {
//         const link = resJson.link;
//         setQrLink(link); // show QR
//         Alert.alert('Success', 'Employee created');
//         navigation.navigate('EmployeeDetailsScreen', { empid: resJson.data.empid });
//       } else {
//         Alert.alert('Error', resJson.error || 'Failed to create employee');
//       }
//     } catch (error) {
//       console.error('Submission failed:', error);
//       Alert.alert('Error', error.message || 'Failed to create employee');
//     }
//   };

//   const generateQrUrl = (link) =>
//     `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}&size=200x200`;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Employee Form</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Employee ID"
//         value={data.empid}
//         onChangeText={text => handleChange('empid', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={data.name}
//         onChangeText={text => handleChange('name', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Department"
//         value={data.dept}
//         onChangeText={text => handleChange('dept', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone"
//         keyboardType="phone-pad"
//         value={data.phone}
//         onChangeText={text => handleChange('phone', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Address"
//         value={data.address}
//         onChangeText={text => handleChange('address', text)}
//       />

//       <View style={styles.trainingInputRow}>
//         <TextInput
//           style={[styles.input, { flex: 1 }]}
//           placeholder="Add Training"
//           value={trainingText}
//           onChangeText={setTrainingText}
//         />
//         <Button title="Add" onPress={addTraining} />
//       </View>

//       {data.training.map((item, index) => (
//         <View key={index} style={styles.trainingItem}>
//           <Text style={styles.trainingText}>{index + 1}. {item}</Text>
//           <TouchableOpacity onPress={() => removeTraining(index)}>
//             <Text style={styles.removeText}>Remove</Text>
//           </TouchableOpacity>
//         </View>
//       ))}

//       <Button title="Pick Photo" onPress={pickImage} />

//       {data.photo && (
//         <Image
//           source={{ uri: data.photo.uri }}
//           style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
//         />
//       )}

//       <View style={{ marginTop: 20 }}>
//         <Button title="Submit" onPress={handleSubmit} />
//       </View>

//       {qrLink && (
//         <View style={styles.qrSection}>
//           <Text style={styles.qrLabel}>Employee QR Code:</Text>
//           <Image
//             source={{ uri: generateQrUrl(qrLink) }}
//             style={styles.qrImage}
//           />
//           <Text style={styles.qrLink}>{qrLink}</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     gap: 12
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 16
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 8
//   },
//   trainingInputRow: {
//     flexDirection: 'row',
//     gap: 10,
//     alignItems: 'center'
//   },
//   trainingItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#eef',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 6
//   },
//   trainingText: {
//     fontSize: 16
//   },
//   removeText: {
//     color: 'red',
//     fontWeight: '600'
//   },
//   qrSection: {
//     marginTop: 30,
//     alignItems: 'center'
//   },
//   qrLabel: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: '600'
//   },
//   qrImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 10
//   },
//   qrLink: {
//     fontSize: 12,
//     color: 'gray'
//   }
// });











import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EmployeeForm({ navigation }) {
  const [data, setData] = useState({
    empid: '',
    name: '',
    dept: '',
    phone: '',
    address: '',
    training: [],
    photo: null
  });

  const [trainingText, setTrainingText] = useState('');
  const [qrLink, setQrLink] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addTraining = () => {
    if (trainingText.trim() !== '') {
      setData(prev => ({
        ...prev,
        training: [...prev.training, trainingText.trim()]
      }));
      setTrainingText('');
    }
  };

  const removeTraining = (indexToRemove) => {
    setData(prev => ({
      ...prev,
      training: prev.training.filter((_, index) => index !== indexToRemove)
    }));
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) return;

    const asset = result.assets[0];
    const localUri = asset.uri;
    const fileName = asset.fileName || localUri.split('/').pop();
    const type = asset.type || 'image/jpeg';

    setData(prev => ({
      ...prev,
      photo: {
        uri: localUri,
        name: fileName,
        type
      }
    }));
  };

  const generateQr = () => {
    if (!data.empid || !data.name || !data.dept || !data.phone || !data.address) {
      Alert.alert('Please fill all details before generating QR');
      return;
    }

    const trainingStr = data.training.join('-');
    const link = `emp://empid=${data.empid}&name=${encodeURIComponent(data.name)}&dept=${data.dept}&phone=${data.phone}&address=${encodeURIComponent(data.address)}&training=${encodeURIComponent(trainingStr)}&photo=${data.photo?.name || ''}`;

    setQrLink(link);
    setQrGenerated(true);
  };

  const handleSubmit = async () => {
    try {
      if (!data.photo) {
        Alert.alert('Error', 'Please select a photo');
        return;
      }

      if (!qrGenerated || !qrLink) {
        Alert.alert('Please generate QR code before submitting');
        return;
      }

      const formData = new FormData();
      formData.append('empid', data.empid);
      formData.append('name', data.name);
      formData.append('dept', data.dept);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('training', JSON.stringify(data.training));
      formData.append('photo', {
        uri: data.photo.uri,
        name: data.photo.name,
        type: data.photo.type
      });

      const response = await fetch('http://10.98.130.113:3000/emp/add', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      const resJson = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Employee created', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('AdminScreen') // Update with your admin screen name
          }
        ]);
      } else {
        Alert.alert('Error', resJson.error || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      Alert.alert('Error', error.message || 'Failed to create employee');
    }
  };

  const generateQrUrl = (link) =>
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}&size=200x200`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Employee Form</Text>

      <TextInput style={styles.input} placeholder="Employee ID" value={data.empid} onChangeText={text => handleChange('empid', text)} />
      <TextInput style={styles.input} placeholder="Name" value={data.name} onChangeText={text => handleChange('name', text)} />
      <TextInput style={styles.input} placeholder="Department" value={data.dept} onChangeText={text => handleChange('dept', text)} />
      <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={data.phone} onChangeText={text => handleChange('phone', text)} />
      <TextInput style={styles.input} placeholder="Address" value={data.address} onChangeText={text => handleChange('address', text)} />

      <View style={styles.trainingInputRow}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Add Training" value={trainingText} onChangeText={setTrainingText} />
        <Button title="Add" onPress={addTraining} />
      </View>

      {data.training.map((item, index) => (
        <View key={index} style={styles.trainingItem}>
          <Text style={styles.trainingText}>{index + 1}. {item}</Text>
          <TouchableOpacity onPress={() => removeTraining(index)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Button title="Pick Photo" onPress={pickImage} />

      {data.photo && (
        <Image
          source={{ uri: data.photo.uri }}
          style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Generate QR Code" onPress={generateQr} />
      </View>

      {qrLink && (
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>Employee QR Code:</Text>
          <Image source={{ uri: generateQrUrl(qrLink) }} style={styles.qrImage} />
          <Text style={styles.qrLink}>{qrLink}</Text>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8
  },
  trainingInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  trainingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eef',
    padding: 10,
    borderRadius: 8,
    marginTop: 6
  },
  trainingText: {
    fontSize: 16
  },
  removeText: {
    color: 'red',
    fontWeight: '600'
  },
  qrSection: {
    marginTop: 30,
    alignItems: 'center'
  },
  qrLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600'
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 10
  },
  qrLink: {
    fontSize: 12,
    color: 'gray'
  }
});
