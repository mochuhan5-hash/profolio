export type ProjectSection = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  summary: string;
  overview: string;
  cover: {
    label: string;
    image: string;
    accent: string;
  };
  details: ProjectSection[];
  gallery: {
    title: string;
    description: string;
    image: string;
  }[];
};

export const projects: Project[] = [
  {
    slug: "coastal-archive",
    title: "海岸档案馆",
    subtitle: "以地景叙事重构海边公共文化体验",
    year: "2026",
    category: "空间 / 展陈",
    summary:
      "一个将展览、阅读与临海漫步结合的公共空间提案，强调路径、风与材料的节奏感。",
    overview:
      "项目以海岸线的移动体验为线索，将建筑空间拆解为一系列缓慢展开的观看场景。首层开放给城市，二层承载档案与阅读，屋顶作为面向海风的公共平台。",
    cover: {
      label: "Archive",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      accent: "#d7d0c4",
    },
    details: [
      {
        title: "项目背景",
        body: "场地位于海岸缓坡与城市道路交界处，周边缺少能够承载慢节奏停留的公共文化空间。设计希望把海边的观看经验转译为空间序列。",
      },
      {
        title: "我的角色",
        body: "负责概念生成、空间叙事、流线组织与最终视觉表达，重点关注从封闭展厅到开放平台的体验递进。",
      },
      {
        title: "设计策略",
        body: "以‘压缩—释放’的方式组织空间：入口尺度低且内向，随后逐步打开视野，最终将视线引向海面与天空。",
      },
    ],
    gallery: [
      {
        title: "总平与场地关系",
        description: "建筑沿地势展开，保留通往海边的公共步行界面。",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "展厅内部氛围",
        description: "通过低饱和材料与可控天光塑造静态阅读体验。",
        image:
          "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "屋顶平台",
        description: "屋顶作为公共观景平台，与风景形成最直接的连接。",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    slug: "urban-field",
    title: "城市留白实验",
    subtitle: "在高密度街区中嵌入可停留的轻型景观系统",
    year: "2025",
    category: "城市 / 景观",
    summary:
      "通过模块化介入为街角与狭长边角地带建立新的停留方式，让日常路径中出现更多非目的性的停顿。",
    overview:
      "项目聚焦高密度街区中的被忽略空间，提出一套轻介入、可复制、可替换的景观单元。系统由座椅、遮阴、灯光和种植构成，可适应不同街角尺度。",
    cover: {
      label: "Field",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
      accent: "#d9d9d1",
    },
    details: [
      {
        title: "问题识别",
        body: "很多城市缝隙空间虽具备停留潜力，但因缺乏基础设施与识别度而长期被忽视。",
      },
      {
        title: "方法",
        body: "从街道日常行为出发，将停留动作拆解为靠、坐、看、穿行四种状态，并转化为可组合的场景单元。",
      },
      {
        title: "结果",
        body: "方案以最低限度的结构介入提升了空间辨识度，也为社区活动提供了更柔性的发生条件。",
      },
    ],
    gallery: [
      {
        title: "街角样机",
        description: "小尺度单元通过遮阴和坐凳增强停留性。",
        image:
          "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "夜间使用场景",
        description: "低照度灯光让空间在晚间依旧具备可达性与安全感。",
        image:
          "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    slug: "museum-atlas",
    title: "博物馆地形图",
    subtitle: "以连续坡道组织观看与学习的叙事线路",
    year: "2024",
    category: "建筑 / 文化",
    summary:
      "一个强调步行节奏的博物馆方案，把展览动线转化为地形般连续起伏的空间体验。",
    overview:
      "设计把传统楼层关系弱化为一条连续的坡道系统，参观者在上升过程中不断穿过不同尺度的展厅、中庭与休息平台。",
    cover: {
      label: "Museum",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      accent: "#e2ddd5",
    },
    details: [
      {
        title: "概念",
        body: "将地形的‘缓坡’转译为展览路径，让观看不再是离散房间的切换，而是一段连续发生的过程。",
      },
      {
        title: "结构与空间",
        body: "通过少量大跨度结构释放出完整的坡道空间，使不同展厅之间保持视觉联系。",
      },
      {
        title: "表达重点",
        body: "模型和版面均围绕‘连续性’展开，强调人在空间中移动时感知到的层层展开。",
      },
    ],
    gallery: [
      {
        title: "连续坡道剖面",
        description: "剖面展示不同标高平台如何串联为完整参观路径。",
        image:
          "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "中庭光线",
        description: "顶部引光强化行进过程中的方向感。",
        image:
          "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "展陈停留节点",
        description: "在连续动线中插入若干停留节点，形成节奏变化。",
        image:
          "https://images.unsplash.com/photo-1529429617124-aee711a5ac1c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    slug: "garden-dialogue",
    title: "庭院对话",
    subtitle: "把植物、路径与停留界面编织成一段缓慢体验",
    year: "2023",
    category: "景观 / 叙事",
    summary:
      "通过层层递进的庭院空间，构建从街道噪音到安静内部的情绪过渡。",
    overview:
      "项目关注日常尺度下的身体感知，以植物层次、光影边界与坐凳布局建立一种柔和而可停留的公共气氛。",
    cover: {
      label: "Garden",
      image:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
      accent: "#d6ded0",
    },
    details: [
      {
        title: "设计目标",
        body: "在有限尺度内建立清晰又不生硬的空间层次，使人从经过转变为停留。",
      },
      {
        title: "材料语言",
        body: "以石材、浅色混凝土与低矮种植形成安静基底，让植物成为季节变化的主要表达。",
      },
      {
        title: "体验结果",
        body: "最终空间更像一段被放慢的路径，让短暂停留也能拥有明确的氛围感。",
      },
    ],
    gallery: [
      {
        title: "入口庭院",
        description: "植物和矮墙共同塑造进入时的收束感。",
        image:
          "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "停留节点",
        description: "通过坐凳与树荫形成安静的阅读与交谈区域。",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
