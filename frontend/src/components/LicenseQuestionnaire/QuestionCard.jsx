import React from 'react';

const QuestionCard = ({ question, isChecked, onToggle }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <span className="text-gray-700 text-lg">{question}</span>
      </label>
    </div>
  );
};

export default QuestionCard;