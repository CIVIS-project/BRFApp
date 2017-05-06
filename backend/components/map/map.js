const html = require('choo/html');
const createPopup = require('./popup');
const { loader } = require('../icons');
const { __ } = require('../../locale');
const { getEnergyClass, cache, getPerformance, resource } = require('../utils');

const CLUSTER_THRESHOLD = 12;
const POPUP_OFFSET = {
  'top': [0, -15],
  'top-left': [0, -15],
  'top-right': [0, -15],
  'bottom': [0, -36],
  'bottom-left': [0, -36],
  'bottom-right': [0, -36],
  'left': [6, -26],
  'right': [-6, -26]
};

module.exports = function createMap() {
  let init, map, mapbox, position;

  return cache({
    shouldUpdate(args, prev) {
      // Check if number of cooperatives has changed
      if (args[0].length !== prev[0].length) {
        return true;
      }

      // Check if center has changed
      if (args[1].latitude !== prev[1].latitude || args[1].longitude !== prev[1].longitude) {
        return true;
      }

      return false;
    },

    update(element, cooperatives, center) {
      if (map) {
        setData();
      } else {
        init = [ cooperatives, center ];
      }

      function setData() {
        // Recalculate bounds
        const bounds = getBounds(cooperatives, getLngLat(center));

        if (center.precission === 'exact') {
          if (!position) {
            // Create position marker for exact position
            position = new mapbox.Marker(myLocation());
          }

          // Update position coordinates
          position.setLngLat(getLngLat(center)).addTo(map);

          // Ensure that exact position is included in bounds
          bounds.extend(getLngLat(center));
        }

        // Fit new bounds in map
        map.fitBounds(bounds, { padding: element.offsetWidth * 0.1 });

        // Update map source
        map.getSource('cooperatives').setData({
          type: 'FeatureCollection',
          features: asFeatures(cooperatives)
        });
      }
    },

    render(...args) {
      let popup;

      return html`
        <div class="Map u-sizeFill is-loading" onload=${ onload } onunload=${ onunload }>
          ${ loader() }
        </div>
      `;

      function onunload() {
        if (popup && popup.isOpen()) {
          popup.remove();
        }
      }

      function onload(el) {
        if (map) { return; }

        resource('https://api.mapbox.com/mapbox-gl-js/v0.34.0/mapbox-gl.css');
        resource('mapbox-gl').then(mapboxgl => {

          /**
           * Unset loading state and empty out container
           */

          el.classList.remove('is-loading');
          el.innerHTML = '';

          // Pluck data from init if update has been called, fallback to args
          const [ cooperatives, center ] = init || args;

          // Stash mapbox api in scoped variable
          mapbox = mapboxgl;

          mapbox.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
          map = new mapbox.Map({
            container: el,
            style: process.env.MAPBOX_STYLE,
            maxZoom: 17
          });

          /**
           * Try and fit center and a couple cooperatives in map
           */

          map.fitBounds(getBounds(cooperatives, getLngLat(center)), {
            padding: el.offsetWidth * 0.1,
            animate: false
          });

          if (center.precission === 'exact') {
            // Create a marker for exact position
            position = new mapbox.Marker(myLocation())
              .setLngLat(getLngLat(center))
              .addTo(map);
          }

          map.on('load', () => {

            /**
             * Add cooperatives as source
             */

            map.addSource('cooperatives', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: asFeatures(cooperatives)
              },
              cluster: true,
              clusterMaxZoom: CLUSTER_THRESHOLD
            });

            /**
             * Add all individual (unclustered cooperatives)
             */

            map.addLayer({
              id: 'cooperative-markers',
              type: 'symbol',
              source: 'cooperatives',
              filter: ['!has', 'point_count'],
              layout: {
                'icon-allow-overlap': true,
                'icon-image': 'marker-{energyClass}',
                'icon-offset': [0, -21]
              }
            });

            /**
             * Add clusters
             */

            map.addLayer({
              id: 'cooperative-clusters',
              type: 'symbol',
              source: 'cooperatives',
              filter: ['has', 'point_count'],
              layout: {
                'icon-allow-overlap': true,
                'icon-image': 'marker-cluster',
                'text-field': '{point_count}',
                'text-font': [ 'Lato Bold' ],
                'text-size': 14,
                'text-offset': [ 0, 0.85 ]
              },
              paint: {
                'text-color': '#fff'
              }
            });

            /**
             * Zoom out if center posiiton is unprecise
             */

            if (center.precission !== 'exact') {
              map.setZoom(11);
            }

            /**
             * Handle pointer
             */

            map.on('mousemove', event => {
              const features = map.queryRenderedFeatures(event.point, {
                layers: ['cooperative-markers', 'cooperative-clusters']
              });

              map.getCanvas().style.cursor = features.length ? 'pointer' : '';
            });

            /**
             * Handle clikcing on the map
             */

            map.on('click', event => {
              // Figure out which (if any) layers has been clicked
              const features = map.queryRenderedFeatures(event.point, {
                layers: ['cooperative-markers', 'cooperative-clusters']
              });

              if (!features.length) {
                return;
              }

              const feature = features[0];

              if (feature.properties.cluster) {
                // Reveal all cooperatives in cluster
                map.flyTo({
                  center: feature.geometry.coordinates,
                  zoom: CLUSTER_THRESHOLD + 1
                });
              } else {
                // Show cooperative popup
                popup = new mapbox.Popup({ closeButton: false, offset: POPUP_OFFSET });
                popup
                  .setLngLat(feature.geometry.coordinates)
                  .setDOMContent(createPopup(feature))
                  .addTo(map);
              }
            });
          });
        });
      }
    }
  });

  /**
   * Calculate bounds for given coopeartives and center coordinates
   * @param  {Array}      cooperatives List of cooperatives
   * @param  {LatLngLike} center       Coordinates to base positioning on
   * @return {mapbox.LngLatBounds}
   */

  function getBounds(cooperatives, center) {
    let include;
    const bounds = new mapbox.LngLatBounds();
    const closest = cooperatives.map(cooperative => {
      return getPositionDistance(center, getLngLat(cooperative));
    }).sort()[0];

    if (closest < 200) {
      // Include center
      bounds.extend(center);

      // Include the closest five cooperatives if within reasonable distance
      include = cooperatives.slice()
        .sort((a, b) => {
          const aDistance = getPositionDistance(center, getLngLat(a));
          const bDistance = getPositionDistance(center, getLngLat(b));
          return aDistance > bDistance ? 1 : -1;
        })
        .filter((item, index) => index < 5);
    } else {
      // Include all cooperatives if center is too far off
      include = cooperatives;
    }

    include.forEach(cooperative => bounds.extend(getLngLat(cooperative)));

    return bounds;
  }
};

/**
 * Generic "You are here"-location marker
 */

function myLocation() {
  return html`
    <div>
      <div class="Map-position">${ __('You are here') }</div>
    </div>
  `;
}

/**
 * Extract coordinates as LngLatLike object from object
 * @param  {Object} props Object with some kind of lat/lng properties
 * @return {Array}        LatLngLike (Mapbox compatible)
 */

function getLngLat(props) {
  return [
    props.longitude || props.lng,
    props.latitude || props.lat
  ];
}

/**
 * Convert degrees to radius
 */

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate distance between two lat/lng points in km
 */

function getPositionDistance(posA, posB) {
  const [lng1, lat1] = posA;
  const [lng2, lat2] = posB;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad above
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return d;
}

function asFeatures(cooperatives) {
  return cooperatives.map(cooperative => {
    const performance = getPerformance(cooperative);

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [ cooperative.lng, cooperative.lat ]
      },
      properties: {
        id: cooperative._id,
        name: cooperative.name,
        performance: performance,
        actions: cooperative.actions.length,
        energyClass: (getEnergyClass(performance) || 'unknown').toLowerCase()
      }
    };
  });
}
