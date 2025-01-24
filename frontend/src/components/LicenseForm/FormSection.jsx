export function FormSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}