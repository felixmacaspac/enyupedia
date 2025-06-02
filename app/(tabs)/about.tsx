import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ExternalLink,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Users,
} from 'lucide-react-native';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';

export default function AboutScreen() {
  const scrollViewRef = useRef(null);

  const scrollToSection = (y) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="About EnyuPedia" />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View
          animation="fadeIn"
          duration={800}
          style={styles.heroSection}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
              }}
              style={styles.logo}
              resizeMode="contain"
            />

            <Animatable.Text
              animation="fadeIn"
              delay={300}
              style={styles.title}
            >
              EnyuPedia
            </Animatable.Text>

            <Animatable.Text
              animation="fadeIn"
              delay={400}
              style={styles.subtitle}
            >
              Your NU Dasmarinas AI Assistant
            </Animatable.Text>
          </LinearGradient>
        </Animatable.View>

        <View style={styles.quickLinks}>
          {[
            {
              title: 'What is EnyuPedia?',
              icon: <Sparkles size={18} color={Colors.primary} />,
              y: 350,
            },
            {
              title: 'How It Works',
              icon: <BookOpen size={18} color={Colors.primary} />,
              y: 550,
            },
            {
              title: 'Benefits',
              icon: <Users size={18} color={Colors.primary} />,
              y: 750,
            },
            {
              title: 'How to Use',
              icon: <Clock size={18} color={Colors.primary} />,
              y: 950,
            },
          ].map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickLink}
              onPress={() => scrollToSection(link.y)}
              activeOpacity={0.7}
            >
              {link.icon}
              <Text style={styles.quickLinkText}>{link.title}</Text>
              <ArrowRight size={14} color={Colors.primary} />
            </TouchableOpacity>
          ))}
        </View>

        <Animatable.View animation="fadeIn" delay={500} style={styles.card}>
          <View style={styles.cardHeader}>
            <Sparkles size={22} color={Colors.primary} />
            <Text style={styles.cardTitle}>What is EnyuPedia?</Text>
          </View>
          <Text style={styles.cardText}>
            EnyuPedia is an intelligent mobile application that leverages
            Retrieval-Augmented Generation (RAG) technology to transform how
            students at NU Dasmarinas access institutional knowledge.
          </Text>
          <View style={styles.cardDivider} />
          <Text style={styles.cardText}>
            With a sleek, modern interface designed specifically for Gen Z
            users, EnyuPedia makes finding information about university
            policies, procedures, and resources as simple as having a
            conversation.
          </Text>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={600} style={styles.card}>
          <View style={styles.cardHeader}>
            <BookOpen size={22} color={Colors.primary} />
            <Text style={styles.cardTitle}>How It Works</Text>
          </View>
          <Text style={styles.cardText}>
            At its core, RAG combines vector database technology with generative
            AI to deliver unprecedented accuracy in information retrieval.
          </Text>

          <View style={styles.stepContainer}>
            {[
              'University handbook is converted into vector embeddings',
              'Your questions are processed by the AI',
              'Relevant information is retrieved from the knowledge base',
              'AI generates accurate, contextual responses',
            ].map((step, index) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={700} style={styles.card}>
          <View style={styles.cardHeader}>
            <Users size={22} color={Colors.primary} />
            <Text style={styles.cardTitle}>Benefits</Text>
          </View>

          <View style={styles.benefitsGrid}>
            {[
              {
                title: 'Instant Access',
                description: 'Get information immediately, 24/7',
              },
              {
                title: 'Accuracy',
                description: 'Responses based directly on official handbook',
              },
              {
                title: 'Convenience',
                description: 'Ask questions in natural language',
              },
              {
                title: 'Time-Saving',
                description: 'Find what you need without searching',
              },
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.benefitIcon}
                >
                  <Text style={styles.benefitIconText}>
                    {benefit.title.charAt(0)}
                  </Text>
                </LinearGradient>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>
                  {benefit.description}
                </Text>
              </View>
            ))}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={800} style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={22} color={Colors.primary} />
            <Text style={styles.cardTitle}>How to Use</Text>
          </View>

          <Text style={styles.cardText}>
            Simply type your question about NU Dasmarinas in the chat interface,
            and EnyuPedia will provide you with accurate information based on
            the university handbook.
          </Text>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips for Best Results:</Text>
            <View style={styles.tipsList}>
              {[
                'Ask specific questions',
                'Use natural language',
                'Be clear about what information you need',
                'Toggle PDF mode on for handbook-specific queries',
              ].map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipBullet} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animatable.View>

        <TouchableOpacity
          style={styles.websiteLink}
          onPress={() => Linking.openURL('https://www.nu-dasma.edu.ph')}
          activeOpacity={0.8}
        >
          <Text style={styles.websiteLinkText}>
            Visit NU Dasmarinas Website
          </Text>
          <ExternalLink size={16} color={Colors.primary} />
        </TouchableOpacity>

        <Animatable.View
          animation="fadeIn"
          delay={900}
          style={styles.versionCard}
        >
          <LinearGradient
            colors={['rgba(0,112,240,0.05)', 'rgba(0,112,240,0.1)']}
            style={styles.versionGradient}
          >
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <Text style={styles.versionText}>© 2025 NU Dasmarinas</Text>
          </LinearGradient>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroGradient: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  quickLinks: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  quickLinkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginLeft: 12,
  },
  cardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EEEFF1',
    marginVertical: 16,
  },
  stepContainer: {
    marginTop: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#fff',
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  benefitItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
  },
  benefitTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  benefitDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  tipsContainer: {
    marginTop: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginTop: 8,
    marginRight: 12,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  websiteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  websiteLinkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
  },
  versionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  versionGradient: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
});
