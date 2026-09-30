export const CAMERAS = [
  { id: 'CAM-01', name: 'Gate 1 Main Entry', status: 'ONLINE' },
  { id: 'CAM-02', name: 'Perimeter North', status: 'ONLINE' },
  { id: 'CAM-03', name: 'Runway Hangar', status: 'STANDBY' },
  { id: 'CAM-04', name: 'Parking Checkpoint', status: 'ONLINE' },
]
export const CLASSES = ['car', 'bike', 'truck', 'bus']
const pick = (a) => a[Math.floor(Math.random() * a.length)]
let seq = 1000
export function generateEvent() {
  const cam = pick(CAMERAS.filter((c) => c.status === 'ONLINE'))
  const r = Math.random()
  let severity, title, vehicle
  if (r < 0.08) { severity = 'CRITICAL'; title = pick(['Perimeter Breach', 'Weapon Detected']); vehicle = 'none' }
  else if (r < 0.3) { severity = 'WARNING'; vehicle = pick(['truck', 'bus']); title = `Heavy Vehicle in Restricted Zone (${vehicle})` }
  else { severity = 'INFO'; vehicle = pick(['car', 'car', 'bike', 'truck']); title = `Standard Vehicle Checkpoint Entry (${vehicle})` }
  return { id: ++seq, severity, title, vehicle, camera: cam.id, time: new Date().toLocaleTimeString('en-GB') }
}
