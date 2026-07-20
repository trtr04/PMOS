import DashboardLayout from "@/components/DashboardLayout";
import { ArrowRight, BookOpen } from "lucide-react";

const articles = [
  ["pcos-to-pmos", "名称更新", "从 PCOS 到 PMOS：为什么疾病改名了？", "新名称把关注点从“卵巢囊肿”扩展到内分泌、代谢、生殖与全生命周期健康。", 5],
  ["understand-pmos", "基础认识", "认识 PMOS：它不只是月经或生育问题", "PMOS 的表现因人而异，可能涉及月经、雄激素、代谢、皮肤、生殖和情绪健康。", 6],
  ["diagnosis", "就医诊断", "PMOS 如何诊断？为什么不能只看一次超声", "诊断需要综合月经、雄激素和卵巢表现，并排除其他可能原因。", 6],
  ["lifestyle", "生活管理", "生活管理不等于减重：从可持续的小行动开始", "健康饮食、身体活动与行为支持对整体健康有益，即使体重没有变化，也可能带来价值。", 7],
  ["mental-health", "心理健康", "情绪与身体形象：这些困扰值得被认真对待", "焦虑、抑郁、身体形象和进食困扰在 PMOS 人群中更常见，寻求支持不是软弱。", 6],
  ["seek-care", "就医支持", "什么时候需要就医？把问题带到专业支持中", "持续的月经、皮肤、代谢、生育或心理困扰，都可以成为寻求医疗支持的理由。", 6],
] as const;

export default function EducationPage() {
  return <DashboardLayout><main className="mx-auto max-w-6xl space-y-7 pb-10"><header className="rounded-[2rem] warm-gradient px-7 py-10 text-white sm:px-10"><p className="text-xs font-semibold tracking-[0.18em] text-white/75">PMOS · HEALTH EDUCATION</p><h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">了解身体，从可靠的信息开始</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/90">这里不替你下诊断，而是帮助你更有准备地照顾自己、与专业人员沟通。</p></header><section><div className="mb-4 flex items-end justify-between"><div><p className="warm-kicker">LEARNING PATH</p><h2 className="warm-title mt-1 text-3xl">从这里开始了解 PMOS</h2></div><BookOpen className="h-7 w-7 text-[#d6736d]" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{articles.map(([id, tag, title, summary, minutes]) => <a key={id} href={`/education/#/article/${id}`} className="group rounded-[1.5rem] bg-white p-6 text-left shadow-[0_10px_28px_rgba(190,96,89,0.06)] transition hover:-translate-y-1"><span className="text-xs font-semibold text-[#d46d67]">{tag} · {minutes} 分钟</span><h3 className="warm-title mt-3 text-xl leading-snug">{title}</h3><p className="mt-3 text-sm leading-6 text-[#96716b]">{summary}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#c56561]">阅读全文 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></a>)}</div></section><p className="rounded-2xl border border-[#f1d7d0] bg-[#fff8f5] p-4 text-sm leading-6 text-[#8d6963]">医疗提醒：若症状突然、严重或让你感到不安全，请优先联系当地急救服务或医疗机构。</p></main></DashboardLayout>;
}
