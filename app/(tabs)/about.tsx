import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="About EnyuPedia" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Animatable.View animation="fadeIn" duration={800} style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg' }} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </Animatable.View>
        
        <Animatable.Text animation="fadeIn" delay={300} style={styles.title}>
          EnyuPedia
        </Animatable.Text>
        
        <Animatable.Text animation="fadeIn" delay={400} style={styles.subtitle}>
          Your NU Dasmarinas AI Assistant
        </Animatable.Text>
        
        <Animatable.View animation="fadeIn" delay={500} style={styles.card}>
          <Text style={styles.cardTitle}>What is EnyuPedia?</Text>
          <Text style={styles.cardText}>
            EnyuPedia is an intelligent mobile application that leverages Retrieval-Augmented Generation (RAG) 
            technology to transform how students at NU Dasmarinas access institutional knowledge.
          </Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" delay={600} style={styles.card}>
          <Text style={styles.cardTitle}>How It Works</Text>
          <Text style={styles.cardText}>
            At its core, RAG combines vector database technology with generative AI to deliver unprecedented 
            accuracy in information retrieval. The application works by converting the university handbook 
            into vector embeddings—mathematical representations of text that capture semantic meaning—stored 
            in a specialized vector database.
          </Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" delay={700} style={styles.card}>
          <Text style={styles.cardTitle}>Benefits</Text>
          <View style={styles.bulletPoints}>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Instant access to university information</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Accurate, contextual responses to queries</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>24/7 availability for student assistance</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Reduces administrative burden on staff</Text>
            </View>
          </View>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" delay={800} style={styles.card}>
          <Text style={styles.cardTitle}>How to Use</Text>
          <Text style={styles.cardText}>
            Simply type your question about NU Dasmarinas in the chat interface, and EnyuPedia will 
            provide you with accurate information based on the university handbook.
          </Text>
          <Text style={styles.cardText}>
            For best results, ask specific questions about university policies, procedures, facilities, 
            courses, or campus information.
          </Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" delay={900} style={[styles.card, styles.versionCard]}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionText}>© 2025 NU Dasmarinas</Text>
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
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  title: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 12,
  },
  cardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  versionCard: {
    backgroundColor: Colors.lightBackground,
    alignItems: 'center',
    paddingVertical: 12,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
});