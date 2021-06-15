var osm = new ol.layer.Tile({
	title: 'OpenStreetMap',
	type: 'base',
	visible: true,
	source: new ol.source.OSM()
});
var bingAerial = new ol.layer.Tile({
	title: 'Bing Maps-Aerial',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'Ajw2vpg56js7EJMMajcLZXKTKaoOjHkuj_hSjiqkReEoQewyjm4PK_B0xBckwKe3',
		imagerySet: 'Aerial'
	})
});
var bingAerialWithLabels = new ol.layer.Tile({
	title: 'Bing Maps-Aerial with Labels',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'Ajw2vpg56js7EJMMajcLZXKTKaoOjHkuj_hSjiqkReEoQewyjm4PK_B0xBckwKe3',
		imagerySet: 'AerialWithLabels'
	})
});
var stamenWatercolor = new ol.layer.Tile({
	title: 'Stamen Watercolor',
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({
	layer: 'watercolor'
	})
});
var stamenToner = new ol.layer.Tile({
	title: 'Stamen Toner',
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({
	layer: 'toner'
	})
});
var ghsStep1Map = new ol.layer.Image({
	title: 'GHS step1 map',
	source: new ol.source.ImageWMS({
	url: 'http://localhost:8082/geoserver/wms',
	params: {'LAYERS': 'GIS_Lab:GHS_Step1'}
	})
});
var WorldPopStep1Map = new ol.layer.Image({
	title: 'WorldPop step1 map',
	source: new ol.source.ImageWMS({
	url: 'http://localhost:8082/geoserver/wms',
	params: {'LAYERS': 'GIS_Lab:WorldPop_Step1'}
	})
});
var DifferenceMap = new ol.layer.Image({
	title: 'Difference step2 map',
	source: new ol.source.ImageWMS({
	url: 'http://localhost:8082/geoserver/wms',
	params: {'LAYERS': 'GIS_Lab:Difference_map'}
	})
});
var ghsStep3Map = new ol.layer.Image({
	title: 'GHS Reclassified',
	source: new ol.source.ImageWMS({
	url: 'http://localhost:8082/geoserver/wms',
	params: {'LAYERS': 'GIS_Lab:GHS_Reclassified'}
	})
});
var WorldPopStep3Map = new ol.layer.Image({
	title: 'WorldPop Reclassified',
	source: new ol.source.ImageWMS({
	url: 'http://localhost:8082/geoserver/wms',
	params: {'LAYERS': 'GIS_Lab:WorldPop_Reclassified'}
	})
});
var DifferenceReclassifiedMap = new ol.layer.Image({
	title: 'Difference step3 map',
	source: new ol.source.ImageWMS({
	url: 'http://localhost:8082/geoserver/wms',
	params: {'LAYERS': 'GIS_Lab:Difference_Reclassified_map'}
	})
});
var points = new ol.layer.Image({
	title: 'Points_Classified',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_Lab:GHS_and_WorldPop'}
	}),
	visible: false
});
var correlationFactor = new ol.layer.Image({
	title: 'Subgroup12 tiles',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_Lab:SubGroup12_CorrelationFactor'}
	}),
	visible: false
});
var map = new ol.Map({
	target: document.getElementById('map'),
	layers: [
		new ol.layer.Group({
			title: 'Base Maps',
			layers: [stamenToner, stamenWatercolor, bingAerialWithLabels, bingAerial, osm]
		}),
		new ol.layer.Group({
			title: 'Intercomparison Layers',
			layers: [ghsStep1Map, WorldPopStep1Map,DifferenceMap]
		}),
		new ol.layer.Group({
			title: 'Validation Layers',
			layers: [ghsStep3Map, WorldPopStep3Map,DifferenceReclassifiedMap]
		}),
		new ol.layer.Group({
			title: 'Vector layers',
			layers: [points,correlationFactor]
		})
	],
	view: new ol.View({
		center: ol.proj.fromLonLat([13,2]),
		zoom: 4
	}),
	controls: ol.control.defaults().extend([
		new ol.control.ScaleLine(),
		new ol.control.FullScreen(),
		new ol.control.OverviewMap(),
		new ol.control.MousePosition({
			coordinateFormat: ol.coordinate.createStringXY(4),
			projection: 'EPSG:4326'
		})
	])
});
var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

map.on('click', function(event) {
	document.getElementById('get-feature-info').innerHTML = '';
	var viewResolution = (map.getView().getResolution());
	var url = correlationFactor.getSource().getFeatureInfoUrl(event.coordinate,
	viewResolution, 'EPSG:3857', {'INFO_FORMAT': 'text/html'});
	if (url)
		document.getElementById('get-feature-info').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
});
map.on('click', function(event) {
	document.getElementById('points-info').innerHTML = '';
	var viewResolution = (map.getView().getResolution());
	var url = points.getSource().getFeatureInfoUrl(event.coordinate,
	viewResolution, 'EPSG:3857', {'INFO_FORMAT': 'text/html'});
	if (url)
		document.getElementById('points-info').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
});