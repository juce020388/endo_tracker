import React, { useEffect, useState } from "react";
import { Procedure } from "../types.ts";
import { supabase } from "../supabaseClient";

// Fetch procedure types from Supabase
async function fetchProcedureTypes(): Promise<Procedure[]> {
  const { data, error } = await supabase
    .from("procedure_types")
    .select("name, defaultPrice:default_price, description");
  if (error) {
    console.error("Error fetching procedure types:", error.message);
    return [];
  }
  console.log("Fetched from DB:", data);
  return data || [];
}

// Add a new procedure type to Supabase
async function addProcedureType(
  newType: string,
  newPrice?: string,
  newDescription?: string,
) {
  const { error } = await supabase.from("procedure_types").insert([
    {
      name: newType,
      default_price: newPrice ? parseFloat(newPrice) : null,
      description: newDescription || null,
    },
  ]);
  if (error) {
    throw error;
  }
}

// Update a procedure type in Supabase
async function updateProcedureType(
  oldName: string,
  newName: string,
  newPrice?: string,
  newDescription?: string,
) {
  const { error } = await supabase
    .from("procedure_types")
    .update({
      name: newName,
      default_price: newPrice ? parseFloat(newPrice) : null,
      description: newDescription || null,
    })
    .eq("name", oldName);
  if (error) {
    throw error;
  }
}

// Delete a procedure type from Supabase
async function deleteProcedureType(name: string) {
  const { error } = await supabase
    .from("procedure_types")
    .delete()
    .eq("name", name);
  if (error) {
    throw error;
  }
}

const ProcedureTypes: React.FC = () => {
  const [types, setTypes] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProcedureTypes()
      .then((data) => setTypes(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (
      newType &&
      !types.some((t) => t.name.toLowerCase() === newType.toLowerCase())
    ) {
      try {
        await addProcedureType(newType, newPrice, newDescription);
        const updated = await fetchProcedureTypes();
        setTypes(updated);
        setNewType("");
        setNewPrice("");
        setNewDescription("");
      } catch (e: any) {
        alert("Failed to add procedure type: " + e.message);
      }
    }
  };

  const handleDelete = async (idx: number) => {
    try {
      await deleteProcedureType(types[idx].name);
      setTypes(await fetchProcedureTypes());
      setEditIndex(null);
    } catch (e: any) {
      alert("Failed to delete procedure type: " + e.message);
    }
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setEditValue(types[idx].name);
    setEditPrice(
      types[idx].defaultPrice !== undefined
        ? types[idx].defaultPrice.toString()
        : "",
    );
    setEditDescription(types[idx].description || "");
  };

  const handleEditSave = async () => {
    if (editIndex !== null && editValue) {
      try {
        await updateProcedureType(
          types[editIndex].name,
          editValue,
          editPrice,
          editDescription,
        );
        setTypes(await fetchProcedureTypes());
        setEditIndex(null);
        setEditValue("");
        setEditPrice("");
        setEditDescription("");
      } catch (e: any) {
        alert("Failed to update procedure type: " + e.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-700 border-b pb-3">
        Manage Procedure Types
      </h2>

      {loading ? (
        <div className="my-8 flex flex-col items-center justify-center animate-pulse">
          <div className="relative mb-3">
            <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-teal-600 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M12 4v4m0 8v4m8-8h-4M4 12H0m17.657-5.657l-2.828 2.828m-8.486 8.486l-2.828 2.828m14.142 0l-2.828-2.828m-8.486-8.486L4.343 6.343"
                />
              </svg>
            </div>
          </div>
          <span className="text-teal-700 font-medium text-lg tracking-wide">
            Loading procedure types...
          </span>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Add New Procedure Type
            </h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  value={newType}
                  placeholder="Procedure name"
                  onChange={(e) => setNewType(e.target.value)}
                />
              </div>
              <div className="w-full md:w-32">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Price (€)
                </label>
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  type="number"
                  value={newPrice}
                  min={0}
                  placeholder="0.00"
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  value={newDescription}
                  placeholder="Brief description"
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <div className="self-end">
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center"
                  onClick={handleAdd}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>

          {types.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No procedure types found. Add your first one above.
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Default Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {types.map((type, idx) => (
                    <tr
                      key={type.name}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {editIndex === idx ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              type="number"
                              min={0}
                              value={editPrice}
                              placeholder="Default price"
                              onChange={(e) => setEditPrice(e.target.value)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={editDescription}
                              placeholder="Description"
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mr-2 transition duration-200"
                              onClick={handleEditSave}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md transition duration-200"
                              onClick={() => setEditIndex(null)}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {type.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {type.defaultPrice !== undefined &&
                            type.defaultPrice !== null ? (
                              <span className="font-medium">
                                {type.defaultPrice.toFixed(2)}€
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {type.description || (
                              <span className="text-gray-400 italic">
                                No description
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2 transition duration-200"
                              onClick={() => handleEdit(idx)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200"
                              onClick={() => handleDelete(idx)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProcedureTypes;
