import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropertyservicesService } from '../../components/service/propertyservices.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { GeolocationService } from '../service/geolocation.service';
import { HeaderService } from '../service/header.service';
import { CountryCodeInputComponent } from 'src/app/common/country-code-input/country-code-input.component';
import { SeoService } from 'src/app/seo.service';
declare var google: any;
interface ApiResponse {
  status: boolean;
  data: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule, CommonModule, CountryCodeInputComponent, RouterLink],
})
export class LoginComponent implements OnInit {
  private apiUrl: string = environment.apiUrl;
  [x: string]: any;
  propertyget: any;
  data: any;
  result: any = {};
  showPassword = false;
  contact_no: string = '';
  isOtpGenerated: boolean = false;
  enteredOtp: string = '';
  isOtpValid: boolean = false;
  generatedOtp: string = '';
  loading: boolean = false;
  locationCookie: any;
  latitude: any;
  cookie_location: any;
  longitude: any;
  showContactError: boolean = false;
  isMobileNumberDisabled: boolean = false;
  city: any;
  locationFooter: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private PropertyservicesService: PropertyservicesService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private location: Location,
    private toastr: ToastrService,
    private geolocationService: GeolocationService,
    private headerService: HeaderService,
    private seoService: SeoService
  ) {
    this.setMetaTags('User Login in RealtyMart', '');
    this.getLocation();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);

    this.PropertyservicesService.propertyget()?.subscribe((data) => {
      this.propertyget = data;
      this.result = this.propertyget['responseData'];
    });
    this.spinner.show();
  }
  // meta title
  setMetaTags(title: string, description: string) {
    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    // this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    // this.metaService.updateTag({ name: 'twitter:image', content: image });
  }

  ngOnInit() {
    this.seoService.setCanonicalURL(
      'https://www.realtymart.com/login'
    );
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.route.navigate(['/']);
    }
    this.setLoginSchema();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.spinner.hide();
      this.loading = true;
    }, 3000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFormSubmit(form: any) {
    if (form.valid) {
    }
  }

  generateOtp(contact_no: any) {
    if (contact_no?.length !== 10 || !/^\d+$/.test(contact_no)) {
      this.showContactError = true;
      return;
    }
    const otpLength = 6;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp = otp.substring(0, otpLength);
    this.isOtpValid = false;

    this.http
      .post(`${this.apiUrl}generateotp`, { contact_no: this.contact_no })
      .subscribe(
        (response: any) => {
          if (response?.code == 1) {
            this.toastr.error('The mobile number you entered is not registered!');
          } else if (response?.code == 2) {
            this.toastr.error("Your Profile is under review. You can log in once it's approved.!");
          } else if (response.status === false) {
            this.toastr.error(response.message);
          }
          else {
            this.isMobileNumberDisabled = true;
            this.isOtpGenerated = true;
          }
        },
        (error) => {
          console.error('Error generating OTP:', error);
        }
      );
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validContactNumber(event: any) {
    const inputValue = event.target.value;
    const phonePattern = /^[0-9]{10}$/;
    this.showContactError = !phonePattern.test(inputValue);
  }

  validateOtp(contact_no: string, otp: any) {
    if (otp?.length != 4) {
      this.toastr.error('Please Enter 4 Digit OTP');
      return;
    }

    const enteredOtp = parseInt(otp, 10);

    const url = `${this.apiUrl}validateotp`;
    const data = { contact_no: contact_no, otp: enteredOtp, location: this.locationFooter };

    this.http.post<ApiResponse>(url, data).subscribe(
      (response: any) => {
        if (response && response.status === true) {
          localStorage.setItem('myrealtylogintoken', response.data.token);
          localStorage.setItem('contact_no', response.data.contact_no);
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('email', response.data.email);
          this.headerService.triggerRefresh();
          this.toastr.success('Login successfully!');

          const redirectUrl = localStorage.getItem('redirectAfterAuth');
          if (redirectUrl) {
            localStorage.removeItem('redirectAfterAuth');
            this.route.navigate([redirectUrl]);
          } else {
            this.route.navigate(['/']);
          }
        } else if (response && response.code == 1) {
          this.toastr.error('Invalid OTP');
        }
      },
      (error) => {
        this.toastr.error(error.error.message);
      }
    );
  }

  // logout() {
  //   localStorage.removeItem('myrealtylogintoken');
  //   localStorage.removeItem('userId');
  //   localStorage.removeItem('email');
  //   localStorage.removeItem('contact_no');
  //   localStorage.removeItem('role');
  //   localStorage.removeItem('name');
  //   localStorage.removeItem('sessionId');
  //   const currentUrl = this.location.path();
  //   if (currentUrl == '') {
  //     window.location.reload();
  //   } else {
  //     this.route.navigate(['/']);
  //   }
  // }

  getregistereddata(information: any): void {
    this.http.post(`${this.apiUrl}register`, information).subscribe(
      (response: any) => {
        const currentUrl = this.location.path();
        if (currentUrl == '/') {
          window.location.reload();
        } else {
          this.route.navigate(['/']);
        }
      },
      (error: any) => {
        console.error('Error sending data', error);
      }
    );
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.locationFooter = this.latitude + ', ' + this.longitude;
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported by this browser.');
    }
  }
  setLoginSchema() {

    const schema = {

      "@context": "https://schema.org",

      "@graph": [

        {

          "@type": "WebPage",

          "@id": "https://www.realtymart.com/login",

          "url": "https://www.realtymart.com/login",

          "name": "Login | RealtyMart",

          "description": "Login to your RealtyMart account securely using your mobile number and OTP to access your property listings, saved properties and account dashboard.",

          "isPartOf": {

            "@type": "WebSite",

            "name": "RealtyMart",

            "url": "https://www.realtymart.com"

          },

          "publisher": {

            "@type": "Organization",

            "name": "Intelliworkz Business Solutions Pvt. Ltd.",

            "brand": {

              "@type": "Brand",

              "name": "RealtyMart"

            },

            "url": "https://www.realtymart.com"

          },

          "mainEntity": {

            "@id": "https://www.realtymart.com/login#app"

          }

        },

        {

          "@type": "WebApplication",

          "@id": "https://www.realtymart.com/login#app",

          "name": "RealtyMart Login",

          "applicationCategory": "BusinessApplication",

          "operatingSystem": "Web",

          "url": "https://www.realtymart.com/login",

          "description": "Secure OTP-based login for RealtyMart users.",

          "provider": {

            "@type": "Organization",

            "name": "Intelliworkz Business Solutions Pvt. Ltd."

          }

        }

      ]

    };

    this.seoService.setSchema(schema);

  }
}
