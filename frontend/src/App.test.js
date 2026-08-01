import React from 'react';
import { getColorInfo, getColorStyle } from './utils/colourMapping';

// Unit test verifying calculation logic for discounts
const calculateDiscount = (price, discount) => {
  if (!discount || Number(discount) <= 0) return price;
  return Math.round(price * (1 - Number(discount) / 100));
};

describe('E-Commerce Helper Logic', () => {
  test('calculates correct discounted price', () => {
    expect(calculateDiscount(1000, 10)).toBe(900);
    expect(calculateDiscount(1999, 15)).toBe(1699);
    expect(calculateDiscount(1499, 0)).toBe(1499);
  });

  test('handles null or missing discount values', () => {
    expect(calculateDiscount(1399, null)).toBe(1399);
    expect(calculateDiscount(1099, undefined)).toBe(1099);
  });
});

describe('Colour Mapping Utility', () => {
  test('correctly maps known colors to visual hex values', () => {
    expect(getColorStyle('Pink')).toBe('#ec4899');
    expect(getColorStyle('Blue')).toBe('#3b82f6');
    expect(getColorStyle('Yellow')).toBe('#eab308');
    expect(getColorStyle('Green')).toBe('#22c55e');
    expect(getColorStyle('Black')).toBe('#111827');
    expect(getColorStyle('white ')).toBe('#ffffff');
    expect(getColorStyle('grey')).toBe('#6b7280');
    expect(getColorStyle('gray')).toBe('#6b7280');
    expect(getColorStyle('Brown')).toBe('#78350f');
    expect(getColorStyle('beige')).toBe('#f5f5dc');
    expect(getColorStyle('red')).toBe('#ef4444');
  });

  test('handles unknown colors with neutral grey fallback', () => {
    const magentaInfo = getColorInfo('Magenta');
    expect(magentaInfo.code).toBe('#cbd5e1');
    expect(magentaInfo.isKnown).toBe(false);
    expect(magentaInfo.name).toBe('Magenta');

    const unknownInfo = getColorInfo('random-color-name');
    expect(unknownInfo.code).toBe('#cbd5e1');
    expect(unknownInfo.isKnown).toBe(false);
  });

  test('handles empty or missing color values', () => {
    const emptyInfo = getColorInfo('');
    expect(emptyInfo.code).toBe('#cbd5e1');
    expect(emptyInfo.isKnown).toBe(false);

    const nullInfo = getColorInfo(null);
    expect(nullInfo.code).toBe('#cbd5e1');
    expect(nullInfo.isKnown).toBe(false);
  });
});
