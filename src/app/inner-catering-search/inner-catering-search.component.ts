
import { Component, OnInit, ElementRef } from '@angular/core';
import {ResturantService } from '../../Services/resturant.service'
import { Router } from '@angular/router';
import {menu} from '../Models/menu';
import { menuItem} from '../Models/menu-item';
import { __values } from 'tslib';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { CartService } from '../../Services/cart.service'
import { GlobalService } from '../../Services/global.service'
import { ToastrService } from 'ngx-toastr'
import { min } from 'rxjs/operators';
@Component({
  selector: 'app-inner-catering-search',
  templateUrl: './inner-catering-search.component.html',
  styleUrls: ['./inner-catering-search.component.css']
})
export class InnerCateringSearchComponent implements OnInit {
  slideeConfig = {
    "slidesToShow": 1,
    "autoplay": true,
    "autoplaySpeed": 2000,
    "arrows": false,
    "dots": true,
    "focusOnSelect": false,
    "speed": 1000
  };
  max :any;
  dropdown:any[];
  ResturantObj:any;
  AverageRating:String;
  resturantReviews:any;
  customerMap:any[];
  latitude: number;
  longitude: number;
   address:string;
  zoom:number=0;
  popupItem:any;
  private geoCoder;
  menuToDisplay:any[];
  bufferToDisplay:any[];
  location:boolean= false;
  constructor(private toastr:ToastrService,private eleRef: ElementRef,private global:GlobalService,private resturantService:ResturantService,private router:Router,private mapsAPILoader: MapsAPILoader,private cart:CartService) { 

  }

  ngOnInit() {
    this.global.header = 3;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
    })
    this.ResturantObj = new Object();
    this.resturantReviews =  new Object();
    console.log(this.resturantService.Resturantid,"I am in inner catering seach");
    this.resturantService.Resturantid = "5d45df39969ec012515bbc85";
    if(this.resturantService.Resturantid == undefined || this.resturantService.Resturantid == null || this.resturantService.Resturantid == ""){
      this.router.navigate(['/listing']);
    }else{
      this.getResturantDetails();
      this.getResturantRating();
      this.getResturantReviews();
      // this.getActiveItem();
     this.getActiveCombos();
      // this.resturantService.offerList(this.resturantService.Resturantid).subscribe((data:any)=>{console.log(data,"offerlist")},(error)=>{console.log(error)})
     
      // this.resturantService.menuList(this.resturantService.Resturantid).subscribe((data:any)=>{console.log(data,"menulist")},(error)=>{console.log(error)})
      // this.resturantService.activeMealPackages(this.resturantService.Resturantid).subscribe((data:any)=>{console.log(data,"active mealpackages")},(error)=>{console.log(error)})
      
    }
  }
  switchToAbout(){
    this.location = false;
  }
  switchToLocation(){
    this.location = true;
  }
  ResturantPopups(items){
   this.dropdown = new Array<Number>();
   for(let i = items.min ; i <= (this.max-this.cart.cartCount);i++){
     this.dropdown.push(i);
   }
    console.log(this.dropdown);
    console.log(items,"updated");
    this.popupItem = items;
  }
  getActiveCombos(){
    this.resturantService.activeCombos(this.resturantService.Resturantid).subscribe((data:any)=>{
      this.bufferToDisplay = [{
        name:"Mealone",
        kitchenid:"5d45df39969ec012515bbc85",
        description:"this is a test data",
        finalcomboprice:"380",
        totalprice:"400",
        image:"file-1564860776723.jpg",
        status:"true",
        discount:"20",
        min:"10",
        max:"70",
        menuId:[{
        cuisine:[],
        image:"file-1564860776723.jpg",
        kitchenId:"5d45df39969ec012515bbc85",
        name:"Biryani"
        },{
        cuisine:[],
        image:"file-1564860776723.jpg",
        kitchenId:"5d45df39969ec012515bbc85",
        name:"Haleem"
        }]},{
          name:"Mealtwo",
          kitchenid:"5d45df39969ec012515bbc85",
          description:"this is a test data",
          finalcomboprice:"450",
          totalprice:"500",
          image:"file-1564860776723.jpg",
          status:"true",
          discount:"50",
          min:"20",
          max:"70",
          menuId:[{
          cuisine:[],
          image:"file-1564860776723.jpg",
          kitchenId:"5d45df39969ec012515bbc85",
          name:"Burger"
          },{
          cuisine:[],
          image:"file-1564860776723.jpg",
          kitchenId:"5d45df39969ec012515bbc85",
          name:"Broast"
          }]
      }];
      this.max = this.bufferToDisplay[0].max;
      console.log(this.bufferToDisplay);

     },(error)=>{
       console.log(error)
     })
         
  }
  getResturantDetails (){
       this.resturantService.resturantsDetails(this.resturantService.Resturantid).subscribe((data:any)=>{
   
         if(!data.error){
         this.ResturantObj=data.message;
        console.log(this.ResturantObj);
         this.zoom=2;
         this.latitude = this.ResturantObj.lat;
         this.longitude = this.ResturantObj.lng;
   
   
       }else{
         console.log("error");
       }
       },(error)=>{
         console.log(error)
       })
  }
  CartCombo(popupItem){
    if(this.cart.currentResturant == undefined||this.cart.currentResturant == null){
      this.cart.currentResturant = popupItem.kitchenId;
    }
    if(!this.cart.currentResturant == popupItem.kitchenId){
      this.toastr.error("Item Have to remove first");
    return;
    }
    let qty = this.eleRef.nativeElement.querySelector('#total-serving').value;
    console.log(qty,"quantittyyy");
   this.eleRef.nativeElement.querySelector('#closePopup').click();
    this.cart.addBufferItem(popupItem,qty);
   this.cart.cartCount =this.cart.cartCount+Number(qty);
   console.log(this.cart.cartCount,"Carttt counttttttttt");
    console.log((this.max-this.cart.cartCount));
 

  }
  getResturantRating(){
         this.resturantService.resturantRating(this.resturantService.Resturantid).subscribe((data:any)=>{
    
           this.AverageRating = data.message.pack[0].average;
         },(error)=>{
           console.log(error)
         })
  }
  getResturantReviews(){
       this.resturantService.resturantReviews(this.resturantService.Resturantid).subscribe((data:any)=>{
         this.resturantReviews = data.message;
       
         let customerids = new Array<string>();
         for(let i = 0; i < this.resturantReviews.review.length;i++){
           let id = this.resturantReviews.review[i].customerId;
   
           if(!customerids.includes(this.resturantReviews.review[i].customerId)){
             customerids.push(this.resturantReviews.review[i].customerId);
           }
         }
         this.getReviewCustomerName(customerids);
         
       },(error)=>{
         console.log(error)
       })
  }
  getReviewCustomerName(id){
       var idsobj= {ids:id}
       this.resturantService.customerById(idsobj).subscribe((data:any)=>{
          this.customerMap = data.message;
          let reviewList = this.resturantReviews.review;
          let map=[];
          for(let i = 0; i<this.customerMap.length;i++){
            map[this.customerMap[i]._id] = this.customerMap[i].firstname + " " + this.customerMap[i].lastname;
            console.log(map[this.customerMap[i]._id]);
          }
          for(let i = 0;i < reviewList.length;i++){
      
            if(map[reviewList[i].customerId] ===undefined){
              this.resturantReviews.review[i].name = "Anonymous";
            }else{
             this.resturantReviews.review[i].name = map[reviewList[i].customerId];
            }
          }
         },(error)=>{
           console.log(error);
         })
  }
  AddtoCart(item,name){
       this.cart.PlusItem(item,name);
       this.cart.CartUpdate(this.cart.itemsOrder);
  }
  ExitPopup(){
    this.eleRef.nativeElement.querySelector('#closePopup').click();
  }
  getActiveItem(){
      
       this.resturantService.activeItem(this.resturantService.Resturantid).subscribe((data:any)=>{
       let itemsInResturant = data.message;
       console.log(data.message,"Active Item Object");
   
       let menus = [];
       let items = [];
       for(let i = 0; i < itemsInResturant.length;i++){
         if(menus[itemsInResturant[i].menuId._id] === undefined){
           let menuObj = new menu();
           menuObj.kitchenID = itemsInResturant[i].menuId.kitchenId;
           menuObj.menuID = itemsInResturant[i].menuId._id;
           menuObj.menuImage = itemsInResturant[i].menuId.image;
           menuObj.menuName = itemsInResturant[i].menuId.name;
           menuObj.item = new Array();
           menus[itemsInResturant[i].menuId._id] = menuObj;
         }
           let itemobj = new menuItem();
           itemobj.idmenu = itemsInResturant[i].menuId._id;
           itemobj.itemID = itemsInResturant[i]._id;
           itemobj.Description = itemsInResturant[i].description;
           itemobj.itemImage = itemsInResturant[i].image;
           itemobj.itemName = itemsInResturant[i].name;
           itemobj.itemPrice = itemsInResturant[i].price; 
           itemobj.completeItem = itemsInResturant[i];
           menus[itemsInResturant[i].menuId._id].item.push(itemobj);
       }
       let keys = Object.keys(menus);
       this.menuToDisplay = new Array();
       for(let i = 0; i < keys.length;i++){
         menus[keys[i]].uiId = i+1;
         this.menuToDisplay.push(menus[keys[i]]);
       }
       console.log(this.menuToDisplay,"Added");
   
     })
     
  }
}
