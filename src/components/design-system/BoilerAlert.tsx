import clsx from "clsx";

type NeorepoAlertProps = {
  className?: string;
  children?: React.ReactNode;
};

export const NeorepoAlert: React.FC<NeorepoAlertProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-center rounded-md border border-green-200 bg-green-100",
        "p-4",
        className
      )}
    >
      <p className="mb-1 font-medium text-green-700">Note</p>
      {children}
    </div>
  );
};

export default NeorepoAlert;
