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
 
  
  // Capa extra
   "Esri.WorldStreetMap": L.tileLayer.provider('Esri.WorldStreetMap'),
 
  
  
  	// Agregar capa WMS cobetura arborea SNIT
	"Cobertura Arborea 2018-WMS": L.tileLayer.wms('https://monitoreo.prias.cenat.ac.cr/geoserver/MonitoreoCA/wms?', {
	layers: 'Paisaje_Cobertura_Arborea_2018',
	format: 'image/png',
	transparent: true
	}),
	
	
	// Agregar capa WMS areas esenciales para soporte biodiversidad
	"Áreas esenciales para el soporte de biodiversidad-WMS": L.tileLayer.wms('https://monitoreo.prias.cenat.ac.cr/geoserver/Cartografia/wms?', {
	layers: 'Areas_Esenciales_para_el_soporte_de_la_biodiversidad',
	format: 'image/png',
	transparent: true
	})

	
}
	
	// Ícono personalizado para denuncias
	const iconoCarnivoro = L.divIcon({
	  html: '<i class="fas fa-cat fa-2x"></i>',
	  className: 'estiloIconos'
	});



// Se agregan todas las capas base al mapa
control_capas = L.control.layers(capas_base).addTo(mapa);

// Se activa una capa base del control
capas_base['OSM'].addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);

	

// Capa vectorial en formato GeoJSON DENUNCIAS
	$.getJSON("https://maureenarg.github.io/datostarea/denuncias.geojson", function(geodata) {
		var denuncias = L.geoJson(geodata, {
			pointToLayer: function(feature, lating) {
				return L.circleMarker (lating, { radius:4, fillcolor: "#fc032d", color: "#fc032d", weight: 0.5, opacity: 1, fillOpacity: 0.8
	});
	
		},	
    onEachFeature: function(feature, layer) {
		var popupText = "<strong>Categoría</strong>: " + feature.properties.CATEGORIA_;
		layer.bindPopup(popupText);
		}			
	}).addTo(mapa);
	
	control_capas.addOverlay(denuncias, 'Denuncias');
	});	
		
	
	
	// Capa vectorial en formato GeoJSON RIOS
	$.getJSON("https://maureenarg.github.io/datostarea/rios.geojson", function(geodata) {
		var rios = L.geoJson(geodata, {
		style: function(feature) {
				return {'color': "#1703fc", 'weight': 2.5, 'fillOpacity': 0.0}
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
				return {'color': "#1703fc", 'weight': 2.5, 'fillOpacity': 0.3}
		},
    onEachFeature: function(feature, layer) {
		var popupText = "<strong>Nombre</strong>: " + feature.properties.NOMBRE;
		layer.bindPopup(popupText);
		}			
	}).addTo(mapa);

	control_capas.addOverlay(cuencas, 'Cuencas').addTo(mapa);
	});	






// Capa vectorial de registros agrupados de denuncias
$.getJSON("https://raw.githubusercontent.com/MaureenArg/datostarea/master/denuncias.geojson", function(geodata) {
  
  // Registros individuales
  var capa_denuncias = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>CATEGORIA_</strong>: " + feature.properties.CATEGORIA + "<br>" + 
                  
                      "<br>" +
                      "<a href='" + feature.properties.occurrenceID + "'>Más información</a>";
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoCarnivoro});
    }
  });

  // Capa de puntos agrupados
  var capa_denuncias_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_denuncias_agrupados.addLayer(capa_denuncias);

  // Se añade la capa al mapa y al control de capas
  capa_denuncias_agrupados.addTo(mapa);
  control_capas.addOverlay(capa_denuncias_agrupados, 'Registros agrupados de denuncias');
  control_capas.addOverlay(capa_denuncias, 'Registros individuales de denuncias');
});
