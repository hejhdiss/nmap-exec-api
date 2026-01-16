import React, { useState } from "react";
import { NmapOption } from "@/config/nmapOptions";
import { OptionItem } from "./OptionItem";
import "./OptionsPanel.css";

interface SelectedOption {
  id: number;
  value?: string;
}

interface OptionCategoryProps {
  name: string;
  icon: string;
  options: NmapOption[];
  selectedOptions: SelectedOption[];
  onToggleOption: (id: number, enabled: boolean, value?: string) => void;
  onUpdateValue: (id: number, value: string) => void;
  defaultOpen?: boolean;
}

export function OptionCategory({
  name,
  icon,
  options,
  selectedOptions,
  onToggleOption,
  onUpdateValue,
  defaultOpen = false,
}: OptionCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const selectedCount = options.filter(opt =>
    selectedOptions.some(s => s.id === opt.id)
  ).length;

  return (
    <div className={`option-category ${isOpen ? "open" : ""}`}>
      <button
        className="option-category-header"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="option-category-icon">{icon}</span>
        <span className="option-category-name">{name}</span>
        {selectedCount > 0 && (
          <span className="option-category-count">{selectedCount}</span>
        )}
        <span className={`option-category-arrow ${isOpen ? "open" : ""}`}>
          ▼
        </span>
      </button>
      
      <div className={`option-category-content ${isOpen ? "open" : ""}`}>
        <div className="option-list">
          {options.map(option => {
            const selected = selectedOptions.find(s => s.id === option.id);
            return (
              <OptionItem
                key={option.id}
                option={option}
                isSelected={!!selected}
                value={selected?.value || ""}
                onToggle={(enabled, value) => onToggleOption(option.id, enabled, value)}
                onValueChange={(value) => onUpdateValue(option.id, value)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
