import CustomTextField from '@/components/CustomTextField/CustomTextField';
import DashedButton from '@/components/DashedButton/DashedButton';
import ImageViewerWithHeader from '@/components/ImageViewer/ImageViewer';
import ConfirmationModal from '@/components/RemoveItemModal/ConfirmationModal';
import { getEnumToLabel } from '@/configs/enumToLabel';
import { EDIT } from '@/constants/common';
import { useSession } from '@/contexts/authContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useNotification } from '@/contexts/NotificationContext';
import { TransactionTypes } from '@/enums/TransactionsEnum';
import { transactionStore } from '@/store/TransactionStore';
import { AppTheme, useAppTheme } from '@/themes';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Appbar, SegmentedButtons } from 'react-native-paper';
import CategoryButtonList from './components/CategoryButtonList';
import DatePicker from './components/DatePicker';

type TransactionForm = {
  id: string | null;
  entryType: TransactionTypes;
  date: Date;
  description: string;
  amount: string;
  attachments: string[];
  category: number | null;
};

const localDate = dayjs().format('YYYY-MM-DD');

const AddExpense = () => {
  const theme = useAppTheme();
  const params = useLocalSearchParams();
  const navigator = useNavigation();
  const [form, setForm] = useState<TransactionForm>({
    id: null,
    entryType: TransactionTypes.INCOME,
    date: params?.date ? dayjs(params.date).format('YYYY-MM-DD') : localDate,
    description: '',
    amount: '',
    attachments: [],
    category: null,
  });
  const { session } = useSession();
  const styles = getStyle(theme, form.entryType);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>(
    {}
  );
  const initializedRef = React.useRef(false);
  const { showLoader, hideLoader } = useLoader();
  const { addNotification } = useNotification();
  const confirmationModalRef = useRef<Modalize>(null);

  useEffect(() => {
    if (
      !initializedRef.current &&
      params &&
      typeof params === 'object' &&
      'id' in params
    ) {
      const { id, type, date, description, amount, attachments, category } =
        params;

      const formattedDate = date
        ? dayjs(date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD');

      setForm({
        id: id ?? null,
        entryType: type ?? TransactionTypes.INCOME,
        date: formattedDate,
        description: description ?? '',
        amount: amount ?? '',
        attachments: attachments ?? [],
        category: category ? Number(category) : null,
      });

      initializedRef.current = true;
    }
  }, [params]);

  const handlePickImage = () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => pickImage(true),
        },
        {
          text: 'Gallery',
          onPress: () => pickImage(false),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (transactionId: string) => {
    try {
      if (!transactionId)
        throw new Error("Sorry! couldn't delete your transaction");
      showLoader();
      await transactionStore.deleteTransaction(transactionId);
      addNotification('Transaction deleted successfully!', 'success');
    } catch (err) {
      addNotification(
        err?.message || "Sorry! couldn't delete your transaction",
        'error'
      );
    } finally {
      hideLoader();
      navigator.goBack();
    }
  };

  async function requestPermission(fromCamera: boolean) {
    let permission;

    while (true) {
      permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.granted) {
        return true;
      }

      if (permission.canAskAgain) {
        continue;
      } else {
        Alert.alert(
          'Permission denied',
          fromCamera
            ? 'Camera access is required. Please enable it in settings.'
            : 'Gallery access is required. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    }
  }

  const pickImage = async (fromCamera: boolean) => {
    try {
      const granted = await requestPermission(fromCamera);
      if (!granted) return;

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 0.7,
          });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const mime = result.assets[0].mimeType || 'image/jpeg';
        const dataUri = `data:${mime};base64,${base64}`;

        handleChange('attachments', [...form.attachments, dataUri]);
      }
    } catch (error: any) {
      addNotification(error?.message || 'Sorry! Cant upload images', 'error');
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    const newErrors: { amount?: string; category?: string } = {};

    if (
      !form?.amount ||
      isNaN(Number(form?.amount)) ||
      Number(form?.amount) <= 0
    ) {
      newErrors.amount = 'Amount must be a valid number and greater than 0';
      hasError = true;
    }

    if (!form.category) {
      newErrors.category = 'Category is required';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const payload = {
      type: form.entryType,
      date: dayjs(form.date).format(),
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
      attachments: form.attachments,
      userId: session,
    };

    try {
      showLoader();
      if (form.id) {
        await transactionStore.updateTransaction(form.id, payload);
        addNotification('Transaction updated successfully!', 'success');
      } else {
        await transactionStore.addTransaction(payload);
        addNotification('Transaction added successfully!', 'success');
      }
    } catch (err: any) {
      addNotification(err?.message || 'Something went wrong', 'error');
    } finally {
      navigator.goBack();
      hideLoader();
    }
  };

  const handleChange = <K extends keyof TransactionForm>(
    key: K,
    value: TransactionForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDayChange = (day) => {
    handleChange('date', day.dateString);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          titleStyle={styles.headerText}
          title={'Add Transaction'}
        />
        <Appbar.BackAction
          onPress={() => {
            navigator.goBack();
          }}
        />
        <Appbar.Action
          icon="backup-restore"
          onPress={() => {
            setForm((prev) => ({
              ...prev,
              date: localDate,
              description: '',
              amount: '',
              attachments: [],
              category: null,
            }));
          }}
        />
        <Appbar.Action
          icon="delete-outline"
          onPress={() => confirmationModalRef.current?.open()}
        />
        <Appbar.Action icon="content-save-outline" onPress={handleSubmit} />
      </Appbar.Header>
      <View style={{ marginHorizontal: 20, marginVertical: 12 }}>
        <SegmentedButtons
          value={form.entryType}
          style={styles.segmentedButtons}
          onValueChange={(item) =>
            setForm((prev) => ({
              ...prev,
              category: null,
              entryType: item as
                | TransactionTypes.INCOME
                | TransactionTypes.EXPENSE,
            }))
          }
          buttons={[
            {
              value: TransactionTypes.INCOME,
              label: getEnumToLabel(TransactionTypes.INCOME),
              style: {
                borderWidth: 0,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                backgroundColor:
                  form.entryType === TransactionTypes.INCOME
                    ? theme.colors.background
                    : theme.colors.gray6Bg,
              },
              labelStyle:
                form.entryType === TransactionTypes.INCOME
                  ? { ...theme.fonts.title }
                  : { ...theme.fonts.subtitle },
              uncheckedColor: theme.colors.secondary,
              checkedColor: theme.colors.primary,
            },

            {
              value: TransactionTypes.EXPENSE,
              label: getEnumToLabel(TransactionTypes.EXPENSE),
              style: {
                borderWidth: 0,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor:
                  form.entryType === TransactionTypes.EXPENSE
                    ? theme.colors.background
                    : theme.colors.gray6Bg,
              },
              labelStyle:
                form.entryType === TransactionTypes.EXPENSE
                  ? { ...theme.fonts.title }
                  : { ...theme.fonts.subtitle },
              uncheckedColor: theme.colors.secondary,
              checkedColor: theme.colors.primary,
            },
          ]}
        />
      </View>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <DatePicker
            handleDayChange={handleDayChange}
            selectedDay={form.date}
          />
        </View>
        <View style={styles.formContent}>
          <CustomTextField
            required
            keyboardType="number-pad"
            label="Amount"
            placeholder="Amount"
            leftIcon={
              <FontAwesome6
                name="rupee-sign"
                size={12}
                color={theme.colors.gray3Text}
              />
            }
            value={form?.amount ?? ''}
            onChangeText={(text) => {
              handleChange('amount', text);
              setErrors((prev) => ({ ...prev, amount: '' }));
            }}
          />
          {errors?.amount && (
            <Text style={styles.errorMessage}>{errors.amount}</Text>
          )}
          <CustomTextField
            label="Description"
            placeholder="Description"
            leftIcon={
              <MaterialCommunityIcons
                name="pencil-outline"
                size={14}
                color={theme.colors.gray3Text}
              />
            }
            value={form?.description ?? ''}
            onChangeText={(text) => {
              handleChange('description', text);
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
          />
          <Text
            style={{
              marginTop: 6,
              ...theme.fonts.value,
              color: errors?.category
                ? theme.colors.error
                : theme.colors.gray3Text,
            }}
          >
            Categories
            <Text style={{ color: theme.colors.error }}>{'  '}*</Text>
          </Text>
          <CategoryButtonList
            selectedCategory={form.category}
            setSelectedCategory={(category) => {
              handleChange('category', category);
              setErrors((prev) => ({ ...prev, category: '' }));
            }}
            entryType={form.entryType}
            error={errors?.category}
          />
          {errors?.category && (
            <Text style={styles.errorMessage}>{errors.category}</Text>
          )}

          <View style={styles.attachmentSection}>
            {Array.isArray(form?.attachments) &&
              form?.attachments.length <= 3 && (
                <DashedButton
                  icon="plus"
                  text="Add Invoice"
                  onPress={handlePickImage}
                />
              )}
            <View style={styles.attachmentPreviewContainer}>
              {form?.attachments.map((uri, index) => (
                <TouchableOpacity
                  key={`${uri}-${index}`}
                  onPress={() => {
                    setCurrentImageIndex(index);
                    setIsViewerVisible(true);
                  }}
                >
                  <Image source={{ uri }} style={styles.attachmentImage} />
                </TouchableOpacity>
              ))}
            </View>
            <ImageViewerWithHeader
              files={form?.attachments ?? []}
              isViewerVisible={isViewerVisible}
              selectedIndex={currentImageIndex}
              mode={EDIT}
              setViewerVisible={setIsViewerVisible}
              onDelete={() => {
                if (form?.attachments) {
                  const updatedAttachments = [...form.attachments];
                  updatedAttachments.splice(currentImageIndex, 1);
                  setForm({ ...form, attachments: updatedAttachments });
                }
                setIsViewerVisible(false);
              }}
              getUri={(file) => file}
              getId={(file) => file}
            />
          </View>
        </View>
      </ScrollView>
      <ConfirmationModal
        modalizeRef={confirmationModalRef}
        title="Delete Transaction"
        subtitle="Are you sure you want to delete this transaction?"
        onOkPress={() => handleDelete(form.id)}
        onCancellPress={() => confirmationModalRef.current?.close()}
      />
    </View>
  );
};

const getStyle = (theme: AppTheme, item: TransactionTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      elevation: 6,
      backgroundColor: theme.colors.background,
    },
    headerText: {
      ...theme.fonts.headerMedium,
      color: theme.colors.gray1Text,
    },
    segmentedButtons: {
      backgroundColor: theme.colors.gray6Bg,
      borderRadius: 20,
      padding: 4,
    },
    headerWrapper: {
      marginTop: 5,
    },
    headerTitle: {
      color: theme.colors.background,
      ...theme.fonts.interSmallHeader,
    },
    amountWrapper: {
      marginHorizontal: 20,
    },
    amountLabel: {
      color: theme.colors.secondary,
      ...theme.fonts.interSmallHeader,
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    currencyText: {
      color: theme.colors.background,
      ...theme.fonts.header,
      verticalAlign: 'bottom',
    },
    amountInput: {
      color: theme.colors.background,
      ...theme.fonts.header,
      flex: 2,
      marginLeft: 10,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    formContent: {
      flex: 2,
      marginTop: 6,

      gap: 10,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    attachmentSection: {
      marginVertical: 12,
    },
    attachmentPreviewContainer: {
      marginTop: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    attachmentImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    toggleBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      overflow: 'hidden',
    },

    toggleButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: theme.colors.grayBg,
    },

    toggleButtonActive: {
      backgroundColor: theme.colors.grayBg,
    },

    toggleText: {
      color: theme.colors.onSurface,
      fontWeight: '500',
    },

    toggleTextActive: {
      color: theme.colors.secondary,
    },
    errorMessage: {
      color: theme.colors.error,
      ...theme.fonts.poppinsSmall,
    },
  });

export default observer(AddExpense);
