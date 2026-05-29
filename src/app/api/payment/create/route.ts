import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { connectDB } from "@/lib/db";
import { User, Order, OrderPlan } from "@/lib/models";
import { getUserSession } from "@/lib/userAuth";

const PLANS: Record<OrderPlan, { name: string; amount: number }> = {
  monthly:  { name: "BrandLab 月度会员", amount: 29 },
  yearly:   { name: "BrandLab 年度会员", amount: 199 },
  lifetime: { name: "BrandLab 终身会员", amount: 399 },
};

function xunhuSign(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort();
  const str = sorted.map((k) => `${k}=${params[k]}`).join("&") + `&appsecret=${secret}`;
  return createHash("md5").update(str).digest("hex").toUpperCase();
}

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session)
    return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { plan } = await req.json() as { plan: OrderPlan };
  if (!PLANS[plan])
    return NextResponse.json({ error: "无效套餐" }, { status: 400 });

  const appid = process.env.XUNHU_APPID;
  const appsecret = process.env.XUNHU_APPSECRET;
  if (!appid || !appsecret)
    return NextResponse.json({ error: "支付配置未设置" }, { status: 500 });

  await connectDB();

  const user = await User.findById(session.userId).lean();
  if (!user)
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  const outTradeNo = `BL${Date.now()}${randomBytes(4).toString("hex").toUpperCase()}`;
  const planInfo = PLANS[plan];

  await Order.create({
    outTradeNo,
    userId: user._id,
    email: user.email,
    plan,
    amount: planInfo.amount,
    status: "pending",
  });

  const nonceStr = randomBytes(16).toString("hex");
  const time = Math.floor(Date.now() / 1000).toString();
  const host = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brandlab.ink";

  const reqParams: Record<string, string> = {
    appid,
    nonce_str: nonceStr,
    body: planInfo.name,
    out_trade_no: outTradeNo,
    total_fee: planInfo.amount.toFixed(2),
    time,
    notify_url: `${host}/api/payment/notify`,
    return_url: `${host}/account`,
  };
  reqParams.sign = xunhuSign(reqParams, appsecret);

  const xunhuRes = await fetch("https://api.xunhupay.com/payment/do.html", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqParams),
  });
  const xunhuData = await xunhuRes.json() as { errcode: number; errmsg: string; url?: string };

  if (xunhuData.errcode !== 0 || !xunhuData.url) {
    await Order.findOneAndUpdate({ outTradeNo }, { status: "failed" });
    return NextResponse.json({ error: xunhuData.errmsg || "创建支付订单失败" }, { status: 502 });
  }

  return NextResponse.json({ payUrl: xunhuData.url });
}
