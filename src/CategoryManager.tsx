import { useState, useEffect } from "react";
import { supabase, Category } from "./lib/supabase";
import { toast } from "sonner";

interface CategoryManagerProps {
  onClose: () => void;
  onUpdate?: () => void; // Optional: call this after changes to refresh parent
}

export function CategoryManager({ onClose, onUpdate }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      toast.error("Failed to fetch categories");
      setCategories([]);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not signed in");
      return;
    }
    // Insert with user_id
    const { error } = await supabase.from("categories").insert({
      name: newCategoryName.trim(),
      user_id: user.id
    });
    if (error) {
      toast.error("Failed to create category: " + error.message);
      console.error(error);
    } else {
      setNewCategoryName("");
      toast.success("Category created");
      fetchCategories();
      onUpdate && onUpdate();
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", categoryId);
    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
      fetchCategories();
      onUpdate && onUpdate();
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Manage Categories</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Category</label>
              <div className="flex gap-2">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                />
                <button onClick={handleCreateCategory} className="px-4 py-2 bg-blue-600 text-white rounded-md">Add</button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Categories</h3>
              {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
              ) : categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">No categories yet</p>
              ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span className="text-sm text-gray-900">{category.name}</span>
                          <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-500 hover:text-red-700"
                          >🗑️</button>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}