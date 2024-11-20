import React from "react";
import { useSidebar } from "../../context/SideBarContext";
import { Radio, RadioGroup } from "@blueprintjs/core";

const RightSideBar = () => {
  const {
    selectedSizeButton,
    sizeRadioButton,
    colorRadioButton,
    selectedColorButton,
    handleSizeRadioButtonSelect,
    handleColorRadioButtonSelect,
  } = useSidebar();

  const hancleChangeTextSizeRadioButton = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    // todo
    // valを無理やりnumberにキャストしている
    // 何かいい方法あるかも
    const target = e.target as HTMLInputElement;
    const val = target.value as unknown as number;
    handleSizeRadioButtonSelect(val);
  };
  const hancleChangeColorRadioButton = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    // todo
    // valを無理やりnumberにキャストしている
    // 何かいい方法あるかも
    const target = e.target as HTMLInputElement;
    const val = target.value as unknown as number;
    handleColorRadioButtonSelect(val);
  };

  return (
    <div className="block">
      <div className="sticky top-3">
        <div className="mt-6 py-4 min-w-40 max-w-44">
          <RadioGroup
            label="テキスト"
            onChange={hancleChangeTextSizeRadioButton}
            selectedValue={selectedSizeButton.id}
            className="border-b-2 border-t-2 py-4"
          >
            {sizeRadioButton.map((button) => (
              <Radio key={button.id} label={button.label} value={button.id} />
            ))}
          </RadioGroup>
        </div>
        <div className="min-w-40 max-w-44">
          <RadioGroup
            label="色"
            onChange={hancleChangeColorRadioButton}
            selectedValue={selectedColorButton.id}
            className="border-b-2 pb-4 "
          >
            {colorRadioButton.map((button) => (
              <Radio key={button.id} label={button.label} value={button.id} />
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
