import { HomeBackground } from '@/assets/svgs';
import Circles from '@/assets/svgs/Circles';
import AnimatedAmount from '@/components/AnimatedAmount/AnimatedAmount';
import BottomDrawer from '@/components/BottomDrawer/BottomDrawer';
import IncomeChart from '@/components/charts/BarChart/IncomeChart';
import GradientButton from '@/components/GradientButton/GradientButton';
import TextField from '@/components/TextField/TextField';
import { useSession } from '@/contexts/authContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useTabBarVisibility } from '@/contexts/TabBarContext';
import useFormatAmount from '@/hooks/useFormatAmountHook';
import { transactionStore } from '@/store/TransactionStore';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';

interface AdditionalUserDetailsProps {
  name: string;
  occupation: string;
  isNewUser?: false;
}
const { width } = Dimensions.get('screen');

const originalHeight = 203;
const originalCricleHeight = 104;
const originalCricleWidth = 267;
const originalWidth = 414;
const aspectRatio = originalWidth / originalHeight;

const Home = () => {
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
  const { showLoader, hideLoader } = useLoader();
  const { addNotification } = useNotification();
  const { formatAmount } = useFormatAmount();
  const { transactions, totalIncome, totalExpense, totalBalance } =
    transactionStore;
  const scrollViewRef = useRef<ScrollView>(null);
  const { setIsVisible } = useTabBarVisibility();

  useEffect(() => {
    const init = async () => {
      if (session) {
        const user = await checkIfUserExist();
        if (user) {
          await fetchTransactionFromUserId();
        }
      }
    };
    init();
  }, []);

  const fetchTransactionFromUserId = async () => {
    try {
      showLoader();
      if (!session) throw new Error("Sorry! couldn't load your transactions");
      await transactionStore.fetchTransactions(session);
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error);
      addNotification(error?.message || "Couldn't load data", 'error');
    } finally {
      hideLoader();
    }
  };

  const checkIfUserExist = async () => {
    try {
      showLoader();
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session)
        .single();

      if (fetchError) throw fetchError;

      if (existingUser?.isNewUser !== false) {
        setIsVisible(false);
        additionalInformationModal.current?.open();
      } else {
        setUserName(existingUser?.name ?? null);
        return existingUser;
      }
    } catch (error) {
      addNotification(error?.message || "Couldn't load data", 'error');
    } finally {
      hideLoader();
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
      showLoader();
      const { error } = await supabase
        .from('users')
        .update({
          name: userAdditionalDetails.name.trim(),
          occupation: userAdditionalDetails.occupation.trim(),
          isNewUser: false,
        })
        .eq('id', session);

      if (error) {
        throw error;
      }

      await checkIfUserExist();
      addNotification('Successfully added your data', 'success');
      additionalInformationModal.current?.close();
      setIsVisible(true);
    } catch (err) {
      addNotification(
        error?.message || "Sorry couldn't update your data",
        'error'
      );
    } finally {
      hideLoader();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good afternoon';
    return 'Good Night';
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
      >
        <StatusBar style="light" translucent={true} hidden={false} />
        <View style={[styles.aspectRatioWrapper]}>
          <HomeBackground
            width={'100%'}
            height={'100%'}
            viewBox={`0 0 ${originalWidth} ${originalHeight}`}
            svgStyle={styles.svgStyle}
          />
          <Circles
            width={'100%'}
            height={'100%'}
            viewBox={`0 0 ${originalCricleWidth} ${originalCricleHeight}`}
            svgStyle={styles.circleSvgStyle}
          />
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.userNameText}>{userName ?? ''}</Text>
          </View>
          <View style={styles.cardContainerOverlay}>
            <Text style={styles.cardTitle}>Total Balance</Text>
            <AnimatedAmount amount={totalBalance} style={styles.cardAmount} />
            <View style={styles.cardStatsRow}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                <View
                  style={{
                    borderRadius: 100,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  }}
                >
                  <Entypo
                    name="chevron-up"
                    size={18}
                    color={theme.colors.background}
                  />
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.cardStatLabel}>Income</Text>
                  <AnimatedAmount
                    amount={totalIncome}
                    style={styles.cardStatValue}
                  />
                </View>
              </View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                <View
                  style={{
                    borderRadius: 100,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  }}
                >
                  <Entypo
                    name="chevron-down"
                    size={18}
                    color={theme.colors.background}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                  }}
                >
                  <Text style={styles.cardStatLabel}>Expenses</Text>
                  <AnimatedAmount
                    amount={totalExpense}
                    style={styles.cardStatValue}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 110 }}>
          <View style={styles.chartContainer}>
            <IncomeChart
              transactions={transactions}
              scrollViewRef={scrollViewRef}
            />
          </View>
        </View>
      </ScrollView>
      <BottomDrawer
        HeaderComponent={
          <Text style={styles.drawerHeaderText}>Please fill these details</Text>
        }
        FooterComponent={
          <GradientButton title="Save" onPress={handleAdditionalInfoSubmit} />
        }
        adjustToContentHeight={true}
        modalRef={additionalInformationModal}
        closeOnOverlayTap={false}
        panGestureEnabled={false}
        withHandle={false}
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
};

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
    greetingContainer: {
      position: 'absolute',
      top: 0,
      zIndex: 999,
      height: '90%',
      paddingHorizontal: 20,
      justifyContent: 'center',
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
      bottom: -85,
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
      color: '#D0E5E4',
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
      ...theme.fonts.headerLarge,
      marginTop: 20,
    },
    chartContainer: {
      elevation: 6,
      padding: 0,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      marginHorizontal: 20,
    },
  });

export default observer(Home);
