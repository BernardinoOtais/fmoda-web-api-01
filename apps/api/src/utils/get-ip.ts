import type { Request } from "express";

export const extractClientIP = (req: Request): string => {
  // Array of headers to check in order of preference
  const headerChecks = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip", // Nginx
    "x-forwarded-for", // Most proxies
    "x-client-ip", // Some proxies
    "x-forwarded", // Some proxies
    "forwarded-for", // RFC 7239
    "forwarded", // RFC 7239
  ];

  // Check headers in order
  for (const header of headerChecks) {
    const headerValue = req.headers[header];

    if (headerValue && typeof headerValue === "string") {
      // x-forwarded-for can contain multiple IPs separated by commas
      // Format: "client, proxy1, proxy2"
      // We want the first (leftmost) IP which is the original client
      const ips = headerValue.split(",").map((ip) => ip.trim());
      const firstIP = ips[0];

      if (firstIP && isValidIP(firstIP)) {
        return normalizeIP(firstIP);
      }
    }
  }

  // Fall back to socket remote address
  const socketIP = req.socket?.remoteAddress || req.connection?.remoteAddress;
  if (socketIP && typeof socketIP === "string") {
    return normalizeIP(socketIP);
  }

  return "unknown";
};

/**
 * Normalizes IPv6-mapped IPv4 addresses and validates format
 */
function normalizeIP(ip: string): string {
  if (!ip) return "unknown";

  // Remove IPv6-mapped IPv4 prefix
  if (ip.startsWith("::ffff:")) {
    return ip.slice(7);
  }

  return ip.trim();
}

function isValidIP(ip: string): boolean {
  if (!ip) return false;

  // IPv4 regex
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
