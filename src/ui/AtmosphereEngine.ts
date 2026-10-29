export class AtmosphereEngine {
  private leaves: Array<{ x: number; y: number; vx: number; vy: number; rot: number; vRot: number; size: number; color: string }> = [];
  private rain: Array<{ x: number; y: number; speed: number; len: number; alpha: number }> = [];
  private ripples: Array<{ x: number; y: number; r: number; maxR: number; alpha: number }> = [];
  private fireflies: Array<{ x: number; y: number; vx: number; vy: number; phase: number; size: number }> = [];

  constructor() {
    this.initParticles();
  }

  private initParticles() {
    for (let i = 0; i < 18; i++) {
      this.leaves.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        vx: 0.3 + Math.random() * 0.5,
        vy: 0.4 + Math.random() * 0.7,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03,
        size: 8 + Math.random() * 8,
        color: Math.random() > 0.5 ? '#8B5A2B' : '#556B2F'
      });
    }
    for (let i = 0; i < 45; i++) {
      this.rain.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        speed: 9 + Math.random() * 6,
        len: 12 + Math.random() * 12,
        alpha: 0.2 + Math.random() * 0.4
      });
    }
    for (let i = 0; i < 16; i++) {
      this.fireflies.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 2.5
      });
    }
  }

  public updateAndDraw(ctx: CanvasRenderingContext2D, width: number, height: number, scenarioId: string) {
    if (scenarioId === 'courtyard') {
      this.drawSunbeams(ctx, width, height);
      this.updateLeaves(ctx, width, height);
    } else if (scenarioId === 'monsoon') {
      this.updateRain(ctx, width, height);
    } else if (scenarioId === 'sundarban') {
      this.updateFireflies(ctx, width, height);
    } else if (scenarioId === 'school') {
      this.drawDeskSunlight(ctx, width, height);
    }
  }

  private drawSunbeams(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    const beam = ctx.createLinearGradient(0, 0, w, h);
    beam.addColorStop(0, 'rgba(255, 235, 175, 0.16)');
    beam.addColorStop(0.5, 'rgba(255, 220, 140, 0.06)');
    beam.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(w * 0.65, 0); ctx.lineTo(w, h * 0.8); ctx.lineTo(w * 0.35, h);
    ctx.fill();
    ctx.restore();
  }

  private drawDeskSunlight(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    const sun = ctx.createRadialGradient(w * 0.2, h * 0.1, 20, w * 0.3, h * 0.2, w * 0.8);
    sun.addColorStop(0, 'rgba(255, 240, 200, 0.14)');
    sun.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  private updateLeaves(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    for (const l of this.leaves) {
      l.x += l.vx + Math.sin(l.rot) * 0.4;
      l.y += l.vy;
      l.rot += l.vRot;
      if (l.y > h + 20) { l.y = -20; l.x = Math.random() * w; }
      if (l.x > w + 20) { l.x = -20; }

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath(); ctx.ellipse(2, 4, l.size, l.size * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = l.color;
      ctx.beginPath(); ctx.ellipse(0, 0, l.size, l.size * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(-l.size * 0.8, 0); ctx.lineTo(l.size * 0.8, 0); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  private updateRain(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    ctx.strokeStyle = '#B8D5E5';
    ctx.lineWidth = 1.2;
    for (const r of this.rain) {
      r.x -= 2;
      r.y += r.speed;
      if (r.y > h) {
        if (Math.random() < 0.3) {
          this.ripples.push({ x: r.x, y: h - 15 - Math.random() * (h * 0.7), r: 2, maxR: 14 + Math.random() * 10, alpha: 0.6 });
        }
        r.y = -20;
        r.x = Math.random() * (w + 60);
      }
      ctx.globalAlpha = r.alpha;
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 4, r.y + r.len);
      ctx.stroke();
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.r += 0.4;
      rip.alpha -= 0.018;
      if (rip.alpha <= 0) {
        this.ripples.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = rip.alpha;
      ctx.strokeStyle = '#D9EAF2';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(rip.x, rip.y, rip.r * 1.6, rip.r * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  private updateFireflies(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    for (const f of this.fireflies) {
      f.x += f.vx;
      f.y += f.vy;
      f.phase += 0.04;
      if (f.x < 0) f.x = w;
      if (f.x > w) f.x = 0;
      if (f.y < 0) f.y = h;
      if (f.y > h) f.y = 0;

      const alpha = 0.3 + 0.6 * Math.abs(Math.sin(f.phase));
      const rad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 3.5);
      rad.addColorStop(0, `rgba(180, 255, 60, ${alpha})`);
      rad.addColorStop(0.4, `rgba(120, 220, 40, ${alpha * 0.5})`);
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
