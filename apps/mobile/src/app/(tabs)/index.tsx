import { useAuth, useUser } from '@clerk/expo';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Glass } from '@/components/Glass';
import { BellIcon, SparkleIcon } from '@/components/icons';
import { Screen } from '@/components/Screen';
import { Tile } from '@/components/Tile';
import { Body, Display, Label, Money } from '@/components/Typography';
import { useMe } from '@/lib/api';
import { fonts, radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 18) return 'Good afternoon,';
  return 'Good evening,';
}

export default function Home() {
  const { palette } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();
  const me = useMe();
  const firstName = user?.firstName ?? 'there';

  const confirmSignOut = () =>
    Alert.alert('Sign out of Porter?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
    ]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable style={styles.who} onPress={confirmSignOut} accessibilityLabel="Account">
          <View
            style={[
              styles.avatar,
              { borderColor: palette.glassEdge, backgroundColor: palette.glassFill },
            ]}
          >
            <Text style={{ color: palette.text, fontFamily: fonts.medium }}>
              {firstName.charAt(0)}
            </Text>
          </View>
          <View>
            <Body muted style={{ fontSize: 12, lineHeight: 15 }}>
              {greeting()}
            </Body>
            <Display size={21}>{firstName}</Display>
          </View>
        </Pressable>
        <Glass radius={18} style={styles.iconButton}>
          <View style={styles.center}>
            <BellIcon color={palette.text} />
          </View>
        </Glass>
      </View>

      <View style={styles.netWorthLabel}>
        <Body muted style={{ fontSize: 13 }}>
          Net worth
        </Body>
      </View>
      <Money cents={null} size={46} />
      <Body muted style={{ fontSize: 13, marginTop: space.xs }}>
        Appears once your accounts are connected.
      </Body>

      <Glass style={styles.connect}>
        <View style={{ padding: space.lg }}>
          <Label>Next step</Label>
          <Display size={26} style={{ marginTop: space.xs }}>
            Connect your accounts
          </Display>
          <Body muted style={{ marginTop: space.xs }}>
            Amex, Chase, Capital One, Bank of America, Bilt and Schwab, through Plaid. Arrives in
            M1.
          </Body>
        </View>
      </Glass>

      <View style={styles.tiles}>
        <Tile label="Left this week" value={null} caption="Set a budget" />
        <Tile
          label="Points"
          value={null}
          accessory={<SparkleIcon color={palette.champagne} size={12} filled />}
        />
      </View>
      <View style={styles.tiles}>
        <Tile label="Credits to use" value={null} />
        <Tile label="Next payment" value={null} />
      </View>

      <Glass radius={radius.md} style={{ marginTop: space.sm }}>
        <View style={styles.status}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: me.isSuccess
                  ? palette.sage
                  : me.isError
                    ? palette.ember
                    : palette.textMuted,
              },
            ]}
          />
          <Body muted style={{ fontSize: 12, flex: 1 }}>
            {me.isSuccess
              ? 'Connected to the Porter API'
              : me.isError
                ? 'Can’t reach the Porter API'
                : 'Connecting to the Porter API…'}
          </Body>
        </View>
      </Glass>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  who: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: { width: 36, height: 36 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  netWorthLabel: { marginTop: space.xxl },
  connect: { marginTop: space.xl },
  tiles: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  status: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
