import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function DocumentViewerScreen({ route }) {
  const { url, type } = route.params;

  const finalUrl =
    type === 'pdf'
      ? url
      : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: finalUrl }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="#6200ee" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
