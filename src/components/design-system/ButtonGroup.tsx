import clsx from "clsx";
import _ from "lodash";
import { useCallback, useState } from "react";

type ButtonGroupProps = {
  className?: string;
  values: string[];
  selectMultiple?: boolean;
  onChange?: (value: number[]) => void;
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  className,
  values,
  selectMultiple,
  onChange,
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState<
    Record<number, boolean>
  >({});

  const handleSelect = useCallback(
    (i: number) => {
      if (selectMultiple) {
        const newSelectedIndexes = selectedIndexes[i]
          ? _.omit(selectedIndexes, i)
          : { ...selectedIndexes, [i]: true };
        setSelectedIndexes(newSelectedIndexes);
        onChange?.(Object.keys(newSelectedIndexes).map(Number));
      } else {
        setSelectedIndexes({ [i]: true });
        onChange?.([i]);
      }
    },
    [selectedIndexes, selectMultiple, onChange]
  );

  return (
    <div className={clsx("flex select-none flex-col gap-y-2", className)}>
      {values.map((v, i) => {
        return (
          <div
            envKey={i}
            className={clsx(
              "flex h-10 cursor-pointer items-center rounded-md border px-4 transition hover:border-primary-500",
              {
                "border-2 border-primary-600": selectedIndexes[i],
              }
            )}
            onClick={() => handleSelect(i)}
          >
            {v}
          </div>
        );
      })}
    </div>
  );
};
