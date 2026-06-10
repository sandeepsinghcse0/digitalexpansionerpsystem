type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (customer: any) => void;
  editingCustomer: any;
};

export default function AddCustomerModal({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#0f172a] p-6 rounded-xl w-[500px]">
        <h2 className="text-2xl font-bold mb-4">
          Add Customer
        </h2>

        <p>
          Customer form coming
          next.
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-red-600 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}