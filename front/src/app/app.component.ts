import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

interface Accents {
  [key: string]: { code: string; name: string }[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private httpClient: HttpClient, private cdr: ChangeDetectorRef) {}
  formData: any = {};
  languageOptions = [
    { code: 'af', name: 'Afrikaans' },
    { code: 'ar', name: 'Arabic' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'ca', name: 'Catalan' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'et', name: 'Estonian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hr', name: 'Croatian' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'it', name: 'Italian' },
    { code: 'iw', name: 'Hebrew' },
    { code: 'ja', name: 'Japanese' },
    { code: 'jw', name: 'Javanese' },
    { code: 'km', name: 'Khmer' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ko', name: 'Korean' },
    { code: 'la', name: 'Latin' },
    { code: 'lv', name: 'Latvian' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ms', name: 'Malay' },
    { code: 'my', name: 'Myanmar (Burmese)' },
    { code: 'ne', name: 'Nepali' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sq', name: 'Albanian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'su', name: 'Sundanese' },
    { code: 'sv', name: 'Swedish' },
    { code: 'sw', name: 'Swahili' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tl', name: 'Filipino' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Mandarin/Taiwan)' },
    { code: 'zh', name: 'Chinese (Mandarin)' },
  ];
  accentsLaguages = ['en', 'fr', 'pt', 'es'];
  accents: Accents = {
    en: [
      { code: 'com.au', name: 'Australia' },
      { code: 'com.uk', name: 'United Kingdom' },
      { code: 'us', name: 'United States' },
      { code: 'ca', name: 'Canada' },
      { code: 'co.in', name: 'India' },
      { code: 'ie', name: 'Ireland' },
      { code: 'co.za', name: 'South Africa' },
    ],
    fr: [
      { code: 'fr', name: 'France' },
      { code: 'ca', name: 'Canada' },
    ],
    pt: [
      { code: 'com.br', name: 'Brazil' },
      { code: 'pt', name: 'Portugal' },
    ],
    es: [
      { code: 'es', name: 'Spain' },
      { code: 'com.mx', name: 'Mexico' },
      { code: 'us', name: 'United States' },
    ],
  };
  title = 'front';
  audioResult: any = null;
  file: File | null = null;

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
    }
  }

  onSubmit() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      formData.append('languageIn', this.formData.sourceLanguage);
      formData.append('languageOut', this.formData.destinyLanguage);
      formData.append('tld', this.formData.destinyAccent);
      this.audioResult = null;
      this.httpClient.post('http://localhost:8000/upload/', formData).subscribe(
        (res: any) => {
          this.audioResult = res['audio_file'];
          this.cdr.detectChanges();
        },
        (err) => {
          console.log(err);
          alert(err.error.detail);
        }
      );
    }
  }

  onDestinySelect() {
    this.formData.destinyAccent = null;
  }
  getAccentsForLanguage(languageCode: string) {
    return this.accents[languageCode] || [];
  }
}
