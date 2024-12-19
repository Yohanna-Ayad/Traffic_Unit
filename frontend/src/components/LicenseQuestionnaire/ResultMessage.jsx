import React from 'react';

const ResultMessage = ({ hasDrivingLicense, hasCarLicense }) => {
  return (
    <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Status:</h3>
      <ul className="space-y-2 text-blue-700">
        <li className="flex items-center">
          <span className={`mr-2 ${hasDrivingLicense ? 'text-green-500' : 'text-red-500'}`}>
            {hasDrivingLicense ? '✓' : '✗'}
          </span>
          Driving License: {hasDrivingLicense ? 'Yes' : 'No'}
        </li>
        <li className="flex items-center">
          <span className={`mr-2 ${hasCarLicense ? 'text-green-500' : 'text-red-500'}`}>
            {hasCarLicense ? '✓' : '✗'}
          </span>
          Car License: {hasCarLicense ? 'Yes' : 'No'}
        </li>
      </ul>
    </div>
  );
};

export default ResultMessage;