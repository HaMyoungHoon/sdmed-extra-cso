import { Pipe, PipeTransform } from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: "safeHtml",
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string | undefined): any {
    if (value === undefined) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
