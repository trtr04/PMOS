PMOS（原称 PCOS，多囊卵巢综合征）是⼀种常⻅且成因复杂的内分泌与代谢健康状况。它受到睡眠、饮⻝、运动、压⼒、情绪与⽣活节律等多种因素影响，导致患者出现⽉经不调、容易疲惫、痤疮等情况。

Suta 希望成为⼀个轻量、可持续的健康陪伴空间，帮助 PMOS ⽤户记录⽣活变化、建⽴健康习惯，并逐渐了解⾃⼰的身体节律，在稳定的⽇常中绽放属于⾃⼰的最佳状态。通过简单易⽤的记录⽅式和更具针对性的同伴社群，Suta 让外貌与健康管理不再是⼀项负
担，⽽是⼀段可以慢慢享受、持续疗愈的「好看时间」。产品核⼼功能包括个⼈打卡、组队打卡、同伴论坛、健康科普、成⻓系统、洞察报告与健
康⽇历。⽤户可以记录⽉经周期、情绪、睡眠、饮⻝、运动及身体变化等指标，并通过⻓期数据回顾⾃⼰的状态与节律。

Suta 的 IP 是⼀只名叫 「团团」 的狐獴。⽤户完成每⽇打卡后可获得成⻓奖励，⽤于解锁团团的装扮与陪伴内容。我们也正在探索如何让团团更⾃然地融⼊每⼀个界⾯，陪伴⽤户成⻓、健康⽣活。

设计：本项⽬以PMOS⼥性情绪关怀为主题，使⽤Figma完成App UI界⾯设计，并运⽤Adobe Illustrator进⾏IP形象设计。界⾯围绕情绪记录、周期提醒与情绪陪伴等功能展开，整体采⽤暖⾊与渐变相结合的视觉⻛格，营造温柔、治愈且具有安全感的使⽤氛围。布局以圆⻆卡⽚、柔和图标和简洁排版为主，提升界⾯的亲和⼒与操作体验。IP形象延续UI的⾊彩体系，采⽤圆润造型与丰富表情，强化陪伴感和品牌识别度，并可应⽤于引导⻚、提示弹窗、情绪打卡及周边延展中。

⽹⻚部署：Vercel
数据库：Supabase

# PMOS Forum MVP

A runnable, dependency-free browser prototype for the PMOS experience-sharing forum.

## Run it

From this folder, run:

```bash
python3 -m http.server 5173
```

Then visit [http://localhost:5173](http://localhost:5173) in a browser.

## Included behaviour

- Browse newest posts and filter by category
- Guest read-only mode
- Demo login for creating posts, commenting, and liking
- Title/content validation and up to nine local image attachments
- One like per logged-in user
- One-level comments only
- Author-only post deletion
- Local browser persistence using `localStorage`

## Production handoff

The live version uses Supabase anonymous authentication, PostgreSQL, and Storage. Run [supabase/schema.sql](supabase/schema.sql) in a new Supabase project, then follow [DEPLOYMENT.md](DEPLOYMENT.md) to connect the repository to Vercel.
