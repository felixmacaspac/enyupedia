import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Info } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import Colors from '@/constants/Colors';
import enyupediaLogo from '/Users/felixmacaspac/Documents/mobile/enyupedia/assets/images/enyupedia-logo.png';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showInfo?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  showInfo = false,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isRootPath =
    pathname === '/' ||
    pathname === '/index' ||
    pathname === '/about' ||
    pathname === '/settings';

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Animatable.View
        animation="fadeIn"
        duration={600}
        style={styles.headerContent}
      >
        {showBackButton && !isRootPath && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={styles.logoTitleContainer}>
          <Image
            source={enyupediaLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* {showInfo && (
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => router.push('/about')}
            activeOpacity={0.7}
          >
            <Info size={22} color="#fff" />
          </TouchableOpacity>
        )} */}

        {/* Empty view to maintain centering when back button is shown */}
        {showBackButton && !isRootPath && !showInfo && (
          <View style={styles.placeholder} />
        )}
      </Animatable.View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === 'ios' ? 18 : (StatusBar.currentHeight ?? 0) + 16,
    paddingBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
    backgroundColor: Colors.primary,
  },
  logoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 50,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },
  infoButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },
  placeholder: {
    width: 24,
  },
  title: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
