var NPMap,
  App = {
    current: null,
    data: {},
    createLayer: function(id) {
      App.current = L.heatLayer(App.data[id], {
        radius: 50
      }).addTo(NPMap.config.L);
    },
    to: function(id) {
      if (App.current) {
        NPMap.config.L.removeLayer(App.current);
        App.current = null;
      }

      if (App.data[id]) {
        App.createLayer(id);
      } else {
        L.npmap.util._.reqwest({
          success: function(response) {
            var features = response.features,
              latLngs = [];

            for (var i = 0; i < features.length; i++) {
              var coordinates = features[i].geometry.coordinates;

              latLngs.push([
                coordinates[1],
                coordinates[0]
              ]);
            }
            App.data[id] = latLngs;
            App.createLayer(id);
          },
          type: 'jsonp',
          url: 'http://mappingkat.cartodb.com/api/v2/sql?format=GeoJSON&q=Select * FROM ' + id + ''
        });
      }
    }
  };

NPMap = {
  baseLayers: [{id: 'mapbox.pencil'}],
  center: {lat: 42.714732, lng: -110.56},
  div: 'map',
  smallzoomControl: {
    position: 'topright'
  },
  homeControl: {
    position: 'topright'
  },
  hooks: {
    init: function(callback) {
      var RadioControl = L.Control.extend({
        options: {
          position: 'topright'
        },
        onAdd: function() {
          var select = L.DomUtil.create('select', 'form-control');

          select.innerHTML = '<option value="work">Work</option><option value="play">Play</option>';
          select.onchange = function() {
            App.to(this.value);
          };

          return select;
        }
      });

        //(c) 2014, Vladimir Agafonkin simpleheat, a tiny JavaScript library for drawing heatmaps with Canvas
         //https://github.com/mourner/simpleheat
        !function(){"use strict";function t(i){return this instanceof t?(this._canvas=i="string"==typeof i?document.getElementById(i):i,this._ctx=i.getContext("2d"),this._width=i.width,this._height=i.height,this._max=1,void this.clear()):new t(i)}t.prototype={defaultRadius:5,defaultGradient:{.01:"blue",.1:"cyan",.2:"lime",.3:"yellow",0.6:"red"},data:function(t){return this._data=t,this},max:function(t){return this._max=t,this},add:function(t){return this._data.push(t),this},clear:function(){return this._data=[],this},radius:function(t,i){i=i||15;var a=this._circle=document.createElement("canvas"),e=a.getContext("2d"),s=this._r=t+i;return a.width=a.height=2*s,e.shadowOffsetX=e.shadowOffsetY=200,e.shadowBlur=i,e.shadowColor="black",e.beginPath(),e.arc(s-200,s-200,t,0,2*Math.PI,!0),e.closePath(),e.fill(),this},gradient:function(t){var i=document.createElement("canvas"),a=i.getContext("2d"),e=a.createLinearGradient(0,0,0,256);i.width=1,i.height=256;for(var s in t)e.addColorStop(s,t[s]);return a.fillStyle=e,a.fillRect(0,0,1,256),this._grad=a.getImageData(0,0,1,256).data,this},draw:function(t){this._circle||this.radius(this.defaultRadius),this._grad||this.gradient(this.defaultGradient);var i=this._ctx;i.clearRect(0,0,this._width,this._height);for(var a,e=0,s=this._data.length;s>e;e++)a=this._data[e],i.globalAlpha=Math.max(a[2]/this._max,t||.05),i.drawImage(this._circle,a[0]-this._r,a[1]-this._r);var n=i.getImageData(0,0,this._width,this._height);return this._colorize(n.data,this._grad),i.putImageData(n,0,0),this},_colorize:function(t,i){for(var a,e=3,s=t.length;s>e;e+=4)a=4*t[e],a&&(t[e-3]=i[a],t[e-2]=i[a+1],t[e-1]=i[a+2])}},window.simpleheat=t}(),
        /*
         (c) 2014, Vladimir Agafonkin Leaflet.heat, a tiny and fast heatmap plugin for Leaflet.
         https://github.com/Leaflet/Leaflet.heat
        */
        L.HeatLayer=L.Class.extend({initialize:function(t,i){this._latlngs=t,L.setOptions(this,i)},setLatLngs:function(t){return this._latlngs=t,this.redraw()},addLatLng:function(t){return this._latlngs.push(t),this.redraw()},setOptions:function(t){return L.setOptions(this,t),this._heat&&this._updateOptions(),this.redraw()},redraw:function(){return!this._heat||this._frame||this._map._animating||(this._frame=L.Util.requestAnimFrame(this._redraw,this)),this},onAdd:function(t){this._map=t,this._canvas||this._initCanvas(),t._panes.overlayPane.appendChild(this._canvas),t.on("moveend",this._reset,this),t.options.zoomAnimation&&L.Browser.any3d&&t.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(t){t.getPanes().overlayPane.removeChild(this._canvas),t.off("moveend",this._reset,this),t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},_initCanvas:function(){var t=this._canvas=L.DomUtil.create("canvas","leaflet-heatmap-layer leaflet-layer"),i=this._map.getSize();t.width=i.x,t.height=i.y;var a=this._map.options.zoomAnimation&&L.Browser.any3d;L.DomUtil.addClass(t,"leaflet-zoom-"+(a?"animated":"hide")),this._heat=simpleheat(t),this._updateOptions()},_updateOptions:function(){this._heat.radius(this.options.radius||this._heat.defaultRadius,this.options.blur),this.options.gradient&&this._heat.gradient(this.options.gradient),this.options.max&&this._heat.max(this.options.max)},_reset:function(){var t=this._map.containerPointToLayerPoint([0,0]);L.DomUtil.setPosition(this._canvas,t);var i=this._map.getSize();this._heat._width!==i.x&&(this._canvas.width=this._heat._width=i.x),this._heat._height!==i.y&&(this._canvas.height=this._heat._height=i.y),this._redraw()},_redraw:function(){var t,i,a,e,s,n,h,o,r,_=[],d=this._heat._r,l=this._map.getSize(),m=new L.LatLngBounds(this._map.containerPointToLatLng(L.point([-d,-d])),this._map.containerPointToLatLng(l.add([d,d]))),c=void 0===this.options.maxZoom?this._map.getMaxZoom():this.options.maxZoom,u=1/Math.pow(2,Math.max(0,Math.min(c-this._map.getZoom(),12))),g=d/2,f=[],p=this._map._getMapPanePos(),v=p.x%g,w=p.y%g;for(t=0,i=this._latlngs.length;i>t;t++)m.contains(this._latlngs[t])&&(a=this._map.latLngToContainerPoint(this._latlngs[t]),s=Math.floor((a.x-v)/g)+2,n=Math.floor((a.y-w)/g)+2,r=(this._latlngs[t].alt||1)*u,f[n]=f[n]||[],e=f[n][s],e?(e[0]=(e[0]*e[2]+a.x*r)/(e[2]+r),e[1]=(e[1]*e[2]+a.y*r)/(e[2]+r),e[2]+=r):f[n][s]=[a.x,a.y,r]);for(t=0,i=f.length;i>t;t++)if(f[t])for(h=0,o=f[t].length;o>h;h++)e=f[t][h],e&&_.push([Math.round(e[0]),Math.round(e[1]),Math.min(e[2],1)]);this._heat.data(_).draw(),this._frame=null},_animateZoom:function(t){var i=this._map.getZoomScale(t.zoom),a=this._map._getCenterOffset(t.center)._multiplyBy(-i).subtract(this._map._getMapPanePos());this._canvas.style[L.DomUtil.TRANSFORM]=L.DomUtil.getTranslateString(a)+" scale("+i+")"}}),L.heatLayer=function(t,i){return new L.HeatLayer(t,i)};

        new RadioControl().addTo(NPMap.config.L);
        App.to('work');
        callback();
      },
      // preinit: function(callback) {
      //   var overlay = L.npmap.preset.baselayers.mapbox.pencil;
      //   NPMap.config.overlays = [ overlay ];
      //   callback();
      // }
    },
    scrollWheelZoom: false,
    minZoom: 2,
    maxZoom: 10
  };
  (function() {
  var s = document.createElement('script');
  s.src = 'http://www.nps.gov/npmap/npmap.js/2.0.0/npmap-bootstrap.min.js';
  document.body.appendChild(s);
})();


$(document).on('ready', function(){
var places = { type: 'FeatureCollection', features: [
  {'geometry': {'type': 'Point', 'coordinates': [-71.8000, 42.3000] },
    'properties': { 'id': 'cover', 'zoom': 3 }, type: 'Feature' },
  {'geometry': {'type': 'Point', 'coordinates': [ -104.99259, 39.73351 ] },
    'properties': { 'id': 'nps', 'zoom': 6 }, type: 'Feature' },
  {'geometry': {'type': 'Point', 'coordinates': [ -104.99259, 39.73351 ] },
    'properties': { 'id': 'gschool', 'zoom': 6 }, type: 'Feature' },
  {'geometry': {'type': 'Point', 'coordinates': [ 106.8275223, -6.4714902 ] },
    'properties': { 'id': 'earthline' }, type: 'Feature' },
  {'geometry': {'type': 'Point', 'coordinates': [ 106.8275223, -6.1714902] },
    'properties': { 'id': 'hot', 'zoom': 4 }, type: 'Feature' },
  {'geometry': {'type': 'Point', 'coordinates': [ 121.803894, 11.1126661] },
    'properties': { 'id': 'allhands' }, type: 'Feature' },
  {'geometry': {'type': 'Point', 'coordinates': [-77.0319595 , 38.8903694 ] },
     'properties': { 'id': 'bonobo' }, type: 'Feature' },
  {'geometry': {'type': 'Point', 'coordinates': [-75.5439682, 42.8269997 ] },
    'properties': { 'id': 'colgate' }, type: 'Feature' }
]};

  var placesLayer = new L.FeatureGroup();
  L.npmap.layer.geojson({
    data: places
  }),
  narrative = document.getElementById('narrative'),
  sections = narrative.getElementsByTagName('section'),
  currentId = '';

placeLayer.addTo(map);
setId('cover');

function setId(newId) {
    // If the ID hasn't actually changed, don't do anything
    if (newId === currentId) return;
    // Otherwise, iterate through layers, setting the current
    // marker to a different color and zooming to it.
    placesLayer.eachLayer(function(layer) {
        if (layer.feature.properties.id === newId) {
            map.setView(layer.getLatLng(), layer.feature.properties.zoom || 14);
            layer.setIcon(L.mapbox.marker.icon({
                'marker-color': '#a8f'
            }));
        } else {
            layer.setIcon(L.mapbox.marker.icon({
                'marker-color': '#404040'
            }));
        }
    });
    // highlight the current section
    for (var i = 0; i < sections.length; i++) {
        sections[i].className = sections[i].id === newId ? 'active' : '';
    }
    // And then set the new id as the current one,
    // so that we know to do nothing at the beginning
    // of this function if it hasn't changed between calls
    currentId = newId;
}

// If you were to do this for real, you would want to use
// something like underscore's _.debounce function to prevent this
// call from firing constantly.
narrative.onscroll = function(e) {
  console.log('scrolling');
  var narrativeHeight = narrative.offsetHeight;
  var newId = currentId;
  // Find the section that's currently scrolled-to.
  // We iterate backwards here so that we find the topmost one.
  for (var i = sections.length - 1; i >= 0; i--) {
      var rect = sections[i].getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= narrativeHeight) {
          newId = sections[i].id;
      }
  };
  setId(newId);
};
})