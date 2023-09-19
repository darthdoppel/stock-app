const Equipment = require('../models/Equipment')
const Sale = require('../models/Sale')
const Client = require('../models/Client')
const WorkOrder = require('../models/WorkOrder')

exports.getDailyProfits = async function (fromDate, toDate) {
  return await Equipment.aggregate([
    {
      $match: {
        dateReceived: { $gte: fromDate, $lte: toDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: { date: '$dateReceived', timezone: 'America/Argentina/Buenos_Aires' } },
          month: { $month: { date: '$dateReceived', timezone: 'America/Argentina/Buenos_Aires' } },
          day: { $dayOfMonth: { date: '$dateReceived', timezone: 'America/Argentina/Buenos_Aires' } }
        },
        totalProfit: { $sum: '$estimatedProfit' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ])
}

exports.getDailySales = async function (fromDate, toDate) {
  return await Sale.aggregate([
    {
      $match: {
        date: { $gte: fromDate, $lte: toDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: { date: '$date', timezone: 'America/Argentina/Buenos_Aires' } },
          month: { $month: { date: '$date', timezone: 'America/Argentina/Buenos_Aires' } },
          day: { $dayOfMonth: { date: '$date', timezone: 'America/Argentina/Buenos_Aires' } }
        },
        totalSales: { $sum: '$total' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ])
}

exports.getDailyClients = async function (fromDate, toDate) {
  return await Client.aggregate([
    {
      $match: {
        dateAdded: { $gte: fromDate, $lte: toDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: { date: '$dateAdded', timezone: 'America/Argentina/Buenos_Aires' } },
          month: { $month: { date: '$dateAdded', timezone: 'America/Argentina/Buenos_Aires' } },
          day: { $dayOfMonth: { date: '$dateAdded', timezone: 'America/Argentina/Buenos_Aires' } }
        },
        totalClients: { $sum: 1 } // Suma 1 por cada cliente
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ])
}

exports.getWorkOrdersByStatus = async function (fromDate, toDate) {
  return await WorkOrder.aggregate([
    {
      $match: {
        dateCreated: { $gte: fromDate, $lte: toDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])
}
