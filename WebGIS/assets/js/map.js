const initialZoom = 11;
const initialCoordinates = [10.01481, 46.23869];
var bingKey = 'AgtG84GxqgWsJZDR1jn1ROSuXfgcQTtJQxqL1FoWEac7JtF9uKRWw72QbZY9Criv'

var url_wms = 'http://localhost:8080/geoserver/wms';
var workspace_name = 'g7';


// Create OSM layer
let osmLayer = new ol.layer.Tile({
  visible: true,
  source: new ol.source.OSM()
});

// Create Bing Maps layer
let bingLayer = new ol.layer.Tile({
  visible: true,
  preload: Infinity,
  source: new ol.source.BingMaps({
    key: bingKey,
    imagerySet: 'Aerial'
  })
});

//  Overlay Layers

var aspect = new ol.layer.Image({
  title: "Aspect",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":aspect" },
   
  }),
  crossOrigin: "Anonymous",
});

var dtm = new ol.layer.Image({
  title: "Digital Terrain Model",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":dtm" }, 
  }),
  crossOrigin: "Anonymous",
});


var slope = new ol.layer.Image({
  title: "Slope",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { LAYERS: workspace_name + ":slope" }, //,'STYLES': 'Ex_GeoServer:water_areas'
  }),
  crossOrigin: "Anonymous",
});

var Sm = new ol.layer.Image({
  title: "Susceptibility Map",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":susceptibility_map" },
  }),
  crossOrigin: "Anonymous",
});
var Smp = new ol.layer.Image({
  title: "Susceptibility Map Reclassified",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":LandslideSusceptibilityMap_reclass" },
  }),
  crossOrigin: "Anonymous",
});
var population = new ol.layer.Image({
  title: "Population ",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":population" },
  }),
  crossOrigin: "Anonymous",
});

var ndvi = new ol.layer.Image({
  title: "NDVI ",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":ndvi" },
  }),
  crossOrigin: "Anonymous",
});
var roads = new ol.layer.Image({
  title: "Roads Buffer ",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":roads" },
  }),
  crossOrigin: "Anonymous",
});
var rivers = new ol.layer.Image({
  title: "Rivers Buffer ",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":rivers" },
  }),
  crossOrigin: "Anonymous",
});
var faults = new ol.layer.Image({
  title: "Faults Buffer ",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":faults" },
  }),
  crossOrigin: "Anonymous",
});




let scaleControl = new ol.control.ScaleLine(); // Scale control
let zoomControl = new ol.control.Zoom(); // Zoom control
let rotateControl = new ol.control.Rotate(); // Rotate control
let fullScreenControl = new ol.control.FullScreen(); // Full screen control
let attributionControl = new ol.control.Attribution(); // Attribution control
let mouseCoordinatesControl = new ol.control.MousePosition({ // Mouse coordinates control
  coordinateFormat: ol.coordinate.createStringXY(4),
  projection: 'EPSG:4326',
  className: 'custom-control',
  placeholder: '0.0000, 0.0000'
});

let map = new ol.Map({
  target: document.getElementById('map'),
  layers: [ bingLayer, 
            osmLayer,
            new ol.layer.Group({
              title: "Susceptinility & Population",
              layers: [
                Smp,
                Sm,
                population
              ],
            }),
            new ol.layer.Group({
              title: "Overlay Layers",
              layers: [
                roads,
                faults,
                rivers,
                slope,
                dtm,
              ],
            }),
  ],
  controls: ol.control.defaults({ attribution: false }).extend([attributionControl, zoomControl, rotateControl, scaleControl, fullScreenControl, mouseCoordinatesControl]),
  view: new ol.View({
    center: ol.proj.fromLonLat(initialCoordinates),
    zoom: initialZoom
  })
});


// Function to toggle visibility of OSM layer and activate Bing layer
function toggleOSMLayer() {
  let osmVisible = osmLayer.getVisible();
  osmLayer.setVisible(!osmVisible);
  bingLayer.setVisible(osmVisible);
}

function resetMap() {
  map.getView().setCenter(ol.proj.fromLonLat(initialCoordinates));
  map.getView().setZoom(initialZoom);
}

//Add Layer Switcher
var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

//Add Popup
var elementPopup = document.getElementById("popup");
var popup = new ol.Overlay({
  element: elementPopup,
});
map.addOverlay(popup);