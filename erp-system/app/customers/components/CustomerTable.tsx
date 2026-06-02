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
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
};

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: Props) {
  if (customers.length === 0) {
    return (
      <div className="rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-20 text-center">
        <div className="text-7xl mb-5">
          ✨
        </div>

        <h3 className="text-4xl font-bold">
          No Customers Yet
        </h3>

        <p className="text-gray-400 mt-3">
          Add your first customer to
          begin
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[36px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr className="text-left text-gray-400">
              <th className="px-6 py-5">
                Customer
              </th>

              <th className="px-6 py-5">
                Email
              </th>

              <th className="px-6 py-5">
                Phone
              </th>

              <th className="px-6 py-5">
                City
              </th>

              <th className="px-6 py-5">
                GST
              </th>

              <th className="px-6 py-5">
                Status
              </th>

              <th className="px-6 py-5">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-white/5 hover:bg-white/[0.04] transition-all"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center font-bold">
                        {customer.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {
                            customer.name
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {
                      customer.email
                    }
                  </td>

                  <td className="px-6 py-5">
                    {
                      customer.phone
                    }
                  </td>

                  <td className="px-6 py-5">
                    {
                      customer.city
                    }
                  </td>

                  <td className="px-6 py-5">
                    {customer.gstNumber ||
                      "-"}
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm">
                      {
                        customer.status
                      }
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          onEdit(
                            customer
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          onDelete(
                            customer.id
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}