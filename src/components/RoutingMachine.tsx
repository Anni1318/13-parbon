'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

interface Props {
  from?: [number, number];
  to?: [number, number];
  waypoints?: [number, number][];
  onRouteCalculated?: (distance: number, time: number) => void;
}

export default function RoutingMachine({ from, to, waypoints, onRouteCalculated }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let wps: L.LatLng[] = [];
    if (waypoints && waypoints.length > 0) {
      wps = waypoints.map((wp) => L.latLng(...wp));
    } else if (from && to) {
      wps = [L.latLng(...from), L.latLng(...to)];
    }

    if (wps.length < 2) return;

    const control = (L as any).Routing.control({
      waypoints: wps,
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // hide the default routing instructions text
      lineOptions: {
        styles: [{ color: '#F59E0B', weight: 4, opacity: 0.8 }],
      },
    }).addTo(map);

    control.on('routesfound', function (e: any) {
      const routes = e.routes;
      if (routes && routes[0] && onRouteCalculated) {
        const summary = routes[0].summary;
        // distance in meters, time in seconds
        onRouteCalculated(summary.totalDistance, summary.totalTime);
      }
    });

    return () => {
      try {
        if (map && control) {
          // Clear waypoints to stop ongoing async routing
          control.getPlan().setWaypoints([]);
          
          // Workaround for leaflet-routing-machine bug where async callbacks
          // try to access `this._map.removeLayer(this._line)` after `this._map` is null
          const anyControl = control as any;
          if (anyControl._line) {
            map.removeLayer(anyControl._line);
            anyControl._line = null;
          }

          map.removeControl(control);
        }
      } catch (e) {
        console.warn('RoutingMachine unmount error', e);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    map,
    from ? `${from[0]},${from[1]}` : null,
    to ? `${to[0]},${to[1]}` : null,
    waypoints ? JSON.stringify(waypoints) : null,
  ]);

  return null;
}
