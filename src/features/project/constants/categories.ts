export const categories = [
  { id: 'ALL', name: '전체' },
  { id: 'VIDEO', name: '영상/사진/음향' },
  { id: 'WRITE', name: '문서/글쓰기' },
  { id: 'IT', name: 'IT/프로그래밍' },
  { id: 'MARKETING', name: '마케팅' },
  { id: 'HOBBY', name: '취미 레슨' },
  { id: 'TAX', name: '세무/법무/노무' },
  { id: 'STARTUP', name: '창업/사업' },
  { id: 'TRANSLATE', name: '번역/통역' },
] as const;

export const categoryGroups = [
  {
    groupId: 'client',
    groupName: '클라이언트',
    categories,
  },
  {
    groupId: 'freelancer',
    groupName: '프리랜서',
    categories,
  },
];

export type CategoryId = (typeof categories)[number]['id'];
