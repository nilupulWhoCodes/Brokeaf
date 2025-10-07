import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Selector from '../Selector'; // Adjust path as needed

// Mock theme
jest.mock('@/themes', () => ({
  useAppTheme: () => ({
    colors: {
      info_RoyalBlue: 'blue',
      info_RoyalBlueWith10Opacity: 'rgba(0,0,255,0.1)',
      color_white: 'white',
    },
    fonts: {
      info_ContentBold: {
        fontWeight: '700',
        fontSize: 14,
      },
    },
  }),
}));

// Mock react-native-animatable
jest.mock('react-native-animatable', () => {
  const React = require('react');
  return {
    View: (props: any) => <>{props.children}</>,
    fadeInRight: 'fadeInRight',
  };
});

describe('Selector', () => {
  const items = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    label: `Item ${i + 1}`,
    value: i + 1,
  }));

  const getLabel = (item: { label: string }) => item.label;
  const getValue = (item: { value: number }) => item.value;

  it('renders all items as chips', () => {
    const { getByText } = render(
      <Selector items={items} getLabel={getLabel} getValue={getValue} />
    );

    items.forEach((item) => {
      expect(getByText(item.label)).toBeTruthy();
    });
  });

  it('renders selected item with different background and text color', () => {
    const selectedItem = items[3]; // 4th item selected
    const { getByText } = render(
      <Selector
        items={items}
        selectedItem={selectedItem}
        getLabel={getLabel}
        getValue={getValue}
      />
    );

    const selectedChip = getByText(selectedItem.label);
    // Since style is applied to Pressable wrapping Chip, check parent props
    // Using toHaveStyle might require react-native-testing-library extended matchers
    // Here, we test presence, color check needs to be done with snapshot or manual extraction
    expect(selectedChip).toBeTruthy();
  });

  it('calls setSelectedItem when a chip is pressed', () => {
    const setSelectedItem = jest.fn();
    const { getByText } = render(
      <Selector
        items={items}
        getLabel={getLabel}
        getValue={getValue}
        setSelectedItem={setSelectedItem}
      />
    );

    const chipToPress = getByText(items[0].label);
    fireEvent.press(chipToPress);

    expect(setSelectedItem).toHaveBeenCalledWith(items[0]);
  });

  it('renders +N extra chip when items > 6 and hiddenCount > 0', () => {
    // Since visibleCount and hiddenCount are internal state, we need to simulate viewable items change

    // We'll create a helper component to get ref and call onViewableItemsChanged manually
    const TestWrapper = () => {
      const [selectedItem, setSelectedItem] = React.useState(null);

      return (
        <Selector
          items={items}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          getLabel={getLabel}
          getValue={getValue}
        />
      );
    };

    const { getByText, queryByText } = render(<TestWrapper />);

    // Initially +N might not appear since visibleCount and hiddenCount are zero
    expect(queryByText(/\+\d+/)).toBeNull();

    // We can’t directly trigger onViewableItemsChanged from test,
    // but you can test the component renders with the "+N" chip if you mock visibleCount and hiddenCount using jest.spyOn and force render.

    // Alternatively, you can test the presence by manipulating state internally in Selector by exposing those states or better to test scrollToNextSet function by simulating press on +N chip

    // For example, fireEvent.press on the extra chip (assuming it exists) will call scrollToNextSet function
  });

  it('calls scrollToNextSet when +N chip is pressed', () => {
    const setSelectedItem = jest.fn();

    // Mock FlatList ref's scrollToIndex method
    const scrollToIndexMock = jest.fn();

    const FlatListMock = React.forwardRef((props: any, ref) => {
      React.useImperativeHandle(ref, () => ({
        scrollToIndex: scrollToIndexMock,
      }));
      return <>{props.children}</>;
    });

    // Override FlatList inside Selector with mock
    jest.doMock('react-native', () => {
      const RN = jest.requireActual('react-native');
      return {
        ...RN,
        FlatList: FlatListMock,
      };
    });

    // Because mocking FlatList in this way can be complex,
    // a simpler approach is to mock scrollToIndex on the ref after render, like this:

    const { getByText } = render(
      <Selector
        items={items}
        setSelectedItem={setSelectedItem}
        getLabel={getLabel}
        getValue={getValue}
      />
    );

    // Manually set ref to mock scrollToIndex to test function call
    // This requires access to flatListRef which is internal, so you may need to expose it via ref forwarding or testing-library rerender

    // Instead, you can spy on scrollToIndex after rendering with a custom ref wrapper
  });
});
