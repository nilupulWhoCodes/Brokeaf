import AutoCompleteDropdown from '@/components/AutoCompleteDropdown/AutoCompleteDropdown';
import BackButton from '@/components/BackButton/BackButton';
import GradientButton from '@/components/GradientButton/GradientButton';
import Header from '@/components/Header/Header';
import TextArea from '@/components/TextArea/TextArea';
import TextField from '@/components/TextField/TextField';
import { getEnumToLabel } from '@/configs/enumToLabel';
import { useSession } from '@/contexts/authContext';
import { TransactionTypes } from '@/enums/TransactionsEnum';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';

const AddExpense = () => {
  const theme = useAppTheme();
  const navigator = useNavigation();
  const [entryType, setEntryType] = useState<TransactionTypes>(
    TransactionTypes.INCOME
  );
  const { session } = useSession();
  const [category, setCategory] = useState<any>(null);
  const styles = getStyle(theme, entryType);
  const [type, setType] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>(
    {}
  );

  const handlePickImage = async () => {
    Alert.alert('Upload Attachment', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Camera permission is required');
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
          });

          if (!result.canceled) {
            setAttachments((prev) => [...prev, result.assets[0].uri]);
          }
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Media Library permission is required');
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: 5,
          });

          if (!result.canceled) {
            const selectedUris = result.assets.map((asset) => asset.uri);
            setAttachments((prev) => [...prev, ...selectedUris]);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    let hasError = false;

    const newErrors: { amount?: string; category?: string } = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.log('a', amount);
      newErrors.amount = 'Amount must be a valid number greater than 0';
      hasError = true;
    }

    if (!category) {
      console.log('aa', category);
      newErrors.category = 'Category is required';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    let uploadedImageUrls: string[] = [];

    if (attachments.length > 0) {
      const userId = session;
      if (!userId) {
        Alert.alert('User not authenticated');
        return;
      }

      const uploads = await Promise.all(
        attachments.map((uri) => uploadImageToSupabase(uri, userId))
      );

      uploadedImageUrls = uploads.filter((url): url is string => Boolean(url));
    }

    const payload = {
      type: entryType,
      date: dayjs(date).format(),
      description,
      amount: Number(amount),
      category,
      attachments: uploadedImageUrls,
      userId: session,
    };

    await insertTransaction(payload);
  };

  const insertTransaction = async (payload: any) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([payload]);
    if (error) {
      console.error('Insert error:', error);
      Alert.alert('Error', error.message);
      return;
    }
    console.log('Insert success:', data);
  };

  const uploadImageToSupabase = async (
    uri: string,
    userId: string
  ): Promise<string | null> => {
    try {
      const filename = `${Date.now()}.jpg`;
      const filepath = `${userId}/${filename}`;

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: filename,
        type: 'image/jpeg',
      } as any);

      const { data, error } = await supabase.storage
        .from('transactions')
        .upload(filepath, formData.get('file') as File, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('transactions')
        .getPublicUrl(filepath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerWrapper}>
          <Header
            backIcon={() => (
              <BackButton
                iconColor={theme.colors.background}
                handleBackPress={() => navigator.goBack()}
              />
            )}
            title={getEnumToLabel(entryType)}
            titleStyle={styles.headerTitle}
          />
        </View>

        <View style={styles.amountWrapper}>
          <Text style={styles.amountLabel}>How Much</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencyText}>LKR</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              style={styles.amountInput}
              cursorColor={theme.colors.background}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* === TOGGLE BAR START === */}
        <View style={styles.toggleBar}>
          {[TransactionTypes.INCOME, TransactionTypes.EXPENSE].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.toggleButton,
                entryType === item && styles.toggleButtonActive,
              ]}
              onPress={() =>
                setEntryType(
                  item as TransactionTypes.INCOME | TransactionTypes.EXPENSE
                )
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  entryType === item && styles.toggleTextActive,
                ]}
              >
                {getEnumToLabel(item)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* === TOGGLE BAR END === */}

        <View style={styles.formContent}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <AutoCompleteDropdown
              placeholder={'Categories'}
              dataSet={[{ id: 1, name: 'Test' }]}
              labelField="name"
              valueField="id"
              selectedValue={1}
              onSelect={(value) => setCategory(value)}
              containerStyles={{ marginTop: 12 }}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextField
                placeholder="Date"
                value={dayjs(date).format('YYYY-MM-DD')}
                editable={false}
                rightIcon="calendar"
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <TextArea
              numberOfLines={6}
              label="Description"
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.attachmentSection}>
              <Button icon="camera" mode="outlined" onPress={handlePickImage}>
                Upload Attachment
              </Button>

              <View style={styles.attachmentPreviewContainer}>
                {attachments.map((uri, index) => (
                  <TouchableOpacity
                    key={uri}
                    onPress={() => {
                      setCurrentImageIndex(index);
                      setIsViewerVisible(true);
                    }}
                  >
                    <Image source={{ uri }} style={styles.attachmentImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.submitButtonWrapper}>
            <GradientButton title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyle = (theme: AppTheme, item: TransactionTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    headerSection: {
      flex: 0.5,
      justifyContent: 'space-between',
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
      flex: 1.5,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    formContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    scrollContent: {
      gap: 10,
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
    submitButtonWrapper: {
      paddingBottom: 16,
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
      backgroundColor: theme.colors.primary,
    },

    toggleText: {
      color: theme.colors.onSurface,
      fontWeight: '500',
    },

    toggleTextActive: {
      color: theme.colors.secondary,
    },
  });

export default AddExpense;
