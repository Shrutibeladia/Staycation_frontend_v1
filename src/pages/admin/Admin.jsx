import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Notification from "../../components/notification/Notification";
import { hotels, rooms } from "../../api/apiService";
import "./admin.css";

const emptyHotel = {
  name: "",
  type: "",
  city: "",
  address: "",
  distance: "",
  photos: "",
  title: "",
  desc: "",
  cheapestPrice: "",
  featured: false,
};

const emptyRoom = {
  title: "",
  price: "",
  maxPeople: "",
  desc: "",
  roomNumbers: "",
};

const Admin = () => {
  const [hotelsList, setHotelsList] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelForm, setHotelForm] = useState(emptyHotel);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [roomsList, setRoomsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hotels.list({ page: 1, limit: 50 });
      setHotelsList(res.data.hotels || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load hotels.");
    }
    setLoading(false);
  };

  const loadRooms = async (hotel) => {
    if (!hotel) return;
    setLoading(true);
    setError(null);
    try {
      const res = await hotels.getRooms(hotel._id);
      setRoomsList(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load room list.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      loadRooms(selectedHotel);
      setHotelForm({
        ...emptyHotel,
        name: selectedHotel.name || "",
        type: selectedHotel.type || "",
        city: selectedHotel.city || "",
        address: selectedHotel.address || "",
        distance: selectedHotel.distance || "",
        photos: (selectedHotel.photos || []).join(", "),
        title: selectedHotel.title || "",
        desc: selectedHotel.desc || "",
        cheapestPrice: selectedHotel.cheapestPrice || "",
        featured: selectedHotel.featured || false,
      });
    }
  }, [selectedHotel]);

  const handleHotelChange = (e) => {
    const { id, value, type, checked } = e.target;
    setHotelForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoomChange = (e) => {
    const { id, value } = e.target;
    setRoomForm((prev) => ({ ...prev, [id]: value }));
  };

  const selectHotelForRooms = (item) => {
    setSelectedHotel(item);
    setSelectedRoom(null);
    setRoomForm(emptyRoom);
    setMessage(null);
    setError(null);
  };

  const clearForm = () => {
    setSelectedHotel(null);
    setHotelForm(emptyHotel);
    setSelectedRoom(null);
    setRoomForm(emptyRoom);
    setRoomsList([]);
    setMessage(null);
    setError(null);
  };

  const submitHotel = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const payload = {
      name: hotelForm.name,
      type: hotelForm.type,
      city: hotelForm.city,
      address: hotelForm.address,
      distance: hotelForm.distance,
      photos: hotelForm.photos
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      title: hotelForm.title,
      desc: hotelForm.desc,
      cheapestPrice: Number(hotelForm.cheapestPrice),
      featured: Boolean(hotelForm.featured),
    };

    try {
      if (selectedHotel) {
        const res = await hotels.update(selectedHotel._id, payload);
        setMessage("Hotel updated successfully.");
        setSelectedHotel(res.data);
      } else {
        await hotels.create(payload);
        setMessage("Hotel created successfully.");
      }
      await loadHotels();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save hotel.");
    }
    setSaving(false);
  };

  const deleteHotel = async (hotelId) => {
    const confirmed = window.confirm("Delete this hotel permanently?");
    if (!confirmed) return;
    setError(null);
    try {
      await hotels.remove(hotelId);
      setMessage("Hotel deleted successfully.");
      if (selectedHotel && selectedHotel._id === hotelId) {
        clearForm();
      }
      await loadHotels();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete hotel.");
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setRoomForm({
      title: room.title || "",
      price: room.price || "",
      maxPeople: room.maxPeople || "",
      desc: room.desc || "",
      roomNumbers: (room.roomNumbers || [])
        .map((roomNumber) => roomNumber.number)
        .join(", "),
    });
  };

  const submitRoom = async (e) => {
    e.preventDefault();
    if (!selectedHotel) {
      setError("Select a hotel before adding or editing a room.");
      return;
    }
    if (!roomForm.title || !roomForm.price || !roomForm.maxPeople || !roomForm.desc) {
      setError("Room title, price, max people, and description are required.");
      return;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    const roomPayload = {
      title: roomForm.title,
      price: Number(roomForm.price),
      maxPeople: Number(roomForm.maxPeople),
      desc: roomForm.desc,
      roomNumbers: roomForm.roomNumbers
        .split(",")
        .map((number) => ({ number: Number(number.trim()), unavailableDates: [] }))
        .filter((item) => item.number),
    };
    try {
      if (selectedRoom) {
        await rooms.update(selectedRoom._id, roomPayload);
        setMessage("Room updated successfully.");
      } else {
        await rooms.create(selectedHotel._id, roomPayload);
        setMessage("Room created successfully.");
      }
      setSelectedRoom(null);
      setRoomForm(emptyRoom);
      await loadRooms(selectedHotel);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save room.");
    }
    setSaving(false);
  };

  const deleteRoom = async (roomId) => {
    if (!selectedHotel) return;
    const confirmed = window.confirm("Delete this room permanently?");
    if (!confirmed) return;
    setError(null);
    try {
      await rooms.remove(roomId, selectedHotel._id);
      setMessage("Room deleted successfully.");
      if (selectedRoom && selectedRoom._id === roomId) {
        setSelectedRoom(null);
        setRoomForm(emptyRoom);
      }
      await loadRooms(selectedHotel);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete room.");
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <header className="admin-header">
          <h1>Admin dashboard</h1>
          <p>
            Create hotels in the form on the right. To add rooms, select a hotel
            from the list (click <strong>Select</strong>) or use the dropdown below.
          </p>
        </header>
        <div className="admin-grid">
          <section className="admin-panel admin-hotels">
            <h2>Hotels</h2>
            {loading ? (
              <p>Loading hotels...</p>
            ) : (
              <div className="hotel-list">
                {hotelsList?.map((item) => (
                  <div
                    key={item._id}
                    className={`hotel-row ${selectedHotel?._id === item._id ? "hotel-row-selected" : ""}`}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.city}</span>
                    </div>
                    <div className="hotel-actions">
                      <button
                        type="button"
                        onClick={() => selectHotelForRooms(item)}
                        className={`btn ${selectedHotel?._id === item._id ? "btn-primary" : "btn-secondary"}`}
                      >
                        {selectedHotel?._id === item._id ? "Selected" : "Select"}
                      </button>
                      <button type="button" onClick={() => setSelectedHotel(item)} className="btn btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => deleteHotel(item._id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="admin-panel admin-form">
            <h2>{selectedHotel ? "Edit hotel" : "Add new hotel"}</h2>
            <form onSubmit={submitHotel} className="admin-form-grid">
              <label>
                Name
                <input id="name" value={hotelForm.name} onChange={handleHotelChange} required />
              </label>
              <label>
                Type
                <input id="type" value={hotelForm.type} onChange={handleHotelChange} required />
              </label>
              <label>
                City
                <input id="city" value={hotelForm.city} onChange={handleHotelChange} required />
              </label>
              <label>
                Address
                <input id="address" value={hotelForm.address} onChange={handleHotelChange} required />
              </label>
              <label>
                Distance
                <input id="distance" value={hotelForm.distance} onChange={handleHotelChange} required />
              </label>
              <label>
                Photo URLs (comma separated)
                <input id="photos" value={hotelForm.photos} onChange={handleHotelChange} />
              </label>
              <label>
                Title
                <input id="title" value={hotelForm.title} onChange={handleHotelChange} required />
              </label>
              <label>
                Description
                <textarea id="desc" value={hotelForm.desc} onChange={handleHotelChange} required />
              </label>
              <label>
                Price
                <input id="cheapestPrice" type="number" value={hotelForm.cheapestPrice} onChange={handleHotelChange} required />
              </label>
              <label className="admin-checkbox">
                <input id="featured" type="checkbox" checked={hotelForm.featured} onChange={handleHotelChange} />
                Featured hotel
              </label>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : selectedHotel ? "Update hotel" : "Create hotel"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={clearForm}>
                  Reset form
                </button>
              </div>
            </form>
          </section>
        </div>
        <div className="admin-grid admin-grid-small">
          <section className="admin-panel admin-rooms">
            <h2>Rooms for selected hotel</h2>
            <label className="admin-hotel-picker">
              Choose hotel
              <select
                value={selectedHotel?._id || ""}
                onChange={(e) => {
                  const hotel = hotelsList.find((h) => h._id === e.target.value);
                  if (hotel) selectHotelForRooms(hotel);
                }}
              >
                <option value="">— Select a hotel —</option>
                {hotelsList?.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name} ({h.city})
                  </option>
                ))}
              </select>
            </label>
            {selectedHotel && (
              <p className="admin-selected-label">
                Managing rooms for: <strong>{selectedHotel.name}</strong>
              </p>
            )}
            {!selectedHotel ? (
              <p className="admin-hint">Pick a hotel from the dropdown above or click Select in the Hotels list.</p>
            ) : (
              <div className="room-list">
                {roomsList?.map((room) => (
                  <div key={room._id} className="room-row">
                    <div>
                      <strong>{room.title}</strong>
                      <span>${room.price} / night</span>
                    </div>
                    <div className="hotel-actions">
                      <button onClick={() => selectRoom(room)} className="btn btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => deleteRoom(room._id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="admin-panel admin-form">
            <h2>{selectedRoom ? "Edit room" : "Add new room"}</h2>
            <form onSubmit={submitRoom} className="admin-form-grid">
              <label>
                Title
                <input id="title" value={roomForm.title} onChange={handleRoomChange} required />
              </label>
              <label>
                Price
                <input id="price" type="number" value={roomForm.price} onChange={handleRoomChange} required />
              </label>
              <label>
                Max people
                <input id="maxPeople" type="number" value={roomForm.maxPeople} onChange={handleRoomChange} required />
              </label>
              <label>
                Description
                <textarea id="desc" value={roomForm.desc} onChange={handleRoomChange} required />
              </label>
              <label>
                Room numbers (comma separated)
                <input id="roomNumbers" value={roomForm.roomNumbers} onChange={handleRoomChange} />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : selectedRoom ? "Update room" : "Create room"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRoom(null);
                    setRoomForm(emptyRoom);
                  }}
                >
                  Reset room
                </button>
              </div>
            </form>
          </section>
        </div>
        {error && <div className="admin-alert admin-alert-error">{error}</div>}
        {message && <div className="admin-alert admin-alert-success">{message}</div>}
      </div>
      <Footer />
      <Notification type={error ? "error" : "success"} message={error || message} onClose={() => { setError(null); setMessage(null); }} />
    </div>
  );
};

export default Admin;
