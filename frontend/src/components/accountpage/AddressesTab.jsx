// src/components/accountpage/AddressesTab.jsx
import React, { useState, useEffect } from 'react';

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Add/Edit Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // 🔴 FIX: Django ke exact fields use kiye hain (full_name, address_line, pincode)
  const [formData, setFormData] = useState({
    full_name: 'Abhishek Sharma', 
    address_line: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    phone_number: ''
  });

  const token = localStorage.getItem('access') || localStorage.getItem('token');
  const headers = { 
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/orders/address/', { headers });
      if (res.ok) {
        const data = await res.json();
        setAddresses(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openForm = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        full_name: address.full_name || 'Abhishek Sharma',
        address_line: address.address_line || '',
        city: address.city || '',
        state: address.state || '',
        country: address.country || 'India',
        pincode: address.pincode || '',
        phone_number: address.phone_number || ''
      });
    } else {
      setEditingAddress(null);
      setFormData({ full_name: 'Abhishek Sharma', address_line: '', city: '', state: '', country: 'India', pincode: '', phone_number: '' });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = editingAddress 
        ? `http://127.0.0.1:8000/api/orders/address/${editingAddress.id}/` 
        : 'http://127.0.0.1:8000/api/orders/address/';
      
      const method = editingAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(formData)
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch (e) {
        responseData = null;
      }

      if (res.ok) {
        alert('Address saved successfully!');
        setIsFormOpen(false); 
        setEditingAddress(null);
        setFormData({ full_name: 'Abhishek Sharma', address_line: '', city: '', state: '', country: 'India', pincode: '', phone_number: '' });
        fetchAddresses(); 
      } else {
        console.error("DJANGO ASLI ERROR:", responseData);
        
        let errorMsg = 'Failed to save address.';
        if (responseData && typeof responseData === 'object') {
            const missingField = Object.keys(responseData)[0];
            if (missingField && Array.isArray(responseData[missingField])) {
                errorMsg = `Error in ${missingField}: ${responseData[missingField][0]}`;
            } else if (responseData.detail) {
                errorMsg = responseData.detail;
            } else {
                errorMsg = JSON.stringify(responseData);
            }
        }
        
        alert(errorMsg);
      }
      
    } catch (error) {
      console.error("Network ya Code Error:", error);
      alert("Network error. Make sure your Django server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this address?");
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/address/${id}/`, {
        method: 'DELETE',
        headers
      });
      
      if (res.ok || res.status === 204) {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
      } else {
         console.error("Failed to delete address. Status:", res.status);
         alert("Could not delete address. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <div className="animate-fade-in max-w-2xl pt-4 lg:pt-8 text-white">
        <div className="mb-10 border-b border-neutral-800 pb-4 flex justify-between items-center">
          <h2 className="text-sm tracking-[0.15em] uppercase font-semibold">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button type="button" onClick={() => setIsFormOpen(false)} className="text-[10px] tracking-[0.15em] uppercase hover:text-neutral-400">
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Naya Full Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-semibold">Full Name</label>
            <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="bg-transparent border-b border-neutral-800 pb-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-semibold">Address / Street</label>
            <input required type="text" name="address_line" value={formData.address_line} onChange={handleChange} className="bg-transparent border-b border-neutral-800 pb-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-semibold">City</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} className="bg-transparent border-b border-neutral-800 pb-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-semibold">State</label>
              <input required type="text" name="state" value={formData.state} onChange={handleChange} className="bg-transparent border-b border-neutral-800 pb-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-semibold">Postal Code</label>
              <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="bg-transparent border-b border-neutral-800 pb-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-semibold">Phone Number</label>
              <input required type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="bg-transparent border-b border-neutral-800 pb-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="mt-8 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] py-4 px-10 hover:bg-neutral-200 transition-colors disabled:opacity-50">
            {isLoading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl pt-4 lg:pt-8 text-white">
      
      <div className="flex justify-between items-end mb-10 border-b border-neutral-800 pb-4">
        <h2 className="text-sm tracking-[0.15em] uppercase font-semibold">
          My Addresses
        </h2>
        <button onClick={() => openForm()} className="text-[10px] font-bold tracking-[0.15em] hover:text-neutral-400 transition-colors uppercase cursor-pointer">
          + Add New
        </button>
      </div>

      {isLoading ? (
        <div className="text-xs tracking-widest text-neutral-500 uppercase animate-pulse">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="border border-neutral-800/80 p-12 flex flex-col items-center justify-center bg-black">
          <span className="text-[11px] tracking-[0.15em] uppercase text-neutral-500 font-semibold mb-6">No Saved Addresses</span>
          <button onClick={() => openForm()} className="bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] py-4 px-10 hover:bg-neutral-200 transition-colors cursor-pointer">
            Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr, index) => (
            <div key={addr.id || index} className="border border-neutral-800/80 p-8 flex flex-col justify-between bg-black group hover:border-neutral-500 transition-colors duration-300">
              
              <div className="mb-8">
                <h3 className="text-xs tracking-[0.15em] uppercase font-bold mb-3">{addr.full_name}</h3>
                <div className="text-sm text-neutral-400 font-light leading-relaxed flex flex-col gap-1">
                  <span>{addr.address_line}</span>
                  <span>{addr.city}, {addr.state} {addr.pincode}</span>
                  <span>{addr.country || 'India'}</span>
                  {addr.phone_number && <span className="mt-2 text-neutral-500">Tel: {addr.phone_number}</span>}
                </div>
              </div>

              <div className="flex gap-6 border-t border-neutral-900 pt-4 mt-auto">
                <button onClick={() => openForm(addr)} className="text-[10px] font-bold tracking-[0.15em] text-white hover:text-neutral-400 transition-colors cursor-pointer">
                  EDIT
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-[10px] font-bold tracking-[0.15em] text-neutral-500 hover:text-red-500 transition-colors cursor-pointer">
                  DELETE
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}