import { useSignIn } from '@clerk/expo';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Glass } from '@/components/Glass';
import { Screen } from '@/components/Screen';
import { Body, Display, Label } from '@/components/Typography';
import { fonts, space } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/**
 * Email-code sign-in. Sign-ups are disabled in the Clerk dashboard (restricted mode),
 * so only the owner's existing account can get through.
 */
export default function SignIn() {
  const { signIn, fetchStatus } = useSignIn();
  const { palette } = useTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [error, setError] = useState<string | null>(null);
  const busy = fetchStatus === 'fetching';

  async function sendCode() {
    setError(null);
    const { error: sendError } = await signIn.emailCode.sendCode({ emailAddress: email.trim() });
    if (sendError) {
      setError(sendError.message);
      return;
    }
    setStep('code');
  }

  async function verify() {
    setError(null);
    const { error: verifyError } = await signIn.emailCode.verifyCode({ code: code.trim() });
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    if (signIn.status === 'complete') {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) setError(finalizeError.message);
    } else {
      setError('This account needs another verification step that Porter doesn’t support yet.');
    }
  }

  const inputStyle = [
    styles.input,
    { color: palette.text, fontFamily: fonts.regular, borderColor: palette.hairline },
  ];

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.hero}>
          <Label>Porter</Label>
          <Display size={48} style={{ marginTop: space.md }}>
            {step === 'email' ? 'Welcome back.' : 'Check your inbox.'}
          </Display>
          <Body muted style={{ marginTop: space.sm }}>
            {step === 'email'
              ? 'Sign in with the email on your Porter account.'
              : `We sent a six-digit code to ${email.trim()}.`}
          </Body>
        </View>

        <Glass style={styles.panel}>
          <View style={{ padding: space.lg, gap: space.md }}>
            {step === 'email' ? (
              <TextInput
                style={inputStyle}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={palette.textMuted}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => void sendCode()}
              />
            ) : (
              <TextInput
                style={[inputStyle, styles.code]}
                value={code}
                onChangeText={setCode}
                placeholder="000000"
                placeholderTextColor={palette.textMuted}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                maxLength={6}
                onSubmitEditing={() => void verify()}
              />
            )}
            {error ? <Body style={{ color: palette.ember, fontSize: 13 }}>{error}</Body> : null}
            {step === 'email' ? (
              <Button
                title="Continue"
                onPress={() => void sendCode()}
                loading={busy}
                disabled={!email.includes('@')}
              />
            ) : (
              <Button
                title="Sign in"
                onPress={() => void verify()}
                loading={busy}
                disabled={code.trim().length < 6}
              />
            )}
          </View>
        </Glass>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'flex-end' },
  hero: { flex: 1, justifyContent: 'center' },
  panel: { marginBottom: space.lg },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: space.lg,
    fontSize: 16,
  },
  code: { fontSize: 24, letterSpacing: 10, textAlign: 'center' },
});
