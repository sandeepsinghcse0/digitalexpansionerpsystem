type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Topbar({
  search,
  setSearch,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-10 rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl px-8 py-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Welcome back 👋
        </h2>

        <p className="text-gray-400 mt-1">
          Manage your premium CRM
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none text-white w-[260px]"
        />

        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center font-bold">
          D
        </div>
      </div>
    </div>
  );
}