import { BlurView } from 'expo-blur';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, StyleSheet, View } from 'react-native';

import { Atmosphere } from '@/components/Atmosphere';
import { Button } from '@/components/Button';
import { LockIcon } from '@/components/icons';
import { Body, Display } from '@/components/Typography';
import { space } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const RELOCK_AFTER_MS = 5 * 60 * 1000;

async function promptUnlock(): Promise<'unlocked' | 'failed' | 'cancelled'> {
  // Without enrolled biometrics (e.g. the simulator) iOS falls back to the device passcode.
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Porter',
    cancelLabel: 'Cancel',
  });
  if (result.success) return 'unlocked';
  return result.error === 'user_cancel' || result.error === 'app_cancel' ? 'cancelled' : 'failed';
}

/**
 * Locks the app behind Face ID on launch and after 5 minutes in the background, and blurs
 * the screen whenever the app is inactive so balances never show in the app switcher.
 */
export function BiometricGate({ children }: { children: ReactNode }) {
  const { palette, scheme } = useTheme();
  const [unlocked, setUnlocked] = useState(false);
  const [obscured, setObscured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backgroundedAt = useRef<number | null>(null);

  const authenticate = useCallback(
    () =>
      promptUnlock().then((outcome) => {
        setUnlocked(outcome === 'unlocked');
        setError(outcome === 'failed' ? 'Face ID didn’t recognise you. Try again.' : null);
      }),
    [],
  );

  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setObscured(false);
        const away = backgroundedAt.current;
        backgroundedAt.current = null;
        if (away !== null && Date.now() - away > RELOCK_AFTER_MS) {
          setUnlocked(false);
          void authenticate();
        }
      } else {
        setObscured(true);
        backgroundedAt.current ??= Date.now();
      }
    });
    return () => subscription.remove();
  }, [authenticate]);

  if (!unlocked) {
    return (
      <View style={styles.lock}>
        <Atmosphere />
        <View style={styles.lockContent}>
          <LockIcon color={palette.text} size={28} />
          <Display size={40} style={{ marginTop: space.lg }}>
            Porter is locked
          </Display>
          <Body muted style={{ marginTop: space.sm, textAlign: 'center' }}>
            {error ?? 'Your finances stay private until you unlock.'}
          </Body>
        </View>
        <View style={styles.lockAction}>
          <Button title="Unlock with Face ID" onPress={() => void authenticate()} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
      {obscured ? <BlurView intensity={60} tint={scheme} style={StyleSheet.absoluteFill} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  lock: { flex: 1 },
  lockContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  lockAction: { padding: space.xl, paddingBottom: 56 },
});
