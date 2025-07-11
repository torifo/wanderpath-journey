import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="spot-form"
export default class extends Controller {
  static targets = ["mapContainer", "latInput", "lonInput", "searchInput", "prefectureSelect"]
  static values = {
    latitude: Number,
    longitude: Number
  }

  connect() {
    requestAnimationFrame(() => {
      this.initMap()
    });
  }

  disconnect() {
    if (this.map) {
      this.map.remove()
    }
  }

  initMap() {
    if (this.map) return;

    const initialLat = this.hasLatitudeValue && this.latitudeValue != 0 ? this.latitudeValue : 35.681236
    const initialLon = this.hasLongitudeValue && this.longitudeValue != 0 ? this.longitudeValue : 139.767125
    const initialZoom = this.hasLatitudeValue && this.latitudeValue != 0 ? 15 : 10

    this.map = L.map(this.mapContainerTarget).setView([initialLat, initialLon], initialZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.marker = L.marker([initialLat, initialLon], {
      draggable: true
    }).addTo(this.map);

    this.latInputTarget.value = initialLat;
    this.lonInputTarget.value = initialLon;

    this.marker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      this.latInputTarget.value = position.lat;
      this.lonInputTarget.value = position.lng;
    });
  }

  // --- 新機能：都道府県が選択されたら地図を移動 ---
  async panToPrefecture() {
    const prefecture = this.prefectureSelectTarget.value;
    if (!prefecture) return; // 何も選択されていなければ処理を中断

    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=jp&state=${encodeURIComponent(prefecture)}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Network response was not ok.');
      const results = await response.json();

      if (results.length > 0) {
        const bb = results[0].boundingbox; // [south, north, west, east]
        const southWest = L.latLng(bb[0], bb[2]);
        const northEast = L.latLng(bb[1], bb[3]);
        const bounds = L.latLngBounds(southWest, northEast);
        // 地図の表示範囲を、取得した都道府県の範囲に合わせる
        this.map.fitBounds(bounds);
      }
    } catch (error) {
      console.error("Prefecture geocoding error:", error);
    }
  }

  // 場所を検索する機能
  async search(event) {
    event.preventDefault();
    const placeName = this.searchInputTarget.value;
    if (placeName.length < 2) return;
    
    const prefecture = this.prefectureSelectTarget.value;
    const fullQuery = prefecture ? `${placeName}, ${prefecture}` : placeName;
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=jp&q=${encodeURIComponent(fullQuery)}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Network response was not ok.');
      const results = await response.json();

      if (results.length > 0) {
        const bestResult = results[0];
        const lat = parseFloat(bestResult.lat);
        const lon = parseFloat(bestResult.lon);

        this.map.setView([lat, lon], 15);
        this.marker.setLatLng([lat, lon]);

        this.latInputTarget.value = lat;
        this.lonInputTarget.value = lon;
      } else {
        alert("場所が見つかりませんでした。");
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert("場所の検索中にエラーが発生しました。");
    }
  }
}
