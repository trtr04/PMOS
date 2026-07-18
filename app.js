import { createClient } from '@supabase/supabase-js';

const STORE = 'pmos-forum-v1';
const DEVICE_KEY = 'pmos-anonymous-device-key';
const deviceKey = localStorage.getItem(DEVICE_KEY) || crypto.randomUUID();
localStorage.setItem(DEVICE_KEY, deviceKey);
const supabaseConfig = window.SUPABASE_CONFIG || (import.meta.env.VITE_SUPABASE_URL ? { url: import.meta.env.VITE_SUPABASE_URL, publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } : null);
const supabase = supabaseConfig?.url ? createClient(supabaseConfig.url, supabaseConfig.publishableKey) : null;
let supabaseLoaded = !supabase;
let anonymousUser = null;
async function ensureAnonymousUser() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}
async function hydrateSupabase() {
  if (!supabase || supabaseLoaded) return;
  try {
    anonymousUser = await ensureAnonymousUser();
    const [postResult, commentResult, likeResult] = await Promise.all([
      supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('comments').select('*').order('created_at', { ascending: true }),
      supabase.from('likes').select('post_id,user_id')
    ]);
    if (postResult.error || commentResult.error || likeResult.error) throw postResult.error || commentResult.error || likeResult.error;
    const commentsByPost = commentResult.data.reduce((groups, comment) => { (groups[comment.post_id] ||= []).push(comment); return groups; }, {});
    const likesByPost = likeResult.data.reduce((groups, like) => { (groups[like.post_id] ||= []).push(like.user_id); return groups; }, {});
    const s = state();
    s.posts = postResult.data.map(post => ({ id: post.id, authorId: post.author_id, author: post.author_name, title: post.title, content: post.content, tag: post.tag, imageUrls: post.image_urls || [], likeCount: (likesByPost[post.id] || []).length, commentCount: (commentsByPost[post.id] || []).length, likedBy: likesByPost[post.id] || [], createdAt: new Date(post.created_at).getTime(), comments: (commentsByPost[post.id] || []).map(c => ({ id:c.id, author:c.author_name, content:c.content, createdAt:new Date(c.created_at).getTime() })) }));
    save(s); supabaseLoaded = true; render();
  } catch (error) { toast(`无法连接 Supabase：${error.message}`); }
}
const tags = ['全部', '饮食交流', '运动打卡', '经期与情绪', '备孕/调理', '吐槽树洞', '其他'];
let pendingImages = [];

const seed = {
  currentUser: null,
  posts: [
    { id:'p1', authorId:'u-lin', author:'小林', title:'断签三天后，重新开始也没有关系吧？', content:'这周工作特别忙，运动和记录都停了。今天只散步了二十分钟，想把它当成重新开始的第一天。', tag:'运动打卡', imageUrls:[], likeCount:12, commentCount:2, likedBy:[], createdAt:Date.now()-1000*60*48, comments:[{id:'c1',author:'阿圆',content:'当然！二十分钟已经是很温柔的开始了。',createdAt:Date.now()-1000*60*35},{id:'c2',author:'小鹿',content:'欢迎回来，记录不是考试。',createdAt:Date.now()-1000*60*20}] },
    { id:'p2', authorId:'u-xu', author:'小许', title:'大家早餐会怎么搭配？', content:'最近想尝试更稳定地吃早餐，但不想给自己太多压力。有没有简单、好准备的组合？', tag:'饮食交流', imageUrls:[], likeCount:8, commentCount:0, likedBy:[], createdAt:Date.now()-1000*60*60*5, comments:[] }
  ]
};
function state(){ try { return JSON.parse(localStorage.getItem(STORE)) || structuredClone(seed); } catch { return structuredClone(seed); } }
function save(s){ localStorage.setItem(STORE, JSON.stringify(s)); }
function escapeHtml(v){ const d=document.createElement('div'); d.textContent=v; return d.innerHTML; }
function timeAgo(t){ const m=Math.max(1,Math.floor((Date.now()-t)/60000)); return m<60?`${m} 分钟前`:m<1440?`${Math.floor(m/60)} 小时前`:`${Math.floor(m/1440)} 天前`; }
function toast(msg){ const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1900); }
function currentId(){ return location.hash || '#feed'; }
function user(){ return { id: anonymousUser?.id || deviceKey, name: '匿名同伴' }; }
function nav(){ document.querySelector('#main-nav').innerHTML=`<button class="nav-btn ${currentId()==='#feed'?'active':''}" onclick="go('#feed')">社区</button><span class="meta">匿名体验</span>`; }
function go(hash){ location.hash=hash; render(); }
function postCard(p, detail=false){const u=user();const liked=!!u&&p.likedBy.includes(u.id);return `<article class="post"><div class="meta"><span class="avatar">${escapeHtml(p.author.slice(0,1))}</span><span>${escapeHtml(p.author)}</span><span>·</span><span>${timeAgo(p.createdAt)}</span><span class="pill">${escapeHtml(p.tag)}</span></div><h3><a href="#post/${p.id}">${escapeHtml(p.title)}</a></h3><div class="post-body">${escapeHtml(p.content)}</div>${p.imageUrls.length?`<div class="images">${p.imageUrls.map(src=>`<img src="${src}" alt="帖子图片">`).join('')}</div>`:''}<div class="actions"><button class="action ${liked?'liked':''}" onclick="likePost('${p.id}')">${liked?'♥ 已赞':'♡ 点赞'} ${p.likeCount}</button><button class="action" onclick="go('#post/${p.id}')">▢ 评论 ${p.commentCount}</button>${u?.id===p.authorId?`<button class="action danger" onclick="deletePost('${p.id}')">删除</button>`:''}</div></article>`;}
function feed(){const s=state();const query=new URLSearchParams(location.hash.split('?')[1]||'');const tag=query.get('tag')||'全部';const posts=s.posts.filter(p=>tag==='全部'||p.tag===tag).sort((a,b)=>b.createdAt-a.createdAt);const tagButtons=tags.map(t=>'<button class="tag '+(t===tag?'selected':'')+'" onclick="filterTag(\''+t+'\')">'+t+'</button>').join('');const postList=posts.length?posts.map(p=>postCard(p)).join(''):'<div class="empty"><div>🌷</div>这个标签还没有帖子，来写第一篇吧。</div>';return `<section class="hero"><h1>和懂你的人，慢慢来</h1><p>分享经验、提出困惑，也记录每一次温柔的坚持。</p></section><div class="feed-head"><h2>最新分享</h2><button class="btn primary small" onclick="newPost()">＋ 发布</button></div><div class="tag-row">${tagButtons}</div>${postList}`;}
function detail(id){const p=state().posts.find(x=>x.id===id);if(!p)return `<button class="back" onclick="go('#feed')">← 返回社区</button><div class="empty"><div>🌫</div>帖子不存在或已被删除。</div>`;const logged=user();return `<section class="detail"><button class="back" onclick="go('#feed')">← 返回社区</button>${postCard(p,true)}<h2 class="comments-title">评论 · ${p.commentCount}</h2>${p.comments.length?p.comments.map(c=>`<article class="comment"><div class="meta"><span class="avatar">${escapeHtml(c.author.slice(0,1))}</span><b>${escapeHtml(c.author)}</b><span>· ${timeAgo(c.createdAt)}</span></div><p>${escapeHtml(c.content)}</p></article>`).join(''):`<div class="notice">还没有评论。用一句友善的话，陪陪发帖的人吧。</div>`}${logged?`<form class="comment-form" onsubmit="addComment(event,'${p.id}')"><input class="input" name="content" maxlength="300" placeholder="写下你的回应…" required><button class="btn primary" type="submit">发送</button></form>`:`<div class="notice" style="margin-top:16px">登录后可以参与评论。 <button class="back" onclick="login()">登录体验</button></div>`}</section>`;}
function create(){if(!user())return login();pendingImages=[];return `<section class="form-card"><button class="back" onclick="go('#feed')">← 返回社区</button><h1>发布一篇帖子</h1><form onsubmit="submitPost(event)"><label class="field">标题 <span class="hint">必填，最多 50 字</span></label><input class="input" name="title" maxlength="50" required placeholder="写一个清楚、友善的标题"><label class="field">内容 <span class="hint">必填，最多 2,000 字</span></label><textarea name="content" maxlength="2000" required placeholder="分享你的经验或提出问题…"></textarea><label class="field">分类</label><select name="tag">${tags.slice(1).map(t=>`<option>${t}</option>`).join('')}</select><label class="field">图片 <span class="hint">可选，最多 9 张</span></label><label class="upload">＋ 选择图片<input type="file" accept="image/*" multiple hidden onchange="selectImages(event)"></label><div id="preview" class="images preview"></div><div class="form-actions"><button class="btn" type="button" onclick="go('#feed')">取消</button><button class="btn primary" type="submit">发布</button></div></form></section>`;}
function render(){ nav();const h=currentId();let html;if(h.startsWith('#post/'))html=detail(h.split('/')[1]);else if(h==='#create')html=create();else html=feed();document.querySelector('#app').innerHTML=html; }
function login(){toast('当前为匿名体验模式，无需登录');}
function logout(){toast('当前为匿名体验模式');}
function newPost(){go('#create');}
function filterTag(t){go(t==='全部'?'#feed':`#feed?tag=${encodeURIComponent(t)}`);}
async function likePost(id){const s=state(),p=s.posts.find(x=>x.id===id);if(supabase){const { error }=await supabase.from('likes').insert({post_id:id,user_id:anonymousUser.id});if(error){toast(error.code==='23505'?'你已经点过赞了':error.message);return;}supabaseLoaded=false;await hydrateSupabase();return;}if(p.likedBy.includes(deviceKey))return toast('你已经点过赞了');p.likedBy.push(deviceKey);p.likeCount++;save(s);render();}
async function addComment(e,id){e.preventDefault();const content=e.target.content.value.trim();if(!content)return;if(supabase){const {error}=await supabase.from('comments').insert({post_id:id,author_id:anonymousUser.id,author_name:'匿名同伴',content});if(error){toast(error.message);return;}e.target.reset();supabaseLoaded=false;await hydrateSupabase();toast('评论已发布');return;}const s=state(),p=s.posts.find(x=>x.id===id);p.comments.push({id:crypto.randomUUID(),author:'匿名同伴',content,createdAt:Date.now()});p.commentCount++;save(s);e.target.reset();render();toast('评论已发布');}
async function deletePost(id){if(!confirm('确定删除这篇帖子吗？此操作无法撤销。'))return;if(supabase){const {error}=await supabase.from('posts').delete().eq('id',id);if(error){toast(error.message);return;}supabaseLoaded=false;await hydrateSupabase();go('#feed');toast('帖子已删除');return;}const s=state();s.posts=s.posts.filter(p=>p.id!==id);save(s);toast('帖子已删除');go('#feed');}
async function selectImages(e){const files=[...e.target.files];if(pendingImages.length+files.length>9){toast('最多只能上传 9 张图片');return;}pendingImages.push(...await Promise.all(files.map(f=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f);}))));drawPreview();e.target.value='';}
function drawPreview(){const box=document.querySelector('#preview');if(box)box.innerHTML=pendingImages.map((src,i)=>`<span class="preview-item"><img src="${src}" alt="待上传图片 ${i+1}"><button type="button" class="remove-image" onclick="removeImage(${i})">×</button></span>`).join('');}
function removeImage(i){pendingImages.splice(i,1);drawPreview();}
async function submitPost(e){e.preventDefault();const fd=new FormData(e.target),title=fd.get('title').trim(),content=fd.get('content').trim();if(!title||!content)return toast('请填写标题和内容');if(supabase){try{const imageUrls=[];for(const dataUrl of pendingImages){const blob=await (await fetch(dataUrl)).blob();const path=`${anonymousUser.id}/${crypto.randomUUID()}.${blob.type.split('/')[1]||'jpg'}`;const {error:uploadError}=await supabase.storage.from('forum-images').upload(path,blob,{contentType:blob.type});if(uploadError)throw uploadError;imageUrls.push(supabase.storage.from('forum-images').getPublicUrl(path).data.publicUrl);}const {error}=await supabase.from('posts').insert({author_id:anonymousUser.id,author_name:'匿名同伴',title,content,tag:fd.get('tag'),image_urls:imageUrls});if(error)throw error;supabaseLoaded=false;await hydrateSupabase();toast('发布成功');go('#feed')}catch(err){toast(err.message)}return;}const s=state();s.posts.push({id:crypto.randomUUID(),authorId:deviceKey,author:'匿名同伴',title,content,tag:fd.get('tag'),imageUrls:pendingImages,likeCount:0,commentCount:0,likedBy:[],createdAt:Date.now(),comments:[]});save(s);toast('发布成功');go('#feed');}
// The markup deliberately uses small inline handlers. ES modules keep declarations
// private, so expose only those handlers that the rendered HTML invokes.
Object.assign(window, {
  go, login, logout, newPost, filterTag, likePost, addComment, deletePost,
  selectImages, removeImage, submitPost
});
window.addEventListener('hashchange',render);render();hydrateSupabase();
