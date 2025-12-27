import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePostsContext } from '../contexts/PostsContext';

// Custom PNG icons - using placeholder paths to avoid missing asset errors
const airportIcon = "/assets/airport.png";
const atmIcon = "/assets/atm.png";
const busIcon = "/assets/bus.png";
const foodIcon = "/assets/food.png";
const fuelIcon = "/assets/fuel.png";
const railwayIcon = "/assets/railway.png";

interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

interface MapViewProps {
  selectedLocation?: LocationData | null;
  onLocationSelect?: (location: LocationData) => void;
}

interface MarkerGroups {
  food: L.LayerGroup;
  bus: L.LayerGroup;
  airport: L.LayerGroup;
  fuel: L.LayerGroup;
  atm: L.LayerGroup;
  railway: L.LayerGroup;
  hidden: L.LayerGroup;
  hotels: L.LayerGroup;
  motels: L.LayerGroup;
  [key: string]: L.LayerGroup;
}

interface CachedData {
  [key: string]: any;
}

function MapView({ selectedLocation, onLocationSelect }: MapViewProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set<string>());
  const [loadingFilters, setLoadingFilters] = useState<Set<string>>(new Set<string>());
  const [cachedData, setCachedData] = useState<CachedData>({});
  const mapRef = useRef<L.Map | null>(null);
  const markerGroupsRef = useRef<MarkerGroups | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);
  const postsMarkersRef = useRef<L.LayerGroup | null>(null);
  const { posts } = usePostsContext();

  // Update or create location marker
  const updateLocationMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;
    
    // Remove existing location marker
    if (locationMarkerRef.current) {
      mapRef.current.removeLayer(locationMarkerRef.current);
    }
    
    // Create new location marker with custom styling
    const locationIcon = L.divIcon({
      html: '<div style="background-color: #fbbf24; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      className: 'location-marker'
    });
    
    locationMarkerRef.current = L.marker([lat, lng], { icon: locationIcon })
      .bindPopup('Selected Location')
      .addTo(mapRef.current);
  };

  // Center map on location and add marker
  const centerOnLocation = (lat: number, lng: number) => {
    if (!mapRef.current) return;
    
    mapRef.current.setView([lat, lng], 15, {
      animate: true,
      duration: 1
    });
    updateLocationMarker(lat, lng);
  };

  // Create markers for posts with locations
  const updatePostsMarkers = () => {
    if (!mapRef.current || !postsMarkersRef.current) return;

    // Clear existing post markers to prevent duplicates
    postsMarkersRef.current.clearLayers();

    // Safety check for posts array
    if (!posts || !Array.isArray(posts)) return;

    // Create markers for posts with valid location data
    posts.filter(post => 
      post && 
      post.locationData && 
      typeof post.locationData.lat === 'number' && 
      typeof post.locationData.lon === 'number' &&
      !isNaN(post.locationData.lat) && 
      !isNaN(post.locationData.lon)
    ).forEach(post => {
      if (!post.locationData) return; // Additional safety check
      
      const { lat, lon } = post.locationData;
        
        // Create post marker with yellow theme
        const postIcon = L.divIcon({
          html: '<div style="background-color: #fbbf24; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="color: black; font-size: 10px; font-weight: bold;">📍</div></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -8],
          className: 'post-marker'
        });

        // Create popup content with safe defaults
        const truncatedContent = (post.content || '').length > 100 
          ? (post.content || '').substring(0, 100) + '...'
          : (post.content || 'No content');

        let mediaPreview = '';
        if (post.image) {
          mediaPreview = `<img src="${post.image}" alt="Post" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px; margin-top: 8px;" />`;
        } else if (post.media && Array.isArray(post.media) && post.media.length > 0) {
          const firstMedia = post.media[0];
          if (firstMedia && firstMedia.type === 'image' && firstMedia.url) {
            mediaPreview = `<img src="${firstMedia.url}" alt="Post" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px; margin-top: 8px;" />`;
          } else if (firstMedia && firstMedia.type === 'video' && firstMedia.url) {
            mediaPreview = `<video src="${firstMedia.url}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px; margin-top: 8px;" muted></video>`;
          }
        }

        const popupContent = `
          <div style="font-family: system-ui; max-width: 220px; color: #333; background: white; padding: 12px; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <img src="${post.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${post.author || 'User'}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fbbf24;" />
              <div>
                <div style="font-weight: bold; color: #1a1a1a; font-size: 14px;">${post.author || 'Anonymous'}</div>
                <div style="color: #666; font-size: 12px;">${post.locationData.name || 'Unknown location'}</div>
              </div>
            </div>
            <div style="color: #333; font-size: 13px; line-height: 1.4; margin-bottom: 8px;">${truncatedContent}</div>
            ${mediaPreview}
            <div style="color: #888; font-size: 11px; margin-top: 8px;">${post.time || 'Unknown time'}</div>
          </div>
        `;

        try {
          const marker = L.marker([lat, lon], { icon: postIcon })
            .bindPopup(popupContent, {
              maxWidth: 250,
              className: 'post-popup'
            });

          if (postsMarkersRef.current) {
            postsMarkersRef.current.addLayer(marker);
          }
        } catch (error) {
          console.warn('Failed to create marker for post:', post.id, error);
        }
      });
  };

  useEffect(() => {
    const map = L.map("map").setView([11.0168, 76.9558], 7);
    mapRef.current = map;

    // Satellite imagery base layer
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "© Esri, Maxar, Earthstar Geographics",
      maxZoom: 19,
    }).addTo(map);

    // Labels overlay for place names
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      attribution: "",
      maxZoom: 19,
    }).addTo(map);

    // Create custom icons
    const createCustomIcon = (iconUrl: string) => {
      return L.icon({
        iconUrl: iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    };

    const icons = {
      food: createCustomIcon(foodIcon),
      bus: createCustomIcon(busIcon),
      airport: createCustomIcon(airportIcon),
      fuel: createCustomIcon(fuelIcon),
      atm: createCustomIcon(atmIcon),
      railway: createCustomIcon(railwayIcon),
    };

    // Create marker groups
    const markerGroups = {
      food: L.layerGroup(),
      bus: L.layerGroup(),
      airport: L.layerGroup(),
      fuel: L.layerGroup(),
      atm: L.layerGroup(),
      railway: L.layerGroup(),
      hidden: L.layerGroup(),
      hotels: L.layerGroup(),
      motels: L.layerGroup(),
    };

    markerGroupsRef.current = markerGroups;

    // Create posts markers layer group
    const postsMarkersGroup = L.layerGroup().addTo(map);
    postsMarkersRef.current = postsMarkersGroup;

    // Add CSS animation for spinner
    const spinKeyframes = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    
    if (!document.querySelector('#spinner-animation')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'spinner-animation';
      styleSheet.textContent = spinKeyframes;
      document.head.appendChild(styleSheet);
    }

    return () => {
      // Cleanup location marker
      if (locationMarkerRef.current) {
        locationMarkerRef.current.remove();
        locationMarkerRef.current = null;
      }
      // Cleanup posts markers
      if (postsMarkersRef.current) {
        postsMarkersRef.current.clearLayers();
        postsMarkersRef.current = null;
      }
      map.remove();
    };
  }, []);

  // Handle selected location from external source (e.g., SocialFeed)
  useEffect(() => {
    if (selectedLocation) {
      centerOnLocation(selectedLocation.lat, selectedLocation.lon);
    }
  }, [selectedLocation]);

  // Update posts markers when posts change
  useEffect(() => {
    updatePostsMarkers();
  }, [posts]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    console.log("Map expanded:", !isExpanded);
  };

  // Overpass API query functions
  const getOverpassQuery = (category: string, lat: number, lng: number, radius: number = 5000) => {
    const queries = {
      food: `[out:json][timeout:25];
(
  node["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lng});
  way["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lng});
);
out geom;`,
      bus: `[out:json][timeout:25];
(
  node["highway"="bus_stop"](around:${radius},${lat},${lng});
  node["public_transport"="stop_position"](around:${radius},${lat},${lng});
);
out geom;`,
      airport: `[out:json][timeout:25];
(
  node["aeroway"~"aerodrome|airport"](around:${radius},${lat},${lng});
  way["aeroway"~"aerodrome|airport"](around:${radius},${lat},${lng});
);
out geom;`,
      fuel: `[out:json][timeout:25];
(
  node["amenity"="fuel"](around:${radius},${lat},${lng});
  way["amenity"="fuel"](around:${radius},${lat},${lng});
);
out geom;`,
      atm: `[out:json][timeout:25];
(
  node["amenity"="atm"](around:${radius},${lat},${lng});
);
out geom;`,
      railway: `[out:json][timeout:25];
(
  node["railway"="station"](around:${radius},${lat},${lng});
  way["railway"="station"](around:${radius},${lat},${lng});
);
out geom;`
    };
    return queries[category as keyof typeof queries] || '';
  };

  const fetchOverpassData = async (category: string) => {
    if (!mapRef.current) return [];

    try {
      const center = mapRef.current.getCenter();
      const query = getOverpassQuery(category, center.lat, center.lng);
      
      if (!query) return [];

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.elements || [];
    } catch (error) {
      console.error(`Error fetching ${category} data:`, error);
      return [];
    }
  };

  const createMarkersFromOverpassData = (data: any[], category: string, icon: L.Icon) => {
    const markers: L.Marker[] = [];
    
    data.forEach((element) => {
      let lat: number, lng: number;
      
      // Extract coordinates with priority: direct coordinates > center > geometry
      if (element.lat && element.lon) {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center && element.center.lat && element.center.lon) {
        lat = element.center.lat;
        lng = element.center.lon;
      } else if (element.geometry && element.geometry.length > 0 && element.geometry[0].lat && element.geometry[0].lon) {
        lat = element.geometry[0].lat;
        lng = element.geometry[0].lon;
      } else {
        // Skip elements without valid coordinates
        return;
      }

      // Extract comprehensive place information
      const tags = element.tags || {};
      const name = tags.name || tags.operator || tags.brand || tags.ref || 
                   `${category.charAt(0).toUpperCase() + category.slice(1)} Location`;
      
      // Build address string
      const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:city'],
        tags['addr:postcode']
      ].filter(Boolean);
      const address = addressParts.length > 0 ? addressParts.join(' ') : null;
      
      // Determine facility type
      const facilityType = tags.amenity || tags.highway || tags.railway || tags.aeroway || 
                          tags.shop || tags.leisure || tags.tourism || category;
      
      // Create detailed popup content
      const popupContent = `
        <div style="font-family: system-ui; max-width: 220px; color: #333;">
          <b style="color: #1a1a1a; font-size: 14px; margin-bottom: 4px; display: block;">${name}</b>
          <span style="color: #666; font-size: 12px; text-transform: capitalize; display: block; margin-bottom: 4px;">
            ${facilityType.replace(/_/g, ' ')}
          </span>
          ${address ? `<span style="color: #888; font-size: 11px; line-height: 1.3;">${address}</span>` : ''}
          ${tags.opening_hours ? `<br><span style="color: #555; font-size: 11px; font-style: italic;">Hours: ${tags.opening_hours}</span>` : ''}
        </div>
      `;
      
      const marker = L.marker([lat, lng], { icon }).bindPopup(popupContent);
      markers.push(marker);
    });

    return markers;
  };

  const handleFilterClick = async (filter: string) => {
    console.log("Filter clicked:", filter);
    
    if (!mapRef.current || !markerGroupsRef.current) return;
    
    const filterKey = filter.toLowerCase();
    const markerGroup = markerGroupsRef.current[filterKey];
    
    if (!markerGroup) return;
    
    const newActiveFilters = new Set(activeFilters);
    const newLoadingFilters = new Set(loadingFilters);
    
    if (activeFilters.has(filterKey)) {
      // Remove layer from map and clear all markers
      if (mapRef.current.hasLayer(markerGroup)) {
        mapRef.current.removeLayer(markerGroup);
      }
      markerGroup.clearLayers();
      newActiveFilters.delete(filterKey);
    } else {
      // Check if we need to fetch data for API-supported categories
      const apiCategories = ['food', 'bus', 'airport', 'fuel', 'atm', 'railway'];
      
      if (apiCategories.includes(filterKey)) {
        // Always clear existing markers before adding new ones
        markerGroup.clearLayers();
        
        // Check cache first
        if (!cachedData[filterKey]) {
          // Show loading state
          newLoadingFilters.add(filterKey);
          setLoadingFilters(newLoadingFilters);
          
          try {
            // Fetch fresh data from Overpass API
            const overpassData = await fetchOverpassData(filterKey);
            
            if (overpassData && overpassData.length > 0) {
              // Create icon for this category
              const createCustomIcon = (iconUrl: string) => {
                return L.icon({
                  iconUrl: iconUrl,
                  iconSize: [32, 32],
                  iconAnchor: [16, 16],
                  popupAnchor: [0, -16],
                });
              };

              const iconMap: { [key: string]: string } = {
                food: foodIcon,
                bus: busIcon,
                airport: airportIcon,
                fuel: fuelIcon,
                atm: atmIcon,
                railway: railwayIcon,
              };

              const icon = createCustomIcon(iconMap[filterKey]);
              const markers = createMarkersFromOverpassData(overpassData, filterKey, icon);
              
              // Add valid markers to the layer group
              markers.forEach(marker => markerGroup.addLayer(marker));
              
              // Cache the data for future use
              setCachedData((prev: { [key: string]: any[] }) => ({ ...prev, [filterKey]: overpassData }));
              
              console.log(`Loaded ${markers.length} ${filterKey} locations`);
            } else {
              console.log(`No ${filterKey} locations found in the area`);
            }
            
          } catch (error) {
            console.error(`Failed to load ${filterKey} data:`, error);
          } finally {
            // Remove loading state
            newLoadingFilters.delete(filterKey);
            setLoadingFilters(newLoadingFilters);
          }
        } else {
          // Use cached data and recreate markers
          const iconMap: { [key: string]: string } = {
            food: foodIcon,
            bus: busIcon,
            airport: airportIcon,
            fuel: fuelIcon,
            atm: atmIcon,
            railway: railwayIcon,
          };
          
          const createCustomIcon = (iconUrl: string) => {
            return L.icon({
              iconUrl: iconUrl,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            });
          };
          
          const icon = createCustomIcon(iconMap[filterKey]);
          const markers = createMarkersFromOverpassData(cachedData[filterKey], filterKey, icon);
          markers.forEach(marker => markerGroup.addLayer(marker));
        }
      }
      
      // Add layer to map
      if (!mapRef.current.hasLayer(markerGroup)) {
        mapRef.current.addLayer(markerGroup);
      }
      newActiveFilters.add(filterKey);
    }
    
    setActiveFilters(newActiveFilters);
  };

  const handleAddPlace = () => {
    console.log("Add Hidden Place clicked");
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "flex-start", 
      padding: "24px",
      paddingTop: "100px",
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%"
    }}>
      {/* Page Heading */}
      <div style={{
        width: "100%",
        marginBottom: "24px"
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#FACC15",
          margin: "0 0 4px 0",
          lineHeight: "1.2"
        }}>
          Explore the Map
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#9ca3af",
          margin: "0",
          fontWeight: "400",
          lineHeight: "1.5"
        }}>
          Discover hidden places, transport, food & stays around you
        </p>
      </div>

      {/* Map Card */}
      <div style={{
        width: "100%",
        height: isExpanded ? "75vh" : "400px",
        backgroundColor: "#1a1a1a",
        borderRadius: "24px",
        border: "1px solid #FACC15",
        boxShadow: "0 0 30px rgba(250, 204, 21, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        padding: "8px",
        position: "relative"
      }}>
        <div style={{
          height: "100%",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#111"
        }}>
          <div id="map" style={{ height: "100%", width: "100%" }} />
        </div>
      </div>

      {/* Action Card */}
      {!isExpanded && (
        <div style={{
          width: "100%",
          backgroundColor: "#1a1a1a",
          borderRadius: "24px",
          border: "1px solid #333",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          padding: "24px",
          marginTop: "20px",
          transition: "all 0.3s ease"
        }}>
          {/* Filter Icons */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px"
          }}>
            {[
              { type: "svg", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", label: "Hidden" },
              { type: "svg", icon: "M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z M9 16h6 M9 12h6 M9 8h6", label: "Hotels" },
              { type: "svg", icon: "M2 17h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z M6 17V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8", label: "Motels" }
            ].map((item) => {
              const isActive = activeFilters.has(item.label.toLowerCase());
              const isLoading = loadingFilters.has(item.label.toLowerCase());
              return (
              <button
                key={item.label}
                onClick={() => handleFilterClick(item.label)}
                disabled={isLoading}
                style={{
                  backgroundColor: isActive ? "#2a2a2a" : "#1e1e1e",
                  border: `1px solid ${isActive ? "#FACC15" : "#333"}`,
                  borderRadius: "16px",
                  padding: "20px 12px",
                  color: isLoading ? "#666" : "#FACC15",
                  cursor: isLoading ? "wait" : "pointer",
                  textAlign: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontSize: "14px",
                  fontWeight: "600",
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: isActive ? "0 4px 12px rgba(250, 204, 21, 0.2)" : "none",
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isActive && !isLoading) {
                    e.currentTarget.style.backgroundColor = "#2a2a2a";
                    e.currentTarget.style.borderColor = "#FACC15";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(250, 204, 21, 0.2)";
                  }
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isActive && !isLoading) {
                    e.currentTarget.style.backgroundColor = "#1e1e1e";
                    e.currentTarget.style.borderColor = "#333";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {isLoading ? (
                  <div style={{ fontSize: "20px", animation: "spin 1s linear infinite" }}>⟳</div>
                ) : item.type === "svg" ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                ) : (
                  <img src={item.icon} alt={item.label} style={{ width: "32px", height: "32px", filter: "brightness(0) saturate(100%) invert(79%) sepia(88%) saturate(365%) hue-rotate(7deg) brightness(104%) contrast(96%)" }} />
                )}
                <div style={{ fontSize: "12px", color: "inherit", fontWeight: "600" }}>{isLoading ? "Loading..." : item.label}</div>
              </button>
              );
            })}
          </div>

          {/* Transport & Services Icons */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "16px",
            marginBottom: "24px"
          }}>
            {[
              { type: "png", icon: foodIcon, label: "Food" },
              { type: "png", icon: airportIcon, label: "Airports" },
              { type: "png", icon: railwayIcon, label: "Railway" },
              { type: "png", icon: busIcon, label: "Bus" },
              { type: "png", icon: fuelIcon, label: "Fuel" },
              { type: "png", icon: atmIcon, label: "ATM" }
            ].map((item) => {
              const isActive = activeFilters.has(item.label.toLowerCase());
              const isLoading = loadingFilters.has(item.label.toLowerCase());
              return (
              <button
                key={item.label}
                onClick={() => handleFilterClick(item.label)}
                disabled={isLoading}
                style={{
                  backgroundColor: isActive ? "#2a2a2a" : "#1e1e1e",
                  border: `1px solid ${isActive ? "#FACC15" : "#333"}`,
                  borderRadius: "16px",
                  padding: "20px 12px",
                  color: isLoading ? "#666" : "#FACC15",
                  cursor: isLoading ? "wait" : "pointer",
                  textAlign: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontSize: "14px",
                  fontWeight: "600",
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: isActive ? "0 4px 12px rgba(250, 204, 21, 0.2)" : "none",
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isActive && !isLoading) {
                    e.currentTarget.style.backgroundColor = "#2a2a2a";
                    e.currentTarget.style.borderColor = "#FACC15";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(250, 204, 21, 0.2)";
                  }
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isActive && !isLoading) {
                    e.currentTarget.style.backgroundColor = "#1e1e1e";
                    e.currentTarget.style.borderColor = "#333";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {isLoading ? (
                  <div style={{ fontSize: "20px", animation: "spin 1s linear infinite" }}>⟳</div>
                ) : item.type === "svg" ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                ) : (
                  <img src={item.icon} alt={item.label} style={{ width: "32px", height: "32px", filter: "brightness(0) saturate(100%) invert(79%) sepia(88%) saturate(365%) hue-rotate(7deg) brightness(104%) contrast(96%)" }} />
                )}
                <div style={{ fontSize: "12px", color: "inherit", fontWeight: "600" }}>{isLoading ? "Loading..." : item.label}</div>
              </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "20px",
            alignItems: "stretch"
          }}>
            <button
              onClick={handleAddPlace}
              style={{
                flex: 1,
                backgroundColor: "#FACC15",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "20px",
                padding: "22px 32px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 6px 20px rgba(250, 204, 21, 0.35), 0 2px 8px rgba(250, 204, 21, 0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseOver={(e: any) => {
                e.currentTarget.style.backgroundColor = "#f59e0b";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(250, 204, 21, 0.45), 0 6px 16px rgba(250, 204, 21, 0.3)";
              }}
              onMouseOut={(e: any) => {
                e.currentTarget.style.backgroundColor = "#FACC15";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(250, 204, 21, 0.35), 0 2px 8px rgba(250, 204, 21, 0.2)";
              }}
            >
              + Add Hidden Place
            </button>

            <button
              onClick={toggleExpanded}
              style={{
                backgroundColor: "rgba(250, 204, 21, 0.05)",
                color: "#FACC15",
                border: "2px solid #FACC15",
                borderRadius: "20px",
                padding: "20px 28px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                minWidth: "180px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "#FACC15";
                e.currentTarget.style.color = "#0a0a0a";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(250, 204, 21, 0.3)";
              }}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "rgba(250, 204, 21, 0.05)";
                e.currentTarget.style.color = "#FACC15";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Maximize Map
            </button>
          </div>
        </div>
      )}

      {/* Minimize Button (when expanded) */}
      {isExpanded && (
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
          <button
          onClick={toggleExpanded}
          style={{
            marginTop: "24px",
            backgroundColor: "rgba(250, 204, 21, 0.05)",
            color: "#FACC15",
            border: "2px solid #FACC15",
            borderRadius: "20px",
            padding: "20px 40px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            minWidth: "200px"
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "#FACC15";
            e.currentTarget.style.color = "#0a0a0a";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(250, 204, 21, 0.3)";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "rgba(250, 204, 21, 0.05)";
            e.currentTarget.style.color = "#FACC15";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Minimize Map
        </button>
        </div>
      )}
    </div>
  );
}

export default MapView;
