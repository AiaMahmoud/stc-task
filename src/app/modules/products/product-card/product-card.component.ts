import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'src/app/core/services/alertify.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ChangeLanguageService } from 'src/app/core/services/change-language.service';

import { ProductCardModalComponent } from '../procuct-card-modal/procuct-card-modal.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],

})
export class ProductsCardComponent implements OnInit {
  @Input() product: any
  starRating:number=0;
  gfg =5;
  constructor(
    private dialog: MatDialog,
    public languageService: ChangeLanguageService,
  ) { 
  }
  allowCheckBox: boolean = false;
  donotHaveAccess: boolean = false;
  selectedValue:any;
  stars=[1 ,2,3,4,5]
  countStar(star:any) {
    this.selectedValue = star;
    console.log('Value of star', star);
}
  ngOnInit() {
 
  }
  addToCart(){
    this.product.selected = !this.product.selected;
  }
  openProduct(){
    var options ={
      width: '70%',
      height: '90%',
      position:{},
      backdropClass: 'backdropBackground',
      data: this.product
    };
    let lang =localStorage.getItem('lang');

    if(lang =='ar'){
      options.position ={ left: '15%', top: '30px' };
    }else{
      options.position ={ right: '15%', top: '30px'};
    }
  
      const dialogRef = this.dialog.open(ProductCardModalComponent,options)
  }
  noDataMessageOn: boolean = false;
}


