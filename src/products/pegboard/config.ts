import type { ProductDefinition } from '../../types/configurator';

export const pegboardProduct: ProductDefinition = {
  id: 'pegboard', name: '미니 타공판', description: '제품 설정만 추가해도 같은 에디터를 사용할 수 있어요.',
  colors: ['pink', 'yellow', 'cyan', 'mint', 'brown', 'lavender', 'white'],
  parts: [
    { id: 'board', label: '보드', meshNames: ['Board'], defaultColor: 'white' },
    { id: 'ring', label: '홀 링', meshNames: ['HoleRing'], defaultColor: 'lavender' },
    { id: 'decoration', label: '장식', meshNames: ['Decoration'], defaultColor: 'pink' },
  ],
  models: [{ id: 'standard', label: '스탠다드', path: '/models/pegboard/standard.glb' }],
};
