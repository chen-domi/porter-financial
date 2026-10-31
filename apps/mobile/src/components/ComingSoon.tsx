import { StyleSheet, View } from 'react-native';

import { Glass } from './Glass';
import { Screen } from './Screen';
import { Body, Display, Label } from './Typography';
import { space } from '@/theme/tokens';

type Props = { eyebrow: string; title: string; body: string; milestone: string };

/** Placeholder for tabs whose features land in a later milestone. */
export function ComingSoon({ eyebrow, title, body, milestone }: Props) {
  return (
    <Screen>
      <Label>{eyebrow}</Label>
      <Display size={40} style={{ marginTop: space.xs }}>
        {title}
      </Display>
      <Glass style={styles.card}>
        <View style={{ padding: space.lg }}>
          <Label>{milestone}</Label>
          <Body muted style={{ marginTop: space.sm }}>
            {body}
          </Body>
        </View>
      </Glass>
    </Screen>
  );
}

const styles = StyleSheet.create({ card: { marginTop: space.xl } });
