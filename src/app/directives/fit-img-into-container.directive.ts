import { Directive, DoCheck, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFitImgIntoContainer]'
})
export class FitImgIntoContainerDirective implements DoCheck {
  private isTriggered: boolean = false;
  private nativeElement;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.nativeElement = this.elRef.nativeElement;
  }

  ngDoCheck() {
    this.setClass();
  }

  private setClass() {
    if (!this.isTriggered) {
      const height = this.elRef.nativeElement.offsetHeight;
      if (height > 546) {
        this.renderer.addClass(this.nativeElement, 'post-image-tall');
      }
    }
  }

}
