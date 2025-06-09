const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  location: { type: String, default: '' },
  activities: { type: String, default: '' } // Virgülle ayrılmış etkinlikler metin olarak
});

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  destination: { type: String, default: '' },
  accommodation: { type: String, default: '' }, // Otel adı
  transport: { type: String, default: '' },     // Ulaşım aracı
  startDate: { type: Date },
  endDate: { type: Date },
  notes: { type: String, default: '' },
  stops: [stopSchema]
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
