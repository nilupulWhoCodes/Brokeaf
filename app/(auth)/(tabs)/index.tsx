import { HomeBackground } from '@/assets/svgs';
import BottomDrawer from '@/components/BottomDrawer/BottomDrawer';
import GradientButton from '@/components/GradientButton/GradientButton';
import TextField from '@/components/TextField/TextField';
import { useSession } from '@/contexts/authContext';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';

interface AdditionalUserDetailsProps {
  name: string;
  occupation: string;
  isNewUser?: false;
}
const { width } = Dimensions.get('screen');

const originalHeight = 287;
const originalWidth = 414;
const aspectRatio = originalWidth / originalHeight;

export default function Home() {
  const theme = useAppTheme();
  const { session } = useSession();
  const styles = getStyles(theme);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAdditionalDetails, setUserAdditionalDetails] =
    useState<AdditionalUserDetailsProps>({
      name: '',
      occupation: '',
      isNewUser: false,
    });
  const [userAdditionalDetailsErrors, setUserAdditionalDetailsErrors] =
    useState<Partial<AdditionalUserDetailsProps>>({
      name: '',
      occupation: '',
    });
  const additionalInformationModal = useRef<Modalize>(null);

  useEffect(() => {
    if (session) {
      checkIfUserExist();
    }
  }, []);

  const checkIfUserExist = async () => {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session)
        .single();

      if (existingUser?.isNewUser !== false) {
        additionalInformationModal.current?.open();
      } else {
        setUserName(existingUser?.name ?? null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdditionalInfoSubmit = async () => {
    const errors: Partial<AdditionalUserDetailsProps> = {
      name: '',
      occupation: '',
    };

    let hasError = false;

    if (!userAdditionalDetails.name.trim()) {
      errors.name = 'Name is required';
      hasError = true;
    }

    if (!userAdditionalDetails.occupation.trim()) {
      errors.occupation = 'Occupation is required';
      hasError = true;
    }

    setUserAdditionalDetailsErrors(errors);

    if (hasError) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: userAdditionalDetails.name.trim(),
          occupation: userAdditionalDetails.occupation.trim(),
          isNewUser: false,
        })
        .eq('id', session);

      if (error) {
        console.error('Error updating user:', error);
        Alert.alert('Update failed', 'Please try again.');
        return;
      }

      await checkIfUserExist();

      Alert.alert('Success', 'Details updated!');
      additionalInformationModal.current?.close();
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.aspectRatioWrapper]}>
        <HomeBackground
          width={'100%'}
          height={'100%'}
          viewBox={`0 0 ${originalWidth} ${originalHeight}`}
          svgStyle={styles.svgStyle}
        />
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.userNameText}>{userName ?? ''}</Text>
        </View>
        <View style={styles.cardContainerOverlay}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <Text style={styles.cardAmount}>2,548</Text>
          <View style={styles.cardStatsRow}>
            <View>
              <Text style={styles.cardStatLabel}>Income</Text>
              <Text style={styles.cardStatValue}>1233</Text>
            </View>
            <View>
              <Text style={styles.cardStatLabel}>Expenses</Text>
              <Text style={styles.cardStatValue}>1233</Text>
            </View>
          </View>
        </View>
      </View>
      <BottomDrawer
        HeaderComponent={
          <Text style={styles.drawerHeaderText}>Please fill these details</Text>
        }
        FooterComponent={
          <GradientButton title="Save" onPress={handleAdditionalInfoSubmit} />
        }
        adjustToContentHeight
        modalRef={additionalInformationModal}
      >
        <View style={{ gap: 4 }}>
          <TextField
            required
            errorMessage={userAdditionalDetailsErrors.name}
            placeholder="Name"
            value={userAdditionalDetails.name ?? ''}
            onChangeText={(text) => {
              setUserAdditionalDetailsErrors((prev) => ({
                ...prev,
                name: '',
              }));
              setUserAdditionalDetails((prev) => ({ ...prev, name: text }));
            }}
          />
          <TextField
            required
            errorMessage={userAdditionalDetailsErrors.occupation}
            placeholder="Occupation"
            value={userAdditionalDetails.occupation ?? ''}
            onChangeText={(text) => {
              setUserAdditionalDetailsErrors((prev) => ({
                ...prev,
                occupation: '',
              }));
              setUserAdditionalDetails((prev) => ({
                ...prev,
                occupation: text,
              }));
            }}
          />
        </View>
      </BottomDrawer>
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 16,
    },
    aspectRatioWrapper: {
      aspectRatio,
      position: 'relative',
      zIndex: 0,
    },
    svgStyle: {
      width: width,
      position: 'absolute',
      top: 0,
      zIndex: 0,
    },
    greetingContainer: {
      position: 'absolute',
      top: 50,
      margin: 20,
      zIndex: 2,
    },
    greetingText: {
      ...theme.fonts.interMedSubTitle,
      color: theme.colors.background,
    },
    userNameText: {
      ...theme.fonts.interSemiHeader,
      color: theme.colors.background,
    },
    cardContainerOverlay: {
      position: 'absolute',
      bottom: -60,
      left: 20,
      right: 20,
      zIndex: 2,
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      paddingVertical: 25,
      paddingHorizontal: 20,
      elevation: 6,
    },
    cardTitle: {
      ...theme.fonts.interSemiSubTitle,
      color: theme.colors.background,
    },
    cardAmount: {
      ...theme.fonts.interBoldTitleLg,
      color: theme.colors.background,
    },
    cardStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    cardStatLabel: {
      ...theme.fonts.interMedSubTitle,
      color: theme.colors.secondary,
    },
    cardStatValue: {
      ...theme.fonts.interSemiHeader,
      color: theme.colors.background,
    },
    fabStyle: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: theme.colors.primary,
      borderRadius: 28,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
    },
    drawerHeaderText: {
      textAlign: 'center',
      ...theme.fonts.headerMedium,
      marginTop: 10,
    },
  });
