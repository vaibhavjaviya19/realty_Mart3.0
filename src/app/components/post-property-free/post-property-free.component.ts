import { Component, OnInit, Injectable, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostpropertyfreeService } from '../service/postpropertyfree.service';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from 'src/app/seo.service';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-post-property-free',
  templateUrl: './post-property-free.component.html',
  styleUrls: ['./post-property-free.component.css'],
})
export class PostPropertyFreeComponent {
  submitForm = new FormGroup({
    property_for: new FormControl(null, [Validators.required]),
    property_type: new FormControl('', [Validators.required]),
    property_status: new FormControl(null, [Validators.required]),
    property_city: new FormControl('', [Validators.required]),
    property_locality: new FormControl('', [Validators.required]),
    property_address: new FormControl(null, [Validators.required]),
    project_id: new FormControl('', []),
    landmarks: new FormControl(null, []),
    land_zone: new FormControl('', []),
    property_price_show: new FormControl(null, []),
    property_description: new FormControl(null, [Validators.required]),
    property_facilities: new FormControl(null, [Validators.required]),
    property_main_img: new FormControl<any>(null, [Validators.required]),
    property_img: new FormControl<any>(null, []),
    current_business_sector: new FormControl('', []),
    overlooking: new FormControl(null, [Validators.required]),
    lift: new FormControl('', []),
    is_corner_property: new FormControl(null, [Validators.required]),
    is_road_facing: new FormControl(null, [Validators.required]),
    terms_conditions: new FormControl(null, [Validators.required]),
    no_of_open_sides: new FormControl('', []),
    width_of_road_facing_the_plot: new FormControl(null, []),
    any_construction_done: new FormControl(null, []),
    boundary_wall_made: new FormControl(null, []),
    is_in_gated_colony: new FormControl(null, []),
    total_units: new FormControl(null, []),
    total_towers: new FormControl(null, []),
    water_availability: new FormControl('', []),
    status_of_electricity: new FormControl('', []),
    additional_rooms: new FormControl(null, []),
    car_parking: new FormControl('', []),
    car_parking_open: new FormControl('', []),
    floors_allowed_for_construction: new FormControl('', []),
    modifyInteriors: new FormControl(null, []),
    avbldate: new FormControl(null, []),
    age_of_construction: new FormControl('', []),
    rent_amount: new FormControl(null, []),
    security_amount: new FormControl(null, []),
    maintanance_charges: new FormControl(null, []),
    maintenance_charges_per: new FormControl('', []),
    personal_washroom: new FormControl(null, []),
    pantry_cafeteria: new FormControl(null, []),
    carpet_area: new FormControl(null, []),
    carpet_area_in: new FormControl('', []),
    built_up_area: new FormControl(null, []),
    built_up_area_in: new FormControl('', []),
    super_area: new FormControl(null, []),
    super_area_in: new FormControl('', []),
    ploat_area: new FormControl(null, []),
    ploat_area_in: new FormControl('', []),
    plot_length: new FormControl(null, []),
    plot_width: new FormControl(null, []),
    covered_area: new FormControl(null, []),
    covered_area_in: new FormControl('', []),
    total_price: new FormControl(null, []),
    lac_or_cr: new FormControl('', []),
    price_per_sq_ft: new FormControl(null, []),
    booking_or_token_ammount: new FormControl(null, []),
    thousand_lac_or_cr: new FormControl('', []),
    flooring: new FormControl('', []),
    possession_status: new FormControl('', []),
    facing: new FormControl('', []),
    washroom: new FormControl('', []),
    transaction_type: new FormControl('', []),
    available_from_month: new FormControl('', []),
    available_from_year: new FormControl('', []),
    available_from: new FormControl('', []),
    currently_leased_out: new FormControl('', []),
    assured_returns: new FormControl('', []),
    whom_property_leased: new FormControl('', []),
    monthly_rent: new FormControl('', []),
    leased_on: new FormControl('', []),
    current_business_sector_other: new FormControl('', []),
    in_business_since: new FormControl('', []),
    rate_of_return: new FormControl('', []),
    cmpltprice: new FormControl('', []),
    basic_price: new FormControl('', []),
    floor_plc: new FormControl('', []),
    open_car_parking: new FormControl('', []),
    open_car_parking_unit: new FormControl('', []),
    facing_plc: new FormControl('', []),
    price_includes: new FormControl('', []),
    user_id: new FormControl('', []),
    builder_id: new FormControl('', []),
    agent_id: new FormControl('', []),
    owner_type: new FormControl('', []),
    total_no_of_flats: new FormControl('', []),
    floor_no: new FormControl('', []),
    bathroom: new FormControl('', []),
    bedroom: new FormControl('', []),
    total_floor: new FormControl('', []),
    balconies: new FormControl('', []),
    furnishing_status: new FormControl('', []),
    bedrooms: new FormControl('', []),
    bedroomsize: this.fb.array([]),
    bedroom_length: new FormControl('', []),
    bedroom_width: new FormControl('', [])
  });

  floorOptions: number[] = Array.from({ length: 200 }, (_, i) => i + 1);
  selectedPropertyFor: any;
  selectedPossessionStatus: any;
  selectedAgeOfConstruction: any;
  selectedCurrentBusinessSector: any;
  selectedTransactionType: any;
  selectedAssuredReturns: any;
  selectedAvailabaleDate: any;
  isLeased: any;
  totalcompletePrice: any;
  availableYears: number[] = [];
  businessYears: number[] = [];
  userRoleGet: any;
  propertyType: any;
  landZone: any;
  BusinessSector: any;
  localities: any;
  projectList: any;
  cities: any;
  numberOfBed: any;
  selectedBedRoom: any;
  selectedBathRoom: any;
  selectedOption: any;
  selectedBalcony: any;
  selectedBalconiesOption: any;
  selectedBathRoomOption: any;
  selectedFloor: any;
  selectedFloorOption: any;
  selectedTotalFloor: any;
  selectedFurnishType: string = '';
  selectedTotalFloorOption: any;
  selectedFlatSociety: any = '';
  selectedPropertyType: any;
  isDropdownOpen = false;
  isbalconiDropdownOpen = false;
  isbathRoomDropdownOpen = false;
  isfloorDropdownOpen = false;
  isfloorNoDropdownOpen = false;
  showSection: boolean = false;
  showBalconySection: boolean = false;
  showBathRoomSection: boolean = false;
  showFloorSection: boolean = false;
  selectPreValue: any = '';

  selectedValue = '5+';
  selectedBalconiesValue = '3+';
  selectBathRoomsValue = '3+';
  floorselectedValue: any = '15+';
  totalFloorselectedValue: any = '15+';
  floorNoselectedValue: any = '5+';
  propertyImagePreviews: string[] = [];
  // selectedDate: any = '';

  options = ['5', '6', '7', '8', '9', '10', ' > 10'];
  baconiesoptions = ['4', '5', '6', '7', '8', '9', '10', '> 10'];
  bathRoomoptions = ['4', '5', '6', '7', '8', '9', '10', '> 10'];
  floorNoOptions: any = Array.from({ length: 196 }, (_, i) =>
    (i + 5).toString()
  );
  flooroptions: string[] = [];
  numberOfBeds: any;
  showSections = false;

  isValidEmail() {
    throw new Error('Method not implemented.');
  }
  // email: any;
  onFormSubmit(_t594: NgForm) {
    throw new Error('Method not implemented.');
  }

  getUniqueTypes() {
    const types = this.propertyType?.map((item: any) => item?.type);
    return [...new Set(types)]; // Get unique types
  }


  getPropertiesByType(type: any) {
    return this.propertyType?.filter((item: any) => item?.type === type);
  }
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private PostpropertyfreeService: PostpropertyfreeService,
    public http: HttpClient,
    private toastr: ToastrService,
    private route: Router,
    private seoService: SeoService
  ) {
    this.setMetaTags(
      'Sell and Rent Your Property For Free on RealtyMart',
      '',
    );
    const draftDataJson = localStorage.getItem('postPropertyFormDraft');
    if (draftDataJson) {
      this.restoreDraftData();
    } else {
      const propertyDataJson = localStorage.getItem('postPropertyData');
      const propertyData = propertyDataJson ? JSON.parse(propertyDataJson) : null;
      if (propertyData) {
        this.submitForm.patchValue({
          property_for: propertyData.property_for || '',
        });
        this.onPropertyFor(propertyData.property_for);
      }
    }

    const tokens = localStorage.getItem('myrealtylogintoken');
    if (tokens !== null) {
      this.userRoleGet = localStorage.getItem('role');
    }
  }

  get isUserLoggedIn(): boolean {
    return !!localStorage.getItem('myrealtylogintoken');
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

  @HostListener('document:click', ['$event'])
  outsideClick(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-select')) {
      this.closeAllDropdowns();
    }
  }
  closeAllDropdowns() {
    this.isDropdownOpen = false;
    this.isbalconiDropdownOpen = false;
    this.isbathRoomDropdownOpen = false;
    this.isfloorNoDropdownOpen = false;
    this.isfloorDropdownOpen = false;
  }

  get bedroomsize(): FormArray {
    return this.submitForm.get('bedroomsize') as FormArray;
  }

  initBedrooms() {
    this.bedroomsize.clear();

    for (let i = 0; i < this.numberOfBeds; i++) {
      this.bedroomsize.push(
        this.fb.group({
          bedroom_length: [''],
          bedroom_width: ['']
        })
      );
    }

    this.showSections = true;
  }

  onChange(event: any) {
    this.selectedPropertyType = this.submitForm.value?.property_type;

    if (this.selectedPropertyType == 1) {
      // total_no_of_flats
      this.submitForm.get('total_no_of_flats')?.setValidators([Validators.required]);
      this.submitForm.get('total_no_of_flats')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // balconies
      this.submitForm.get('balconies')?.setValidators([Validators.required]);
      this.submitForm.get('balconies')?.updateValueAndValidity();

      // flooring
      this.submitForm.get('flooring')?.setValidators([Validators.required]);
      this.submitForm.get('flooring')?.updateValueAndValidity();

      // facing
      this.submitForm.get('facing')?.setValidators([Validators.required]);
      this.submitForm.get('facing')?.updateValueAndValidity();

      // additional_rooms
      this.submitForm.get('additional_rooms')?.setValidators([Validators.required]);
      this.submitForm.get('additional_rooms')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // super_area
      this.submitForm.get('super_area')?.setValidators([Validators.required]);
      this.submitForm.get('super_area')?.updateValueAndValidity();

      // super_area_in
      this.submitForm.get('super_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('super_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 3) {
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 4) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 5) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 8) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 9) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 10) {
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // balconies
      this.submitForm.get('balconies')?.setValidators([Validators.required]);
      this.submitForm.get('balconies')?.updateValueAndValidity();

      // flooring
      this.submitForm.get('flooring')?.setValidators([Validators.required]);
      this.submitForm.get('flooring')?.updateValueAndValidity();

      // facing
      this.submitForm.get('facing')?.setValidators([Validators.required]);
      this.submitForm.get('facing')?.updateValueAndValidity();

      // additional_rooms
      this.submitForm.get('additional_rooms')?.setValidators([Validators.required]);
      this.submitForm.get('additional_rooms')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 11) {
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 12) {
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // balconies
      this.submitForm.get('balconies')?.setValidators([Validators.required]);
      this.submitForm.get('balconies')?.updateValueAndValidity();

      // flooring
      this.submitForm.get('flooring')?.setValidators([Validators.required]);
      this.submitForm.get('flooring')?.updateValueAndValidity();

      // facing
      this.submitForm.get('facing')?.setValidators([Validators.required]);
      this.submitForm.get('facing')?.updateValueAndValidity();

      // additional_rooms
      this.submitForm.get('additional_rooms')?.setValidators([Validators.required]);
      this.submitForm.get('additional_rooms')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 16) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 17) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 18) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 19) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 20) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if (this.selectedPropertyType == 21) {
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    }
  }

  onPropertyFor(event: Event) {
    this.selectedPropertyFor = this.submitForm.value?.property_for;

    if (this.selectedPropertyFor == 'Rent') {
      // rent_amount
      this.submitForm.get('rent_amount')?.setValidators([Validators.required]);
      this.submitForm.get('rent_amount')?.updateValueAndValidity();

      // security_amount
      this.submitForm.get('security_amount')?.setValidators([Validators.required]);
      this.submitForm.get('security_amount')?.updateValueAndValidity();

    } else if (this.selectedPropertyFor == 'Sell') {
      // total_price
      this.submitForm.get('total_price')?.setValidators([Validators.required]);
      this.submitForm.get('total_price')?.updateValueAndValidity();

      // lac_or_cr
      this.submitForm.get('lac_or_cr')?.setValidators([Validators.required]);
      this.submitForm.get('lac_or_cr')?.updateValueAndValidity();

      // booking_or_token_ammount
      this.submitForm.get('booking_or_token_ammount')?.setValidators([Validators.required]);
      this.submitForm.get('booking_or_token_ammount')?.updateValueAndValidity();

      // thousand_lac_or_cr
      this.submitForm.get('thousand_lac_or_cr')?.setValidators([Validators.required]);
      this.submitForm.get('thousand_lac_or_cr')?.updateValueAndValidity();
    }

    this.cleanupHiddenControlValidators();
  }

  showpossessionstatus() {
    this.selectedPossessionStatus = this.submitForm.value?.possession_status;
    console.log(this.selectedPossessionStatus);

    if (this.selectedPossessionStatus == 'Under Construction') {
      this.submitForm.get('avbldate')?.setValidators([Validators.required]);
      this.submitForm.get('avbldate')?.updateValueAndValidity();

      this.submitForm.get('available_from_month')?.setValidators([Validators.required]);
      this.submitForm.get('available_from_month')?.updateValueAndValidity();

      this.submitForm.get('available_from_year')?.setValidators([Validators.required]);
      this.submitForm.get('available_from_year')?.updateValueAndValidity();
    }

    this.cleanupHiddenControlValidators();
  }

  cleanupHiddenControlValidators(): void {
    const pFor = String(this.submitForm.value?.property_for || '');
    const pType = String(this.submitForm.value?.property_type || '');
    const pStatus = String(this.submitForm.value?.possession_status || '');
    const avblDateOpt = String(this.submitForm.value?.avbldate || '');

    // 1. possession_status: Only visible when ['1', '3', '4', '8', '10', '11', '12', '16', '18', '19', '20'].includes(pType)
    if (!['1', '3', '4', '8', '10', '11', '12', '16', '18', '19', '20'].includes(pType)) {
      this.submitForm.get('possession_status')?.clearValidators();
      this.submitForm.get('possession_status')?.setValue(null);
      this.submitForm.get('possession_status')?.updateValueAndValidity();
    }

    // 2. lift, total_units, total_towers, water_availability, status_of_electricity, floor_no, total_floor, furnishing_status
    if (!['1', '3', '4', '8', '10', '11', '12', '16', '18', '19', '20'].includes(pType)) {
      ['lift', 'total_units', 'total_towers', 'water_availability', 'status_of_electricity', 'floor_no', 'total_floor', 'furnishing_status'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue('');
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 3. bedroom, bathroom: Only visible when ['1', '3', '4', '10', '11', '12'].includes(pType)
    if (!['1', '3', '4', '10', '11', '12'].includes(pType)) {
      ['bedroom', 'bathroom'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue('');
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 4. balconies: Only visible when ['1', '10', '12'].includes(pType)
    if (!['1', '10', '12'].includes(pType)) {
      this.submitForm.get('balconies')?.clearValidators();
      this.submitForm.get('balconies')?.setValue('');
      this.submitForm.get('balconies')?.updateValueAndValidity();
    }

    // 5. no_of_open_sides: Only visible when ['3', '4', '5', '9', '17', '21'].includes(pType)
    if (!['3', '4', '5', '9', '17', '21'].includes(pType)) {
      this.submitForm.get('no_of_open_sides')?.clearValidators();
      this.submitForm.get('no_of_open_sides')?.setValue('');
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();
    }

    // 6. width_of_road_facing_the_plot: Only visible when ['4', '5', '8', '9', '16', '17', '18', '19', '20', '21'].includes(pType)
    if (!['4', '5', '8', '9', '16', '17', '18', '19', '20', '21'].includes(pType)) {
      this.submitForm.get('width_of_road_facing_the_plot')?.clearValidators();
      this.submitForm.get('width_of_road_facing_the_plot')?.setValue(null);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();
    }

    // 7. Commercial washroom/pantry fields: washroom, personal_washroom, pantry_cafeteria
    if (!['8', '16', '18', '19', '20'].includes(pType)) {
      ['washroom', 'personal_washroom', 'pantry_cafeteria'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue('');
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 8. avbldate: Only visible when possession_status === 'Under Construction'
    if (pStatus === 'Under Construction') {
      this.submitForm.get('avbldate')?.setValidators([Validators.required]);
      this.submitForm.get('avbldate')?.updateValueAndValidity();
    } else {
      this.submitForm.get('avbldate')?.clearValidators();
      this.submitForm.get('avbldate')?.setValue(null);
      this.submitForm.get('avbldate')?.updateValueAndValidity();
    }

    // 9. available_from: Only visible & required when possession_status === 'Under Construction' AND avbldate === 'SelectDate'
    if (pStatus === 'Under Construction' && avblDateOpt === 'SelectDate') {
      this.submitForm.get('available_from')?.setValidators([Validators.required]);
      this.submitForm.get('available_from')?.updateValueAndValidity();
    } else {
      this.submitForm.get('available_from')?.clearValidators();
      this.submitForm.get('available_from')?.setValue(null);
      this.submitForm.get('available_from')?.updateValueAndValidity();
    }

    // 10. available_from_month & available_from_year: Only visible when (property_for === 'Sell' || possession_status === 'Under Construction')
    if (pFor === 'Sell' || pStatus === 'Under Construction') {
      this.submitForm.get('available_from_month')?.setValidators([Validators.required]);
      this.submitForm.get('available_from_month')?.updateValueAndValidity();

      this.submitForm.get('available_from_year')?.setValidators([Validators.required]);
      this.submitForm.get('available_from_year')?.updateValueAndValidity();
    } else {
      this.submitForm.get('available_from_month')?.clearValidators();
      this.submitForm.get('available_from_month')?.setValue(null);
      this.submitForm.get('available_from_month')?.updateValueAndValidity();

      this.submitForm.get('available_from_year')?.clearValidators();
      this.submitForm.get('available_from_year')?.setValue(null);
      this.submitForm.get('available_from_year')?.updateValueAndValidity();
    }

    // 11. Rent vs Sell fields
    if (pFor === 'Rent') {
      ['total_price', 'lac_or_cr', 'booking_or_token_ammount', 'thousand_lac_or_cr'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue(null);
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    } else if (pFor === 'Sell') {
      ['rent_amount', 'security_amount'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue(null);
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 12. Plot fields: floors_allowed_for_construction, boundary_wall_made, any_construction_done, is_in_gated_colony
    if (!['5', '9', '17', '21'].includes(pType)) {
      ['floors_allowed_for_construction', 'boundary_wall_made', 'any_construction_done', 'is_in_gated_colony'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue('');
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 13. Plot Area & Length/Width: Only visible when ['3', '4', '5', '9', '12', '17', '21'].includes(pType)
    if (!['3', '4', '5', '9', '12', '17', '21'].includes(pType)) {
      ['ploat_area', 'ploat_area_in', 'plot_length', 'plot_width'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue(null);
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 14. Carpet Area: Only visible when ['1', '3', '4', '8', '10', '11', '12', '18', '19'].includes(pType)
    if (!['1', '3', '4', '8', '10', '11', '12', '18', '19'].includes(pType)) {
      ['carpet_area', 'carpet_area_in'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue(null);
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 15. Covered Area: Only visible when ['3', '4', '8', '10', '11', '12', '16', '18', '19', '20'].includes(pType)
    if (!['3', '4', '8', '10', '11', '12', '16', '18', '19', '20'].includes(pType)) {
      ['covered_area', 'covered_area_in'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue(null);
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 16. Built-up Area & Super Area: Only visible when ['1', '3', '4', '8', '9', '10', '11', '12', '16', '17', '18', '19', '20', '21'].includes(pType)
    if (!['1', '3', '4', '8', '9', '10', '11', '12', '16', '17', '18', '19', '20', '21'].includes(pType)) {
      ['built_up_area', 'built_up_area_in', 'super_area', 'super_area_in'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue(null);
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }

    // 17. Apartment/Flat specific fields: total_no_of_flats
    if (pType !== '1') {
      ['total_no_of_flats'].forEach(field => {
        this.submitForm.get(field)?.clearValidators();
        this.submitForm.get(field)?.setValue('');
        this.submitForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  ageofconstruction() {
    this.selectedAgeOfConstruction = this.submitForm.value?.age_of_construction;
  }

  currentbusinesssector() {
    this.selectedCurrentBusinessSector = this.submitForm.value?.current_business_sector;
  }

  ontransactiontype() {
    this.selectedTransactionType = this.submitForm.value?.transaction_type;
  }

  onAssuredReturns() {
    this.selectedAssuredReturns = this.submitForm.value?.assured_returns;
  }

  ngOnInit() {
    this.seoService.setCanonicalURL(
      window.location.href
    );
    this.fetchPropertyType();
    this.fetchLandZone();
    this.fetchBusinesssector();
    this.fetchCities();
    this.flooroptions = this.flooroptions.concat(
      Array.from({ length: 185 }, (_, i) => (i + 16).toString())
    );
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 10;
    this.availableYears = Array.from({ length: endYear - currentYear + 1 }, (_, i) => currentYear + i);
    const startYear = 1910;
    this.businessYears = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
  }

  fetchPropertyType() {
    const propertyName = '';
    this.PostpropertyfreeService.getpostPropertyFree().subscribe(
      (res: any) => {
        this.propertyType = res.data;
      },
      (error: any) => {
        console.error('Error fetching post free:', error);
      }
    );
  }
  furnishData = false;

  selectFurnishType(type: string) {
    this.selectedFurnishType = type;
    this.submitForm.patchValue({ furnishing_status: this.selectedFurnishType });
    if (type === 'Furnished' || type === 'Semi-Furnished') {
      this.furnishData = true;
    } else {
      this.furnishData = false;
    }
  }
  selectFlatSociety(societyRange: string): void {
    this.selectedFlatSociety = societyRange;
    this.submitForm.patchValue({ total_no_of_flats: this.selectedFlatSociety });
  }

  onSelectionChange(): void {
    this.selectedAvailabaleDate = this.submitForm.value?.avbldate;
    this.cleanupHiddenControlValidators();
  }

  onLeased() {
    this.isLeased = this.submitForm.value?.currently_leased_out;
  }

  totalandcompletePrice() {
    this.totalcompletePrice = this.submitForm.value?.cmpltprice;
  }

  toggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    const currentState = this.isDropdownOpen;
    this.closeAllDropdowns();
    this.isDropdownOpen = !currentState;
  }
  balconiesDropdown(event?: Event) {
    if (event) event.stopPropagation();
    const currentState = this.isbalconiDropdownOpen;
    this.closeAllDropdowns();
    this.isbalconiDropdownOpen = !currentState;
  }
  floortoggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    const currentState = this.isfloorDropdownOpen;
    this.closeAllDropdowns();
    this.isfloorDropdownOpen = !currentState;
  }
  floorNotoggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    const currentState = this.isfloorNoDropdownOpen;
    this.closeAllDropdowns();
    this.isfloorNoDropdownOpen = !currentState;
  }
  bathRoomDropdown(event?: Event) {
    if (event) event.stopPropagation();
    const currentState = this.isbathRoomDropdownOpen;
    this.closeAllDropdowns();
    this.isbathRoomDropdownOpen = !currentState;
  }

  selectOption(option: string) {
    this.selectedValue = option;
    this.submitForm.patchValue({ bedroom: this.selectedValue });
    this.closeAllDropdowns();
    this.showSection = true;
    this.selectedOption = option;
    this.selectedBedRoom = null;

    const num = parseInt(option, 10);
    this.numberOfBed = Array(num)
      .fill(0)
      .map((_, index) => index + 1);
  }

  selectBathRooms(num: any, name: any) {
    this.selectedBathRoom = num;
    this.submitForm.patchValue({ bathroom: this.selectedBathRoom });
    this.selectedBathRoomOption = null;
    this.showBathRoomSection = true;
    this.selectBathRoomsValue = '3+';
    this.closeAllDropdowns();
  }

  selectFloor(num: any, name: any) {
    this.selectedFloor = num;
    this.selectedFloorOption = null;
    this.showFloorSection = true;
    this.floorNoselectedValue = '5+';
    this.submitForm.patchValue({ floor_no: this.selectedFloor });
    this.closeAllDropdowns();
  }

  selectFloorOption(floorNoOptions: any) {
    this.floorNoselectedValue = floorNoOptions;
    this.submitForm.patchValue({ floor_no: this.floorNoselectedValue });
    this.selectedFloorOption = floorNoOptions;
    this.selectedFloor = null;
    this.showFloorSection = true;
    this.closeAllDropdowns();
  }

  selectTotalFloorDropdownOption(foption: string) {
    this.totalFloorselectedValue = foption;
    this.submitForm.patchValue({ total_floor: this.totalFloorselectedValue });
    this.selectedTotalFloorOption = foption;
    this.selectedTotalFloor = null;
    this.closeAllDropdowns();
  }
  selectTotalFloor(num: number) {
    this.selectedTotalFloor = num;
    this.submitForm.patchValue({ total_floor: this.selectedTotalFloor });
    this.selectedTotalFloorOption = null;
    // this.totalFloorselectedValue = num.toString();
    this.totalFloorselectedValue = '15+';
    this.closeAllDropdowns();
  }
  selectBathRoomOption(bathRoomoptions: string) {
    this.selectBathRoomsValue = bathRoomoptions;
    this.submitForm.patchValue({ bathroom: this.selectBathRoomsValue });
    this.selectedBathRoomOption = bathRoomoptions;
    this.selectedBathRoom = null;
    this.showBathRoomSection = true;
    this.closeAllDropdowns();
  }
  selectBalconies(num: any, name: any) {
    this.selectedBalcony = num;
    this.submitForm.patchValue({ balconies: this.selectedBalcony });
    this.selectedBalconiesOption = null;
    this.showBalconySection = true;
    this.selectedBalconiesValue = '3+';
    this.closeAllDropdowns();
  }
  selectBedRoom(num: any, name: any) {
    this.numberOfBeds = num;
    this.initBedrooms();
    this.selectedBedRoom = num;
    this.submitForm.patchValue({ bedroom: this.selectedBedRoom });
    this.numberOfBed = Array(num)
      .fill(0)
      .map((_, index) => index + 1);
    this.selectedOption = null;
    this.selectPreValue = num.toString();
    this.showSection = true;
    this.selectedValue = '5+';
    this.closeAllDropdowns();
  }
  selectBalconiesOption(baconiesoptions: string) {
    this.selectedBalconiesValue = baconiesoptions;
    this.submitForm.patchValue({ balconies: this.selectedBalconiesValue });
    this.selectedBalconiesOption = baconiesoptions;
    this.selectedBalcony = null;
    this.closeAllDropdowns();
  }

  fetchLandZone() {
    this.PostpropertyfreeService.getLandZone().subscribe((res: any) => {
      this.landZone = res.data;
    });
  }
  fetchBusinesssector() {
    this.PostpropertyfreeService.getBusinesssector().subscribe((res: any) => {
      this.BusinessSector = res.data;
    });
  }
  fetchCities() {
    this.PostpropertyfreeService.getCities().subscribe((res: any) => {
      this.cities = res.data;
    });
  }
  onCityChange(event: any) {
    const selectedCity: any = event.target.value;
    this.fetchLocalities(selectedCity);
  }
  fetchLocalities(city: any) {
    this.PostpropertyfreeService.getLocalities(city).subscribe((res: any) => {
      this.localities = res.responseData.data;
    });
  }
  onLocalityChange(event: any) {
    const selectedLocality: any = event.target.value;
    this.fetchProjectList(selectedLocality);
  }
  onPropertyChange(event: any) {
    const selectedLocality: any = event.target.value;

  }
  fetchProjectList(locality: any) {
    this.PostpropertyfreeService.getProjectList(locality).subscribe((res: any) => {
      this.projectList = res.responseData.addproject;
    });
  }

  dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  @ViewChild('authChoiceModal') authChoiceModalElement!: ElementRef;

  openAuthChoiceModal() {
    const draft: any = { ...this.submitForm.value };

    if (this.mainImagePreview && this.mainImageFile) {
      draft['savedMainImagePreview'] = this.mainImagePreview;
      draft['savedMainImageName'] = this.mainImageFile.name;
    }

    if (this.galleryImagePreviews && this.galleryImagePreviews.length > 0) {
      draft['savedGalleryImages'] = this.galleryImagePreviews.map(img => ({
        url: img.url,
        name: img.name
      }));
    }

    localStorage.setItem('postPropertyFormDraft', JSON.stringify(draft));
    localStorage.setItem('redirectAfterAuth', '/post-property-free');

    if (typeof bootstrap !== 'undefined' && this.authChoiceModalElement) {
      const modal = new bootstrap.Modal(this.authChoiceModalElement.nativeElement);
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#authChoiceModal').modal('show');
    }
  }

  restoreDraftData() {
    const draftDataJson = localStorage.getItem('postPropertyFormDraft');
    if (!draftDataJson) return;

    try {
      const draftData = JSON.parse(draftDataJson);
      this.submitForm.patchValue(draftData);

      if (draftData.property_for) {
        this.onPropertyFor(draftData.property_for);
      }
      if (draftData.property_type) {
        this.selectedPropertyType = draftData.property_type;
        this.onChange({ target: { value: draftData.property_type } });
      }
      if (draftData.bedroom) {
        const bedNum = Number(draftData.bedroom);
        if (!isNaN(bedNum) && bedNum > 0) {
          this.numberOfBeds = bedNum;
          this.initBedrooms();
          this.selectBedRoom(bedNum, '');
          if (draftData.bedroomsize && Array.isArray(draftData.bedroomsize)) {
            this.bedroomsize.patchValue(draftData.bedroomsize);
          }
        } else if (draftData.bedroom) {
          this.selectOption(String(draftData.bedroom));
        }
      } else if (draftData.bedroomsize && Array.isArray(draftData.bedroomsize) && draftData.bedroomsize.length > 0) {
        this.numberOfBeds = draftData.bedroomsize.length;
        this.initBedrooms();
        this.bedroomsize.patchValue(draftData.bedroomsize);
      }

      if (draftData.bathroom) {
        const bathNum = Number(draftData.bathroom);
        if (!isNaN(bathNum) && bathNum > 0) {
          this.selectBathRooms(bathNum, '');
        } else if (draftData.bathroom) {
          this.selectBathRoomOption(String(draftData.bathroom));
        }
      }
      if (draftData.balconies) {
        const balcNum = Number(draftData.balconies);
        if (!isNaN(balcNum) && balcNum > 0) {
          this.selectBalconies(balcNum, '');
        } else if (draftData.balconies) {
          this.selectBalconiesOption(String(draftData.balconies));
        }
      }
      if (draftData.floor_no) {
        const directFloorPills = ['Lower Basement', 'Upper Basement', 'Ground', 1, 2, 3, 4, '1', '2', '3', '4'];
        if (directFloorPills.includes(draftData.floor_no)) {
          this.selectFloor(draftData.floor_no, 'floor');
        } else {
          this.selectFloorOption(String(draftData.floor_no));
        }
      }
      if (draftData.total_floor) {
        const tfNum = Number(draftData.total_floor);
        if (!isNaN(tfNum) && tfNum > 0) {
          this.selectTotalFloor(tfNum);
        } else if (draftData.total_floor) {
          this.selectTotalFloorDropdownOption(String(draftData.total_floor));
        }
      }
      if (draftData.furnishing_status) {
        this.selectFurnishType(draftData.furnishing_status);
      }
      if (draftData.total_no_of_flats) {
        this.selectFlatSociety(draftData.total_no_of_flats);
      }
      if (draftData.age_of_construction) {
        this.ageofconstruction();
      }
      if (draftData.current_business_sector) {
        this.currentbusinesssector();
      }
      if (draftData.transaction_type) {
        this.ontransactiontype();
      }
      if (draftData.assured_returns) {
        this.onAssuredReturns();
      }
      if (draftData.currently_leased_out) {
        this.onLeased();
      }

      // Restore main image
      if (draftData.savedMainImagePreview) {
        this.mainImagePreview = draftData.savedMainImagePreview;
        this.mainImageFile = this.dataURLtoFile(
          draftData.savedMainImagePreview,
          draftData.savedMainImageName || 'main_image.jpg'
        );
        this.submitForm.patchValue({ property_main_img: this.mainImageFile.name });
      }

      // Restore gallery images
      if (draftData.savedGalleryImages && Array.isArray(draftData.savedGalleryImages)) {
        this.galleryImagePreviews = [];
        this.propertyImageFiles = [];
        const filenames: string[] = [];
        draftData.savedGalleryImages.forEach((img: any, idx: number) => {
          if (img.url) {
            const file = this.dataURLtoFile(img.url, img.name || `gallery_${idx}.jpg`);
            this.propertyImageFiles.push(file);
            this.galleryImagePreviews.push({
              id: Date.now() + Math.random() + idx,
              url: img.url,
              file: file,
              name: file.name
            });
            filenames.push(file.name);
          }
        });
        if (filenames.length > 0) {
          this.submitForm.patchValue({ property_img: filenames as any });
        }
      }

      // Restore City -> Locality -> Project dropdowns
      if (draftData.property_city) {
        this.submitForm.patchValue({ property_city: draftData.property_city });
        this.PostpropertyfreeService.getLocalities(draftData.property_city).subscribe((res: any) => {
          this.localities = res.responseData.data;
          if (draftData.property_locality) {
            this.submitForm.patchValue({ property_locality: draftData.property_locality });
            this.PostpropertyfreeService.getProjectList(draftData.property_locality).subscribe((pRes: any) => {
              this.projectList = pRes.responseData.addproject;
              if (draftData.project_id) {
                this.submitForm.patchValue({ project_id: draftData.project_id });
              }
            });
          }
        });
      }
    } catch (e) {
      console.error('Error parsing property draft:', e);
    }
  }

  closeAuthChoiceModal() {
    if (typeof bootstrap !== 'undefined' && this.authChoiceModalElement) {
      const modalInstance = bootstrap.Modal.getInstance(this.authChoiceModalElement.nativeElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } else if (typeof $ !== 'undefined') {
      $('#authChoiceModal').modal('hide');
    }
  }

  goToLogin() {
    this.closeAuthChoiceModal();
    this.route.navigate(['/login']);
  }

  goToRegister() {
    this.closeAuthChoiceModal();
    this.route.navigate(['/registration']);
  }

  propertyForm() {
    this.cleanupHiddenControlValidators();

    console.log(this.submitForm.invalid);
    console.log(this.submitForm.value);

    if (this.submitForm.invalid) {
      this.submitForm.markAllAsTouched();

      Object.keys(this.submitForm.controls).forEach(key => {
        const control = this.submitForm.get(key);
        if (control && control.invalid) {
          console.log(`Invalid field: ${key}`, control.errors);
        }
      });
      this.toastr.error('Please fill all required fields.');
      return;
    }

    if (!this.isUserLoggedIn) {
      this.openAuthChoiceModal();
      return;
    }

    const userId = localStorage.getItem('userId');
    this.submitForm.patchValue({ user_id: userId });

    const formData = new FormData();
    let payload = { ...this.submitForm.value };
    const pFor = String(payload.property_for || '');
    const pType = String(payload.property_type || '');
    const pStatus = String(payload.possession_status || '');
    const avblDateOpt = String(payload.avbldate || '');

    if (pStatus !== 'Under Construction') {
      delete payload.avbldate;
    }
    if (pStatus !== 'Under Construction' || avblDateOpt !== 'SelectDate') {
      delete payload.available_from;
    }
    if (pFor !== 'Sell' && pStatus !== 'Under Construction') {
      delete payload.available_from_month;
      delete payload.available_from_year;
    }
    if (pFor === 'Rent') {
      delete payload.total_price;
      delete payload.lac_or_cr;
      delete payload.booking_or_token_ammount;
      delete payload.thousand_lac_or_cr;
    } else if (pFor === 'Sell') {
      delete payload.rent_amount;
      delete payload.security_amount;
    }
    if (!['5', '9', '17', '21'].includes(pType)) {
      delete payload.floors_allowed_for_construction;
      delete payload.boundary_wall_made;
      delete payload.any_construction_done;
      delete payload.is_in_gated_colony;
    }
    if (!['3', '4', '5', '9', '12', '17', '21'].includes(pType)) {
      delete payload.ploat_area;
      delete payload.ploat_area_in;
      delete payload.plot_length;
      delete payload.plot_width;
    }
    if (!['1', '3', '4', '8', '10', '11', '12', '18', '19'].includes(pType)) {
      delete payload.carpet_area;
      delete payload.carpet_area_in;
    }
    if (!['3', '4', '8', '10', '11', '12', '16', '18', '19', '20'].includes(pType)) {
      delete payload.covered_area;
      delete payload.covered_area_in;
    }
    if (!['1', '3', '4', '8', '9', '10', '11', '12', '16', '17', '18', '19', '20', '21'].includes(pType)) {
      delete payload.built_up_area;
      delete payload.built_up_area_in;
      delete payload.super_area;
      delete payload.super_area_in;
    }


    Object.keys(this.submitForm.value).forEach((key: string) => {

      // IMPORTANT:
      // Don't send these two as normal text fields.
      // We will send the actual File objects below.
      if (
        key === 'property_main_img' ||
        key === 'property_img'
      ) {
        return;
      }

      const value = (this.submitForm.value as any)[key];

      if (value !== null && value !== undefined) {

        if (Array.isArray(value)) {

          value.forEach((item: any) => {
            formData.append(key + '[]', item);
          });

        } else {

          formData.append(key, value.toString());

        }
      }
    });


    /*
    |--------------------------------------------------------------------------
    | MAIN PROPERTY IMAGE
    |--------------------------------------------------------------------------
    */

    if (this.mainImageFile) {

      formData.append(
        'property_main_img',
        this.mainImageFile,
        this.mainImageFile.name
      );

    }


    /*
    |--------------------------------------------------------------------------
    | PROPERTY MULTIPLE IMAGES
    |--------------------------------------------------------------------------
    */

    if (this.propertyImageFiles.length > 0) {

      this.propertyImageFiles.forEach((file: File) => {

        formData.append(
          'property_img[]',
          file,
          file.name
        );

      });

    }


    /*
    |--------------------------------------------------------------------------
    | DEBUG - REMOVE AFTER TESTING
    |--------------------------------------------------------------------------
    */

    console.log('========== FORM DATA ==========');

    formData.forEach((value: any, key: string) => {

      if (value instanceof File) {

        console.log(
          key,
          'FILE:',
          value.name,
          value.type,
          value.size
        );

      } else {

        console.log(key, value);

      }

    });



    this.http.post(`${environment.apiUrl}addproperty`, formData).subscribe(
      (res: any) => {
        this.toastr.success('Your Property Post successfully.');
        console.log('Property saved:', res);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      (error) => {
        console.error('Error sending data', error);
        this.toastr.error('Failed to post property. Please try again.');
      }
    );
  }

  validateNameInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }

  validateEmailInput(event: KeyboardEvent) {
    const invalidChars = [' ', ',', ';', '"', `'`, '`'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  // Image CRUD logic
  // mainImagePreview holds base64 for display only; form stores filename only.
  mainImagePreview: string | null = null;
  mainImageFile: File | null = null;
  propertyImageFiles: File[] = [];
  galleryImagePreviews: { id: number; url: string; file: File; name: string }[] = [];


  onMainImageChange(event: any): void {

    const file = event.target.files && event.target.files[0];

    if (!file) {

      return;

    }

    if (!file.type.startsWith('image/')) {

      alert('Please select a valid image file.');

      return;

    }

    // Store the ACTUAL file

    this.mainImageFile = file;

    // This is only for displaying filename/form value

    this.submitForm.patchValue({

      property_main_img: file.name

    });

    // Preview only

    const reader = new FileReader();

    reader.onload = (e: any) => {

      this.mainImagePreview = e.target.result;

    };

    reader.readAsDataURL(file);

  }


  removeMainImage(): void {
    this.mainImagePreview = null;
    this.mainImageFile = null;
    this.submitForm.patchValue({ property_main_img: null as any });
    const fileInput = document.getElementById('mainFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onGalleryImagesChange(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        // Read DataURL for preview display only
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.galleryImagePreviews.push({
            id: Date.now() + Math.random(),
            url: e.target.result,  // base64 used only for <img> preview
            file: file,
            name: file.name
          });
          // Store only filenames in the form (not base64)
          const filenames = this.galleryImagePreviews.map(img => img.name);
          this.submitForm.patchValue({ property_img: filenames as any });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeGalleryImage(index: number): void {
    if (index >= 0 && index < this.galleryImagePreviews.length) {
      this.galleryImagePreviews.splice(index, 1);
      const filenames = this.galleryImagePreviews.map(img => img.name);
      this.submitForm.patchValue({ property_img: filenames.length > 0 ? (filenames as any) : null });
    }
  }

  // Drag & Drop flags and handlers
  isMainDragOver: boolean = false;
  isGalleryDragOver: boolean = false;

  onMainDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isMainDragOver = true;
  }

  onMainDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isMainDragOver = false;
  }


  onMainImageDrop(event: DragEvent): void {

    event.preventDefault();

    event.stopPropagation();

    this.isMainDragOver = false;

    if (

      event.dataTransfer &&

      event.dataTransfer.files &&

      event.dataTransfer.files.length > 0

    ) {

      const file = event.dataTransfer.files[0];

      if (!file.type.startsWith('image/')) {

        alert('Please drop a valid image file.');

        return;

      }

      // Store actual File

      this.mainImageFile = file;

      // Filename only for form/display

      this.submitForm.patchValue({

        property_main_img: file.name

      });

      // Preview

      const reader = new FileReader();

      reader.onload = (e: any) => {

        this.mainImagePreview = e.target.result;

      };

      reader.readAsDataURL(file);

    }

  }

  onPropertyImagesChange(event: any): void {

    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Store actual File for FormData upload
      this.propertyImageFiles.push(file);

      // Generate base64 preview for the UI thumbnail grid
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Push into galleryImagePreviews — this is what the HTML template uses
        this.galleryImagePreviews.push({
          id: Date.now() + Math.random(),
          url: e.target.result,   // base64 for <img src> preview only
          file: file,
          name: file.name
        });
        // Update form value with filenames (not base64)
        const filenames = this.galleryImagePreviews.map(img => img.name);
        this.submitForm.patchValue({ property_img: filenames as any });
      };
      reader.readAsDataURL(file);

    }

  }


  onGalleryDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isGalleryDragOver = true;
  }

  onGalleryDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isGalleryDragOver = false;
  }

  onGalleryImagesDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isGalleryDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const files: FileList = event.dataTransfer.files;
      Array.from(files).forEach((file: File) => {
        if (file.type.startsWith('image/')) {
          // Read DataURL for preview display only
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.galleryImagePreviews.push({
              id: Date.now() + Math.random(),
              url: e.target.result,  // base64 used only for <img> preview
              file: file,
              name: file.name
            });
            // Store only filenames in the form (not base64)
            const filenames = this.galleryImagePreviews.map(img => img.name);
            this.submitForm.patchValue({ property_img: filenames as any });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

}
