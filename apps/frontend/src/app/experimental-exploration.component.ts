import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExplorationConfig, StyleExplorationBase } from './style-exploration.base';

type ExperimentalStyleKey =
    | 'noir'
    | 'candy'
    | 'zen-garden'
    | 'deep-sea'
    | 'bio-lab'
    | 'volcanic'
    | 'paper-cut'
    | 'terminal'
    | 'lunar'
    | 'gemstone';

const experimentalConfigs: Record<ExperimentalStyleKey, ExplorationConfig> = {
    noir: {
        routeName: 'Noir',
        eyebrow: 'Noir / velvet shadows / brass and smoke',
        title: 'Pixture After Hours',
        lead: 'A cinematic route built from dim lounges, brass trims, velvet shadows, and low-lit editorial weight. It should feel like a product interface set inside a jazz club rather than a dashboard.',
        paletteTitle: 'Smoked brass palette',
        paletteSubtitle: 'Charcoal, tobacco, parchment white, and tarnished gold shape the route.',
        formsTitle: 'Low-light controls',
        formsSubtitle: 'Fields stay crisp, but everything around them feels moody and cinematic.',
        actionTitle: 'Club-room actions',
        actionSubtitle: 'Buttons feel tailored and restrained, with emphasis coming from contrast instead of size.',
        previewTitle: 'Night ledger',
        previewSubtitle: 'Live values presented like entries in a private after-hours register.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Strong for premium products, storytelling-heavy tools, luxury creative brands, or editorial software.',
        swatches: [
            { label: 'Midnight', color: '#111111', code: '#111111' },
            { label: 'Velvet', color: '#2b1d1d', code: '#2b1d1d' },
            { label: 'Brass', color: '#c7a45b', code: '#c7a45b' },
            { label: 'Smoke', color: '#6a625d', code: '#6a625d' },
            { label: 'Cream', color: '#f2e8d6', code: '#f2e8d6' },
            { label: 'Bordeaux', color: '#6f2d3f', code: '#6f2d3f' },
        ],
        accordionItems: [
            {
                title: 'What makes the route feel noir?',
                content: 'Thin brass edges, deep matte surfaces, restrained typography, and just enough glow to suggest lamplight rather than neon.',
            },
            {
                title: 'What should stay practical?',
                content: 'Forms and tab states still need excellent clarity, otherwise the route becomes atmosphere without product value.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Premium content systems, media tooling, luxury brand sites, ticketing, or story-centric creative software.',
            },
        ],
        tabs: [
            { label: 'Mood', title: 'Cinematic mood', body: 'The page should feel hushed, tailored, and deliberate.' },
            { label: 'Clarity', title: 'Focused hierarchy', body: 'Accents are sparse so important actions stand out naturally.' },
            { label: 'Use case', title: 'Brand value', body: 'This route works when personality and polish are part of the promise.' },
        ],
        guidancePoints: [
            'Favor contrast and material cues over loud decoration.',
            'Use brass sparingly so it feels expensive instead of flashy.',
            'Keep typography confident and editorial.',
            'Let shadows and spacing carry most of the tone.',
        ],
    },
    candy: {
        routeName: 'Candy Pop',
        eyebrow: 'Candy pop / playful pastel / glossy bubble UI',
        title: 'Pixture Sprinkle',
        lead: 'This route goes all the way into cheerful, sweet, round, and toy-like interface language. It is intentionally optimistic, cute, and almost confectionary while still remaining usable.',
        paletteTitle: 'Sugar-burst palette',
        paletteSubtitle: 'Bubblegum pink, peach, lemon cream, mint, and blueberry give the route its cartoon candy energy.',
        formsTitle: 'Bubble controls',
        formsSubtitle: 'Inputs and selects feel like soft capsules instead of serious enterprise controls.',
        actionTitle: 'Treat-box actions',
        actionSubtitle: 'Buttons are plump, glossy, and happy to press.',
        previewTitle: 'Sweet summary',
        previewSubtitle: 'Live values framed like labels on a pastel candy box.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Great for playful consumer products, family apps, creativity tools, and brands that want warmth over seriousness.',
        swatches: [
            { label: 'Bubblegum', color: '#ff9ecb', code: '#ff9ecb' },
            { label: 'Peach', color: '#ffc39a', code: '#ffc39a' },
            { label: 'Lemon', color: '#fff0a8', code: '#fff0a8' },
            { label: 'Mint', color: '#bdf4d2', code: '#bdf4d2' },
            { label: 'Blueberry', color: '#8db9ff', code: '#8db9ff' },
            { label: 'Cream', color: '#fff9f3', code: '#fff9f3' },
        ],
        accordionItems: [
            {
                title: 'What makes the route feel playful?',
                content: 'Roundness, layered highlights, glossy gradients, and soft cheerful color pairings do most of the work.',
            },
            {
                title: 'What could go wrong?',
                content: 'If contrast drops too far, the route becomes adorable but tiring to use. Clarity still has to win.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Consumer products for creative play, education, family experiences, or highly approachable lifestyle brands.',
            },
        ],
        tabs: [
            { label: 'Joy', title: 'Approachability', body: 'This route should make the app feel friendly within a second.' },
            { label: 'Energy', title: 'Color energy', body: 'Palette and rounded forms carry a lot of the delight.' },
            { label: 'Balance', title: 'Practical balance', body: 'Keep labels and field states disciplined underneath the sugar.' },
        ],
        guidancePoints: [
            'Use roundness as a primary structural language.',
            'Let highlights feel glossy but not plastic in a cheap way.',
            'Keep the palette bright and readable.',
            'Aim for joy, not novelty overload.',
        ],
    },
    'zen-garden': {
        routeName: 'Zen Garden',
        eyebrow: 'Zen garden / stone / rice paper / quiet rhythm',
        title: 'Pixture Still',
        lead: 'This route strips the interface down into a calmer rhythm: paper lightness, soft stone, bamboo-green accents, and wide breathing space. It should feel contemplative without becoming empty.',
        paletteTitle: 'Stone and paper palette',
        paletteSubtitle: 'Warm white, ash, moss, ink, and muted clay set the tone.',
        formsTitle: 'Quiet controls',
        formsSubtitle: 'Inputs use restraint instead of ornament, with emphasis on spacing and balance.',
        actionTitle: 'Measured actions',
        actionSubtitle: 'Buttons should feel intentional and calm rather than loud or playful.',
        previewTitle: 'Still summary',
        previewSubtitle: 'Live values shown with the feeling of a tidy journal laid on a low table.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Strong for focus-heavy tools, wellness products, writing surfaces, or brands that want calm authority.',
        swatches: [
            { label: 'Rice paper', color: '#f7f4ec', code: '#f7f4ec' },
            { label: 'Pebble', color: '#d6d0c5', code: '#d6d0c5' },
            { label: 'Moss', color: '#9da48c', code: '#9da48c' },
            { label: 'Clay', color: '#c8ad95', code: '#c8ad95' },
            { label: 'Ink', color: '#35342f', code: '#35342f' },
            { label: 'Mist', color: '#ebe8e1', code: '#ebe8e1' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel calm?',
                content: 'Whitespace, line discipline, gentle contrast, and textures that feel natural instead of digital.',
            },
            {
                title: 'What should stay strong?',
                content: 'Active states, section separation, and hierarchy still need confidence or the page drifts into bland minimalism.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Writing, reflection, wellness, planning, research, and premium minimalist software experiences.',
            },
        ],
        tabs: [
            { label: 'Quiet', title: 'Quiet first impression', body: 'The route should lower the energy of the room instead of raising it.' },
            { label: 'Rhythm', title: 'Balanced rhythm', body: 'Spacing matters as much as color here.' },
            { label: 'Focus', title: 'Focus support', body: 'The route is best when it helps attention settle.' },
        ],
        guidancePoints: [
            'Let whitespace do real structural work.',
            'Keep accents sparse and organic.',
            'Favor calm materials over polished chrome.',
            'Use typography and spacing to create confidence.',
        ],
    },
    'deep-sea': {
        routeName: 'Deep Sea',
        eyebrow: 'Deep sea / pressure glass / bioluminescent currents',
        title: 'Pixture Abyss',
        lead: 'This route leans into underwater depth: dark ocean blues, glassy surfaces, pearl highlights, and luminous aqua accents that feel suspended in moving water.',
        paletteTitle: 'Abyss palette',
        paletteSubtitle: 'Trench blue, aqua glow, reef teal, shell white, and midnight navy build the route.',
        formsTitle: 'Pressure-safe controls',
        formsSubtitle: 'Inputs feel like submerged glass instruments instead of office controls.',
        actionTitle: 'Bioluminescent actions',
        actionSubtitle: 'Buttons and states should feel lit by aquatic energy.',
        previewTitle: 'Dive summary',
        previewSubtitle: 'Live values shown as if viewed through deep-water glass.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Great for science-adjacent products, atmospheric media, maps, simulations, or immersive storytelling tools.',
        swatches: [
            { label: 'Trench', color: '#081a28', code: '#081a28' },
            { label: 'Midwater', color: '#123a51', code: '#123a51' },
            { label: 'Aqua glow', color: '#72ecff', code: '#72ecff' },
            { label: 'Reef', color: '#2ea3a1', code: '#2ea3a1' },
            { label: 'Shell', color: '#e7f6fb', code: '#e7f6fb' },
            { label: 'Kelp', color: '#5e8f8f', code: '#5e8f8f' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel aquatic?',
                content: 'Depth, translucency, round pressure-safe shapes, and cold glows suggest a submerged environment.',
            },
            {
                title: 'What should stay grounded?',
                content: 'Navigation and form states still need strong clarity or the route becomes a movie poster.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Maps, marine tools, science, exploration products, immersive stories, and worldbuilding software.',
            },
        ],
        tabs: [
            { label: 'Depth', title: 'Depth feeling', body: 'Dark layered surfaces should feel deep rather than flat.' },
            { label: 'Glow', title: 'Aqua contrast', body: 'Accent light should feel alive, almost bioluminescent.' },
            { label: 'Glass', title: 'Surface treatment', body: 'Translucency is central to the route identity.' },
        ],
        guidancePoints: [
            'Use translucency and blur to imply water pressure glass.',
            'Keep accents cool and luminous.',
            'Let panels feel submerged, not metallic.',
            'Preserve strong readability against dark depth.',
        ],
    },
    'bio-lab': {
        routeName: 'Bio Lab',
        eyebrow: 'Bio lab / sterile sci-fi / living systems',
        title: 'Pixture Culture',
        lead: 'This route imagines a biotech control surface: sterile white panels, mint glass, clipped geometry, and hints of living-system green. It should feel advanced, clinical, and slightly futuristic.',
        paletteTitle: 'Bio-tech palette',
        paletteSubtitle: 'Clinical white, mint, slate, reagent lime, and dark instrument gray define the route.',
        formsTitle: 'Lab controls',
        formsSubtitle: 'Fields should feel measured, engineered, and ready for observation.',
        actionTitle: 'Protocol actions',
        actionSubtitle: 'Buttons and states behave like controls on a research instrument.',
        previewTitle: 'Specimen summary',
        previewSubtitle: 'Live values presented like a compact culture monitoring panel.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Useful for science, health, data products, climate tools, or any brand that wants exactness with life-science energy.',
        swatches: [
            { label: 'Lab white', color: '#f3f7f5', code: '#f3f7f5' },
            { label: 'Mint glass', color: '#ccefe3', code: '#ccefe3' },
            { label: 'Slate', color: '#5f7470', code: '#5f7470' },
            { label: 'Reagent', color: '#9cf279', code: '#9cf279' },
            { label: 'Instrument', color: '#263432', code: '#263432' },
            { label: 'Seafoam', color: '#81d8bf', code: '#81d8bf' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel bio-tech?',
                content: 'Clinical surfaces, clipped edges, mint translucency, and a balance between living greens and precise instrumentation.',
            },
            {
                title: 'What could become too much?',
                content: 'Too much green or too many futuristic effects will make the route feel game-like instead of credible.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Biology, health, sustainability, labs, climate data, and products that want a precise but living visual system.',
            },
        ],
        tabs: [
            { label: 'Clinical', title: 'Clinical precision', body: 'The route should feel measured, clean, and evidence-focused.' },
            { label: 'Living', title: 'Organic signal', body: 'Mint and green keep it from feeling cold corporate.' },
            { label: 'Future', title: 'Near-future UI', body: 'Clipped geometry creates a more instrument-like silhouette.' },
        ],
        guidancePoints: [
            'Keep the geometry crisp and engineered.',
            'Use green as a controlled signal, not a flood.',
            'Favor translucency over shiny chrome.',
            'Make the route feel credible, not fantastical.',
        ],
    },
    volcanic: {
        routeName: 'Volcanic Forge',
        eyebrow: 'Volcanic forge / obsidian / ember glow / molten seams',
        title: 'Pixture Ember',
        lead: 'This route is hot, dark, and dramatic: obsidian panels, ember edges, molten gradients, and forged shapes. It is intentionally heavier and more aggressive than the other explorations.',
        paletteTitle: 'Forge palette',
        paletteSubtitle: 'Obsidian, ash, ember orange, lava red, brass heat, and smoke build the route.',
        formsTitle: 'Forged controls',
        formsSubtitle: 'Inputs feel carved from dark material and lit by heat lines.',
        actionTitle: 'Heat-forged actions',
        actionSubtitle: 'Buttons are aggressive, angular, and loud by design.',
        previewTitle: 'Crucible summary',
        previewSubtitle: 'Live values displayed like readings on a forge console.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Best for bold entertainment products, heavy brand systems, game-adjacent tools, or dramatic campaign experiences.',
        swatches: [
            { label: 'Obsidian', color: '#141110', code: '#141110' },
            { label: 'Ash', color: '#4f4540', code: '#4f4540' },
            { label: 'Ember', color: '#ff7a2f', code: '#ff7a2f' },
            { label: 'Lava', color: '#c43b20', code: '#c43b20' },
            { label: 'Heat', color: '#ffbf69', code: '#ffbf69' },
            { label: 'Smoke', color: '#a0948b', code: '#a0948b' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel forged?',
                content: 'Angular silhouettes, ember gradients, dark matter surfaces, and glowing seams create the route mood.',
            },
            {
                title: 'What needs restraint?',
                content: 'Too much glow or saturated red will make the route unreadable fast. Contrast needs discipline.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Game surfaces, launch campaigns, high-impact branding, music-adjacent products, and dramatic entertainment tooling.',
            },
        ],
        tabs: [
            { label: 'Heat', title: 'Heat signature', body: 'The route should feel warm and under pressure.' },
            { label: 'Weight', title: 'Heavy structure', body: 'Surfaces should read as carved or cast, not light and soft.' },
            { label: 'Drama', title: 'Controlled drama', body: 'Intensity is the point, but clarity cannot melt away.' },
        ],
        guidancePoints: [
            'Lean into angular geometry and glowing seams.',
            'Let dark surfaces dominate the composition.',
            'Use bright heat as an accent, not a flood.',
            'Keep labels and fields sharply legible.',
        ],
    },
    'paper-cut': {
        routeName: 'Paper Cut',
        eyebrow: 'Paper cut / layered poster / tactile collage',
        title: 'Pixture Cutout',
        lead: 'This route treats the interface like layered paper stock: stacked shadows, matte color sheets, poster-like composition, and tactile edges that feel hand assembled.',
        paletteTitle: 'Layered paper palette',
        paletteSubtitle: 'Tomato, cobalt, cream, butter, charcoal, and seafoam create a bold printed-paper mood.',
        formsTitle: 'Cut-paper controls',
        formsSubtitle: 'Fields should still be readable, but they live inside a more graphic, poster-like system.',
        actionTitle: 'Poster actions',
        actionSubtitle: 'Buttons feel like paper labels pasted into place.',
        previewTitle: 'Cutout summary',
        previewSubtitle: 'Live values shown like notes mounted on layered card stock.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Strong for editorial products, creative tools, playful brands, and interfaces that can lean graphic and tactile.',
        swatches: [
            { label: 'Tomato', color: '#ff6b5f', code: '#ff6b5f' },
            { label: 'Cobalt', color: '#4f75ff', code: '#4f75ff' },
            { label: 'Cream', color: '#fff7e8', code: '#fff7e8' },
            { label: 'Butter', color: '#ffe28b', code: '#ffe28b' },
            { label: 'Charcoal', color: '#262422', code: '#262422' },
            { label: 'Seafoam', color: '#9fe1d6', code: '#9fe1d6' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel tactile?',
                content: 'Layered drop shadows, matte fills, visible stacking, and slightly imperfect color blocks make the route feel hand assembled.',
            },
            {
                title: 'What should stay clean?',
                content: 'Form controls and content density still need restraint so the page remains a product, not a poster collage only.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Editorial products, curation tools, museums, event brands, creative education, and visual storytelling platforms.',
            },
        ],
        tabs: [
            { label: 'Stack', title: 'Layered structure', body: 'The route works when each surface clearly feels stacked on another.' },
            { label: 'Print', title: 'Printed energy', body: 'Matte color and bold type carry most of the personality.' },
            { label: 'Play', title: 'Graphic play', body: 'This route should feel crafted and lively without becoming messy.' },
        ],
        guidancePoints: [
            'Use stacking shadows as a first-class design move.',
            'Keep surfaces matte and graphic.',
            'Let typography feel poster-ready.',
            'Preserve a clear reading path under the collage mood.',
        ],
    },
    terminal: {
        routeName: 'Terminal',
        eyebrow: 'Terminal / phosphor green / command-line rigor',
        title: 'Pixture Console',
        lead: 'This route strips everything down into a monitor-like control plane: phosphor green type, scanline surfaces, monospaced emphasis, and almost no softness at all.',
        paletteTitle: 'Phosphor palette',
        paletteSubtitle: 'Black, deep green, phosphor lime, terminal mint, and CRT gray define the route.',
        formsTitle: 'Prompt controls',
        formsSubtitle: 'Inputs feel like command fields and system prompts rather than consumer UI widgets.',
        actionTitle: 'Console actions',
        actionSubtitle: 'Buttons act more like command chips than soft graphical controls.',
        previewTitle: 'Session summary',
        previewSubtitle: 'Live values shown like structured terminal output.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Useful for developer tools, security products, infrastructure systems, and brands that want hard-edged technical identity.',
        swatches: [
            { label: 'Black', color: '#07110a', code: '#07110a' },
            { label: 'CRT', color: '#102117', code: '#102117' },
            { label: 'Phosphor', color: '#8dff8e', code: '#8dff8e' },
            { label: 'Mint', color: '#57d47c', code: '#57d47c' },
            { label: 'Sage', color: '#395946', code: '#395946' },
            { label: 'Ash', color: '#b5c9b7', code: '#b5c9b7' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel terminal-like?',
                content: 'Monospaced rhythm, strict geometry, scanline hints, and phosphor green contrast do nearly all of the identity work.',
            },
            {
                title: 'What should stay modern?',
                content: 'Spacing, responsiveness, and state clarity should still feel like a current product, not a novelty emulator.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Developer products, security tooling, command-center dashboards, observability, and infrastructure software.',
            },
        ],
        tabs: [
            { label: 'Rigour', title: 'Hard-edge identity', body: 'The route should feel disciplined and explicit.' },
            { label: 'Signal', title: 'Signal visibility', body: 'Green contrast should create instant readability.' },
            { label: 'Brand', title: 'Technical confidence', body: 'This route works when technical culture is core to the brand.' },
        ],
        guidancePoints: [
            'Use monospace and geometry as the primary voice.',
            'Keep color count brutally limited.',
            'Let contrast and structure carry the route.',
            'Avoid cute retro gimmicks that weaken credibility.',
        ],
    },
    lunar: {
        routeName: 'Lunar',
        eyebrow: 'Lunar / moon dust / pearl glow / orbit lines',
        title: 'Pixture Tidal',
        lead: 'This route goes quiet and celestial: moonlit surfaces, pearlescent highlights, circular forms, and low-gravity spacing. It should feel dreamy, distant, and elegant.',
        paletteTitle: 'Moonlit palette',
        paletteSubtitle: 'Pearl, moonstone, dusk violet, crater gray, and starlight white define the route.',
        formsTitle: 'Orbit controls',
        formsSubtitle: 'Inputs should feel soft and precise, like instruments designed for a silent environment.',
        actionTitle: 'Celestial actions',
        actionSubtitle: 'Buttons glow gently rather than shouting.',
        previewTitle: 'Orbit summary',
        previewSubtitle: 'Live values shown as if they drift inside a lunar control room.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Strong for premium lifestyle products, beauty, fashion, ambient creative tools, and dreamy brand experiences.',
        swatches: [
            { label: 'Moonstone', color: '#ecedf6', code: '#ecedf6' },
            { label: 'Pearl', color: '#f8f8fd', code: '#f8f8fd' },
            { label: 'Crater', color: '#a9adbf', code: '#a9adbf' },
            { label: 'Dusk', color: '#8c86c6', code: '#8c86c6' },
            { label: 'Night', color: '#353654', code: '#353654' },
            { label: 'Glow', color: '#d8d2ff', code: '#d8d2ff' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel lunar?',
                content: 'Pearl surfaces, cool light, circular geometry, and a sense of suspended quiet create the route mood.',
            },
            {
                title: 'What should stay grounded?',
                content: 'Too much softness can erase hierarchy, so buttons and tabs still need enough structure to navigate quickly.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Beauty, luxury lifestyle, ambient creative tools, celestial themes, and soft premium digital products.',
            },
        ],
        tabs: [
            { label: 'Glow', title: 'Soft glow', body: 'Highlights should feel lunar, not metallic or neon.' },
            { label: 'Orbit', title: 'Circular rhythm', body: 'The route benefits from round, floating, low-gravity structures.' },
            { label: 'Calm', title: 'Dreamy calm', body: 'The page should feel restful and expensive at the same time.' },
        ],
        guidancePoints: [
            'Use circles and soft capsules generously.',
            'Keep the palette cool and pearlescent.',
            'Favor gentle glows over hard shadows.',
            'Maintain enough contrast for practical navigation.',
        ],
    },
    gemstone: {
        routeName: 'Gemstone',
        eyebrow: 'Gemstone / faceted light / jewel saturation / luxe intensity',
        title: 'Pixture Facet',
        lead: 'This route treats the interface like cut stones and lacquered display cases: saturated jewel tones, faceted geometry, glossy highlights, and dramatic depth.',
        paletteTitle: 'Jewel palette',
        paletteSubtitle: 'Emerald, sapphire, amethyst, ruby, gold, and black enamel build the route.',
        formsTitle: 'Faceted controls',
        formsSubtitle: 'Inputs and tabs should feel polished and precious, not plain.',
        actionTitle: 'Jewel-case actions',
        actionSubtitle: 'Buttons are vibrant, glossy, and sharply framed.',
        previewTitle: 'Facet summary',
        previewSubtitle: 'Live values shown like labels inside a gemstone display case.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Strong for luxury branding, collectibles, premium commerce, events, and expressive high-contrast products.',
        swatches: [
            { label: 'Emerald', color: '#1dbb8b', code: '#1dbb8b' },
            { label: 'Sapphire', color: '#2d66ff', code: '#2d66ff' },
            { label: 'Amethyst', color: '#8a4dff', code: '#8a4dff' },
            { label: 'Ruby', color: '#ff3e70', code: '#ff3e70' },
            { label: 'Gold', color: '#ffd66e', code: '#ffd66e' },
            { label: 'Enamel', color: '#191623', code: '#191623' },
        ],
        accordionItems: [
            {
                title: 'What makes it feel gem-like?',
                content: 'Saturated jewel hues, clipped facets, and bright edges that feel polished rather than soft.',
            },
            {
                title: 'What needs discipline?',
                content: 'Too many competing colors or highlights will make the route look noisy instead of luxurious.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Premium retail, events, collectibles, beauty, fashion, and luxury-forward product experiences.',
            },
        ],
        tabs: [
            { label: 'Facet', title: 'Faceted geometry', body: 'Angular cuts and sharp trims should be visible throughout the route.' },
            { label: 'Saturation', title: 'Color richness', body: 'The route relies on bold jewel color with intentional restraint.' },
            { label: 'Luxury', title: 'Luxurious finish', body: 'Shine and contrast should feel expensive, not chaotic.' },
        ],
        guidancePoints: [
            'Use angular silhouettes and saturated jewel tones.',
            'Let glossy highlights feel controlled and premium.',
            'Keep black enamel or dark frames around bright color.',
            'Protect the hierarchy from turning into a rainbow pile-up.',
        ],
    },
};

@Component({
    selector: 'app-experimental-exploration',
    imports: [FontAwesomeModule],
    templateUrl: './style-exploration.template.html',
    styleUrl: './experimental-exploration.component.scss',
    host: {
        '[class]': 'hostClass',
    },
})
export class ExperimentalExplorationComponent extends StyleExplorationBase {
    private readonly route = inject(ActivatedRoute);

    protected readonly styleKey = this.resolveStyleKey(this.route.snapshot.data['explorationKey']);
    protected readonly config = experimentalConfigs[this.styleKey];
    protected readonly hostClass = `experimental-route experimental-route--${this.styleKey}`;

    private resolveStyleKey(key: unknown): ExperimentalStyleKey {
        if (typeof key === 'string' && key in experimentalConfigs) {
            return key as ExperimentalStyleKey;
        }

        return 'noir';
    }
}
