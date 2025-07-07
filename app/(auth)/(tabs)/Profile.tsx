import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Appbar, Button, Card, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppTheme, useAppTheme } from '@/themes';

const familyMembers = [
  { id: 1, name: 'Alice', role: 'Mom', joinedAt: '2024-04-01' },
  { id: 2, name: 'Bob', role: 'Dad', joinedAt: '2024-04-02' },
  { id: 3, name: 'Charlie', role: 'Son', joinedAt: '2024-04-05' },
];

const Profile = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const styles = profileStyles(theme);

  return (
    <SafeAreaView style={styles.page}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content
          titleStyle={styles.appBarTitle}
          title={t('family_profile')}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.body}>
        <Card style={styles.familyCodeSection}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Family Code</Text>
          </View>
          <Card.Content style={{ paddingTop: 12 }}>
            <Text style={styles.familyCodeSectionTitle}>
              Share this with your family members
            </Text>
            <Text style={styles.code}>Stella-01236</Text>
          </Card.Content>
          <Card.Actions>
            <Button icon={'share'}>Share</Button>
          </Card.Actions>
        </Card>
        <Card style={styles.familyCodeSection}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>My Family Members</Text>
          </View>
          <Card.Content>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <FlatList
                  data={familyMembers}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: theme.colors.borders,
                      }}
                    />
                  )}
                  renderItem={({ item }) => (
                    <View style={styles.memberRow}>
                      <Text style={styles.memberRole}>{item.role}</Text>
                      <Text style={styles.memberMeta}>
                        Joined {item.joinedAt}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const profileStyles = (theme: AppTheme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    appBar: {
      elevation: 6,
      backgroundColor: theme.colors.background,
    },
    appBarTitle: {
      ...theme.fonts.headerMedium,
      color: theme.colors.gray1Text,
    },
    body: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      flexGrow: 1,
      gap: 12,
    },
    familyCodeSection: {
      backgroundColor: theme.colors.background,
      elevation: 6,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardHeader: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borders,
      paddingTop: 12,
      paddingBottom: 9,
      paddingHorizontal: 16,
    },
    cardHeaderText: {
      color: theme.colors.primary,
      ...theme.fonts.headerSmall,
    },
    familyCodeSectionTitle: {
      ...theme.fonts.subtitle,
      color: theme.colors.gray1Text,
      textAlign: 'center',
    },
    code: {
      ...theme.fonts.headerLarge,
      color: theme.colors.black,
      textAlign: 'center',
    },
    approveFamilyMemberTitle: {
      ...theme.fonts.title,
    },
    memberRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    memberRole: {
      ...theme.fonts.value,
      color: theme.colors.gray1Text,
    },
    memberMeta: {
      ...theme.fonts.value,
      color: theme.colors.gray1Text,
    },
  });
