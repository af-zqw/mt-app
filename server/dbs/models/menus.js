import mongoose from 'mongoose'
const Schema = mongoose.Schema
const MenusSchema = new Schema({
  menus: Array
})

export default mongoose.model('Menus', MenusSchema)