import { describe, it, expect, vi } from 'vitest';
import { BandAxis } from './bandAxis.js';
import type { XYChartAxisConfig, XYChartAxisThemeConfig } from '../../interfaces.js';
import type { TextDimensionCalculator } from '../../textDimensionCalculator.js';

const mockThemeConfig: XYChartAxisThemeConfig = {
  titleColor: '#000',
  labelColor: '#000',
  tickColor: '#000',
  axisLineColor: '#000',
};

function makeAxisConfig(overrides: Partial<XYChartAxisConfig> = {}): XYChartAxisConfig {
  return {
    showLabel: true,
    labelFontSize: 14,
    labelPadding: 5,
    showTitle: false,
    titleFontSize: 16,
    titlePadding: 5,
    showTick: true,
    tickLength: 5,
    tickWidth: 2,
    showAxisLine: true,
    axisLineWidth: 2,
    labelRotation: 0,
    ...overrides,
  };
}

function makeDimensionCalculator(width = 60, height = 14): TextDimensionCalculator {
  return {
    getMaxDimension: vi.fn().mockReturnValue({ width, height }),
  };
}

describe('BaseAxis label rotation', () => {
  it('should use rotation 0 by default for bottom axis labels', () => {
    const config = makeAxisConfig({ labelRotation: 0 });
    const calculator = makeDimensionCalculator();
    const axis = new BandAxis(config, mockThemeConfig, ['Jan', 'Feb', 'Mar'], '', calculator);

    axis.setAxisPosition('bottom');
    axis.calculateSpace({ width: 500, height: 100 });
    axis.setRange([0, 500]);
    axis.setBoundingBoxXY({ x: 0, y: 50 });

    const elements = axis.getDrawableElements();
    const labelElem = elements.find((e) => e.groupTexts.includes('label'));
    expect(labelElem).toBeDefined();
    if (labelElem && labelElem.type === 'text') {
      expect(labelElem.data[0].rotation).toBe(0);
      expect(labelElem.data[0].horizontalPos).toBe('center');
    }
  });

  it('should apply negative rotation to bottom axis labels and use right alignment', () => {
    const config = makeAxisConfig({ labelRotation: -45 });
    const calculator = makeDimensionCalculator();
    const axis = new BandAxis(config, mockThemeConfig, ['Jan', 'Feb', 'Mar'], '', calculator);

    axis.setAxisPosition('bottom');
    axis.calculateSpace({ width: 500, height: 100 });
    axis.setRange([0, 500]);
    axis.setBoundingBoxXY({ x: 0, y: 50 });

    const elements = axis.getDrawableElements();
    const labelElem = elements.find((e) => e.groupTexts.includes('label'));
    expect(labelElem).toBeDefined();
    if (labelElem && labelElem.type === 'text') {
      expect(labelElem.data[0].rotation).toBe(-45);
      expect(labelElem.data[0].horizontalPos).toBe('right');
    }
  });

  it('should apply positive rotation to bottom axis labels and use left alignment', () => {
    const config = makeAxisConfig({ labelRotation: 45 });
    const calculator = makeDimensionCalculator();
    const axis = new BandAxis(config, mockThemeConfig, ['Jan', 'Feb', 'Mar'], '', calculator);

    axis.setAxisPosition('bottom');
    axis.calculateSpace({ width: 500, height: 100 });
    axis.setRange([0, 500]);
    axis.setBoundingBoxXY({ x: 0, y: 50 });

    const elements = axis.getDrawableElements();
    const labelElem = elements.find((e) => e.groupTexts.includes('label'));
    expect(labelElem).toBeDefined();
    if (labelElem && labelElem.type === 'text') {
      expect(labelElem.data[0].rotation).toBe(45);
      expect(labelElem.data[0].horizontalPos).toBe('left');
    }
  });

  it('should calculate more height for rotated labels than non-rotated', () => {
    const calculatorNoRotation = makeDimensionCalculator(60, 14);
    const axisNoRotation = new BandAxis(
      makeAxisConfig({ labelRotation: 0 }),
      mockThemeConfig,
      ['Jan', 'Feb', 'Mar'],
      '',
      calculatorNoRotation
    );
    axisNoRotation.setAxisPosition('bottom');
    const spaceNoRotation = axisNoRotation.calculateSpace({ width: 500, height: 200 });

    const calculatorWithRotation = makeDimensionCalculator(60, 14);
    const axisWithRotation = new BandAxis(
      makeAxisConfig({ labelRotation: -45 }),
      mockThemeConfig,
      ['Jan', 'Feb', 'Mar'],
      '',
      calculatorWithRotation
    );
    axisWithRotation.setAxisPosition('bottom');
    const spaceWithRotation = axisWithRotation.calculateSpace({ width: 500, height: 200 });

    // Rotated labels should occupy more vertical space
    expect(spaceWithRotation.height).toBeGreaterThan(spaceNoRotation.height);
  });
});
