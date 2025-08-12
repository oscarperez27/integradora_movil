import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ViewPDFScreen = ({ route }) => {
  const { fileUri } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: fileUri }}
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#D90429" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViewPDFScreen;
