import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { ProjectApproveDetailsService } from '../service/projectapprovedetail.service';
import { ProjectdetailsService } from '../service/projectdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
// import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Fancybox } from "@fancyapps/ui";
import { Title, Meta, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { error } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { IssponsoredService } from '../service/issponsored.service';
import { IsverifiedService } from '../service/isverified.service';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { FilteredCities } from 'src/app/filteredcities';
import { CountrycodeService } from '../service/countrycode.service';
import { CountryCodeInputComponent } from 'src/app/common/country-code-input/country-code-input.component';
import flatpickr from 'flatpickr';
import { PropertytyperesidentialService } from '../service/propertytyperesidential.service';
import { PropertytypecommercialService } from '../service/propertytypecommercial.service';
import { PropertytypeothertypesService } from '../service/propertytypeothertypes.service';
import { PropertyplotService } from '../service/propertyplot.service';
import { PropertytypepgService } from '../service/propertytypepg.service';
import { SeoService } from 'src/app/seo.service';
declare var bootstrap: any;

@Component({
  selector: 'app-project-approve-detail',
  templateUrl: './project-approve-detail.component.html',
  styleUrls: ['./project-approve-detail.component.css'],
})
export class ProjectApproveDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('otpModel') otpModel!: ElementRef;
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;
  /** Reference to the flatpickr date-time input element */
  @ViewChild('visitDateTimeInput') visitDateTimeInput!: ElementRef<HTMLInputElement>;
  private apiUrl: string = environment.apiUrl;
  @ViewChild('descriptionElem') descriptionElem!: ElementRef;
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('floorSlickModal') floorSlickModal!: any;


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
  isAtEnd = false;
  isHeaderHidden = false;
  currentSection: any;
  private _activeSection: string = 'overview';
  selectedAction!: "view-contact" | "whatsapp" | "schedule-visit" | "brochure";
  get activeSection(): any {
    return this._activeSection;
  }
  set activeSection(val: any) {
    if (this._activeSection !== val) {
      this._activeSection = val;
      this.scrollActiveNavLinkIntoView();
    }
  }

  scrollActiveNavLinkIntoView(): void {
    setTimeout(() => {
      const navbar = document.getElementById('navbar');
      if (!navbar) return;
      const activeLink = navbar.querySelector('a.active') as HTMLElement;
      const activeLi = activeLink ? activeLink.parentElement : null;
      const scrollContainer = navbar.querySelector('.flore_links') as HTMLElement;

      if (activeLi && scrollContainer) {
        const containerWidth = scrollContainer.offsetWidth;
        const activeOffsetLeft = activeLi.offsetLeft;
        const activeWidth = activeLi.offsetWidth;
        const scrollToX = activeOffsetLeft - (containerWidth / 2) + (activeWidth / 2);

        scrollContainer.scrollTo({
          left: scrollToX,
          behavior: 'smooth'
        });
      }
    }, 50);
  }
  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  nameTouched: boolean = false;
  emailTouched: boolean = false;
  phoneTouched: boolean = false;
  nameContactError: boolean = false;
  emailContactError: boolean = false;
  phoneContactError: boolean = false;
  nameContactTouched: boolean = false;
  emailContactTouched: boolean = false;
  phoneContactTouched: boolean = false;
  termsError: boolean = false;
  termsContactError: boolean = false;
  showReelsView: boolean = false;
  currentSanitizedVideoUrl: SafeResourceUrl | null = null;
  currentVideoSafeUrl: SafeResourceUrl | null = null;
  private sanitizedVideoUrlCache = new Map<string, SafeResourceUrl>();
  lastReelSwitchTime: number = 0;
  activeReelIndex: number = 0;
  isReelsMuted: boolean = false;
  reelsLikedStates: boolean[] = [false, false, false, false, false, false];
  reelsLikesCount: number[] = [124, 87, 245, 56, 189, 93];
  showReelComments: boolean = false;
  showReelDetailCard: boolean = false;
  isSendingOtp: boolean = false;
  isContactSendingOtp: boolean = false;
  isBrochureSendingOtp: boolean = false;
  isMobileNumberDisabled: boolean = false;
  isSubmitting = false;
  enquirySubmitted = false;
  contactEnquirySubmitted = false;
  checkToken: any;
  is_token: boolean = false;
  formData: any = {
    username: '', // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    contact_no: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string,
    otp: '',
    termsAccepted: true
  };
  formDataphone: any = {
    contactusername: '',
    contactuseremail: '',
    contactcontact_no: null,
    contactproperty_for: '', // Initialize with an empty string,
    contactotp: '',
    termsContactAccepted: true
  };
  otpError: boolean = false;
  isResendEnabled = false;
  reels: any[] = [];
  projectReels: any[] = [];
  allReels: any[] = [];
  filteredReels: any[] = [];
  selectedReelCity: any = null;
  selectedReelSearch: string = '';
  seenReelKeys: Set<string> = new Set<string>();
  isFetchingAllProjectsReels: boolean = false;
  lastFetchedCityForFilter: string | null = null;
  cityProjectsMap: { [key: string]: any[] } = {};
  availablePropertyTypes: string[] = ['Flat', 'Bungalow', 'Villa', 'Penthouse', 'Row House', 'Studio', 'Farm House', 'Duplex'];
  defaultPropertyTypes: string[] = ['Flat', 'Bungalow', 'Villa', 'Penthouse', 'Row House', 'Studio', 'Farm House', 'Duplex'];
  availableSegments: string[] = ['Buy', 'Rent', 'Farm House', 'Plots', 'Commercial'];
  availableBHKs: string[] = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'];
  propertyresidential: any[] = [];
  propertycommercial: any[] = [];
  propertyother: any[] = [];
  propertyplot: any[] = [];
  propertypg: any[] = [];
  openModel = 0;
  remainingTime: number = 60;
  scheduleVisitData: any = {
    visitDateTime: '',
    remarks: ''
  };
  scheduleVisitDateTimeError: boolean = false;
  /** Holds the flatpickr instance so we can destroy or open it */
  public visitFlatpickr: any = null;


  // Floor plans – populated from API `floor_plans` array
  floorPlanList: { bhk_type: string; carpet_area: string; sbu?: string; image: string[] }[] = [];
  selectedFloorPlanIndex: number = 0;
  masterPlanList: string[] = [];
  activePlanTab: 'floorPlan' | 'masterPlan' | '' = 'floorPlan';

  get selectedFloorPlan() {
    return this.floorPlanList[this.selectedFloorPlanIndex] || null;
  }

  floorPlanSlideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    infinite: false,
    prevArrow: "<img class='a-left control-c prev slick-prev' src='assets/images/prev.svg'>",
    nextArrow: "<img class='a-right control-c next slick-next' src='assets/images/next.svg'>"
  };

  bannerSlideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: "<img class='a-left control-c prev slick-prev' src='assets/images/prev.svg'>",
    nextArrow: "<img class='a-right control-c next slick-next' src='assets/images/next.svg'>"
  };

  reelsSlideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    autoplay:true,
    arrows: true,
    infinite: false,
    prevArrow: "<img class='a-left control-c prev slick-prev' src='assets/images/prev.svg'>",
    nextArrow: "<img class='a-right control-c next slick-next' src='assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  markerPosition: google.maps.LatLngLiteral = {
    lat: 22.2865,
    lng: 73.1812
  };

  developerProjects: any[] = [];
  developerCardImageIndex: { [key: number]: number } = {};
  private developerCardAutoplayTimer: any = null;

  specifications = [
    {
      title: 'Flooring',
      points: [
        'Italian marble kitchen / dinning / livingroom and full body vitrified tiles in bedrooms'
      ]
    },
    {
      title: 'RCC',
      points: [
        'Quality controlled earth quake resistant, r.c.c. frame structure'
      ]
    },
    {
      title: 'Kitchen',
      points: [
        'Granite platform with ss sink.',
        'Decorative tiles dado up to lintel level.'
      ]
    },
    {
      title: 'Kitchen Wash Area',
      points: [
        'Dado of glazed tiles.',
        'Electric point for washing machine.'
      ]
    },
    {
      title: 'Bathroom Plumbing',
      points: [
        'Sanitary ware & c.p. fitting jaquar / kohler / toto or equivalent.',
        'Floor-antiskid floor tiles with designers wall tiles up to lintel level.'
      ]
    },
    {
      title: 'Doors',
      points: [
        'Main door: flush doors with laminate finish.',
        'Other doors: flush doors.'
      ]
    },
    {
      title: 'Windows',
      points: [
        'Sliders dgu glass.',
        'Full body vitrified'
      ]
    },
    {
      title: 'Electrification',
      points: [
        'Adequate points as per architecture drawings.',
        'Concealed 3 phase electrification with good quality isi copper wire / cable.',
        'Branded modular switches, accessories and distribution board with mcb & elcb.'
      ]
    },
    {
      title: 'Paint',
      points: [
        'Internal walls finished with wall putty.',
        'External walls with textured apex paint.'
      ]
    },
    {
      title: 'Lift',
      points: [
        'Fully automatic elevators.'
      ]
    },
    {
      title: 'Terrace',
      points: [
        'China mosaic with required water proofing on terrace.'
      ]
    }
  ];

  faqs = [
    {
      question: 'How to calculate the value of the property?',
      answer: 'Precision in property valuation demands a skilled touch. When it comes to determining the true worth of your property, enlist the assistance of property valuation professionals. These experts possess a wealth of knowledge regarding the dynamic property market, enabling them to provide you with a precise and well-informed assessment.'
    },
    {
      question: 'What is the fair market value of the property?',
      answer: 'Fair market value is the estimated price at which a property would sell in the open market under normal conditions.'
    },
    {
      question: 'Services included in the home valuation process',
      answer: 'Property inspection, market analysis, area evaluation, legal verification and final valuation report.'
    },
    {
      question: 'Types of property valuation methods',
      answer: 'Sales comparison approach, income approach, cost approach and residual valuation methods.'
    },
    {
      question: 'Documents required for property valuation',
      answer: 'Sale deed, property tax receipts, approved plan, ownership documents and utility bills.'
    }
  ];

  galleryImages = [
    '../../../assets/images/gallary_img.png',
    '../../../assets/images/gallery-2.jpg',
    '../../../assets/images/gallery-3.jpg',
    '../../../assets/images/gallery-4.jpg',
    '../../../assets/images/gallery-5.jpg',
    '../../../assets/images/gallery-6.jpg'
  ];

  showViewer = false;

  currentIndex = 4;

  zoomLevel = 1;
  showThumbnails = true;
  touchStartY = 0;
  touchEndY = 0;
  showFilters = false;
  selectedSegments: string[] = ['Buy'];
  selectedPropertyTypes: string[] = [];
  selectedBHKs: string[] = [];
  city1: { cid: number, cname: string }[] = [];
  priceTooltipVisible: boolean = false;
  showStickyHeader = false;
  isManualScroll: boolean = false;
  countryCode: any;
  otpArray = [0, 1, 2, 3];
  brochureSlideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay:true,
    dots: true,
    arrows: true,
    infinite: false
  };
  brochureOtp: string[] = ['', '', '', ''];

  googleMapUrl =
    'https://www.google.com/maps?q=22.2865,73.1812';
  timer: any;
  isMobileView = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private _lightbox: Lightbox,
    private route: ActivatedRoute,
    private projectApproveDetailService: ProjectApproveDetailsService,
    private projectdetailsService: ProjectdetailsService,
    private http: HttpClient,
    private sponsorservice: IssponsoredService,
    private verifyservice: IsverifiedService,
    private location: Location,
    // private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activityTrackerService: ActivityTrackerService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private countrycodeService: CountrycodeService,
    private seoService: SeoService,
    private propertyresidentialservice: PropertytyperesidentialService,
    private propertycommercialservice: PropertytypecommercialService,
    private propertyotherservice: PropertytypeothertypesService,
    private propertyplotservice: PropertyplotService,
    private propertypgservice: PropertytypepgService
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
    commercialhub: 'Commercial Hub'
  };

  hasKeysOrValues(obj: any): boolean {
    return Object.keys(obj).some(
      key => obj[key] && obj[key].length > 0
    );
  }

  showReadMore: boolean = false;
  isReadMore: boolean = false;
  charLimit: number = 20;
  isAboutExpanded: boolean = false;
  isWhyBuyExpanded: boolean = false;
  isDeveloperExpanded: boolean = false;

  ngAfterViewInit(): void {
    (window as any).__projectDetailActive = true;
    setTimeout(() => this.checkScrollPosition());
    Fancybox.bind('[data-fancybox="gallery"]', {

    });
    Fancybox.bind('[data-fancybox="floor-plans"]', {
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["zoom", "close"],
        },
      },
    });
    Fancybox.bind('[data-fancybox="master-plans"]', {
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["zoom", "close"],
        },
      },
    });

  }

  moveNext(event: Event, index: number) {
    const input = event.target as HTMLInputElement;

    if (input.value && index < this.otpArray.length - 1) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      nextInput?.focus();
    }
  }

  movePrevious(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const digits = pasteData.replace(/\D/g, '').slice(0, 4);

    for (let i = 0; i < this.otpArray.length; i++) {
      if (i < digits.length) {
        this.brochureOtp[i] = digits[i];
      } else {
        this.brochureOtp[i] = '';
      }
    }

    const currentInput = event.target as HTMLInputElement;
    const parent = currentInput.parentElement;
    if (parent) {
      const siblingInputs = Array.from(parent.querySelectorAll('.otp-box')) as HTMLInputElement[];
      const focusIndex = Math.min(digits.length, siblingInputs.length - 1);
      siblingInputs[focusIndex]?.focus();
    }
  }



  playReel(reel: any) {
    console.log(reel);
  }

  getFormattedDate(dateString: string) {
    // return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  openLightbox(index: number = 0): void {
    this._lightbox.open(this._album, index);
  }

  openViewer(index: number = 0): void {
    // Merge all album images into galleryImages if albums are populated
    const allImages = [
      ...this.photoAlbum.map((a: any) => a.src || a),
      ...this.layoutAlbum.map((a: any) => a.src || a),
      ...this.videoAlbum.map((a: any) => a.proj_video_link || a.src || a)
    ];
    if (allImages.length > 0) {
      this.galleryImages = allImages;
    }
    this.currentIndex = index;
    this.updateCurrentVideoSafeUrl();
    this.showViewer = true;
    document.body.style.overflow = 'hidden';
  }

  openPhotoViewer(index: number = 0): void {
    const allImages = [
      ...this.photoAlbum.map((a: any) => a.src || a),
      // ...this.layoutAlbum.map((a: any) => a.src || a)
    ];
    if (allImages.length > 0) {
      this.galleryImages = allImages;
    }
    this.currentIndex = index;
    this.updateCurrentVideoSafeUrl();
    this.showViewer = true;
    document.body.style.overflow = 'hidden';
  }

  openVideoViewer(index: number = 0): void {
    const allVideos = [
      ...this.videoAlbum.map((a: any) => a.proj_video_link)
    ];
    if (allVideos.length > 0) {
      this.galleryImages = allVideos;
    }
    this.currentIndex = index;
    this.updateCurrentVideoSafeUrl();
    this.showViewer = true;
    document.body.style.overflow = 'hidden';
  }

  closeViewer(): void {
    this.showViewer = false;
    this.zoomLevel = 1;
    this.showThumbnails = true;
    this.currentVideoSafeUrl = null;
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    this.updateCurrentVideoSafeUrl();
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
    this.updateCurrentVideoSafeUrl();
  }

  selectImage(index: number): void {
    this.currentIndex = index;
    this.updateCurrentVideoSafeUrl();
  }

  isVideo(url: any): boolean {
    if (!url) return false;
    const urlStr = String(url).toLowerCase();
    return (
      urlStr.includes('youtube.com') ||
      urlStr.includes('youtu.be') ||
      urlStr.includes('vimeo.com') ||
      urlStr.endsWith('.mp4') ||
      urlStr.endsWith('.webm') ||
      urlStr.endsWith('.ogg') ||
      urlStr.endsWith('.mov') ||
      urlStr.includes('.mp4?') ||
      urlStr.includes('.webm?') ||
      urlStr.includes('.ogg?') ||
      urlStr.includes('.mov?')
    );
  }

  isYouTube(url: any): boolean {
    if (!url) return false;
    const urlStr = String(url).toLowerCase();
    return urlStr.includes('youtube.com') || urlStr.includes('youtu.be');
  }

  getThumbnailUrl(url: any): string {
    if (!url) return '';
    if (this.isVideo(url)) {
      // Check if this video has a custom thumbnail in videoAlbum
      const found = this.videoAlbum.find(v => (v.proj_video_link === url));
      if (found && found.proj_video_thumbnail) {
        let thumb = found.proj_video_thumbnail;
        if (!thumb.startsWith('http')) {
          thumb = 'https://realtymart.com/backend/public/images/project_video/' + thumb;
        }
        return thumb;
      }

      if (this.isYouTube(url)) {
        let videoId = '';
        const urlStr = String(url);
        if (urlStr.includes('youtu.be/')) {
          videoId = urlStr.split('youtu.be/')[1].split('?')[0].split('&')[0];
        } else if (urlStr.includes('v=')) {
          videoId = urlStr.split('v=')[1].split('&')[0];
        } else if (urlStr.includes('embed/')) {
          videoId = urlStr.split('embed/')[1].split('?')[0];
        }
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      return 'assets/images/play.svg';
    }
    return url;
  }

  getSanitizedGalleryVideoUrl(url: any): SafeResourceUrl {
    let embedUrl = String(url);
    if (this.isYouTube(url)) {
      let videoId = '';
      const urlStr = String(url);
      if (urlStr.includes('youtu.be/')) {
        videoId = urlStr.split('youtu.be/')[1].split('?')[0].split('&')[0];
      } else if (urlStr.includes('v=')) {
        videoId = urlStr.split('v=')[1].split('&')[0];
      } else if (urlStr.includes('embed/')) {
        videoId = urlStr.split('embed/')[1].split('?')[0];
      }
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&enablejsapi=1`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  updateCurrentVideoSafeUrl(): void {
    const currentUrl = this.galleryImages && this.galleryImages[this.currentIndex];
    if (currentUrl && this.isYouTube(currentUrl)) {
      if (this.sanitizedVideoUrlCache.has(currentUrl)) {
        this.currentVideoSafeUrl = this.sanitizedVideoUrlCache.get(currentUrl) || null;
      } else {
        const sanitized = this.getSanitizedGalleryVideoUrl(currentUrl);
        this.sanitizedVideoUrlCache.set(currentUrl, sanitized);
        this.currentVideoSafeUrl = sanitized;
      }
    } else {
      this.currentVideoSafeUrl = null;
    }
  }

  zoomIn(): void {
    if (this.zoomLevel < 3) {
      this.zoomLevel += 0.25;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.25;
    }
  }

  toggleThumbnails(): void {
    this.showThumbnails = !this.showThumbnails;
  }

  toggleFullscreen(): void {
    const element = document.querySelector('.gallery-overlay');
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  }

  cleanUrl(url: string): string {
    if (!url) return '';
    // Clean up local relative assets containing parent directories (e.g. ../../../assets/...)
    if (url.includes('assets/images/')) {
      const idx = url.indexOf('assets/images/');
      return '/' + url.substring(idx);
    }
    // Make absolute URLs root-relative if they match the current domain host,
    // which eliminates CORS blocks in staging and production environments.
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === window.location.hostname) {
        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      }
    } catch (e) {
      // Already relative or not a valid absolute URL
    }
    return url;
  }

  async downloadCurrentImage(): Promise<void> {
    const rawUrl = this.galleryImages[this.currentIndex];
    if (!rawUrl) return;

    if (this.isYouTube(rawUrl)) {
      this.toastr.warning('Video download is not supported.');
      return;
    }

    const currentUrl = this.cleanUrl(rawUrl);
    const fileName = currentUrl.split('/').pop()?.split('?')[0] || 'project-image.jpg';

    this.toastr.info('Downloading image...');

    const triggerDownload = (url: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const downloadFromBlob = (blob: Blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      triggerDownload(blobUrl);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    };

    // Check if the URL is same-origin (relative path or matches current browser hostname)
    const isSameOrigin = currentUrl.startsWith('/') || currentUrl.includes(window.location.hostname);

    if (isSameOrigin) {
      try {
        const res = await fetch(currentUrl);
        if (res.ok) {
          const blob = await res.blob();
          if (blob && blob.size > 0) {
            downloadFromBlob(blob);
            return;
          }
        }
      } catch (e) { }
    }

    // For cross-origin URLs (e.g. testing localhost against realtymart.com), route through wsrv.nl
    // global image CDN proxy. This prevents red browser console CORS errors and guarantees instant direct download.
    try {
      const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(currentUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 0) {
          downloadFromBlob(blob);
          return;
        }
      }
    } catch (e) { }

    // Fallback proxy 2: corsproxy.io
    try {
      const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(currentUrl)}`;
      const res2 = await fetch(proxyUrl2);
      if (res2.ok) {
        const blob2 = await res2.blob();
        if (blob2 && blob2.size > 0) {
          downloadFromBlob(blob2);
          return;
        }
      }
    } catch (e) { }

    // Fallback proxy 3: codetabs
    try {
      const proxyUrl3 = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(currentUrl)}`;
      const res3 = await fetch(proxyUrl3);
      if (res3.ok) {
        const blob3 = await res3.blob();
        if (blob3 && blob3.size > 0) {
          downloadFromBlob(blob3);
          return;
        }
      }
    } catch (e) { }

    // Final fallback: only safe for same-origin URLs where browser respects the `download` attribute.
    // For cross-origin URLs, browsers IGNORE the `download` attribute and navigate the tab instead.
    // So we intentionally do nothing and show a hint toast.
    if (isSameOrigin) {
      triggerDownload(currentUrl);
    } else {
      this.toastr.warning(
        'Could not download. Right-click the image and choose "Save image as".',
        '',
        { timeOut: 5000 }
      );
    }
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
        breakpoint: 768,  // Max width 1024px
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
        }
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
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
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
    // autoplay: true,
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
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };

  // Properties  slider

  // ===== Brochure Form =====
  brochureMode: string = 'brochure'; // 'brochure' | 'payment'
  brochureFormData: any = { name: '', email: '', mobile: '', termsAccepted: true };
  brochureNameError: boolean = false;
  brochureEmailError: boolean = false;
  brochureMobileError: boolean = false;
  brochureTermsError: boolean = false;
  brochureOtpVisible: boolean = false;
  brochureOtpError: boolean = false;
  brochureNameTouched: boolean = false;
  brochureEmailTouched: boolean = false;
  brochureMobileTouched: boolean = false;
  brochureRegisterVisible: boolean = false;
  isUserRegistered: boolean = false;
  showContactDetails: boolean = false;
  activeContactPopover: 'header' | 'sticky' | 'mobile' | 'sidebar' | null = null;
  pendingContactPopover: 'header' | 'sticky' | 'mobile' | 'sidebar' | null = null;
  lastScrollTop: number = 0;
  isScrollingUp: boolean = false;

  // Download Brochure otp
  showOTP: boolean = false;
  otp: string = '';

  // ===== Gallery =====
  photoAlbum: any[] = [];
  layoutAlbum: any[] = [];
  videoAlbum: any[] = [];
  galleryVisible: boolean = false;
  galleryActiveTab: string = 'photos';
  galleryActiveIndex: number = 0;
  galleryZoom: number = 1;
  galleryFormType: string = ''; // 'contact' | 'brochure' | 'payment' | ''

  // ===== Brochure Images =====
  projectBrochureImages: string[] = [];

  // ===== Gallery Inline Contact Form =====
  galleryContactData: any = { name: '', email: '', mobile: '', termsAccepted: true };
  galleryContactNameErr: boolean = false;
  galleryContactEmailErr: boolean = false;
  galleryContactMobileErr: boolean = false;
  galleryContactTermsErr: boolean = false;
  galleryContactOtpVisible: boolean = false;
  galleryContactOtp: string = '';
  galleryContactOtpErr: boolean = false;
  galleryContactSubmitted: boolean = false;

  get currentAlbum(): any[] {
    if (this.galleryActiveTab === 'layout') return this.layoutAlbum;
    if (this.galleryActiveTab === 'video') return this.videoAlbum;
    return this.photoAlbum;
  }

  // ===== Reviews =====
  projectReviews: any[] = [];
  reviewFormData: any = { review: '', ratings: 0 };
  reviewTextError: boolean = false;
  reviewRatingError: boolean = false;
  hoveredReviewRating: number = 0;

  get averageRating(): number {
    if (!this.projectReviews.length) return 0;
    const sum = this.projectReviews.reduce((acc: number, r: any) => acc + (Number(r.ratings) || 0), 0);
    return parseFloat((sum / this.projectReviews.length).toFixed(1));
  }



  center: google.maps.LatLngLiteral = {
    lat: 22.2865,
    lng: 73.1812
  };
  zoom = 15;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const id = this.route.snapshot.paramMap.get('id');
    this.seoService.setCanonicalURL(window.location.href);
    this.checkScreenSize();
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
    this.fetchProjectApproveDetails();
    this.loadPropertyTypes();
    // this.loadissponsored();
    // this.loadisverified();
    if (this.latitude && this.longitude) {
      this.updateMapCoordinates(this.latitude, this.longitude);
    } else if (this.singleproject?.latitude && this.singleproject?.longitude) {
      this.updateMapCoordinates(this.singleproject.latitude, this.singleproject.longitude);
    }
    this.route.fragment.subscribe(fragment => {
      this.currentSection = fragment;
    });
    const modalElement = document.getElementById('get-builder');
    if (modalElement) {
      modalElement.addEventListener('hide.bs.modal', () => {
        this.resetContactForm();
      });
    }
    this.route.queryParams.subscribe(params => {
      if (params['reels'] === 'true') {
        const index = params['reel'] ? parseInt(params['reel'], 10) : 0;
        this.openReelsView(index);
      }
    });
    this.fetchCities();
  }

  checkLoggedIn() {
    this.checkToken = localStorage.getItem('myrealtylogintoken');
    if (this.checkToken) {
      this.is_token = true;
    }
    else {
      this.is_token = false;
    }
  }

  updateMapCoordinates(latVal: any, lngVal: any) {
    if (latVal && lngVal) {
      const lat = parseFloat(String(latVal).trim());
      const lng = parseFloat(String(lngVal).trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        this.center = { lat, lng };
        this.markerPosition = { lat, lng };
        const query = `${this.singleproject.project_address}`;

        this.googleMapUrl =
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      }
    }
  }

  // scrollToSection(sectionId: string): void {
  //   const section = document.getElementById(sectionId);
  //   if (section) {
  //     section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // }
  checkDescriptionHeight(): void {
    //     const descriptionText = this.item.property_description || '';
    // console.log(descriptionText)
    //     if (descriptionText.length > this.charLimit) {
    //       this.showReadMore = true;
    //     } else {
    //       this.showReadMore = false;
    //     }
  }

  getPlainText(html: string): string {
    if (!html) return '';
    try {
      const div = document.createElement('div');
      div.innerHTML = html;
      return (div.textContent || div.innerText || '').trim();
    } catch (e) {
      return String(html);
    }
  }

  shouldTruncate(html: string, wordLimit: number = 150): boolean {
    const text = this.getPlainText(html);
    if (!text) return false;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    return words.length > wordLimit;
  }

  getPreviewText(html: string, wordLimit: number = 150): string {
    const text = this.getPlainText(html);
    if (!text) return '';
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  goToFloorPlanSlide(index: number): void {
    this.selectedFloorPlanIndex = index;
  }

  parseImagesArray(img: any): string[] {
    if (!img) return [];
    const isValid = (s: any) => {
      if (!s) return false;
      const str = String(s).trim().toLowerCase();
      return str.length > 0 && str !== 'null' && str !== 'undefined' && !str.endsWith('/null') && !str.endsWith('/undefined') && !str.endsWith('/');
    };

    if (Array.isArray(img)) {
      return img.map(s => String(s).trim()).filter(isValid);
    }
    if (typeof img === 'string') {
      const trimmed = img.trim();
      if (!isValid(trimmed)) return [];
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.map(s => String(s).trim()).filter(isValid);
        } catch (e) { }
      }
      return trimmed.split(',').map(s => s.trim()).filter(isValid);
    }
    return [];
  }

  // hasKeysOrValues(obj: any): boolean {
  //   return Object.keys(obj).length > 0 &&
  //          !Object.values(obj).every(value => value === null || value === undefined || value === '');
  // }

  submitEnquiry() {
    this.nameTouched = true;
    this.emailTouched = true;
    this.phoneTouched = true;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.nameError = !this.formData.username?.trim() || this.formData.username.trim().length < 3;
    this.emailError = !this.formData.useremail || !emailPattern.test(this.formData.useremail);
    this.phoneError = !this.formData.contact_no || String(this.formData.contact_no).length < 10;
    this.termsError = !this.formData.termsAccepted;

    if (this.nameError || this.phoneError || this.emailError || this.termsError) {
      return;
    }

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
      countrycode: this.countryCode,
      request_price: 0,
    };
    const token = localStorage.getItem('myrealtylogintoken');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http.post(`${this.apiUrl}storeinquiry`, payload, { headers }).subscribe((response: any) => {
      this.spinner.hide();
      if (response.status === true) {
        this.activityTrackerService.logActivity('Inquiry stored for project', '');
        this.enquirySubmitted = true;
        this.resetForm();
      }
    },
      (error) => {
        this.spinner.hide();
        console.log('Error sending data', error)
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
    this.termsError = false;
    this.nameTouched = false;
    this.emailTouched = false;
    this.phoneTouched = false;
  }

  openOTPModal() {
    this.nameTouched = true;
    this.emailTouched = true;
    this.phoneTouched = true;
    this.nameError = false;
    this.phoneError = false;
    this.emailError = false;
    this.termsError = false;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;

    if (!this.formData.username?.trim() || this.formData.username.trim().length < 3) {
      this.nameError = true;
    }
    if (!this.formData.useremail || !emailPattern.test(this.formData.useremail)) {
      this.emailError = true;
    }
    if (!this.formData.contact_no || String(this.formData.contact_no).length < 10) {
      this.phoneError = true;
    }
    if (!this.formData.termsAccepted) {
      this.termsError = true;
    }

    if (this.nameError || this.phoneError || this.emailError || this.termsError) {
      return;
    }
    this.sendOTPToMobile(); // Call this to send OTP to mobile
  }

  openContactOTPModal() {
    this.nameContactTouched = true;
    this.emailContactTouched = true;
    this.phoneContactTouched = true;
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;



    if (!this.formDataphone.contactcontact_no || String(this.formDataphone.contactcontact_no).length < 10) {
      this.phoneContactError = true;
    }
    if (this.phoneContactError) {
      return;
    }
    this.sendOTPContactToMobile(); // Call this to send OTP to mobile
  }

  verifyContactOTP() {
    const otpVal = this.brochureOtp.join('');
    if (otpVal.length < 4) {
      this.toastr.error('Please Enter OTP');
      return;
    }

    this.spinner.show();

    if (this.isUserRegistered) {
      const enteredOtp = parseInt(otpVal, 10);
      const url = `${this.apiUrl}validateotp`;
      const data = { contact_no: this.brochureFormData.mobile, otp: enteredOtp };

      this.http.post(url, data).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (response && response.status === true) {
            localStorage.setItem('myrealtylogintoken', response.data.token);
            localStorage.setItem('contact_no', response.data.contact_no);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('email', response.data.email);
            this.is_token = true;

            // Prefill formDataphone from localStorage
            this.formDataphone.contactusername = response.data.name;
            this.formDataphone.contactuseremail = response.data.email;
            this.formDataphone.contactcontact_no = response.data.contact_no;

            // Submit inquiry
            this.submitFormPhone();

            // Close login modal
            this.closeLoginModal();

            // Open brochure PDF
            if (this.selectedAction === 'brochure') {
              const pdfUrl = this.singleproject?.project_brochure;
              if (this.isPdf(pdfUrl)) {
                window.open(pdfUrl, '_blank');
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              } else {
                this.toastr.warning('Brochure is not available.');
              }
            } else if (this.selectedAction === 'view-contact') {
              this.showContactDetails = true;
              this.activeContactPopover = this.pendingContactPopover;
              // setTimeout(() => {
              //   window.location.reload();
              // }, 100);
            } else if (this.selectedAction === 'whatsapp') {
              this.redirectToWhatsApp();
              setTimeout(() => {
                window.location.reload();
              }, 100);
            } else if (this.selectedAction === 'schedule-visit') {
              this.openScheduleVisitModal();
            }
            this.toastr.success('Logged in successfully!');
          } else {
            this.toastr.error('Wrong OTP entered. Please try again.');
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error('Verification failed. Please try again.');
        }
      );
    } else {
      let payload = {
        contact_no: this.brochureFormData.mobile,
        otp: otpVal,
      }
      this.http.post(`${this.apiUrl}verifyinquiryotp`, payload).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (response.status == true) {
            // OTP verified successfully. Now show the Name and Email form inside the modal.
            this.brochureOtpVisible = false;
            this.brochureRegisterVisible = true;
          } else {
            this.toastr.error('Wrong OTP entered. Please try again.');
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error('Verification failed. Please try again.');
        }
      );
    }
  }

  verifyOTP() {
    if (this.formData.otp == '') {
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
    this.isSendingOtp = true;
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.brochureFormData.mobile,
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
          }
          else {
            this.phoneError = true;
          }
          this.isSendingOtp = false;
          this.spinner.hide();
        },
        (error) => {
          this.isSendingOtp = false;
          this.toastr.error('Failed to send OTP.');
          console.error('Error sending OTP', error);
          this.spinner.hide();
        }
      );
  }
  sendOTPContactToMobile() {
    this.isContactSendingOtp = true;
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
              this.toastr.success('OTP Sent Successfully.');
            }
            if (response.code === 101) {
              this.toastr.warning(response.message);
            }
          }
          else {
            this.phoneContactError = true;
          }
          this.isContactSendingOtp = false;
          this.spinner.hide();
        },
        (error) => {
          this.isContactSendingOtp = false;
          this.toastr.error('Failed to send OTP.');
          console.error('Error sending OTP', error);
          this.spinner.hide();
        }
      );
  }

  slideLeft() {
    if (!this.slider?.nativeElement) return;
    const el = this.slider.nativeElement as HTMLElement;
    const card = el.querySelector('.developer-card') as HTMLElement;
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : 300;
    el.scrollBy({ left: -amount, behavior: 'smooth' });
  }

  slideRight() {
    if (!this.slider?.nativeElement) return;
    const el = this.slider.nativeElement as HTMLElement;
    const card = el.querySelector('.developer-card') as HTMLElement;
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : 300;
    el.scrollBy({ left: amount, behavior: 'smooth' });
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
    this.nameTouched = true;
    const inputValue = event.target.value;
    const companyPattern = /^[a-zA-Z\s]+$/;
    this.nameError = !companyPattern.test(inputValue) || inputValue.trim().length < 3;
  }

  validateEmail(event: any) {
    this.emailTouched = true;
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.emailError = !emailPattern.test(inputValue);
  }

  validatePhoneNumber(event: any) {
    this.phoneTouched = true;
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
  observeSections() {
    const sections = document.querySelectorAll('#overview,#aboutProject,#reels,#floorPlan,#address,#amenities,#brochure,#project-detail,#developer');
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0.2, // Section is considered active when it crosses into view
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, observerOptions);
    sections.forEach((section) => {
      return observer.observe(section)
    });
  }


  scrollToSection(sectionId: string): void {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    const section = document.getElementById(sectionId);
    const navbar = document.getElementById('navbar');
    const headerEl = document.querySelector('header');
    if (!section || !navbar) return;

    const stickyTop = this.showStickyHeader ? (window.innerWidth <= 991 ? 115 : 75) : (headerEl ? headerEl.offsetHeight : (window.innerWidth <= 991 ? 115 : 75));
    const totalHeaderOffset = stickyTop + navbar.offsetHeight + 15;
    const sectionAbsoluteTop = section.getBoundingClientRect().top + window.scrollY;

    const scrollToPosition = sectionAbsoluteTop - totalHeaderOffset;

    this.activeSection = sectionId;
    this.isManualScroll = true;

    window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });

    // After smooth scroll settles (~900ms), verify position and correct if needed
    setTimeout(() => {
      const hEl = document.querySelector('header');
      const currentStickyTop = this.showStickyHeader ? (window.innerWidth <= 991 ? 115 : 75) : (hEl ? hEl.offsetHeight : (window.innerWidth <= 991 ? 115 : 75));
      const finalNavbarHeight = navbar ? navbar.offsetHeight : 55;
      const currentSectionTop = section.getBoundingClientRect().top;
      const idealTop = currentStickyTop + finalNavbarHeight + 15;

      if (Math.abs(currentSectionTop - idealTop) > 8) {
        window.scrollTo({
          top: window.scrollY + currentSectionTop - idealTop,
          behavior: 'smooth',
        });
      }

      this.activeSection = sectionId;

      setTimeout(() => {
        this.isManualScroll = false;
        this.activeSection = sectionId;
      }, 500);
    }, 900);
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.showContactDetails = false;
    this.activeContactPopover = null;
    this.detectActiveSectionOnScroll();
    // console.log(window.pageYOffset, '====window.pageYOffset')
    // console.log(document.documentElement.scrollTop, '====document.documentElement.scrollTop')
    // console.log(this.lastScrollTop, '====this.lastScrollTop')
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll < this.lastScrollTop) {
      this.isScrollingUp = true;
    } else {
      this.isScrollingUp = false;
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

    const header = document.querySelector('header');
    const navbar = document.getElementById('navbar');

    if (navbar && header) {
      const navbarTop = navbar.getBoundingClientRect().top;
      const isMenuOpen = document.getElementById('navbarSupportedContent')?.classList.contains('show');
      const isMobileOrTablet = window.innerWidth <= 991;
      const stickyThreshold = isMobileOrTablet ? 115 : (header.getBoundingClientRect().bottom > 0 ? header.getBoundingClientRect().bottom : 75);

      // Trigger sticky header when navbar reaches its sticky threshold (touching header bottom on desktop / 115px on mobile & tablet)
      if (!isMenuOpen && navbarTop <= stickyThreshold + 2) {
        header.classList.add('header-hidden');
        this.isHeaderHidden = true;
        this.showStickyHeader = true;
      } else {
        header.classList.remove('header-hidden');
        this.isHeaderHidden = false;
        this.showStickyHeader = false;
      }
    } else {
      this.showStickyHeader = false;
    }
  }
  detectActiveSectionOnScroll(): void {
    // Block scroll spy during programmatic scrollToSection() calls
    if (this.isManualScroll) return;

    const sections = [
      { id: 'overview', element: document.getElementById('overview') },
      { id: 'aboutProject', element: document.getElementById('aboutProject') },
      { id: 'reels', element: document.getElementById('reels') },
      { id: 'floorPlan', element: document.getElementById('floorPlan') },
      { id: 'address', element: document.getElementById('address') },
      { id: 'amenities', element: document.getElementById('amenities') },
      { id: 'brochure', element: document.getElementById('brochure') },
      { id: 'project-detail', element: document.getElementById('project-detail') },
      { id: 'developer', element: document.getElementById('developer') },
      { id: 'faq', element: document.getElementById('faq') },
    ];

    const hEl = document.querySelector('header');
    const stickyTop = hEl ? hEl.offsetHeight : (window.innerWidth <= 991 ? 115 : 75);
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 60;
    const triggerOffset = stickyTop + navbarHeight + 40;

    let activeSection = 'overview';
    for (const section of sections) {
      if (section.element) {
        if (section.element.getBoundingClientRect().top <= triggerOffset) {
          activeSection = section.id;
        }
      }
    }
    this.activeSection = activeSection;
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
    this.nameContactTouched = true;
    const inputValue = event.target.value;
    const companyPattern = /^[a-zA-Z\s]+$/;
    this.nameContactError = !companyPattern.test(inputValue) || inputValue.trim().length < 3;
  }

  validateContactEmail(event: any) {
    this.emailContactTouched = true;
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.emailContactError = !emailPattern.test(inputValue);
  }
  validateContactPhoneNumber(event: any) {
    this.phoneContactTouched = true;
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
      this.phoneContactError = true;
    } else {
      this.phoneContactError = false;
      // this.sendOTPToMobile();
    }
  }

  private getCityDisplayName(proj: any): string {
    const cityId = proj?.project_city;
    if (cityId !== undefined && cityId !== null && this.city1 && this.city1.length) {
      const matched = this.city1.find(c => String(c.cid) === String(cityId));
      if (matched) {
        return matched.cname;
      }
    }
    return proj?.project_localities || proj?.project_city || '';
  }


  groupFloorPlansByBhk(rawList: any[]): any[] {
    if (!Array.isArray(rawList) || rawList.length === 0) return [];
    const groupedMap = new Map<string, {
      bhk_type: string,
      carpet_areas: number[],
      raw_carpet_areas: string[],
      sbu_areas: number[],
      raw_sbu_areas: string[],
      images: string[]
    }>();

    rawList.forEach((fp: any) => {
      const bhkType = (fp.bhk_type || '').trim();
      const key = bhkType.toLowerCase() || 'other';
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          bhk_type: bhkType || 'Floor Plan',
          carpet_areas: [],
          raw_carpet_areas: [],
          sbu_areas: [],
          raw_sbu_areas: [],
          images: []
        });
      }
      const entry = groupedMap.get(key)!;

      if (fp.sbu !== undefined && fp.sbu !== null) {
        const rawSbuStr = String(fp.sbu).trim();
        if (rawSbuStr && !entry.raw_sbu_areas.includes(rawSbuStr)) {
          entry.raw_sbu_areas.push(rawSbuStr);
        }
        const numSbu = parseFloat(rawSbuStr.replace(/[^\d.]/g, ''));
        if (!isNaN(numSbu) && numSbu > 0 && !entry.sbu_areas.includes(numSbu)) {
          entry.sbu_areas.push(numSbu);
        }
      }

      if (fp.carpet_area !== undefined && fp.carpet_area !== null) {
        const rawAreaStr = String(fp.carpet_area).trim();
        if (rawAreaStr && !entry.raw_carpet_areas.includes(rawAreaStr)) {
          entry.raw_carpet_areas.push(rawAreaStr);
        }
        const num = parseFloat(rawAreaStr.replace(/[^\d.]/g, ''));
        if (!isNaN(num) && num > 0 && !entry.carpet_areas.includes(num)) {
          entry.carpet_areas.push(num);
        }
      }

      const rawImgs = fp.images !== undefined && fp.images !== null ? fp.images : fp.image;
      const parsedImages = this.parseImagesArray(rawImgs);
      parsedImages.forEach((img: string) => {
        if (!img) return;
        let imgStr = String(img).trim();
        const lower = imgStr.toLowerCase();
        if (!imgStr || lower === 'null' || lower === 'undefined' || lower.endsWith('/null') || lower.endsWith('/undefined') || lower.endsWith('/')) {
          return;
        }
        if (!imgStr.startsWith('http') && !imgStr.startsWith('data:') && !imgStr.startsWith('/assets')) {
          if (imgStr.startsWith('backend/') || imgStr.includes('backend/public/images')) {
            imgStr = imgStr.startsWith('/') ? `https://realtymart.com${imgStr}` : `https://realtymart.com/${imgStr}`;
          } else if (imgStr.startsWith('/')) {
            imgStr = `https://realtymart.com${imgStr}`;
          } else {
            imgStr = `https://realtymart.com/backend/public/images/floor_plan/${imgStr}`;
          }
        }
        if (!entry.images.includes(imgStr)) {
          entry.images.push(imgStr);
        }
      });
    });

    return Array.from(groupedMap.values())
      .map(entry => {
        let sbuDisplay = '';
        if (entry.sbu_areas.length > 0) {
          const minArea = Math.min(...entry.sbu_areas);
          const maxArea = Math.max(...entry.sbu_areas);
          sbuDisplay = minArea === maxArea ? `${minArea}` : `${minArea} - ${maxArea}`;
        } else if (entry.raw_sbu_areas.length > 0) {
          sbuDisplay = entry.raw_sbu_areas.join(' - ');
        }

        let areaDisplay = '';
        if (entry.carpet_areas.length > 0) {
          const minArea = Math.min(...entry.carpet_areas);
          const maxArea = Math.max(...entry.carpet_areas);
          areaDisplay = minArea === maxArea ? `${minArea}` : `${minArea} - ${maxArea}`;
        } else if (entry.raw_carpet_areas.length > 0) {
          areaDisplay = entry.raw_carpet_areas.join(' - ');
        }

        const validImages = (entry.images || []).filter(img => {
          if (!img) return false;
          const lower = String(img).trim().toLowerCase();
          return lower.length > 0 && lower !== 'null' && lower !== 'undefined' && !lower.endsWith('/null') && !lower.endsWith('/undefined') && !lower.endsWith('/');
        });

        return {
          bhk_type: entry.bhk_type,
          sbu: sbuDisplay,
          carpet_area: areaDisplay,
          image: validImages
        };
      })
      .filter(plan => plan.image && plan.image.length > 0);
  }

  fetchProjectApproveDetails() {
    const projectName = this.route.snapshot.paramMap.get('slug');

    if (projectName) {
      this.projectdetailsService
        .getprojectdetailFromSlug(projectName)
        .subscribe(
          (projectData: any) => {
            this.singleprojectData = projectData;
            this.singleproject = this.singleprojectData?.data;

            // Populate floor plans from API
            const rawFloorPlans = this.singleproject?.floor_plans;
            if (Array.isArray(rawFloorPlans) && rawFloorPlans.length > 0) {
              this.floorPlanList = this.groupFloorPlansByBhk(rawFloorPlans);
            } else if (typeof rawFloorPlans === 'string' && rawFloorPlans.trim()) {
              try {
                const parsed = JSON.parse(rawFloorPlans);
                if (Array.isArray(parsed)) {
                  this.floorPlanList = this.groupFloorPlansByBhk(parsed);
                }
              } catch (e) {
                console.error('Error parsing floor_plans:', e);
              }
            }
            this.selectedFloorPlanIndex = 0;

            // Populate master plans from API
            const rawMasterPlans = [
              ...this.parseImagesArray(this.singleproject?.project_master_plan),
              ...this.parseImagesArray(this.singleproject?.project_master_plan_3d),
              ...this.parseImagesArray(this.singleproject?.master_plan)
            ];
            this.masterPlanList = Array.from(new Set(rawMasterPlans.map(img => {
              if (!img) return '';
              let imgStr = String(img).trim();
              const lower = imgStr.toLowerCase();
              if (lower === 'null' || lower === 'undefined' || lower.endsWith('/null') || lower.endsWith('/undefined') || lower.endsWith('/')) {
                return '';
              }
              if (imgStr.startsWith('http') || imgStr.startsWith('data:') || imgStr.startsWith('/assets')) {
                return imgStr;
              }
              if (imgStr.startsWith('backend/') || imgStr.includes('backend/public/images')) {
                return imgStr.startsWith('/') ? `https://realtymart.com${imgStr}` : `https://realtymart.com/${imgStr}`;
              }
              if (imgStr.startsWith('/')) {
                return `https://realtymart.com${imgStr}`;
              }
              return `https://realtymart.com/backend/public/images/project_master_plan/${imgStr}`;
            }).filter(url => {
              if (!url) return false;
              const lower = url.toLowerCase();
              return lower.length > 0 && !lower.endsWith('/null') && !lower.endsWith('/undefined') && !lower.endsWith('/');
            })));

            if (this.floorPlanList.length === 0 && this.masterPlanList.length > 0) {
              this.activePlanTab = 'masterPlan';
            } else if (this.floorPlanList.length > 0) {
              this.activePlanTab = 'floorPlan';
            } else {
              this.activePlanTab = '';
            }

            // Populate FAQs from project_faq if available
            const rawFaqs = this.singleproject?.project_faq;
            if (rawFaqs) {
              let parsedFaqs: any[] = [];
              if (typeof rawFaqs === 'string') {
                try {
                  parsedFaqs = JSON.parse(rawFaqs);
                } catch (e) {
                  console.error('Error parsing project_faq:', e);
                }
              } else if (Array.isArray(rawFaqs)) {
                parsedFaqs = rawFaqs;
              }
              if (parsedFaqs && parsedFaqs.length > 0) {
                this.faqs = parsedFaqs.map(f => ({
                  question: f.faq_que || f.question || '',
                  answer: f.faq_ans || f.answer || ''
                }));
              }
            }

            // Update map coordinates from loaded project
            if (this.singleproject) {
              this.updateMapCoordinates(this.singleproject.latitude, this.singleproject.longitude);
            }

            // Populate gallery albums
            const imageBaseUrl = 'https://realtymart.com/backend/public/images/';

            // Project Photos tab: from 3d_project_images (comma-separated filenames)
            const raw3dImages = this.singleproject?.['project_images'];
            if (Array.isArray(raw3dImages)) {
              this.photoAlbum = raw3dImages;
            } else {
              this.photoAlbum = [];
            }

            // Brochure Images: from project_brochure_images
            const rawBrochureImages = this.singleproject?.project_brochure_images;
            if (Array.isArray(rawBrochureImages) && rawBrochureImages.length > 0) {
              this.projectBrochureImages = rawBrochureImages;
            } else if (typeof rawBrochureImages === 'string' && rawBrochureImages.trim()) {
              this.projectBrochureImages = rawBrochureImages.split(',').map((s: string) => s.trim()).filter((s: string) => s);
            } else {
              this.projectBrochureImages = [];
            }
            if (this.singleproject.project_video.length > 0) {
              // BHK types actually come from the floor_plans array (each entry
              // has its own bhk_type + carpet_area), not a flat "bhk" field on
              // the project. floorPlanList is already parsed above.
              const bhkTypes = Array.from(new Set(
                (this.floorPlanList || []).map(fp => fp.bhk_type).filter(Boolean)
              ));
              // Strip units/commas (e.g. "1,168 SqFt") before parsing so real
              // values don't get silently dropped as NaN.
              const carpetAreas = (this.floorPlanList || [])
                .map(fp => parseFloat(String((fp.sbu || fp.carpet_area) ?? '').replace(/[^\d.]/g, '')))
                .filter(n => !isNaN(n) && n > 0);
              const minCarpetArea = carpetAreas.length ? Math.min(...carpetAreas) : null;
              const maxCarpetArea = carpetAreas.length ? Math.max(...carpetAreas) : null;
              // project_city is a raw ID (e.g. "783"), never show it directly —
              // resolve against city1 first, then fall back to the locality.
              const cityDisplayName = this.getCityDisplayName(this.singleproject);

              this.reels = [];
              this.projectReels = [];
              this.allReels = [];
              this.seenReelKeys.clear();
              this.videoAlbum = [];

              this.singleproject.project_video.forEach((element: {
                video_source: string,
                proj_video_link: string,
                proj_video_file: string,
                proj_video_thumbnail: string,
                proj_builderName?: string,
                project_localities?: string,
                segment?: string,
                property_type?: string,
                bhk?: string[],
                project_about_developer?: any
              }, idx: number) => {
                if (element.video_source === "youtube") {
                  this.videoAlbum.push(element)
                } else {
                  let videoFile = element.proj_video_file || '';
                  if (videoFile && typeof videoFile === 'string' && !videoFile.startsWith('http') && !videoFile.startsWith('data:')) {
                    videoFile = `https://realtymart.com/backend/public/images/project_video/${videoFile}`;
                  }
                  let videoThumb = element.proj_video_thumbnail || '';
                  if (videoThumb && typeof videoThumb === 'string' && !videoThumb.startsWith('http') && !videoThumb.startsWith('data:')) {
                    videoThumb = `https://realtymart.com/backend/public/images/project_video_thumbnail/${videoThumb}`;
                  }
                  const videoLink = element.proj_video_link || '';

                  const reelKey = this.getReelUniqueKey(videoLink, videoFile, this.singleproject.id, idx);
                  if (!this.seenReelKeys.has(reelKey)) {
                    this.seenReelKeys.add(reelKey);

                    // Enrich real API video entries with the same fields the
                    // fallback/dummy reels get, so the "View Details" card has
                    // data to bind to and the reel filter panel (segment /
                    // property type / BHK) has something to match against.
                    const enrichedElement = {
                      ...element,
                      id: this.singleproject.id || (element as any).id || null,
                      proj_video_file: videoFile,
                      proj_video_thumbnail: videoThumb,
                      proj_video_link: videoLink,
                      proj_builderName: element.proj_builderName || this.singleproject.builderName || "",
                      project_localities: element.project_localities || this.singleproject.project_localities || "",
                      segment: element.segment || this.singleproject.property_for || "",
                      property_type: element.property_type || (element as any).projectType || (element as any).project_type || this.singleproject.project_type || this.singleproject.projectType || "",
                      bhk: element.bhk && element.bhk.length ? element.bhk : bhkTypes,
                      project_name: (element as any).project_name || (element as any).proj_name || this.singleproject.project_name || "",
                      city_id: (element as any).city_id || this.singleproject.project_city || null,
                      city: (element as any).city || cityDisplayName || "",
                      project_about_developer: element.project_about_developer || {
                        id: this.singleproject.id || (element as any).id || null,
                        logo: this.singleproject.project_logo || null,
                        project_name: this.singleproject.project_name || "",
                        city: cityDisplayName,
                        city_id: this.singleproject.project_city || null,
                        builderName: element.proj_builderName || this.singleproject.builderName || "",
                        image: this.singleproject.project_banner_image || (this.singleproject.project_images && this.singleproject.project_images[0]) || "",
                        minPrice: this.singleproject.project_minimum_price || "",
                        maxPrice: this.singleproject.project_maximum_price || "",
                        type: bhkTypes.length ? bhkTypes.join(' - ') : ((Array.isArray(this.singleproject.project_type) ? this.singleproject.project_type.join(', ') : (Array.isArray(this.singleproject.projectType) ? this.singleproject.projectType.join(', ') : (this.singleproject.project_type || this.singleproject.projectType || ""))) || ""),
                        minSize: minCarpetArea !== null ? `${minCarpetArea} SqFt` : "",
                        maxSize: (maxCarpetArea !== null && maxCarpetArea !== minCarpetArea) ? `${maxCarpetArea} SqFt` : "",
                        contact_no: this.singleproject.project_contact_no || ""
                      }
                    };
                    this.reels.push(enrichedElement);
                    this.projectReels.push(enrichedElement);
                    this.buildReelCache(enrichedElement);
                    this.allReels.push(enrichedElement);
                  }
                }
              });
            }
            this.onReelFilterChange();

            // Auto-select first tab that has content
            if (this.photoAlbum.length > 0) this.galleryActiveTab = 'photos';
            else if (this.layoutAlbum.length > 0) this.galleryActiveTab = 'layout';
            else if (this.videoAlbum.length > 0) this.galleryActiveTab = 'video';
            this.developerProjects = this.mapDeveloperProjects(this.singleproject.aboutDeveloperProjects);
            this.startDeveloperCardAutoplay();
            // Populate reviews via separate API
            this.fetchProjectReviews(this.singleproject.id);

            // Set meta tags and title
            this.setMetaTags(this.singleproject.project_meta_title, this.singleproject.project_meta_description, this.singleproject.project_banner_image);
          },
          (error: any) => {
            console.error('Error fetching project details:', error);
          }
        );
    }
  }

  fetchProjectReviews(projectId: any) {
    this.http.get(`${this.apiUrl}getreview`).subscribe(
      (res: any) => {
        const all: any[] = res?.responseData?.getenquiry || [];
        const currentUserId = localStorage.getItem('userId');
        const currentUserName = localStorage.getItem('name');
        this.projectReviews = all
          .filter((r: any) => String(r.review_id) === String(projectId))
          .map((r: any) => ({
            ...r,
            ratings: Number(r.ratings) || 0,
            name: (currentUserId && String(r.user_id) === String(currentUserId))
              ? (currentUserName || 'Verified User')
              : 'Verified User'
          }));
      },
      () => { }
    );
  }

  // meta title
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

  submitFormPhone() {
    this.nameContactTouched = true;
    this.emailContactTouched = true;
    this.phoneContactTouched = true;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.phoneContactError = !this.formDataphone.contactcontact_no || String(this.formDataphone.contactcontact_no).length < 10;
    this.termsContactError = !this.formDataphone.termsContactAccepted;

    if (this.phoneContactError || this.termsContactError) {
      return;
    }
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
      countrycode: this.countryCode,
      request_price: 0,
    }
    const token = localStorage.getItem('myrealtylogintoken');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http.post(`${this.apiUrl}storeinquiry`, payload, { headers })
      .subscribe((response: any) => {
        if (response.status === true) {
          this.activityTrackerService.logActivity('Inquiry stored for project', '');
          this.contactEnquirySubmitted = true;
        }
      }, (error) => {
        console.error('Error sending data', error);
      });
  }

  resetContactForm() {
    const name = localStorage.getItem('name') || '';
    const email = localStorage.getItem('email') || '';
    const phone = localStorage.getItem('contact_no') || '';
    this.formDataphone = {
      contactusername: name,
      contactuseremail: email,
      contactcontact_no: phone,
      termsContactAccepted: true,
    };
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;
    this.nameContactTouched = false;
    this.emailContactTouched = false;
    this.phoneContactTouched = false;
    this.contactEnquirySubmitted = false;
  }

  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
  }
  onTermsContactChange(event: Event) {
    this.termsContactError = !(event.target as HTMLInputElement).checked;
  }

  // objectKeys(obj: any): string[] {
  //   return Object.keys(obj);
  // }

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

  submitForm(form: any) {
    this.showOTP = true;
  }

  getLandmarkCategories(): any[] {
    return Object.entries(this.singleproject.landmarksnearproject).map(([key, value]) => ({
      category: key,
      landmarks: value
    }));
  }

  getLandmarkEntries() {
    return Object.entries(this.singleproject.landmarksnearproject);
  }

  sendBrochureOTP() {
    this.brochureMobileTouched = true;
    const mobilePattern = /^[0-9]{10}$/;
    this.brochureMobileError = !mobilePattern.test(this.brochureFormData.mobile);

    if (this.brochureMobileError) return;

    this.isBrochureSendingOtp = true;

    // Call generateotp to check if user is registered
    this.http.post(`${this.apiUrl}generateotp`, { contact_no: this.brochureFormData.mobile })
      .subscribe((res: any) => {
        if (res.status === true && res.code !== 1) {
          // User is registered in the database, generateotp has successfully sent the login OTP
          this.isBrochureSendingOtp = false;
          this.isUserRegistered = true;
          this.brochureOtpVisible = true;
          this.startTimer();
          this.toastr.success('OTP sent successfully.');
        } else {
          // User is unregistered in the database, send guest inquiry OTP
          this.isUserRegistered = false;
          this.http.post(`${this.apiUrl}genrateinquiryotp`, { contact_no: this.brochureFormData.mobile })
            .subscribe((inqRes: any) => {
              this.isBrochureSendingOtp = false;
              if (inqRes.data === 'ok' && inqRes.status === true) {
                this.brochureOtpVisible = true;
                this.startTimer();
                this.toastr.success('OTP sent successfully.');
              } else {
                this.toastr.error(inqRes.message || 'Failed to send OTP.');
              }
            }, () => {
              this.isBrochureSendingOtp = false;
              this.toastr.error('Failed to send OTP.');
            });
        }
      }, () => {
        this.isBrochureSendingOtp = false;
        this.toastr.error('Failed to send OTP.');
      });
  }

  submitBrochure() {
    const otpVal = this.brochureOtp.join('');
    if (otpVal.length < 4) { this.brochureOtpError = true; return; }
    this.brochureOtpError = false;
    this.http.post(`${this.apiUrl}verifyinquiryotp`, { contact_no: this.brochureFormData.mobile, otp: otpVal })
      .subscribe((response: any) => {
        if (response.status === true) {
          const modalEl = document.getElementById('Brochure');
          if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
          this.galleryFormType = ''; // close gallery panel if open
          const baseUrl = 'https://realtymart.com/backend/public/images/';
          const pdfUrl = this.brochureMode === 'payment'
            ? (this.singleproject?.project_payment_brochure ? baseUrl + 'project_payment_brochure/' + this.singleproject.project_payment_brochure : null)
            : this.singleproject?.project_brochure;
          if (pdfUrl) {
            window.open(pdfUrl, '_blank');
          } else {
            this.toastr.info(this.brochureMode === 'payment' ? 'Payment plan is not available.' : 'Brochure is not available.');
          }
          this.resetBrochureForm();
        } else {
          this.toastr.error('Wrong OTP. Please try again.');
        }
      });
  }

  resetBrochureForm() {
    this.brochureFormData = { name: '', email: '', mobile: '', termsAccepted: true };
    this.brochureOtp = ['', '', '', ''];
    this.brochureOtpVisible = false;
    this.brochureRegisterVisible = false;
    this.brochureNameError = false;
    this.brochureEmailError = false;
    this.brochureMobileError = false;
    this.brochureTermsError = false;
    this.brochureOtpError = false;
    this.brochureNameTouched = false;
    this.brochureEmailTouched = false;
    this.brochureMobileTouched = false;
  }

  validateBrochureName(event: any) {
    this.brochureNameTouched = true;
    const value = event.target.value;
    const pattern = /^[a-zA-Z\s]+$/;
    this.brochureNameError = !pattern.test(value) || value.trim().length < 3;
  }

  validateBrochureEmail(event: any) {
    this.brochureEmailTouched = true;
    const value = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.brochureEmailError = !emailPattern.test(value);
  }

  validateBrochureMobile(event: any) {
    this.brochureMobileTouched = true;
    const value = event.target.value;
    const mobilePattern = /^[0-9]{10}$/;
    this.brochureMobileError = !mobilePattern.test(value);
  }



  // ===== Gallery Inline Contact Form Methods =====
  openGalleryForm(type: string) {
    this.galleryFormType = type;
    if (type === 'contact') {
      this.resetGalleryContactForm();
    } else {
      this.brochureMode = type; // 'brochure' or 'payment'
      this.resetBrochureForm();
    }
  }

  closeGalleryForm() {
    this.galleryFormType = '';
    this.resetGalleryContactForm();
  }

  resetGalleryContactForm() {
    this.galleryContactData = { name: '', email: '', mobile: '', termsAccepted: true };
    this.galleryContactNameErr = false;
    this.galleryContactEmailErr = false;
    this.galleryContactMobileErr = false;
    this.galleryContactTermsErr = false;
    this.galleryContactOtpVisible = false;
    this.galleryContactOtp = '';
    this.galleryContactOtpErr = false;
    this.galleryContactSubmitted = false;
  }

  sendGalleryContactOTP() {
    this.galleryContactNameErr = !this.galleryContactData.name?.trim() || this.galleryContactData.name.trim().length < 3;
    const emailPat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.galleryContactEmailErr = !emailPat.test(this.galleryContactData.email);
    const mobilePat = /^[0-9]{10}$/;
    this.galleryContactMobileErr = !mobilePat.test(this.galleryContactData.mobile);
    this.galleryContactTermsErr = !this.galleryContactData.termsAccepted;

    if (this.galleryContactNameErr || this.galleryContactEmailErr || this.galleryContactMobileErr || this.galleryContactTermsErr) return;

    this.spinner.show();
    this.http.post(`${this.apiUrl}genrateinquiryotp`, { contact_no: this.galleryContactData.mobile })
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res?.data === 'ok' && res?.status === true) {
          this.galleryContactOtpVisible = true;
          this.toastr.success('OTP sent successfully.');
        } else {
          this.toastr.error('Failed to send OTP. Please try again.');
        }
      }, () => { this.spinner.hide(); this.toastr.error('Failed to send OTP.'); });
  }

  submitGalleryContact() {
    if (!this.galleryContactOtp?.trim()) { this.galleryContactOtpErr = true; return; }
    this.galleryContactOtpErr = false;

    this.spinner.show();
    this.http.post(`${this.apiUrl}verifyinquiryotp`, { contact_no: this.galleryContactData.mobile, otp: this.galleryContactOtp })
      .subscribe((res: any) => {
        if (res?.status === true) {
          const token = localStorage.getItem('myrealtylogintoken');
          const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json');
          const payload = {
            contact_no: this.galleryContactData.mobile,
            useremail: this.galleryContactData.email,
            username: this.galleryContactData.name,
            project_Id: this.singleproject?.id,
            builder_id: '',
            leads_type: 'Project',
            leads_for: this.singleproject?.property_for,
            receiver_user_id: this.singleproject?.user_id,
            countrycode: this.countryCode,
            request_price: 0,
          };
          this.http.post(`${this.apiUrl}storeinquiry`, payload, { headers })
            .subscribe((r: any) => {
              this.spinner.hide();
              if (r?.status === true) {
                this.galleryContactSubmitted = true;
              } else {
                this.galleryFormType = '';
                this.resetGalleryContactForm();
              }
            }, () => { this.spinner.hide(); this.galleryFormType = ''; this.resetGalleryContactForm(); });
        } else {
          this.spinner.hide();
          this.toastr.error('Wrong OTP. Please try again.');
        }
      }, () => { this.spinner.hide(); this.toastr.error('Something went wrong.'); });
  }

  ngOnDestroy(): void {
    this.stopDeveloperCardAutoplay();
    (window as any).__projectDetailActive = false;
    const header = document.querySelector('header');
    if (header) {
      header.classList.remove('header-hidden');
    }
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }

  setGalleryTab(tab: string) {
    this.galleryActiveTab = tab;
    this.galleryActiveIndex = 0;
    this.galleryZoom = 1;
  }

  setGalleryImage(index: number) {
    this.galleryActiveIndex = index;
    this.galleryZoom = 1;
  }

  nextGalleryImage() {
    if (this.currentAlbum.length === 0) return;
    if (this.galleryActiveIndex < this.currentAlbum.length - 1) {
      this.galleryActiveIndex++;
    } else {
      // auto advance to next tab
      const tabs = this.availableTabs;
      const currentTabIdx = tabs.indexOf(this.galleryActiveTab);
      if (currentTabIdx < tabs.length - 1) {
        this.galleryActiveTab = tabs[currentTabIdx + 1];
        this.galleryActiveIndex = 0;
      } else {
        // wrap to first tab first image
        this.galleryActiveTab = tabs[0];
        this.galleryActiveIndex = 0;
      }
    }
    this.galleryZoom = 1;
  }

  prevGalleryImage() {
    if (this.currentAlbum.length === 0) return;
    if (this.galleryActiveIndex > 0) {
      this.galleryActiveIndex--;
    } else {
      // auto go to previous tab last image
      const tabs = this.availableTabs;
      const currentTabIdx = tabs.indexOf(this.galleryActiveTab);
      if (currentTabIdx > 0) {
        this.galleryActiveTab = tabs[currentTabIdx - 1];
        this.galleryActiveIndex = this.currentAlbum.length - 1;
      } else {
        // wrap to last tab last image
        this.galleryActiveTab = tabs[tabs.length - 1];
        this.galleryActiveIndex = this.currentAlbum.length - 1;
      }
    }
    this.galleryZoom = 1;
  }

  get availableTabs(): string[] {
    const tabs: string[] = [];
    if (this.photoAlbum.length > 0) tabs.push('photos');
    if (this.layoutAlbum.length > 0) tabs.push('layout');
    if (this.videoAlbum.length > 0) tabs.push('video');
    return tabs;
  }

  // ===== Review Methods =====
  openReviewModal() {
    if (!this.is_token) {
      this.toastr.warning('Please login to write a review.');
      return;
    }
    const modal = new bootstrap.Modal(document.getElementById('WriteReview'));
    modal.show();
  }

  setReviewRating(n: number) {
    this.reviewFormData.ratings = n;
    this.reviewRatingError = false;
  }

  submitReview() {
    this.reviewTextError = !this.reviewFormData.review;
    this.reviewRatingError = this.reviewFormData.ratings === 0;
    if (this.reviewTextError || this.reviewRatingError) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.toastr.warning('Please login to write a review.');
      return;
    }

    const payload = {
      user_id: userId,
      review_id: this.singleproject.id,
      review: this.reviewFormData.review,
      ratings: this.reviewFormData.ratings,
    };
    this.http.post(`${this.apiUrl}storereview`, payload).subscribe(
      (response: any) => {
        if (response.isSuccess === true) {
          this.toastr.success('Review submitted successfully!');
          const modalEl = document.getElementById('WriteReview');
          if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
          this.projectReviews.unshift({
            review: payload.review,
            ratings: payload.ratings,
            name: localStorage.getItem('name') || 'User',
            created_at: new Date().toISOString()
          });
          this.resetReviewForm();
        } else {
          this.toastr.error(response.message || 'Failed to submit review. Please try again.');
        }
      },
      (error) => { console.error('Error submitting review', error); }
    );
  }

  resetReviewForm() {
    this.reviewFormData = { review: '', ratings: 0 };
    this.reviewTextError = false;
    this.reviewRatingError = false;
    this.hoveredReviewRating = 0;
  }

  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.galleryImages.length - 1;
    }
  }


  openGallery() {
    this.showViewer = true;
  }


  // toggleShowMore(category: string): void {
  //   this.showMore[category] = !this.showMore[category];
  // }

  openReelsView(index: number = 0) {
    this.activeReelIndex = index;
    this.showReelsView = true;
    this.showReelComments = false;
    this.showReelDetailCard = false;
    document.body.style.overflow = 'hidden';
    this.updateSanitizedReelUrl();
  }

  closeReelsView() {
    this.showReelsView = false;
    this.showReelDetailCard = false;
    if (this.projectReels && this.projectReels.length > 0) {
      this.reels = [...this.projectReels];
    }
    document.body.style.overflow = '';
    const urlWithoutParams = window.location.pathname;
    window.history.replaceState({}, '', urlWithoutParams);
  }

  openContactModalFromReels(action: "view-contact" | "whatsapp" | "schedule-visit" | "brochure" = "view-contact") {
    this.selectedAction = action;
    const modalEl = document.getElementById('get-builder');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  toggleReelDetailCard() {
    this.showReelDetailCard = !this.showReelDetailCard;
    if (this.showReelDetailCard) {
      this.showFilters = false;
    }
  }

  viewPropertyFromReel() {
    if (this.reels && this.reels[this.activeReelIndex]) {
      const reel = this.reels[this.activeReelIndex];
      const reelId = reel.id || (reel.project_about_developer && reel.project_about_developer.id);
      const currentId = this.singleproject?.id || (this.singleprojectData && this.singleprojectData.data && this.singleprojectData.data.id);

      if (reelId && currentId && String(reelId) !== String(currentId)) {
        this.closeReelsView();
        const firstPart = reel.firstUrlPart || (reel.project_about_developer && reel.project_about_developer.firstUrlPart) || (reel.project_name ? String(reel.project_name).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'project');
        const secondPart = reel.secondUrlPart || (reel.project_about_developer && reel.project_about_developer.secondUrlPart) || (reelId ? `prjid-${reelId}` : '');
        if (firstPart && secondPart) {
          this.router.navigate(['/project-details', firstPart, secondPart]).then(() => {
            window.location.reload();
          });
          return;
        }
      }
    }

    this.closeReelsView();
    setTimeout(() => {
      this.scrollToSection('overview');
    }, 100);
  }

  nextReel(): void {
    if (this.activeReelIndex < this.reels.length - 1) {
      this.activeReelIndex++;
      this.updateSanitizedReelUrl();
    }
  }

  previousReel(): void {
    if (this.activeReelIndex > 0) {
      this.activeReelIndex--;
      this.updateSanitizedReelUrl();
    }
  }

  toggleReelsLike(index: number) {
    this.reelsLikedStates[index] = !this.reelsLikedStates[index];
    if (this.reelsLikedStates[index]) {
      this.reelsLikesCount[index]++;
      this.toastr.success('Added to favorites');
    } else {
      this.reelsLikesCount[index]--;
    }
  }

  toggleReelsMute() {
    this.isReelsMuted = !this.isReelsMuted;
    this.updateSanitizedReelUrl();
  }

  shareReel(index: number) {
    const shareUrl = `${window.location.origin}${window.location.pathname}?reels=true&reel=${index}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.toastr.success('Reel link copied to clipboard!');
      }, () => {
        this.toastr.error('Failed to copy link.');
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.toastr.success('Reel link copied to clipboard!');
      } catch (err) {
        this.toastr.error('Failed to copy link.');
      }
      document.body.removeChild(textArea);
    }
  }

  // Reel Share Modal Functions
  openReelShareModal(index: number) {
    this.activeReelIndex = index;
    // Build the shareable URL for the reel
    this.reelDynamicUrl = `${window.location.origin}${window.location.pathname}?reels=true&reel=${index}`;
    const modalEl = document.getElementById('shareReelModal');
    if (modalEl) {
      const reelModal = new bootstrap.Modal(modalEl);
      reelModal.show();
    }
  }

  emailReelShare() {
    const subject = encodeURIComponent('Check this reel');
    const body = encodeURIComponent(`Here is something interesting: ${this.reelDynamicUrl}`);
    // Open Gmail web composer directly in a new tab so it works in browsers without requiring desktop mail apps
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  }

  whatsappReelShare() {
    const link = `https://wa.me/?text=${encodeURIComponent(this.reelDynamicUrl)}`;
    window.open(link, '_blank');
  }

  facebookReelShare() {
    const url = encodeURIComponent(this.reelDynamicUrl);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank');
  }

  isLinkCopied: boolean = false;
  linkCopyTimeout: any;

  copyReelLink(event: MouseEvent) {
    navigator.clipboard.writeText(this.reelDynamicUrl).then(() => {
      this.toastr.success('Link copied to clipboard!');
      this.isLinkCopied = true;
      if (this.linkCopyTimeout) clearTimeout(this.linkCopyTimeout);
      this.linkCopyTimeout = setTimeout(() => {
        this.isLinkCopied = false;
      }, 2500);
    }, () => {
      this.toastr.error('Failed to copy link.');
    });
  }

  // Property to hold the generated reel URL for the modal
  reelDynamicUrl: string = '';

  getSanitizedVideoUrl(url: string): SafeResourceUrl {
    let embedUrl = url;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
      }
      if (videoId === 'example1' || videoId === 'example2' || videoId === 'example3' || videoId === 'example4' || videoId === 'example5' || videoId === 'example6') {
        const dummyVideoIds = ['g9_VwacuNU8', '9DR3CqVgvgk', 'Oo_KUGQ7QjI', 'aqz-KE-bpKQ', '3PQm-JcpnaA', 'kYJ40_7i1sQ'];
        const idx = parseInt(videoId.replace('example', ''), 10) - 1;
        videoId = dummyVideoIds[idx >= 0 && idx < dummyVideoIds.length ? idx : 0];
      }
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${this.isReelsMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  syncFilterCityWithActiveReel(): void {
    if (!this.reels || !this.reels[this.activeReelIndex] || !this.city1 || !this.city1.length) {
      return;
    }
    const reel = this.reels[this.activeReelIndex];
    const reelCityId = Number(reel.city_id || (reel.project_about_developer && reel.project_about_developer.city_id));
    const reelCityName = String(reel.city || reel.project_localities || (reel.project_about_developer && reel.project_about_developer.city) || '').toLowerCase();

    let matchedCity = this.city1.find((c: any) => Number(c.cid) === reelCityId);
    if (!matchedCity && reelCityName) {
      matchedCity = this.city1.find((c: any) => {
        const cnameLower = String(c.cname || '').toLowerCase();
        return cnameLower && (reelCityName.includes(cnameLower) || cnameLower.includes(reelCityName));
      });
    }

    if (matchedCity) {
      if (this.selectedReelCity !== matchedCity.cid) {
        this.selectedReelCity = matchedCity.cid;
        this.applyReelFiltersSync();
      }
      setTimeout(() => {
        if (matchedCity && matchedCity.cname) {
          this.fetchCityProjectsForFilterIfNeeded(matchedCity.cname);
        }
      }, 50);
    }
  }

  updateSanitizedReelUrl(): void {
    if (this.reels && this.reels[this.activeReelIndex]) {
      const reel = this.reels[this.activeReelIndex];
      // Only sanitize for YouTube iframe; local mp4 uses [src] directly on <video>
      if (reel.proj_video_link) {
        this.currentSanitizedVideoUrl = this.getSanitizedVideoUrl(reel.proj_video_link);
      } else {
        this.currentSanitizedVideoUrl = null;
      }
    } else {
      this.currentSanitizedVideoUrl = null;
    }
    this.syncFilterCityWithActiveReel();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showReelsView) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.previousReel();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.nextReel();
      } else if (event.key === 'Escape') {
        this.closeReelsView();
      }
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.changedTouches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndY = event.changedTouches[0].clientY;

    const swipeDistance = this.touchStartY - this.touchEndY;

    // Swipe Up → Next Reel
    if (swipeDistance > 50) {
      this.nextReel();
    }

    // Swipe Down → Previous Reel
    if (swipeDistance < -50) {
      this.previousReel();
    }
  }

  handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const now = Date.now();
    if (now - this.lastReelSwitchTime < 800) {
      return;
    }
    if (event.deltaY > 30) {
      this.nextReel();
      this.lastReelSwitchTime = now;
    } else if (event.deltaY < -30) {
      this.previousReel();
      this.lastReelSwitchTime = now;
    }
  }

  @HostListener('click', ['$event'])
  onComponentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('read-more-link')) {
      event.preventDefault();
      const toggleType = target.getAttribute('data-toggle');
      if (toggleType === 'about') {
        this.isAboutExpanded = !this.isAboutExpanded;
      } else if (toggleType === 'why') {
        this.isWhyBuyExpanded = !this.isWhyBuyExpanded;
      }
    }
  }

  togglePriceTooltip(event: MouseEvent): void {
    event.stopPropagation();
    this.priceTooltipVisible = !this.priceTooltipVisible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.price-tooltip-container')) {
      this.priceTooltipVisible = false;
    }
    if (target && !target.closest('.contact-container-relative')) {
      this.showContactDetails = false;
      this.activeContactPopover = null;
    }
  }

  getProcessedHtml(html: string, isAbout: boolean): string {
    if (!html) return '';

    const wordLimit = 150;
    const isExpanded = isAbout ? this.isAboutExpanded : this.isWhyBuyExpanded;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const plainText = doc.body.textContent || '';
    const words = plainText.split(/\s+/).filter(w => w.length > 0);

    if (words.length <= wordLimit) {
      return html;
    }

    let processedDoc = doc;
    if (!isExpanded) {
      processedDoc = this.truncateHtmlToWords(html, wordLimit);
    }

    const anchor = processedDoc.createElement('a');
    anchor.className = 'read-more-link';
    anchor.style.cursor = 'pointer';
    anchor.style.fontWeight = '600';
    anchor.style.color = '#ef3f23';
    anchor.style.marginLeft = '5px';
    anchor.style.textDecoration = 'none';
    anchor.setAttribute('data-toggle', isAbout ? 'about' : 'why');
    anchor.innerText = isExpanded ? 'Read Less' : '...Read More';

    this.appendToLastElement(processedDoc.body, anchor);

    return processedDoc.body.innerHTML;
  }

  truncateHtmlToWords(html: string, limit: number): Document {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let wordCount = 0;

    function traverse(node: Node): boolean {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue || '';
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (wordCount + words.length >= limit) {
          const remaining = limit - wordCount;
          let currentWordIndex = 0;
          let charIndex = 0;
          while (currentWordIndex < remaining && charIndex < text.length) {
            while (charIndex < text.length && /\s/.test(text[charIndex])) {
              charIndex++;
            }
            if (charIndex === text.length) break;
            while (charIndex < text.length && !/\s/.test(text[charIndex])) {
              charIndex++;
            }
            currentWordIndex++;
          }
          node.nodeValue = text.substring(0, charIndex);
          wordCount = limit;
          return true;
        } else {
          wordCount += words.length;
        }
      } else {
        const children = Array.from(node.childNodes);
        for (const child of children) {
          const stop = traverse(child);
          if (stop) {
            let sibling = child.nextSibling;
            while (sibling) {
              const next = sibling.nextSibling;
              node.removeChild(sibling);
              sibling = next;
            }
            return true;
          }
        }
      }
      return false;
    }

    traverse(doc.body);
    return doc;
  }

  appendToLastElement(parent: Node, elementToAppend: HTMLElement): void {
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
    if (parent.hasChildNodes()) {
      const childNodes = Array.from(parent.childNodes);
      for (let i = childNodes.length - 1; i >= 0; i--) {
        const child = childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          const tagName = (child as HTMLElement).tagName.toLowerCase();
          if (!voidElements.includes(tagName)) {
            this.appendToLastElement(child, elementToAppend);
            return;
          }
        } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue && child.nodeValue.trim().length > 0) {
          parent.appendChild(elementToAppend);
          return;
        }
      }
    }
    parent.appendChild(elementToAppend);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showReelDetailCard = false;
      setTimeout(() => {
        if (this.selectedReelCity && this.selectedReelCity !== 'null' && this.selectedReelCity !== 'Select City') {
          const cityIdNum = Number(this.selectedReelCity);
          let cityName = '';
          if (this.city1 && this.city1.length > 0) {
            const selectedCityObj = this.city1.find((c: any) => Number(c.cid) === cityIdNum || String(c.cid) === String(this.selectedReelCity));
            if (selectedCityObj && selectedCityObj.cname) {
              cityName = selectedCityObj.cname;
            }
          }
          if (!cityName && typeof this.selectedReelCity === 'string' && isNaN(Number(this.selectedReelCity))) {
            cityName = this.selectedReelCity;
          }
          if (cityName) {
            this.fetchCityProjectsForFilterIfNeeded(cityName);
          }
        }
      }, 5);
    }
  }

  resetFilters(): void {
    this.selectedPropertyTypes = [];
    this.selectedBHKs = [];
    this.selectedReelSearch = '';
    this.updateAvailablePropertyTypes();
    this.onReelFilterChange();
  }

  selectSegment(segment: string): void {
    if (this.selectedSegments.includes(segment)) {
      this.selectedSegments = [];
    } else {
      this.selectedSegments = [segment];
    }
    this.updateAvailablePropertyTypes();
    this.onReelFilterChange();
  }

  selectPropertyType(type: string): void {
    const index = this.selectedPropertyTypes.indexOf(type);
    if (index > -1) {
      this.selectedPropertyTypes.splice(index, 1);
    } else {
      this.selectedPropertyTypes.push(type);
    }
    this.onReelFilterChange();
  }

  selectBHK(bhk: string): void {
    const index = this.selectedBHKs.indexOf(bhk);
    if (index > -1) {
      this.selectedBHKs.splice(index, 1);
    } else {
      this.selectedBHKs.push(bhk);
    }
    this.onReelFilterChange();
  }

  isSegmentSelected(segment: string): boolean {
    return this.selectedSegments.includes(segment);
  }

  isPropertyTypeSelected(type: string): boolean {
    return this.selectedPropertyTypes.includes(type);
  }

  isBHKSelected(bhk: string): boolean {
    return this.selectedBHKs.includes(bhk);
  }

  trackByFn(index: number, item: any): any {
    return item;
  }

  loadPropertyTypes(): void {
    this.propertyresidentialservice.getpropertytyperesidential()?.subscribe((res: any) => {
      this.propertyresidential = res?.data || [];
      this.updateAvailablePropertyTypes();
    });
    this.propertycommercialservice.getpropertytypecommercial()?.subscribe((res: any) => {
      this.propertycommercial = res?.data || [];
      this.updateAvailablePropertyTypes();
    });
    this.propertyotherservice.getpropertytypeother()?.subscribe((res: any) => {
      this.propertyother = res?.data || [];
      this.updateAvailablePropertyTypes();
    });
    this.propertyplotservice.getpropertytypeplot()?.subscribe((res: any) => {
      this.propertyplot = res?.data || [];
      this.updateAvailablePropertyTypes();
    });
    this.propertypgservice.getpropertytypepg()?.subscribe((res: any) => {
      this.propertypg = res?.data || [];
      this.updateAvailablePropertyTypes();
    });
  }

  updateAvailablePropertyTypes(): void {
    if (!this.selectedSegments || this.selectedSegments.length === 0) {
      const defaultSet = new Set<string>();
      if (this.propertyresidential && this.propertyresidential.length) {
        this.propertyresidential.forEach((item: any) => defaultSet.add(item.name));
      } else {
        ['Flat', 'Bungalow', 'Villa', 'Penthouse', 'Row House', 'Studio', 'Duplex'].forEach(t => defaultSet.add(t));
      }
      if (this.propertyother && this.propertyother.length) {
        this.propertyother.forEach((item: any) => defaultSet.add(item.name));
      } else {
        defaultSet.add('Farm House');
      }
      const newTypes = Array.from(defaultSet);
      if (newTypes.length !== this.availablePropertyTypes.length || !newTypes.every((v, i) => v === this.availablePropertyTypes[i])) {
        this.availablePropertyTypes = newTypes;
      }
      return;
    }

    const typesSet = new Set<string>();
    this.selectedSegments.forEach((seg: string) => {
      const segLower = seg.toLowerCase().trim();
      if (segLower === 'buy' || segLower === 'rent') {
        const resList = this.propertyresidential && this.propertyresidential.length
          ? this.propertyresidential.map((item: any) => item.name)
          : ['Flat', 'Bungalow', 'Villa', 'Penthouse', 'Row House', 'Studio', 'Duplex'];
        const othList = this.propertyother && this.propertyother.length
          ? this.propertyother.map((item: any) => item.name)
          : ['Farm House'];
        resList.forEach((t: string) => typesSet.add(t));
        othList.forEach((t: string) => typesSet.add(t));
      } else if (segLower === 'commercial') {
        const commList = this.propertycommercial && this.propertycommercial.length
          ? this.propertycommercial.map((item: any) => item.name)
          : ['Office Space', 'Shop / Showroom', 'Commercial Land', 'Co-Working Space', 'Warehouse / Godown', 'Industrial Building', 'Industrial Shed', 'Institutional Land'];
        commList.forEach((t: string) => typesSet.add(t));
      } else if (segLower === 'plots' || segLower === 'plot') {
        const plotList = this.propertyplot && this.propertyplot.length
          ? this.propertyplot.map((item: any) => item.name)
          : ['Residential Land & Plot', 'Commercial Land', 'Industrial Plot', 'Agricultural Land', 'Farm House Plot'];
        plotList.forEach((t: string) => typesSet.add(t));
      } else if (segLower === 'farm house' || segLower === 'farmhouse') {
        const fhList = this.propertyother && this.propertyother.length
          ? this.propertyother.map((item: any) => item.name)
          : ['Farm House'];
        fhList.forEach((t: string) => typesSet.add(t));
      } else if (segLower === 'pg') {
        const pgList = this.propertypg && this.propertypg.length
          ? this.propertypg.map((item: any) => item.name)
          : ['Boys PG', 'Girls PG', 'Co-Ed PG', 'Paying Guest'];
        pgList.forEach((t: string) => typesSet.add(t));
      } else {
        ['Flat', 'Bungalow', 'Villa'].forEach((t: string) => typesSet.add(t));
      }
    });

    const newTypes = Array.from(typesSet);
    if (newTypes.length !== this.availablePropertyTypes.length || !newTypes.every((v, i) => v === this.availablePropertyTypes[i])) {
      this.availablePropertyTypes = newTypes;
    }

    if (this.selectedPropertyTypes && this.selectedPropertyTypes.length > 0) {
      const filteredSelected = this.selectedPropertyTypes.filter((pt: string) =>
        this.availablePropertyTypes.includes(pt)
      );
      if (filteredSelected.length !== this.selectedPropertyTypes.length) {
        this.selectedPropertyTypes = filteredSelected;
      }
    }
  }

  fetchCityProjectsForFilterIfNeeded(cityName: string): void {
    if (!cityName || this.lastFetchedCityForFilter === cityName) {
      return;
    }
    this.lastFetchedCityForFilter = cityName;
    if (this.cityProjectsMap[cityName]) {
      this.extractReelsFromProjects(this.cityProjectsMap[cityName]);
      this.applyReelFiltersSync();
      return;
    }
    this.http.get<any>(`${environment.apiUrl}projectincity/${cityName}`).subscribe(
      (res: any) => {
        const projectsInCity = res.data?.data || res.responseData || [];
        if (Array.isArray(projectsInCity)) {
          this.cityProjectsMap[cityName] = projectsInCity;
          this.extractReelsFromProjects(projectsInCity);
          this.applyReelFiltersSync();
        }
      },
      (err: any) => console.error(`Error fetching projectincity for ${cityName}:`, err)
    );
  }

  onReelFilterChange(): void {
    if (this.selectedReelCity && this.selectedReelCity !== 'null' && this.selectedReelCity !== 'Select City') {
      const cityIdNum = Number(this.selectedReelCity);
      let cityName = '';
      if (this.city1 && this.city1.length > 0) {
        const selectedCityObj = this.city1.find((c: any) => Number(c.cid) === cityIdNum || String(c.cid) === String(this.selectedReelCity));
        if (selectedCityObj && selectedCityObj.cname) {
          cityName = selectedCityObj.cname;
        }
      }
      if (!cityName && typeof this.selectedReelCity === 'string' && isNaN(Number(this.selectedReelCity))) {
        cityName = this.selectedReelCity;
      }

      if (cityName && this.lastFetchedCityForFilter !== cityName) {
        setTimeout(() => {
          this.fetchCityProjectsForFilterIfNeeded(cityName);
        }, 10);
      }
    }
    this.applyReelFiltersSync();
  }

  buildReelCache(reel: any): void {
    if (reel._filterCacheBuilt === 2) return;
    const rawType = reel.property_type || reel.project_type || reel.projectType || reel.type || (reel.project_about_developer && reel.project_about_developer.type) || '';
    let parsedTypes: string[] = [];
    if (Array.isArray(rawType)) {
      parsedTypes = rawType.map((t: any) => String(t));
    } else if (typeof rawType === 'string') {
      let cleaned = rawType.trim();
      if (cleaned.startsWith('[')) {
        try {
          const parsedJson = JSON.parse(cleaned);
          if (Array.isArray(parsedJson)) {
            parsedTypes = parsedJson.map((t: any) => String(t));
          } else {
            parsedTypes = [String(parsedJson)];
          }
        } catch (e) {
          parsedTypes = cleaned.replace(/[[\]'"]/g, '').split(',');
        }
      } else {
        parsedTypes = cleaned.replace(/[[\]'"]/g, '').split(',');
      }
    } else if (rawType) {
      parsedTypes = [String(rawType)];
    }
    reel._cachedTypesLower = parsedTypes.map((t: string) => t.trim().toLowerCase()).filter(Boolean);

    const rawSegment = reel.segment || reel.property_for || (reel.project_about_developer && reel.project_about_developer.segment) || '';
    reel._cachedSegmentArray = Array.isArray(rawSegment)
      ? rawSegment.map((s: any) => String(s).toLowerCase().trim())
      : String(rawSegment).split(/[,/|-]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
    reel._cachedSegmentLower = String(rawSegment).toLowerCase().trim();

    const rawBhkList: string[] = [];
    if (reel.bhk) {
      if (Array.isArray(reel.bhk)) {
        reel.bhk.forEach((b: any) => rawBhkList.push(String(b)));
      } else {
        rawBhkList.push(String(reel.bhk));
      }
    }
    if (reel.bhk_type) rawBhkList.push(String(reel.bhk_type));
    if (reel.type) rawBhkList.push(String(reel.type));
    if (reel.project_about_developer && reel.project_about_developer.type) rawBhkList.push(String(reel.project_about_developer.type));

    const bhkSet = new Set<string>();
    rawBhkList.forEach((raw: string) => {
      if (!raw) return;
      raw.split(/[,/\-]+/).forEach((s: string) => {
        const cleaned = s.trim().toLowerCase().replace(/\s+/g, '');
        if (cleaned && (/\d/.test(cleaned) || cleaned.includes('bhk'))) {
          bhkSet.add(cleaned);
        }
      });
    });
    reel._cachedBhksLower = Array.from(bhkSet);

    const area = String(reel.project_localities || reel.area || reel.localities || reel.city || (reel.project_about_developer && reel.project_about_developer.city) || '').toLowerCase();
    const project = String(reel.project_name || reel.proj_name || (reel.project_about_developer && reel.project_about_developer.project_name) || '').toLowerCase();
    const builder = String(reel.proj_builderName || reel.builderName || (reel.project_about_developer && reel.project_about_developer.builderName) || '').toLowerCase();
    reel._cachedSearchText = `${area} ${project} ${builder}`;
    reel._cachedLocLower = area;
    reel._filterCacheBuilt = 2;
  }

  matchBHKItem(sb: string, rb: string): boolean {
    if (!sb || !rb) return false;

    const sbClean = sb.trim().toLowerCase().replace(/\s+/g, '');
    const rbClean = rb.trim().toLowerCase().replace(/\s+/g, '');

    const rbNumMatch = rbClean.match(/^(\d+(?:\.\d+)?)/) || rbClean.match(/(\d+(?:\.\d+)?)\s*\+?\s*bhk/);
    const rbVal = rbNumMatch ? parseFloat(rbNumMatch[1]) : NaN;

    if (sbClean === '4+bhk' || sbClean.includes('4+')) {
      if (!isNaN(rbVal) && rbVal >= 4) {
        return true;
      }
      if (rbClean.includes('4+') || rbClean.includes('5+') || rbClean.includes('6+')) {
        return true;
      }
      return false;
    }

    if (sbClean === '4bhk') {
      if (!isNaN(rbVal) && (rbVal === 4 || rbVal >= 4)) {
        return true;
      }
      if (rbClean.includes('4+') || rbClean === '4bhk') {
        return true;
      }
      return false;
    }

    const sbNumMatch = sbClean.match(/^(\d+(?:\.\d+)?)/);
    const sbVal = sbNumMatch ? parseFloat(sbNumMatch[1]) : NaN;

    if (!isNaN(sbVal) && !isNaN(rbVal)) {
      return sbVal === rbVal;
    }

    return rbClean === sbClean || rbClean.split(/[-/]/).includes(sbClean);
  }

  applyReelFiltersSync(): void {
    if (!this.allReels || this.allReels.length === 0) {
      this.filteredReels = [];
      return;
    }

    const selectedTypesLower = (this.selectedPropertyTypes || []).map(t => t.toLowerCase().trim());
    const selectedSegmentsLower = (this.selectedSegments || []).map(s => s.toLowerCase().trim());
    const selectedBHKsLower = (this.selectedBHKs || []).map(b => b.toLowerCase().replace(/\s+/g, ''));
    const selectedSearchLower = (this.selectedReelSearch || '').trim().toLowerCase();

    let cityNameLower = '';
    let cityIdNum: number | null = null;
    if (this.selectedReelCity && this.selectedReelCity !== 'null' && this.selectedReelCity !== 'Select City') {
      cityIdNum = Number(this.selectedReelCity);
      if (this.city1 && this.city1.length > 0) {
        const selectedCityObj = this.city1.find((c: any) => Number(c.cid) === cityIdNum || String(c.cid) === String(this.selectedReelCity));
        if (selectedCityObj && selectedCityObj.cname) {
          cityNameLower = selectedCityObj.cname.toLowerCase();
        }
      }
      if (!cityNameLower && typeof this.selectedReelCity === 'string' && isNaN(Number(this.selectedReelCity))) {
        cityNameLower = this.selectedReelCity.toLowerCase();
      }
    }

    this.filteredReels = this.allReels.filter((reel: any) => {
      if (reel._filterCacheBuilt !== 2) {
        this.buildReelCache(reel);
      }

      if (cityIdNum !== null && !isNaN(cityIdNum)) {
        const matchCityId = Number(reel.city_id || (reel.project_about_developer && reel.project_about_developer.city_id));
        let matchCityName = false;
        if (cityNameLower) {
          matchCityName = reel._cachedLocLower.includes(cityNameLower) || cityNameLower.includes(reel._cachedLocLower);
        }
        if (matchCityId !== cityIdNum && !matchCityName) {
          return false;
        }
      }

      if (selectedSearchLower && !reel._cachedSearchText.includes(selectedSearchLower)) {
        return false;
      }

      if (selectedSegmentsLower.length > 0) {
        const matchesSegment = selectedSegmentsLower.some(seg =>
          reel._cachedSegmentLower.includes(seg) || seg.includes(reel._cachedSegmentLower) ||
          (reel._cachedSegmentArray && reel._cachedSegmentArray.some((cs: string) => cs.includes(seg) || seg.includes(cs)))
        );
        if (!matchesSegment) {
          return false;
        }
      }

      if (selectedTypesLower.length > 0) {
        const matchesType = selectedTypesLower.some(st =>
          reel._cachedTypesLower.some((rt: string) => rt.includes(st) || st.includes(rt))
        );
        if (!matchesType) {
          return false;
        }
      }

      if (selectedBHKsLower.length > 0) {
        const matchesBHK = selectedBHKsLower.some(sb =>
          reel._cachedBhksLower.some((rb: string) => this.matchBHKItem(sb, rb))
        );
        if (!matchesBHK) {
          return false;
        }
      }

      return true;
    });
  }

  applyAndShowFilteredReels(): void {
    if (!this.filteredReels || this.filteredReels.length === 0) {
      this.toastr.info('No reels found matching selected filters');
      return;
    }
    this.showFilters = false;
    this.reels = [...this.filteredReels];
    this.activeReelIndex = 0;
    this.updateSanitizedReelUrl();
  }

  getReelUniqueKey(videoLink?: string, videoFile?: string, projId?: any, vIdx?: number): string {
    const normFile = (videoFile || '').trim().toLowerCase();
    const normLink = (videoLink || '').trim().toLowerCase();
    if (normFile) {
      const fileName = normFile.substring(normFile.lastIndexOf('/') + 1);
      return `file_${fileName}`;
    }
    if (normLink) {
      return `link_${normLink}`;
    }
    return `empty_${projId || ''}_${vIdx ?? ''}`;
  }

  extractReelsFromProjects(projects: any[]): void {
    if (!projects || !Array.isArray(projects)) return;
    let addedCount = 0;

    projects.forEach((proj: any, idx: number) => {
      if (this.singleproject && proj) {
        const currentId = this.singleproject.id;
        const projId = proj.id;
        if (currentId !== undefined && projId !== undefined && String(currentId) === String(projId)) {
          return;
        }
        const currentName = String(this.singleproject.project_name || '').trim().toLowerCase();
        const projNameStr = String(proj.project_name || proj.proj_name || '').trim().toLowerCase();
        if (currentName && projNameStr && currentName === projNameStr) {
          return;
        }
      }
      let videos = proj.project_video || proj.videos || [];
      if (typeof videos === 'string') {
        try { videos = JSON.parse(videos); } catch (e) { videos = []; }
      }
      if (!Array.isArray(videos) || videos.length === 0) {
        let vFiles: string[] = [];
        let vLinks: string[] = [];
        let vThumbs: string[] = [];
        let vSources: string[] = [];
        try {
          if (typeof proj.proj_video_file === 'string' && proj.proj_video_file.trim().startsWith('[')) {
            vFiles = JSON.parse(proj.proj_video_file);
          } else if (proj.proj_video_file && typeof proj.proj_video_file === 'string') {
            vFiles = [proj.proj_video_file];
          } else if (Array.isArray(proj.proj_video_file)) {
            vFiles = proj.proj_video_file;
          }
        } catch (e) { }
        try {
          if (typeof proj.proj_video_link === 'string' && proj.proj_video_link.trim().startsWith('[')) {
            vLinks = JSON.parse(proj.proj_video_link);
          } else if (proj.proj_video_link && typeof proj.proj_video_link === 'string') {
            vLinks = [proj.proj_video_link];
          } else if (Array.isArray(proj.proj_video_link)) {
            vLinks = proj.proj_video_link;
          }
        } catch (e) { }
        try {
          if (typeof proj.proj_video_thumbnail === 'string' && proj.proj_video_thumbnail.trim().startsWith('[')) {
            vThumbs = JSON.parse(proj.proj_video_thumbnail);
          } else if (proj.proj_video_thumbnail && typeof proj.proj_video_thumbnail === 'string') {
            vThumbs = [proj.proj_video_thumbnail];
          } else if (Array.isArray(proj.proj_video_thumbnail)) {
            vThumbs = proj.proj_video_thumbnail;
          }
        } catch (e) { }
        try {
          if (typeof proj.video_source === 'string' && proj.video_source.trim().startsWith('[')) {
            vSources = JSON.parse(proj.video_source);
          } else if (proj.video_source && typeof proj.video_source === 'string') {
            vSources = [proj.video_source];
          } else if (Array.isArray(proj.video_source)) {
            vSources = proj.video_source;
          }
        } catch (e) { }

        const maxLen = Math.max(vFiles.length, vLinks.length);
        if (maxLen > 0) {
          videos = [];
          for (let i = 0; i < maxLen; i++) {
            videos.push({
              video_source: vSources[i] || 'file',
              proj_video_file: vFiles[i] || '',
              proj_video_link: vLinks[i] || '',
              proj_video_thumbnail: vThumbs[i] || ''
            });
          }
        }
      }

      if (Array.isArray(videos) && videos.length > 0) {
        const projName = proj.project_name || proj.proj_name || '';
        const builderName = proj.builderName || proj.proj_builderName || proj.project_builder_name || proj.builder_name || 'Aarsh Group';
        const localities = proj.prjlocalities || proj.project_localities || proj.localities || proj.address || proj.area || 'Ahmedabad';
        const segment = proj.property_for || proj.segment || 'Buy';
        const propertyType = proj.projectType || proj.property_type || proj.project_type || 'Flat';
        let floorPlansArray: any[] = [];
        if (Array.isArray(proj.floor_plans)) {
          floorPlansArray = proj.floor_plans;
        } else if (typeof proj.floor_plans === 'string' && proj.floor_plans.trim()) {
          try {
            const parsed = JSON.parse(proj.floor_plans);
            if (Array.isArray(parsed)) floorPlansArray = parsed;
          } catch (e) { }
        }

        const bhk = Array.from(new Set(floorPlansArray.map((fp: any) => fp.bhk_type).filter(Boolean)));

        const carpetAreas = floorPlansArray
          .map(fp => parseFloat(String(fp.carpet_area ?? '').replace(/[^\d.]/g, '')))
          .filter(n => !isNaN(n) && n > 0);
        const minAreaNum = carpetAreas.length ? Math.min(...carpetAreas) : null;
        const maxAreaNum = carpetAreas.length ? Math.max(...carpetAreas) : null;
        const calcMinSize = minAreaNum !== null ? `${minAreaNum} SqFt` : "";
        const calcMaxSize = (maxAreaNum !== null && maxAreaNum !== minAreaNum) ? `${maxAreaNum} SqFt` : "";

        const cityId = proj.city_id || proj.project_city || null;
        const cityName = proj.city || proj.searchcity || localities;

        videos.forEach((video: any, vIdx: number) => {
          const videoSrc = video.video_source || 'file';
          const videoLink = video.proj_video_link || video.link || '';
          let videoFile = video.proj_video_file || video.file || '';
          if (videoFile && !videoFile.startsWith('http') && !videoFile.startsWith('data:')) {
            videoFile = `https://realtymart.com/backend/public/images/project_video/${videoFile}`;
          }
          let videoThumb = video.proj_video_thumbnail || video.thumbnail || '';
          if (videoThumb && !videoThumb.startsWith('http') && !videoThumb.startsWith('data:')) {
            videoThumb = `https://realtymart.com/backend/public/images/project_video_thumbnail/${videoThumb}`;
          }

          if (videoLink || videoFile) {
            const reelKey = this.getReelUniqueKey(videoLink, videoFile, proj.id || idx, vIdx);
            if (!this.seenReelKeys.has(reelKey)) {
              let logoUrl = proj.project_logo || video.project_logo || null;
              if (logoUrl && typeof logoUrl === 'string' && !logoUrl.startsWith('http') && !logoUrl.startsWith('data:')) {
                logoUrl = `https://realtymart.com/backend/public/images/project_logo/${logoUrl}`;
              }
              let bannerUrl = proj.project_banner_image || video.project_banner_image || null;
              if (bannerUrl && typeof bannerUrl === 'string' && !bannerUrl.startsWith('http') && !bannerUrl.startsWith('data:')) {
                bannerUrl = `https://realtymart.com/backend/public/images/project_banner_image/${bannerUrl}`;
              } else if (!bannerUrl && logoUrl) {
                bannerUrl = logoUrl;
              }
              const firstUrlPart = proj.firstUrlPart || proj.projectfirstUrlPart || video.firstUrlPart || (projName ? String(projName).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'project');
              const secondUrlPart = proj.secondUrlPart || proj.projectsecondUrlPart || video.secondUrlPart || (proj.id ? `prjid-${proj.id}` : '');
              const bhkTypes = Array.from(new Set(
                (this.floorPlanList || []).map(fp => fp.bhk_type).filter(Boolean)
              ));
              this.seenReelKeys.add(reelKey);
              const enriched = {
                ...video,
                id: proj.id || video.id || null,
                video_source: videoSrc,
                proj_video_link: videoLink,
                proj_video_file: videoFile,
                proj_video_thumbnail: videoThumb,
                proj_builderName: video.proj_builderName || video.builderName || builderName,
                project_localities: video.project_localities || video.localities || video.area || localities,
                segment: video.segment || video.property_for || segment,
                property_type: video.property_type || video.projectType || video.project_type || propertyType,
                bhk: video.bhk && Array.isArray(video.bhk) ? Array.from(new Set(video.bhk)) : bhk,
                city_id: video.city_id || cityId,
                project_name: video.project_name || video.proj_name || projName,
                minSize: minAreaNum !== null ? calcMinSize : '',
                maxSize: minAreaNum !== null ? calcMaxSize : '',
                firstUrlPart: firstUrlPart,
                secondUrlPart: secondUrlPart,
                project_about_developer: {
                  id: proj.id || video.id || null,
                  logo: logoUrl,
                  project_name: video.project_name || video.proj_name || projName,
                  city: video.city || cityName,
                  city_id: video.city_id || cityId,
                  builderName: video.proj_builderName || video.builderName || builderName,
                  image: bannerUrl || '',
                  minPrice: proj.project_minimum_price || video.minPrice || '',
                  maxPrice: proj.project_maximum_price || video.maxPrice || '',
                  minSize: minAreaNum !== null ? calcMinSize : '',
                  maxSize: minAreaNum !== null ? calcMaxSize : '',
                  type: bhk && Array.isArray(bhk) && bhk.length ? Array.from(new Set(bhk)).join(' - ') : (typeof bhk === 'string' ? bhk : ""),
                  contact_no: proj.project_contact_no || video.contact_no || '',
                  firstUrlPart: firstUrlPart,
                  secondUrlPart: secondUrlPart
                }
              };
              this.buildReelCache(enriched);
              this.allReels.push(enriched);
              addedCount++;
            }
          }
        });
      }
    });

    if (addedCount > 0) {
      this.applyReelFiltersSync();
    }
  }

  fetchCities() {
    this.http.get<{ data: { id: number; name: string }[] }>(`${environment.apiUrl}cities`).subscribe(
      (response: any) => {
        response.responseData = response.responseData.filter((city: { id: number; name: string }) => FilteredCities.includes(city.name));
        this.city1 = response.responseData.map((city: any) => ({
          cid: city.id,
          cname: city.name
        }));
        this.syncFilterCityWithActiveReel();
      },
      (error: any) => {
        console.error('API Error:', error);
      }
    );
  }

  checkScrollPosition() {
    const el = this.slider.nativeElement;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    this.isAtEnd = el.scrollLeft >= (maxScrollLeft - 5);
  }

  backToLogin() {
    this.brochureOtpVisible = false;
    this.brochureRegisterVisible = false;
    this.brochureOtp = ['', '', '', ''];
  }

  goToSignUp() {
    this.router.navigate(['/registration']);
  }

  closeLoginModal() {
    this.brochureOtpVisible = false;
    this.brochureRegisterVisible = false;
    const modalEl = document.getElementById('get-builder');
    if (modalEl) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalEl);
      if (bootstrapModal) {
        bootstrapModal.hide();
      } else {
        const newModal = new bootstrap.Modal(modalEl);
        newModal.hide();
      }
    }
  }

  openOtpModal(action: "view-contact" | "whatsapp" | "schedule-visit" | "brochure", type?: 'header' | 'sticky' | 'mobile' | 'sidebar'): void {
    this.selectedAction = action;
    if (action === 'view-contact' && type) {
      this.pendingContactPopover = type;
    }
  }

  downloadBrochureDirectly() {
    this.selectedAction = 'brochure';
    // Prefill formDataphone from localStorage
    this.formDataphone.contactusername = localStorage.getItem('name') || '';
    this.formDataphone.contactuseremail = localStorage.getItem('email') || '';
    this.formDataphone.contactcontact_no = localStorage.getItem('contact_no') || '';
    this.formDataphone.termsContactAccepted = true;

    // Submit inquiry
    this.submitFormPhone();

    // Open brochure PDF
    const pdfUrl = this.singleproject?.project_brochure;
    if (pdfUrl) {
      this.toastr.success('Opening brochure...');
      setTimeout(() => {
        window.open(pdfUrl, '_blank');
      }, 500);
    } else {
      this.toastr.warning('Brochure is not available.');
    }
  }

  registerAndDownloadBrochure() {
    this.brochureNameError = !this.brochureFormData.name || this.brochureFormData.name.trim().length < 3;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.brochureEmailError = !this.brochureFormData.email || !emailPattern.test(this.brochureFormData.email);

    if (this.brochureNameError || this.brochureEmailError) {
      return;
    }

    this.spinner.show();

    // Store inquiry
    const payload = {
      contact_no: this.brochureFormData.mobile,
      useremail: this.brochureFormData.email || '',
      username: this.brochureFormData.name,
      project_Id: this.singleproject.id,
      builder_id: '',
      leads_type: 'Project',
      leads_for: this.singleproject.property_for,
      receiver_user_id: this.singleproject.user_id,
      countrycode: this.countryCode,
      request_price: 0,
    };

    this.http.post(`${this.apiUrl}storeinquiry`, payload).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status === true) {
          this.activityTrackerService.logActivity('Inquiry stored for project', '');
          this.toastr.success('Inquiry stored successfully.');

          // Save details locally and establish login session with all keys
          if (response.data && response.data.token) {
            localStorage.setItem('myrealtylogintoken', response.data.token);
            localStorage.setItem('userId', response.data.id || response.data.userId || '');
            localStorage.setItem('email', response.data.email || this.brochureFormData.email || '');
            localStorage.setItem('contact_no', response.data.contact_no || this.brochureFormData.mobile || '');
            localStorage.setItem('role', response.data.role || 'user');
            localStorage.setItem('name', response.data.name || this.brochureFormData.name || '');
            localStorage.setItem('sessionId', response.data.sessionId || '');
          } else {
            localStorage.setItem('myrealtylogintoken', 'registered_guest_token');
            localStorage.setItem('userId', 'guest_user_id');
            localStorage.setItem('email', this.brochureFormData.email || '');
            localStorage.setItem('contact_no', this.brochureFormData.mobile || '');
            localStorage.setItem('role', 'user');
            localStorage.setItem('name', this.brochureFormData.name || '');
            localStorage.setItem('sessionId', 'guest_session_id');
          }
          this.is_token = true;

          // Close modal
          this.closeLoginModal();

          // Open brochure PDF
          if (this.selectedAction === 'brochure') {
            const pdfUrl = this.singleproject?.project_brochure;
            if (pdfUrl) {
              window.open(pdfUrl, '_blank');
            } else {
              this.toastr.warning('Brochure is not available.');
            }
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else if (this.selectedAction === 'view-contact') {
            this.showContactDetails = true;
            this.activeContactPopover = this.pendingContactPopover;
          } else if (this.selectedAction === 'whatsapp') {
            this.redirectToWhatsApp();
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else if (this.selectedAction === 'schedule-visit') {
            this.openScheduleVisitModal();
          }
        } else {
          this.toastr.error('Failed to submit enquiry.');
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error('Error submitting enquiry.');
      }
    );
  }

  handleContactClick(type: 'header' | 'sticky' | 'mobile' | 'sidebar') {
    this.activeContactPopover = this.activeContactPopover === type ? null : type;
    this.showContactDetails = this.activeContactPopover !== null;
    if (this.activeContactPopover) {
      this.formDataphone.contactusername = localStorage.getItem('name') || '';
      this.formDataphone.contactuseremail = localStorage.getItem('email') || '';
      this.formDataphone.contactcontact_no = localStorage.getItem('contact_no') || '';
      this.formDataphone.termsContactAccepted = true;
      this.submitFormPhone();
    }
  }

  redirectToWhatsApp() {
    this.formDataphone.contactusername = localStorage.getItem('name') || '';
    this.formDataphone.contactuseremail = localStorage.getItem('email') || '';
    this.formDataphone.contactcontact_no = localStorage.getItem('contact_no') || '';
    this.formDataphone.termsContactAccepted = true;
    this.submitFormPhone();

    const contactNo = this.singleproject?.project_contact_no;
    if (contactNo) {
      let clean = String(contactNo).replace(/\D/g, '');
      if (clean.length === 10) {
        clean = '91' + clean;
      }
      const message = encodeURIComponent(`Hi, I'm interested in the project "${this.singleproject?.project_name}" on RealtyMart.`);
      const whatsappUrl = `https://wa.me/${clean}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } else {
      this.toastr.warning('WhatsApp number is not available.');
    }
  }

  openScheduleVisitModal() {
    this.scheduleVisitData.remarks = '';
    this.scheduleVisitDateTimeError = false;
    this.scheduleVisitData.visitDateTime = '';

    const modalEl = document.getElementById('schedule-visit-modal');
    if (modalEl) {
      const bootstrapModal = new bootstrap.Modal(modalEl);
      bootstrapModal.show();

      if (this.visitFlatpickr) {
        this.visitFlatpickr.destroy();
        this.visitFlatpickr = null;
      }

      const inputEl = document.getElementById('visitDateTimeInput') as HTMLInputElement;
      if (inputEl) {
        const now = new Date();
        this.visitFlatpickr = flatpickr(inputEl, {
          enableTime: true,
          dateFormat: 'F j, Y h:i K', // "June 29, 2026 02:25 PM"
          defaultDate: now,
          minDate: 'today',
          time_24hr: false,
          disableMobile: true,
          clickOpens: true,
          static: true, // CRITICAL: positions picker cleanly inside relative parent container via CSS
          appendTo: inputEl.parentElement || modalEl,

          onChange: (selectedDates: Date[]) => {
            if (selectedDates.length > 0) {
              const d = selectedDates[0];
              const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              this.scheduleVisitData.visitDateTime = iso;
              this.scheduleVisitDateTimeError = false;
            }
          }
        });
        (this.visitFlatpickr as any).setDate(now, true);
      }
    }
  }

  closeScheduleVisitModal() {
    // Destroy the flatpickr instance when modal closes
    if (this.visitFlatpickr) {
      this.visitFlatpickr.destroy();
      this.visitFlatpickr = null;
    }
    const modalEl = document.getElementById('schedule-visit-modal');
    if (modalEl) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalEl);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  submitScheduleVisit() {
    // visitDateTime is set by the flatpickr onChange callback
    this.scheduleVisitDateTimeError = !this.scheduleVisitData.visitDateTime;
    if (this.scheduleVisitDateTimeError) {
      return;
    }

    this.spinner.show();

    const payload = {
      date: this.scheduleVisitData.visitDateTime,
      message: this.scheduleVisitData.remarks || '',
    };

    const token = localStorage.getItem('myrealtylogintoken');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}scheduled-visit`, payload, { headers }).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status === true) {
          this.activityTrackerService.logActivity('Schedule Visit Inquiry stored', '');
          this.toastr.success(response.message);
          this.closeScheduleVisitModal();
        } else {
          this.toastr.error('Failed to schedule visit. Please try again.');
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error('Error scheduling visit.');
      }
    );
  }

  isPdf(url: string): boolean {
    return !!url && url.toLowerCase().endsWith('.pdf');
  }

  openDeveloperProject(item: any) {

    if (item.id === this.singleproject?.id) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    window.location.href = item.project_url
  }

  /** Enrich aboutDeveloperProjects: images, BHK label, city */
  mapDeveloperProjects(list: any[]): any[] {
    if (!Array.isArray(list)) return [];
    const cityName = this.resolveProjectCityName();
    const currentBhk = this.getCurrentProjectBhkLabel();
    const currentType = this.getCurrentProjectTypeLabel();

    return list.map((p: any) => {
      const images = this.normalizeDeveloperImages(p);
      const isCurrent = !!p.isCurrentProject || p.id === this.singleproject?.id;
      let bhkLabel = p.bhkLabel || p.bhk || p.bhk_type || '';
      if (isCurrent) {
        bhkLabel = this.buildDeveloperTypeLabel(bhkLabel || currentBhk, currentType);
      } else if (!bhkLabel && p.project_type) {
        const pt = Array.isArray(p.project_type) ? p.project_type.join(', ') : String(p.project_type);
        bhkLabel = pt;
      }
      return {
        ...p,
        images,
        bhkLabel,
        cityName: p.cityName || p.city || cityName || '',
      };
    });
  }

  normalizeDeveloperImages(item: any): string[] {
    if (!item) return [];
    // API field: project_images
    if (Array.isArray(item.project_images) && item.project_images.length > 0) {
      return item.project_images.filter((img: any) => !!img);
    }
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images.filter((img: any) => !!img);
    }
    if (item.image) return [item.image];
    if (item.project_banner_image) return [item.project_banner_image];
    return [];
  }

  getDeveloperImages(item: any): string[] {
    if (Array.isArray(item?.images) && item.images.length > 0) return item.images;
    return this.normalizeDeveloperImages(item);
  }

  getDeveloperLocation(item: any): string {
    const locality = (item?.developer_address || item?.project_localities || '').toString().trim();
    const city = (item?.cityName || item?.city || this.resolveProjectCityName() || '').toString().trim();
    if (locality && city && locality.toLowerCase() !== city.toLowerCase()) {
      return `${locality}, ${city}`;
    }
    return locality || city || '';
  }

  resolveProjectCityName(): string {
    const cityId = this.singleproject?.project_city;
    if (cityId !== undefined && cityId !== null && this.city1?.length) {
      const matched = this.city1.find((c: any) => String(c.cid) === String(cityId));
      if (matched?.cname) return matched.cname;
    }
    // Fallbacks from known fields
    const op = this.singleproject?.aboutdeveloper?.Operatingin;
    if (op) return String(op);
    const addr = String(this.singleproject?.project_address || '');
    // try extract city-like token before pincode
    if (addr.toLowerCase().includes('ahmedabad')) return 'Ahmedabad';
    return '';
  }

  /**
   * Format BHK like "3, 4 BHK" from floor_plans.
   * Commercial types come from project_type (Office, Shop, etc.).
   */
  getCurrentProjectBhkLabel(): string {
    const plans = this.singleproject?.floor_plans || this.floorPlanList || [];
    const nums: string[] = [];
    let hasBhkWord = false;
    (Array.isArray(plans) ? plans : []).forEach((fp: any) => {
      const raw = (fp?.bhk_type || fp?.bhk || '').toString().trim();
      if (!raw) return;
      if (/bhk/i.test(raw)) hasBhkWord = true;
      const m = raw.match(/(\d+\+?)/);
      if (m && !nums.includes(m[1])) nums.push(m[1]);
      else if (!m && !nums.includes(raw)) nums.push(raw);
    });
    if (!nums.length) return '';
    if (hasBhkWord || nums.every(n => /^\d+\+?$/.test(n))) {
      return nums.length === 1 ? `${nums[0]} BHK` : `${nums.join(', ')} BHK`;
    }
    return nums.join(', ');
  }

  getCurrentProjectTypeLabel(): string {
    const t = this.singleproject?.project_type;
    if (Array.isArray(t) && t.length) return t.join(', ');
    if (typeof t === 'string' && t) return t;
    return '';
  }

  /** Build display label: "3, 4 BHK Villa" or "Office, Shop, Showroom" */
  buildDeveloperTypeLabel(bhkPart: string, typePart: string): string {
    const bhk = (bhkPart || '').trim();
    const typ = (typePart || '').trim();
    if (bhk && typ) {
      // avoid "4 BHK Flat Flat"
      if (bhk.toLowerCase().includes(typ.toLowerCase())) return bhk;
      return `${bhk} ${typ}`;
    }
    return bhk || typ || '';
  }

  getDeveloperCardImageIndex(cardIndex: number): number {
    return this.developerCardImageIndex[cardIndex] || 0;
  }

  setDeveloperCardImage(cardIndex: number, imageIndex: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.developerCardImageIndex[cardIndex] = imageIndex;
  }

  /** Auto-advance images on all developer cards that have multiple images */
  startDeveloperCardAutoplay(): void {
    this.stopDeveloperCardAutoplay();
    this.developerCardAutoplayTimer = setInterval(() => {
      if (!this.developerProjects || !this.developerProjects.length) return;
      this.developerProjects.forEach((item: any, i: number) => {
        const imgs = this.getDeveloperImages(item);
        if (imgs.length > 1) {
          const cur = this.getDeveloperCardImageIndex(i);
          this.developerCardImageIndex[i] = (cur + 1) % imgs.length;
        }
      });
    }, 3000);
  }

  stopDeveloperCardAutoplay(): void {
    if (this.developerCardAutoplayTimer) {
      clearInterval(this.developerCardAutoplayTimer);
      this.developerCardAutoplayTimer = null;
    }
  }

  shareDeveloperProject(item: any, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    let shareUrl = item?.project_url
      ? (String(item.project_url).startsWith('http') ? item.project_url : `${window.location.origin}${String(item.project_url).startsWith('/') ? '' : '/'}${item.project_url}`)
      : window.location.href;

    this.reelDynamicUrl = shareUrl;
    const modalEl = document.getElementById('shareReelModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 992; // adjust breakpoint if needed
  }

  get showSliderNav(): boolean {
    const length = this.developerProjects?.length || 0;

    return this.isMobileView
      ? length > 2 // Mobile: show arrows if more than 2 cards
      : length > 3; // Desktop: show arrows if more than 3 cards
  }


}