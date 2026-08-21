import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../service/header.service';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  SlickCarouselComponent,
  SlickCarouselModule,
} from 'ngx-slick-carousel';
import { environment } from '../../../environments/environment';
import { CountryCodeInputComponent } from 'src/app/common/country-code-input/country-code-input.component';
import { SeoService } from 'src/app/seo.service';
declare var bootstrap: any;

@Component({
  // selector: 'app-demo',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, SlickCarouselModule, CommonModule, CountryCodeInputComponent],
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;
  @ViewChild('otpModel') otpModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  slideConfig = {
    slidesToShow: 10,
    slidesToScroll: 10,
    // centerMode:true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    space: 10,
    responsive: [
      {
        breakpoint: 1365, // For screens smaller than 1024px
        settings: {
          slidesToShow: 9, // Show 2 slides on medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // For screens smaller than 1024px
        settings: {
          slidesToShow: 8, // Show 2 slides on medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 580, // For screens smaller than 1024px
        settings: {
          slidesToShow: 7, // Show 2 slides on medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For screens smaller than 1024px
        settings: {
          slidesToShow: 5, // Show 2 slides on medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 380, // For screens smaller than 1024px
        settings: {
          slidesToShow: 4, // Show 2 slides on medium screens
          slidesToScroll: 1,
        },
      },
    ],
  };
  isMobileNumberDisabled: boolean = false;
  states: any;
  countries: any;
  servicess: any;
  citys: any;
  servicesnames: any;
  servicesimgss: any;
  isSubmitting = false;
  phoneError: boolean = false;
  AltPhoneError: boolean = false;
  emailError: boolean = false;
  emailErrorMessage:string='';
  register_as: boolean = false;
  companyError: boolean = false;
  companyErrorMessage: string = "";
  personError: boolean = false;
  designationError: boolean = false;
  registerError: boolean = false;
  countryError: boolean = false;
  serviceTypeError: boolean = false;
  stateError: boolean = false;
  cityError: boolean = false;
  pincodeError: boolean = false;
  otpError: boolean = false;
  isResendEnabled = false;
  openModel = 0;
  selectedService: string = '';
  remainingTime: number = 60;
  isLoading = true;
  private timer: any;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private route: Router,
    private seoService:SeoService,
    private headerService: HeaderService
  ) {
    this.country();
    this.services();
    this.servicesimg();
    this.servicess = 0;
  }

  ngOnInit(): void {
    this.seoService.setCanonicalURL(window.location.href);
  }

  ngAfterViewInit(): void {
    this.seoService.setSchema({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Register | RealtyMart",
      "url": window.location.href,
      "description": "Register on RealtyMart as a Builder, Agent, Owner or Service Provider and grow your business."
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }



  startTimer() {
    this.isResendEnabled = false;
    this.remainingTime = 60;
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
        this.isResendEnabled = true;
      }
    }, 1000);
  }



  servicesdisplay() {
    this.registerError = false;
    this.servicess = 1;
  }
  servicesnotdisplay() {
    this.registerError = false;
    this.servicess = 0;
    this.formData.register_type = '';
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow numeric characters (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  // validateCharInput(event: KeyboardEvent) {
  //   const charCode = event.which ? event.which : event.keyCode;
  //   if (
  //     (charCode >= 48 && charCode <= 57) ||
  //     (charCode !== 32 && charCode < 65 && charCode > 57) ||
  //     (charCode > 90 && charCode < 97) ||
  //     charCode > 122
  //   ) {
  //     event.preventDefault();
  //   }
  // }

  validateCharInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    const isLetter = (charCode >= 65 && charCode <= 90) || // Uppercase A-Z
    (charCode >= 97 && charCode <= 122)  // Lowercase a-z
    const isSpace = charCode === 32;

    // Prevent spaces at the beginning or multiple consecutive spaces
    if (isSpace) {
      if (inputValue.length === 0 || inputValue.endsWith(" ")) {
        event.preventDefault();
        return;
      }
    }

    // Prevent symbols
    if (!isLetter && !isSpace) {
      event.preventDefault();
    }

  }


  validateCompanyCharInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Allow letters (a-z, A-Z), numbers (0-9), and specific symbols
    const allowedSymbols = "!@#$%^&*()_+={}[\\]:;\"'<>,.?/-";
    const isLetterOrNumber = (charCode >= 48 && charCode <= 57) || // Numbers 0-9
                             (charCode >= 65 && charCode <= 90) || // Uppercase A-Z
                             (charCode >= 97 && charCode <= 122);  // Lowercase a-z
    const isAllowedSymbol = allowedSymbols.includes(event.key);

    // Prevent multiple consecutive spaces and space at the start or end
    const isSpace = charCode === 32;
    if (isSpace) {
      if (inputValue.length === 0 || inputValue.endsWith(" ")) {
        event.preventDefault();
        return;
      }
    }

    // Prevent invalid characters
    if (!isLetterOrNumber && !isAllowedSymbol && !isSpace) {
      event.preventDefault();
    }
  }


  validatePhoneNumber(event: any) {
    const inputValue = event.target.value;

    const validFormatPattern = /^[0-9]{10}$/;
    const allIdenticalPattern = /^(?!([0-9])\1{9})[0-9]{10}$/;
    const sequentialPattern = /^(0123456789|9876543210|1234567890|0987654321)$/;
    const mirroredPattern = /^(.)(.)(.)(.)(.).?\5\4\3\2\1$/;

    if (
      !validFormatPattern.test(inputValue) ||        // Check if it's 10 digits
      !allIdenticalPattern.test(inputValue) ||       // Reject if all identical digits
      sequentialPattern.test(inputValue) ||          // Reject if sequential
      mirroredPattern.test(inputValue)               // Reject if mirrored/palindromic
    ) {
      this.phoneError = true; // Display error
    } else {
      this.phoneError = false; // Valid number
      // this.sendOTPToMobile();
    }
  }

  openOTPModal() {
    this.registerError = false;
    this.serviceTypeError = false;
    this.companyError = false;
    this.phoneError = false;
    this.emailError = false;

    if (!this.formData.register_as) {
      this.registerError = true;
    }

    if (
      (this.formData.register_as === 'service-provider' || this.servicess === 1) &&
      (!this.formData.register_type || this.formData.register_type === '' || this.formData.register_type === 'Select Service Type')
    ) {
      this.serviceTypeError = true;
    }

    if (!this.formData.comapny_name || this.formData.comapny_name.trim() === '') {
      this.companyError = true;
      if (this.formData.register_as === 'User') {
        this.companyErrorMessage = 'Please enter user name.';
      } else {
        this.companyErrorMessage = 'Please enter company name.';
      }
    }

    if (!this.formData.mobile_no || this.phoneError) {
      this.phoneError = true;
    }

    if (!this.formData.email || this.emailError || this.formData.email.trim() === '') {
      this.emailError = true;
      if (!this.formData.email || this.formData.email.trim() === '') {
        this.emailErrorMessage = 'Please enter email address.';
      }
    }

    if (
      this.registerError ||
      this.serviceTypeError ||
      this.companyError ||
      this.personError ||
      this.designationError ||
      this.phoneError ||
      this.emailError
    ) {
      return;
    }
    this.sendOTPToMobile(); // Call this to send OTP to mobile
  }
  // closeOTPModal() {
  //   console.log('close in');
  //   const modalElement = this.otpModel.nativeElement;
  //   const bootstrapModal = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
  //   if (bootstrapModal) {
  //     bootstrapModal.hide();
  //   } else {
  //     // If the modal instance is not available, create and show it
  //     const newModal = new bootstrap.Modal(modalElement);
  //     newModal.hide();
  //   }
  // }

  validateAlternatePhoneNumber(event: any) {
    const inputValue = event.target.value;
    const phonePattern = /^[0-9]{10}$/;
    this.AltPhoneError = !phonePattern.test(inputValue);
  }


  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  validateEmail(event: any) {
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!inputValue || inputValue.trim() === '') {
      this.emailErrorMessage = "Please enter email address.";
      this.emailError = true;
      return;
    }
    if (!emailPattern.test(inputValue)) {
      if (inputValue.startsWith(" ") || inputValue.endsWith(" ")) {
        this.emailErrorMessage = "Spaces are not allowed in the email address.";
      } else {
        this.emailErrorMessage = "Invalid email address format.";
      }
      this.emailError = true;
    } else {
      this.emailError = false;
      this.emailErrorMessage = "";
    }
  }



  validateUserName(event: any) {
    let inputValue = event.target.value;
    if (!inputValue || inputValue.trim() === '') {
      this.companyErrorMessage = "Please enter user name.";
      this.companyError = true;
      return;
    }
    const namePattern = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;

    if (!namePattern.test(inputValue)) {
      if (event.target.value.startsWith(" ") || event.target.value.endsWith(" ")) {
        this.companyErrorMessage = "Spaces are not allowed at the beginning or end.";
      } else if (/\s{2,}/.test(event.target.value)) {
        this.companyErrorMessage = "Multiple consecutive spaces are not allowed.";
      } else {
        this.companyErrorMessage = "Invalid user name. Only letters and single spaces are allowed.";
      }
      this.companyError = true;
    } else {
      this.companyError = false;
      this.companyErrorMessage = "";
    }

    // Ensure input updates without extra spaces
    event.target.value = inputValue;
  }


  validateCompanyName(event: any) {
    const inputValue = event.target.value;
    if (!inputValue || inputValue.trim() === '') {
      this.companyErrorMessage = "Please enter company name.";
      this.companyError = true;
      return;
    }
    const companyPattern = /^(?! )[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/-]+(?:\s[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/-]+)*(?!\s)$/;

    if (!companyPattern.test(inputValue)) {
      if (inputValue.startsWith(" ") || inputValue.endsWith(" ")) {
        this.companyErrorMessage = "Spaces are not allowed at the beginning or end.";
      } else if (/\s{2,}/.test(inputValue)) {
        this.companyErrorMessage = "Multiple consecutive spaces are not allowed.";
      }
      else {
        this.companyErrorMessage = "Invalid company name.";
      }
      this.companyError = true;
    } else {
      this.companyError = false;
      this.companyErrorMessage = "";
    }
  }

  validatePersonName(event: any) {
    const inputValue = event.target.value;
    const personPattern = /^[a-zA-Z\s]+$/;
    this.personError = !personPattern.test(inputValue);
  }
  validateDesignation(event: any) {
    const inputValue = event.target.value;
    const designationPattern = /^[a-zA-Z\s]+$/;
    this.designationError = !designationPattern.test(inputValue);
  }

 validatePincode(event: any) {
    const inputValue = event.target.value;
    const pincodePattern = /^[0-9]+$/;
    this.pincodeError = !pincodePattern.test(inputValue);
  }
  isRoleSelected(): boolean {
    return this.formData.register_as !== '';
  }

  showSuccess() {
    this.toastr.success('OTP validated successfully!', 'Success');
  }
  formData: any = {
    register_type: '', // Initialize with empty strings
    // state: '',
    // city: '',
    // country:'',
    comapny_name: '',
    contact_person_name: '',
    designation: '',
    mobile_no: '',
    alternate_mobile_no: '',
    email: '',
    register_as: '',
    // pincode: '',
    // terms: '',
    // otpmobile: '',
    otp: '',
  };
  shouldEnableRegisterType(): boolean {
    // Enable if formData.register_as is 'service-provider' and register_type is not empty
    return this.formData.register_as === 'service-provider';
  }
  sendOTPToMobile() {
    this.isLoading = true;
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}sendotp`, {
        mobile_no: this.formData.mobile_no,
      })
      .subscribe(
        (response: any) => {
          if(response.data =='ok') {
            if (response.status === true) {
            // this.sendOTPToMobile();
            const modalElement = this.otpModel.nativeElement;
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            this.toastr.success('OTP Sent Successfully.');
          }
          if (response.code === 101) {
            this.toastr.warning(response.message);
          }
        }
        else if (response.code === 101) {
          this.toastr.warning(response.message);
        }
        else {
          this.phoneError = true;
        }
        this.spinner.hide();
        this.isLoading = false;
        this.startTimer();
        },
        (error) => {
          this.toastr.error('Failed to send OTP.');
          console.error('Error sending OTP', error);
          this.spinner.hide();
          this.isLoading = false;
        }
      );
  }
  resendOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }
  submitForm() {
    // if (
    //     this.formData.comapny_name == '' ||
    //     this.formData.contact_person_name == '' ||
    //     this.formData.designation == '' ||
    //     this.formData.mobile_no == '' ||
    //     this.formData.email == '' ||
    //     this.formData.register_as == '' ||
    //     this.formData.pincode == '' ||
    //     this.formData.country == '' ||
    //     this.formData.state == '' ||
    //     this.formData.city == ''
    // ) {
    //     this.toastr.error('Please fill all the fields');
    //     return;
    // }
    // if (this.servicess == 1 && this.formData.register_type == '') {
    //     this.toastr.error('Please fill all the fields');
    //     return;
    // }
    this.spinner.show();

    // Set the state name properly
    let states = this.formData.state;
    this.formData.state = states?.name;
    this.spinner.show();

    // Send OTP
    // this.isSubmitting = true;
    // this.http.post(
    //     `${this.apiUrl}sendotp`,
    //     this.formData
    // ).subscribe(
    //     (response: any) => {
    //         if (response.status == true) {
    //             this.toastr.success('OTP Sent Successfully.');
    //             this.openOTPModal();
    //             this.openModel = 1; // Open the OTP modal
    //             const modalElement = this.otpmodel.nativeElement;
    //             const modal = new bootstrap.Modal(modalElement);
    //             this.spinner.hide();
    //             modal.show();
    //         } else {
    //             this.toastr.error('Failed to send OTP.');
    //             this.isSubmitting = false; // Reset submission flag if failed
    //         }
    //     },
    //     (error) => {
    //         console.error('Error sending OTP', error);
    //         this.isSubmitting = false; // Reset submission flag on error
    //     }
    // );
  }

  verifyOTP() {
    if(this.formData.otp == ''){
      this.toastr.error('Please Enter OTP');
      return
    }

    this.http
      .post(
        `${this.apiUrl}matchOtp`,
        this.formData
      )
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.toastr.success('OTP verified successfully.');
            const modalElement = this.otpModel.nativeElement;
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            } else {
              const newModal = new bootstrap.Modal(modalElement);
              newModal.hide();
            }
            // this.submitOTP();
            this.isResendEnabled = false;
            this.isMobileNumberDisabled = true;

            // Optional: Delay for user feedback before hiding
            setTimeout(() => {
              this.spinner.hide();
            }, 1000); // Adjust the delay as needed
            if (
              this.registerError ||
              this.serviceTypeError ||
              this.companyError ||
              this.personError ||
              this.designationError ||
              this.phoneError ||
              this.emailError
            ) {
              return;
            } else {
              this.submitOTP();
            }
            this.spinner.hide();
          } else {
            this.toastr.error('Wrong OTP entered. Please try again.');
            this.isResendEnabled = true;
            this.isSubmitting = false; // Reset submission flag if failed
          }
        },
        (error) => {
          console.error('Wrong OTP entered. Please try again.', error);
          this.isResendEnabled = true;
          this.isSubmitting = false; // Reset submission flag on error
        }
      );
  }

  submitOTP() {
  this.spinner.show();
  this.http
    .post(`${this.apiUrl}inquiryStore`, this.formData)
    .subscribe(
      (response: any) => {
        if (response.status == true) {
          // Auto login
          if (response.data?.token) {
            localStorage.setItem('myrealtylogintoken', response.data.token);
            localStorage.setItem('contact_no', response.data.contact_no);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('email', response.data.email);

            this.headerService.triggerRefresh();
          }

          this.spinner.hide();
          this.toastr.success('Registration successful! Welcome to RealtyMart.');

          // Go to Thank You page
          this.route.navigate(['/thank-you-register']);
        } else if (response.status == false) {
          this.resetForm();
          this.spinner.hide();
          this.toastr.warning(response.message);
        }
      },
      (error) => {
        console.error('Error sending data', error);
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try again.');
      }
    );
  }

  resetForm() {
    this.formData = {
      register_type: '',
      comapny_name: '',
      contact_person_name: '',
      designation: '',
      mobile_no: '',
      alternate_mobile_no: '',
      email: '',
      register_as: '',
      otp: '',
    };
    this.phoneError = false;
    this.AltPhoneError = false;
    this.emailError = false;
    this.companyError = false;
    this.personError = false;
    this.companyError = false;
    this.designationError = false;
    this.registerError = false;
    this.registerError = false;

  }
  country() {
    this.http
      .get(`${this.apiUrl}country`)
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.countries = response.country;
          }
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
  }

  onCountryChange(selectedCountry: { name: any; id: any }) {
    if (selectedCountry) {
      this.state(selectedCountry.id); // Trigger the city function with the appropriate state ID
      this.countryError = false;
    }
  }

  state(event: any) {
    this.http
      .get(`${this.apiUrl}state/${event}`)
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.states = response.state;
          }
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
  }

  onStateChange(selectedState: { name: any; id: any }) {
    if (selectedState) {
      this.city(selectedState.id); // Trigger the city function with the appropriate state ID
      this.stateError = false;
    }
  }

  onCityChange(selectedCity: { name: any; id: any }) {
    if (selectedCity) {
      this.cityError = false;
    }
  }

  city(event: any) {
    this.http
      .get(`${this.apiUrl}city/${event}`)
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.citys = response.city;
          }
        },
        (error) => {
          console.error('Error fetching cities', error);
        }
      );
  }

  // services() {
  //   this.http
  //     .get(`${this.apiUrl}serviceprovider`)
  //     .subscribe(
  //       (response: any) => {
  //         if (response.status === true) {
  //           this.servicesnames = response?.ServiceProvider;
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching property', error);
  //       }
  //     );
  // }

  services() {
    this.http
      .get(
        `${this.apiUrl}serviceprovider`
      )
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.servicesnames = response?.ServiceProvider;
          }
        },
        (error) => {
          console.error('Error fetching property', error);
        }
      );
  }
  servicesimg() {
    this.http
      .get(
        `${this.apiUrl}propertyservices`
      )
      .subscribe(
        (response: any) => {
          if (response.isSuccess === true) {
            this.servicesimgss = response?.responseData;
          }
        },
        (error) => {
          console.error('Error fetching property', error);
        }
      );
  }

  onImageClick(service: any, index: number) {
    // this.selectedService = service.name;
    this.formData.register_type = service.name;
    this.formData.register_as = 'service-provider';

    const slidesToShow = this.slideConfig.slidesToShow || 16;
    const centerIndex = Math.max(0, index - Math.floor(slidesToShow / 2));

    // Call slickGoTo to center the clicked image
    this.slickModal.slickGoTo(centerIndex);

    const serviceProviderRadio = document.getElementById(
      'service-provider'
    ) as HTMLInputElement;
    if (serviceProviderRadio) {
      serviceProviderRadio.checked = true;
    }
  }

  onRadioChange() {
    const serviceProviderRadio = document.getElementById(
      'service-provider'
    ) as HTMLInputElement;

    if (!serviceProviderRadio.checked) {
      // Reset the active image and service selection if service-provider is unchecked
      this.formData.register_type = '';
      this.formData.register_as = '';
    }
  }

  // onProviderChange(event: any) {
  //   const selectedValue = event.target.value;
  //   this.formData.register_type = selectedValue;

  //   const selectedIndex = this.servicesnames.findIndex((service:any) => service.name === selectedValue);

  //   if (selectedIndex !== -1) {
  //     const slidesToShow = this.slideConfig.slidesToShow || 8;
  //     const centerIndex = Math.max(0, selectedIndex - Math.floor(slidesToShow / 2));
  //     this.slickModal.slickGoTo(centerIndex);
  //   }
  // }

  onProviderChange(event: any) {
    this.serviceTypeError = false;
    const selectedValue = event.target.value;
    this.formData.register_type = selectedValue;

    const selectedIndex = this.servicesnames.findIndex(
      (service: any) => service.name === selectedValue
    );

    if (selectedIndex !== -1) {
      const slidesToShow = this.slideConfig.slidesToShow || 8;
      const maxIndex = this.servicesnames.length - 1;

      let centerIndex = Math.max(
        0,
        selectedIndex - Math.floor(slidesToShow / 2)
      );

      if (centerIndex > maxIndex - slidesToShow + 1) {
        centerIndex = Math.max(0, maxIndex - slidesToShow + 1);
      }

      this.slickModal.slickGoTo(centerIndex);
    }
  }
}
