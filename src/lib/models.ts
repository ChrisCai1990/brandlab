import mongoose from "mongoose";

// ── Article ──────────────────────────────────────────────────────────────────

export interface IArticle {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  tag: string;
  desc: string;
  date: Date;
  readTime: string;
  content: string;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new mongoose.Schema<IArticle>(
  {
    slug:      { type: String, required: true, unique: true },
    title:     { type: String, required: true },
    tag:       { type: String, required: true },
    desc:      { type: String, default: "" },
    date:      { type: Date,   required: true },
    readTime:  { type: String, default: "5" },
    content:   { type: String, default: "" },
    published: { type: Boolean, default: false },
    views:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Article: mongoose.Model<IArticle> =
  mongoose.models.Article ?? mongoose.model<IArticle>("Article", ArticleSchema);

// ── Setting ──────────────────────────────────────────────────────────────────

export interface ISetting {
  _id: mongoose.Types.ObjectId;
  key: string;
  value: string;
}

const SettingSchema = new mongoose.Schema<ISetting>(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export const Setting: mongoose.Model<ISetting> =
  mongoose.models.Setting ?? mongoose.model<ISetting>("Setting", SettingSchema);

// ── Subscriber ────────────────────────────────────────────────────────────────

export interface ISubscriber {
  _id: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
}

const SubscriberSchema = new mongoose.Schema<ISubscriber>(
  { email: { type: String, required: true, unique: true } },
  { timestamps: true }
);

export const Subscriber: mongoose.Model<ISubscriber> =
  mongoose.models.Subscriber ?? mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
