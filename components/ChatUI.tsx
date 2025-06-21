import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAI } from '../context/AIContext';
import {
  Send,
  Bot,
  User,
  ToggleRight,
  ToggleLeft,
  Info,
  X,
} from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define types for messages and context
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface AIContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (question: string, usePdf: boolean) => Promise<void>;
}

export function ChatUI(): React.ReactElement {
  const { messages, isLoading, sendMessage } = useAI() as AIContextType;
  const [input, setInput] = useState<string>('');
  const [usePdf, setUsePdf] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const inputRef = useRef<TextInput>(null);
  const inputHeight = useRef(new Animated.Value(48)).current;
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');

  // Auto-scroll when keyboard appears or new messages arrive
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // Ensure input is visible when keyboard appears
        inputRef.current?.focus();
        scrollToBottom();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleInputFocus = () => {
    // Delay scroll to ensure keyboard is fully shown
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const question = input.trim();
      setInput('');

      // Reset input height
      Animated.timing(inputHeight, {
        toValue: 48,
        duration: 100,
        useNativeDriver: false,
      }).start();

      await sendMessage(question, usePdf);
      scrollToBottom();
    }
  };

  const handleInputChange = (text: string) => {
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

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.role === 'user';
    const messageTime = item.timestamp || new Date();

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
          {isUser ? (
            <Text style={[styles.messageText, styles.userText]}>
              {item.content}
            </Text>
          ) : (
            <Markdown
              style={{
                body: styles.markdownBody,
                paragraph: styles.markdownParagraph,
                heading1: styles.markdownHeading1,
                heading2: styles.markdownHeading2,
                heading3: styles.markdownHeading3,
                heading4: styles.markdownHeading4,
                heading5: styles.markdownHeading5,
                heading6: styles.markdownHeading6,
                hr: styles.markdownHr,
                strong: styles.markdownStrong,
                em: styles.markdownEm,
                s: styles.markdownS,
                blockquote: styles.markdownBlockquote,
                bullet_list: styles.markdownBulletList,
                ordered_list: styles.markdownOrderedList,
                list_item: styles.markdownListItem,
                code_inline: styles.markdownCodeInline,
                code_block: styles.markdownCodeBlock,
                fence: styles.markdownFence,
                table: styles.markdownTable,
                thead: styles.markdownThead,
                tbody: styles.markdownTbody,
                th: styles.markdownTh,
                tr: styles.markdownTr,
                td: styles.markdownTd,
                link: styles.markdownLink,
                blocklink: styles.markdownBlocklink,
                image: styles.markdownImage,
                text: styles.markdownText,
              }}
            >
              {item.content}
            </Markdown>
          )}

          <Text style={styles.timestamp}>
            {messageTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
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
        <Text style={styles.emptySubtitle}>
          Your NU Dasmarinas AI Assistant
        </Text>

        <View style={styles.emptyTips}>
          <Text style={styles.tipsTitle}>Try asking about:</Text>

          {[
            'What is the requirements for Deans honor list?',
            'Who is the founder of National University?',
            'What is the lyrics of National University Hymn?',
            'What is the Grading System of National University?',
            'How do you shift courses in National University?',
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

  const renderInfoModal = () => (
    <Animatable.View
      animation="fadeIn"
      duration={300}
      style={styles.infoModalOverlay}
    >
      <Animatable.View
        animation="zoomIn"
        duration={300}
        style={styles.infoModal}
      >
        <View style={styles.infoModalHeader}>
          <Text style={styles.infoModalTitle}>About EnyuPedia</Text>
          <TouchableOpacity
            onPress={() => setShowInfo(false)}
            style={styles.infoModalCloseBtn}
          >
            <X size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoModalContent}>
          <Text style={styles.infoModalText}>
            EnyuPedia is an AI-powered assistant for NU Dasmarinas students and
            faculty.
          </Text>

          <Text style={styles.infoModalSubtitle}>Features:</Text>
          <View style={styles.infoModalFeature}>
            <View style={styles.infoModalFeatureIcon}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.featureIconGradient}
              >
                <Bot size={16} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.infoModalFeatureText}>
              Access to NU Dasmarinas handbook and policies
            </Text>
          </View>

          <View style={styles.infoModalFeature}>
            <View style={styles.infoModalFeatureIcon}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.featureIconGradient}
              >
                <ToggleRight size={16} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.infoModalFeatureText}>
              Toggle between PDF knowledge base and general information
            </Text>
          </View>

          <Text style={styles.infoModalVersion}>Version 1.0.0</Text>
        </View>
      </Animatable.View>
    </Animatable.View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom > 0 ? 0 : 20, // Add padding if no safe area at bottom
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}
      >
        {/* <View style={styles.header}>
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

          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowInfo(true)}
          >
            <Info size={20} color="#666" />
          </TouchableOpacity>
        </View> */}

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          contentContainerStyle={[
            styles.messageListContent,
            { paddingBottom: insets.bottom + 120 }, // Increased padding
          ]}
          ListEmptyComponent={renderEmptyChat}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
        />

        <BlurView intensity={90} tint="light" style={styles.inputWrapper}>
          <View
            style={[styles.inputContainer, { marginBottom: insets.bottom }]}
          >
            <Animated.View style={[styles.inputBox, { height: inputHeight }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={input}
                onChangeText={handleInputChange}
                placeholder="Ask about the NUD handbook..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
                onFocus={handleInputFocus}
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

        {showInfo && renderInfoModal()}

        {isLoading && messages.length > 0 && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>EnyuPedia is typing</Text>
            <Animatable.View
              animation="flash"
              iterationCount="infinite"
              duration={1500}
            >
              <Text style={styles.typingDots}>...</Text>
            </Animatable.View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEFF1',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoButton: {
    padding: 8,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  userAvatarContainer: {
    backgroundColor: Colors.accent,
    marginRight: 0,
  },
  aiAvatarContainer: {
    backgroundColor: Colors.primary,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    maxWidth: '60%',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
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
    marginTop: 8,
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Regular',
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    position: 'relative',
    bottom: -32,
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
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
    shadowColor: '#000', // Added shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Regular',
    padding: 0,
    maxHeight: 100, // Limited max height
    minHeight: 24, // Added minimum height
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
  typingIndicator: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 99,
  },
  typingText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  typingDots: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 2,
  },
  infoModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  infoModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEFF1',
  },
  infoModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  infoModalCloseBtn: {
    padding: 4,
  },
  infoModalContent: {
    padding: 20,
  },
  infoModalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  infoModalSubtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  infoModalFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoModalFeatureIcon: {
    marginRight: 12,
  },
  featureIconGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoModalFeatureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  infoModalVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
  // Markdown styles
  markdownBody: {
    color: '#333',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  markdownParagraph: {
    marginBottom: 10,
    marginTop: 0,
  },
  markdownHeading1: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 16,
  },
  markdownHeading2: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 16,
  },
  markdownHeading3: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#222',
    marginBottom: 8,
    marginTop: 16,
  },
  markdownHeading4: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#222',
    marginBottom: 8,
    marginTop: 16,
  },
  markdownHeading5: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#222',
    marginBottom: 8,
    marginTop: 16,
  },
  markdownHeading6: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#222',
    marginBottom: 8,
    marginTop: 16,
  },
  markdownHr: {
    backgroundColor: '#ddd',
    height: 1,
    marginVertical: 16,
  },
  markdownStrong: {
    fontFamily: 'Inter-Bold',
  },
  markdownEm: {
    fontStyle: 'italic',
  },
  markdownS: {
    textDecorationLine: 'line-through',
  },
  markdownBlockquote: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    paddingLeft: 12,
    marginLeft: 0,
    marginVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    paddingVertical: 8,
    paddingRight: 8,
    borderRadius: 4,
  },
  markdownBulletList: {
    marginVertical: 8,
  },
  markdownOrderedList: {
    marginVertical: 8,
  },
  markdownListItem: {
    marginBottom: 4,
    flexDirection: 'row',
  },
  markdownCodeInline: {
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
    fontSize: 14,
  },
  markdownCodeBlock: {
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    fontSize: 14,
  },
  markdownFence: {
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    fontSize: 14,
  },
  markdownTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginVertical: 10,
    overflow: 'hidden',
  },
  markdownThead: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  markdownTbody: {},
  markdownTh: {
    padding: 8,
    fontFamily: 'Inter-SemiBold',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  markdownTr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  markdownTd: {
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  markdownLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  markdownBlocklink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  markdownImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 8,
    borderRadius: 8,
  },
  markdownText: {
    color: '#333',
  },
});
