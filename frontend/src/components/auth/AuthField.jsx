const AuthField = ({ type = "text", placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/70 bg-transparent px-4 py-3 text-white placeholder:text-white/70 outline-none focus:border-amber-400"
    />
  );
};

export default AuthField;