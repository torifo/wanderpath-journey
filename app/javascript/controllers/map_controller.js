import { Controller } from "@hotwired/stimulus"
import * as L from "leaflet"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    url: String
  }
  static targets = ["container"]

  connect() {
    // requestAnimationFrameを使い、ブラウザの描画タイミングに合わせて初期化
    requestAnimationFrame(() => {
      this.initMap()
      this.loadGeoJson()
    });
  }

  // ページ遷移時などに地図オブジェクトを安全に破棄する
  disconnect() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    if (this.map) return;

    this.map = L.map(this.containerTarget);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // 地図コンテナのサイズ変更を監視し、地図の表示を更新する
    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
    });
    resizeObserver.observe(this.containerTarget);
  }

  async loadGeoJson() {
    try {
      const response = await fetch(this.urlValue)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const geojsonData = await response.json()

      const geoJsonLayer = L.geoJSON(geojsonData, {
        style: (feature) => {
          if (feature.geometry.type === 'LineString') {
            return { color: "#3498db", weight: 3, opacity: 0.8 };
          }
        },
        pointToLayer: (feature, latlng) => {
          const iconUrl = feature.properties.spot_type === 'waypoint'
            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png'
            : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          
          const customIcon = L.icon({
            iconUrl: iconUrl,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          return L.marker(latlng, { icon: customIcon });
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
          }
        }
      }).addTo(this.map);

      this.map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });

    } catch (error) {
      console.error("Could not load GeoJSON data:", error);
    }
  }
}
