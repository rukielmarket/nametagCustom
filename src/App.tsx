import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { products } from './data/products';
import { colors } from './data/colors';
import type { CustomizationState, ProductDefinition } from './types/configurator';
import ProductPreview from './components/product-preview/ProductPreview';
import logo from './assets/logo.svg';

function initialState(product: ProductDefinition): CustomizationState {
  return { productId: product.id, modelId: product.models[0].id, fontId: product.fonts?.[0]?.id ?? '', selectedPartId: product.parts[0].id, partColors: Object.fromEntries(product.parts.map((part) => [part.id, part.defaultColor])) };
}

export default function App() {
  const [state, setState] = useState(() => initialState(products[0]));
  const [fontOpen, setFontOpen] = useState(false);
  const [previewBackground, setPreviewBackground] = useState<'white' | 'black'>('white');
  const [iconEnabled, setIconEnabled] = useState(true);
  const fontSectionRef = useRef<HTMLDivElement>(null);
  const product = products.find((item) => item.id === state.productId) ?? products[0];
  const model = product.models.find((item) => item.id === state.modelId) ?? product.models[0];
  const iconlessModelAvailable = product.id === 'name-tag' && product.fonts?.some((font) => font.id === state.fontId) === true;
  const previewModel = !iconEnabled && iconlessModelAvailable
    ? { ...model, path: `/models/name-tag/${state.fontId}-icon-x.glb?v=1`, parts: product.parts.filter((part) => part.id !== 'icon') }
    : model;
  const hideModelIcon = !iconEnabled && !iconlessModelAvailable;
  const visibleParts = product.parts.filter((part) => iconEnabled || part.id !== 'icon');
  const visibleColors = colors.filter((color) => product.colors.includes(color.id));
  const selectedFont = product.fonts?.find((font) => font.id === state.fontId);
  const colorLabel = useMemo(() => colors.find((color) => color.id === state.partColors[state.selectedPartId])?.name ?? '', [state]);

  useEffect(() => {
    if (!fontOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!fontSectionRef.current?.contains(event.target as Node)) setFontOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [fontOpen]);

  const selectFont = (fontId: string) => {
    const nextModel = product.models.find((item) => item.fontId === fontId) ?? product.models[0];
    setState((current) => ({ ...current, fontId, modelId: nextModel.id }));
    setFontOpen(false);
  };
  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Rukiel Market home"><img src={logo} alt="Rukiel Market" /></a>
      <div className="topbar-center"><span className="live-dot" /> COLOR STUDIO <span className="topbar-divider">/</span> 3D CUSTOMIZER</div>
    </header>

    <section className="workspace" id="top">
      <div className="preview-column">
        <div className="section-heading preview-heading"><div><span className="eyebrow">LIVE PREVIEW</span><h1>나만의 컬러를 조합해보세요 🎨</h1></div></div>
        <div className="preview-card">
          <div className="preview-card-top"><span>3D OBJECT VIEWER</span><div className="preview-toolbar"><div className="background-picker"><span className="background-toggle-label">배경색</span><div className="background-toggle" role="group" aria-label="미리보기 배경색"><button type="button" className={previewBackground === 'white' ? 'active' : ''} onClick={() => setPreviewBackground('white')} aria-pressed={previewBackground === 'white'}><i className="background-swatch light" />밝은색</button><button type="button" className={previewBackground === 'black' ? 'active' : ''} onClick={() => setPreviewBackground('black')} aria-pressed={previewBackground === 'black'}><i className="background-swatch dark" />어두운색</button></div></div></div></div>
          <ProductPreview model={previewModel} parts={product.parts} partColors={state.partColors} productId={product.id} backgroundColor={previewBackground === 'black' ? '#333333' : '#faf8f6'} hideIcon={hideModelIcon} />
          <div className="preview-card-bottom"><div><strong>{product.name}</strong></div><div className="mini-swatches">{visibleParts.map((part) => <span key={part.id} title={`${part.label}: ${state.partColors[part.id]}`} style={{ backgroundColor: colors.find((c) => c.id === state.partColors[part.id])?.hex }} />)}</div></div>
        </div>
        <div className="preview-caption"><span><span className="caption-star">✳</span> 미리보기용 이미지로, 실제 상품과 컬러와 모양이 다를 수 있습니다.</span></div>
      </div>

      <aside className="controls-column">
        {product.fonts && <section className="control-section font-section"><div className="control-title"><span className="step-number">01</span><div><h2>폰트 선택</h2><p>마음에 드는 폰트를 골라주세요.</p></div></div><div ref={fontSectionRef} className="font-dropdown-wrap"><button className={`font-dropdown ${fontOpen ? 'open' : ''}`} onClick={() => setFontOpen((open) => !open)} aria-expanded={fontOpen}><span className="font-current"><span className="font-preview-text" style={{ fontFamily: selectedFont?.previewFamily }}>{selectedFont?.sample}</span><span className="font-meta"><b>{selectedFont?.label}</b></span></span><ChevronDown size={17} /></button>{fontOpen && <div className="font-menu">{product.fonts.map((font) => <button key={font.id} className={`font-choice ${font.id === state.fontId ? 'active' : ''}`} onClick={() => selectFont(font.id)}><span className="font-choice-sample" style={{ fontFamily: font.previewFamily }}>{font.sample}</span><span><b>{font.label}</b></span>{font.id === state.fontId && <span className="font-check">✓</span>}</button>)}</div>}</div><div className="font-groups"><span>한글 4종</span><i /><span>영어 4종</span><span className="font-count">8 STYLES</span></div></section>}

        <section className="control-section icon-section"><div className="control-title"><span className="step-number">02</span><div><h2>아이콘 표시 여부</h2><p>아이콘을 표시할지 선택해 주세요.</p></div></div><div className="icon-toggle" role="group" aria-label="아이콘 표시 여부"><button type="button" className={iconEnabled ? 'active' : ''} onClick={() => setIconEnabled(true)} aria-pressed={iconEnabled}>O</button><button type="button" className={!iconEnabled ? 'active' : ''} onClick={() => { setIconEnabled(false); setState((current) => current.selectedPartId === 'icon' ? { ...current, selectedPartId: 'letter' } : current); }} aria-pressed={!iconEnabled}>X</button></div></section>

        <section className="control-section part-section"><div className="control-title"><span className="step-number">03</span><div><h2>파츠 선택</h2><p>색을 바꿀 부분을 선택해 주세요.</p></div></div><div className="part-options">{visibleParts.map((part, index) => <button key={part.id} className={`part-option ${state.selectedPartId === part.id ? 'selected' : ''}`} onClick={() => setState((current) => ({ ...current, selectedPartId: part.id }))}><span className="part-index">0{index + 1}</span><span>{part.label}<small>컬러</small></span><span className="part-color-preview" style={{ background: colors.find((color) => color.id === state.partColors[part.id])?.hex }} />{state.selectedPartId === part.id && <ChevronRight size={15} className="part-chevron" />}</button>)}</div></section>

        <section className="control-section color-section"><div className="color-heading"><div className="control-title"><span className="step-number">04</span><div><h2>컬러 선택</h2><p>적용할 컬러를 골라주세요.</p></div></div><span className="selected-color-label">{colorLabel}</span></div><div className="color-grid">{visibleColors.map((color) => <button key={color.id} className={`color-option ${state.partColors[state.selectedPartId] === color.id ? 'selected' : ''} ${color.id === 'white' ? 'is-white' : ''}`} onClick={() => setState((current) => ({ ...current, partColors: { ...current.partColors, [current.selectedPartId]: color.id } }))} aria-label={`${color.name} ${color.hex}`} aria-pressed={state.partColors[state.selectedPartId] === color.id}><span className="color-swatch" style={{ backgroundColor: color.hex }}>{state.partColors[state.selectedPartId] === color.id && <span className="swatch-check">✓</span>}</span><span className="color-name">{color.name}</span></button>)}</div></section>

        <p className="controls-footnote"><span>✳</span> 컬러 조합은 언제든 다시 바꿀 수 있어요.</p>
      </aside>
    </section>
    <footer className="site-footer"><span>© 2026 RUKIELMARKET</span><span>3D COLOR CUSTOMIZER</span></footer>
  </main>;
}
