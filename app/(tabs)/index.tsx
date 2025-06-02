import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ChatUI } from '../../components/ChatUI';
import { AIProvider } from '../../context/AIContext';
import Header from '@/components/Header';

export default function ChatScreen() {
  return (
    <AIProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="EnyuPedia" showInfo={true} />
        <View style={styles.chatContainer}>
          <ChatUI />
        </View>
      </SafeAreaView>
    </AIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  chatContainer: {
    flex: 1,
  },
});
