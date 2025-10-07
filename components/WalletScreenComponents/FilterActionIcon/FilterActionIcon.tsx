import { AppTheme } from '@/themes';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Badge, Tooltip } from 'react-native-paper';

interface FilterActionProps {
  activeFiltersCount: number;
  onPress: () => void;
}

const FilterAction: React.FC<FilterActionProps> = ({
  activeFiltersCount,
  onPress,
}) => {
  return (
    <Tooltip title="Filters">
      <View style={styles.container}>
        <Appbar.Action
          icon="filter"
          iconColor={AppTheme.colors.primary}
          onPress={onPress}
        />
        {activeFiltersCount > 0 && (
          <Badge
            style={[styles.badge, { backgroundColor: AppTheme.colors.primary }]}
            size={15}
          >
            {activeFiltersCount}
          </Badge>
        )}
      </View>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    color: AppTheme.colors.background,
  },
});

export default FilterAction;
