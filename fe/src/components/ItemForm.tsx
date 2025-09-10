import React, { useState } from "react";
import { useCreateItemMutation } from "../api/itemApi";

const ItemForm: React.FC = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [createItem, { isLoading, error, isSuccess }] = useCreateItemMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createItem(form);
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Add Item</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", minHeight: 80 }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Adding..." : "Add Item"}
        </button>
        {isSuccess && <div style={{ color: "green", marginTop: 10 }}>Item added!</div>}
        {error && (
          <div style={{ color: "red", marginTop: 10 }}>
            {typeof error === "object" && error !== null && "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message === "string"
              ? (error as { data?: { message?: string } }).data!.message
              : "Failed to add item"}
          </div>
        )}
      </form>
    </div>
  );
};

export { ItemForm };
