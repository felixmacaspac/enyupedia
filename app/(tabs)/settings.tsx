import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Trash2, Moon, FileUp, Info } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import * as DocumentPicker from 'expo-document-picker';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useAIContext } from '@/context/AIContext';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { hasLoadedDocument, documentName, loadDocument, removeDocument } = useAIContext();

  const handleDocumentPick = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        setIsLoading(false);
        return;
      }
      
      // Process the selected PDF
      await loadDocument(result.assets[0]);
      setIsLoading(false);
      
      Alert.alert(
        'Document Loaded',
        'The university handbook has been successfully loaded and processed.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error picking document:', error);
      setIsLoading(false);
      
      Alert.alert(
        'Error',
        'There was an error loading the document. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRemoveDocument = () => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove the current handbook? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            removeDocument();
            Alert.alert('Document Removed', 'The handbook has been removed successfully.');
          }
        },
      ]
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, we would apply the theme change here
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Settings" />
      
      <ScrollView style={styles.scrollView}>
        <Animatable.View animation="fadeIn" duration={500} style={styles.section}>
          <Text style={styles.sectionTitle}>University Handbook</Text>
          
          <View style={styles.documentSection}>
            {hasLoadedDocument ? (
              <View style={styles.documentInfo}>
                <FileText size={24} color={Colors.primary} />
                <View style={styles.documentDetails}>
                  <Text style={styles.documentName} numberOfLines={1}>
                    {documentName || 'University Handbook.pdf'}
                  </Text>
                  <Text style={styles.documentStatus}>Loaded and processed</Text>
                </View>
                <TouchableOpacity 
                  style={styles.documentAction}
                  onPress={handleRemoveDocument}
                >
                  <Trash2 size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleDocumentPick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff\" size="small" />
                ) : (
                  <>
                    <FileUp size={20} color="#fff" />
                    <Text style={styles.uploadButtonText}>Upload Handbook PDF</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" delay={100} duration={500} style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Moon size={20} color={Colors.secondary} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#d1d1d1', true: Colors.primaryLight }}
              thumbColor={darkMode ? Colors.primary : '#f4f4f4'}
              ios_backgroundColor="#d1d1d1"
            />
          </View>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" delay={200} duration={500} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Info size={20} color={Colors.secondary} />
              <Text style={styles.settingLabel}>App Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" delay={300} duration={500} style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to get the best answers</Text>
          <Text style={styles.infoText}>
            For accurate responses, upload the official NU Dasmarinas handbook PDF. Ask specific questions 
            about university policies, procedures, academic programs, and campus facilities.
          </Text>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  documentSection: {
    marginBottom: 8,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    padding: 12,
  },
  documentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  documentStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.success,
  },
  documentAction: {
    padding: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#888',
  },
  infoCard: {
    backgroundColor: Colors.infoLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.info,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.infoText,
    lineHeight: 20,
  },
});