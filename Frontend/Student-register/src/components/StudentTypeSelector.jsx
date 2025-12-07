import { useState } from "react";

export default function StudentTypeSelector({ onSelect }) {
  const [selected, setSelected] = useState("");

  const handleSelect = (type) => {
    setSelected(type);
    onSelect(type); 
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          {/* <h1 className="text-4xl font-light text-gray-900 mb-3">Choose Your Path</h1> */}
          <p className="text-gray-500 text-lg">ဖောင်တင်ရန် ရွေးချယ်ပါ</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelect("new")}
            className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
              selected === "new" 
                ? "border-blue-500 bg-blue-50 shadow-lg" 
                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">ကျောင်းသားသစ်</h3>
              <p className="text-gray-500 text-sm">New Student</p>
            </div>
          </button>

          <button
            onClick={() => handleSelect("old")}
            className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
              selected === "old" 
                ? "border-green-500 bg-green-50 shadow-lg" 
                : "border-gray-200 hover:border-green-300 hover:shadow-md"
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">ကျောင်းသားဟောင်း</h3>
              <p className="text-gray-500 text-sm">Existing Student</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
