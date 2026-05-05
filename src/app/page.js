"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

export default function Dashboard() {
  const supabase = createClient();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    deskripsi: "",
    harga: "",
  });

  // Load menu dari Supabase
  async function loadMenu() {
    setLoading(true);
    const { data } = await supabase.from("menu").select("*").order("kategori");
    setMenuItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMenu();
  }, []);

  // Handle form input
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Tambah atau edit menu
  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, harga: parseInt(form.harga) };

    if (editItem) {
      await supabase.from("menu").update(payload).eq("id", editItem.id);
    } else {
      await supabase.from("menu").insert(payload);
    }

    setForm({ nama: "", kategori: "", deskripsi: "", harga: "" });
    setEditItem(null);
    setShowForm(false);
    loadMenu();
  }

  // Hapus menu
  async function handleDelete(id) {
    if (confirm("Yakin mau hapus menu ini?")) {
      await supabase.from("menu").delete().eq("id", id);
      loadMenu();
    }
  }

  // Edit menu
  function handleEdit(item) {
    setEditItem(item);
    setForm({
      nama: item.nama,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      harga: item.harga,
    });
    setShowForm(true);
  }
  // Habis / Tersedia
  async function handleToggle(id, currentStatus) {
    await supabase
      .from("menu")
      .update({ tersedia: !currentStatus })
      .eq("id", id);
    loadMenu();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              🍜 Warung Bangkip
            </h1>
            <p className="text-gray-500">Admin Dashboard</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditItem(null);
              setForm({ nama: "", kategori: "", deskripsi: "", harga: "" });
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Tambah Menu
          </button>
        </div>

        {/* Form Tambah/Edit */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl text-gray-700 font-semibold mb-4">
              {editItem ? "✏️ Edit Menu" : "➕ Tambah Menu Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Menu
                </label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="contoh: Nasi Goreng Spesial"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <input
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="contoh: Makanan Utama"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <input
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  className="w-full border rounded-lg text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="contoh: Nasi goreng dengan bumbu spesial"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  name="harga"
                  type="number"
                  value={form.harga}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="contoh: 25000"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {editItem ? "Simpan" : "Tambah"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Menu */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl text-gray-700 font-semibold">
              📋 Daftar Menu
            </h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Menu
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Kategori
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Harga
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {item.nama}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.deskripsi}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      Rp{item.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${item.tersedia ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.tersedia ? "Tersedia" : "Habis"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggle(item.id, item.tersedia)}
                          className={`text-sm font-medium ${
                            item.tersedia
                              ? "text-orange-500 hover:text-orange-700"
                              : "text-green-500 hover:text-green-700"
                          }`}
                        >
                          {item.tersedia ? "Habis" : "Tersedia"}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
