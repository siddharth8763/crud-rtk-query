import React, { useState } from "react";
import {
  useGetAllItemsQuery,
  useDeleteItemMutation,
  useUpdateItemMutation,
  useCreateItemMutation,
} from "../api/itemApi";
import { useLogoutMutation } from "../api/authApi";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const ItemList: React.FC = () => {
  const { data: items, isLoading, error } = useGetAllItemsQuery();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [showCreate, setShowCreate] = useState(false);

  const handleEditClick = (item: { _id: string; name: string; description: string }) => {
    setEditingId(item._id);
    setEditForm({ name: item.name, description: item.description });
    setShowCreate(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    await updateItem({ _id: editingId, ...editForm });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  const handleCreateClick = () => {
    setShowCreate(true);
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createItem(editForm);
    setShowCreate(false);
    setEditForm({ name: "", description: "" });
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(logoutAction());
      navigate("/login", { replace: true }); // Redirect to login without reload
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Items</h2>
        <button onClick={handleLogout} disabled={isLoggingOut} style={{ marginLeft: 16 }}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
      <button onClick={handleCreateClick} style={{ marginBottom: 16 }}>
        Create Item
      </button>
      {showCreate && (
        <form
          onSubmit={handleCreateSubmit}
          style={{
            marginBottom: 24,
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <input
            type="text"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            required
            placeholder="Name"
            style={{ width: "100%", marginBottom: 8, padding: "0.5rem" }}
          />
          <textarea
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            required
            placeholder="Description"
            style={{ width: "100%", marginBottom: 8, padding: "0.5rem", minHeight: 60 }}
          />
          <button type="submit" disabled={isCreating} style={{ marginRight: 8 }}>
            {isCreating ? "Creating..." : "Create"}
          </button>
          <button type="button" onClick={() => setShowCreate(false)}>
            Cancel
          </button>
        </form>
      )}
      {isLoading && <div>Loading items...</div>}
      {error && (
        <div style={{ color: "red", marginTop: 10 }}>
          {typeof error === "object" && error !== null && "data" in error &&
          typeof (error as { data?: { message?: string } }).data?.message === "string"
            ? (error as { data?: { message?: string } }).data!.message
            : "Failed to load items"}
        </div>
      )}
      {items && items.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li key={item._id} style={{ marginBottom: "1rem", border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
              {editingId === item._id ? (
                <form onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    style={{ width: "100%", marginBottom: 8, padding: "0.5rem" }}
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    required
                    style={{ width: "100%", marginBottom: 8, padding: "0.5rem", minHeight: 60 }}
                  />
                  <button type="submit" disabled={isUpdating} style={{ marginRight: 8 }}>
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <strong>{item.name}</strong>
                  <div>{item.description}</div>
                  <button onClick={() => handleEditClick(item)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <div>No items found.</div>
      )}
    </div>
  );
};

export { ItemList };
