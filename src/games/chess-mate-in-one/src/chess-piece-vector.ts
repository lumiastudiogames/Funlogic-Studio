import { PieceColor, PieceType } from './types';

/**
 * High-definition vector outlines for standard tournament Staunton pieces.
 * Scaled dynamically to unit coordinate space [-50, -50] to [50, 50],
 * rendered with rich gradient shading, specular highlights, and carved details.
 */
export class ChessPieceVector {
  public static draw(
    ctx: CanvasRenderingContext2D,
    type: PieceType,
    color: PieceColor,
    cx: number,
    cy: number,
    size: number,
    isDragging: boolean
  ) {
    const isWhite = color === 'w';
    const scale = (size * 0.98) / 100;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Directional shadow in piece local space
    if (isDragging) {
      ctx.translate(0, -6);
    }

    // Colors & gradients
    const mainGrad = ctx.createLinearGradient(-35, -45, 35, 45);
    const bevelGrad = ctx.createLinearGradient(-30, -30, 30, 30);
    const strokeColor = isWhite ? '#1e293b' : '#090d16';

    if (isWhite) {
      mainGrad.addColorStop(0, '#ffffff');
      mainGrad.addColorStop(0.3, '#fbfbfe');
      mainGrad.addColorStop(0.8, '#e2e8f0');
      mainGrad.addColorStop(1, '#cbd5e1');

      bevelGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      bevelGrad.addColorStop(1, 'rgba(203, 213, 225, 0.2)');
    } else {
      mainGrad.addColorStop(0, '#334155');
      mainGrad.addColorStop(0.3, '#1e293b');
      mainGrad.addColorStop(0.8, '#0f172a');
      mainGrad.addColorStop(1, '#020617');

      bevelGrad.addColorStop(0, 'rgba(148, 163, 184, 0.55)');
      bevelGrad.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
    }

    // Set styling
    ctx.fillStyle = mainGrad;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    switch (type) {
      case 'p':
        this.drawPawn(ctx, isWhite);
        break;
      case 'n':
        this.drawKnight(ctx, isWhite);
        break;
      case 'b':
        this.drawBishop(ctx, isWhite);
        break;
      case 'r':
        this.drawRook(ctx, isWhite);
        break;
      case 'q':
        this.drawQueen(ctx, isWhite);
        break;
      case 'k':
        this.drawKing(ctx, isWhite);
        break;
    }

    // Specular highlight gleam on upper left
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-10, -18, 6, 14, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.22)';
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  private static drawBase(ctx: CanvasRenderingContext2D, width: number = 38) {
    // Pedestal tier 1 (bottom rim)
    ctx.beginPath();
    ctx.roundRect(-width, 36, width * 2, 8, 3);
    ctx.fill();
    ctx.stroke();

    // Pedestal tier 2 (waist ring)
    ctx.beginPath();
    ctx.roundRect(-width * 0.82, 28, width * 1.64, 8, 2);
    ctx.fill();
    ctx.stroke();
  }

  private static drawPawn(ctx: CanvasRenderingContext2D, _isWhite: boolean) {
    this.drawBase(ctx, 32);

    // Body
    ctx.beginPath();
    ctx.moveTo(-22, 28);
    ctx.bezierCurveTo(-14, 18, -10, 0, -12, -10);
    ctx.lineTo(12, -10);
    ctx.bezierCurveTo(10, 0, 14, 18, 22, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Neck ring
    ctx.beginPath();
    ctx.roundRect(-15, -13, 30, 5, 2);
    ctx.fill();
    ctx.stroke();

    // Head sphere
    ctx.beginPath();
    ctx.arc(0, -25, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  private static drawKnight(ctx: CanvasRenderingContext2D, isWhite: boolean) {
    this.drawBase(ctx, 36);

    // Carved Knight Head & Mane
    ctx.beginPath();
    ctx.moveTo(-24, 28);
    // Back mane
    ctx.bezierCurveTo(-26, 12, -26, -6, -18, -20);
    ctx.bezierCurveTo(-15, -28, -8, -36, 4, -40); // Crest
    ctx.lineTo(8, -36);
    // Forehead & snout
    ctx.bezierCurveTo(14, -32, 26, -26, 32, -16);
    ctx.bezierCurveTo(34, -12, 32, -6, 26, -4);
    // Mouth notch
    ctx.lineTo(16, -2);
    ctx.bezierCurveTo(10, 2, 6, 8, 8, 14);
    // Chest slope
    ctx.bezierCurveTo(14, 20, 22, 24, 24, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Eye
    ctx.beginPath();
    ctx.arc(14, -20, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#1e293b' : '#f8fafc';
    ctx.fill();

    // Mane cuts
    ctx.beginPath();
    ctx.moveTo(-16, -12);
    ctx.lineTo(-6, -8);
    ctx.moveTo(-18, 0);
    ctx.lineTo(-8, 4);
    ctx.moveTo(-20, 12);
    ctx.lineTo(-10, 16);
    ctx.stroke();
  }

  private static drawBishop(ctx: CanvasRenderingContext2D, _isWhite: boolean) {
    this.drawBase(ctx, 35);

    // Body
    ctx.beginPath();
    ctx.moveTo(-24, 28);
    ctx.bezierCurveTo(-16, 15, -12, -2, -14, -15);
    ctx.lineTo(14, -15);
    ctx.bezierCurveTo(12, -2, 16, 15, 24, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mitre collar
    ctx.beginPath();
    ctx.roundRect(-17, -18, 34, 6, 2);
    ctx.fill();
    ctx.stroke();

    // Mitre oval head
    ctx.beginPath();
    ctx.ellipse(0, -30, 15, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Diagonal cut
    ctx.beginPath();
    ctx.moveTo(3, -40);
    ctx.lineTo(-6, -26);
    ctx.stroke();

    // Finial pommel ball
    ctx.beginPath();
    ctx.arc(0, -48, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  private static drawRook(ctx: CanvasRenderingContext2D, _isWhite: boolean) {
    this.drawBase(ctx, 36);

    // Tower torso
    ctx.beginPath();
    ctx.moveTo(-24, 28);
    ctx.bezierCurveTo(-20, 12, -18, -4, -18, -14);
    ctx.lineTo(18, -14);
    ctx.bezierCurveTo(18, -4, 20, 12, 24, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cornice rim
    ctx.beginPath();
    ctx.roundRect(-24, -19, 48, 6, 2);
    ctx.fill();
    ctx.stroke();

    // Castle battlements (crenels)
    ctx.beginPath();
    ctx.moveTo(-23, -19);
    ctx.lineTo(-23, -36);
    ctx.lineTo(-14, -36);
    ctx.lineTo(-14, -28);
    ctx.lineTo(-6, -28);
    ctx.lineTo(-6, -36);
    ctx.lineTo(6, -36);
    ctx.lineTo(6, -28);
    ctx.lineTo(14, -28);
    ctx.lineTo(14, -36);
    ctx.lineTo(23, -36);
    ctx.lineTo(23, -19);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Masonry groove
    ctx.beginPath();
    ctx.moveTo(-16, 4);
    ctx.lineTo(16, 4);
    ctx.stroke();
  }

  private static drawQueen(ctx: CanvasRenderingContext2D, _isWhite: boolean) {
    this.drawBase(ctx, 38);

    // Torso
    ctx.beginPath();
    ctx.moveTo(-26, 28);
    ctx.bezierCurveTo(-18, 12, -14, -6, -16, -18);
    ctx.lineTo(16, -18);
    ctx.bezierCurveTo(14, -6, 18, 12, 26, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Waist ring
    ctx.beginPath();
    ctx.roundRect(-20, -21, 40, 6, 2);
    ctx.fill();
    ctx.stroke();

    // Radial Coronet Crown
    ctx.beginPath();
    ctx.moveTo(-24, -21);
    ctx.lineTo(-25, -38); // Point 1
    ctx.lineTo(-13, -28);
    ctx.lineTo(-8, -42);  // Point 2
    ctx.lineTo(0, -29);
    ctx.lineTo(8, -42);   // Point 3
    ctx.lineTo(13, -28);
    ctx.lineTo(25, -38);  // Point 4
    ctx.lineTo(24, -21);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crown pearls on peaks
    const pearlX = [-25, -8, 8, 25];
    const pearlY = [-38, -42, -42, -38];
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(pearlX[i], pearlY[i], 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  private static drawKing(ctx: CanvasRenderingContext2D, _isWhite: boolean) {
    this.drawBase(ctx, 39);

    // Torso
    ctx.beginPath();
    ctx.moveTo(-27, 28);
    ctx.bezierCurveTo(-19, 12, -15, -6, -17, -18);
    ctx.lineTo(17, -18);
    ctx.bezierCurveTo(15, -6, 19, 12, 27, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crown collar
    ctx.beginPath();
    ctx.roundRect(-21, -21, 42, 6, 2);
    ctx.fill();
    ctx.stroke();

    // Royal domed cap
    ctx.beginPath();
    ctx.arc(0, -28, 18, Math.PI * 0.85, Math.PI * 2.15);
    ctx.fill();
    ctx.stroke();

    // Cross Pattée Finial
    const crossTop = -48;
    ctx.beginPath();
    // Vertical beam
    ctx.moveTo(-3, -33);
    ctx.lineTo(-3, crossTop);
    ctx.lineTo(3, crossTop);
    ctx.lineTo(3, -33);
    // Horizontal beam
    ctx.moveTo(-9, -41);
    ctx.lineTo(-9, -45);
    ctx.lineTo(9, -45);
    ctx.lineTo(9, -41);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
