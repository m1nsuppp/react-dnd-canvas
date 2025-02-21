import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCanvasAPI } from './canvas-api';
import { MAX_CANVAS_SIZE } from './constants';

describe('CanvasAPI', () => {
  const canvasAPI = createCanvasAPI();

  describe('clampCanvasSize', () => {
    it('입력값이 최대값보다 작으면 입력값을 그대로 반환한다', () => {
      const input = { width: 100, height: 100 };
      const result = canvasAPI.clampCanvasSize(input);
      expect(result).toEqual(input);
    });

    it('입력값이 최대값보다 크면 최대값으로 제한한다', () => {
      const input = { width: 10000, height: 10000 };
      const result = canvasAPI.clampCanvasSize(input);
      expect(result).toEqual(MAX_CANVAS_SIZE);
    });
  });

  describe('getScaledImageSize', () => {
    it('이미지가 캔버스보다 크면 캔버스 크기에 맞게 축소한다', () => {
      const canvas = { width: 100, height: 100 };
      const image = { width: 200, height: 200 };
      const result = canvasAPI.getScaledImageSize({ canvas, image });
      expect(result).toEqual({
        width: 100,
        height: 100,
        scaleFactor: 0.5,
      });
    });

    it('이미지가 캔버스보다 작으면 원본 크기를 유지한다', () => {
      const canvas = { width: 200, height: 200 };
      const image = { width: 100, height: 100 };
      const result = canvasAPI.getScaledImageSize({ canvas, image });
      expect(result).toEqual({
        width: 100,
        height: 100,
        scaleFactor: 1,
      });
    });

    it('이미지 비율이 캔버스와 다르면 더 작은 비율을 사용한다', () => {
      const canvas = { width: 100, height: 200 };
      const image = { width: 200, height: 200 };
      const result = canvasAPI.getScaledImageSize({ canvas, image });
      expect(result).toEqual({
        width: 100,
        height: 100,
        scaleFactor: 0.5,
      });
    });
  });

  describe('getBoundingBox', () => {
    beforeEach(() => {
      vi.stubGlobal('devicePixelRatio', 2);
    });

    it('이미지를 캔버스 중앙에 위치시키는 상대 좌표를 반환한다', () => {
      const canvas = { width: 200, height: 200 }; // 물리적 픽셀
      const image = { width: 50, height: 50 }; // 원본 이미지 크기

      const result = canvasAPI.getBoundingBox({ canvas, image });

      // 논리적 캔버스 크기: 100x100
      // 스케일된 이미지 크기: 50x50 (논리적) -> 100x100 (물리적)
      // 중앙 위치: (200-100)/2 = 50 (물리적 픽셀)
      expect(result).toEqual({
        xmin: 50 / 200, // 0.25
        ymin: 50 / 200, // 0.25
        xmax: 150 / 200, // 0.75
        ymax: 150 / 200, // 0.75
      });
    });
  });

  describe('drawImageContained', () => {
    it('캔버스 컨텍스트에 이미지를 그린다', () => {
      const mockCtx = {
        canvas: { width: 200, height: 200 },
        drawImage: vi.fn(),
      };
      const mockImage = { width: 100, height: 100 };

      canvasAPI.drawImageContained(
        mockCtx as unknown as CanvasRenderingContext2D,
        mockImage as unknown as HTMLImageElement,
      );

      expect(mockCtx.drawImage).toHaveBeenCalled();
    });
  });
});
