import { useState } from "react";

export default function StudentTypeSelector({ onSelect }) {
  const [selected, setSelected] = useState("");

  const handleSelect = (type) => {
    setSelected(type);
    onSelect(type); 
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold text-center mb-4">ကျောင်းအပ်ရန် ရွေးချယ်ပါ </h2>

      <div className="flex gap-4">
        {/* NEW Student */}
        <button
          onClick={() => handleSelect("new")}
          className={`flex-1 py-4 rounded-xl border text-center transition-all duration-200 
          ${selected === "new" 
            ? "bg-green-600 text-white border-blue-700" 
            : "bg-white border-gray-300 hover:bg-gray-100"}
          `}
        >
         ကျောင်းသားသစ်
        </button>

        {/* OLD Student */}
        <button
          onClick={() => handleSelect("old")}
          className={`flex-1 py-4 rounded-xl border text-center transition-all duration-200 
          ${selected === "old" 
            ? "bg-green-600 text-white border-green-700" 
            : "bg-white border-gray-300 hover:bg-gray-100"}
          `}
        >
          ကျောင်းသားဟောင်း
        </button>
      </div>
    </div>
  );
}
