import mongoose from 'mongoose';

const recipeCoursesTagsSchema = mongoose.Schema(
  {
    recipe:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe'
    },
    name:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

const RecipeCoursesTags = mongoose.model('RecipeCoursesTags',recipeCoursesTagsSchema)

export default RecipeCoursesTags