"use client";

import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onSelect: (emoji: any) => void; // Используем any, либо определи собственный интерфейс
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  return <Picker data={data} onEmojiSelect={onSelect} theme="dark" />;
};

export default EmojiPicker;
