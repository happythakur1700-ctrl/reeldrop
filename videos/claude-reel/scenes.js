// Reel: edit reels with Claude Code (Hinglish). Bold red / blue / off-white
// scenes with diagonal splits, a black pill label on top, mixed serif + italic
// headlines, white cards with shadows and big outline numbers in the lower
// part of the frame (under the app's buttons, decoration only).

const C = { red: '#E3261C', blue: '#2236E8', orange: '#F0561D', white: '#F2F1EE', ink: '#111111' };
const X = 513; // middle of the reels content area (s.cx)
const PILL = 'CLAUDE CODE  ·  3 PROMPTS';

// Full-frame background: one color, and an optional second color under a
// diagonal edge that can slide up from the bottom at `rise`.
function bg(s, top, bottom, { edge = 1330, tilt = 200, rise } = {}) {
  s.bg(top);
  s.draw({ at: -1 }, (ctx) => {
    if (bottom) {
      const p = rise === undefined ? 1 : s.p(rise, 0.55, 'outQuart');
      const off = (1 - p) * 900;
      ctx.fillStyle = bottom;
      ctx.beginPath();
      ctx.moveTo(0, edge + tilt / 2 + off);
      ctx.lineTo(1080, edge - tilt / 2 + off);
      ctx.lineTo(1080, 1920);
      ctx.lineTo(0, 1920);
      ctx.closePath();
      ctx.fill();
    }
    // Big faint quote marks, like the reference's texture.
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = top === C.white ? C.ink : '#ffffff';
    ctx.font = '400 520px "DM Serif Display"';
    ctx.fillText('”', 40, 1080);
    ctx.restore();
  });
}

// Small black pill label at the top of the content area.
function pill(s) {
  s.text(PILL, { x: X, y: 380, size: 30, font: 'body', color: '#ffffff', bg: C.ink, padding: 16, radius: 40, at: -1 });
}

// Big outline number in the lower part of the frame.
function bigNum(s, n, at, color = '#ffffff') {
  s.draw({ at, enter: 'fade', dur: 0.4 }, (ctx) => {
    ctx.save();
    ctx.font = '400 560px "DM Serif Display"';
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.55;
    ctx.textAlign = 'right';
    ctx.strokeText(n, 1050, 1860);
    ctx.restore();
  });
}

// A white card row: icon on the left, bold label, muted note.
function row(s, { y, icon, label, note, at, iconColor = C.blue, w = 860, h = 120 }) {
  const left = X - w / 2;
  s.box('', { x: X, y, w, h, fill: '#ffffff', border: false, radius: 26, at, enter: 'slide-left', sfx: true });
  s.icon(icon, { x: left + 70, y, size: 64, color: iconColor, at, sfx: false });
  s.text(label, { x: left + 130, y: y - 4, size: 50, font: 'body', color: C.ink, align: 'left', at, sfx: false });
  if (note) s.text(note, { x: left + w - 36, y: y - 2, size: 44, font: 'hand', color: '#666666', align: 'right', at, sfx: false });
}

// A two-line headline: small italic serif, then the big serif line.
function head(s, small, big, { color = '#ffffff', at1 = -1, at2 = -1, y = 490, size = 168, mark = C.orange } = {}) {
  s.text(small, { x: X, y, size: 84, font: 'hand', color, at: at1 });
  s.text(big, { x: X, y: y + 150, size, font: 'display', color, mark, at: at2, enter: 'words' });
}

export default {
  hook(s) {
    s.camera([]);
    bg(s, C.white, C.blue, { edge: 1250, tilt: 220, rise: '#three' });
    pill(s);
    head(s, 'reels edit karo', 'bina *app* ke.', { color: C.ink, mark: C.red });
    // Editing apps, crossed out.
    const apps = [['Premiere', X - 290], ['CapCut', X], ['Editor', X + 290]];
    apps.forEach(([name, x], i) => {
      const at = s.time('#noapp') + 0.25 + i * 0.35;
      s.box(name, { x, y: 840, w: 260, h: 110, size: 48, font: 'body', fill: '#ffffff', stroke: C.ink, width: 4, radius: 22, textColor: C.ink, at, rotate: [-4, 3, -2][i] });
      s.line([[x - 120, 870], [x + 120, 810]], { color: C.red, width: 12, at: at + 0.3, overlap: true });
    });
    s.short.jolt('किसी');
    s.short.flash('ज़रूरत', { color: C.red, alpha: 0.18 });
    // Claude Code + 3 prompts, on the blue panel.
    s.box('>_  Claude Code', { x: X, y: 1030, w: 680, h: 140, size: 72, font: 'display', fill: '#ffffff', textColor: C.ink, border: false, radius: 30, at: s.time('#three') + 0.2, enter: 'pop', maxWidth: 660 });
    s.short.sticker('*3* prompts', { x: X + 170, y: 1170, size: 66, color: C.orange, textColor: '#ffffff', keyColor: C.ink, rotate: -5, at: 'तीन' });
    bigNum(s, '3', 'तीन');
  },

  setup(s) {
    s.camera([...s.short.punch('पसंद', { x: X, y: 800, zoom: 1.03, hold: 0.6 }), ...s.short.punch('लोगो', { x: X, y: 800, zoom: 1.03, hold: 0.6 }), ...s.short.punch('फ़ाइनल', { x: X, y: 800, zoom: 1.04, hold: 0.8 })]);
    bg(s, C.blue);
    pill(s);
    head(s, 'sabse pehle', '4 *folders.*', { at1: 0.1, at2: '#folders' });
    [
      ['#raw', 'raw/', 'footage'],
      ['#refs', 'refs/', 'fav reels'],
      ['#assets', 'assets/', 'logo, music'],
      ['#out', 'out/', 'final edit'],
    ].forEach(([at, label, note], i) => row(s, { y: 815 + i * 132, icon: 'folder', label, note, at }));
    bigNum(s, '0', '#folders');
  },

  one(s) {
    s.camera([...s.short.punch('बोलो', { x: X, y: 800, zoom: 1.04, hold: 0.8 }), ...s.short.punch('मिनट', { x: X, y: 800, zoom: 1.03, hold: 1.5 })]);
    bg(s, C.red, C.blue, { edge: 1320 });
    pill(s);
    head(s, 'pehla prompt', 'retakes *cut.*', { at1: 0.1, at2: '#cut', mark: C.ink });
    s.terminal([
      { cmd: 'har retake kaato', at: '#cut' },
      { out: '✓ 14 retakes removed', at: '#silence', color: '#7ee787' },
      { out: '✓ silence, fillers gone', at: s.time('#silence') + 0.9, color: '#7ee787' },
    ], { x: X, y: 890, w: 840, size: 38, rows: 3, title: 'claude', prompt: '> ', cps: 24 });
    s.short.sticker('20 min → *45 sec*', { x: X, y: 1150, size: 66, color: '#ffffff', textColor: C.ink, keyColor: C.red, rotate: -4, at: '#result' });
    s.icon('scissors', { x: X + 360, y: 470, size: 90, color: '#ffffff', at: 'रीटेक' });
    s.short.flash('#silence', { color: '#ffffff', alpha: 0.2 });
    s.short.jolt('फ़िलर');
    s.short.jolt('टाइट');
    bigNum(s, '01', 0.2);
  },

  two(s) {
    s.camera(s.short.punch('#key', { x: X, y: 800, zoom: 1.05, hold: 1.2 }));
    bg(s, C.white, C.blue, { edge: 1320 });
    pill(s);
    head(s, 'doosra prompt', '*captions.*', { color: C.ink, at1: 0.1, at2: 0.6, mark: C.blue });
    // A phone-style frame with word-by-word captions.
    s.box('', { x: X, y: 960, w: 820, h: 400, fill: C.ink, border: false, radius: 40, at: '#caps', enter: 'pop' });
    s.text('YEH CAPTION', { x: X, y: 900, size: 84, font: 'body', color: '#ffffff', at: '#caps', enter: 'words', dur: 0.8 });
    s.text('*POP* KARENGE', { x: X, y: 1020, size: 84, font: 'body', color: '#ffffff', mark: C.orange, at: '#key', enter: 'words', dur: 0.6 });
    s.short.sticker('word by word', { x: X + 170, y: 1190, size: 46, color: C.orange, textColor: '#ffffff', rotate: -6, at: 'वर्ड#2' });
    bigNum(s, '02', 0.2);
  },

  three(s) {
    s.camera([...s.short.punch('रील्स', { x: X, y: 800, zoom: 1.04, hold: 0.8 }), ...s.short.punch(s.time('#style') + 3.0, { x: X, y: 800, zoom: 1.04, hold: 1.0 })]);
    bg(s, C.blue, C.red, { edge: 1320 });
    pill(s);
    head(s, 'aur teesra wala', 'sabse *kamaal.*', { at1: 0.1, at2: 1.3, size: 140 });
    // Reference reels in refs/.
    [X - 200, X, X + 200].forEach((x, i) => {
      s.box('', { x, y: 870, w: 170, h: 280, fill: ['#ffffff', C.orange, C.ink][i], border: false, radius: 22, at: s.time('#refs') + i * 0.2, enter: 'rise', rotate: [-6, 0, 6][i], overlap: true });
    });
    s.icon('eye', { x: X, y: 870, size: 90, color: '#ffffff', at: s.time('#refs') + 0.8 });
    // The style it copies.
    ['pacing', 'zoom', 'colour'].forEach((w, i) => {
      s.box(w, { x: X - 290 + i * 290, y: 1090, w: 270, h: 100, size: 50, font: 'body', fill: '#ffffff', textColor: C.ink, border: false, radius: 50, at: s.time('#style') + 0.6 + i * 0.6, enter: 'pop' });
    });
    s.short.sticker('your reel *✓*', { x: X + 120, y: 1195, size: 60, color: C.orange, textColor: '#ffffff', keyColor: C.ink, rotate: -4, at: s.time('#style') + 2.6 });
    bigNum(s, '03', 0.2);
  },

  cta(s) {
    s.camera(s.short.punch('#comment', { x: X, y: 800, zoom: 1.05, hold: 1.4 }));
    bg(s, C.red, C.blue, { edge: 1330, rise: '#follow' });
    pill(s);
    head(s, 'poore prompts', 'chahiye?');
    s.text('comment karo', { x: X, y: 790, size: 56, font: 'body', color: '#ffffff', at: '#comment' });
    s.box('"CLAUDE"', { x: X, y: 920, w: 760, h: 170, size: 120, font: 'display', fill: C.ink, textColor: '#ffffff', border: false, radius: 34, at: '#comment', enter: 'pop' });
    s.text('guide seedha *DM* mein', { x: X - 40, y: 1065, size: 62, font: 'hand', color: '#ffffff', mark: C.ink, at: '#dm' });
    s.icon('mail', { x: X + 340, y: 1065, size: 76, color: '#ffffff', at: 'गाइड' });
    s.short.flash('आपके', { color: '#ffffff', alpha: 0.18 });
    s.short.jolt('#follow');
    s.short.jolt('ट्रिक्स');
    s.box('+  Follow', { x: X, y: 1180, w: 380, h: 106, size: 52, font: 'body', fill: '#ffffff', textColor: C.blue, border: false, radius: 53, at: '#follow', enter: 'pop' });
    s.burst({ x: X, y: 1180, at: s.time('#follow') + 0.2, count: 40, colors: ['#ffffff', C.orange, C.blue] });
  },
};
