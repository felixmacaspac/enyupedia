import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, FileText } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Message, generateResponse } from '@/utils/chatUtils';
import { useAIContext } from '@/context/AIContext';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am EnyuPedia, your NU Dasmarinas AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { hasLoadedDocument } = useAIContext();

  const handleSend = async () => {
    if (message.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    try {
      const response = await generateResponse(message, hasLoadedDocument);
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        setIsTyping(false);
      }, 1000); // Simulate AI thinking time
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your request.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <Animatable.View
      animation="fadeIn"
      duration={500}
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userText : styles.aiText,
      ]}>
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="EnyuPedia" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          {!hasLoadedDocument && (
            <Animatable.View 
              animation="pulse" 
              iterationCount="infinite" 
              style={styles.warningBanner}
            >
              <FileText size={20} color={Colors.warning} />
              <Text style={styles.warningText}>
                No handbook loaded. Please upload a PDF in Settings.
              </Text>
            </Animatable.View>
          )}
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <Animatable.View 
                animation="pulse" 
                iterationCount="infinite" 
                duration={1500}
                style={styles.typingIndicator}
              >
                <Text style={styles.typingText}>EnyuPedia is typing</Text>
                <View style={styles.typingDots}>
                  <Animatable.Text 
                    animation="fadeIn" 
                    iterationCount="infinite" 
                    duration={500}
                    style={styles.typingDot}
                  >.</Animatable.Text>
                  <Animatable.Text 
                    animation="fadeIn" 
                    iterationCount="infinite" 
                    duration={500}
                    delay={200}
                    style={styles.typingDot}
                  >.</Animatable.Text>
                  <Animatable.Text 
                    animation="fadeIn" 
                    iterationCount="infinite" 
                    duration={500}
                    delay={400}
                    style={styles.typingDot}
                  >.</Animatable.Text>
                </View>
              </Animatable.View>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Ask about NU Dasmarinas..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                message.trim() === '' ? styles.disabledButton : null,
              ]}
              onPress={handleSend}
              disabled={message.trim() === ''}
            >
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.warning,
    marginLeft: 8,
  },
  messagesList: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    marginLeft: 'auto',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    marginRight: 'auto',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#fff',
    fontFamily: 'Inter-Regular',
  },
  aiText: {
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  typingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: -16,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});