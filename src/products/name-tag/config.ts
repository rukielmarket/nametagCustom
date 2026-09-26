import type { FontDefinition, PartDefinition, ProductDefinition } from '../../types/configurator';

const fontSpecs = [
  ['korean1', '한글1', '가나다라마바사', 'korean', 'YJ-Obang', '/fonts/YJ_Obang_TTF.woff2'],
  ['korean2', '한글2', '가나다라마바사', 'korean', '빙그레체 Bold', '/fonts/Binggrae2-Bold.woff2'],
  ['korean3', '한글3', '가나다라마바사', 'korean', '케리스 케듀체', '/fonts/KERISKEDU.woff2'],
  ['korean4', '한글4', '가나다라마바사', 'korean', '롯데리아 챱체', '/fonts/chab.woff2'],
  ['english1', '영어1', 'ABCabc', 'english', 'Midnight', '/fonts/Midnight.woff2'],
  ['english2', '영어2', 'ABCabc', 'english', 'Bloopoly', '/fonts/Bloopoly.woff2'],
  ['english3', '영어3', 'ABCabc', 'english', 'Amorlate', '/fonts/Amorlate.woff2'],
  ['english4', '영어4', 'ABCabc', 'english', 'Upheaval', '/fonts/upheavtt.woff2'],
] as const;
export const nameTagFonts: FontDefinition[] = fontSpecs.map(([id, label, sample, category, family, fontUrl]) => ({ id, label, sample, category, family, previewFamily: id, fontUrl }));
export const nameTagParts: PartDefinition[] = [
  { id: 'letter', label: '글자', meshNames: ['letter'], defaultColor: 'pink' },
  { id: 'background', label: '바탕', meshNames: ['background'], defaultColor: 'white' },
  { id: 'icon', label: '아이콘', meshNames: ['icon'], defaultColor: 'cyan' },
];
export const nameTagProduct: ProductDefinition = {
  id: 'name-tag', name: '커스텀 네임택', description: '나만의 컬러 조합을 미리 확인해 보세요.',
  fonts: nameTagFonts, parts: nameTagParts, colors: ['pink', 'yellow', 'cyan', 'mint', 'brown', 'lavender', 'white'],
  models: nameTagFonts.map((font) => ({ id: font.id, label: font.label, fontId: font.id, path: `/models/name-tag/${font.id}.glb?v=2`, parts: nameTagParts })),
};
