type Props = {
  onAddCustomer: () => void;
};

export default function CustomerHeader({
  onAddCustomer,
}: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          Customers
        </h1>
        <p className="text-gray-400">
          Manage all customers
        </p>
      </div>

      <button
        onClick={onAddCustomer}
        className="bg-blue-600 px-4 py-2 rounded-lg"
      >
        Add Customer
      </button>
    </div>
  );
}