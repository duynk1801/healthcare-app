import { router } from 'expo-router';
import { Video } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Test screen: Join form for entering LiveKit URL + Token.
 * Navigates to /active-call with params.
 */
export default function TestCallScreen() {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');

  const isValid = url.trim().startsWith('wss://') && token.trim().length > 10;

  const handleJoin = useCallback(() => {
    if (!isValid) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL (wss://...) và Token hợp lệ.');
      return;
    }

    Keyboard.dismiss();

    router.push({
      pathname: '/active-call' as never,
      params: { url: url.trim(), token: token.trim() },
    } as never);
  }, [url, token, isValid]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
        >
          {/* Header Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Video size={SCREEN_WIDTH * 0.08} color='#FFFFFF' />
            </View>
            <Text style={styles.title}>Test Cuộc Gọi Video</Text>
            <Text style={styles.subtitle}>
              Nhập thông tin LiveKit để bắt đầu cuộc gọi test
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* URL Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>LiveKit Server URL</Text>
              <TextInput
                style={styles.input}
                placeholder='wss://your-app.livekit.cloud'
                placeholderTextColor='#BDBDBD'
                value={url}
                onChangeText={setUrl}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='url'
                returnKeyType='next'
              />
            </View>

            {/* Token Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Access Token</Text>
              <TextInput
                style={[styles.input, styles.tokenInput]}
                placeholder='eyJhbGciOiJ...'
                placeholderTextColor='#BDBDBD'
                value={token}
                onChangeText={setToken}
                autoCapitalize='none'
                autoCorrect={false}
                multiline
                numberOfLines={3}
                textAlignVertical='top'
                returnKeyType='done'
              />
            </View>

            {/* Join Button */}
            <Pressable
              onPress={handleJoin}
              style={({ pressed }) => [
                styles.joinButton,
                !isValid && styles.joinButtonDisabled,
                pressed && isValid && styles.joinButtonPressed,
              ]}
              disabled={!isValid}
              accessibilityRole='button'
              accessibilityLabel='Bắt đầu cuộc gọi'
            >
              <Video size={SCREEN_WIDTH * 0.05} color='#FFFFFF' />
              <Text style={styles.joinButtonText}>Bắt đầu cuộc gọi</Text>
            </Pressable>
          </View>

          {/* Help text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              💡 Lấy URL và Token từ{' '}
              <Text style={styles.helpLink}>LiveKit Cloud Dashboard</Text>
              {'\n'}hoặc dùng LiveKit CLI để generate token.
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: SCREEN_WIDTH * 0.06,
    paddingBottom: SCREEN_WIDTH * 0.1,
  },

  // Header
  iconContainer: {
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.08,
  },
  iconCircle: {
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_WIDTH * 0.18,
    borderRadius: SCREEN_WIDTH * 0.09,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
  },

  // Form
  form: {
    gap: 16,
    marginBottom: SCREEN_WIDTH * 0.06,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tokenInput: {
    minHeight: SCREEN_WIDTH * 0.2,
    paddingTop: 14,
  },

  // Join button
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  joinButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  joinButtonPressed: {
    backgroundColor: '#1E88E5',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Help
  helpContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
  },
  helpText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 20,
    textAlign: 'center',
  },
  helpLink: {
    fontWeight: '700',
  },
});
