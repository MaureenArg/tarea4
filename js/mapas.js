// Mapa Leaflet
var mapa = L.map('mapid').setView([9.8, -84.25], 7);

// Definición de capas base
var capas_base = {
	
  // Capa base agregada mediante L.tileLayer
  "OSM": L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ),

  // Capa base agregada mediante L.tileLayer y leaflet-providers
  "Stamen.Watercolor": L.tileLayer.provider('Stamen.Watercolor'), 
 
  
  // Capa base
   "Esri.WorldStreetMap": L.tileLayer.provider('Esri.WorldStreetMap'),
 
  
  	// capa WMS cobetura arborea SNIT
	"Cobertura Arborea 2018-WMS": L.tileLayer.wms('https://monitoreo.prias.cenat.ac.cr/geoserver/MonitoreoCA/wms?', {
	layers: 'Paisaje_Cobertura_Arborea_2018',
	format: 'image/png',
	transparent: true
	}),
	
	
	//  capa WMS areas esenciales para soporte biodiversidad
	"Áreas esenciales para el soporte de biodiversidad-WMS": L.tileLayer.wms('https://monitoreo.prias.cenat.ac.cr/geoserver/Cartografia/wms?', {
	layers: 'Areas_Esenciales_para_el_soporte_de_la_biodiversidad',
	format: 'image/png',
	transparent: true
	})
	
}
	
	// Ícono personalizado para denuncias
const iconoDen = L.divIcon({
	html: '<i class="far fa-dot-circle"></i>',
	className: 'estiloIconos'
});


	// Ícono personalizado para piña
const iconoPin = L.divIcon({
	html: '<i class="fas fa-circle"></i>',
	className: 'estiloIcon'
});


// Se agregan todas las capas base al mapa
control_capas = L.control.layers(capas_base).addTo(mapa);

// Se activa una capa base del control
capas_base['OSM'].addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);


	
	
	// Capa vectorial en formato GeoJSON RIOS
	$.getJSON("https://maureenarg.github.io/datostarea/rios.geojson", function(geodata) {
		var rios = L.geoJson(geodata, {
		style: function(feature) {
				return {'color': "#1703fc", 'weight': 0.3, 'fillOpacity': 0.0}
		},
    onEachFeature: function(feature, layer) {
		var popupText = "<strong>Nombre</strong>: " + feature.properties.NOMBRE;
		layer.bindPopup(popupText);
		}			
	}).addTo(mapa);

	control_capas.addOverlay(rios, 'Ríos').addTo(mapa);
	});	
	
	
	// Capa vectorial en formato GeoJSON Cuencas
	$.getJSON("https://raw.githubusercontent.com/MaureenArg/datostarea/master/cuencas.geojson", function(geodata) {
		var cuencas = L.geoJson(geodata, {
		style: function(feature) {
				return {'color': "#0088b6", 'weight': 1.5, 'fillOpacity': 0.3}
		},
    onEachFeature: function(feature, layer) {
		var popupText = "<strong>Nombre</strong>: " + feature.properties.NOMBRE;
		layer.bindPopup(popupText);
		}			
	}).addTo(mapa);

	control_capas.addOverlay(cuencas, 'Cuencas').addTo(mapa);
	});	



// Capa vectorial de registros agrupados de denuncias
$.getJSON("https://raw.githubusercontent.com/MaureenArg/datostarea/master/denuncias2.geojson", function(geodata) {
  
  // Registros denuncias individuales
  
	var capa_denuncias = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#013220", 'weight': 3}
	},
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>CATEGORIA</strong>: " + feature.properties.CATEGORIA_ + "<br>" ;
      layer.bindPopup(popupText);
		},
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoDen});
    }
 });



 // Capa de puntos agrupados denuncias
  var capa_denuncias_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_denuncias_agrupados.addLayer(capa_denuncias);

 
	capa_denuncias.addTo(mapa);
	control_capas.addOverlay(capa_denuncias_agrupados, 'Registros agrupados de denuncias');
	control_capas.addOverlay(capa_denuncias, 'Registros individuales de denuncias');
});	


// Capa vectorial de registros agrupados de monocultivos

$.getJSON("https://raw.githubusercontent.com/MaureenArg/datostarea/master/pinia.geojson", function(geodata) {
  
  // Registros monocultivos individuales
  
	var capa_monocul = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#013220", 'weight': 3}
	},
   
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoPin});
    }
 });

  // Capa de calor (heatmap) de monocultivos
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_monocul_calor = L.heatLayer(coordenadas, {radius: 40, blur: 2});


// Capa de puntos agrupados de monocultivos
  var capa_monocul_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_monocul_agrupados.addLayer(capa_monocul);


 
// Se añaden las capas al mapa y al control de capas
  capa_monocul_calor.addTo(mapa);
  control_capas.addOverlay(capa_monocul_calor, 'Mapa de calor de monocultivos');
 
 
  // capa_monocul_agrupados.addTo(mapa);
  control_capas.addOverlay(capa_monocul_agrupados, 'Registros agrupados de monocultivos');
  // capa_monocul.addTo(mapa);
  control_capas.addOverlay(capa_monocul, 'Registros individuales de monocultivos');
});
	
	
	
