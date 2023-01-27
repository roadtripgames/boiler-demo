import clsx from "clsx";
import { useState } from "react";

type TabbedContainerProps = {
  tabs: {
    title: string;
    content: React.ReactNode;
  }[];
};

export const TabbedContainer: React.FC<TabbedContainerProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const titles = tabs.map((tab) => tab.title);
  const activeContent = tabs[activeTab]?.content;

  return (
    <div className="flex flex-col">
      <div className="flex gap-x-8 rounded-t-lg border-b">
        {titles.map((t, i) => (
          <div
            envKey={t}
            onClick={() => setActiveTab(i)}
            className={clsx("cursor-pointer px-2 py-3", {
              "-mb-[1px] border-b-2 border-primary-500 font-semibold":
                i === activeTab,
            })}
          >
            <span>{t}</span>
          </div>
        ))}
      </div>
      {activeContent && <div>{activeContent}</div>}
    </div>
  );
};
