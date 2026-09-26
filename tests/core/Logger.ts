export class Logger {
  private lines: string[] = [];

  info(msg: string): void {
    this.push('INFO', msg);
  }

  step(msg: string): void {
    this.push('STEP', msg);
  }

  error(msg: string): void {
    this.push('ERROR', msg);
  }

  private push(level: string, msg: string): void {
    this.lines.push(`[${new Date().toISOString()}] ${level}: ${msg}`);
  }

  getText(): string {
    return this.lines.join('\n');
  }

  flush(): void {
    this.lines = [];
  }
}
