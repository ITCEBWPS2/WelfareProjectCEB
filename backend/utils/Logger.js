const os = require("os");
const Log = require("../models/log");

function getClientIp(req) {
  // Check for reverse proxy headers first
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Check socket address
  const remoteAddr = req.socket?.remoteAddress;

  // Handle localhost cases
  if (
    remoteAddr === "::1" ||                      // IPv6 loopback
    remoteAddr === "127.0.0.1" ||                // IPv4 loopback
    remoteAddr?.startsWith("::ffff:127.")        // IPv4 loopback in IPv6 format
  ) {
    return getLocalExternalIp(); // Get real LAN IP (e.g., 192.168.x.x)
  }

  // Remove IPv6 prefix if present
  if (remoteAddr?.startsWith("::ffff:")) {
    return remoteAddr.split("::ffff:")[1];
  }

  return remoteAddr || "N/A";
}

// Helper: get local machine's IPv4 address
function getLocalExternalIp() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "N/A";
}

class Logger {
    static async log(type, event, message, user = null, data = {}, req = null) {
    try {
      const ip = req ? getClientIp(req) : "N/A";
      const userAgent = req?.get?.("User-Agent") || "N/A";

      const logEntry = new Log({
        type,
        event,
        user,
        message,
        data: { ...data, ip, userAgent },
      });

      await logEntry.save();
      return logEntry;
    } catch (error) {
      console.error("Failed to save log:", error);
    }
  }


  static async info(event, message, user = null, data = {}, req = null) {
    return this.log("info", event, message, user, data, req);
  }

  static async warn(event, message, user = null, data = {}, req = null) {
    return this.log("warn", event, message, user, data, req);
  }

  static async error(event, message, user = null, data = {}, req = null) {
    return this.log("error", event, message, user, data, req);
  }

  static async debug(event, message, user = null, data = {}, req = null) {
    return this.log("debug", event, message, user, data, req);
  }

  static async critical(event, message, user = null, data = {}, req = null) {
    return this.log("critical", event, message, user, data, req);
  }

  static async searchLogs(filters, page, limit) {
  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    Log.find(filters)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Log.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
    },
  };
}

}

module.exports = Logger;
