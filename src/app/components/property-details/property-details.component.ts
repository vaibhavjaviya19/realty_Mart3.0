import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { PropertydetailsService } from '../service/propertydetails.service';
import { IsverifiedService } from '../service/isverified.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { environment } from 'src/environments/environment';
import { Title, Meta } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Fancybox } from "@fancyapps/ui";
import { ActivityTrackerService } from '../service/activitytracker.service';
import { GeolocationService } from '../service/geolocation.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { SeoService } from 'src/app/seo.service';

declare var bootstrap: any;
declare const google: any;

interface City {
  cid: number;
  cname: string;
}

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],
  providers: [DatePipe]
})
export class PropertyDetailsComponent implements OnInit {
  @ViewChild('otpModel') otpModel!: ElementRef;
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;
   @ViewChild('mainSlider', { static: false }) mainSlider!: SlickCarouselComponent;
  @ViewChild('thumbSlider', { static: false }) thumbSlider!: SlickCarouselComponent;
  private apiUrl: string = environment.apiUrl;
  private apiKey = 'AIzaSyD-iX9GMP2C8Tsz4hOM3qksvMHyzLSXLxA';
  private textSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  private placeDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
  formDataphone: any = {
    contactusername: '',
    contactuseremail: '',
    contactcountrycode: 'IN +91',
    contactcontact_no: null,
    contactproperty_for: '', // Initialize with an empty string,
    contactotp: '',
    termsContactAccepted: false
  };
  // formDataphone: any = {countrycode: '+91',};
  // formData = {
  //   user_id: 5,
  //   property_id: 0,
  // };
  formData : any = {
    username: '', // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    countrycode: 'IN +91', // Initialize with an empty string
    contact_no: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string,
    otp: '',
  };
activeSection:any;
  singleproperty: any;
  singlepropertyData: any;
  verifyData: any;
  verifyProperty:any;
  verifyPropertyData:any;
  verify: any;
  verifySimilarPropertyData:any;
  verifySimilarProperty:any;
  nearByPropertyData:any;
  nearByProperty:any;
  whoLikePropertyData:any;
  whoLikeProperty:any;
  nameError:boolean=false;
  emailError:boolean=false;
  phoneError:boolean=false
  otpError: boolean = false;
  nameContactError:boolean=false;
  emailContactError:boolean=false;
  phoneContactError:boolean=false;
  termsError:boolean=false;
  termsContactError:boolean=false;
  isResendEnabled = false;
  isMobileNumberDisabled: boolean = false;
  isSubmitting = false;
  openModel = 0;
  remainingTime: number = 60;
  private timer: any;
  googleReviews: any;
  reviews: any[] | null = null;
  placeDetails: any = null;
  placeName: string = '';
  errorMessage: string | null = null;
  checkToken:any;
  is_token:boolean=false;
  city: string = '';
  city1:City[]=[];
  validcityforselected:any;
  filteredGallery: string[] = [];
  constructor(
    private propertyDetailService: PropertydetailsService,
    private verifyservice: IsverifiedService,
    private activityTrackerService: ActivityTrackerService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private location: Location,
    private datePipe: DatePipe,
    private toastr:ToastrService,
    private elementRef: ElementRef,
    private titleService: Title,
    private metaService: Meta,
    private geolocationService: GeolocationService,
    private seoService:SeoService
  ) {}

  slideConfig3 = {
    slidesToShow:4,
    slidesToScroll: 4,
    dots: true,
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
        breakpoint: 768,  // Max width 1024px
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 480,  // Max width 1024px
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
        }
      },
    ],
  };

  ngOnInit(): void {
     const name = this.route.snapshot.paramMap.get('name');
  const id = this.route.snapshot.paramMap.get('id');

  this.seoService.setCanonicalURL(
    `https://www.realtymart.com/property-details/${name}/${id}`
  );
    this.fetchPropertyDetails();
    this.fetchVerifiedProperty();
    this.fetchSimilarProperty();
    this.fetchNearByOtherProperty();
    // this.loadisverified();
    this.fetchWhoLiked();
    this.loadGoogleMapsScript();
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
    this.observeSections();
    this.detectActiveSectionOnScroll();
  }
  ngAfterViewInit(): void {
    Fancybox.bind('[data-fancybox="gallery"]', {
    });
  }

  checkLoggedIn() {
  this.checkToken = localStorage.getItem('myrealtylogintoken');
    if(this.checkToken){
      this.is_token= true;
    } else {
      this.is_token= false;
    }
  }


  private loadGoogleMapsScript(): void {
    if (typeof google === 'undefined' || !google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCSTCnateoFfNtpPRtURlnEroMPDL0Bxs8&libraries=places`;
      script.async = false;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
      };

      script.onerror = () => {
        this.errorMessage = 'Error loading Google Maps API.';
      };
    }
  }

  queryPlaceByName(placeName: string): void {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      query: placeName,
      fields: ['place_id', 'name'],
    };

    service.textSearch(request, (results: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const placeId = results[0].place_id;
        this.fetchPlaceDetails(placeId);
      } else {
        this.errorMessage = 'Error: Place not found.';
      }
    });
  }
  fetchPlaceDetails(placeId: string): void {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      placeId: placeId,
      fields: ['name', 'rating', 'reviews'],
    };

    service.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.googleReviews = place;
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
  setMetaTags(title: string, description: string, image: string) {
    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }
  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  // hasKeysOrValues(obj: any): boolean {
  //   return Object.keys(obj).length > 0 &&
  //          !Object.values(obj).every(value => value === null || value === undefined || value === '');
  // }

  hasNonEmptyLandmarks(obj: any): boolean {
  return Object.values(obj).some(arr => Array.isArray(arr) && arr.length > 0);
}


  fetchVerifiedProperty():void {
    const propertyName = this.route.snapshot.paramMap.get('name');
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyName && propertyId) {
    this.verifyservice.verifyProperties(propertyName,propertyId)?.subscribe((res:any) => {
    this.verifyPropertyData = res;
    this.verifyProperty = this.verifyPropertyData.data;
    })
    }
  }

  fetchSimilarProperty():void {
    const propertyName = this.route.snapshot.paramMap.get('name');
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyName && propertyId) {
    this.verifyservice.similarProperties(propertyName,propertyId)?.subscribe((res:any) => {
    this.verifySimilarPropertyData = res;
    this.verifySimilarProperty = this.verifySimilarPropertyData.data;
    })
    }
  }

  fetchNearByOtherProperty():void {
    const propertyName = this.route.snapshot.paramMap.get('name');
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyName && propertyId) {
    this.verifyservice.otherNearByProperties(propertyName,propertyId)?.subscribe((res:any) => {
    this.nearByPropertyData = res;
    this.nearByProperty = this.nearByPropertyData.responseData;
    })
    }
  }

  fetchWhoLiked():void {
    const propertyName = this.route.snapshot.paramMap.get('name');
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyName && propertyId) {
    this.verifyservice.whoLikeProperties(propertyName,propertyId)?.subscribe((res:any) => {
    this.whoLikePropertyData = res;
    this.whoLikeProperty = this.whoLikePropertyData.data;
    })
    }
  }

  fetchPropertyDetails() {
    const propertyName = this.route.snapshot.paramMap.get('name');
    const propertyId = this.route.snapshot.paramMap.get('id');

    if (propertyName && propertyId) {
      this.propertyDetailService
        .getpropertydetail(propertyName, propertyId)
        .subscribe(
          (propertyData: any) => {
            this.singlepropertyData = propertyData;
            this.singleproperty = this.singlepropertyData?.responseData;
            this.setPropertySchema(); 
            this.setMetaTags(this.singleproperty.property_meta_title, this.singleproperty.property_meta_description, this.singleproperty.image);
            this.queryPlaceByName(this.singleproperty.project_name);
            Fancybox.bind('[data-fancybox="gallery"]', { });
          },
          (error: any) => {
            console.error('Error fetching property details:', error);
          }
        );
    }
  }

  setPropertySchema() {

  const schema = {

    "@context": "https://schema.org",

    "@graph": [

      {

        "@type": "RealEstateListing",

        "@id": window.location.href,

        "name":
          `${this.singleproperty.bedroom || ""} BHK ${this.singleproperty.propertytypename || ""} in ${this.singleproperty.project_name || ""}`,

        "url": window.location.href,

        "description":
          this.singleproperty.property_description
            ? this.singleproperty.property_description.replace(/<[^>]*>/g, "")
            : "",

        "image": this.singleproperty.property_img || [],

        "datePosted": this.singleproperty.created_at,

        "mainEntity": {

          "@type": "Residence",

          "name": this.singleproperty.project_name,

          "numberOfRooms": this.singleproperty.bedroom,

          "numberOfBathroomsTotal": this.singleproperty.bathroom,

          "floorSize": {

            "@type": "QuantitativeValue",

            "value": this.singleproperty.super_area,

            "unitCode": "FTK"

          },

          "address": {

            "@type": "PostalAddress",

            "streetAddress": this.singleproperty.property_address,

            "addressLocality": this.singleproperty.property_locality,

            "addressRegion": "Gujarat",

            "addressCountry": "IN"

          }

        },

        "offers": {

          "@type": "Offer",

          "price":

            this.singleproperty.property_price_show == 0
              ? this.singleproperty.total_price
              : "",

          "priceCurrency": "INR",

          "availability": "https://schema.org/InStock"

        },

        "seller": {

          "@type": "Organization",

          "name":
            this.singleproperty.builder_name || this.singleproperty.owner_name

        }

      }

    ]

  };

  this.seoService.setSchema(schema);

}

  resendContactOTP() {
    if (this.isResendEnabled) {
      this.sendOTPContactToMobile(); // Logic to send OTP
      this.startTimer(); // Restart the timer after resending OTP
    }
  }
  onTermsContactChange(event: Event) {
    this.termsContactError = !(event.target as HTMLInputElement).checked;
  }
  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
  }


    fetchCities() {
      this.http.get<{ data: { id: number; name: string }[] }>(`${environment.apiUrl}cities`).subscribe(
        (response: any) => {
          this.city1 = response.responseData.map((city: any) => ({
            cid: city.id,
            cname: city.name1
          }));
          this.validcityforselected = response.validCities;
          const defaultCity = this.city1.find(city => city.cname === this.city);
        },
        (error: any) => {
          console.error('API Error:', error);
        }
      );
    }

  isValidCity(city: string): boolean {
    return this.validcityforselected.includes(city);
  }

  openOTPModal() {
    this.nameError = false;
    this.phoneError = false;
    this.emailError = false;
    this.termsError = false;

    if(!this.formData.username) {
      this.nameError=true;
    }
    if(!this.formData.useremail)
    {
      this.emailError=true;
    }
    if(!this.formData.contact_no)
    {
      this.phoneError=true;
    }
    if (!this.formData.termsAccepted) {
      this.termsError = true;
    }

    if(this.nameError || this.phoneError || this.emailError || this.termsError)
    {
      return;
    }
    if (this.phoneError) {
      return; // Don't open modal if phone number is invalid
    }
    this.sendOTPToMobile(); // Call this to send OTP to mobile
  }
  verifyOTP() {
    if(this.formData.otp == ''){
      this.toastr.error('Please Enter OTP');
      return
    }

    this.http
      .post(
        `${this.apiUrl}verifyinquiryotp`,
        this.formData
      )
      .subscribe(
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
            //   this.emailError ||
            //   this.termsError
            // ) {
            //   return;
            // }
            // else {
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
  resendOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }

  sendOTPToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formData.contact_no,
      })
      .subscribe(
        (response: any) => {
          if(response.data=='ok') {
          this.startTimer();
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
        else {
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

  submitEnquiry(){
    // this.nameError = false;
    // this.phoneError = false;
    // this.emailError = false;

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

    // if(this.nameError || this.phoneError || this.emailError)
    // {
    //   return;
    // }
    this.spinner.show();
    const payload = {
      contact_no: this.formData.contact_no,
      propertyid: this.singleproperty.id,
      project_Id: this.singleproperty.project_id,
      builder_id: this.singleproperty.builder_id,
      agent_id: this.singleproperty.agent_id,
      username: this.formData.username,
      useremail: this.formData.useremail,
      leads_type: 'Property',
      leads_for: this.singleproperty.property_for,
      receiver_user_id: this.singleproperty.user_id,
      countrycode: '',
      request_price: 0,
      location: this.city,
      // contact_no :this.formData.contact_no,
      // useremail:this.formData.useremail,
      // username:this.formData.username,
      // project_Id:'',
      // builder_id:'',
      // leads_type:'Project',
      // leads_for:'',
      // receiver_user_id:'',
      // countrycode:'',
      // request_price:0,
    }
        const token = localStorage.getItem('myrealtylogintoken');

                 const headers = new HttpHeaders()
                   .set('Authorization', `Bearer ${token}`)
                   .set('Accept', 'application/json');
    this.http.post(`${this.apiUrl}storeinquiry`,payload,{headers}).subscribe((response:any)=> {
      if (response.status === true) {
        this.activityTrackerService.logActivity('Inquiry stored for property','');
        this.toastr.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
        if(!token){
          this.resetForm();
        }
        }
    },
  (error)=> {
    console.log('Error sending data',error)
  });
  }

  resetForm() {
    this.formData = {
      username: '',
      useremail: '',
      contact_no: ''
    };
    this.nameError = false;
    this.phoneError = false;
    this.emailError = false;
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

  validateName(event:any)
  {
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

  validateContactName(event:any)
  {
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
      !validFormatPattern.test(inputValue) ||        // Check if it's 10 digits
      !allIdenticalPattern.test(inputValue) ||       // Reject if all identical digits
      sequentialPattern.test(inputValue) ||          // Reject if sequential
      mirroredPattern.test(inputValue)               // Reject if mirrored/palindromic
    ) {
      this.phoneContactError =true;
    } else {
      this.phoneContactError= false;
      // this.sendOTPToMobile();
    }
  }

  submitFormPhone() {
    
    this.spinner.show();
    const payload = {
      propertyid: this.singleproperty.id,
      project_Id: this.singleproperty.project_id,
      builder_id: this.singleproperty.builder_id,
      agent_id: this.singleproperty.agent_id,
      contact_no : this.formDataphone.contactcontact_no,
      username: this.formDataphone.contactusername,
      useremail: this.formDataphone.contactuseremail,
      leads_type: 'Builder',
      leads_for: this.singleproperty.property_for,
      receiver_user_id: this.singleproperty.user_id,
      countrycode: '',
      request_price: 0,
      location: this.city,
      // contact_no :this.formDataphone.contactcontact_no,
      // useremail:this.formDataphone.contactuseremail,
      // username:this.formDataphone.contactusername
    }
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http.post(`${this.apiUrl}storeinquiry`,payload,{headers})
      .subscribe((response: any) => {
        if (response.status === true) {
          this.activityTrackerService.logActivity('Inquiry stored for builder','');
        this.toastr.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
        const modalElement = document.getElementById('get-builder');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }
      }
      if(!token){
        this.resetContactForm();
      }
      }, (error) => {
        console.error('Error sending data', error);
      });
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

  openContactOTPModal() {
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;

    if(!this.formDataphone.contactusername) {
      this.nameContactError=true;
    }
    if(!this.formDataphone.contactuseremail)
    {
      this.emailContactError=true;
    }
    if(!this.formDataphone.contactcontact_no)
    {
      this.phoneContactError=true;
    }
    if (!this.formDataphone.termsContactAccepted) {
      this.termsContactError = true;
    }
    if(this.nameContactError || this.phoneContactError || this.emailContactError || this.termsContactError)
    {
      return;
    }
    this.sendOTPContactToMobile();

    let contactModal = document.getElementById('contact-owner');
    let contactBuilderModal = document.getElementById('get-builder');
    let otpModal = document.getElementById('#otpContactModel');


    if (contactModal) {
      let bsModal = bootstrap.Modal.getInstance(contactModal);
      bsModal?.hide();
    }
    if (contactBuilderModal) {
      let bsModal = bootstrap.Modal.getInstance(contactBuilderModal);
      bsModal?.hide();
    }

    // Show the OTP modal
    if (otpModal) {
      let otpModalInstance = new bootstrap.Modal(otpModal);
      otpModalInstance.show();
    }
  }

  sendOTPContactToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formDataphone.contactcontact_no,
      })
      .subscribe(
        (response: any) => {
          if(response.data=='ok') {
          this.startTimer();
          if (response.status === true) {
            // this.sendOTPToMobile();
            const modalElement = this.otpContactModel.nativeElement;
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            this.toastr.success('OTP Sent Successfully.');
          }
          if (response.code === 101) {
            this.toastr.warning(response.message);
          }
        }
        else {
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

  verifyContactOTP() {
    if(this.formDataphone.contactotp == ''){
      this.toastr.error('Please Enter OTP');
      return
    }
    let payload  = {
      contact_no:this.formDataphone.contactcontact_no,
      otp:this.formDataphone.contactotp,
    }
    this.http
      .post(
        `${this.apiUrl}verifyinquiryotp`,
        payload
      )
      .subscribe(
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

            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            // if (
            //   this.nameContactError||
            //   this.phoneContactError ||
            //   this.emailContactError ||
            //   this.termsContactError
            // ) {
            //   return;
            // }
            // else{
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

  // submitForm() {
  //   this.http.post('https://realtymart.com/backend/api/storesaveproperty', this.formData)
  //     .subscribe(
  //       (response) => {
  //         // Reload the current page
  //         window.location.reload();
  //       },

  //       (error) => {
  //         console.error('Error sending data', error);
  //         // Handle the error gracefully, e.g., display an error message to the user
  //       }
  //     );
  // }

  // loadisverified(): void {
  //   this.verifyservice.verifiedget()?.subscribe((verifyData: any) => {
  //     this.verifyData = verifyData;
  //     this.verify = this.verifyData?.responseData?.isverified;
  //   });
  // }

  slideConfig1 = {
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1535,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  mainSliderConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: '.thumb-slider',
  };

  thumbSliderConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.main-slider',
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    infinity:true
  };

  goToSlide(index: number) {
    this.mainSlider.slickGoTo(index);
  }

   observeSections() {
      const sections = document.querySelectorAll('#description,#aboutProject,#amenities,#landmark,#nearbyProperties,#reviews');
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
        return observer.observe(section)});
    }
  
    isManualScroll: boolean = false;
    scrollToSection(sectionId: string): void {
  const section = document.getElementById(sectionId);
  const navbar = document.getElementById('navbar');

  if (section && navbar) {
    const navbarHeight = navbar.offsetHeight;
    const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
    const scrollMargin = 130;
    const scrollToPosition = sectionPosition - navbarHeight - scrollMargin;

    // Set active tab first
    this.activeSection = sectionId;

    // Block scroll spy from changing it during animation
    this.isManualScroll = true;

    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth',
    });

    // Allow scroll spy again after scroll finishes
    setTimeout(() => {
      this.isManualScroll = false;
    }, 800); // 800ms is safe for smooth scroll
  }
}
  
  
    @HostListener('window:scroll', ['$event'])
    onWindowScroll(): void {
      this.checkScroll()
      this.detectActiveSectionOnScroll();
    }
    checkScroll() {
      const navbar = document.getElementById("navbar");
      const sticky = navbar?.offsetTop;
  
      if (window.pageYOffset > sticky!) {
        navbar?.classList.add("sticky");
      } else {
        navbar?.classList.remove("sticky");
      }
    }
    detectActiveSectionOnScroll(): void {
      if (this.isManualScroll) return;
      const sections = [
        { id: 'description', element: document.getElementById('description') },
        { id: 'aboutProject', element: document.getElementById('aboutProject') },
        { id: 'amenities', element: document.getElementById('amenities') },
        { id: 'landmark', element: document.getElementById('landmark') },
        { id: 'nearbyProperties', element: document.getElementById('nearbyProperties') },
        { id: 'reviews', element: document.getElementById('reviews') },
      ];
  
      const navbar = document.getElementById('navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
  
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const offset = rect.top - navbarHeight - 120; // Adjust this margin as needed
  
          if (offset <= 0 && rect.bottom > navbarHeight) {
            this.activeSection = section.id;
            break;
          }
        }
      }
    }
}
