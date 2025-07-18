// // import React, { useState } from 'react';
// // import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// //  import { RNCamera } from 'react-native-camera';
// // import { launchImageLibrary } from 'react-native-image-picker';
// // import QRCodeScanner from 'react-native-qrcode-scanner';

// // export default function Scanner({ onScan, onClose }) {
// //   const [hasPermission, setHasPermission] = useState(null);

// //   React.useEffect(() => {
// //     // Request camera permission
// //     const requestCameraPermission = async () => {
// //       try {
// //         const { status } = await RNCamera.requestPermissionsAsync();
// //         setHasPermission(status === 'granted');
// //       } catch (error) {
// //         console.log('Camera permission error:', error);
// //         setHasPermission(false);
// //       }
// //     };
// //     requestCameraPermission();
// //   }, []);

// //   const handlePickImage = async () => {
// //     const options = {
// //       mediaType: 'photo',
// //       quality: 1,
// //     };

// //     try {
// //       const result = await launchImageLibrary(options);
      
// //       if (result.assets && result.assets.length > 0) {
// //         const imageUri = result.assets[0].uri;
        
// //         // For now, show alert since QR decoding from image requires additional setup
// //         Alert.alert('QR Upload', 'QR decoding from image is not implemented yet.\nUse camera for now.');
        
// //         // TODO: Implement QR decoding from image
// //         // You can use libraries like react-native-qrcode-local-image for this
// //       }
// //     } catch (error) {
// //       console.log('Image picker error:', error);
// //       Alert.alert('Error', 'Failed to pick image');
// //     }
// //   };

// //   const onSuccess = (e) => {
// //     onScan(e.data);
// //   };

// //   if (hasPermission === null) {
// //     return (
// //       <View style={styles.center}>
// //         <Text>Requesting camera permission...</Text>
// //       </View>
// //     );
// //   }

// //   if (hasPermission === false) {
// //     return (
// //       <View style={styles.center}>
// //         <Text>No access to camera</Text>
// //         <TouchableOpacity style={styles.permissionButton} onPress={() => setHasPermission(null)}>
// //           <Text style={styles.permissionButtonText}>Grant Permission</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <QRCodeScanner
// //         onRead={onSuccess}
// //         flashMode={RNCamera.Constants.FlashMode.auto}
// //         topContent={
// //           <Text style={styles.centerText}>
// //             Scan QR Code
// //           </Text>
// //         }
// //         bottomContent={
// //           <TouchableOpacity style={styles.buttonTouchable} onPress={handlePickImage}>
// //             <Text style={styles.buttonText}>Upload from Device</Text>
// //           </TouchableOpacity>
// //         }
// //         containerStyle={styles.cameraContainer}
// //         cameraStyle={styles.camera}
// //       />

// //       {/* Close Button */}
// //       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
// //         <Text style={styles.closeButtonText}>✕</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //     margin: 10,
// //     backgroundColor: '#000',
// //   },
// //   center: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //   },
// //   centerText: {
// //     flex: 1,
// //     fontSize: 18,
// //     padding: 32,
// //     color: '#777',
// //   },
// //   cameraContainer: {
// //     flex: 1,
// //   },
// //   camera: {
// //     flex: 1,
// //   },
// //   buttonTouchable: {
// //     fontSize: 21,
// //     backgroundColor: '#6200ee',
// //     marginTop: 32,
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: '600',
// //   },
// //   closeButton: {
// //     position: 'absolute',
// //     top: 16,
// //     right: 16,
// //     backgroundColor: '#fff',
// //     borderRadius: 20,
// //     width: 36,
// //     height: 36,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     elevation: 5,
// //     zIndex: 1000,
// //   },
// //   closeButtonText: {
// //     color: '#6200ee',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   permissionButton: {
// //     backgroundColor: '#6200ee',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //     marginTop: 20,
// //   },
// //   permissionButtonText: {
// //     color: '#fff',
// //     fontWeight: '600',
// //   },
// // });














// import React, { useState, useEffect } from 'react';
// import {
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import { launchImageLibrary } from 'react-native-image-picker';
// import QRCodeScanner from 'react-native-qrcode-scanner';

// export default function Scanner({ onScan, onClose }) {
//   const [hasPermission, setHasPermission] = useState(null);

//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Camera Permission',
//               message: 'This app needs camera access to scan QR codes',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//         } catch (err) {
//           console.warn(err);
//           setHasPermission(false);
//         }
//       } else {
//         // iOS - always true for now (you can use react-native-permissions for fine control)
//         setHasPermission(true);
//       }
//     };

//     requestCameraPermission();
//   }, []);

//   const handlePickImage = async () => {
//     const options = {
//       mediaType: 'photo',
//       quality: 1,
//     };

//     try {
//       const result = await launchImageLibrary(options);

//       if (result.assets && result.assets.length > 0) {
//         const imageUri = result.assets[0].uri;

//         Alert.alert(
//           'QR Upload',
//           'QR decoding from image is not implemented yet.\nUse camera for now.'
//         );
//         // TODO: implement decoding using a library like `react-native-qrcode-local-image`
//       }
//     } catch (error) {
//       console.log('Image picker error:', error);
//       Alert.alert('Error', 'Failed to pick image');
//     }
//   };

//   const onSuccess = (e) => {
//     onScan(e.data);
//   };

//   if (hasPermission === null) {
//     return (
//       <View style={styles.center}>
//         <Text>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (hasPermission === false) {
//     return (
//       <View style={styles.center}>
//         <Text>No access to camera</Text>
//         <TouchableOpacity
//           style={styles.permissionButton}
//           onPress={() => {
//             // Retry permission
//             setHasPermission(null);
//           }}
//         >
//           <Text style={styles.permissionButtonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <QRCodeScanner
//         onRead={onSuccess}
//         flashMode={RNCamera.Constants.FlashMode.auto}
//         topContent={<Text style={styles.centerText}>Scan QR Code</Text>}
//         bottomContent={
//           <TouchableOpacity style={styles.buttonTouchable} onPress={handlePickImage}>
//             <Text style={styles.buttonText}>Upload from Device</Text>
//           </TouchableOpacity>
//         }
//         containerStyle={styles.cameraContainer}
//         cameraStyle={styles.camera}
//       />

//       {/* Close Button */}
//       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//         <Text style={styles.closeButtonText}>✕</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: 'hidden',
//     margin: 10,
//     backgroundColor: '#000',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   centerText: {
//     fontSize: 18,
//     padding: 32,
//     color: '#fff',
//     textAlign: 'center',
//   },
//   cameraContainer: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonTouchable: {
//     backgroundColor: '#6200ee',
//     marginTop: 32,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     width: 36,
//     height: 36,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     zIndex: 1000,
//   },
//   closeButtonText: {
//     color: '#6200ee',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   permissionButton: {
//     backgroundColor: '#6200ee',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   permissionButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

















import React, { useState, useEffect } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default function Scanner({ onScan, onClose }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs camera access to scan QR codes',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn(err);
          setHasPermission(false);
        }
      } else {
        setHasPermission(true); // iOS auto-approve
      }
    };

    requestCameraPermission();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
      if (result.assets?.length > 0) {
        Alert.alert('QR Upload', 'QR decoding from image not implemented yet.');
        // Implement with a lib like `react-native-qrcode-local-image` if needed
      }
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const onSuccess = (e) => {
    onScan(e.data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => setHasPermission(null)}
        >
          <Text style={styles.permissionButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={'auto'} // string value instead of RNCamera enum
        topContent={<Text style={styles.centerText}>Scan QR Code</Text>}
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable} onPress={handlePickImage}>
            <Text style={styles.buttonText}>Upload from Device</Text>
          </TouchableOpacity>
        }
        containerStyle={styles.cameraContainer}
        cameraStyle={styles.camera}
        showMarker={true}
        reactivate={true}
        reactivateTimeout={3000}
      />

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 10,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#fff',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonTouchable: {
    backgroundColor: '#6200ee',
    marginTop: 32,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  closeButtonText: {
    color: '#6200ee',
    fontSize: 18,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
