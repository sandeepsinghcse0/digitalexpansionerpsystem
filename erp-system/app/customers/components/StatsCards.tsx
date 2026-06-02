type Props = {
  totalCustomers: number;
  activeCustomers: number;
};

export default function StatsCards({
  totalCustomers,
  activeCustomers,
}: Props) {
  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
    },
    {
      title: "Active Customers",
      value: activeCustomers,
    },
    {
      title: "Premium CRM",
      value: "ON",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      {stats.map((item) => (
        <div
          key={item.title}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 min-h-[180px]"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 blur-[100px]" />

          <p className="text-gray-400 text-lg">
            {item.title}
          </p>

          <h2 className="text-6xl font-bold mt-6">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}