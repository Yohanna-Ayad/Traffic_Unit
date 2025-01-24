export function NameInput({ value, onChange }) {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        What's your name?
      </label>
      <input
        type="text"
        id="name"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        placeholder="Enter your name"
        required
      />
    </div>
  );
}