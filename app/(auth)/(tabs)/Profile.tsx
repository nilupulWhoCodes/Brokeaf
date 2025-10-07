import { HomeBackground } from '@/assets/svgs';
import Circles from '@/assets/svgs/Circles';
import CustomTextField from '@/components/CustomTextField/CustomTextField';
import { useSession } from '@/contexts/authContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import { User } from '@/types/common';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('screen');

const originalHeight = 203;
const originalCricleHeight = 104;
const originalCricleWidth = 267;
const originalWidth = 414;
const aspectRatio = originalWidth / originalHeight;

const ProfileScreen = () => {
  const theme = useAppTheme();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const { session, signOut } = useSession();
  const { showLoader, hideLoader } = useLoader();
  const [refreshing, setRefreshing] = useState(false);
  const styles = getStyles(theme);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    signOut();
  };

  const fetchUser = async () => {
    try {
      showLoader();
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', session)
        .single();
      if (existingUser) {
        setUserProfile(existingUser);
      }
    } catch (error) {
      addNotification("Sorry! couldn't show your profile", 'error');
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <StatusBar style="light" translucent={true} hidden={false} />
      <View style={styles.aspectRatioWrapper}>
        <HomeBackground
          width={'100%'}
          height={'100%'}
          viewBox={`0 0 ${originalWidth} ${originalHeight}`}
          svgStyle={styles.svgStyle}
        />
        <View style={styles.backgroundContainer}>
          <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                ...theme.fonts.headerMedium,
                color: theme.colors.background,
                textAlignVertical: 'center',
              }}
            >
              {userProfile?.name ?? ''}
            </Text>
            <Text
              style={{
                ...theme.fonts.poppinsSmall,
                color: theme.colors.gray6Bg,
                textAlignVertical: 'center',
              }}
            >
              {userProfile?.occupation ?? ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.logOutBtn} onPress={handleLogout}>
            <MaterialCommunityIcons
              name="exit-to-app"
              size={24}
              color={theme.colors.background}
            />
          </TouchableOpacity>
        </View>
        <Circles
          width={'100%'}
          height={'100%'}
          viewBox={`0 0 ${originalCricleWidth} ${originalCricleHeight}`}
          svgStyle={styles.circleSvgStyle}
        />
      </View>
      <View style={styles.bodyContent}>
        <View>
          <CustomTextField
            editable={false}
            required
            label="Email"
            placeholder="Email"
            leftIcon={
              <MaterialCommunityIcons
                name="email"
                size={14}
                color={theme.colors.gray3Text}
              />
            }
            value={userProfile?.email}
            onChangeText={(text) =>
              setUserProfile((prev) => (prev ? { ...prev, email: text } : prev))
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    circleSvgStyle: {
      position: 'absolute',
      top: -50,
      left: -60,
      zIndex: 2,
    },
    bodyContent: {
      flex: 1,
      marginHorizontal: 20,
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 20,
    },
    userNameText: {
      textAlign: 'center',
      ...theme.fonts.interSemiHeader,
      color: theme.colors.secondary,
    },
    occupationText: {
      textAlign: 'center',
      ...theme.fonts.body,
      color: theme.colors.tertiary,
    },
    logOutBtn: {
      height: 50,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backgroundContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      paddingHorizontal: 20,
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
