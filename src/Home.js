import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Home.css';
import { Map, Layers, BarChart2, Settings, LogOut, Search, Info, Navigation } from 'lucide-react';

// Fix icon issues in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const Home = () => {
    const [user, setUser] = useState({ name: 'Admin', email: 'admin@gis.com' });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mapView, setMapView] = useState('standard');
    const [locations, setLocations] = useState([
        { id: 1, name: 'Gunung Merapi', desc: 'Gunung berapi aktif di Jawa Tengah', category: 'landmark', position: [-7.5407, 110.4457] },
        { id: 2, name: 'Danau Toba', desc: 'Danau vulkanik terbesar di Indonesia', category: 'tourism', position: [2.6158, 98.8350] },
        { id: 3, name: 'Taman Nasional Komodo', desc: 'Habitat komodo di Nusa Tenggara Timur', category: 'park', position: [-8.5519, 119.4891] },
        { id: 4, name: 'Kota Tua Jakarta', desc: 'Kawasan bersejarah di Jakarta', category: 'history', position: [-6.1351, 106.8133] },
        { id: 5, name: 'Raja Ampat', desc: 'Kepulauan dengan keindahan bawah laut', category: 'tourism', position: [-1.0741, 130.8779] }
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Get user data
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.name) {
            setUser(userData);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setIsMenuOpen(false);
    };

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>GeoTrack</h2>
                    <div className="user-info">
                        <div className="avatar">{user.name.charAt(0)}</div>
                        <div className="user-details">
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <div className="menu-item active">
                        <i className="icon"><Map size={18} /></i>
                        <span>Dashboard</span>
                    </div>
                    <div className="menu-item">
                        <i className="icon"><Layers size={18} /></i>
                        <span>Layers</span>
                    </div>
                    <div className="menu-item">
                        <i className="icon"><BarChart2 size={18} /></i>
                        <span>Analysis</span>
                    </div>
                    <div className="menu-item">
                        <i className="icon"><Settings size={18} /></i>
                        <span>Settings</span>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="header">
                    <div className="menu-toggle" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <h1>Geographic Information System</h1>
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="logout-button" onClick={handleLogout}>
                        <i className="icon"><LogOut size={18} /></i>
                        <span>Logout</span>
                    </div>
                </div>
                <div className="content">
                    <div className="map-controls">
                        <div className="view-buttons">
                            <button
                                className={mapView === 'standard' ? 'active' : ''}
                                onClick={() => setMapView('standard')}
                            >
                                Standard
                            </button>
                            <button
                                className={mapView === 'satellite' ? 'active' : ''}
                                onClick={() => setMapView('satellite')}
                            >
                                Satellite
                            </button>
                            <button
                                className={mapView === 'terrain' ? 'active' : ''}
                                onClick={() => setMapView('terrain')}
                            >
                                Terrain
                            </button>
                        </div>
                    </div>

                    <div className="map-container">
                        <MapContainer center={[-2.5489, 118.0149]} zoom={5} style={{ height: '100%', width: '100%' }}>
                            {mapView === 'standard' && (
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            )}
                            {mapView === 'satellite' && (
                                <TileLayer
                                    attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            )}
                            {mapView === 'terrain' && (
                                <TileLayer
                                    attribution='&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a>'
                                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                />
                            )}

                            {filteredLocations.map(location => (
                                <Marker
                                    key={location.id}
                                    position={location.position}
                                    eventHandlers={{
                                        click: () => {
                                            setSelectedLocation(location);
                                        },
                                    }}
                                >
                                    <Popup>
                                        <div>
                                            <h3>{location.name}</h3>
                                            <p>{location.desc}</p>
                                            <p><strong>Category:</strong> {location.category}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {filteredLocations.map(location => (
                                <LayerGroup key={`layer-${location.id}`}>
                                    <Circle
                                        center={location.position}
                                        radius={20000}
                                        pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, weight: 1 }}
                                    />
                                </LayerGroup>
                            ))}
                        </MapContainer>
                    </div>

                    <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                        <div className="menu-header">
                            <h3>Location List</h3>
                            <button className="close-button" onClick={toggleMenu}>✕</button>
                        </div>
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="location-list">
                            {filteredLocations.map(location => (
                                <div
                                    key={location.id}
                                    className={`location-item ${selectedLocation?.id === location.id ? 'active' : ''}`}
                                    onClick={() => handleLocationSelect(location)}
                                >
                                    <h4>{location.name}</h4>
                                    <p>{location.desc}</p>
                                    <span className="location-category">{location.category}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedLocation && (
                        <div className="info-panel">
                            <h3>{selectedLocation.name}</h3>
                            <p>{selectedLocation.desc}</p>
                            <p className="info-category">Category: <span>{selectedLocation.category}</span></p>
                            <p className="info-coords">
                                Coordinates: {selectedLocation.position[0].toFixed(4)}, {selectedLocation.position[1].toFixed(4)}
                            </p>
                            <div className="info-actions">
                                <button className="info-button">
                                    <Info size={16} />
                                    <span>Details</span>
                                </button>
                                <button className="info-button secondary">
                                    <Navigation size={16} />
                                    <span>Route</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;