export function mapToJson(map) {
  const obj = {};
  for (const [key, value] of map) {
    obj[key] = value instanceof Map ? mapToJson(value) : value;
  }
  return obj;
}

export const normalizeIPAddress = (ip) => {
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7); // IPv6-mapped IPv4 address
    } else if (ip.includes(':')) {
      return `[${ip}]`; // Pure IPv6 address, needs to be enclosed in brackets
    }
    return ip; // IPv4 address
  };
  
