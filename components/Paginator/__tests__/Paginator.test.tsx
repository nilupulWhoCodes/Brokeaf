import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import Paginator from '../Paginator';

jest.useFakeTimers();

jest.mock('@/themes', () => ({
  useAppTheme: () => ({
    colors: { info_RoyalBlue: 'blue' },
  }),
}));

jest.mock('@expo/vector-icons/AntDesign', () => {
  const React = require('react');
  return (props: any) => <React.Fragment>{props.children}</React.Fragment>;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Paginator', () => {
  const slides = [1, 2, 3, 4];

  it('renders correct number of dots', () => {
    const rendered = render(
      <Paginator slides={slides} currentSlide={0} activeColor="red" />
    );

    // Run timers inside act
    act(() => {
      jest.advanceTimersByTime(200);
    });

    const dots = rendered.getAllByTestId('paginator-dot');
    expect(dots.length).toBe(slides.length);
  });

  it('applies activeColor to the current dot', () => {
    const rendered = render(
      <Paginator slides={slides} currentSlide={2} activeColor="red" />
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const dots = rendered.getAllByTestId('paginator-dot');

    const activeDot = dots[2];
    const styles = activeDot.props.style;
    const hasActiveColor = Array.isArray(styles)
      ? styles.some((s: any) => s.backgroundColor === 'red')
      : styles.backgroundColor === 'red';
    expect(hasActiveColor).toBe(true);
  });

  it('renders skip button and calls onSkip when pressed', () => {
    const onSkipMock = jest.fn();

    const rendered = render(
      <Paginator
        slides={slides}
        currentSlide={0}
        onSkip={onSkipMock}
        activeColor="red"
      />
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const skipButton = rendered.getByText('skip');
    expect(skipButton).toBeTruthy();

    fireEvent.press(skipButton);
    expect(onSkipMock).toHaveBeenCalledTimes(1);
  });

  it('does not render skip button if onSkip not provided', () => {
    const rendered = render(
      <Paginator slides={slides} currentSlide={0} activeColor="red" />
    );
    expect(rendered.queryByText('skip')).toBeNull();
  });
});
