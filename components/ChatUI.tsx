import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import { useAI } from '../context/AIContext';
import { Send, Bot, User, ToggleRight, ToggleLeft } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export function ChatUI() {
  const { messages, isLoading, sendMessage } = useAI();
  const [input, setInput] = useState('');
  const [usePdf, setUsePdf] = useState(true);
  const flatListRef = useRef(null);
  const inputHeight = useRef(new Animated.Value(48)).current;

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const question = input.trim();
      setInput('');
      await sendMessage(question, usePdf);

      // Scroll to bottom after sending message
      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  };

  const handleInputChange = (text) => {
    setInput(text);

    // Adjust input height based on content
    const newLines = text.split('\n').length;
    const newHeight = Math.min(48 + (newLines - 1) * 20, 120);

    Animated.timing(inputHeight, {
      toValue: newHeight,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.role === 'user';

    return (
      <Animatable.View
        animation="fadeIn"
        duration={300}
        delay={index * 50}
        style={styles.messageContainer}
      >
        <View
          style={[
            styles.avatarContainer,
            isUser ? styles.userAvatarContainer : styles.aiAvatarContainer,
          ]}
        >
          {isUser ? (
            <User size={16} color="#fff" />
          ) : (
            <Bot size={16} color="#fff" />
          )}
        </View>

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.aiText,
            ]}
          >
            {item.content}
          </Text>

          {!isUser && (
            <Text style={styles.timestamp}>
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
      </Animatable.View>
    );
  };

  const renderEmptyChat = () => (
    <View style={styles.emptyContainer}>
      <Animatable.View
        animation="fadeIn"
        duration={800}
        style={styles.emptyContent}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.emptyIcon}
        >
          <Bot size={40} color="#fff" />
        </LinearGradient>

        <Text style={styles.emptyTitle}>EnyuPedia</Text>
        <Text style={styles.emptySubtitle}>
          Your NU Dasmarinas AI Assistant
        </Text>

        <View style={styles.emptyTips}>
          <Text style={styles.tipsTitle}>Try asking about:</Text>

          {[
            'Admission requirements',
            'Academic calendar',
            'School policies',
            'Course offerings',
            'Campus facilities',
          ].map((tip, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tipButton}
              onPress={() => {
                setInput(tip);
                handleInputChange(tip);
              }}
            >
              <Text style={styles.tipText}>{tip}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animatable.View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Use PDF Knowledge Base</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setUsePdf(!usePdf)}
        >
          {usePdf ? (
            <ToggleRight size={24} color={Colors.primary} />
          ) : (
            <ToggleLeft size={24} color={Colors.secondary} />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        ListEmptyComponent={renderEmptyChat}
        onContentSizeChange={() => {
          if (messages.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />

      <BlurView intensity={80} tint="light" style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Animated.View style={[styles.inputBox, { height: inputHeight }]}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={handleInputChange}
              placeholder="Ask about the NUD handbook..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEFF1',
    backgroundColor: '#fff',
  },
  toggleLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  toggleButton: {
    padding: 4,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatarContainer: {
    backgroundColor: Colors.accent,
    marginLeft: 8,
    marginRight: 0,
  },
  aiAvatarContainer: {
    backgroundColor: Colors.primary,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '75%',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#E9F5FF',
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#1A1A1A',
    fontFamily: 'Inter-Medium',
  },
  aiText: {
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Regular',
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Regular',
    padding: 0,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    width: '100%',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  emptyTips: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  tipButton: {
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
  },
});
