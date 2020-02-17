import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ProvincesSchema = new Schema({
  id: String,
  value: String
})

export default mongoose.model('Provinces',ProvincesSchema)