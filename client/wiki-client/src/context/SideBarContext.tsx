import React, { createContext, useContext, useEffect, useState } from "react";
import { getPagesOrderByCreateTime } from "../services/PageService";
import Page from "../pages/page/Page";
interface SidebarContextProps {
  selectedSizeButton: SizeButton;
  articleTextSize: string;
  selectedColorButton: ColorButton;
  textColor: string;
  articleColor: string;
  screenColor: string;
  hoverElement: string;
  textareaStyle: string;
  sizeRadioButton: SizeButton[];
  colorRadioButton: ColorButton[];
  recentPages?: Page[];
  handleSizeRadioButtonSelect: (num: number) => void;
  handleColorRadioButtonSelect: (num: number) => void;
}
interface SizeButton {
  id: number;
  label: string;
  style: string;
}
interface ColorButton {
  id: number;
  label: string;
  style: {
    textColor: string;
    articleColor: string;
    screenColor: string;
    hoverElement: string;
    textareaStyle: string;
  };
}
const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // テキストサイズの状態管理

  const sizeRadioButton: SizeButton[] = [
    { id: 1, label: "大", style: "prose-lg" },
    { id: 2, label: "標準 (デフォルト)", style: "prose-base" },
    { id: 3, label: "小", style: "prose-sm" },
  ];

  const [selectedSizeButton, setSelectedSizeButton] = useState<SizeButton>(
    sizeRadioButton[1]
  );
  const [articleTextSize, setArticleTextSize] = useState<string>(
    sizeRadioButton[1].style
  );
  const handleSizeRadioButtonSelect = (num: number) => {
    setSelectedSizeButton(sizeRadioButton[num - 1]);
  };
  useEffect(() => {
    setArticleTextSize(selectedSizeButton.style);
  }, [selectedSizeButton]);

  // 色の状態管理

  const colorRadioButton: ColorButton[] = [
    {
      id: 1,
      label: "ダーク",
      style: {
        textColor: "text-slate-100",
        articleColor: "dark:prose-invert",
        screenColor: "bg-gray-900",
        hoverElement: "hover:bg-gray-500 hover:text-gray-400",
        textareaStyle:
          "bg-gray-800 border border-gray-300 text-white focus:ring-blue-400",
      },
    },
    {
      id: 2,
      label: "ライト",
      style: {
        textColor: "text-slate-950",
        articleColor: "prose",
        screenColor: "bg-white",
        hoverElement: "hover:bg-gray-100",
        textareaStyle: "bg-white text-gray-900",
      },
    },
  ];
  const [selectedColorButton, setSelectedColorButton] = useState<ColorButton>(
    colorRadioButton[1]
  );
  const [textColor, setTextColor] = useState<string>(
    colorRadioButton[1].style.textColor
  );
  const [articleColor, setArticleColor] = useState<string>(
    colorRadioButton[1].style.articleColor
  );
  const [screenColor, setScreenColor] = useState<string>(
    colorRadioButton[1].style.screenColor
  );
  const [hoverElement, setHoverElement] = useState<string>(
    colorRadioButton[1].style.hoverElement
  );
  const [textareaStyle, setTextareaStyle] = useState<string>(
    colorRadioButton[1].style.textareaStyle
  );
  const handleColorRadioButtonSelect = (num: number) => {
    setSelectedColorButton(colorRadioButton[num - 1]);
  };

  useEffect(() => {
    setTextColor(selectedColorButton.style.textColor);
    setArticleColor(selectedColorButton.style.articleColor);
    setScreenColor(selectedColorButton.style.screenColor);
    setHoverElement(selectedColorButton.style.hoverElement);
    setTextareaStyle(selectedColorButton.style.textareaStyle);
  }, [selectedColorButton]);

  //   最新記事取得に関する状態管理

  const [recentPages, setRecentPages] = useState<Page[]>();

  const getRecentPages = async () => {
    try {
      const pages = await getPagesOrderByCreateTime();
      setRecentPages(pages);
    } catch (err) {
      // todo エラーハンドリング
      console.log(err);
    }
  };

  useEffect(() => {
    getRecentPages();

    const interval = setInterval(() => {
      getRecentPages();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        // テキストサイズ
        sizeRadioButton,
        selectedSizeButton,
        articleTextSize,
        // 色
        selectedColorButton,
        colorRadioButton,
        textColor,
        articleColor,
        screenColor,
        hoverElement,
        textareaStyle,
        // 最新10件
        recentPages,
        // メソッド
        handleSizeRadioButtonSelect,
        handleColorRadioButtonSelect,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within an SIdebarProvider");
  }
  return context;
};
