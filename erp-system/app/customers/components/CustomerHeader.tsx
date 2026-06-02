type Props = {
  onAddCustomer: () => void;
};

export default function CustomerHeader({
  onAddCustomer,
}: Props) {
  return (
    <div className="flex items-start justify-between mb-10">
      <div>
        <h1 className="text-6xl font-bold tracking-tight">
          Customers
        </h1>

        <p className="text-gray-400 mt-3 text-xl">
          Manage and grow your customer
          relationships
        </p>
      </div>

      <button
        onClick={onAddCustomer}
        className="px-8 py-4 rounded-[24px] text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(59,130,246,0.25)]"
      >
        + Add Customer
      </button>
    </div>
  );
}