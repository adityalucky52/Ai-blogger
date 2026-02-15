import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  color: string;
  description?: string;
  blogs: number; // Virtual for count
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    color: {
      type: String,
      default: "#000000",
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for blog count - this is tricky because Blog.category is a string.
// We might need to do an aggregation or just a manual count in the controller.
// For now, let's keep it simple and handle the count in the controller.

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
