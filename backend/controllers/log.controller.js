const Logger = require("../utils/Logger");
const Log = require("../models/log");

exports.getLogs = async (req, res) => {
  try {
    const { type, event, user, from, to, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const filters = {};
    if (type) filters.type = type;
    if (event) filters.event = event;
    if (user) filters.user = user;

    if (from || to) {
      filters.timestamp = {};
      if (from) filters.timestamp.$gte = new Date(from);
      if (to) filters.timestamp.$lte = new Date(to);
    }

    console.log("Filters:", filters); // Debugging

    const result = await Logger.searchLogs(filters, pageNum, limitNum);

    res.status(200).json({
      success: true,
      message: "Logs retrieved successfully",
      totalItems: result.pagination.totalItems,
      pages: result.pagination.totalPages,
      currentPage: result.pagination.currentPage,
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error retrieving logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve logs",
      error: error.message,
    });
  }
};

exports.getLogStats = async (req, res) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totalLogs = await Log.countDocuments();
    const recentLogs = await Log.countDocuments({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        recentLogs,
        typeBreakdown: stats,
      },
    });
  } catch (error) {
    console.error("Error getting log stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get log statistics",
      error: error.message,
    });
  }
};
