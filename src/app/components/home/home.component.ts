import {
  AfterViewInit,
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TopbuildersService } from '../service/topbuilders.service';
import { HotdealsserviceService } from '../service/hotdealsservice.service';
import { FeaturedcommercialService } from '../service/featuredcommercial.service';
import { FeaturedresidentalService } from '../service/featuredresidental.service';
import { FeaturedbunlowsvillasService } from '../service/featuredbunlowsvillas.service';
import { FeaturedplotsService } from '../service/featuredplots.service';
import { FarmhouseService } from '../service/farmhouse.service';
import { PropertytyperesidentialService } from '../service/propertytyperesidential.service';
import { PropertytypecommercialService } from '../service/propertytypecommercial.service';
import { PropertytypeothertypesService } from '../service/propertytypeothertypes.service';
import { PropertytypepgService } from '../service/propertytypepg.service';
import { PropertytypehostelService } from '../service/propertytypehostel.service';
import { HomepagebannerService } from '../service/homepagebanner.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeolocationService } from '../service/geolocation.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Title, Meta } from '@angular/platform-browser';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { PropertyplotService } from '../service/propertyplot.service';
import { HeaderService } from '../service/header.service';
import { FilteredCities } from 'src/app/filteredcities';
import { SeoService } from 'src/app/seo.service';
declare var bootstrap: any;
interface City {
  cid: number;
  cname: string;
}
interface ErrorMessages {
  [key: string]: { type: string; message: string }[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    RouterModule,
    NgIf,
    NgFor,
  ],
})
export class HomeComponent implements AfterViewInit, OnInit {
  @ViewChild('otpModel') otpModel!: ElementRef;
  selectedResidentialItems: number[] = [];
  selectedCommercialItems: number[] = [];
  selectedPlotItems: number[] = [];
  selectedGenders: string[] = [];
  selectedLookingFor: string[] = [];
  topbuilderData: any;
  topbuilders: any;
  hotdealData: any;
  hotdeals: any;
  ahmedabadProjects: any[] = [];
  featureCommercialData: any;
  featuredcommercials: any;
  featureResidentalData: any;
  featuredResidentals: any;
  featureBunglowsData: any;
  featuredBunglowss: any;
  featurePlotsData: any;
  featurePlotss: any;
  featurefarmhouse: any;
  featureFarmData: any;
  selectedCars: any;
  latitude: any;
  longitude: any;
  myForm: FormGroup;
  propertyresidentialData: any;
  propertyresidential: any;
  propertycommercialData: any;
  propertycommercial: any;
  propertyotherData: any;
  propertyother: any;
  propertyplotData: any;
  propertyplot: any[] = [
    { id: 2, name: 'Residential Land & Plot' },
    { id: 3, name: 'Commercial Land' },
    { id: 4, name: 'Industrial Land' }
  ];
  propertypgData: any;
  propertypg: any;
  propertyhostelData: any;
  propertyhostel: any;
  bannerData: any;
  bannerbuilder: any;
  //  selectedCommercialItems: string[] = [];
  selectedOtherItems: number[] = [];
  errorMessages: ErrorMessages;
  searchError: boolean = false;
  budgetMinInput: any;
  cookie_location = ''; // Make it public
  all_cookies: any = ''; // Make it public
  locationCookie: any;
  activeTab: string = 'buy';
  city: any;
  citySearch: any;
  city1: City[] = [];
  contact: any;
  contactData: any;
  formData: any = {
    username: '',
    useremail: '',
    countrycode: 'IN +91',
    contact_no: null,
    property_for: '',
    otp: '',
    termsAccepted: false
  };
  propertyLabel: string = 'Select Property Type';
  selectedItemsOrder: any[] = [];
  selectedItemsPg: Array<{ id: number, name: string }> = [];
  selectedItemsHostel: Array<{ id: number, name: string }> = [];
  propertyServices: any;
  genderOptions = [
    { id: 1, name: 'Boys' },
    { id: 2, name: 'Girls' }
  ];

  genderHostelOptions = [
    { id: 1, name: 'Boys' },
    { id: 2, name: 'Girls' }
  ];

  validCities: string[] = [
    'Ahmedabad',
    'Gandhinagar',
    'Rajkot',
    'Surat',
    'Vadodara',
  ];

  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  otpError: boolean = false;
  isResendEnabled = false;
  termsError: boolean = false;
  isMobileNumberDisabled: boolean = false;
  openModel = 0;
  remainingTime: number = 60;
  private timer: any;
  isSubmitting = false;
  proj_id: string = '';
  singleProp: any;
  checkToken: any;
  is_token: boolean = false;

  selectedCityChip: string = 'Ahmedabad';
  selectedExtraChips: string[] = [];
  locationInputText: string = '';
  showLocationDropdown: boolean = false;
  showExtraChipsPopover: boolean = false;
  locationSuggestions: Array<{ name: string; category: string; subtext?: string; slug?: string; rawData?: any }> = [];
  selectedSuggestionIndex: number = -1;
  cityLocalities: any[] = [];
  minBudget: string = '';
  maxBudget: string = '';
  activeBudgetTab: string = 'min';

  showCitySelectorDropdown: boolean = false;

  toggleCitySelectorDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.showCitySelectorDropdown = !this.showCitySelectorDropdown;
  }

  selectCityFromSelector(cityName: string) {
    localStorage.setItem('userSelectedCity', cityName);
    this.selectedCityChip = cityName;
    this.selectedExtraChips = [];
    this.saveChipsToLocalStorage();
    this.loadCityLocalities(cityName);
    this.updateCity(cityName);
    this.showCitySelectorDropdown = false;
  }

  getBudgetDisplayLabel(): string {
    const minStr = this.minBudget ? String(this.minBudget).trim() : '';
    const maxStr = this.maxBudget ? String(this.maxBudget).trim() : '';
    if (!minStr && !maxStr) {
      return 'Min Price - Max Price';
    }
    const minFormatted = minStr || 'Min Price';
    const maxFormatted = maxStr || 'Max Price';
    return `${minFormatted} - ${maxFormatted}`;
  }

  toggleExtraChipsPopover(event?: Event) {
    if (event) event.stopPropagation();
    this.showExtraChipsPopover = !this.showExtraChipsPopover;
  }


  constructor(
    public http: HttpClient,
    private activityTrackerService: ActivityTrackerService,
    private titleService: Title, private metaService: Meta,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private topbuildersService: TopbuildersService,
    private hotdealsService: HotdealsserviceService,
    private featurecommercialService: FeaturedcommercialService,
    private featureresidentalService: FeaturedresidentalService,
    private featurebunglowsService: FeaturedbunlowsvillasService,
    private featureplotsService: FeaturedplotsService,
    private farmHouseProjects: FarmhouseService,
    private propertyresidentialservice: PropertytyperesidentialService,
    private propertycommercialservice: PropertytypecommercialService,
    private propertyotherservice: PropertytypeothertypesService,
    private propertyplotservice: PropertyplotService,
    private propertypgservice: PropertytypepgService,
    private propertyhostelservice: PropertytypehostelService,
    private bannerservice: HomepagebannerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private el: ElementRef,
    private geolocationService: GeolocationService,
    private headerService: HeaderService,
    private seoService: SeoService
  ) {
    this.myForm = this.fb.group({
      selectcitysearch: [null, Validators.required],
    });

    // Initialize error messages
    this.errorMessages = {
      selectcitysearch: [{ type: 'required', message: 'City is required.' }],
    };

    this.myForm.get('selectcitysearch')?.valueChanges.subscribe((selectedCityId) => {
      if (!selectedCityId) return;
      const matchedCity = this.citySearch?.find((city: any) => city.id == selectedCityId);
      if (matchedCity && matchedCity.name !== this.city) {
        this.updateCity(matchedCity.name);
        this.headerService.triggerRefresh();
        // Call search API
        this.onSubmit(false);
      }
    });
  }
  handleTabClick(tabName: string): void {
    this.activeTab = tabName;
    this.loadpropertyresidential();
  }
  ngOnInit() {
    // Reset area and user city selection on screen refresh so IP city is selected on refresh
    this.selectedExtraChips = [];
    this.locationInputText = '';
    this.showExtraChipsPopover = false;
    localStorage.removeItem('userSelectedCity');
    localStorage.removeItem('selectedExtraChips');
    localStorage.removeItem('selectedArea');
    localStorage.removeItem('locationInputText');

    this.minBudget = '';
    this.maxBudget = '';
    localStorage.removeItem('minBudget');
    localStorage.removeItem('maxBudget');

    this.seoService.setCanonicalURL(window.location.href);
    this.fetchCities();
    this.checkLoggedIn();
    this.propertyServicesHomePage();
    this.loadpropertyresidential();
    this.loadpropertycommercial();
    this.loadPropertyOther();
    this.loadPropertyPlot();
    this.loadPropertyPg();
    this.loadPropertyHostel();

    // Initialize location via IP on page refresh and load city-based sections
    this.getLocation();
    this.loadCityLocalities(this.selectedCityChip);
    this.titleService.setTitle('Real Estate Property Portal | Real Estate Services | Buy, Sell, Rent Properties | realtymart.com');
    this.metaService.addTag({
      name: 'description',
      content: 'Find the best real estate services. Buy, sell, and rent properties with ease at realtymart.com. Your one-stop property portal!'
    });
    this.metaService.updateTag({
      property: 'og:title', content: 'Real Estate Property Portal | Real Estate Services | Buy, Sell, Rent Properties | realtymart.com'
    });
    this.metaService.updateTag({
      property: 'og:description', content: 'Find the best real estate services. Buy, sell, and rent properties with ease at realtymart.com. Your one-stop property portal!'
    });
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
    }
  }

  ngAfterViewInit() {
    // this.loadHomeBanner();
    this.seoService.setSchema(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "realtymart",
        "url": window.location.href,
        "logo": window.location.href + "assets/images/logo.svg",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91 8320864223",
          "contactType": "technical support",
          "areaServed": "IN",
          "availableLanguage": "en"
        },
        "sameAs": [
          "https://www.instagram.com/realtymart.official/",
          "https://www.facebook.com/realtymartcom",
          "https://www.linkedin.com/company/realtymart-com"
        ]
      }, "organization-schema"
    );
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

  getLocation() {
    this.geolocationService
      .getCityByIp()
      .then((ipCity: string) => {
        if (this.isValidCity(ipCity)) {
          this.updateCity(ipCity);
        } else {
          this.updateCity('Ahmedabad');
        }
      })
      .catch((error: any) => {
        console.error('Error fetching IP city:', error);
        this.updateCity('Ahmedabad');
      });
  }

  isValidCity(city: string): boolean {
    return this.validCities.includes(city);
  }

  updateCity(city: string) {
    this.city = city;
    this.selectedCityChip = city;
    this.searchError = false;
    localStorage.setItem('location', city);
    if (this.city1 && this.myForm) {
      const defaultCity = this.city1.find((c: any) => c.cname === city);
      if (defaultCity && this.myForm.get('selectcitysearch')?.value !== defaultCity.cid) {
        this.myForm.get('selectcitysearch')?.setValue(defaultCity.cid, { emitEvent: false });
      }
    }
    this.loadHotDeals();
    this.loadFeaturedResidentalProjects();
    this.loadFeaturedCommercialProjects();
    this.loadFeaturedBunglowsProjects();
    this.loadFarmHouseProjects();
    this.loadFeaturedPlotsProjects();
    this.loadTopBuilders();
    this.loadHomeBanner();
    this.loadAhmedabadProjects();
  }

  loadHomeBanner(): void {
    this.bannerservice.homepagebannerget(this.city)?.subscribe((bannerData: any) => {
      this.bannerData = bannerData;
      this.bannerbuilder = this.bannerData?.data;
    })
  }

  propertyServicesHomePage() {
    this.http.get(`${environment.apiUrl}propertyserviceshomepage`)
      .subscribe((response: any) => {
        this.propertyServices = response.data;
      }, (error: any) => {
        console.error('Error sending data', error);
      });
  }

  contactowner(propertyid: any) {
    this.proj_id = propertyid;
    this.http
      .get(`${environment.apiUrl}contactowner/${propertyid}`)
      .subscribe(
        (contactData: any) => {
          this.contactData = contactData;
          this.contact = this.contactData?.data;
        },
        (error: any) => {
          // Handle the error as needed
        }
      );
  }

  trackCustomActivity() {
    this.router.navigate(['property-details/:name/:id']);
    this.router.navigate(['project-details/:name/:id']);
    this.router.navigate(['builder-details/:id']);
  }

  loadHotDeals() {
    this.hotdeals = null;
    this.hotdealsService.hotdealget(this.city)?.subscribe((hotdealData) => {
      this.hotdealData = hotdealData;
      this.hotdeals = this.hotdealData?.data;
    });
  }

  loadAhmedabadProjects() {
    this.http.get<any>(`${environment.apiUrl}projectincity/${this.city}?page=1`)
      .subscribe((response) => {
        this.ahmedabadProjects = response?.data?.data || [];
      });
  }

  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  loadFeaturedResidentalProjects() {
    this.featureresidentalService.futureresidentalget(this.city)?.subscribe((featureResidentalData: any) => {
      this.featureResidentalData = featureResidentalData;
      let data = this.featureResidentalData?.data;
      this.featuredResidentals = data && !Array.isArray(data) ? Object.values(data) : data;
    });
  }

  loadFeaturedCommercialProjects() {
    this.featurecommercialService.featurecommercialget(this.city)?.subscribe((featuredcommercialData: any) => {
      this.featureCommercialData = featuredcommercialData;
      let data = this.featureCommercialData?.data;
      this.featuredcommercials = data && !Array.isArray(data) ? Object.values(data) : data;
    });
  }

  loadFeaturedBunglowsProjects() {
    this.featurebunglowsService.featurebunglowsvillasget(this.city)?.subscribe((featureBunglowsData: any) => {
      this.featureBunglowsData = featureBunglowsData;
      let data = this.featureBunglowsData?.data;
      this.featuredBunglowss = data && !Array.isArray(data) ? Object.values(data) : data;
    });
  }

  loadFarmHouseProjects() {
    this.farmHouseProjects.featurefarmhouseget(this.city)?.subscribe((featureFarmData: any) => {
      this.featureFarmData = featureFarmData;
      let data = this.featureFarmData?.data;
      this.featurefarmhouse = data && !Array.isArray(data) ? Object.values(data) : data;
    });
  }

  loadFeaturedPlotsProjects() {
    this.featureplotsService.featuredplotsget(this.city)?.subscribe((featurePlotsData: any) => {
      this.featurePlotsData = featurePlotsData;
      let data = this.featurePlotsData?.data;
      this.featurePlotss = data && !Array.isArray(data) ? Object.values(data) : data;
    });
  }

  loadTopBuilders() {
    this.topbuildersService.topbuilderget(this.city)?.subscribe((data) => {
      this.topbuilderData = data;
      this.topbuilders = this.topbuilderData?.responseData;
    });
  }

  loadpropertyresidential(): void {
    this.propertyresidentialservice.getpropertytyperesidential()?.subscribe((propertyresidentialData: any) => {
      this.propertyresidentialData = propertyresidentialData;
      const apiData = Array.isArray(this.propertyresidentialData?.data) ? this.propertyresidentialData.data : [];
      this.propertyresidential = apiData.filter((item: any) => !item?.name || !/agri/i.test(item.name));

      this.selectedResidentialItems = [];
      this.selectedCommercialItems = [];
      this.selectedPlotItems = [];
      this.selectedOtherItems = [];
      this.selectedItemsOrder = [];
      this.Residencialvisible = false;

      // Update the label with no items selected
      this.updatePropertyLabel();
    });
  }
  loadpropertycommercial(): void {
    this.propertycommercialservice.getpropertytypecommercial()?.subscribe((propertycommercialData: any) => {
      this.propertycommercialData = propertycommercialData;
      const apiData = Array.isArray(this.propertycommercialData?.data) ? this.propertycommercialData.data : [];
      this.propertycommercial = apiData.filter((item: any) => !item?.name || !/agri/i.test(item.name));
    });
  }
  loadPropertyOther(): void {
    this.propertyotherservice.getpropertytypeother()?.subscribe((propertyotherData: any) => {
      this.propertyotherData = propertyotherData;
      const apiData = Array.isArray(this.propertyotherData?.data) ? this.propertyotherData.data : [];
      this.propertyother = apiData.filter((item: any) => !item?.name || !/agri/i.test(item.name));
    });
  }
  loadPropertyPlot(): void {
    const defaultPlots = [
      { id: 2, name: 'Residential Land & Plot' },
      { id: 3, name: 'Commercial Land' },
      { id: 4, name: 'Industrial Land' }
    ];
    this.propertyplotservice.getpropertytypeplot()?.subscribe({
      next: (propertyplotData: any) => {
        this.propertyplotData = propertyplotData;
        const apiData = Array.isArray(this.propertyplotData?.data) ? this.propertyplotData.data : [];
        const rawPlots = apiData.length > 0 ? apiData : defaultPlots;
        this.propertyplot = rawPlots.filter((item: any) => !item?.name || !/agri/i.test(item.name));
      },
      error: () => {
        this.propertyplot = defaultPlots;
      }
    });
  }
  loadPropertyPg(): void {
    this.propertypgservice.getpropertytypepg()?.subscribe((propertypgData: any) => {
      this.propertypgData = propertypgData;
      const apiData = Array.isArray(this.propertypgData?.data) ? this.propertypgData.data : [];
      this.propertypg = apiData.filter((item: any) => !item?.name || !/agri/i.test(item.name));
    });
  }
  loadPropertyHostel(): void {
    this.propertyhostelservice.getpropertytypehostel()?.subscribe((propertyhostelData: any) => {
      this.propertyhostelData = propertyhostelData;
      const apiData = Array.isArray(this.propertyhostelData?.data) ? this.propertyhostelData.data : [];
      this.propertyhostel = apiData.filter((item: any) => !item?.name || !/agri/i.test(item.name));
    });
  }
  visible: boolean = false;
  Residencialvisible: boolean = false;
  Commercialvisible: boolean = false;
  otherproperytypes: boolean = false;
  budget: boolean = false;
  togglebudget: boolean = false;
  gender: boolean = false;
  Lookingfor: boolean = false;
  searchcityname: any;
  type: any;
  searchCityApiSubscription: any;

  toggleDisplayDiv() {
    this.visible = !this.visible;
  }

  renttoggleDisplayDiv() {
    this.visible = !this.visible;
    this.Residencialvisible = true;
  }

  farmhousetoggleDisplayDiv() {
    this.visible = !this.visible;
    this.Residencialvisible = true;
  }

  plotstoggleDisplayDiv() {
    this.visible = !this.visible;
    this.Residencialvisible = true;
  }
  toggleDisplayDivcom() {
    this.visible = !this.visible;
    if (!this.visible) {
      this.Commercialvisible = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const target = event?.target as HTMLElement;
    if (target && target.closest && (target.closest('.property_inner') || target.closest('.mb-search__dropdown') || target.closest('.serch-propert'))) {
      return;
    }
    this.visible = false;
    this.Commercialvisible = false;
    this.togglebudget = false;
    this.showLocationDropdown = false;
    this.showCitySelectorDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    if (!clickedElement.closest('.chip_count_container')) {
      this.showExtraChipsPopover = false;
    }

    if (!clickedElement.closest('.city_selector_trigger') && !clickedElement.closest('.city_selector_dropdown')) {
      this.showCitySelectorDropdown = false;
    }

    // Check if the clicked element is inside the toggle area or the visible div
    if (
      !clickedElement.closest('.property_drop') &&
      !clickedElement.closest('.property_wrapper') &&
      !clickedElement.closest('.property_inner')
    ) {
      this.visible = false;
      this.Commercialvisible = false;
    }

    if (!clickedElement.closest('.budget_dorp') && !clickedElement.closest('.budget-inner')) {
      this.togglebudget = false;
    }
  }

  residencial() {
    this.Residencialvisible = !this.Residencialvisible;
  }
  commercial() {
    this.Commercialvisible = !this.Commercialvisible;
  }
  OtherPropertyTypes() {
    this.otherproperytypes = !this.otherproperytypes;
  }
  Budget() {
    this.budget = !this.budget;
  }
  toggleBudget() {
    this.togglebudget = !this.togglebudget;
    if (this.togglebudget) {
      if (this.minBudget && String(this.minBudget).trim() !== '' && String(this.minBudget).trim() !== 'Min') {
        this.activeBudgetTab = 'max';
      } else {
        this.activeBudgetTab = 'min';
      }
    }
  }
  Gender() {
    this.gender = !this.gender;
  }
  LookingFor() {
    this.Lookingfor = !this.Lookingfor;
  }


  cars = [
    { id: 0, name: 'Ahmedabad' },
    { id: 1, name: 'Rajkot' },
    { id: 2, name: 'Surat' },
    { id: 3, name: 'Vadodara' },
    // { id: 4, name: 'Pune' },
    // { id: 5, name: 'Mumbai' },
    // { id: 6, name: 'Navi Mumbai' },
    // { id: 7, name: 'Banglore' },
    // { id: 8, name: 'NCR' },
    // { id: 9, name: 'Delhi' },
    // { id: 10, name: 'Gurgaon' },
    // { id: 11, name: 'Hydrabad' },
  ];


  //-------------------------------//
  // Hot Deals Slider //
  //-------------------------------//
  slideConfig2 = {
    slidesToShow: 3,
    slidesToScroll: 2,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,  // Time between auto scrolls in ms (default is 3000)
    speed: 800,           // Transition speed in ms (default is 300)
    responsive: [
      {
        breakpoint: 1535,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: true
        },
      },
    ],
  };
  //-------------------------------//
  //Featured Projects Slider //
  //-------------------------------//
  slideConfig1 = {
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: true
        },
      },
    ],
  };



  slideConfig3 = {
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: true
        },
      },
    ],
  };

  //-------------------------------//
  //top proparty Slider //
  //-------------------------------//
  slideConfig4 = {
    slidesToShow: 7,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1365,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  //-------------------------------//
  //top Builders Slider //
  //-------------------------------//
  slideConfig5 = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: true
        },
      },
    ],
  };

  fetchCities() {
    this.http.get<{ data: { id: number; name: string }[] }>(`${environment.apiUrl}cities`).subscribe(
      (response: any) => {
        response.responseData = response.responseData.filter((city: { id: number; name: string }) => FilteredCities.includes(city.name));
        this.city1 = response.responseData.map((city: any) => ({
          cid: city.id,
          cname: city.name
        }));
        this.citySearch = response.responseData;

      },
      (error: any) => {
        console.error('API Error:', error);
      }
    );
  }

  extractLocalityName(loc: any): string {
    if (!loc) return '';
    if (typeof loc === 'string') return loc;
    if (loc.locality && loc.locality.localities) return loc.locality.localities;
    if (loc.localities) return loc.localities;
    if (loc.locality_name) return loc.locality_name;
    if (loc.name) return loc.name;
    if (loc.project_localities) return loc.project_localities;
    if (loc.location) return loc.location;
    return '';
  }

  loadCityLocalities(city?: string) {
    const currentCity = city || this.selectedCityChip || this.city || 'Ahmedabad';
    this.http.get<any>(`${environment.apiUrl}propertieslocalities/${currentCity}`).subscribe(
      (res: any) => {
        const rawList = res?.data?.data || res?.data || res?.responseData || res || [];
        const arr = Array.isArray(rawList) ? rawList : (typeof rawList === 'object' ? Object.values(rawList) : []);
        this.cityLocalities = arr.map((item: any) => this.extractLocalityName(item)).filter((name: string) => name && name.trim() !== '');
      },
      (err) => {
        this.http.get<any>(`${environment.apiUrl}toplocalities/${currentCity}`).subscribe((res2: any) => {
          const rawList2 = res2?.data?.data || res2?.data || res2?.responseData || res2 || [];
          const arr2 = Array.isArray(rawList2) ? rawList2 : (typeof rawList2 === 'object' ? Object.values(rawList2) : []);
          this.cityLocalities = arr2.map((item: any) => this.extractLocalityName(item)).filter((name: string) => name && name.trim() !== '');
        });
      }
    );
  }

  private getCityDefaultLocalities(cityName: string): string[] {
    const city = (cityName || '').toLowerCase().trim();
    if (city.includes('gandhinagar')) {
      return ['Kudasan', 'Raysan', 'Sargasan', 'Infocity', 'Sector 1', 'Sector 6', 'Sector 11', 'Sector 16', 'Sector 21', 'Vavol', 'Adalaj', 'PDPU Road', 'Bhaijipura', 'Pethapur', 'Randheja', 'Koba', 'GIFT City'];
    } else if (city.includes('surat')) {
      return ['Vesu', 'Adajan', 'Piplod', 'Palanpur', 'City Light', 'Varachha', 'Katargam', 'Althan', 'Bhatar', 'Dumas'];
    } else if (city.includes('baroda') || city.includes('vadodara')) {
      return ['Alkapuri', 'Gotri', 'Vasna', 'Manjalpur', 'Bhayli', 'Karelibaug', 'Fatehgunj', 'Subhanpura', 'Atladra', 'Akota'];
    } else if (city.includes('rajkot')) {
      return ['Kalawad Road', '150 Feet Ring Road', 'University Road', 'Yagnik Road', 'Mota Mava', 'Kotharia', 'Raiya Road'];
    } else if (city.includes('ahmedabad') || city.includes('ahmedbad')) {
      return ['Gota', 'Naranpura', 'Bodakdev', 'Ambli', 'Ghuma', 'Bopal', 'Satellite', 'Prahlad Nagar', 'Thaltej', 'Science City', 'Shela', 'Vaishnodevi', 'SG Highway', 'Chandkheda', 'Motera', 'Vastrapur'];
    }
    return [];
  }

  onLocationInput(event?: any) {
    const query = (this.locationInputText || '').trim();
    const city = (this.selectedCityChip || this.city || '').trim();

    if (this.searchCityApiSubscription) {
      this.searchCityApiSubscription.unsubscribe();
    }

    if (!query) {
      this.locationSuggestions = [];
      this.showLocationDropdown = false;
      this.selectedSuggestionIndex = -1;
      return;
    }

    const apiUrl = `${environment.apiUrl}searchcity?searchstring=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`;

    this.searchCityApiSubscription = this.http.get(apiUrl).subscribe(
      (res: any) => {
        const apiSuggestions: Array<{ name: string; category: string; slug?: string; rawData?: any }> = [];

        if (res && res.isSuccess && Array.isArray(res.responseData)) {
          res.responseData.forEach((item: any) => {
            const itemType = (item.type || item.category || '').toLowerCase();
            const name = item.name || item.builder_name || item.builderName || item.project_name || item.projectName || item.title || '';

            if (!name) return;

            if (itemType === 'builder' || item.builderUrl || item.builder_url || item.is_builder) {
              apiSuggestions.push({
                name: name,
                category: 'Builder',
                slug: item.builderUrl || item.builder_url || item.slug || item.url || item.id || '',
                rawData: item
              });
            } else if (itemType === 'project' || item.projectUrl || item.project_url || item.firstUrlPart || item.is_project) {
              apiSuggestions.push({
                name: name,
                category: 'Project',
                slug: item.firstUrlPart || item.projectUrl || item.project_url || item.slug || item.url || '',
                rawData: item
              });
            } else if (itemType === 'city') {
              apiSuggestions.push({
                name: name || item.cname,
                category: 'CITY',
                slug: item.slug || '',
                rawData: item
              });
            } else {
              apiSuggestions.push({
                name: name || item.locality_name || item.area_name,
                category: 'Area',
                slug: item.slug || '',
                rawData: item
              });
            }
          });
        }

        // Local Builders matching
        const lowerQuery = query.toLowerCase();
        if (Array.isArray(this.topbuilders)) {
          this.topbuilders.forEach((builder: any) => {
            const bName = builder.name || builder.builder_name || builder.builderName || '';
            if (bName && bName.toLowerCase().includes(lowerQuery)) {
              if (!apiSuggestions.some(s => s.category === 'Builder' && s.name.toLowerCase() === bName.toLowerCase())) {
                apiSuggestions.push({
                  name: bName,
                  category: 'Builder',
                  slug: builder.builderUrl || builder.builder_url || builder.id || '',
                  rawData: builder
                });
              }
            }
          });
        }

        // Local Projects matching
        const allProjects = [
          ...(Array.isArray(this.featuredResidentals) ? this.featuredResidentals : []),
          ...(Array.isArray(this.featuredcommercials) ? this.featuredcommercials : []),
          ...(Array.isArray(this.featuredBunglowss) ? this.featuredBunglowss : []),
          ...(Array.isArray(this.ahmedabadProjects) ? this.ahmedabadProjects : [])
        ];

        allProjects.forEach((proj: any) => {
          const pName = proj.project_name || proj.name || proj.projectName || '';
          if (pName && pName.toLowerCase().includes(lowerQuery)) {
            if (!apiSuggestions.some(s => s.category === 'Project' && s.name.toLowerCase() === pName.toLowerCase())) {
              apiSuggestions.push({
                name: pName,
                category: 'Project',
                slug: proj.firstUrlPart || proj.projectUrl || proj.project_url || proj.slug || (pName ? pName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : ''),
                rawData: proj
              });
            }
          }
        });

        this.locationSuggestions = apiSuggestions;
        this.showLocationDropdown = this.locationSuggestions.length > 0;
        this.selectedSuggestionIndex = -1;
      },
      (error) => {
        console.error('Error fetching searchcity suggestions:', error);
        this.locationSuggestions = [];
        this.showLocationDropdown = false;
      }
    );
  }

  saveChipsToLocalStorage() {
    if (this.selectedCityChip) {
      localStorage.setItem('selectedCityChip', this.selectedCityChip);
      localStorage.setItem('location', this.selectedCityChip);
    } else {
      localStorage.removeItem('selectedCityChip');
    }
    if (this.selectedExtraChips && this.selectedExtraChips.length > 0) {
      localStorage.setItem('selectedExtraChips', JSON.stringify(this.selectedExtraChips));
    } else {
      localStorage.removeItem('selectedExtraChips');
    }
    if (this.minBudget) {
      localStorage.setItem('minBudget', this.minBudget);
    } else {
      localStorage.removeItem('minBudget');
    }
    if (this.maxBudget) {
      localStorage.setItem('maxBudget', this.maxBudget);
    } else {
      localStorage.removeItem('maxBudget');
    }
  }

  onLocationEnter(event?: Event) {
    if (event) event.preventDefault();
    const query = (this.locationInputText || '').trim();
    if (query) {
      const formatted = query.charAt(0).toUpperCase() + query.slice(1);
      if (!this.selectedExtraChips.includes(formatted)) {
        this.selectedExtraChips.push(formatted);
        this.saveChipsToLocalStorage();
      }
      this.locationInputText = '';
      this.showLocationDropdown = false;
    }
  }

  onLocationFocus() {
    this.onLocationInput();
  }

  onLocationBlur() {
    setTimeout(() => {
      this.showLocationDropdown = false;
      this.selectedSuggestionIndex = -1;
    }, 250);
  }

  onLocationKeydown(event: KeyboardEvent) {
    if (!this.showLocationDropdown || !this.locationSuggestions || this.locationSuggestions.length === 0) {
      if (event.key === 'ArrowDown') {
        this.onLocationInput();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.selectedSuggestionIndex < this.locationSuggestions.length - 1) {
        this.selectedSuggestionIndex++;
      } else {
        this.selectedSuggestionIndex = 0;
      }
      this.scrollSelectedSuggestionIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.selectedSuggestionIndex > 0) {
        this.selectedSuggestionIndex--;
      } else {
        this.selectedSuggestionIndex = this.locationSuggestions.length - 1;
      }
      this.scrollSelectedSuggestionIntoView();
    } else if (event.key === 'Enter') {
      if (this.selectedSuggestionIndex >= 0 && this.selectedSuggestionIndex < this.locationSuggestions.length) {
        event.preventDefault();
        const selectedItem = this.locationSuggestions[this.selectedSuggestionIndex];
        this.selectLocationSuggestion(selectedItem);
        this.selectedSuggestionIndex = -1;
      } else {
        this.onLocationEnter(event);
      }
    } else if (event.key === 'Escape') {
      this.showLocationDropdown = false;
      this.selectedSuggestionIndex = -1;
    }
  }

  scrollSelectedSuggestionIntoView() {
    setTimeout(() => {
      const dropdowns = document.querySelectorAll('.search_suggestions_dropdown');
      dropdowns.forEach((dropdown) => {
        const activeItem = dropdown.querySelector('.suggestion_item.active');
        if (activeItem) {
          activeItem.scrollIntoView({ block: 'nearest' });
        }
      });
    }, 0);
  }

  selectLocationSuggestion(item: { name: string; category: string; slug?: string; rawData?: any }) {
    if (item.category === 'CITY') {
      this.selectedCityChip = item.name;
      this.selectedExtraChips = [];
      this.saveChipsToLocalStorage();
      this.loadCityLocalities(item.name);
      this.updateCity(item.name);
      this.loadHotDeals();
      this.loadFeaturedResidentalProjects();
      this.loadFeaturedCommercialProjects();
      this.loadFeaturedBunglowsProjects();
      this.loadFarmHouseProjects();
      this.loadFeaturedPlotsProjects();
      this.loadTopBuilders();
      this.loadHomeBanner();
      this.loadAhmedabadProjects();
    } else if (item.category === 'Project') {
      let slug = item.slug || item.rawData?.firstUrlPart || item.rawData?.projectUrl || item.rawData?.project_url || item.rawData?.slug;
      if (!slug && item.rawData?.id) {
        const projName = (item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        slug = `${projName}-${item.rawData.id}`;
      } else if (!slug && item.name) {
        slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (slug) {
        if (slug.startsWith('/')) {
          this.router.navigateByUrl(slug);
        } else {
          this.router.navigate(['/' + slug]);
        }
      }
      this.locationInputText = '';
      this.showLocationDropdown = false;
      return;
    } else if (item.category === 'Builder') {
      let slug = item.slug || item.rawData?.builderUrl || item.rawData?.builder_url || item.rawData?.slug || item.rawData?.id;
      if (!slug && item.name) {
        slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (slug) {
        this.router.navigate(['/builder-detail', slug]);
      }
      this.locationInputText = '';
      this.showLocationDropdown = false;
      return;
    } else if (item.category === 'Area') {
      if (!this.selectedExtraChips.includes(item.name)) {
        this.selectedExtraChips.push(item.name);
        this.saveChipsToLocalStorage();
      }
    }

    this.locationInputText = '';
    this.showLocationDropdown = false;
    this.selectedSuggestionIndex = -1;
  }

  removeCityChip() {
    this.selectedCityChip = '';
    this.selectedExtraChips = [];
    this.saveChipsToLocalStorage();
    this.showLocationDropdown = false;
    this.onLocationInput();
  }

  removeExtraChip(index: number) {
    this.selectedExtraChips.splice(index, 1);
    this.saveChipsToLocalStorage();
  }

  removeAllExtraChips() {
    this.selectedExtraChips = [];
    this.saveChipsToLocalStorage();
  }

  parsePriceValue(val: any): number {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    const str = String(val).toLowerCase().replace(/,/g, '').trim();
    if (!str) return 0;
    if (str.includes('cr')) {
      const num = parseFloat(str.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num * 10000000;
    }
    if (str.includes('lac') || str.includes('lakh')) {
      const num = parseFloat(str.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num * 100000;
    }
    if (str.includes('k')) {
      const num = parseFloat(str.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num * 1000;
    }
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  isPriceInBudget(item: any, minVal: number, maxVal: number): boolean {
    if (!item) return true;
    const itemMin = this.parsePriceValue(item.project_minimum_price || item.minprice || item.rent_amount || item.total_price || item.price);
    const itemMax = this.parsePriceValue(item.project_maximum_price || item.maxprice || item.total_price || item.rent_amount || item.price);

    let flatPrices: number[] = [];
    if (Array.isArray(item.properties)) {
      flatPrices = item.properties.map((p: any) => this.parsePriceValue(p.price || p.total_price || p.rent_amount)).filter((p: number) => p > 0);
    }

    if (itemMin <= 0 && itemMax <= 0 && flatPrices.length === 0) return true;

    const priceMin = itemMin > 0 ? itemMin : (flatPrices.length > 0 ? Math.min(...flatPrices) : itemMax);
    const priceMax = itemMax > 0 ? itemMax : (flatPrices.length > 0 ? Math.max(...flatPrices) : itemMin);

    if (minVal > 0 && maxVal > 0) {
      return priceMin >= minVal && priceMax <= maxVal;
    } else if (minVal > 0) {
      return priceMin >= minVal;
    } else if (maxVal > 0) {
      return priceMax <= maxVal && priceMin <= maxVal;
    }
    return true;
  }

  onSubmit(redirect: boolean = true) {
    if (!this.selectedCityChip && !this.myForm.get('selectcitysearch')?.value) {
      this.searchError = true;
      return;
    }
    this.searchError = false;
    const selectedCityIds = this.myForm.get('selectcitysearch')?.value;

    if (selectedCityIds) {
      const matchedCity = this.citySearch.find((city: any) => city.id == selectedCityIds);

      if (matchedCity) {
        const currentCity = localStorage.getItem('location');
        const getCitys = matchedCity.name;
        if (currentCity != getCitys) {
          localStorage.setItem('location', matchedCity.name);
          this.headerService.triggerRefresh();
        }
      }
    }

    const ResidentialItems = this.selectedItemsOrder.filter(
      (item) => item.type === 'RESIDENTIAL'
    ).map((item) => item.id);
    const CommercialItems = this.selectedItemsOrder.filter(
      (item) => item.type === 'COMMERCIAL'
    ).map((item) => item.id);
    const OtherItems = this.selectedItemsOrder.filter(
      (item) => item.type !== 'RESIDENTIAL' && item.type !== 'COMMERCIAL'
    ).map((item) => item.id);

    const selectedCityId = this.myForm.get('selectcitysearch')?.value;
    const selectedCity = this.city1.find(city => city.cid === selectedCityId);
    const location = this.selectedCityChip || selectedCity?.cname || this.city;

    const extraChips = [...this.selectedExtraChips];
    if (this.locationInputText && this.locationInputText.trim()) {
      const typed = this.locationInputText.trim();
      if (!extraChips.includes(typed)) {
        extraChips.push(typed);
      }
    }
    const apiLocality = extraChips.length === 1 ? extraChips[0] : '';
    const extraKeywords = extraChips.join(' ');
    this.saveChipsToLocalStorage();

    if (this.activeTab === 'rent' && redirect) {
      const queryParams: any = {};
      if (this.minBudget) queryParams.minPrice = this.minBudget;
      if (this.maxBudget) queryParams.maxPrice = this.maxBudget;
      if (ResidentialItems && ResidentialItems.length > 0) {
        queryParams.residentialItems = ResidentialItems.join(',');
      }
      if (OtherItems && OtherItems.length > 0) {
        queryParams.otherItems = OtherItems.join(',');
      }
      if (CommercialItems && CommercialItems.length > 0) {
        queryParams.commercialItems = CommercialItems.join(',');
      }
      if (apiLocality) queryParams.locality = apiLocality;
      if (extraKeywords) queryParams.search_keyword = extraKeywords;

      const targetCity = location || 'Ahmedabad';
      let routePath = 'property-for-rent-in-' + targetCity;
      if (this.selectedItemsOrder && this.selectedItemsOrder.length === 1 && this.selectedItemsOrder[0].name) {
        const slug = this.selectedItemsOrder[0].name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (slug) {
          routePath = slug + '-for-rent-in-' + targetCity;
        }
      }

      this.router.navigate([routePath], { queryParams });
      return;
    }

    let searchData: any = {
      location: location,
      city: location,
      locality: '',
      area: '',
      search_keyword: '',
      minPrice: this.minBudget,
      maxPrice: this.maxBudget,
      propertyfor: this.activeTab,
    };

    if (this.activeTab == 'pg' || this.activeTab == 'hostel') {
      searchData.gender = this.selectedGenders;
      searchData.lookingFor = this.selectedLookingFor;
    } else {
      searchData.residentialItems = ResidentialItems;
      searchData.commercialItems = CommercialItems;
      searchData.otherItems = OtherItems;
    }

    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .post(`${environment.apiUrl}searchproject`, searchData, { headers })
      .subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (redirect) {
            let rawData = response?.responseData || response?.data || response || [];
            if (extraChips && extraChips.length > 0 && Array.isArray(rawData)) {
              const lowerKeywords = extraChips.map((k: string) => k.toLowerCase().trim()).filter((k: string) => k.length > 0);
              if (lowerKeywords.length > 0) {
                rawData = rawData.filter((item: any) => {
                  const locName = (
                    item.project_locality_name ||
                    item.prjlocalities ||
                    item.project_localities ||
                    item.locality ||
                    item.location ||
                    item.area ||
                    item.project_location ||
                    item.project_address ||
                    item.address ||
                    item.name ||
                    item.title ||
                    ''
                  ).toLowerCase();
                  return lowerKeywords.some((kw: string) => locName.includes(kw) || kw.includes(locName));
                });
              }
            }

            const minVal = this.parsePriceValue(this.minBudget || localStorage.getItem('minBudget'));
            const maxVal = this.parsePriceValue(this.maxBudget || localStorage.getItem('maxBudget'));
            if ((minVal > 0 || maxVal > 0) && Array.isArray(rawData)) {
              rawData = rawData.filter((item: any) => this.isPriceInBudget(item, minVal, maxVal));
            }

            if (response.responseData) {
              response.responseData = rawData;
            } else if (response.data) {
              response.data = rawData;
            }

            const extraState = {
              ...(response || {}),
              searchKeywords: extraChips,
              searchedLocality: extraKeywords,
              minPrice: this.minBudget,
              maxPrice: this.maxBudget
            };
            this.router.navigate(['search-property'], { state: extraState });
          }
        },
        (error: any) => {
          console.error('API Error:', error);
        }
      );
  }

  updateSelectedItems(event: any, id: number, selectedItemsArray: number[], itemsList: any[], type?: string): void {
    const checked = event.target.checked;
    const selectedItem = itemsList.find(i => i.id === id);

    if (!selectedItem) return;

    if (checked) {
      // Add to order list (for label)
      if (!this.selectedItemsOrder.find(item => item.id === id)) {
        this.selectedItemsOrder.push(selectedItem);
      }
      // Add ID to the specific array
      if (!selectedItemsArray.includes(id)) {
        selectedItemsArray.push(id);
      }
    } else {
      // Remove from order list
      this.selectedItemsOrder = this.selectedItemsOrder.filter(item => item.id !== id);
      // Remove ID
      const index = selectedItemsArray.indexOf(id);
      if (index > -1) {
        selectedItemsArray.splice(index, 1);
      }
    }

    this.updatePropertyLabel();
  }

  handleResidentialCheckboxChange(event: any, id: number) {
    this.updateSelectedItems(event, id, this.selectedResidentialItems, this.propertyresidential);
  }

  rentCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedResidentialItems, this.propertyresidential);
  }

  farmhouseCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedResidentialItems, this.propertyresidential);
  }

  plotsCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedPlotItems.push(id);
    } else {
      this.selectedPlotItems = this.selectedPlotItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    // this.plotschangeLabel();
    this.updateSelectedItems(event, id, this.selectedPlotItems, this.propertyplot);
  }

  pgCheckboxChange(event: any, id: any, name: string) {

    if (event.target.checked) {
      this.selectedItemsPg.push({ id, name });
    } else {
      this.selectedItemsPg = this.selectedItemsPg.filter(item => item.id !== id);
    }
    this.pgChangeLabel();

    if (this.activeTab === 'pg' || this.activeTab === 'hostel') {
      if (name === 'Boys' || name === 'Girls') {
        // Handle Gender selection
        if (event.target.checked) {
          this.selectedGenders.push(name);
        } else {
          this.selectedGenders = this.selectedGenders.filter(gender => gender !== name);
        }
      } else {
        // Handle Looking For selection
        if (event.target.checked) {
          this.selectedLookingFor.push(name);
        } else {
          this.selectedLookingFor = this.selectedLookingFor.filter(lookingFor => lookingFor !== name);
        }
      }
    }
  }

  pgChangeLabel() {
    const selectedCount = this.selectedItemsPg.length;

    if (selectedCount === 0) {
      this.propertyLabel = 'Select Property Type';  // Default label when nothing is selected
    } else if (selectedCount === 1) {

      this.propertyLabel = this.selectedItemsPg[0].name;
    } else {
      // Display the first selected item and count of others
      this.propertyLabel = `${this.selectedItemsPg[0].name} + ${selectedCount - 1}`;

    }

  }

  hostelCheckboxChange(event: any, id: any, name: string) {
    if (event.target.checked) {
      // Add item if checked
      this.selectedItemsHostel.push({ id, name });
    } else {
      // Remove item if unchecked
      this.selectedItemsHostel = this.selectedItemsHostel.filter(item => item.id !== id);
    }
    this.hostelChangeLabel();


    if (this.activeTab === 'pg' || this.activeTab === 'hostel') {
      if (name === 'Boys' || name === 'Girls') {
        // Handle Gender selection
        if (event.target.checked) {
          this.selectedGenders.push(name);
        } else {
          this.selectedGenders = this.selectedGenders.filter(gender => gender !== name);
        }
      } else {
        // Handle Looking For selection
        if (event.target.checked) {
          this.selectedLookingFor.push(name);
        } else {
          this.selectedLookingFor = this.selectedLookingFor.filter(lookingFor => lookingFor !== name);
        }
      }
    }
  }

  hostelChangeLabel() {
    const selectedCount = this.selectedItemsHostel.length;

    if (selectedCount === 0) {
      this.propertyLabel = 'Select Property Type'; // Default label when nothing is selected
    } else if (selectedCount === 1) {
      this.propertyLabel = this.selectedItemsHostel[0].name;
    } else {
      this.propertyLabel = `${this.selectedItemsHostel[0].name} + ${selectedCount - 1}`;
    }
  }

  handleCommercialCheckboxChange(event: any, id: number) {
    this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);

  }

  handleOtherCheckboxChange(event: any, id: number) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);

  }

  updatePropertyLabel(): void {
    const totalSelectedCount = this.selectedItemsOrder.length;

    if (totalSelectedCount > 0) {
      const firstSelectedText = this.selectedItemsOrder[0].name;
      const additionalCount = totalSelectedCount - 1;

      // Set label to display the first selected item, followed by the count of additional selected items
      this.propertyLabel = additionalCount > 0
        ? `${firstSelectedText} +${additionalCount}`
        : firstSelectedText;
    } else {
      this.propertyLabel = 'Select Property Type';  // Default label when no item is selected
    }
  }

  getSelectedText(selectedItems: number[], itemsList: any[]): string {
    if (!selectedItems.length) return '';

    const firstItem = itemsList.find(item => item.id === selectedItems[0]);
    return firstItem ? firstItem.name : '';
  }

  renthandleCommercialCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);
    this.updatePropertyLabel();

  }

  renthandleOtherCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);
    this.updatePropertyLabel();

  }

  farmhousehandleCommercialCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);

  }

  farmhousehandleOtherCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);

  }

  plotshandleCommercialCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);

  }

  plotshandleOtherCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);

  }

  getvaluemin(minval: any, type?: any) {
    const val = String(minval || '').trim();
    this.minBudget = (val === 'Min' || !val) ? '' : val;
    this.saveChipsToLocalStorage();
    if (this.minBudget) {
      this.activeBudgetTab = 'max';
    } else {
      this.activeBudgetTab = 'min';
    }
  }

  getvaluemax(maxval: any, type?: any) {
    const val = String(maxval || '').trim();
    this.maxBudget = (val === 'Max' || !val) ? '' : val;
    this.saveChipsToLocalStorage();
  }

  submitForm() {
    this.spinner.show();

    const payload = this.contact.property ? {

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
      location: this.city
    } : {
      contact_no: this.formData.contact_no,
      useremail: this.formData.useremail,
      username: this.formData.username,
      project_Id: this.contact?.project?.project_id,
      builder_id: this.contact?.project?.builder_id,
      agent_id: this.contact?.project?.agent_id,
      receiver_user_id: this.contact?.project?.user_id,
      leads_type: 'Call for Price',
      leads_for: 'Project',
      location: this.city
    }
    // contact_no :this.formData.contact_no,

    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');

    this.http.post(`${environment.apiUrl}storeinquiry`, payload, { headers })
      .subscribe((response: any) => {
        if (response.status === true) {
          this.activityTrackerService.logActivity(`Inquiry stored for ${this.contact.property ? 'property' : 'project'}`, '');
          this.toastr.success('Inquiry Added successfully!');
          const modalElement = document.getElementById('contact-owner');
          const modalElementProp = document.getElementById('contact-owner-prop');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
          }
          if (modalElementProp) {
            const modalInstance = bootstrap.Modal.getInstance(modalElementProp);
            modalInstance?.hide();
          }
          // this.resetForm();
        }
      }, (error) => {
        console.error('Error sending data', error);
      });
  }


  fetchProperty(property: any) {
    this.singleProp = property;
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

  resendOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }

  verifyOTP() {

    if (this.formData.otp == '') {
      this.toastr.error('Please Enter OTP');
      return
    }
    let payload = {
      contact_no: this.formData.contact_no,
      otp: this.formData.otp,
    }

    this.http
      .post(
        `${environment.apiUrl}verifyinquiryotp`,
        payload
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
            this.submitForm();
            this.isResendEnabled = false;
            this.isMobileNumberDisabled = true;

            // Optional: Delay for user feedback before hiding
            setTimeout(() => {
              this.spinner.hide();
            }, 1000); // Adjust the delay as needed


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
  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
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
    if (this.nameError || this.phoneError || this.emailError || this.termsError) {
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
}

