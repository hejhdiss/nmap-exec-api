import React from "react";
import { OPTION_CATEGORIES } from "@/config/nmapOptions";
import { OptionCategory } from "./OptionCategory";
import { Card } from "./Card";
import "./OptionsPanel.css";

interface SelectedOption {
  id: number;
  value?: string;
}

interface OptionsPanelProps {
  selectedOptions: SelectedOption[];
  onToggleOption: (id: number, enabled: boolean, value?: string) => void;
  onUpdateValue: (id: number, value: string) => void;
}

export function OptionsPanel({
  selectedOptions,
  onToggleOption,
  onUpdateValue,
}: OptionsPanelProps) {
  return (
    <Card title="Scan Options" icon="⚙️">
      <div className="options-panel">
        {OPTION_CATEGORIES.map((category, index) => (
          <OptionCategory
            key={category.name}
            name={category.name}
            icon={category.icon}
            options={category.options}
            selectedOptions={selectedOptions}
            onToggleOption={onToggleOption}
            onUpdateValue={onUpdateValue}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </Card>
  );
}
