import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ensureAnonymousSession, supabase } from "@/lib/supabase";
import { Heart, MessageCircleHeart, PenLine, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const tags = ["饮食交流", "运动打卡", "经期与情绪", "备孕/调理", "吐槽树洞", "其他"] as const;
type Tag = (typeof tags)[number];
type Post = { id: string; author_id: string; author_name: string; title: string; content: string; tag: Tag; created_at: string; comments: { id: string; author_name: string; content: string; created_at: string }[]; likes: { user_id: string }[] };
const ago = (date: string) => { const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000)); return minutes < 60 ? `${minutes} 分钟前` : minutes < 1440 ? `${Math.floor(minutes / 60)} 小时前` : `${Math.floor(minutes / 1440)} 天前`; };

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [tag, setTag] = useState<Tag>("饮食交流");
  const [replyingTo, setReplyingTo] = useState<string | null>(null); const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const user = await ensureAnonymousSession(); setUserId(user.id);
      const { data, error } = await supabase.from("posts").select("id,author_id,author_name,title,content,tag,created_at,comments(id,author_name,content,created_at),likes(user_id)").order("created_at", { ascending: false }).limit(50);
      if (error) throw error; setPosts((data ?? []) as Post[]);
    } catch (error) { toast.error("论坛暂时无法加载", { description: error instanceof Error ? error.message : "请检查 Supabase 匿名登录是否开启" }); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const publish = async () => {
    if (!title.trim() || !content.trim()) { toast.error("请填写标题和内容"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("posts").insert({ author_id: userId, author_name: "匿名同伴", title: title.trim(), content: content.trim(), tag });
    setSubmitting(false);
    if (error) { toast.error("发布失败", { description: error.message }); return; }
    setTitle(""); setContent(""); toast.success("帖子已发布"); void load();
  };
  const like = async (postId: string) => {
    const { error } = await supabase.from("likes").insert({ post_id: postId, user_id: userId });
    if (error) { toast.message(error.code === "23505" ? "你已经点过赞了" : "点赞失败"); return; } void load();
  };
  const remove = async (postId: string) => {
    if (!confirm("确定删除这篇帖子吗？此操作无法撤销。")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) { toast.error("删除失败", { description: error.message }); return; } toast.success("帖子已删除"); void load();
  };
  const comment = async (postId: string) => {
    if (!reply.trim() || !userId) return;
    const { error } = await supabase.from("comments").insert({ post_id: postId, author_id: userId, author_name: "匿名同伴", content: reply.trim() });
    if (error) { toast.error("评论失败", { description: error.message }); return; }
    setReply(""); setReplyingTo(null); toast.success("评论已发布"); void load();
  };

  return <DashboardLayout><div className="mx-auto max-w-5xl space-y-6 pb-8"><header><p className="warm-kicker">FORUM · KIND CONVERSATIONS</p><h1 className="warm-title mt-1 text-3xl sm:text-4xl">在这里，被好好听见</h1><p className="mt-2 text-sm leading-6 text-[#9b746e]">分享经验、提出困惑，也为彼此留下一点不被催促的支持。</p></header>
    <section className="rounded-[1.75rem] border border-[#f6dfd9] bg-[#fff8f5] p-6"><div className="flex items-center gap-2 text-[#d2736b]"><ShieldCheck className="h-5 w-5" /><h2 className="font-serif text-xl">温柔社区公约</h2></div><p className="mt-3 text-sm leading-6 text-[#947069]">尊重差异、保护隐私、不提供诊疗建议。紧急或医疗问题，请及时联系专业人员。</p></section>
    <section className="warm-surface rounded-[1.75rem] p-6"><div className="flex items-center gap-2"><PenLine className="h-5 w-5 text-[#d46c66]" /><h2 className="warm-title text-2xl">写下想说的话</h2></div><div className="mt-5 grid gap-3"><Input value={title} onChange={e => setTitle(e.target.value)} maxLength={50} placeholder="给这篇分享一个标题" className="h-12 rounded-xl border-[#f0d8d1]" /><Textarea value={content} onChange={e => setContent(e.target.value)} maxLength={2000} placeholder="分享你的经验或提出问题……" className="min-h-28 rounded-xl border-[#f0d8d1]" /><div className="flex flex-wrap items-center justify-between gap-3"><select value={tag} onChange={e => setTag(e.target.value as Tag)} className="rounded-xl border border-[#f0d8d1] bg-white px-3 py-2 text-sm text-[#76514d]">{tags.map(value => <option key={value}>{value}</option>)}</select><Button onClick={() => void publish()} disabled={submitting || !userId} className="rounded-full warm-gradient"><MessageCircleHeart className="mr-1.5 h-4 w-4" />发布</Button></div></div></section>
    <section className="space-y-3">{loading ? <p className="py-10 text-center text-sm text-[#9b746e]">正在加载真实社区内容……</p> : posts.length === 0 ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-[#9b746e]">还没有帖子。写下第一句温柔的话吧。</p> : posts.map(post => <article key={post.id} className="rounded-[1.5rem] border border-white bg-white/90 p-5 shadow-[0_10px_28px_rgba(190,96,89,0.06)]"><div className="flex flex-wrap items-center gap-2 text-xs text-[#a27c75]"><span className="rounded-full bg-[#fff0eb] px-2.5 py-1 text-[#d46c66]">{post.tag}</span><span>{post.author_name}</span><span>·</span><span>{ago(post.created_at)}</span></div><h2 className="mt-3 text-lg font-semibold text-[#754b47]">{post.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#805b56]">{post.content}</p><div className="mt-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => void like(post.id)} className="rounded-full text-[#b07773]"><Heart className="mr-1 h-4 w-4" />点赞 {post.likes.length}</Button><Button variant="ghost" size="sm" onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReply(""); }} className="rounded-full text-[#b07773]">评论 {post.comments.length}</Button>{post.author_id === userId ? <Button variant="ghost" size="sm" onClick={() => void remove(post.id)} className="ml-auto rounded-full text-[#c85f60]"><Trash2 className="mr-1 h-4 w-4" />删除</Button> : null}</div>{post.comments.length ? <div className="mt-4 space-y-2 border-t border-[#f6e4df] pt-3">{post.comments.map(comment => <div key={comment.id} className="rounded-xl bg-[#fff8f5] px-3 py-2 text-sm"><span className="font-medium text-[#a96963]">{comment.author_name}</span><span className="ml-2 text-[#815c56]">{comment.content}</span></div>)}</div> : null}{replyingTo === post.id ? <div className="mt-4 flex gap-2"><Input value={reply} onChange={event => setReply(event.target.value)} maxLength={300} placeholder="留下温柔的回应…" className="rounded-xl border-[#f0d8d1]" /><Button onClick={() => void comment(post.id)} disabled={!reply.trim()} className="rounded-xl warm-gradient">发送</Button></div> : null}</article>)}</section>
  </div></DashboardLayout>;
}
