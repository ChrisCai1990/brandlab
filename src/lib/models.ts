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
  wechatHtml: string;
  published: boolean;
  isPremium: boolean;
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
    wechatHtml: { type: String, default: "" },
    published: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
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

// ── User ──────────────────────────────────────────────────────────────────────

export type SubscriptionPlan = "free" | "monthly" | "yearly" | "lifetime";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email:             { type: String, required: true, unique: true, lowercase: true },
    passwordHash:      { type: String, required: true },
    subscriptionPlan:  { type: String, enum: ["free","monthly","yearly","lifetime"], default: "free" },
    subscriptionExpiry:{ type: Date, default: null },
  },
  { timestamps: true }
);

export const User: mongoose.Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

// ── Order ─────────────────────────────────────────────────────────────────────

export type OrderPlan = "monthly" | "yearly" | "lifetime";
export type OrderStatus = "pending" | "paid" | "failed";

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  outTradeNo: string;
  userId: mongoose.Types.ObjectId;
  email: string;
  plan: OrderPlan;
  amount: number;
  status: OrderStatus;
  xunhuTradeNo: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    outTradeNo:   { type: String, required: true, unique: true },
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email:        { type: String, required: true },
    plan:         { type: String, enum: ["monthly","yearly","lifetime"], required: true },
    amount:       { type: Number, required: true },
    status:       { type: String, enum: ["pending","paid","failed"], default: "pending" },
    xunhuTradeNo: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order: mongoose.Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);
