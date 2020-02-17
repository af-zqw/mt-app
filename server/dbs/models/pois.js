import mongoose from 'mongoose'
const Schema = mongoose.Schema
const PoisSchema = new Schema({
  name: String,
  province: String,
  city: String,
  county: String,
  areaCode: Number,
  tel: String,
  area: String,
  add: String,
  type: String,
  module: String,
  longtide: Number,
  latitude: Number
})

export default mongoose.model('Pois', PoisSchema)