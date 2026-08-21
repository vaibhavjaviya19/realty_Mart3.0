import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { ProjectdetailsService } from '../service/projectdetails.service';
import { IssponsoredService } from '../service/issponsored.service';
import { IsverifiedService } from '../service/isverified.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Fancybox } from '@fancyapps/ui';
import { Title, Meta } from '@angular/platform-browser';
import { error } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { GeolocationService } from '../service/geolocation.service';
declare var bootstrap: any;
declare const google: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface City {
  cid: number;
  cname: string;
}
@Component({
  selector: 'app-project-featured',
  templateUrl: './project-featured.component.html',
  styleUrls: ['./project-featured.component.css'],
  providers: [DatePipe],
})
export class ProjectFeaturedComponent implements OnInit {
  private apiKey = 'AIzaSyD-iX9GMP2C8Tsz4hOM3qksvMHyzLSXLxA';
  private textSearchUrl =
    'https://maps.googleapis.com/maps/api/place/textsearch/json';
  private placeDetailsUrl =
    'https://maps.googleapis.com/maps/api/place/details/json';
  @ViewChild('otpModel') otpModel!: ElementRef;
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  @ViewChild('descriptionElem') descriptionElem!: ElementRef;
  @Input() item: any;
  @Input() latitude!: any;
  @Input() longitude!: any;
  private _album: any[] = [];
  singleproject: any;
  singleprojectData: any;
  sponsorData: any;
  sponsor: any;
  verifyData: any;
  verify: any;
  currentSection: any;
  showMore: any;
  activeSection: any = 'overview';
  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  nameContactError: boolean = false;
  emailContactError: boolean = false;
  phoneContactError: boolean = false;
  termsError: boolean = false;
  termsContactError: boolean = false;
  isMobileNumberDisabled: boolean = false;
  isSubmitting = false;
  formData: any = {
    username: '', // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    countrycode: 'IN +91', // Initialize with an empty string
    contact_no: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string,
    otp: '',
    termsAccepted: false,
  };
  formDataphone: any = {
    contactusername: '',
    contactuseremail: '',
    contactcountrycode: 'IN +91',
    contactcontact_no: null,
    contactproperty_for: '', // Initialize with an empty string,
    contactotp: '',
    termsContactAccepted: false,
  };
  otpError: boolean = false;
  isResendEnabled = false;
  openModel = 0;
  remainingTime: number = 60;
  private timer: any;
  googleReviews: any;
  reviews: any[] | null = null;
  placeDetails: any = null;
  placeName: string = '';
  errorMessage: string | null = null;
  checkToken: any;
  is_token: boolean = false;
  city: any;
  city1: City[] = [];
  validcityforselected: any;
  allImages: any;
  mapUrl!: SafeResourceUrl;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private _lightbox: Lightbox,
    private route: ActivatedRoute,
    private projectDetailService: ProjectdetailsService,
    private http: HttpClient,
    private sponsorservice: IssponsoredService,
    private verifyservice: IsverifiedService,
    private location: Location,
    // private toastr: ToastrModule,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activityTrackerService: ActivityTrackerService,
    private geolocationService: GeolocationService,
    private sanitizer: DomSanitizer
  ) {
    this._album.push({
      src: 'assets/images/advertisement.png',
      caption: 'Image 1',
    });
  }

  categoryDisplayNames: { [key: string]: string } = {
    educationalinstitute: 'Educational Institute',
    shoppingcentre: 'Shopping Centre',
    hospital: 'Hospital',
    commercialhub: 'Commercial Hub',
  };

  hasKeysOrValues(obj: any): boolean {
    return Object.keys(obj).some((key) => obj[key] && obj[key].length > 0);
  }

  showReadMore: boolean = false;
  isReadMore: boolean = false;
  charLimit: number = 20;

  private loadGoogleMapsScript(): void {
    if (typeof google === 'undefined' || !google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCSTCnateoFfNtpPRtURlnEroMPDL0Bxs8&libraries=places`;
      script.async = false;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {};

      script.onerror = () => {
        this.errorMessage = 'Error loading Google Maps API.';
      };
    }
  }

  queryPlaceByName(placeName: string): void {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      query: placeName,
      fields: ['place_id', 'name'],
    };

    service.textSearch(request, (results: any, status: any) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results.length > 0
      ) {
        const placeId = results[0].place_id;
        this.fetchPlaceDetails(placeId);
      } else {
        this.errorMessage = 'Error: Place not found.';
      }
    });
  }

  fetchPlaceDetails(placeId: string): void {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    const request = {
      placeId: placeId,
      fields: ['name', 'rating', 'reviews'],
    };

    service.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.googleReviews = place;
        console.log(this.googleReviews);

        this.errorMessage = null;
        this.reviews = place.reviews || [];
        this.placeDetails = {
          name: place.name,
          rating: place.rating,
        };
      } else {
        this.errorMessage = `Error retrieving place details: ${status}`;
      }
    });
  }

  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  openLightbox(index: number = 0): void {
    this._lightbox.open(this._album, index);
  }

  activeButton: string = 'buy';

  setActiveButton(button: string) {
    this.activeButton = button;
  }

  // Properties  slider

  slideConfig1 = {
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 768, // Max width 1024px
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  // Properties  slider

  // units_featured slider

  slideConfig2 = {
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 520, // Max width 1024px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // units_featured slider

  // gallery slider

  slideConfig3 = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 768, // Max width 1024px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520, // Max width 1024px
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480, // Max width 1024px
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  // gallery slider

  // Properties  slider

  slideConfig4 = {
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 520, // Max width 1024px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Properties  slider

  // Download Brochure otp

  showOTP: boolean = false;
  otp: string = '';

  center!: google.maps.LatLngLiteral;
  zoom = 15; // You can adjust the zoom level

  ngOnInit() {
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
      this.formDataphone.contactusername = localStorage.getItem('name') || '';
      this.formDataphone.contactuseremail = localStorage.getItem('email') || '';
      this.formDataphone.contactcontact_no = localStorage.getItem('contact_no') || '';
      this.formDataphone.termsContactAccepted = true;
    }
    this.loadGoogleMapsScript();
    this.observeSections();
    this.detectActiveSectionOnScroll();
    this.fetchPropertyDetails();
    // this.loadissponsored();
    // this.loadisverified();
    this.center = {
      // lat: this.singleproject?.latitude,
      // lng: this.singleproject?.longitude,
      lat: this.singleproject?.latitude,
      lng: this.singleproject?.longitude,
    };
    const url =
    `https://www.google.com/maps?q=${this.singleproject?.latitude},${this.singleproject?.longitude}&output=embed`;

  this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    window.onscroll = () => this.checkScroll();
    this.route.fragment.subscribe((fragment) => {
      this.currentSection = fragment;
    });
    const modalElement = document.getElementById('get-builder');
    if (modalElement) {
      modalElement.addEventListener('hide.bs.modal', () => {
        this.resetContactForm();
      });
    }
  }

  checkLoggedIn() {
    this.checkToken = localStorage.getItem('myrealtylogintoken');
    if (this.checkToken) {
      this.is_token = true;
    } else {
      this.is_token = false;
    }
  }

  // hasKeysOrValues(obj: any): boolean {
  //   return Object.keys(obj).length > 0 &&
  //          !Object.values(obj).every(value => value === null || value === undefined || value === '');
  // }

  submitEnquiry() {
    // this.nameError = false;
    // this.phoneError = false;
    // this.emailError = false;
    // this.termsError = false;

    // if(!this.formData.username) {
    //   this.nameError=true;
    // }
    // if(!this.formData.useremail)
    // {
    //   this.emailError=true;
    // }
    // if(!this.formData.contact_no)
    // {
    //   this.phoneError=true;
    // }
    // if (!this.formData.termsAccepted) {
    //   this.termsError = true;
    // }

    // if(this.nameError || this.phoneError || this.emailError || this.termsError)
    // {
    //   return;
    // }
    this.spinner.show();
    const payload = {
      contact_no: this.formData.contact_no,
      useremail: this.formData.useremail,
      username: this.formData.username,
      project_Id: this.singleproject.id,
      builder_id: '',
      leads_type: 'Project',
      leads_for: this.singleproject.property_for,
      receiver_user_id: this.singleproject.user_id,
      countrycode: '',
      request_price: 0,
      location:this.city
    };
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http
      .post(`${this.apiUrl}storeinquiry`, payload, { headers })
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.activityTrackerService.logActivity(
              'Inquiry stored for project',
              ''
            );
            this.toastr.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
            this.resetForm();
          }
        },
        (error) => {
          console.log('Error sending data', error);
        }
      );
  }

  resetForm() {
    this.formData = {
      username: '',
      useremail: '',
      contact_no: '',
    };
    this.nameError = false;
    this.phoneError = false;
    this.emailError = false;
    this.termsError = false;
  }

  openOTPModal() {
    this.nameError = false;
    this.phoneError = false;
    this.emailError = false;
    this.termsError = false;

    if (!this.formData.username) {
      this.nameError = true;
    }
    console.log(this.nameError);

    if (!this.formData.useremail) {
      this.emailError = true;
    }
    if (!this.formData.contact_no) {
      this.phoneError = true;
    }
    if (!this.formData.termsAccepted) {
      this.termsError = true;
    }

    if (
      this.nameError ||
      this.phoneError ||
      this.emailError ||
      this.termsError
    ) {
      return;
    }
    this.sendOTPToMobile(); // Call this to send OTP to mobile
  }

  openContactOTPModal() {
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;

    if (!this.formDataphone.contactusername) {
      this.nameContactError = true;
    }
    if (!this.formDataphone.contactuseremail) {
      this.emailContactError = true;
    }
    if (!this.formDataphone.contactcontact_no) {
      this.phoneContactError = true;
    }
    if (!this.formDataphone.termsContactAccepted) {
      this.termsContactError = true;
    }
    if (
      this.nameContactError ||
      this.phoneContactError ||
      this.emailContactError ||
      this.termsContactError
    ) {
      return;
    }
    this.sendOTPContactToMobile(); // Call this to send OTP to mobile
    let contactModal = document.getElementById('get-builder');
    let otpModal = document.getElementById('otpModel');

    if (contactModal) {
      let bsModal = bootstrap.Modal.getInstance(contactModal);
      bsModal?.hide();
    }

    // Show the OTP modal
    if (otpModal) {
      let otpModalInstance = new bootstrap.Modal(otpModal);
      otpModalInstance.show();
    }
  }

  verifyContactOTP() {
    if (this.formDataphone.contactotp == '') {
      this.toastr.error('Please Enter OTP');
      return;
    }
    let payload = {
      contact_no: this.formDataphone.contactcontact_no,
      otp: this.formDataphone.contactotp,
    };
    this.http.post(`${this.apiUrl}verifyinquiryotp`, payload).subscribe(
      (response: any) => {
        if (response.status == true) {
          // this.toastr.success('OTP verified successfully.');
          const modalElement = this.otpContactModel.nativeElement;
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          } else {
            const newModal = new bootstrap.Modal(modalElement);
            newModal.hide();
          }
          this.submitFormPhone();
          this.isResendEnabled = false;
          this.isMobileNumberDisabled = true;

          // Optional: Delay for user feedback before hiding
          setTimeout(() => {
            this.spinner.hide();
          }, 1000); // Adjust the delay as needed
          // if (
          //   this.nameContactError||
          //   this.phoneContactError ||
          //   this.emailContactError
          // ) {
          //   return;
          // }
          // else {
          //   this.submitFormPhone();
          // }
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

  verifyOTP() {
    if (this.formData.otp == '') {
      this.toastr.error('Please Enter OTP');
      return;
    }

    this.http.post(`${this.apiUrl}verifyinquiryotp`, this.formData).subscribe(
      (response: any) => {
        if (response.status == true) {
          // this.toastr.success('OTP verified successfully.');
          const modalElement = this.otpModel.nativeElement;
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          } else {
            const newModal = new bootstrap.Modal(modalElement);
            newModal.hide();
          }
          this.submitEnquiry();
          this.isResendEnabled = false;
          this.isMobileNumberDisabled = true;

          // Optional: Delay for user feedback before hiding
          setTimeout(() => {
            this.spinner.hide();
          }, 1000); // Adjust the delay as needed
          // if (
          //   this.nameError||
          //   this.phoneError ||
          //   this.emailError
          // ) {
          //   return;
          // }
          // else{
          //   this.submitEnquiry();
          // }

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

  sendOTPToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formData.contact_no,
      })
      .subscribe(
        (response: any) => {
          if (response.data == 'ok') {
            this.startTimer();
            if (response.status === true) {
              // this.sendOTPToMobile();
              const modalElement = this.otpModel.nativeElement;
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
              this.toastr.success('OTP sent successfully.');
            }
            if (response.code === 101) {
              this.toastr.warning(response.message);
            }
          } else {
            this.phoneError = true;
          }
          this.spinner.hide();
        },
        (error) => {
          this.toastr.error('Failed to send OTP.');
          console.error('Error sending OTP', error);
          this.spinner.hide();
        }
      );
  }
  sendOTPContactToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formDataphone.contactcontact_no,
      })
      .subscribe(
        (response: any) => {
          if (response.data == 'ok') {
            this.startTimer();
            if (response.status === true) {
              // this.sendOTPToMobile();
              const modalElement = this.otpContactModel.nativeElement;
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
              this.toastr.success('OTP sent successfully.');
            }
            if (response.code === 101) {
              this.toastr.warning(response.message);
            }
          } else {
            this.phoneContactError = true;
          }
          this.spinner.hide();
        },
        (error) => {
          this.toastr.error('Failed to send OTP.');
          console.error('Error sending OTP', error);
          this.spinner.hide();
        }
      );
  }
  resendOTP() {
    if (this.isResendEnabled) {
      this.sendOTPToMobile(); // Logic to send OTP
      this.startTimer(); // Restart the timer after resending OTP
    }
  }

  resendContactOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }

  validateCharInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputElement = event.target as HTMLInputElement;

    // Prevent space as the first character
    if (charCode === 32 && inputElement.value.length === 0) {
      event.preventDefault();
    }

    // Allow only alphabets (A-Z, a-z) and spaces (except first character)
    if (
      (charCode < 65 || (charCode > 90 && charCode < 97) || charCode > 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow numeric characters (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateName(event: any) {
    const inputValue = event.target.value;
    const companyPattern = /^[a-zA-Z\s]+$/;
    this.nameError = !companyPattern.test(inputValue);
  }

  validateEmail(event: any) {
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.emailError = !emailPattern.test(inputValue);
  }

  validatePhoneNumber(event: any) {
    const inputValue = event.target.value;

    const validFormatPattern = /^[0-9]{10}$/;
    const allIdenticalPattern = /^(?!([0-9])\1{9})[0-9]{10}$/;
    const sequentialPattern = /^(0123456789|9876543210|1234567890|0987654321)$/;
    const mirroredPattern = /^(.)(.)(.)(.)(.).?\5\4\3\2\1$/;

    if (
      !validFormatPattern.test(inputValue) || // Check if it's 10 digits
      !allIdenticalPattern.test(inputValue) || // Reject if all identical digits
      sequentialPattern.test(inputValue) || // Reject if sequential
      mirroredPattern.test(inputValue) // Reject if mirrored/palindromic
    ) {
      this.phoneError = true; // Display error
    } else {
      this.phoneError = false; // Valid number
      // this.sendOTPToMobile();
    }
  }

  observeSections() {
    const sections = document.querySelectorAll(
      '#overview,#properties,#aboutProject, #amenities,#project-detail,#locality,#developer'
    );
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Section is considered active if 50% is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, observerOptions);
    sections.forEach((section) => {
      return observer.observe(section);
    });
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    const navbar = document.getElementById('navbar');

    if (section && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const scrollMargin = 130;
      // const scrollToPosition = sectionPosition - navbarHeight ;
      const scrollToPosition = sectionPosition - navbarHeight - scrollMargin;

      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
      });
      this.activeSection = sectionId;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.checkScroll();
    this.detectActiveSectionOnScroll();
  }
  checkScroll() {
    const navbar = document.getElementById('navbar');
    const sticky = navbar?.offsetTop;

    if (window.pageYOffset > sticky!) {
      navbar?.classList.add('sticky');
    } else {
      navbar?.classList.remove('sticky');
    }
  }

  detectActiveSectionOnScroll(): void {
    const sections = [
      { id: 'overview', element: document.getElementById('overview') },
      { id: 'properties', element: document.getElementById('properties') },
      { id: 'aboutProject', element: document.getElementById('aboutProject') },
      { id: 'amenities', element: document.getElementById('amenities') },
      {
        id: 'project-detail',
        element: document.getElementById('project-detail'),
      },
      { id: 'locality', element: document.getElementById('locality') },
      { id: 'developer', element: document.getElementById('developer') },
    ];

    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    for (const section of sections) {
      if (section.element) {
        const rect = section.element.getBoundingClientRect();
        const offset = rect.top - navbarHeight - 150; // Adjust this margin as needed

        if (offset <= 0 && rect.bottom > navbarHeight) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  validateContactCharInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode !== 32 && charCode < 65 && charCode > 57) ||
      (charCode > 90 && charCode < 97) ||
      charCode > 122
    ) {
      event.preventDefault();
    }
  }

  validateContactNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow numeric characters (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateContactName(event: any) {
    const inputValue = event.target.value;
    const companyPattern = /^[a-zA-Z\s]+$/;
    this.nameContactError = !companyPattern.test(inputValue);
  }

  validateContactEmail(event: any) {
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.emailContactError = !emailPattern.test(inputValue);
  }
  validateContactPhoneNumber(event: any) {
    const inputValue = event.target.value;
    const validFormatPattern = /^[0-9]{10}$/;
    const allIdenticalPattern = /^(?!([0-9])\1{9})[0-9]{10}$/;
    const sequentialPattern = /^(0123456789|9876543210|1234567890|0987654321)$/;
    const mirroredPattern = /^(.)(.)(.)(.)(.).?\5\4\3\2\1$/;

    if (
      !validFormatPattern.test(inputValue) || // Check if it's 10 digits
      !allIdenticalPattern.test(inputValue) || // Reject if all identical digits
      sequentialPattern.test(inputValue) || // Reject if sequential
      mirroredPattern.test(inputValue) // Reject if mirrored/palindromic
    ) {
      this.phoneContactError = true;
    } else {
      this.phoneContactError = false;
      // this.sendOTPToMobile();
    }
  }

  fetchCities() {
    this.http
      .get<{ data: { id: number; name: string }[] }>(
        `${environment.apiUrl}cities`
      )
      .subscribe(
        (response: any) => {
          this.city1 = response.responseData.map((city: any) => ({
            cid: city.id,
            cname: city.name,
          }));
          this.validcityforselected = response.validCities;
          const defaultCity = this.city1.find(
            (city) => city.cname === this.city
          );
        },
        (error: any) => {
          console.error('API Error:', error);
        }
      );
  }

  isValidCity(city: string): boolean {
    return this.validcityforselected.includes(city);
  }

  updateCity(city: string) {
    this.city = city;
    localStorage.setItem('location', city);
  }

  fetchPropertyDetails() {
    const projectName = this.route.snapshot.paramMap.get('name');
    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectName && projectId) {
      this.projectDetailService
        .getprojectdetail1(projectName, projectId)
        .subscribe(
          (projectData: any) => {
            this.singleprojectData = projectData;
            this.singleproject = this.singleprojectData?.data;
            // Set meta tags and title
            this.setMetaTags(
              this.singleproject.project_meta_title,
              this.singleproject.project_meta_description,
              this.singleproject.image
            );
            this.queryPlaceByName(this.singleproject.project_name);
            this.allImages = [
              ...(this.singleproject.project_images || []),
              ...(this.singleproject.project_images_3d || []),
              ...(this.singleproject.project_master_plan_3d || []),
              ...(this.singleproject.project_location_plan_3d || []),
              ...(this.singleproject.project_floor_plan_3d || []),
              ...(this.singleproject.project_master_plan || []),
              ...(this.singleproject.project_location_plan || []),
              ...(this.singleproject.project_floor_plan || [])
            ];
            Fancybox.bind('[data-fancybox="gallery"]', {});
          },
          (error: any) => {
            console.error('Error fetching project details:', error);
          }
        );
    }
  }
  // meta title
  setMetaTags(title: string, description: string, image: string) {
    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }

  submitFormPhone() {
    // this.nameContactError = false;
    // this.phoneContactError = false;
    // this.emailContactError = false;
    // this.termsContactError = false;

    // if(!this.formDataphone.contactusername) {
    //   this.nameContactError=true;
    // }
    // if(!this.formDataphone.contactuseremail)
    // {
    //   this.emailContactError=true;
    // }
    // if(!this.formDataphone.contactcontact_no)
    // {
    //   this.phoneContactError=true;
    // }
    // if (!this.formDataphone.termsContactAccepted) {
    //   this.termsContactError = true;
    // }
    // if(this.nameContactError || this.phoneContactError || this.emailContactError || this.termsContactError)
    // {
    //   return;
    // }
    this.spinner.show();
    const payload = {
      contact_no: this.formDataphone.contactcontact_no,
      useremail: this.formDataphone.contactuseremail,
      username: this.formDataphone.contactusername,
      project_Id: this.singleproject.id,
      builder_id: '',
      leads_type: 'Project',
      leads_for: this.singleproject.property_for,
      receiver_user_id: this.singleproject.user_id,
      countrycode: '',
      request_price: 0,
      location:this.city
    };
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http
      .post(`${this.apiUrl}storeinquiry`, payload, { headers })
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.activityTrackerService.logActivity(
              'Inquiry stored for project',
              ''
            );
            this.toastr.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
            const modalElement = document.getElementById('get-builder');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
            this.resetContactForm();
          }
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
  }

  resetContactForm() {
    this.formDataphone = {
      contactusername: '',
      contactuseremail: '',
      contactcontact_no: '',
    };
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;
  }

  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
  }
  onTermsContactChange(event: Event) {
    this.termsContactError = !(event.target as HTMLInputElement).checked;
  }

  getRoundedValue(value: number): number {
    return Math.round(value);
  }

  // loadissponsored(): void {
  //   this.sponsorservice.sponsorget()?.subscribe((sponsorData: any) => {
  //     this.sponsorData = sponsorData;
  //     this.sponsor = this.sponsorData?.responseData?.issponsored;
  //   });
  // }

  // loadisverified(): void {
  //   this.verifyservice.verifiedget()?.subscribe((verifyData: any) => {
  //     this.verifyData = verifyData;
  //     this.verify = this.verifyData?.responseData?.isverified;
  //   });
  // }

  // objectKeys(obj: any): string[] {
  //   return Object.keys(obj);
  // }

  submitForm(form: any) {
    this.showOTP = true;
  }

  getLandmarkCategories(): any[] {
    return Object.entries(this.singleproject.landmarksnearproject).map(
      ([key, value]) => ({
        category: key,
        landmarks: value,
      })
    );
  }

  getLandmarkEntries() {
    return Object.entries(this.singleproject.landmarksnearproject);
  }
  // toggleShowMore(category: string): void {
  //   this.showMore[category] = !this.showMore[category];
  // }
}
