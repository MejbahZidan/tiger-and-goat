export class PieceRenderer {
  public static skin = 'terracotta';

  public static setSkin(s: string) {
    this.skin = s;
    localStorage.setItem('tiger_goat_skin', s);
  }

  public static drawTiger(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, sel: boolean) {
    ctx.save();
    const lift = sel ? 7 : 0;
    const drawY = y - lift;
    const h = r * 0.26 + (sel ? 4 : 0);

    // 1. Dynamic Contact Shadow
    ctx.fillStyle = sel ? 'rgba(15, 10, 8, 0.45)' : 'rgba(25, 15, 10, 0.55)';
    ctx.beginPath();
    ctx.ellipse(x + (sel ? 6 : 2), y + r * 0.42 + h + (sel ? 6 : 0), r * (sel ? 1.05 : 0.95), r * (sel ? 0.45 : 0.38), 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Heavy Carved Coin Side (Extrusion)
    const sideGrad = ctx.createLinearGradient(x - r, drawY, x + r, drawY + h);
    if (this.skin === 'wood') {
      sideGrad.addColorStop(0, '#5A3118'); sideGrad.addColorStop(1, '#231106');
    } else if (this.skin === 'monsoon') {
      sideGrad.addColorStop(0, '#43565F'); sideGrad.addColorStop(1, '#1C272C');
    } else if (this.skin === 'royal') {
      sideGrad.addColorStop(0, '#C9972A'); sideGrad.addColorStop(1, '#5E430B');
    } else {
      sideGrad.addColorStop(0, '#A64328'); sideGrad.addColorStop(1, '#4A170B');
    }
    ctx.fillStyle = sideGrad;
    ctx.beginPath(); ctx.ellipse(x, drawY + h, r * 0.92, r * 0.74, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - r * 0.92, drawY, r * 1.84, h);

    // 3. Top Face Medallion Disc
    const topGrad = ctx.createRadialGradient(x - r * 0.35, drawY - r * 0.35, r * 0.1, x, drawY, r * 0.95);
    if (this.skin === 'wood') {
      topGrad.addColorStop(0, '#9E5B32'); topGrad.addColorStop(0.75, '#68371B'); topGrad.addColorStop(1, '#3A1C0B');
    } else if (this.skin === 'monsoon') {
      topGrad.addColorStop(0, '#7594A3'); topGrad.addColorStop(0.75, '#4E6875'); topGrad.addColorStop(1, '#2C3E47');
    } else if (this.skin === 'royal') {
      topGrad.addColorStop(0, '#F5D77F'); topGrad.addColorStop(0.75, '#C9972A'); topGrad.addColorStop(1, '#78550E');
    } else {
      topGrad.addColorStop(0, '#D95E3C'); topGrad.addColorStop(0.75, '#A64328'); topGrad.addColorStop(1, '#611F11');
    }
    ctx.fillStyle = topGrad;
    ctx.beginPath(); ctx.ellipse(x, drawY, r * 0.92, r * 0.74, 0, 0, Math.PI * 2); ctx.fill();

    // 4. Antique Beaded Coin Rim (মেডেলিন নকশা)
    ctx.strokeStyle = sel ? '#FFD700' : 'rgba(255, 230, 180, 0.45)';
    ctx.lineWidth = sel ? 3.5 : 2;
    ctx.stroke();

    ctx.fillStyle = sel ? '#FFE600' : 'rgba(255, 255, 255, 0.4)';
    const beadCount = 18;
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const bx = x + Math.cos(angle) * (r * 0.82);
      const by = drawY + Math.sin(angle) * (r * 0.64);
      ctx.beginPath(); ctx.arc(bx, by, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // 5. Authentic Royal Bengal Tiger Folk Relief
    const ink = this.skin === 'royal' ? '#2A1B02' : '#1A0E08';
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;

    // Carved Tiger Ears
    ctx.beginPath();
    ctx.ellipse(x - r * 0.52, drawY - r * 0.38, r * 0.2, r * 0.24, -0.35, 0, Math.PI * 2);
    ctx.ellipse(x + r * 0.52, drawY - r * 0.38, r * 0.2, r * 0.24, 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Forehead Bengal Stripes (রয়্যাল বেঙ্গল ত্রিশূল নকশা)
    ctx.lineWidth = r * 0.09;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, drawY - r * 0.45); ctx.lineTo(x, drawY - r * 0.08);
    ctx.moveTo(x - r * 0.32, drawY - r * 0.3); ctx.lineTo(x - r * 0.08, drawY - r * 0.12);
    ctx.moveTo(x + r * 0.32, drawY - r * 0.3); ctx.lineTo(x + r * 0.08, drawY - r * 0.12);
    ctx.moveTo(x - r * 0.42, drawY - r * 0.16); ctx.lineTo(x - r * 0.22, drawY - r * 0.02);
    ctx.moveTo(x + r * 0.42, drawY - r * 0.16); ctx.lineTo(x + r * 0.22, drawY - r * 0.02);
    ctx.stroke();

    // Piercing Feline Eyes
    ctx.fillStyle = sel ? '#FFEA00' : '#FFF0A8';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.32, drawY + r * 0.06, r * 0.13, r * 0.08, -0.22, 0, Math.PI * 2);
    ctx.ellipse(x + r * 0.32, drawY + r * 0.06, r * 0.13, r * 0.08, 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F0804';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.32, drawY + r * 0.06, r * 0.05, r * 0.07, 0, 0, Math.PI * 2);
    ctx.ellipse(x + r * 0.32, drawY + r * 0.06, r * 0.05, r * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();

    // Broad Snout & Whiskers
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.ellipse(x, drawY + r * 0.32, r * 0.16, r * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  public static drawGoat(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, sel: boolean) {
    ctx.save();
    const lift = sel ? 6 : 0;
    const drawY = y - lift;
    const h = r * 0.24 + (sel ? 3 : 0);

    // 1. Dynamic Contact Shadow
    ctx.fillStyle = 'rgba(25, 20, 15, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + (sel ? 5 : 2), y + r * 0.42 + h + (sel ? 5 : 0), r * 0.9, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. 3D Cylindrical Side (Extrusion)
    const sideGrad = ctx.createLinearGradient(x - r, drawY, x + r, drawY + h);
    if (this.skin === 'wood') {
      sideGrad.addColorStop(0, '#A37745'); sideGrad.addColorStop(1, '#52381B');
    } else if (this.skin === 'monsoon') {
      sideGrad.addColorStop(0, '#A0B7C2'); sideGrad.addColorStop(1, '#4B626E');
    } else if (this.skin === 'royal') {
      sideGrad.addColorStop(0, '#6C835A'); sideGrad.addColorStop(1, '#2E3B24');
    } else {
      sideGrad.addColorStop(0, '#B8A88F'); sideGrad.addColorStop(1, '#665945');
    }
    ctx.fillStyle = sideGrad;
    ctx.beginPath(); ctx.ellipse(x, drawY + h, r * 0.86, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - r * 0.86, drawY, r * 1.72, h);

    // 3. Top Face Medallion Disc
    const topGrad = ctx.createRadialGradient(x - r * 0.3, drawY - r * 0.3, r * 0.1, x, drawY, r * 0.9);
    if (this.skin === 'wood') {
      topGrad.addColorStop(0, '#F5DEB3'); topGrad.addColorStop(0.75, '#D4B07B'); topGrad.addColorStop(1, '#8A5D2C');
    } else if (this.skin === 'monsoon') {
      topGrad.addColorStop(0, '#F0F6F8'); topGrad.addColorStop(0.75, '#C8D9DF'); topGrad.addColorStop(1, '#748E9A');
    } else if (this.skin === 'royal') {
      topGrad.addColorStop(0, '#D6E5C8'); topGrad.addColorStop(0.75, '#9CB886'); topGrad.addColorStop(1, '#4E633C');
    } else {
      topGrad.addColorStop(0, '#FFF9EB'); topGrad.addColorStop(0.75, '#E5D6BA'); topGrad.addColorStop(1, '#A89676');
    }
    ctx.fillStyle = topGrad;
    ctx.beginPath(); ctx.ellipse(x, drawY, r * 0.86, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();

    // 4. Beaded Rim
    ctx.strokeStyle = sel ? '#4CAF50' : 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = sel ? 3.5 : 1.8;
    ctx.stroke();

    ctx.fillStyle = sel ? '#69F0AE' : 'rgba(100, 80, 60, 0.35)';
    const beadCount = 16;
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const bx = x + Math.cos(angle) * (r * 0.76);
      const by = drawY + Math.sin(angle) * (r * 0.6);
      ctx.beginPath(); ctx.arc(bx, by, 1.3, 0, Math.PI * 2); ctx.fill();
    }

    // 5. Carved Folk Horned Goat Relief
    const ink = '#3B291A';
    ctx.strokeStyle = ink;
    ctx.lineWidth = r * 0.13;
    ctx.lineCap = 'round';

    // Sweeping Curved Horns (বাঁকানো শিং)
    ctx.beginPath();
    ctx.arc(x - r * 0.32, drawY - r * 0.14, r * 0.38, Math.PI * 0.82, Math.PI * 1.68);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + r * 0.32, drawY - r * 0.14, r * 0.38, Math.PI * 1.32, Math.PI * 2.18);
    ctx.stroke();

    // Horn Ridge Highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = r * 0.045;
    ctx.beginPath();
    ctx.arc(x - r * 0.32, drawY - r * 0.14, r * 0.38, Math.PI * 1.0, Math.PI * 1.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + r * 0.32, drawY - r * 0.14, r * 0.38, Math.PI * 1.45, Math.PI * 2.0);
    ctx.stroke();

    // Warm Eyes & Muzzle
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(x - r * 0.22, drawY + r * 0.1, r * 0.08, 0, Math.PI * 2);
    ctx.arc(x + r * 0.22, drawY + r * 0.1, r * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - r * 0.24, drawY + r * 0.08, r * 0.025, 0, Math.PI * 2);
    ctx.arc(x + r * 0.2, drawY + r * 0.08, r * 0.025, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4D3624';
    ctx.beginPath();
    ctx.ellipse(x, drawY + r * 0.28, r * 0.14, r * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
