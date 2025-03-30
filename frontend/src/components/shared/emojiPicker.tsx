"use client";

import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { CustomEmoji } from "../chat/chatBody";

interface EmojiPickerProps {
  handleEmojiSelect: (emoji: CustomEmoji) => void; // Используем any, либо определи собственный интерфейс
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ handleEmojiSelect }) => {
  return <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />;
};

export default EmojiPicker;
