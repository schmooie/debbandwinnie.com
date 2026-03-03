export function generateAvatar(name: string): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  const hue = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="hsl(${hue},40%,25%)"/>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="140" font-weight="bold" fill="hsl(${hue},60%,80%)">${initials}</text>
</svg>`

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
