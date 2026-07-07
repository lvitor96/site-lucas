# Especificação — Site de Portfólio, Loja e Contato

Documento de referência para o build no Claude Code. Reúne decisões já fechadas e pendências que ainda travam partes do design.

---

## 1. Sitemap / Navegação

```
Quem sou eu
O que já fizemos
Loja ▾
  ├── Partituras
  ├── Kits de ensaio
  └── Arranjos
Faça seu orçamento
Contato
```

- "Loja" é item único no menu principal, com dropdown/sub-menu revelando as 3 categorias — cada uma com URL própria (SEO preservado), evitando um menu plano de 7 itens no topo.
- Dropdown precisa funcionar bem em touch (mobile/tablet), não só em hover de desktop — testar cedo.

---

## 2. Quem sou eu

- Conteúdo: biografia, currículo, formação (Regência/EMB), fotos.
- **1-2 vídeos de regência do canal do YouTube**, como prova rápida de credibilidade. (Decisão final — substitui a versão anterior "só texto/CV".)
- Esses vídeos **podem repetir** em "O que já fizemos" — decisão consciente de que quem visita as duas páginas já está engajado o suficiente pra não se incomodar com a repetição.
- Carregamento: usar thumbnail estático com play sob demanda (o vídeo só carrega quando clicado), não iframe já embutido — evita peso de carregamento na página, independente de quantos vídeos entrarem aqui.

## 3. O que já fizemos

- Conteúdo: reels do Instagram (arranjos, kits), vídeos do canal secundário (público, apesar do apelido "canal dark"), cases e vídeos de entregas e trabalhos realizados (coral, arranjos, regência).
- Pode conter os mesmos 1-2 vídeos de regência usados em "Quem sou eu" (ver acima).
- Mesmo padrão de carregamento sob demanda (thumbnail → player ao clicar).
- **Pendência de conteúdo (não de design):** quantidade final de vídeos por seção ainda não definida pelo usuário — sem impacto técnico graças ao carregamento sob demanda, mas afeta o trabalho de seleção/edição do material.

---

## 4. Loja — especificação por categoria

Estrutura comum às 3 categorias: preview visual + preview em áudio + link de compra externo.

### Partituras
- Preview: 1 página em PNG
- Áudio: 1 faixa única, ~45s
- Proteção do PNG: deterrente simples (bloqueio de clique direito/arrastar via JS). **Sem backend de URL assinada.** Risco residual aceito: a imagem continua acessível via inspecionar elemento/view-source, em desktop e mobile.
- Compra: link externo para o produto correspondente na plataforma de vendas.

### Kits de ensaio
- Preview: 1 página em PNG (mesma proteção acima)
- Áudio: **player multi-faixa** — uma faixa por voz (soprano/contralto/tenor/baixo), não um único mix.
- Duração confirmada: **~20-30s por faixa** (reduzido em relação aos 45s de Partituras/Arranjos, pra não entregar a música inteira). Priorizar o trecho mais representativo de cada voz, não necessariamente o início.
- Custo operacional: cada kit novo exige cortar, normalizar e exportar 4 faixas de preview — trabalho recorrente, não configuração única.
- Compra: link externo para o produto correspondente na plataforma de vendas.

### Arranjos
- Preview: 1 página em PNG (mesma proteção)
- Áudio: 1 faixa única, ~45s
- Compra: link externo para o produto correspondente na plataforma de vendas.

---

## 5. Faça seu orçamento

Campos: tipo de material desejado, formato, referência, comentários.

**Destino do envio (fechado):** híbrido —
1. Netlify Forms captura o envio e manda notificação por e-mail (sem servidor próprio).
2. Ao mesmo tempo, gera um link `wa.me` pré-preenchido com os dados digitados, levando a pessoa a uma tela "confirme pelo WhatsApp" — ela precisa clicar em enviar do lado dela; não é envio automático via API do WhatsApp (que exigiria WhatsApp Business API, verificação de empresa e custo por conversa — desproporcional aqui).

**Riscos técnicos de implementação a não esquecer:**
- Netlify Forms só detecta formulários estáticos no HTML gerado no build. Se o formulário for renderizado via JS (React/Claude Code), é necessário manter uma cópia estática oculta do form (mesmo `name` e campos) em algum HTML puro do build, só para a Netlify detectar — sem isso, o formulário falha silenciosamente, sem erro visível.
- Formulário público sem proteção de spam consome a cota de submissões do plano free. Adicionar honeypot (recurso nativo Netlify) e/ou reCAPTCHA antes do lançamento.

## 6. Contato

- WhatsApp
- Instagram

---

## 7. Decisões técnicas registradas

| Item | Decisão | Observação |
|---|---|---|
| Hospedagem | Netlify | Diferente do GitHub Pages usado no app da SEDF — necessário pra Netlify Forms funcionar nativamente |
| Plataforma de venda | Hotmart / Eduzz / Kiwify | SKU individual por produto; taxa por transação; processo de aprovação por item novo — considerar o tempo de aprovação no planejamento de lançamentos, não é upload instantâneo |
| Formulário de orçamento | Netlify Forms (e-mail) + link `wa.me` pré-preenchido | Exige form estático espelhado se o form real for renderizado via JS; precisa honeypot/reCAPTCHA contra spam |
| Proteção de preview (partitura) | Deterrente simples (bloqueio de clique direito/arrastar) | Sem proteção real de backend; risco de acesso via view-source/inspecionar elemento aceito conscientemente |
| Preview de kits | Multi-faixa por voz, ~20-30s cada | Implica edição de áudio recorrente a cada novo kit lançado (~4 cortes por lançamento) |
| Vídeos (bio + portfólio) | Thumbnail estático com play sob demanda | Evita peso de carregamento independente da quantidade final de vídeos |
| Responsividade | Obrigatória — mobile (smartphone/tablet) e desktop | Menu dropdown e players de vídeo/áudio precisam testar bem em touch |
| Stack de construção | Claude Design (protótipos/mockups) + Claude Code (implementação) | — |

---

## 8. Riscos / pendências em aberto

Todas as decisões de arquitetura estão fechadas. O que resta é trabalho de conteúdo/implementação, não de design:

1. **Estrutura de URLs da Loja** — se o dropdown gera `/loja/partituras`, `/loja/kits`, `/loja/arranjos` ou outra convenção, ainda não desenhada.
2. **Seleção dos vídeos** — quantos e quais vídeos entram em "Quem sou eu" e "O que já fizemos" (canal do YouTube, canal secundário, reels) é curadoria do usuário, sem prazo definido.
3. **Cadastro dos produtos na plataforma de venda** — tempo de aprovação por item novo na Hotmart/Eduzz/Kiwify precisa entrar no cronograma de lançamento, não é imediato.
4. **Edição recorrente de áudio dos kits** — ~4 cortes de faixa por kit lançado é trabalho contínuo do usuário, não uma configuração única do site.
