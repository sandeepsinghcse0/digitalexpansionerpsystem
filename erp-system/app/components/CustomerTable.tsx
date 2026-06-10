type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  gstNumber: string;
};

type Props = {
  customers: Customer[];
  onEdit: (
    customer: Customer
  ) => void;
  onDelete: (
    id: number
  ) => void;
};

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto bg-[#0f172a] rounded-xl">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-left">
              Name
            </th>
            <th className="p-4 text-left">
              Email
            </th>
            <th className="p-4 text-left">
              Phone
            </th>
            <th className="p-4 text-left">
              Status
            </th>
            <th className="p-4 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map(
            (customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-800"
              >
                <td className="p-4">
                  {customer.name}
                </td>

                <td className="p-4">
                  {customer.email}
                </td>

                <td className="p-4">
                  {customer.phone}
                </td>

                <td className="p-4">
                  {customer.status}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() =>
                      onEdit(
                        customer
                      )
                    }
                    className="bg-yellow-600 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(
                        customer.id
                      )
                    }
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}