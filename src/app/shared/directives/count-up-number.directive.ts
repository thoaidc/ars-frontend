import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appCountUp]'
})
export class CountUpDirective implements OnInit {
  @Input() endValue: number = 0;
  @Input() duration: number = 2000; // ms

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.animateCount();
  }

  animateCount() {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / this.duration, 1);
      const currentValue = Math.floor(progress * this.endValue);
      const formattedValue = currentValue.toLocaleString('vi-VN');
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', formattedValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}
