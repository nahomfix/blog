const { Schema, model } = require('mongoose');
const dompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const htmlPurify = dompurify(new JSDOM().window);
const stripHTML = require('string-strip-html');

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    snippet: {
      type: String,
    },
  },
  { timestamps: true }
);

ArticleSchema.pre('validate', function (next) {
  if (this.body) {
    this.body = htmlPurify.sanitize(this.body);
    this.snippet = stripHTML(this.body.substring(0, 200));
  }

  next();
});

module.exports = model('Article', ArticleSchema);
