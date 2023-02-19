export const Card = ({ children, ...props }: any) => {
  return (
    <div
      {...props}
      className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      {children}
    </div>
  );
};