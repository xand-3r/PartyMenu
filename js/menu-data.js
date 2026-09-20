/** @typedef {{ id: string; title: string; description: string; icon?: string; image?: string; imageDetail?: string }} MenuOption */

/** @type {MenuOption[]} */
export const SALADS = [
  {
    id: "seafood",
    title: "Морской",
    description:
      "Обжаренные морепродукты в белом вине с микс салатом, томатами черри и салатной заправкой",
    image: "assets/images/salads/Морской.png",
  },
  {
    id: "duck",
    title: "Салат с уткой",
    description: "Салат с уткой, домашним сыром, вишней, орехами, смородиной и соусом манго-маракуйя",
    image: "assets/images/salads/Салат с уткой.png",
  },
  {
    id: "salmon",
    title: "Салат с лососем",
    description:
      "Филе лосося с домашним сыром, огурцом, томатами черри и конкассе из апельсинов с заправкой на основе сладкого чили и устричного соуса",
    image: "assets/images/salads/Салат с лососем.png",
  },
  {
    id: "tongue-horseradish",
    title: "Салат с языком и хреном",
    description: "Листья салата, язык, ростбиф, хрен, соус тар-тар, маринованный огурец, икра",
    image: "assets/images/salads/Салат с языком и хреном.png",
  },
];

/** @type {MenuOption[]} */
export const MAINS = [
  {
    id: "carbonara",
    title: "Паста карбонара",
    description: "Спагетти с копченой грудинкой, сыром пармезан и яичным желтком",
    image: "assets/images/mains/Паста карбонара.png",
  },
  {
    id: "salmon-wild-rice",
    title: "Лосось с диким рисом",
    description: "Лосось с диким рисом, муссом пармезан и соевыми бобами эдамаме",
    image: "assets/images/mains/Лосось с диким рисом.png",
  },
  {
    id: "beef-medallions",
    title: "Медальоны из говядины",
    description: "Говяжья вырезка, масло с пряными травами, подается с картофелем фри и сырным соусом",
    image: "assets/images/mains/Медальоны из говядины.png",
  },
  {
    id: "pork-medallions",
    title: "Медальоны из свинины",
    description: "Свиная вырезка с грибным соусом и фундуком, подается с пюре",
    image: "assets/images/mains/Медальоны из свинины.png",
  },
  {
    id: "schnitzel-caesar",
    title: "Шницель с цезарем",
    description: "Шницель из куриного бедра, салат, черри, соус цезарь, пармезан",
    image: "assets/images/mains/Шницель с цезарем.png",
  },
];

/** @type {MenuOption[]} */
export const DRINKS = [
  {
    id: "vodka-syabry",
    title: "Водка",
    description: "Сябры (Беларусь)",
    image: "assets/images/drinks/водка.webp",
  },
  {
    id: "wine-riesling",
    title: "Вино белое",
    description: "Riesling (полусухое)",
    image: "assets/images/drinks/вино-белое.webp",
  },
  {
    id: "non-alcoholic",
    title: "Без алкоголя",
    description: "Безалкогольные напитки",
    image: "assets/images/drinks/non-alcoholic-thumb.png",
    imageDetail: "assets/images/drinks/non-alcoholic-detail.png",
  },
];

export const FORM_STEPS = [
  { key: "salad", heading: "Выберите салат", options: SALADS },
  { key: "main", heading: "Выберите горячее", options: MAINS },
  { key: "drink", heading: "Выберите напиток", options: DRINKS },
  { key: "name", heading: "Введите имя", options: null },
];
