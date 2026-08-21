import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Title, Meta } from '@angular/platform-browser';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SeoService } from 'src/app/seo.service';
declare var bootstrap: any;

@Component({
  selector: 'app-builder-listing',
  templateUrl: './builder-listing.component.html',
  styleUrls: ['./builder-listing.component.css'],
})
export class BuilderListingComponent implements OnInit{
  @ViewChild('otpModel') otpModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  allbuilderprojectData: any;
  allbuilderprojectcount: any;
  allbuilderproject: any = [];
  itemsPerPage = 20;
  totalPages = 0;
  isExpanded = false;
  // paginatedData: any[] = [];
  // currentPage: number = 1;
  // pageSize: number = 5;
  // totalItems: number = 0;
  // itemsPerPage = 5;
  // visiblePageStart: number = 1;
  // visiblePageCount: number = 5;

  initialListCount = 5;
  builderToLoad = 5;
  loading: boolean = false;
  lastPage: any;
  currentPage: number = 1;
  isLoading: any;
  scrollTimeout: any;
  proj_id: any;
  contactData: any;
  contact: any;
  singleProp: any;
  is_token: boolean = false;
  formData: any = {
    username: '',
    useremail: '',
    countrycode: 'IN +91',
    contact_no: null,
    property_for: '',
    otp: '',
    termsAccepted: false,
  };
  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  otpError: boolean = false;
  isResendEnabled = false;
  termsError: boolean = false;
  isMobileNumberDisabled: boolean = false;
  openModel = 0;
  city: any;
  remainingTime: number = 60;
  private timer: any;
  isSubmitting = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private activityTrackerService: ActivityTrackerService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public http: HttpClient,
    private route: ActivatedRoute,
    private seoService:SeoService
  ) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
    }
  }
  ngOnInit(): void {
    this.city = this.route.snapshot.paramMap.get('city');
    
      this.seoService.setCanonicalURL(
        window.location.href
      );
    this.loadAllBuilders();
  }

  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
  }
  submitForm() {
    this.spinner.show();

    const payload = this.contact.property
      ? {
          contact_no: this.formData.contact_no,
          useremail: this.formData.useremail,
          username: this.formData.username,
          project_Id: this.contact?.property?.project_id,
          property_id: this.contact?.property?.property_id,
          builder_id: this.contact?.property?.builder_id,
          agent_id: this.contact?.property?.agent_id,
          receiver_user_id: this.contact?.property?.user_id,
          leads_type: 'Call for Price',
          leads_for: 'Property',
          location: this.city,
        }
      : {
          contact_no: this.formData.contact_no,
          useremail: this.formData.useremail,
          username: this.formData.username,
          project_Id: this.contact?.project?.project_id,
          builder_id: this.contact?.project?.builder_id,
          agent_id: this.contact?.project?.agent_id,
          receiver_user_id: this.contact?.project?.user_id,
          leads_type: 'Call for Price',
          leads_for: 'Project',
          location: this.city,
        };
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .post(`${environment.apiUrl}storeinquiry`, payload, { headers })
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.activityTrackerService.logActivity(
              `Inquiry stored for ${
                this.contact.property ? 'property' : 'project'
              }`,
              ''
            );
            this.toastr.success('Inquiry Addeded successfully!');
            const modalElement = document.getElementById('contact-owner');
            const modalElementProp =
              document.getElementById('contact-owner-prop');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
            if (modalElementProp) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElementProp);
              modalInstance?.hide();
            }
            this.resetForm();
          }
        },
        (error) => {
          console.error('Error sending data', error);
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
    // Reset errors
    this.nameError = false;
    this.phoneError = false;
    this.emailError = false;
    this.termsError = false;

    // Validation checks
    if (!this.formData.username) {
      this.nameError = true;
    }
    if (!this.formData.useremail) {
      this.emailError = true;
    }
    if (!this.formData.contact_no) {
      this.phoneError = true;
    }
    if (!this.formData.termsAccepted) {
      this.termsError = true;
    }

    // Stop function execution if any error exists
    if (
      this.nameError ||
      this.phoneError ||
      this.emailError ||
      this.termsError
    ) {
      return;
    }

    this.sendOTPToMobile();

    let contactModal = document.getElementById('contact-owner-prop');
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

  resendOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }

  verifyOTP() {
    if (this.formData.otp == '') {
      this.toastr.error('Please Enter OTP');
      return;
    }
    let payload = {
      contact_no: this.formData.contact_no,
      otp: this.formData.otp,
    };

    this.http.post(`${environment.apiUrl}verifyinquiryotp`, payload).subscribe(
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
          this.submitForm();
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

  sendOTPToMobile() {
    this.spinner.show();
    this.http
      .post(`${environment.apiUrl}genrateinquiryotp`, {
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
              this.toastr.success('OTP Sent Successfully.');
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

  contactowner(propertyid: any) {
    this.proj_id = propertyid;
    this.http.get(`${environment.apiUrl}contactowner/${propertyid}`).subscribe(
      (contactData: any) => {
        this.contactData = contactData;
        this.contact = this.contactData?.data;
      },
      (error: any) => {
        // Handle the error as needed
      }
    );
  }

  fetchProperty(property: any) {
    this.singleProp = property;
  }

  toggleExpand() {  
    this.isExpanded = !this.isExpanded;
  }
  loadAllBuilders(): void {
    const cityName = this.route.snapshot.paramMap.get('city');
    // if (this.isLoading || this.currentPage > this.lastPage) return;

    const lastElement = document.querySelectorAll('.topahmedabad');
    const lastItem = lastElement[lastElement.length - 1];
    const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

    if (cityName) {
      this.http
        .get<any>(
          `${environment.apiUrl}allbuilderlisting/${cityName}?page=${this.currentPage}`
        )
        .subscribe(
          (response) => {

            this.allbuilderproject = this.allbuilderproject || [];
            this.allbuilderproject = response.data?.data || [];
            this.setMetaTags(response.meta.title, response.meta.description);
            this.itemsPerPage = response.data?.per_page || 20; // Get from backend
            this.allbuilderprojectcount = response?.data?.total;
            this.totalPages = Math.ceil(
              this.allbuilderprojectcount / this.itemsPerPage
            );

            this.lastPage = response.data?.last_page;
          },
          (error) => {
            console.error('Error fetching properties:', error);
            this.isLoading = false;
            this.loading = false;
          }
        );
    }
  }

  onPageChange(page: number): void {

    this.currentPage = page;
    
    this.loadAllBuilders();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
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
}
