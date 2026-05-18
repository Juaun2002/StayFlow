# 🎬 Guia de Animações StayFlow

## Animações Implementadas

### 1. **CSS Animations** (globals.css)

#### Glow Effect
```css
animation: glow 3s ease-in-out infinite
```
Efeito de brilho suave que pulse continuamente. Perfeito para elementos importantes.

#### Float Animation
```css
animation: float 3s ease-in-out infinite
```
Movimento vertical suave, como se estivesse flutuando.

#### Shimmer Effect
```css
animation: shimmer 2s infinite
```
Efeito de brilho deslizante, ótimo para loading states.

#### Gradient Shift
```css
animation: gradient-shift 8s ease infinite
```
Animação de gradiente que muda de posição suavemente.

#### Aurora Flow
```css
animation: aurora-flow 6s ease infinite
```
Efeito complexo de fluxo de aurora boreal.

#### Blur In
```css
animation: blur-in 0.8s ease-out
```
Entrada com desfoque que desaparece, super elegante.

#### Bounce Enter
```css
animation: bounce-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
```
Entrada com "bounce" natural e sofisticado.

### 2. **Componentes Animados**

#### Header
- ✨ Glow effect no título "StayFlow"
- 📏 Linha divisória que anima ao aparecer
- 🎯 Animação de entrada com spring physics

#### FloatingHeader
- 🔄 Animação de entrada suave
- 📱 Blur backdrop ao fazer scroll
- 🎨 Links com underline animation ao hover
- ✨ Glow text shadow ao fazer scroll

#### PropertyCard
- 🎯 Entrada com spring physics (bounce elegante)
- 🖱️ Hover com levantamento e scale
- 💫 Shadow glow ao hover (indigo/blue tint)
- 📸 Imagem com zoom suave
- ❤️ Botão favorite com scale animation

#### CircularChart
- 🎯 Entrada com variantes customizadas
- 🖱️ Hover com scale e glow
- 📊 Animação staggered nos itens da lista
- 🎨 Percentual com cor animada
- 💫 Indicadores que pulam ao hover

#### FormInput
- ✏️ Label animado ao focar
- 📍 Box shadow animado ao focar
- ✨ Linha gradiente na base ao focar
- 🎯 Border animação ao focar

#### SubmitButton
- 🔘 Gradient background
- ✨ Shadow glow ao hover
- ⚙️ Spinner animado com rotate contínuo
- 💫 Aumento de escala suave ao hover
- 📏 Espaçamento maior para visual mais premium

#### LoginForm / RegisterForm
- 🎯 Stagger animation nos campos
- 📝 Cada campo entra com delay
- 🔗 Links com underline gradient animation
- ⚠️ Erro com animação de entrada

#### AuthContainer
- 🔄 Flip 3D ao alternar entre login/registro
- 📐 Altura animada dinamicamente
- 🎯 Entrada com spring e escala

#### ImageUploader
- 🎯 Drag & drop com animações
- 📸 Fotos entram com rotate e scale
- 🖱️ Hover nos itens com scale
- 🗑️ Botão remover com hover effects
- 💫 Upload zone com pulse ao hover

### 3. **Efeitos Visuais Premium**

#### Glass Effect
```css
glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### Spring Physics
Transições usando spring physics para movimentos mais naturais:
```tsx
transition={{
  type: "spring",
  stiffness: 300,
  damping: 25
}}
```

#### Stagger Animation
Entrada sequencial de elementos para efeito cascata:
```tsx
containerVariants = {
  staggerChildren: 0.08,
  delayChildren: 0.2
}
```

## 🎯 Uso das Classes de Animação

```tsx
// Glow
<div className="animate-glow">Conteúdo</div>

// Float
<div className="animate-float">Conteúdo</div>

// Shimmer (loading)
<div className="animate-shimmer">Conteúdo</div>

// Gradient animado
<div className="animate-gradient">Conteúdo</div>

// Entrada com blur
<div className="animate-blur-in">Conteúdo</div>

// Entrada com bounce
<div className="animate-bounce-enter">Conteúdo</div>

// Glass effect
<div className="glass-effect">Conteúdo</div>
```

## 🎨 Paleta de Animações

- **Duração curta**: 0.3s - 0.5s (botões, hovers)
- **Duração média**: 0.6s - 0.8s (entradas)
- **Duração longa**: 2s - 8s (loops contínuos)

## 📱 Componentes Modificados

✅ Header
✅ FloatingHeader
✅ PropertyCard
✅ CircularChart
✅ FormInput
✅ SubmitButton
✅ LoginForm
✅ RegisterForm
✅ AuthContainer
✅ ImageUploader

## 🚀 Dicas para Manter o Divino

1. Use `spring` physics para movimentos naturais
2. Evite durações muito longas ou curtas
3. Combine múltiplas animações para efeito cumulativo
4. Use `whileHover` e `whileTap` para feedback imediato
5. Adicione delays pequenos (0.1s - 0.2s) para stagger effects
6. Mantenha o `ease-out` para entradas
7. Use shadows animados para profundidade
8. Adicione scale effects para feedback visual

---

**Feito com ❤️ usando Framer Motion**
