import { createHash } from "crypto";
import { connectDB } from "@/lib/db";
import { User, Order } from "@/lib/models";

function xunhuSign(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort();
  const str = sorted.map((k) => `${k}=${params[k]}`).join("&") + `&appsecret=${secret}`;
  return createHash("md5").update(str).digest("hex").toUpperCase();
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export async function POST(req: Request) {
  const appsecret = process.env.XUNHU_APPSECRET;
  if (!appsecret) return new Response("config error", { status: 500 });

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }

  const { sign, ...rest } = data;
  const expectedSign = xunhuSign(rest, appsecret);
  if (sign !== expectedSign)
    return new Response("sign error", { status: 400 });

  await connectDB();

  const order = await Order.findOne({ outTradeNo: data.out_trade_no });
  if (!order) return new Response("success");
  if (order.status === "paid") return new Response("success");

  order.status = "paid";
  order.xunhuTradeNo = data.trade_no ?? "";
  await order.save();

  const user = await User.findById(order.userId);
  if (user) {
    const now = new Date();
    const base = user.subscriptionExpiry && user.subscriptionExpiry > now
      ? user.subscriptionExpiry
      : now;

    if (order.plan === "monthly") {
      user.subscriptionExpiry = addDays(base, 30);
      user.subscriptionPlan = "monthly";
    } else if (order.plan === "yearly") {
      user.subscriptionExpiry = addDays(base, 365);
      user.subscriptionPlan = "yearly";
    } else if (order.plan === "lifetime") {
      user.subscriptionExpiry = null;
      user.subscriptionPlan = "lifetime";
    }
    await user.save();
  }

  return new Response("success");
}
