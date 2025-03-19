import { useState, useRef, useCallback, RefObject } from "react";

interface PickerPosition {
  top: number;
  left: number;
}

interface UseEmojiPickerPositionOptions {
  scaleFactor?: number; // например, 0.8
  pickerHeight?: number; // базовая (unscaled) высота пикера, например, 300
  adjustments?: {
    // корректирующие отступы (например, для смещения)
    left?: number;
    top?: number;
  };
}

const useEmojiPickerPosition = (
  iconRef: RefObject<HTMLImageElement | null>,
  options?: UseEmojiPickerPositionOptions,
) => {
  const {
    scaleFactor = 1,
    pickerHeight = 300,
    adjustments = {},
  } = options || {};
  const [pickerPosition, setPickerPosition] = useState<PickerPosition>({
    top: 0,
    left: 0,
  });
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiIconClick = useCallback(
    (e: React.MouseEvent) => {
      if (iconRef.current) {
        const iconRect = iconRef.current.getBoundingClientRect();
        // Вычисляем визуальную (эффективную) высоту с учетом scale
        const effectivePickerHeight = pickerHeight * scaleFactor;
        const left = iconRect.left + window.scrollX + (adjustments.left || 0);
        // Начинаем позиционировать ниже иконки
        let newTop = iconRect.bottom + window.scrollY + (adjustments.top || 0);
        const spaceBelow = window.innerHeight - iconRect.bottom;
        // Если места снизу недостаточно, позиционируем пикер над иконкой
        if (spaceBelow < effectivePickerHeight) {
          newTop =
            iconRect.top -
            effectivePickerHeight +
            window.scrollY +
            (adjustments.top || 0) -
            135;
        }
        setPickerPosition({ top: newTop, left });
        setShowPicker((prev) => !prev);
      }
    },
    [adjustments.left, adjustments.top, pickerHeight, scaleFactor],
  );

  return {
    pickerPosition,
    showPicker,
    setShowPicker,
    handleEmojiIconClick,
  };
};

export default useEmojiPickerPosition;
