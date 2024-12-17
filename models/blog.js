const {Schema, mongoose} = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required:true,
        },
        body:{
            type: String,
            required: true,
        },
        coverImageURL:{
            data: Buffer,
            contentType: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref:"user",
        },
    },
    {timestamps: true }
)
// const Blog = model('blog', blogSchema);
// model.exports = Blog;
module.exports = mongoose.model("Blog", blogSchema);