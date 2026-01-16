import React from "react";
import { NmapOption } from "@/config/nmapOptions";
import "./OptionsPanel.css";

interface OptionItemProps {
  option: NmapOption;
  isSelected: boolean;
  value: string;
  onToggle: (enabled: boolean, value?: string) => void;
  onValueChange: (value: string) => void;
}

export function OptionItem({
  option,
  isSelected,
  value,
  onToggle,
  onValueChange,
}: OptionItemProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (option.needsInput && checked && !value) {
      // If needs input and no value yet, don't fully enable
      onToggle(checked, "");
    } else {
      onToggle(checked, value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    if (newValue && !isSelected) {
      onToggle(true, newValue);
    }
  };

  return (
    <div className={`option-item ${isSelected ? "selected" : ""}`}>
      <label className="option-item-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
        <span className="option-item-flag">{option.flag}</span>
      </label>
      
      <div className="option-item-details">
        <p className="option-item-description">{option.description}</p>
        
        {option.needsInput && (
          <input
            type="text"
            className="nmap-input nmap-input-sm option-item-input"
            placeholder={option.placeholder}
            value={value}
            onChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
}
